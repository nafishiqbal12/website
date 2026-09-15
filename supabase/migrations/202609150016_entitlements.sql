create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  project_id uuid not null references public.projects(id) on delete restrict,
  project_service_id uuid not null references public.project_services(id) on delete restrict,
  payment_obligation_id uuid not null references public.payment_obligations(id) on delete restrict,
  proposal_id uuid not null references public.proposals(id) on delete restrict,
  proposal_version_id uuid not null references public.proposal_versions(id) on delete restrict,
  agreement_id uuid references public.agreements(id) on delete restrict,
  agreement_version_id uuid references public.agreement_versions(id) on delete restrict,
  source_type text not null
    constraint entitlements_source_type_valid check (source_type = 'VERIFIED_COMMERCIAL_EVENT'),
  status text not null default 'ACTIVE'
    constraint entitlements_status_valid check (status in ('PENDING', 'ACTIVE', 'PAUSED', 'EXPIRED', 'CANCELLED')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  scope_snapshot jsonb not null default '{}'::jsonb
    constraint entitlements_scope_snapshot_object check (jsonb_typeof(scope_snapshot) = 'object'),
  source_snapshot jsonb not null
    constraint entitlements_source_snapshot_object check (jsonb_typeof(source_snapshot) = 'object'),
  activation_reference text not null
    constraint entitlements_activation_reference_valid check (length(btrim(activation_reference)) between 8 and 256),
  status_reason text,
  idempotency_key text not null
    constraint entitlements_idempotency_key_valid check (length(btrim(idempotency_key)) between 8 and 128),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint entitlements_date_window_valid check (ends_at is null or ends_at > starts_at),
  constraint entitlements_idempotency_unique unique (organization_id, idempotency_key)
);

create index if not exists entitlements_organization_created_at_idx
  on public.entitlements (organization_id, created_at desc);
create index if not exists entitlements_project_status_idx
  on public.entitlements (project_id, status, created_at desc);
create index if not exists entitlements_project_service_idx
  on public.entitlements (project_service_id, created_at desc);
create index if not exists entitlements_payment_obligation_idx
  on public.entitlements (payment_obligation_id, created_at desc);
create index if not exists entitlements_proposal_version_idx
  on public.entitlements (proposal_version_id, created_at desc);

alter table public.audit_events
  add column if not exists entitlement_id uuid references public.entitlements(id) on delete set null;

alter table public.audit_events drop constraint if exists audit_events_event_type_valid;
alter table public.audit_events add constraint audit_events_event_type_valid check (event_type in (
  'membership_created', 'membership_activated', 'membership_role_changed', 'membership_suspended', 'membership_removed',
  'invitation_created', 'invitation_accepted', 'invitation_revoked', 'invitation_expired',
  'project_created', 'project_updated', 'project_archived',
  'project_membership_created', 'project_membership_activated', 'project_membership_role_changed', 'project_membership_suspended', 'project_membership_removed',
  'project_service_requested', 'project_service_updated',
  'proposal_created', 'proposal_version_created', 'proposal_issued', 'proposal_accepted', 'proposal_rejected', 'proposal_cancelled',
  'agreement_created', 'agreement_version_created', 'agreement_accepted', 'agreement_activated', 'agreement_terminated',
  'payment_obligation_created', 'payment_obligation_cancelled', 'payment_obligation_expired',
  'payment_attempt_created', 'payment_attempt_transitioned',
  'entitlement_activated', 'entitlement_paused', 'entitlement_resumed', 'entitlement_expired', 'entitlement_cancelled'
));

create index if not exists audit_events_entitlement_created_at_idx
  on public.audit_events (entitlement_id, created_at);

create or replace function public.set_entitlement_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_entitlements_updated_at on public.entitlements;
create trigger set_entitlements_updated_at
before update on public.entitlements
for each row execute procedure public.set_entitlement_updated_at();

