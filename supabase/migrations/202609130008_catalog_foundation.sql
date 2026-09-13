create table if not exists public.catalog_pillars (
  id uuid primary key default gen_random_uuid(),
  code text not null unique
    constraint catalog_pillars_code_valid check (code in ('BUILD', 'AUTOMATE', 'OPERATE', 'GROW')),
  name text not null,
  description text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.catalog_services (
  id uuid primary key default gen_random_uuid(),
  pillar_id uuid not null references public.catalog_pillars(id) on delete restrict,
  code text not null unique
    constraint catalog_services_code_valid check (code ~ '^[A-Z0-9]+(?:_[A-Z0-9]+)*$'),
  name text not null
    constraint catalog_services_name_not_blank check (length(btrim(name)) between 1 and 160),
  description text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.service_offerings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.catalog_services(id) on delete restrict,
  version integer not null default 1
    constraint service_offerings_version_positive check (version > 0),
  name text not null
    constraint service_offerings_name_not_blank check (length(btrim(name)) between 1 and 160),
  description text not null,
  scope_template jsonb not null default '{}'::jsonb
    constraint service_offerings_scope_template_object check (jsonb_typeof(scope_template) = 'object'),
  billing_mode text not null
    constraint service_offerings_billing_mode_valid check (billing_mode in ('ONE_TIME', 'RECURRING', 'ONE_TIME_AND_RECURRING')),
  is_active boolean not null default true,
  display_order integer not null default 0,
  effective_from timestamptz not null default timezone('utc', now()),
  effective_until timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint service_offerings_version_unique unique (service_id, version),
  constraint service_offerings_effective_window_valid check (effective_until is null or effective_until > effective_from)
);

create table if not exists public.project_services (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  offering_id uuid not null references public.service_offerings(id) on delete restrict,
  status text not null default 'REQUESTED'
    constraint project_services_status_valid check (status in ('REQUESTED', 'QUOTED', 'APPROVED', 'PAYMENT_PENDING', 'ACTIVE', 'PAUSED', 'CANCELLED', 'COMPLETED')),
  requested_scope jsonb not null default '{}'::jsonb
    constraint project_services_requested_scope_object check (jsonb_typeof(requested_scope) = 'object'),
  scope_snapshot jsonb not null default '{}'::jsonb
    constraint project_services_scope_snapshot_object check (jsonb_typeof(scope_snapshot) = 'object'),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint project_services_project_offering_unique unique (project_id, offering_id)
);

create index if not exists catalog_services_pillar_id_idx
  on public.catalog_services (pillar_id);
create index if not exists catalog_services_active_idx
  on public.catalog_services (is_active);
create index if not exists service_offerings_service_id_idx
  on public.service_offerings (service_id);
create index if not exists service_offerings_active_order_idx
  on public.service_offerings (is_active, display_order);
create index if not exists project_services_project_id_idx
  on public.project_services (project_id);
create index if not exists project_services_offering_id_idx
  on public.project_services (offering_id);
create index if not exists project_services_project_status_idx
  on public.project_services (project_id, status);

alter table public.audit_events
  add column if not exists project_service_id uuid references public.project_services(id) on delete set null;

alter table public.audit_events
  drop constraint if exists audit_events_event_type_valid;

alter table public.audit_events
  add constraint audit_events_event_type_valid check (event_type in (
    'membership_created',
    'membership_activated',
    'membership_role_changed',
    'membership_suspended',
    'membership_removed',
    'invitation_created',
    'invitation_accepted',
    'invitation_revoked',
    'invitation_expired',
    'project_created',
    'project_updated',
    'project_archived',
    'project_membership_created',
    'project_membership_activated',
    'project_membership_role_changed',
    'project_membership_suspended',
    'project_membership_removed',
    'project_service_requested',
    'project_service_updated'
  ));

create index if not exists audit_events_project_service_created_at_idx
  on public.audit_events (project_service_id, created_at);

create or replace function public.set_catalog_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger set_catalog_pillars_updated_at
before update on public.catalog_pillars
for each row execute procedure public.set_catalog_updated_at();

create trigger set_catalog_services_updated_at
before update on public.catalog_services
for each row execute procedure public.set_catalog_updated_at();

create trigger set_service_offerings_updated_at
before update on public.service_offerings
for each row execute procedure public.set_catalog_updated_at();

create trigger set_project_services_updated_at
before update on public.project_services
for each row execute procedure public.set_catalog_updated_at();

create or replace function private.record_project_service_audit()
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

  insert into public.audit_events (
    event_type,
    actor_user_id,
    organization_id,
    project_id,
    project_service_id,
    previous_status,
    new_status,
    metadata
  )
  values (
    case when tg_op = 'INSERT' then 'project_service_requested' else 'project_service_updated' end,
    (select auth.uid()),
    organization_id_value,
    new.project_id,
    new.id,
    case when tg_op = 'INSERT' then null else old.status end,
    new.status,
    jsonb_build_object('offering_id', new.offering_id)
  );

  return new;
end;
$$;

create trigger record_project_service_audit
after insert or update on public.project_services
for each row execute procedure private.record_project_service_audit();

create or replace function public.select_project_service(
  p_project_id uuid,
  p_offering_id uuid,
  p_requested_scope jsonb default '{}'::jsonb
)
returns public.project_services
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  selected_service public.project_services;
  project_organization_id uuid;
  offering_is_active boolean;
  service_is_active boolean;
  pillar_is_active boolean;
  actor_organization_role text;
  actor_project_role text;
begin
  select project.organization_id into project_organization_id
  from public.projects as project
  where project.id = p_project_id
    and project.status <> 'ARCHIVED';

  if project_organization_id is null then
    raise exception using errcode = 'P0002', message = 'Project was not found or is archived.';
  end if;

  actor_organization_role := private.current_active_organization_role(project_organization_id);
  actor_project_role := private.current_active_project_role(p_project_id);
  if actor_organization_role not in ('OWNER', 'ADMIN') and actor_project_role <> 'PROJECT_MANAGER' then
    raise exception using errcode = '42501', message = 'Only organization admins or project managers can select project services.';
  end if;

  select offering.is_active,
         service.is_active,
         pillar.is_active
    into offering_is_active, service_is_active, pillar_is_active
  from public.service_offerings as offering
  join public.catalog_services as service on service.id = offering.service_id
  join public.catalog_pillars as pillar on pillar.id = service.pillar_id
  where offering.id = p_offering_id
    and offering.effective_from <= timezone('utc', now())
    and (offering.effective_until is null or offering.effective_until > timezone('utc', now()));

  if not found or not offering_is_active or not service_is_active or not pillar_is_active then
    raise exception using errcode = '22023', message = 'The selected service offering is not active.';
  end if;

  insert into public.project_services (
    project_id,
    offering_id,
    status,
    requested_scope,
    scope_snapshot,
    created_by
  )
  values (
    p_project_id,
    p_offering_id,
    'REQUESTED',
    coalesce(p_requested_scope, '{}'::jsonb),
    '{}'::jsonb,
    (select auth.uid())
  )
  returning * into selected_service;

  return selected_service;
end;
$$;

revoke all on function private.record_project_service_audit() from public;
revoke execute on function private.record_project_service_audit() from anon;
revoke all on function public.set_catalog_updated_at() from public;
revoke execute on function public.set_catalog_updated_at() from anon;
revoke execute on function public.set_catalog_updated_at() from authenticated;
revoke all on function public.select_project_service(uuid, uuid, jsonb) from public;
revoke execute on function public.select_project_service(uuid, uuid, jsonb) from anon;
grant execute on function public.select_project_service(uuid, uuid, jsonb) to authenticated;

insert into public.catalog_pillars (code, name, description)
values
  ('BUILD', 'BUILD', 'DevOps and cloud infrastructure foundations for Web3 projects.'),
  ('AUTOMATE', 'AUTOMATE', 'AI-assisted workflow automation with governed human checkpoints.'),
  ('OPERATE', 'OPERATE', 'Managed technical operations, releases, and reliability practices.'),
  ('GROW', 'GROW', 'Technical growth, content, community, and delivery feedback systems.')
on conflict (code) do nothing;

alter table public.catalog_pillars enable row level security;
alter table public.catalog_services enable row level security;
alter table public.service_offerings enable row level security;
alter table public.project_services enable row level security;

create policy "Authenticated users can view active catalog pillars"
on public.catalog_pillars for select
to authenticated
using (is_active);

create policy "Authenticated users can view active catalog services"
on public.catalog_services for select
to authenticated
using (is_active and exists (
  select 1 from public.catalog_pillars as pillar
  where pillar.id = pillar_id and pillar.is_active
));

create policy "Authenticated users can view active service offerings"
on public.service_offerings for select
to authenticated
using (
  is_active
  and effective_from <= timezone('utc', now())
  and (effective_until is null or effective_until > timezone('utc', now()))
  and exists (
    select 1
    from public.catalog_services as service
    join public.catalog_pillars as pillar on pillar.id = service.pillar_id
    where service.id = service_id and service.is_active and pillar.is_active
  )
);

create policy "Project members can view project services"
on public.project_services for select
to authenticated
using (private.has_project_access(project_id));

create policy "Catalog writes are disabled for clients"
on public.catalog_pillars for insert
to authenticated
with check (false);
create policy "Catalog updates are disabled for clients"
on public.catalog_pillars for update
to authenticated
using (false) with check (false);
create policy "Catalog deletes are disabled for clients"
on public.catalog_pillars for delete
to authenticated
using (false);

create policy "Service writes are disabled for clients"
on public.catalog_services for insert
to authenticated
with check (false);
create policy "Service updates are disabled for clients"
on public.catalog_services for update
to authenticated
using (false) with check (false);
create policy "Service deletes are disabled for clients"
on public.catalog_services for delete
to authenticated
using (false);

create policy "Offering writes are disabled for clients"
on public.service_offerings for insert
to authenticated
with check (false);
create policy "Offering updates are disabled for clients"
on public.service_offerings for update
to authenticated
using (false) with check (false);
create policy "Offering deletes are disabled for clients"
on public.service_offerings for delete
to authenticated
using (false);

create policy "Project service writes require the trusted function"
on public.project_services for insert
to authenticated
with check (false);
create policy "Project service updates require the trusted function"
on public.project_services for update
to authenticated
using (false) with check (false);
create policy "Project service deletes are disabled"
on public.project_services for delete
to authenticated
using (false);

comment on table public.catalog_pillars is
  'Fixed BlockWaveLab service pillars: BUILD, AUTOMATE, OPERATE, and GROW.';
comment on table public.catalog_services is
  'Catalog capabilities belonging to exactly one approved pillar. Client writes are disabled.';
comment on table public.service_offerings is
  'Selectable service variants. Billing mode describes future commercial shape and does not activate billing.';
comment on table public.project_services is
  'Project-to-offering selection. Selection is not proof of payment or entitlement.';
