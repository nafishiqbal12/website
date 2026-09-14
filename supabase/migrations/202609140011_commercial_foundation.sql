create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  project_id uuid references public.projects(id) on delete restrict,
  status text not null default 'DRAFT'
    constraint proposals_status_valid check (status in ('DRAFT', 'INTERNAL_REVIEW', 'SENT', 'VIEWED', 'CHANGES_REQUESTED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED')),
  created_by uuid not null references auth.users(id) on delete restrict,
  issued_at timestamptz,
  valid_until timestamptz,
  current_version_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.proposal_versions (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete restrict,
  version_number integer not null constraint proposal_versions_version_positive check (version_number > 0),
  supersedes_version_id uuid references public.proposal_versions(id) on delete restrict,
  status text not null default 'DRAFT'
    constraint proposal_versions_status_valid check (status in ('DRAFT', 'INTERNAL_REVIEW', 'SENT', 'VIEWED', 'CHANGES_REQUESTED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED')),
  scope_snapshot jsonb not null default '{}'::jsonb
    constraint proposal_versions_scope_snapshot_object check (jsonb_typeof(scope_snapshot) = 'object'),
  commercial_snapshot jsonb not null default '{}'::jsonb
    constraint proposal_versions_commercial_snapshot_object check (jsonb_typeof(commercial_snapshot) = 'object'),
  currency text not null default 'USD'
    constraint proposal_versions_currency_valid check (currency = 'USD'),
  content_checksum text not null
    constraint proposal_versions_content_checksum_valid check (length(content_checksum) between 8 and 128),
  issued_at timestamptz,
  valid_until timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  constraint proposal_versions_proposal_version_unique unique (proposal_id, version_number)
);

alter table public.proposals
  add constraint proposals_current_version_fk
  foreign key (current_version_id) references public.proposal_versions(id) on delete restrict;