create or replace function private.record_entitlement_audit(
  p_event_type text,
  p_organization_id uuid,
  p_project_id uuid,
  p_entitlement_id uuid,
  p_payment_obligation_id uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.audit_events (
    event_type,
    actor_user_id,
    organization_id,
    project_id,
    entitlement_id,
    payment_obligation_id,
    metadata
  ) values (
    p_event_type,
    (select auth.uid()),
    p_organization_id,
    p_project_id,
    p_entitlement_id,
    p_payment_obligation_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

revoke all on function private.record_entitlement_audit(text, uuid, uuid, uuid, uuid, jsonb) from public;
revoke execute on function private.record_entitlement_audit(text, uuid, uuid, uuid, uuid, jsonb) from anon;

create or replace function public.activate_entitlement(
  p_payment_obligation_id uuid,
  p_project_service_id uuid,
  p_activation_reference text,
  p_starts_at timestamptz,
  p_ends_at timestamptz default null,
  p_idempotency_key text default null,
  p_scope_snapshot jsonb default '{}'::jsonb,
  p_activation_context jsonb default '{}'::jsonb
)
returns public.entitlements
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_obligation public.payment_obligations;
  target_project_service public.project_services;
  target_proposal public.proposals;
  target_version public.proposal_versions;
  target_agreement public.agreements;
  target_agreement_version public.agreement_versions;
  existing_entitlement public.entitlements;
  created_entitlement public.entitlements;
  normalized_reference text;
  normalized_key text;
  source_snapshot jsonb;
begin
  if (select auth.uid()) is null then
    raise exception using errcode = '42501', message = 'An authenticated server actor is required.';
  end if;
  normalized_reference := btrim(coalesce(p_activation_reference, ''));
  normalized_key := btrim(coalesce(p_idempotency_key, ''));
  if length(normalized_reference) < 8 or length(normalized_reference) > 256 then
    raise exception using errcode = '22023', message = 'Entitlement activation reference is invalid.';
  end if;
  if length(normalized_key) < 8 or length(normalized_key) > 128 then
    raise exception using errcode = '22023', message = 'Entitlement idempotency key is invalid.';
  end if;
  if p_starts_at is null or p_ends_at is not null and p_ends_at <= p_starts_at then
    raise exception using errcode = '22023', message = 'Entitlement date window is invalid.';
  end if;
  if jsonb_typeof(coalesce(p_scope_snapshot, '{}'::jsonb)) <> 'object'
    or jsonb_typeof(coalesce(p_activation_context, '{}'::jsonb)) <> 'object' then
    raise exception using errcode = '22023', message = 'Entitlement snapshots must be JSON objects.';
  end if;

  select * into target_obligation
  from public.payment_obligations
  where id = p_payment_obligation_id
  for share;
  if not found then
    raise exception using errcode = 'P0002', message = 'Payment obligation was not found.';
  end if;
  if target_obligation.status <> 'PENDING' then
    raise exception using errcode = '22023', message = 'Entitlement activation requires a non-cancelled, non-expired payment obligation.';
  end if;

  select * into target_project_service
  from public.project_services
  where id = p_project_service_id
  for share;
  if not found then
    raise exception using errcode = 'P0002', message = 'Project service was not found.';
  end if;
  if not exists (
    select 1 from public.projects project
    where project.id = target_project_service.project_id
      and project.organization_id = target_obligation.organization_id
      and project.status <> 'ARCHIVED'
  ) then
    raise exception using errcode = '42501', message = 'Project service is outside the payment obligation organization.';
  end if;
  if target_obligation.project_id is distinct from target_project_service.project_id then
    raise exception using errcode = '42501', message = 'Project service does not match the payment obligation project.';
  end if;

  select * into target_proposal
  from public.proposals
  where id = target_obligation.proposal_id
    and organization_id = target_obligation.organization_id
  for share;
  if not found then
    raise exception using errcode = '42501', message = 'Entitlement proposal source is outside the organization.';
  end if;
  select * into target_version
  from public.proposal_versions
  where id = target_obligation.proposal_version_id
    and proposal_id = target_proposal.id
    and status = 'ACCEPTED'
    and target_proposal.current_version_id = id
  for share;
  if not found then
    raise exception using errcode = '22023', message = 'Entitlement proposal source must be the accepted current version.';
  end if;
  if not exists (
    select 1 from public.proposal_items item
    where item.proposal_version_id = target_version.id
      and item.project_service_id = target_project_service.id
  ) then
    raise exception using errcode = '42501', message = 'Project service is not included in the entitlement proposal scope.';
  end if;

  if target_obligation.agreement_id is not null then
    select * into target_agreement
    from public.agreements
    where id = target_obligation.agreement_id
      and organization_id = target_obligation.organization_id
    for share;
    if not found then
      raise exception using errcode = '42501', message = 'Entitlement agreement source is outside the organization.';
    end if;
    select * into target_agreement_version
    from public.agreement_versions
    where id = target_obligation.agreement_version_id
      and agreement_id = target_agreement.id
      and status = 'ACTIVE'
    for share;
    if not found or not exists (
      select 1 from public.agreement_acceptances acceptance
      where acceptance.agreement_id = target_agreement.id
        and acceptance.agreement_version_id = target_agreement_version.id
    ) then
      raise exception using errcode = '22023', message = 'Entitlement agreement source must be the accepted active version.';
    end if;
  end if;

  select * into existing_entitlement
  from public.entitlements
  where organization_id = target_obligation.organization_id
    and idempotency_key = normalized_key
  for update;
  if found then
    if existing_entitlement.payment_obligation_id is distinct from target_obligation.id
      or existing_entitlement.project_service_id is distinct from target_project_service.id
      or existing_entitlement.activation_reference is distinct from normalized_reference then
      raise exception using errcode = '23505', message = 'Entitlement idempotency key was already used for a different grant.';
    end if;
    return existing_entitlement;
  end if;

  source_snapshot := jsonb_build_object(
    'payment_obligation_id', target_obligation.id,
    'proposal_id', target_obligation.proposal_id,
    'proposal_version_id', target_obligation.proposal_version_id,
    'agreement_id', target_obligation.agreement_id,
    'agreement_version_id', target_obligation.agreement_version_id,
    'project_id', target_project_service.project_id,
    'project_service_id', target_project_service.id,
    'activation_reference', normalized_reference,
    'activation_context', coalesce(p_activation_context, '{}'::jsonb),
    'payment_obligation_snapshot', target_obligation.commercial_snapshot
  );

  insert into public.entitlements (
    organization_id, project_id, project_service_id, payment_obligation_id,
    proposal_id, proposal_version_id, agreement_id, agreement_version_id,
    source_type, status, starts_at, ends_at, scope_snapshot, source_snapshot,
    activation_reference, idempotency_key, created_by
  ) values (
    target_obligation.organization_id, target_project_service.project_id, target_project_service.id, target_obligation.id,
    target_obligation.proposal_id, target_obligation.proposal_version_id, target_obligation.agreement_id, target_obligation.agreement_version_id,
    'VERIFIED_COMMERCIAL_EVENT', 'ACTIVE', p_starts_at, p_ends_at, coalesce(p_scope_snapshot, '{}'::jsonb), source_snapshot,
    normalized_reference, normalized_key, (select auth.uid())
  ) returning * into created_entitlement;

  perform private.record_entitlement_audit(
    'entitlement_activated',
    created_entitlement.organization_id,
    created_entitlement.project_id,
    created_entitlement.id,
    created_entitlement.payment_obligation_id,
    jsonb_build_object('activation_reference', created_entitlement.activation_reference)
  );
  return created_entitlement;
end;
$$;

create or replace function public.pause_entitlement(
  p_entitlement_id uuid,
  p_expected_status text default 'ACTIVE',
  p_status_reason text default null
)
returns public.entitlements
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_entitlement public.entitlements;
  changed_entitlement public.entitlements;
begin
  select * into target_entitlement from public.entitlements where id = p_entitlement_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Entitlement was not found.'; end if;
  if not private.commercial_owner(target_entitlement.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can pause entitlements.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target_entitlement.status then raise exception using errcode = '40001', message = 'Entitlement state changed. Refresh and retry.'; end if;
  if target_entitlement.status <> 'ACTIVE' then raise exception using errcode = '22023', message = 'Only active entitlements can be paused.'; end if;
  update public.entitlements set status = 'PAUSED', status_reason = nullif(btrim(p_status_reason), '') where id = target_entitlement.id returning * into changed_entitlement;
  perform private.record_entitlement_audit('entitlement_paused', changed_entitlement.organization_id, changed_entitlement.project_id, changed_entitlement.id, changed_entitlement.payment_obligation_id, jsonb_build_object('previous_status', target_entitlement.status, 'status_reason', changed_entitlement.status_reason));
  return changed_entitlement;
end;
$$;

create or replace function public.resume_entitlement(
  p_entitlement_id uuid,
  p_expected_status text default 'PAUSED',
  p_status_reason text default null
)
returns public.entitlements
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_entitlement public.entitlements;
  changed_entitlement public.entitlements;
begin
  select * into target_entitlement from public.entitlements where id = p_entitlement_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Entitlement was not found.'; end if;
  if not private.commercial_owner(target_entitlement.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can resume entitlements.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target_entitlement.status then raise exception using errcode = '40001', message = 'Entitlement state changed. Refresh and retry.'; end if;
  if target_entitlement.status <> 'PAUSED' then raise exception using errcode = '22023', message = 'Only paused entitlements can be resumed.'; end if;
  if target_entitlement.ends_at is not null and target_entitlement.ends_at <= timezone('utc', now()) then raise exception using errcode = '22023', message = 'Expired entitlements cannot be resumed.'; end if;
  update public.entitlements set status = 'ACTIVE', status_reason = nullif(btrim(p_status_reason), '') where id = target_entitlement.id returning * into changed_entitlement;
  perform private.record_entitlement_audit('entitlement_resumed', changed_entitlement.organization_id, changed_entitlement.project_id, changed_entitlement.id, changed_entitlement.payment_obligation_id, jsonb_build_object('previous_status', target_entitlement.status, 'status_reason', changed_entitlement.status_reason));
  return changed_entitlement;
end;
$$;

create or replace function public.expire_entitlement(
  p_entitlement_id uuid,
  p_expected_status text default 'ACTIVE',
  p_status_reason text default null
)
returns public.entitlements
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_entitlement public.entitlements;
  changed_entitlement public.entitlements;
begin
  select * into target_entitlement from public.entitlements where id = p_entitlement_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Entitlement was not found.'; end if;
  if not private.commercial_owner(target_entitlement.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can expire entitlements.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target_entitlement.status then raise exception using errcode = '40001', message = 'Entitlement state changed. Refresh and retry.'; end if;
  if target_entitlement.status not in ('ACTIVE', 'PAUSED') then raise exception using errcode = '22023', message = 'Only active or paused entitlements can be expired.'; end if;
  if target_entitlement.ends_at is null or target_entitlement.ends_at > timezone('utc', now()) then raise exception using errcode = '22023', message = 'Entitlement has not reached its end time.'; end if;
  update public.entitlements set status = 'EXPIRED', status_reason = nullif(btrim(p_status_reason), '') where id = target_entitlement.id returning * into changed_entitlement;
  perform private.record_entitlement_audit('entitlement_expired', changed_entitlement.organization_id, changed_entitlement.project_id, changed_entitlement.id, changed_entitlement.payment_obligation_id, jsonb_build_object('previous_status', target_entitlement.status, 'status_reason', changed_entitlement.status_reason));
  return changed_entitlement;
end;
$$;

create or replace function public.cancel_entitlement(
  p_entitlement_id uuid,
  p_expected_status text default 'PENDING',
  p_status_reason text default null
)
returns public.entitlements
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_entitlement public.entitlements;
  changed_entitlement public.entitlements;
begin
  select * into target_entitlement from public.entitlements where id = p_entitlement_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Entitlement was not found.'; end if;
  if not private.commercial_owner(target_entitlement.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can cancel entitlements.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target_entitlement.status then raise exception using errcode = '40001', message = 'Entitlement state changed. Refresh and retry.'; end if;
  if target_entitlement.status not in ('PENDING', 'ACTIVE', 'PAUSED') then raise exception using errcode = '22023', message = 'This entitlement cannot be cancelled in its current state.'; end if;
  update public.entitlements set status = 'CANCELLED', status_reason = nullif(btrim(p_status_reason), '') where id = target_entitlement.id returning * into changed_entitlement;
  perform private.record_entitlement_audit('entitlement_cancelled', changed_entitlement.organization_id, changed_entitlement.project_id, changed_entitlement.id, changed_entitlement.payment_obligation_id, jsonb_build_object('previous_status', target_entitlement.status, 'status_reason', changed_entitlement.status_reason));
  return changed_entitlement;
end;
$$;

create or replace function private.prevent_entitlement_mutation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    raise exception using errcode = '42501', message = 'Entitlement history cannot be deleted.';
  end if;
  if old.id is distinct from new.id
    or old.organization_id is distinct from new.organization_id
    or old.project_id is distinct from new.project_id
    or old.project_service_id is distinct from new.project_service_id
    or old.payment_obligation_id is distinct from new.payment_obligation_id
    or old.proposal_id is distinct from new.proposal_id
    or old.proposal_version_id is distinct from new.proposal_version_id
    or old.agreement_id is distinct from new.agreement_id
    or old.agreement_version_id is distinct from new.agreement_version_id
    or old.source_type is distinct from new.source_type
    or old.starts_at is distinct from new.starts_at
    or old.ends_at is distinct from new.ends_at
    or old.scope_snapshot is distinct from new.scope_snapshot
    or old.source_snapshot is distinct from new.source_snapshot
    or old.activation_reference is distinct from new.activation_reference
    or old.idempotency_key is distinct from new.idempotency_key
    or old.created_by is distinct from new.created_by
    or old.created_at is distinct from new.created_at then
    raise exception using errcode = '42501', message = 'Entitlement source and grant fields are immutable.';
  end if;
  if new.status is distinct from old.status
    and not (
      (old.status = 'ACTIVE' and new.status in ('PAUSED', 'EXPIRED', 'CANCELLED'))
      or (old.status = 'PAUSED' and new.status in ('ACTIVE', 'EXPIRED', 'CANCELLED'))
      or (old.status = 'PENDING' and new.status in ('ACTIVE', 'CANCELLED'))
    ) then
    raise exception using errcode = '22023', message = 'Entitlement lifecycle transition is not allowed.';
  end if;
  return new;
end;
$$;

revoke all on function private.prevent_entitlement_mutation() from public;
revoke execute on function private.prevent_entitlement_mutation() from anon;

drop trigger if exists prevent_entitlement_mutation on public.entitlements;
create trigger prevent_entitlement_mutation
before update or delete on public.entitlements
for each row execute procedure private.prevent_entitlement_mutation();

revoke all on function public.activate_entitlement(uuid, uuid, text, timestamptz, timestamptz, text, jsonb, jsonb) from public;
revoke all on function public.pause_entitlement(uuid, text, text) from public;
revoke all on function public.resume_entitlement(uuid, text, text) from public;
revoke all on function public.expire_entitlement(uuid, text, text) from public;
revoke all on function public.cancel_entitlement(uuid, text, text) from public;
revoke execute on function public.activate_entitlement(uuid, uuid, text, timestamptz, timestamptz, text, jsonb, jsonb) from anon, authenticated;
revoke execute on function public.pause_entitlement(uuid, text, text) from anon;
revoke execute on function public.resume_entitlement(uuid, text, text) from anon;
revoke execute on function public.expire_entitlement(uuid, text, text) from anon;
revoke execute on function public.cancel_entitlement(uuid, text, text) from anon;
grant execute on function public.activate_entitlement(uuid, uuid, text, timestamptz, timestamptz, text, jsonb, jsonb) to service_role;
grant execute on function public.pause_entitlement(uuid, text, text) to authenticated;
grant execute on function public.resume_entitlement(uuid, text, text) to authenticated;
grant execute on function public.expire_entitlement(uuid, text, text) to authenticated;
grant execute on function public.cancel_entitlement(uuid, text, text) to authenticated;

alter table public.entitlements enable row level security;

create policy "Accessible members can view entitlements"
on public.entitlements
for select to authenticated
using (
  private.has_organization_role(organization_id, 'MEMBER')
  and private.has_project_access(project_id)
);

create policy "Entitlement inserts require trusted functions"
on public.entitlements
for insert to authenticated
with check (false);

create policy "Entitlement updates require trusted functions"
on public.entitlements
for update to authenticated
using (false)
with check (false);

create policy "Entitlement deletes are disabled"
on public.entitlements
for delete to authenticated
using (false);

comment on table public.entitlements is
  'Provider-neutral authorization to receive a scoped project service after a future verified commercial event. Entitlement does not activate delivery.';

comment on function public.activate_entitlement(uuid, uuid, text, timestamptz, timestamptz, text, jsonb, jsonb) is
  'Service-role-only entitlement activation boundary for a future verified commercial event. Payment attempts do not call this function.';