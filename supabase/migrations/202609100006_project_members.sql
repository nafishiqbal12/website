create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  role text not null
    constraint project_members_role_valid check (role in ('PROJECT_MANAGER', 'CONTRIBUTOR', 'VIEWER')),
  status text not null
    constraint project_members_status_valid check (status in ('PENDING', 'ACTIVE', 'SUSPENDED', 'REMOVED')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint project_members_project_user_unique unique (project_id, user_id)
);

create index if not exists project_members_project_id_idx
  on public.project_members (project_id);
create index if not exists project_members_user_id_idx
  on public.project_members (user_id);
create index if not exists project_members_project_status_idx
  on public.project_members (project_id, status);
create index if not exists project_members_user_status_idx
  on public.project_members (user_id, status);

alter table public.audit_events
  add column if not exists project_membership_id uuid references public.project_members(id) on delete set null;

create index if not exists audit_events_project_membership_created_at_idx
  on public.audit_events (project_membership_id, created_at);

create or replace function private.current_active_project_role(p_project_id uuid)
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select member.role
  from public.project_members as member
  join public.projects as project on project.id = member.project_id
  where member.project_id = p_project_id
    and member.user_id = (select auth.uid())
    and member.status = 'ACTIVE'
    and project.status <> 'ARCHIVED'
    and private.current_active_organization_role(project.organization_id) is not null
  limit 1;
$$;