create table if not exists public.proposal_items (
  id uuid primary key default gen_random_uuid(),
  proposal_version_id uuid not null references public.proposal_versions(id) on delete restrict,
  project_id uuid references public.projects(id) on delete restrict,
  project_service_id uuid references public.project_services(id) on delete restrict,
  offering_id uuid references public.service_offerings(id) on delete restrict,
  pillar_code text not null
    constraint proposal_items_pillar_code_valid check (pillar_code in ('BUILD', 'AUTOMATE', 'OPERATE', 'GROW')),
  service_code text not null
    constraint proposal_items_service_code_valid check (length(btrim(service_code)) between 1 and 160),
  service_name text not null
    constraint proposal_items_service_name_valid check (length(btrim(service_name)) between 1 and 160),
  offering_name text not null
    constraint proposal_items_offering_name_valid check (length(btrim(offering_name)) between 1 and 160),
  scope_snapshot jsonb not null default '{}'::jsonb
    constraint proposal_items_scope_snapshot_object check (jsonb_typeof(scope_snapshot) = 'object'),
  commercial_snapshot jsonb not null default '{}'::jsonb
    constraint proposal_items_commercial_snapshot_object check (jsonb_typeof(commercial_snapshot) = 'object'),
  quantity numeric,
  unit text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.agreements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  project_id uuid references public.projects(id) on delete restrict,
  proposal_id uuid references public.proposals(id) on delete restrict,
  source_proposal_version_id uuid references public.proposal_versions(id) on delete restrict,
  status text not null default 'DRAFT'
    constraint agreements_status_valid check (status in ('DRAFT', 'PENDING_ACCEPTANCE', 'ACTIVE', 'SUSPENDED', 'TERMINATED', 'EXPIRED')),
  created_by uuid not null references auth.users(id) on delete restrict,
  effective_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.agreement_versions (
  id uuid primary key default gen_random_uuid(),
  agreement_id uuid not null references public.agreements(id) on delete restrict,
  version_number integer not null constraint agreement_versions_version_positive check (version_number > 0),
  supersedes_version_id uuid references public.agreement_versions(id) on delete restrict,
  status text not null default 'DRAFT'
    constraint agreement_versions_status_valid check (status in ('DRAFT', 'PENDING_ACCEPTANCE', 'ACTIVE', 'SUSPENDED', 'TERMINATED', 'EXPIRED')),
  terms_snapshot jsonb not null default '{}'::jsonb
    constraint agreement_versions_terms_snapshot_object check (jsonb_typeof(terms_snapshot) = 'object'),
  content_checksum text not null
    constraint agreement_versions_content_checksum_valid check (length(content_checksum) between 8 and 128),
  effective_at timestamptz,
  expires_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  constraint agreement_versions_agreement_version_unique unique (agreement_id, version_number)
);

create table if not exists public.agreement_acceptances (
  id uuid primary key default gen_random_uuid(),
  agreement_id uuid not null references public.agreements(id) on delete restrict,
  agreement_version_id uuid not null references public.agreement_versions(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  accepting_user_id uuid not null references auth.users(id) on delete restrict,
  accepted_at timestamptz not null default timezone('utc', now()),
  accepted_version_number integer not null constraint agreement_acceptances_version_positive check (accepted_version_number > 0),
  content_checksum text not null
    constraint agreement_acceptances_checksum_valid check (length(content_checksum) between 8 and 128),
  idempotency_key text not null
    constraint agreement_acceptances_idempotency_key_valid check (length(btrim(idempotency_key)) between 8 and 128),
  created_at timestamptz not null default timezone('utc', now()),
  constraint agreement_acceptances_idempotency_unique unique (agreement_id, idempotency_key),
  constraint agreement_acceptances_one_version_unique unique (agreement_id, agreement_version_id)
);

create index if not exists proposals_organization_id_idx on public.proposals (organization_id);
create index if not exists proposals_project_id_idx on public.proposals (project_id);
create index if not exists proposals_status_idx on public.proposals (organization_id, status);
create index if not exists proposal_versions_proposal_id_idx on public.proposal_versions (proposal_id, version_number desc);
create index if not exists proposal_items_version_id_idx on public.proposal_items (proposal_version_id, sort_order);
create index if not exists proposal_items_project_service_id_idx on public.proposal_items (project_service_id);
create index if not exists agreements_organization_id_idx on public.agreements (organization_id);
create index if not exists agreements_project_id_idx on public.agreements (project_id);
create index if not exists agreements_status_idx on public.agreements (organization_id, status);
create index if not exists agreement_versions_agreement_id_idx on public.agreement_versions (agreement_id, version_number desc);
create index if not exists agreement_acceptances_organization_id_idx on public.agreement_acceptances (organization_id, accepted_at desc);

alter table public.audit_events
  add column if not exists proposal_id uuid references public.proposals(id) on delete set null,
  add column if not exists proposal_version_id uuid references public.proposal_versions(id) on delete set null,
  add column if not exists agreement_id uuid references public.agreements(id) on delete set null,
  add column if not exists agreement_version_id uuid references public.agreement_versions(id) on delete set null;

alter table public.audit_events drop constraint if exists audit_events_event_type_valid;
alter table public.audit_events add constraint audit_events_event_type_valid check (event_type in (
  'membership_created', 'membership_activated', 'membership_role_changed', 'membership_suspended', 'membership_removed',
  'invitation_created', 'invitation_accepted', 'invitation_revoked', 'invitation_expired',
  'project_created', 'project_updated', 'project_archived',
  'project_membership_created', 'project_membership_activated', 'project_membership_role_changed', 'project_membership_suspended', 'project_membership_removed',
  'project_service_requested', 'project_service_updated',
  'proposal_created', 'proposal_version_created', 'proposal_issued', 'proposal_accepted', 'proposal_rejected', 'proposal_cancelled',
  'agreement_created', 'agreement_version_created', 'agreement_accepted', 'agreement_activated', 'agreement_terminated'
));

create index if not exists audit_events_proposal_created_at_idx on public.audit_events (proposal_id, created_at);
create index if not exists audit_events_proposal_version_created_at_idx on public.audit_events (proposal_version_id, created_at);
create index if not exists audit_events_agreement_created_at_idx on public.audit_events (agreement_id, created_at);
create index if not exists audit_events_agreement_version_created_at_idx on public.audit_events (agreement_version_id, created_at);

create or replace function public.set_commercial_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_proposals_updated_at on public.proposals;
create trigger set_proposals_updated_at before update on public.proposals for each row execute procedure public.set_commercial_updated_at();
drop trigger if exists set_agreements_updated_at on public.agreements;
create trigger set_agreements_updated_at before update on public.agreements for each row execute procedure public.set_commercial_updated_at();

create or replace function private.prevent_commercial_history_mutation()
returns trigger
language plpgsql
security definer
set search_path = private, public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    raise exception using errcode = '42501', message = 'Commercial history cannot be deleted.';
  end if;

  if tg_table_name = 'proposal_items' or tg_table_name = 'agreement_acceptances' then
    raise exception using errcode = '42501', message = 'Commercial history cannot be updated.';
  end if;

  if tg_table_name = 'proposal_versions' and old.status in ('SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED') then
    if old.scope_snapshot is distinct from new.scope_snapshot
      or old.commercial_snapshot is distinct from new.commercial_snapshot
      or old.currency is distinct from new.currency
      or old.content_checksum is distinct from new.content_checksum
      or old.version_number is distinct from new.version_number
      or old.proposal_id is distinct from new.proposal_id then
      raise exception using errcode = '42501', message = 'Issued proposal snapshots are immutable.';
    end if;
  end if;

  if tg_table_name = 'agreement_versions' and old.status in ('PENDING_ACCEPTANCE', 'ACTIVE', 'SUSPENDED', 'TERMINATED', 'EXPIRED') then
    if old.terms_snapshot is distinct from new.terms_snapshot
      or old.content_checksum is distinct from new.content_checksum
      or old.version_number is distinct from new.version_number
      or old.agreement_id is distinct from new.agreement_id then
      raise exception using errcode = '42501', message = 'Issued agreement snapshots are immutable.';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.prevent_commercial_history_mutation() from public;
revoke execute on function private.prevent_commercial_history_mutation() from anon;

drop trigger if exists prevent_proposal_item_mutation on public.proposal_items;
create trigger prevent_proposal_item_mutation before update or delete on public.proposal_items for each row execute procedure private.prevent_commercial_history_mutation();
drop trigger if exists prevent_proposal_version_mutation on public.proposal_versions;
create trigger prevent_proposal_version_mutation before update or delete on public.proposal_versions for each row execute procedure private.prevent_commercial_history_mutation();
drop trigger if exists prevent_agreement_version_mutation on public.agreement_versions;
create trigger prevent_agreement_version_mutation before update or delete on public.agreement_versions for each row execute procedure private.prevent_commercial_history_mutation();
drop trigger if exists prevent_agreement_acceptance_mutation on public.agreement_acceptances;
create trigger prevent_agreement_acceptance_mutation before update or delete on public.agreement_acceptances for each row execute procedure private.prevent_commercial_history_mutation();

create or replace function private.commercial_owner(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.organization_members member
    join public.organizations organization on organization.id = member.organization_id
    where member.organization_id = p_organization_id
      and member.user_id = (select auth.uid())
      and member.role = 'OWNER'
      and member.status = 'ACTIVE'
      and organization.status = 'ACTIVE'
  );
$$;

revoke all on function private.commercial_owner(uuid) from public;
revoke execute on function private.commercial_owner(uuid) from anon;
grant execute on function private.commercial_owner(uuid) to authenticated;

create or replace function private.record_commercial_audit(
  p_event_type text,
  p_organization_id uuid,
  p_project_id uuid,
  p_proposal_id uuid default null,
  p_proposal_version_id uuid default null,
  p_agreement_id uuid default null,
  p_agreement_version_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.audit_events (
    event_type, actor_user_id, organization_id, project_id, proposal_id, proposal_version_id,
    agreement_id, agreement_version_id, metadata
  ) values (
    p_event_type, (select auth.uid()), p_organization_id, p_project_id, p_proposal_id, p_proposal_version_id,
    p_agreement_id, p_agreement_version_id, coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

revoke all on function private.record_commercial_audit(text, uuid, uuid, uuid, uuid, uuid, uuid, jsonb) from public;
revoke execute on function private.record_commercial_audit(text, uuid, uuid, uuid, uuid, uuid, uuid, jsonb) from anon;

create or replace function public.create_proposal(
  p_organization_id uuid,
  p_project_id uuid default null,
  p_valid_until timestamptz default null
)
returns public.proposals
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  created_proposal public.proposals;
begin
  if not private.commercial_owner(p_organization_id) then
    raise exception using errcode = '42501', message = 'Only the organization owner can create commercial proposals.';
  end if;

  if p_project_id is not null and not exists (
    select 1 from public.projects where id = p_project_id and organization_id = p_organization_id and status <> 'ARCHIVED'
  ) then
    raise exception using errcode = 'P0002', message = 'Project was not found in this organization.';
  end if;

  if p_valid_until is not null and p_valid_until <= timezone('utc', now()) then
    raise exception using errcode = '22023', message = 'Proposal validity must be in the future.';
  end if;

  insert into public.proposals (organization_id, project_id, valid_until, created_by)
  values (p_organization_id, p_project_id, p_valid_until, (select auth.uid()))
  returning * into created_proposal;

  perform private.record_commercial_audit('proposal_created', p_organization_id, p_project_id, created_proposal.id);
  return created_proposal;
end;
$$;

create or replace function public.create_proposal_version(
  p_proposal_id uuid,
  p_scope_snapshot jsonb,
  p_commercial_snapshot jsonb,
  p_content_checksum text,
  p_items jsonb default '[]'::jsonb,
  p_valid_until timestamptz default null
)
returns public.proposal_versions
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_proposal public.proposals;
  created_version public.proposal_versions;
  item jsonb;
  item_project_id uuid;
  item_project_service_id uuid;
  item_offering_id uuid;
  source_pillar_code text;
  source_service_code text;
  source_service_name text;
  source_offering_name text;
  item_scope jsonb;
  item_commercial jsonb;
  item_quantity numeric;
  item_unit text;
  item_sort_order integer;
  next_version integer;
begin
  select * into target_proposal from public.proposals where id = p_proposal_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Proposal was not found.'; end if;
  if not private.commercial_owner(target_proposal.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can revise proposals.'; end if;
  if target_proposal.status not in ('DRAFT', 'CHANGES_REQUESTED', 'REJECTED', 'CANCELLED') then
    raise exception using errcode = '22023', message = 'A proposal version cannot be revised in its current state.';
  end if;
  if jsonb_typeof(coalesce(p_items, '[]'::jsonb)) <> 'array' then raise exception using errcode = '22023', message = 'Proposal items must be an array.'; end if;
  if p_valid_until is not null and p_valid_until <= timezone('utc', now()) then raise exception using errcode = '22023', message = 'Proposal validity must be in the future.'; end if;

  select coalesce(max(version_number), 0) + 1 into next_version from public.proposal_versions where proposal_id = p_proposal_id;
  insert into public.proposal_versions (
    proposal_id, version_number, supersedes_version_id, scope_snapshot, commercial_snapshot,
    content_checksum, valid_until, created_by
  ) values (
    p_proposal_id, next_version,
    (select id from public.proposal_versions where proposal_id = p_proposal_id order by version_number desc limit 1),
    coalesce(p_scope_snapshot, '{}'::jsonb), coalesce(p_commercial_snapshot, '{}'::jsonb),
    btrim(p_content_checksum), p_valid_until, (select auth.uid())
  ) returning * into created_version;

  for item in select value from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) loop
    item_project_service_id := nullif(item->>'project_service_id', '')::uuid;
    item_project_id := nullif(item->>'project_id', '')::uuid;
    item_offering_id := nullif(item->>'offering_id', '')::uuid;
    item_scope := case when jsonb_typeof(item->'scope_snapshot') = 'object' then item->'scope_snapshot' else '{}'::jsonb end;
    item_commercial := case when jsonb_typeof(item->'commercial_snapshot') = 'object' then item->'commercial_snapshot' else '{}'::jsonb end;
    item_quantity := nullif(item->>'quantity', '')::numeric;
    item_unit := nullif(btrim(item->>'unit'), '');
    item_sort_order := coalesce(nullif(item->>'sort_order', '')::integer, 0);

    if item_project_service_id is not null then
      select ps.project_id, ps.offering_id, pillar.code, service.code, service.name, offering.name
        into item_project_id, item_offering_id, source_pillar_code, source_service_code, source_service_name, source_offering_name
      from public.project_services ps
      join public.service_offerings offering on offering.id = ps.offering_id
      join public.catalog_services service on service.id = offering.service_id
      join public.catalog_pillars pillar on pillar.id = service.pillar_id
      join public.projects project on project.id = ps.project_id
      where ps.id = item_project_service_id and project.organization_id = target_proposal.organization_id;
      if not found then raise exception using errcode = 'P0002', message = 'A proposal item service is unavailable.'; end if;
    else
      source_pillar_code := upper(btrim(item->>'pillar_code'));
      source_service_code := btrim(item->>'service_code');
      source_service_name := btrim(item->>'service_name');
      source_offering_name := btrim(item->>'offering_name');
      if source_pillar_code not in ('BUILD', 'AUTOMATE', 'OPERATE', 'GROW')
        or source_service_code is null or source_service_name is null or source_offering_name is null then
        raise exception using errcode = '22023', message = 'Custom proposal items require an approved pillar and service snapshot.';
      end if;
      if item_project_id is not null and not exists (select 1 from public.projects where id = item_project_id and organization_id = target_proposal.organization_id) then
        raise exception using errcode = '42501', message = 'Proposal item project is outside the organization.';
      end if;
    end if;

    insert into public.proposal_items (
      proposal_version_id, project_id, project_service_id, offering_id, pillar_code, service_code,
      service_name, offering_name, scope_snapshot, commercial_snapshot, quantity, unit, sort_order
    ) values (
      created_version.id, item_project_id, item_project_service_id, item_offering_id, source_pillar_code,
      source_service_code, source_service_name, source_offering_name, item_scope, item_commercial,
      item_quantity, item_unit, item_sort_order
    );
  end loop;

  update public.proposals set current_version_id = created_version.id, valid_until = p_valid_until, status = 'DRAFT' where id = p_proposal_id;
  perform private.record_commercial_audit('proposal_version_created', target_proposal.organization_id, target_proposal.project_id, p_proposal_id, created_version.id);
  return created_version;
end;
$$;

create or replace function public.issue_proposal(p_proposal_id uuid, p_expected_version integer)
returns public.proposals
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_proposal public.proposals;
  target_version public.proposal_versions;
  updated_proposal public.proposals;
begin
  select * into target_proposal from public.proposals where id = p_proposal_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Proposal was not found.'; end if;
  if not private.commercial_owner(target_proposal.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can issue proposals.'; end if;
  select * into target_version from public.proposal_versions where id = target_proposal.current_version_id and proposal_id = p_proposal_id for update;
  if not found or target_version.version_number <> p_expected_version then raise exception using errcode = '40001', message = 'Proposal version changed. Refresh and retry.'; end if;
  if target_version.status <> 'DRAFT' or target_version.valid_until is not null and target_version.valid_until <= timezone('utc', now()) then raise exception using errcode = '22023', message = 'Only a valid draft proposal can be issued.'; end if;
  update public.proposal_versions set status = 'SENT', issued_at = timezone('utc', now()) where id = target_version.id;
  update public.proposals set status = 'SENT', issued_at = timezone('utc', now()) where id = p_proposal_id returning * into updated_proposal;
  perform private.record_commercial_audit('proposal_issued', target_proposal.organization_id, target_proposal.project_id, p_proposal_id, target_version.id);
  return updated_proposal;
end;
$$;

create or replace function public.accept_proposal(p_proposal_id uuid, p_expected_version integer)
returns public.proposals
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_proposal public.proposals;
  target_version public.proposal_versions;
  updated_proposal public.proposals;
begin
  select * into target_proposal from public.proposals where id = p_proposal_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Proposal was not found.'; end if;
  if not private.commercial_owner(target_proposal.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can accept proposals.'; end if;
  select * into target_version from public.proposal_versions where id = target_proposal.current_version_id and proposal_id = p_proposal_id for update;
  if not found or target_version.version_number <> p_expected_version then raise exception using errcode = '40001', message = 'Proposal version changed. Refresh and retry.'; end if;
  if target_version.status not in ('SENT', 'VIEWED') or target_version.valid_until is not null and target_version.valid_until <= timezone('utc', now()) then raise exception using errcode = '22023', message = 'Only a current issued proposal can be accepted.'; end if;
  update public.proposal_versions set status = 'ACCEPTED' where id = target_version.id;
  update public.proposals set status = 'ACCEPTED' where id = p_proposal_id returning * into updated_proposal;
  perform private.record_commercial_audit('proposal_accepted', target_proposal.organization_id, target_proposal.project_id, p_proposal_id, target_version.id);
  return updated_proposal;
end;
$$;

create or replace function public.create_agreement(
  p_organization_id uuid,
  p_project_id uuid default null,
  p_proposal_id uuid default null,
  p_source_proposal_version_id uuid default null,
  p_terms_snapshot jsonb default '{}'::jsonb,
  p_content_checksum text default 'pending-terms-review'
)
returns public.agreements
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  created_agreement public.agreements;
  source_version public.proposal_versions;
begin
  if not private.commercial_owner(p_organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can create agreements.'; end if;
  if p_project_id is not null and not exists (select 1 from public.projects where id = p_project_id and organization_id = p_organization_id and status <> 'ARCHIVED') then raise exception using errcode = 'P0002', message = 'Project was not found in this organization.'; end if;
  if p_source_proposal_version_id is not null then
    select version into source_version from public.proposal_versions where id = p_source_proposal_version_id and status = 'ACCEPTED';
    if not found then raise exception using errcode = '22023', message = 'Agreement source must be an accepted proposal version.'; end if;
  end if;
  insert into public.agreements (organization_id, project_id, proposal_id, source_proposal_version_id, created_by)
  values (p_organization_id, p_project_id, p_proposal_id, p_source_proposal_version_id, (select auth.uid()))
  returning * into created_agreement;
  perform private.record_commercial_audit('agreement_created', p_organization_id, p_project_id, null, null, created_agreement.id);
  return created_agreement;
end;
$$;

create or replace function public.create_agreement_version(
  p_agreement_id uuid,
  p_terms_snapshot jsonb,
  p_content_checksum text,
  p_effective_at timestamptz default null,
  p_expires_at timestamptz default null
)
returns public.agreement_versions
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_agreement public.agreements;
  created_version public.agreement_versions;
  next_version integer;
begin
  select * into target_agreement from public.agreements where id = p_agreement_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Agreement was not found.'; end if;
  if not private.commercial_owner(target_agreement.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can revise agreements.'; end if;
  if target_agreement.status not in ('DRAFT', 'TERMINATED', 'EXPIRED') then raise exception using errcode = '22023', message = 'An agreement cannot be revised in its current state.'; end if;
  select coalesce(max(version_number), 0) + 1 into next_version from public.agreement_versions where agreement_id = p_agreement_id;
  insert into public.agreement_versions (agreement_id, version_number, supersedes_version_id, terms_snapshot, content_checksum, effective_at, expires_at, created_by)
  values (p_agreement_id, next_version, (select id from public.agreement_versions where agreement_id = p_agreement_id order by version_number desc limit 1), coalesce(p_terms_snapshot, '{}'::jsonb), btrim(p_content_checksum), p_effective_at, p_expires_at, (select auth.uid()))
  returning * into created_version;
  perform private.record_commercial_audit('agreement_version_created', target_agreement.organization_id, target_agreement.project_id, null, null, p_agreement_id, created_version.id);
  return created_version;
end;
$$;

create or replace function public.accept_agreement(
  p_agreement_id uuid,
  p_agreement_version_id uuid,
  p_idempotency_key text
)
returns public.agreement_acceptances
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_agreement public.agreements;
  target_version public.agreement_versions;
  existing_acceptance public.agreement_acceptances;
  created_acceptance public.agreement_acceptances;
begin
  select * into target_agreement from public.agreements where id = p_agreement_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Agreement was not found.'; end if;
  if not private.commercial_owner(target_agreement.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can accept agreements.'; end if;
  select * into target_version from public.agreement_versions where id = p_agreement_version_id and agreement_id = p_agreement_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Agreement version was not found.'; end if;
  if target_version.status not in ('DRAFT', 'PENDING_ACCEPTANCE') then raise exception using errcode = '22023', message = 'Only a pending agreement version can be accepted.'; end if;
  select * into existing_acceptance from public.agreement_acceptances where agreement_id = p_agreement_id and idempotency_key = btrim(p_idempotency_key);
  if found then return existing_acceptance; end if;
  insert into public.agreement_acceptances (agreement_id, agreement_version_id, organization_id, accepting_user_id, accepted_version_number, content_checksum, idempotency_key)
  values (p_agreement_id, p_agreement_version_id, target_agreement.organization_id, (select auth.uid()), target_version.version_number, target_version.content_checksum, btrim(p_idempotency_key))
  returning * into created_acceptance;
  update public.agreement_versions set status = 'ACTIVE', effective_at = coalesce(effective_at, timezone('utc', now())) where id = p_agreement_version_id;
  update public.agreements set status = 'ACTIVE', effective_at = coalesce(effective_at, timezone('utc', now())) where id = p_agreement_id;
  perform private.record_commercial_audit('agreement_accepted', target_agreement.organization_id, target_agreement.project_id, null, null, p_agreement_id, p_agreement_version_id, jsonb_build_object('acceptance_id', created_acceptance.id));
  perform private.record_commercial_audit('agreement_activated', target_agreement.organization_id, target_agreement.project_id, null, null, p_agreement_id, p_agreement_version_id);
  return created_acceptance;
end;
$$;

revoke all on function public.create_proposal(uuid, uuid, timestamptz) from public;
revoke all on function public.create_proposal_version(uuid, jsonb, jsonb, text, jsonb, timestamptz) from public;
revoke all on function public.issue_proposal(uuid, integer) from public;
revoke all on function public.accept_proposal(uuid, integer) from public;
revoke all on function public.create_agreement(uuid, uuid, uuid, uuid, jsonb, text) from public;
revoke all on function public.create_agreement_version(uuid, jsonb, text, timestamptz, timestamptz) from public;
revoke all on function public.accept_agreement(uuid, uuid, text) from public;
revoke execute on function public.create_proposal(uuid, uuid, timestamptz) from anon;
revoke execute on function public.create_proposal_version(uuid, jsonb, jsonb, text, jsonb, timestamptz) from anon;
revoke execute on function public.issue_proposal(uuid, integer) from anon;
revoke execute on function public.accept_proposal(uuid, integer) from anon;
revoke execute on function public.create_agreement(uuid, uuid, uuid, uuid, jsonb, text) from anon;
revoke execute on function public.create_agreement_version(uuid, jsonb, text, timestamptz, timestamptz) from anon;
revoke execute on function public.accept_agreement(uuid, uuid, text) from anon;
grant execute on function public.create_proposal(uuid, uuid, timestamptz) to authenticated;
grant execute on function public.create_proposal_version(uuid, jsonb, jsonb, text, jsonb, timestamptz) to authenticated;
grant execute on function public.issue_proposal(uuid, integer) to authenticated;
grant execute on function public.accept_proposal(uuid, integer) to authenticated;
grant execute on function public.create_agreement(uuid, uuid, uuid, uuid, jsonb, text) to authenticated;
grant execute on function public.create_agreement_version(uuid, jsonb, text, timestamptz, timestamptz) to authenticated;
grant execute on function public.accept_agreement(uuid, uuid, text) to authenticated;

alter table public.proposals enable row level security;
alter table public.proposal_versions enable row level security;
alter table public.proposal_items enable row level security;
alter table public.agreements enable row level security;
alter table public.agreement_versions enable row level security;
alter table public.agreement_acceptances enable row level security;

create policy "Accessible members can view proposals" on public.proposals for select to authenticated using (
  private.has_organization_role(organization_id, 'MEMBER')
  and (project_id is null or private.has_project_access(project_id))
);
create policy "Accessible members can view proposal versions" on public.proposal_versions for select to authenticated using (
  exists (select 1 from public.proposals proposal where proposal.id = proposal_id and private.has_organization_role(proposal.organization_id, 'MEMBER') and (proposal.project_id is null or private.has_project_access(proposal.project_id)))
);
create policy "Accessible members can view proposal items" on public.proposal_items for select to authenticated using (
  exists (select 1 from public.proposal_versions version join public.proposals proposal on proposal.id = version.proposal_id where version.id = proposal_version_id and private.has_organization_role(proposal.organization_id, 'MEMBER') and (proposal.project_id is null or private.has_project_access(proposal.project_id)))
);
create policy "Accessible members can view agreements" on public.agreements for select to authenticated using (
  private.has_organization_role(organization_id, 'MEMBER')
  and (project_id is null or private.has_project_access(project_id))
);
create policy "Accessible members can view agreement versions" on public.agreement_versions for select to authenticated using (
  exists (select 1 from public.agreements agreement where agreement.id = agreement_id and private.has_organization_role(agreement.organization_id, 'MEMBER') and (agreement.project_id is null or private.has_project_access(agreement.project_id)))
);
create policy "Accessible members can view agreement acceptances" on public.agreement_acceptances for select to authenticated using (
  private.has_organization_role(organization_id, 'MEMBER')
  and exists (select 1 from public.agreements agreement where agreement.id = agreement_id and (agreement.project_id is null or private.has_project_access(agreement.project_id)))
);

create policy "Proposal writes require trusted functions" on public.proposals for insert to authenticated with check (false);
create policy "Proposal updates require trusted functions" on public.proposals for update to authenticated using (false) with check (false);
create policy "Proposal deletes are disabled" on public.proposals for delete to authenticated using (false);
create policy "Proposal version writes require trusted functions" on public.proposal_versions for insert to authenticated with check (false);
create policy "Proposal version updates require trusted functions" on public.proposal_versions for update to authenticated using (false) with check (false);
create policy "Proposal version deletes are disabled" on public.proposal_versions for delete to authenticated using (false);
create policy "Proposal item writes require trusted functions" on public.proposal_items for insert to authenticated with check (false);
create policy "Proposal item updates are disabled" on public.proposal_items for update to authenticated using (false) with check (false);
create policy "Proposal item deletes are disabled" on public.proposal_items for delete to authenticated using (false);
create policy "Agreement writes require trusted functions" on public.agreements for insert to authenticated with check (false);
create policy "Agreement updates require trusted functions" on public.agreements for update to authenticated using (false) with check (false);
create policy "Agreement deletes are disabled" on public.agreements for delete to authenticated using (false);
create policy "Agreement version writes require trusted functions" on public.agreement_versions for insert to authenticated with check (false);
create policy "Agreement version updates require trusted functions" on public.agreement_versions for update to authenticated using (false) with check (false);
create policy "Agreement version deletes are disabled" on public.agreement_versions for delete to authenticated using (false);
create policy "Agreement acceptance writes require trusted functions" on public.agreement_acceptances for insert to authenticated with check (false);
create policy "Agreement acceptance updates are disabled" on public.agreement_acceptances for update to authenticated using (false) with check (false);
create policy "Agreement acceptance deletes are disabled" on public.agreement_acceptances for delete to authenticated using (false);

revoke all on function public.set_commercial_updated_at() from public;
revoke execute on function public.set_commercial_updated_at() from anon;
revoke execute on function public.set_commercial_updated_at() from authenticated;

comment on table public.proposals is 'Commercial proposal negotiation aggregate. Acceptance does not activate payment, entitlement, or delivery.';
comment on table public.proposal_versions is 'Immutable client-facing commercial snapshots after issuance. Currency is USD; amounts are intentionally not defined here.';
comment on table public.proposal_items is 'Historical proposal item snapshots linked to catalog/project services where applicable.';
comment on table public.agreements is 'Separate commercial agreement aggregate. Acceptance is not payment or delivery activation.';
comment on table public.agreement_versions is 'Historical agreement terms snapshots with immutable accepted content.';
comment on table public.agreement_acceptances is 'Immutable authenticated in-platform acceptance records. No e-signature claim is made.';
