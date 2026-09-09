create schema if not exists private;

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  role text not null
    constraint organization_members_role_valid check (role in ('OWNER', 'ADMIN', 'MEMBER')),
  status text not null
    constraint organization_members_status_valid check (status in ('PENDING', 'ACTIVE', 'SUSPENDED', 'REMOVED')),
  invited_by uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint organization_members_organization_user_unique unique (organization_id, user_id)
);

create index if not exists organization_members_organization_id_idx
  on public.organization_members (organization_id);
create index if not exists organization_members_user_id_idx
  on public.organization_members (user_id);
create index if not exists organization_members_organization_status_idx
  on public.organization_members (organization_id, status);
create unique index if not exists organization_members_one_active_owner_idx
  on public.organization_members (organization_id)
  where role = 'OWNER' and status = 'ACTIVE';

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null
    constraint audit_events_event_type_valid check (event_type in (
      'membership_created',
      'membership_activated',
      'membership_role_changed',
      'membership_suspended',
      'membership_removed'
    )),
  actor_user_id uuid references auth.users(id) on delete set null,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  membership_id uuid references public.organization_members(id) on delete set null,
  target_user_id uuid references auth.users(id) on delete set null,
  previous_role text,
  new_role text,
  previous_status text,
  new_status text,
  metadata jsonb not null default '{}'::jsonb
    constraint audit_events_metadata_object check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists audit_events_organization_created_at_idx
  on public.audit_events (organization_id, created_at);
create index if not exists audit_events_membership_created_at_idx
  on public.audit_events (membership_id, created_at);

create or replace function private.current_active_organization_role(p_organization_id uuid)
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select member.role
  from public.organization_members as member
  join public.organizations as organization
    on organization.id = member.organization_id
  where member.organization_id = p_organization_id
    and member.user_id = (select auth.uid())
    and member.status = 'ACTIVE'
    and organization.status = 'ACTIVE'
  limit 1;
$$;

create or replace function private.has_organization_role(
  p_organization_id uuid,
  p_required_role text
)
returns boolean
language plpgsql
stable
security definer
set search_path = private, public, pg_temp
as $$
declare
  actor_role text;
begin
  actor_role := private.current_active_organization_role(p_organization_id);

  return case p_required_role
    when 'MEMBER' then actor_role in ('MEMBER', 'ADMIN', 'OWNER')
    when 'ADMIN' then actor_role in ('ADMIN', 'OWNER')
    when 'OWNER' then actor_role = 'OWNER'
    else false
  end;
end;
$$;

revoke all on schema private from public;
grant usage on schema private to authenticated;
revoke all on function private.current_active_organization_role(uuid) from public;
revoke all on function private.has_organization_role(uuid, text) from public;
grant execute on function private.current_active_organization_role(uuid) to authenticated;
grant execute on function private.has_organization_role(uuid, text) to authenticated;