create or replace function private.has_project_access(p_project_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = private, public, pg_temp
as $$
declare
  project_organization_id uuid;
  organization_role text;
begin
  select organization_id into project_organization_id from public.projects where id = p_project_id;
  if project_organization_id is null then
    return false;
  end if;

  organization_role := private.current_active_organization_role(project_organization_id);
  if organization_role in ('OWNER', 'ADMIN') then
    return true;
  end if;

  return private.current_active_project_role(p_project_id) is not null;
end;
$$;

create or replace function private.has_project_role(
  p_project_id uuid,
  p_required_role text
)
returns boolean
language plpgsql
stable
security definer
set search_path = private, public, pg_temp
as $$
declare
  project_role text;
begin
  project_role := private.current_active_project_role(p_project_id);

  return case p_required_role
    when 'VIEWER' then project_role in ('VIEWER', 'CONTRIBUTOR', 'PROJECT_MANAGER')
    when 'CONTRIBUTOR' then project_role in ('CONTRIBUTOR', 'PROJECT_MANAGER')
    when 'PROJECT_MANAGER' then project_role = 'PROJECT_MANAGER'
    else false
  end;
end;
$$;

create or replace function private.record_project_membership_audit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  organization_id_value uuid;
begin
  select project.organization_id into organization_id_value
  from public.projects as project
  where project.id = new.project_id;

  if tg_op = 'INSERT' then
    insert into public.audit_events (
      event_type,
      actor_user_id,
      organization_id,
      project_id,
      project_membership_id,
      target_user_id,
      new_role,
      new_status
    )
    values (
      'project_membership_created',
      (select auth.uid()),
      organization_id_value,
      new.project_id,
      new.id,
      new.user_id,
      new.role,
      new.status
    );
  elsif tg_op = 'UPDATE' then
    if old.status is distinct from new.status then
      insert into public.audit_events (
        event_type,
        actor_user_id,
        organization_id,
        project_id,
        project_membership_id,
        target_user_id,
        previous_role,
        new_role,
        previous_status,
        new_status
      )
      values (
        case new.status
          when 'ACTIVE' then 'project_membership_activated'
          when 'SUSPENDED' then 'project_membership_suspended'
          when 'REMOVED' then 'project_membership_removed'
          else 'project_membership_created'
        end,
        (select auth.uid()),
        organization_id_value,
        new.project_id,
        new.id,
        new.user_id,
        old.role,
        new.role,
        old.status,
        new.status
      );
    end if;

    if old.role is distinct from new.role then
      insert into public.audit_events (
        event_type,
        actor_user_id,
        organization_id,
        project_id,
        project_membership_id,
        target_user_id,
        previous_role,
        new_role,
        previous_status,
        new_status
      )
      values (
        'project_membership_role_changed',
        (select auth.uid()),
        organization_id_value,
        new.project_id,
        new.id,
        new.user_id,
        old.role,
        new.role,
        old.status,
        new.status
      );
    end if;
  end if;

  return new;
end;
$$;

create trigger record_project_membership_audit
after insert or update on public.project_members
for each row execute procedure private.record_project_membership_audit();

create or replace function private.prevent_project_membership_mutation()
returns trigger
language plpgsql
security definer
set search_path = private, public, pg_temp
as $$
declare
  project_organization_id uuid;
  actor_organization_role text;
  actor_project_role text;
begin
  select organization_id into project_organization_id from public.projects where id = new.project_id;
  if project_organization_id is null then
    raise exception using errcode = '23503', message = 'Project was not found.';
  end if;

  if tg_op = 'INSERT' then
    if private.current_active_organization_role(project_organization_id) is null then
      raise exception using errcode = '42501', message = 'An active organization membership is required for project access.';
    end if;

    if not exists (
      select 1
      from public.organization_members
      where organization_id = project_organization_id
        and user_id = new.user_id
        and status = 'ACTIVE'
    ) then
      raise exception using errcode = '42501', message = 'Project users must have active organization membership.';
    end if;

    actor_organization_role := private.current_active_organization_role(project_organization_id);
    actor_project_role := private.current_active_project_role(new.project_id);
    if actor_organization_role not in ('OWNER', 'ADMIN')
      and actor_project_role <> 'PROJECT_MANAGER' then
      raise exception using errcode = '42501', message = 'Only organization admins or project managers can manage project membership.';
    end if;

    if actor_organization_role not in ('OWNER', 'ADMIN') and new.role = 'PROJECT_MANAGER' then
      raise exception using errcode = '42501', message = 'Project managers cannot grant project manager role.';
    end if;

    return new;
  end if;

  if old.id is distinct from new.id
    or old.project_id is distinct from new.project_id
    or old.user_id is distinct from new.user_id
    or old.created_at is distinct from new.created_at then
    raise exception using errcode = '42501', message = 'Project membership identity and creation fields cannot be changed.';
  end if;

  actor_organization_role := private.current_active_organization_role(project_organization_id);
  actor_project_role := private.current_active_project_role(old.project_id);
  if actor_organization_role not in ('OWNER', 'ADMIN') and actor_project_role <> 'PROJECT_MANAGER' then
    raise exception using errcode = '42501', message = 'Only organization admins or project managers can manage project membership.';
  end if;

  if actor_organization_role not in ('OWNER', 'ADMIN') and (old.role = 'PROJECT_MANAGER' or new.role = 'PROJECT_MANAGER') then
    raise exception using errcode = '42501', message = 'Project managers cannot change project manager assignments.';
  end if;

  return new;
end;
$$;

create trigger prevent_project_membership_mutation
before insert or update on public.project_members
for each row execute procedure private.prevent_project_membership_mutation();

create or replace function public.set_project_member_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger set_project_member_updated_at
before update on public.project_members
for each row execute procedure public.set_project_member_updated_at();

create or replace function public.add_project_member(
  p_project_id uuid,
  p_user_id uuid,
  p_role text
)
returns public.project_members
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  project_organization_id uuid;
  added_member public.project_members;
  actor_organization_role text;
  actor_project_role text;
begin
  if p_role not in ('PROJECT_MANAGER', 'CONTRIBUTOR', 'VIEWER') then
    raise exception using errcode = '22023', message = 'Invalid project membership role.';
  end if;

  select organization_id into project_organization_id from public.projects where id = p_project_id;
  if project_organization_id is null then
    raise exception using errcode = 'P0002', message = 'Project was not found.';
  end if;

  actor_organization_role := private.current_active_organization_role(project_organization_id);
  actor_project_role := private.current_active_project_role(p_project_id);
  if actor_organization_role not in ('OWNER', 'ADMIN') and actor_project_role <> 'PROJECT_MANAGER' then
    raise exception using errcode = '42501', message = 'Only organization admins or project managers can add project members.';
  end if;

  if actor_organization_role not in ('OWNER', 'ADMIN') and p_role = 'PROJECT_MANAGER' then
    raise exception using errcode = '42501', message = 'Project managers cannot grant project manager role.';
  end if;

  if not exists (
    select 1 from public.organization_members
    where organization_id = project_organization_id and user_id = p_user_id and status = 'ACTIVE'
  ) then
    raise exception using errcode = '42501', message = 'The project user must have active organization membership.';
  end if;

  insert into public.project_members (project_id, user_id, role, status)
  values (p_project_id, p_user_id, p_role, 'ACTIVE')
  returning * into added_member;

  return added_member;
end;
$$;

create or replace function public.update_project_membership(
  p_membership_id uuid,
  p_role text,
  p_status text
)
returns public.project_members
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_member public.project_members;
  updated_member public.project_members;
  project_organization_id uuid;
  actor_organization_role text;
  actor_project_role text;
begin
  if p_role not in ('PROJECT_MANAGER', 'CONTRIBUTOR', 'VIEWER') then
    raise exception using errcode = '22023', message = 'Invalid project membership role.';
  end if;
  if p_status not in ('PENDING', 'ACTIVE', 'SUSPENDED', 'REMOVED') then
    raise exception using errcode = '22023', message = 'Invalid project membership status.';
  end if;

  select * into target_member from public.project_members where id = p_membership_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Project membership was not found.';
  end if;

  select organization_id into project_organization_id from public.projects where id = target_member.project_id;
  actor_organization_role := private.current_active_organization_role(project_organization_id);
  actor_project_role := private.current_active_project_role(target_member.project_id);
  if actor_organization_role not in ('OWNER', 'ADMIN') and actor_project_role <> 'PROJECT_MANAGER' then
    raise exception using errcode = '42501', message = 'Only organization admins or project managers can update project membership.';
  end if;
  if actor_organization_role not in ('OWNER', 'ADMIN') and (target_member.role = 'PROJECT_MANAGER' or p_role = 'PROJECT_MANAGER') then
    raise exception using errcode = '42501', message = 'Project managers cannot change project manager assignments.';
  end if;

  update public.project_members
  set role = p_role,
      status = p_status
  where id = p_membership_id
  returning * into updated_member;

  return updated_member;
end;
$$;

create or replace function public.remove_project_member(p_membership_id uuid)
returns public.project_members
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_member public.project_members;
  removed_member public.project_members;
begin
  select * into target_member from public.project_members where id = p_membership_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Project membership was not found.';
  end if;

  if not private.has_organization_role((select organization_id from public.projects where id = target_member.project_id), 'ADMIN')
    and not private.has_project_role(target_member.project_id, 'PROJECT_MANAGER') then
    raise exception using errcode = '42501', message = 'Only organization admins or project managers can remove project members.';
  end if;

  update public.project_members
  set status = 'REMOVED'
  where id = p_membership_id
  returning * into removed_member;

  return removed_member;
end;
$$;

revoke all on function private.current_active_project_role(uuid) from public;
revoke all on function private.has_project_access(uuid) from public;
revoke all on function private.has_project_role(uuid, text) from public;
revoke all on function private.record_project_membership_audit() from public;
revoke all on function private.prevent_project_membership_mutation() from public;
revoke all on function public.set_project_member_updated_at() from public;
revoke all on function public.add_project_member(uuid, uuid, text) from public;
revoke all on function public.update_project_membership(uuid, text, text) from public;
revoke all on function public.remove_project_member(uuid) from public;
revoke execute on function private.current_active_project_role(uuid) from anon;
revoke execute on function private.has_project_access(uuid) from anon;
revoke execute on function private.has_project_role(uuid, text) from anon;
revoke execute on function private.record_project_membership_audit() from anon;
revoke execute on function private.prevent_project_membership_mutation() from anon;
revoke execute on function public.set_project_member_updated_at() from anon;
revoke execute on function public.add_project_member(uuid, uuid, text) from anon;
revoke execute on function public.update_project_membership(uuid, text, text) from anon;
revoke execute on function public.remove_project_member(uuid) from anon;
grant execute on function private.current_active_project_role(uuid) to authenticated;
grant execute on function private.has_project_access(uuid) to authenticated;
grant execute on function private.has_project_role(uuid, text) to authenticated;
grant execute on function public.add_project_member(uuid, uuid, text) to authenticated;
grant execute on function public.update_project_membership(uuid, text, text) to authenticated;
grant execute on function public.remove_project_member(uuid) to authenticated;

alter table public.project_members enable row level security;

drop policy if exists "Project members can view accessible project memberships" on public.project_members;
create policy "Project members can view accessible project memberships"
on public.project_members for select
to authenticated
using (private.has_project_access(project_id));

drop policy if exists "Project membership inserts require a trusted function" on public.project_members;
create policy "Project membership inserts require a trusted function"
on public.project_members for insert
to authenticated
with check (false);

drop policy if exists "Project membership updates require a trusted function" on public.project_members;
create policy "Project membership updates require a trusted function"
on public.project_members for update
to authenticated
using (false)
with check (false);

drop policy if exists "Project membership deletes are disabled" on public.project_members;
create policy "Project membership deletes are disabled"
on public.project_members for delete
to authenticated
using (false);

drop policy if exists "Active organization members can view projects" on public.projects;
create policy "Accessible project members can view projects"
on public.projects for select
to authenticated
using (private.has_project_access(id));

comment on table public.project_members is
  'Project-scoped membership. Active organization membership is required and project roles never elevate organization access.';
