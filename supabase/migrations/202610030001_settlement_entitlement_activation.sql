alter table public.entitlements
  add column if not exists payment_settlement_id uuid references public.payment_settlements(id) on delete restrict;

create unique index if not exists entitlements_payment_settlement_unique
  on public.entitlements (organization_id, payment_settlement_id)
  where payment_settlement_id is not null;

create or replace function private.prevent_entitlement_settlement_link_mutation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.payment_settlement_id is distinct from new.payment_settlement_id then
    raise exception using errcode = '42501', message = 'Entitlement settlement source is immutable.';
  end if;
  return new;
end;
$$;

revoke all on function private.prevent_entitlement_settlement_link_mutation() from public;
revoke execute on function private.prevent_entitlement_settlement_link_mutation() from anon, authenticated;

drop trigger if exists prevent_entitlement_settlement_link_mutation on public.entitlements;
create trigger prevent_entitlement_settlement_link_mutation
before update on public.entitlements
for each row execute procedure private.prevent_entitlement_settlement_link_mutation();

create or replace function public.activate_entitlement_from_settlement(
  p_payment_settlement_id uuid,
  p_project_service_id uuid,
  p_activation_reference text,
  p_starts_at timestamptz,
  p_ends_at timestamptz default null,
  p_scope_snapshot jsonb default '{}'::jsonb,
  p_activation_context jsonb default '{}'::jsonb,
  p_idempotency_key text default null,
  p_actor_user_id uuid default null
)
returns public.entitlements
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  actor_role text;
  actor_id uuid;
  target_settlement public.payment_settlements;
  target_attempt public.payment_attempts;
  target_obligation public.payment_obligations;
  target_project_service public.project_services;
  target_proposal public.proposals;
  target_version public.proposal_versions;
  target_agreement public.agreements;
  target_agreement_version public.agreement_versions;
  existing_entitlement public.entitlements;
  normalized_reference text;
  normalized_key text;
  source_snapshot jsonb;
  created_entitlement public.entitlements;
