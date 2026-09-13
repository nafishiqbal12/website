create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null
    constraint projects_name_not_blank check (length(btrim(name)) between 1 and 200),
  slug text not null
    constraint projects_slug_valid check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  status text not null default 'ACTIVE'
    constraint projects_status_valid check (status in ('ACTIVE', 'PAUSED', 'ARCHIVED')),
  delivery_stage text not null default 'DRAFT'
    constraint projects_delivery_stage_valid check (delivery_stage in (
      'DRAFT',
      'ONBOARDING',
      'SCOPING',
      'IMPLEMENTATION',
      'DEPLOYMENT',
      'OBSERVATION',
      'STABILIZATION',
      'DOCUMENTATION',
      'HANDOVER',
      'ONGOING_SERVICE',
      'PAUSED',
      'COMPLETED',
      'CANCELLED',
      'ARCHIVED'
    )),
  created_by uuid not null references auth.users(id) on delete restrict,
  metadata jsonb not null default '{}'::jsonb
    constraint projects_metadata_object check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint projects_organization_slug_unique unique (organization_id, slug)
);

create index if not exists projects_organization_id_idx
  on public.projects (organization_id);
create index if not exists projects_organization_status_idx
  on public.projects (organization_id, status);
create index if not exists projects_created_by_idx
  on public.projects (created_by);

alter table public.audit_events
  add column if not exists project_id uuid references public.projects(id) on delete set null;

create index if not exists audit_events_project_created_at_idx
  on public.audit_events (project_id, created_at);

create or replace function private.record_project_audit()
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
      project_id,
      new_status,
      metadata
    )
    values (
      'project_created',
      (select auth.uid()),
      new.organization_id,
      new.id,
      new.status,
      jsonb_build_object('delivery_stage', new.delivery_stage)
    );
  elsif tg_op = 'UPDATE' then
    insert into public.audit_events (
      event_type,
      actor_user_id,
      organization_id,
      project_id,
      previous_status,
      new_status,
      metadata
    )
    values (
      case when new.status = 'ARCHIVED' then 'project_archived' else 'project_updated' end,
      (select auth.uid()),
      new.organization_id,
      new.id,
      old.status,
      new.status,
      jsonb_build_object(
        'previous_delivery_stage', old.delivery_stage,
        'delivery_stage', new.delivery_stage
      )
    );
  end if;

  return new;
end;
$$;

create trigger record_project_audit
after insert or update on public.projects
for each row execute procedure private.record_project_audit();

create or replace function public.set_project_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger set_project_updated_at
before update on public.projects
for each row execute procedure public.set_project_updated_at();

create or replace function public.create_project(
  p_organization_id uuid,
  p_name text,
  p_slug text,
  p_description text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns public.projects
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  created_project public.projects;
  current_user_id uuid;
begin
  current_user_id := (select auth.uid());
  if current_user_id is null then
    raise exception using errcode = '42501', message = 'An authenticated user is required to create a project.';
  end if;

  if not private.has_organization_role(p_organization_id, 'ADMIN') then
    raise exception using errcode = '42501', message = 'Only an active organization owner or admin can create projects.';
  end if;

  insert into public.projects (organization_id, name, slug, description, created_by, metadata)
  values (p_organization_id, p_name, lower(btrim(p_slug)), p_description, current_user_id, coalesce(p_metadata, '{}'::jsonb))
  returning * into created_project;

  return created_project;
end;
$$;

create or replace function public.update_project(
  p_project_id uuid,
  p_name text,
  p_description text,
  p_metadata jsonb
)
returns public.projects
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_project public.projects;
  updated_project public.projects;
begin
  select * into target_project from public.projects where id = p_project_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Project was not found.';
  end if;

  if not private.has_organization_role(target_project.organization_id, 'ADMIN') then
    raise exception using errcode = '42501', message = 'Only an active organization owner or admin can update projects.';
  end if;

  if target_project.status = 'ARCHIVED' then
    raise exception using errcode = '22023', message = 'Archived projects cannot be updated.';
  end if;

  update public.projects
  set name = p_name,
      description = p_description,
      metadata = coalesce(p_metadata, '{}'::jsonb)
  where id = p_project_id
  returning * into updated_project;

  return updated_project;
end;
$$;

create or replace function public.archive_project(p_project_id uuid)
returns public.projects
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_project public.projects;
  archived_project public.projects;
begin
  select * into target_project from public.projects where id = p_project_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Project was not found.';
  end if;

  if not private.has_organization_role(target_project.organization_id, 'ADMIN') then
    raise exception using errcode = '42501', message = 'Only an active organization owner or admin can archive projects.';
  end if;

  update public.projects
  set status = 'ARCHIVED',
      delivery_stage = 'ARCHIVED'
  where id = p_project_id
  returning * into archived_project;

  return archived_project;
end;
$$;

revoke all on function private.record_project_audit() from public;
revoke execute on function private.record_project_audit() from anon;
revoke all on function public.set_project_updated_at() from public;
revoke execute on function public.set_project_updated_at() from anon;
revoke all on function public.create_project(uuid, text, text, text, jsonb) from public;
revoke execute on function public.create_project(uuid, text, text, text, jsonb) from anon;
revoke all on function public.update_project(uuid, text, text, jsonb) from public;
revoke execute on function public.update_project(uuid, text, text, jsonb) from anon;
revoke all on function public.archive_project(uuid) from public;
revoke execute on function public.archive_project(uuid) from anon;
grant execute on function public.create_project(uuid, text, text, text, jsonb) to authenticated;
grant execute on function public.update_project(uuid, text, text, jsonb) to authenticated;
grant execute on function public.archive_project(uuid) to authenticated;

alter table public.projects enable row level security;

drop policy if exists "Active organization members can view projects" on public.projects;
create policy "Active organization members can view projects"
on public.projects for select
to authenticated
using (private.has_organization_role(organization_id, 'MEMBER'));

drop policy if exists "Project writes require trusted lifecycle functions" on public.projects;
create policy "Project writes require trusted lifecycle functions"
on public.projects for insert
to authenticated
with check (false);

create policy "Project updates require trusted lifecycle functions"
on public.projects for update
to authenticated
using (false)
with check (false);

drop policy if exists "Project deletes are disabled" on public.projects;
create policy "Project deletes are disabled"
on public.projects for delete
to authenticated
using (false);

comment on table public.projects is
  'Organization-owned project foundation. Project membership authorization is completed in the next forward migration.';