create or replace function private.record_membership_audit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_events (
      event_type,
      actor_user_id,
      organization_id,
      membership_id,
      target_user_id,
      new_role,
      new_status
    )
    values (
      'membership_created',
      (select auth.uid()),
      new.organization_id,
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
        membership_id,
        target_user_id,
        previous_role,
        new_role,
        previous_status,
        new_status
      )
      values (
        case new.status
          when 'ACTIVE' then 'membership_activated'
          when 'SUSPENDED' then 'membership_suspended'
          when 'REMOVED' then 'membership_removed'
          else 'membership_created'
        end,
        (select auth.uid()),
        new.organization_id,
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
        membership_id,
        target_user_id,
        previous_role,
        new_role,
        previous_status,
        new_status
      )
      values (
        'membership_role_changed',
        (select auth.uid()),
        new.organization_id,
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

create trigger record_membership_audit
after insert or update on public.organization_members
for each row execute procedure private.record_membership_audit();

create or replace function private.prevent_membership_mutation()
returns trigger
language plpgsql
security definer
set search_path = private, public, pg_temp
as $$
declare
  organization_owner_id uuid;
  actor_role text;
begin
  select organization.owner_id
    into organization_owner_id
  from public.organizations as organization
  where organization.id = new.organization_id;

  if tg_op = 'INSERT' then
    if new.role = 'OWNER' then
      if new.status <> 'ACTIVE'
        or new.user_id is distinct from organization_owner_id
        or exists (
          select 1
          from public.organization_members as member
          where member.organization_id = new.organization_id
            and member.role = 'OWNER'
            and member.status = 'ACTIVE'
        ) then
        raise exception using
          errcode = '42501',
          message = 'Organization ownership must remain with the existing owner.';
      end if;
    end if;

    return new;
  end if;

  if old.id is distinct from new.id
    or old.organization_id is distinct from new.organization_id
    or old.user_id is distinct from new.user_id
    or old.created_at is distinct from new.created_at then
    raise exception using
      errcode = '42501',
      message = 'Membership identity and creation fields cannot be changed.';
  end if;

  if old.role = 'OWNER'
    and old.status = 'ACTIVE'
    and (old.role is distinct from new.role or old.status is distinct from new.status) then
    raise exception using
      errcode = '42501',
      message = 'The active organization owner cannot be changed in Phase 13.2.';
  end if;

  if new.role = 'OWNER'
    and (new.user_id is distinct from organization_owner_id or new.status <> 'ACTIVE') then
    raise exception using
      errcode = '42501',
      message = 'Ownership transfer is outside Phase 13.2.';
  end if;

  actor_role := private.current_active_organization_role(old.organization_id);
  if actor_role not in ('OWNER', 'ADMIN') then
    raise exception using
      errcode = '42501',
      message = 'Only an active organization owner or admin can change membership.';
  end if;

  if actor_role = 'ADMIN' and new.role = 'OWNER' then
    raise exception using
      errcode = '42501',
      message = 'An organization admin cannot grant owner role.';
  end if;

  return new;
end;
$$;

create trigger prevent_membership_mutation
before insert or update on public.organization_members
for each row execute procedure private.prevent_membership_mutation();

create or replace function private.prevent_active_owner_removal()
returns trigger
language plpgsql
security definer
set search_path = private, public, pg_temp
as $$
begin
  if old.role = 'OWNER' and old.status = 'ACTIVE' then
    raise exception using
      errcode = '42501',
      message = 'The last active organization owner cannot be removed or suspended.';
  end if;

  return old;
end;
$$;

create trigger prevent_active_owner_removal
before delete on public.organization_members
for each row execute procedure private.prevent_active_owner_removal();

create or replace function public.set_organization_member_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

revoke execute on function public.set_organization_member_updated_at() from public;

create trigger set_organization_member_updated_at
before update on public.organization_members
for each row execute procedure public.set_organization_member_updated_at();

insert into public.organization_members (
  organization_id,
  user_id,
  role,
  status,
  accepted_at
)
select
  organization.id,
  organization.owner_id,
  'OWNER',
  'ACTIVE',
  timezone('utc', now())
from public.organizations as organization
where not exists (
  select 1
  from public.organization_members as member
  where member.organization_id = organization.id
    and member.user_id = organization.owner_id
);

do $$
begin
  if exists (
    select 1
    from public.organizations as organization
    where not exists (
      select 1
      from public.organization_members as member
      where member.organization_id = organization.id
        and member.user_id = organization.owner_id
        and member.role = 'OWNER'
        and member.status = 'ACTIVE'
    )
  ) then
    raise exception 'Every organization must have exactly one active owner membership.';
  end if;
end;
$$;

create or replace function public.create_organization(p_name text)
returns public.organizations
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  created_organization public.organizations;
  current_user_id uuid;
begin
  current_user_id := (select auth.uid());
  if current_user_id is null then
    raise exception using
      errcode = '42501',
      message = 'An authenticated user is required to create an organization.';
  end if;

  insert into public.organizations (name, owner_id)
  values (p_name, current_user_id)
  returning * into created_organization;

  insert into public.organization_members (
    organization_id,
    user_id,
    role,
    status,
    accepted_at
  )
  values (
    created_organization.id,
    current_user_id,
    'OWNER',
    'ACTIVE',
    timezone('utc', now())
  );

  return created_organization;
end;
$$;

revoke all on function public.create_organization(text) from public;
grant execute on function public.create_organization(text) to authenticated;

create or replace function public.update_organization_membership(
  p_membership_id uuid,
  p_role text,
  p_status text
)
returns public.organization_members
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_membership public.organization_members;
  updated_membership public.organization_members;
begin
  if p_role = 'OWNER' then
    raise exception using
      errcode = '42501',
      message = 'Ownership transfer is outside Phase 13.2.';
  end if;

  if p_role not in ('ADMIN', 'MEMBER') then
    raise exception using
      errcode = '22023',
      message = 'Invalid organization membership role.';
  end if;

  if p_status not in ('PENDING', 'ACTIVE', 'SUSPENDED', 'REMOVED') then
    raise exception using
      errcode = '22023',
      message = 'Invalid organization membership status.';
  end if;

  select member.*
    into target_membership
  from public.organization_members as member
  where member.id = p_membership_id
  for update;

  if not found then
    raise exception using
      errcode = 'P0002',
      message = 'Organization membership was not found.';
  end if;

  if not private.has_organization_role(target_membership.organization_id, 'ADMIN') then
    raise exception using
      errcode = '42501',
      message = 'Only an active organization owner or admin can change membership.';
  end if;

  if target_membership.role = 'OWNER'
    or p_role = 'OWNER' then
    raise exception using
      errcode = '42501',
      message = 'Ownership transfer is outside Phase 13.2.';
  end if;

  update public.organization_members
  set role = p_role,
      status = p_status,
      accepted_at = case
        when p_status = 'ACTIVE' then coalesce(target_membership.accepted_at, timezone('utc', now()))
        else accepted_at
      end
  where id = p_membership_id
  returning * into updated_membership;

  return updated_membership;
end;
$$;

revoke all on function public.update_organization_membership(uuid, text, text) from public;
grant execute on function public.update_organization_membership(uuid, text, text) to authenticated;

alter table public.organization_members enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists "Organization members can view organization memberships" on public.organization_members;
create policy "Organization members can view organization memberships"
on public.organization_members for select
to authenticated
using (private.has_organization_role(organization_id, 'MEMBER'));

drop policy if exists "Membership inserts require a trusted lifecycle function" on public.organization_members;
create policy "Membership inserts require a trusted lifecycle function"
on public.organization_members for insert
to authenticated
with check (false);

drop policy if exists "Membership updates require a trusted lifecycle function" on public.organization_members;
create policy "Membership updates require a trusted lifecycle function"
on public.organization_members for update
to authenticated
using (false)
with check (false);

drop policy if exists "Membership deletes are disabled" on public.organization_members;
create policy "Membership deletes are disabled"
on public.organization_members for delete
to authenticated
using (false);

drop policy if exists "Audit events are not client readable" on public.audit_events;
create policy "Audit events are not client readable"
on public.audit_events for select
to authenticated
using (false);

drop policy if exists "Audit events are not client insertable" on public.audit_events;
create policy "Audit events are not client insertable"
on public.audit_events for insert
to authenticated
with check (false);

drop policy if exists "Audit events are not client editable" on public.audit_events;
create policy "Audit events are not client editable"
on public.audit_events for update
to authenticated
using (false)
with check (false);

drop policy if exists "Audit events are not client deletable" on public.audit_events;
create policy "Audit events are not client deletable"
on public.audit_events for delete
to authenticated
using (false);

drop policy if exists "Organization owners can view their organizations" on public.organizations;
drop policy if exists "Authenticated users can create self-owned organizations" on public.organizations;
drop policy if exists "Organization owners can update permitted fields" on public.organizations;

create policy "Active organization members can view organizations"
on public.organizations for select
to authenticated
using (private.has_organization_role(id, 'MEMBER'));

create policy "Organization creation requires the trusted function"
on public.organizations for insert
to authenticated
with check (false);

create policy "Active organization owners and admins can update organizations"
on public.organizations for update
to authenticated
using (private.has_organization_role(id, 'ADMIN'))
with check (private.has_organization_role(id, 'ADMIN'));

comment on table public.organization_members is
  'Phase 13.2 organization membership foundation. Invitations and project membership are deferred.';
comment on table public.audit_events is
  'Append-only membership lifecycle audit foundation. Client reads and writes are denied.';
comment on column public.organizations.owner_id is
  'Compatibility ownership anchor. Phase 13.2 ownership transfer is out of scope.';