begin
  actor_role := current_setting('role', true);
  actor_id := coalesce((select auth.uid()), p_actor_user_id);
  if actor_role is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'Only the trusted service role may activate entitlements from a verified payment settlement.';
  end if;
  if actor_id is null or not exists (select 1 from auth.users where id = actor_id) then
    raise exception using errcode = '42501', message = 'A valid trusted activation actor is required.';
  end if;

  if p_payment_settlement_id is null then
    raise exception using errcode = '22023', message = 'Payment settlement ID is required.';
  end if;

  select * into target_settlement
  from public.payment_settlements
  where id = p_payment_settlement_id
  for share;
  if not found then
    raise exception using errcode = 'P0002', message = 'Payment settlement was not found.';
  end if;

  select * into target_attempt
  from public.payment_attempts
  where id = target_settlement.payment_attempt_id
  for share;
  if not found then
    raise exception using errcode = 'P0002', message = 'Payment attempt for the settlement was not found.';
  end if;

  if target_attempt.organization_id is distinct from target_settlement.organization_id
    or target_attempt.id is distinct from target_settlement.payment_attempt_id
    or target_attempt.payment_obligation_id is distinct from target_settlement.payment_obligation_id then
    raise exception using errcode = '42501', message = 'Settlement attempt does not match the internal payment relation.';
  end if;

  select * into target_obligation
  from public.payment_obligations
  where id = target_settlement.payment_obligation_id
  for share;
  if not found then
    raise exception using errcode = 'P0002', message = 'Payment obligation for the settlement was not found.';
  end if;

  if target_obligation.organization_id is distinct from target_settlement.organization_id
    or target_obligation.id is distinct from target_attempt.payment_obligation_id
    or target_obligation.project_id is null
    or target_obligation.project_id is distinct from target_settlement.project_id
    or target_obligation.proposal_id is distinct from target_settlement.proposal_id
    or target_obligation.proposal_version_id is distinct from target_settlement.proposal_version_id
    or target_obligation.agreement_id is distinct from target_settlement.agreement_id
    or target_obligation.agreement_version_id is distinct from target_settlement.agreement_version_id
    or target_obligation.amount_minor is distinct from target_settlement.amount_minor
    or upper(target_obligation.currency) is distinct from upper(target_settlement.currency) then
    raise exception using errcode = '42501', message = 'Settlement does not match the internal obligation source, project, amount, currency, or organization.';
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
      and project.organization_id = target_settlement.organization_id
      and project.status <> 'ARCHIVED'
  ) then
    raise exception using errcode = '42501', message = 'Project service is outside the settlement organization.';
  end if;

  if target_project_service.project_id is distinct from target_obligation.project_id then
    raise exception using errcode = '42501', message = 'Project service does not match the obligation project.';
  end if;

  if target_project_service.project_id is distinct from target_settlement.project_id then
    raise exception using errcode = '42501', message = 'Project service does not match the settlement project.';
  end if;

  if target_obligation.status <> 'PENDING' then
    raise exception using errcode = '22023', message = 'Entitlement activation requires a pending payment obligation.';
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

  normalized_reference := btrim(coalesce(p_activation_reference, ''));
  normalized_key := btrim(coalesce(p_idempotency_key, 'settlement:' || target_settlement.id::text));
  if length(normalized_reference) < 8 or length(normalized_reference) > 256 then
    raise exception using errcode = '22023', message = 'Entitlement activation reference is invalid.';
  end if;
  if length(normalized_key) < 8 or length(normalized_key) > 128 then
    raise exception using errcode = '22023', message = 'Entitlement idempotency key is invalid.';
  end if;
  if p_starts_at is null or (p_ends_at is not null and p_ends_at <= p_starts_at) then
    raise exception using errcode = '22023', message = 'Entitlement date window is invalid.';
  end if;
  if jsonb_typeof(coalesce(p_scope_snapshot, '{}'::jsonb)) <> 'object'
    or jsonb_typeof(coalesce(p_activation_context, '{}'::jsonb)) <> 'object' then
    raise exception using errcode = '22023', message = 'Entitlement snapshots must be JSON objects.';
  end if;

  select * into existing_entitlement
  from public.entitlements
  where payment_settlement_id = target_settlement.id
  for update;
  if found then
    return existing_entitlement;
  end if;

  select * into existing_entitlement
  from public.entitlements
  where organization_id = target_settlement.organization_id
    and idempotency_key = normalized_key
  for update;
  if found then
    if existing_entitlement.payment_settlement_id is distinct from target_settlement.id
      or existing_entitlement.payment_obligation_id is distinct from target_obligation.id
      or existing_entitlement.project_service_id is distinct from target_project_service.id then
      raise exception using errcode = '23505', message = 'Entitlement idempotency key was already used for a different grant.';
    end if;
    return existing_entitlement;
  end if;

  source_snapshot := jsonb_build_object(
    'payment_settlement_id', target_settlement.id,
    'payment_attempt_id', target_attempt.id,
    'payment_obligation_id', target_obligation.id,
    'proposal_id', target_obligation.proposal_id,
    'proposal_version_id', target_obligation.proposal_version_id,
    'agreement_id', target_obligation.agreement_id,
    'agreement_version_id', target_obligation.agreement_version_id,
    'project_id', target_project_service.project_id,
    'project_service_id', target_project_service.id,
    'provider', target_settlement.provider,
    'provider_event_id', target_settlement.provider_event_id,
    'activation_reference', normalized_reference,
    'activation_context', coalesce(p_activation_context, '{}'::jsonb),
    'payment_obligation_snapshot', target_obligation.commercial_snapshot
  );

  insert into public.entitlements (
    organization_id,
    project_id,
    project_service_id,
    payment_obligation_id,
    payment_settlement_id,
    proposal_id,
    proposal_version_id,
    agreement_id,
    agreement_version_id,
    source_type,
    status,
    starts_at,
    ends_at,
    scope_snapshot,
    source_snapshot,
    activation_reference,
    idempotency_key,
    created_by
  ) values (
    target_settlement.organization_id,
    target_project_service.project_id,
    target_project_service.id,
    target_obligation.id,
    target_settlement.id,
    target_obligation.proposal_id,
    target_obligation.proposal_version_id,
    target_obligation.agreement_id,
    target_obligation.agreement_version_id,
    'VERIFIED_COMMERCIAL_EVENT',
    'ACTIVE',
    p_starts_at,
    p_ends_at,
    coalesce(p_scope_snapshot, '{}'::jsonb),
    source_snapshot,
    normalized_reference,
    normalized_key,
    actor_id
  ) returning * into created_entitlement;

  perform private.record_entitlement_audit(
    'entitlement_activated',
    created_entitlement.organization_id,
    created_entitlement.project_id,
    created_entitlement.id,
    created_entitlement.payment_obligation_id,
    jsonb_build_object(
      'payment_settlement_id', created_entitlement.payment_settlement_id,
      'project_service_id', created_entitlement.project_service_id,
      'activation_reference', created_entitlement.activation_reference
    )
  );

  return created_entitlement;
end;
$$;

revoke all on function public.activate_entitlement_from_settlement(uuid, uuid, text, timestamptz, timestamptz, jsonb, jsonb, text, uuid) from public;
revoke execute on function public.activate_entitlement_from_settlement(uuid, uuid, text, timestamptz, timestamptz, jsonb, jsonb, text, uuid) from anon, authenticated;
grant execute on function public.activate_entitlement_from_settlement(uuid, uuid, text, timestamptz, timestamptz, jsonb, jsonb, text, uuid) to service_role;
