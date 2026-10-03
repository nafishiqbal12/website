create or replace function public.activate_delivery(
  p_entitlement_id uuid,
  p_activation_reference text,
  p_idempotency_key text,
  p_activation_context jsonb default '{}'::jsonb,
  p_actor_user_id uuid default null
)
returns public.delivery_activations
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  actor_role text;
  actor_id uuid;
  target_entitlement public.entitlements;
  target_obligation public.payment_obligations;
  target_settlement public.payment_settlements;
  target_attempt public.payment_attempts;
  target_project_service public.project_services;
  target_project public.projects;
  target_proposal public.proposals;
  target_version public.proposal_versions;
  target_agreement public.agreements;
  target_agreement_version public.agreement_versions;
  existing_activation public.delivery_activations;
  created_activation public.delivery_activations;
  normalized_reference text;
  normalized_key text;
begin
  actor_role := current_setting('role', true);
  actor_id := coalesce((select auth.uid()), p_actor_user_id);
  if actor_role is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'Only the trusted service role may activate delivery.';
  end if;
  if actor_id is null or not exists (select 1 from auth.users where id = actor_id) then
    raise exception using errcode = '42501', message = 'A valid trusted activation actor is required.';
  end if;

  normalized_reference := btrim(coalesce(p_activation_reference, ''));
  normalized_key := btrim(coalesce(p_idempotency_key, ''));
  if length(normalized_reference) < 8 or length(normalized_reference) > 256
    or length(normalized_key) < 8 or length(normalized_key) > 128 then
    raise exception using errcode = '22023', message = 'Delivery activation identity is invalid.';
  end if;
  if jsonb_typeof(coalesce(p_activation_context, '{}'::jsonb)) <> 'object' then
    raise exception using errcode = '22023', message = 'Delivery activation context must be a JSON object.';
  end if;

  select * into target_entitlement
  from public.entitlements
  where id = p_entitlement_id
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Entitlement was not found.';
  end if;
  if target_entitlement.status <> 'ACTIVE'
    or target_entitlement.source_type <> 'VERIFIED_COMMERCIAL_EVENT' then
    raise exception using errcode = '22023', message = 'Delivery activation requires an active verified entitlement.';
  end if;
  if target_entitlement.ends_at is not null
    and target_entitlement.ends_at <= timezone('utc', now()) then
    raise exception using errcode = '22023', message = 'Expired entitlements cannot activate delivery.';
  end if;

  select * into target_obligation
  from public.payment_obligations
  where id = target_entitlement.payment_obligation_id
  for share;
  if not found then
    raise exception using errcode = 'P0002', message = 'Entitlement payment obligation was not found.';
  end if;
  if target_entitlement.organization_id is distinct from target_obligation.organization_id
    or target_entitlement.project_id is distinct from target_obligation.project_id
    or target_entitlement.proposal_id is distinct from target_obligation.proposal_id
    or target_entitlement.proposal_version_id is distinct from target_obligation.proposal_version_id
    or target_entitlement.agreement_id is distinct from target_obligation.agreement_id
    or target_entitlement.agreement_version_id is distinct from target_obligation.agreement_version_id then
    raise exception using errcode = '42501', message = 'Entitlement payment and commercial source relationships do not match.';
  end if;

  select * into target_project
  from public.projects
  where id = target_entitlement.project_id
    and organization_id = target_entitlement.organization_id
    and status <> 'ARCHIVED'
  for share;
  if not found then
    raise exception using errcode = '42501', message = 'Entitlement project is outside the organization or archived.';
  end if;

  select * into target_project_service
  from public.project_services
  where id = target_entitlement.project_service_id
    and project_id = target_entitlement.project_id
  for share;
  if not found then
    raise exception using errcode = 'P0002', message = 'Entitlement project service was not found in the entitlement project.';
  end if;
  if target_project_service.status not in ('REQUESTED', 'APPROVED', 'PAYMENT_PENDING', 'ACTIVE') then
    raise exception using errcode = '22023', message = 'Project service is not in an eligible commercial state for delivery activation.';
  end if;

  if not exists (
    select 1
    from public.service_offerings offering
    join public.catalog_services service on service.id = offering.service_id
    join public.catalog_pillars pillar on pillar.id = service.pillar_id
    where offering.id = target_project_service.offering_id
      and offering.is_active
      and offering.effective_from <= timezone('utc', now())
      and (offering.effective_until is null or offering.effective_until > timezone('utc', now()))
      and service.is_active
      and pillar.is_active
  ) then
    raise exception using errcode = '22023', message = 'Project service offering and catalog sources must be active.';
  end if;

  select * into target_proposal
  from public.proposals
  where id = target_entitlement.proposal_id
    and organization_id = target_entitlement.organization_id
  for share;
  if not found then
    raise exception using errcode = '42501', message = 'Entitlement proposal source is outside the organization.';
  end if;

  select * into target_version
  from public.proposal_versions
  where id = target_entitlement.proposal_version_id
    and proposal_id = target_proposal.id
    and status = 'ACCEPTED'
    and target_proposal.current_version_id = id
  for share;
  if not found then
    raise exception using errcode = '22023', message = 'Entitlement proposal source must be the accepted current version.';
  end if;
  if not exists (
    select 1
    from public.proposal_items item
    where item.proposal_version_id = target_version.id
      and item.project_service_id = target_project_service.id
  ) then
    raise exception using errcode = '42501', message = 'Project service is not included in the entitlement proposal scope.';
  end if;

  if target_entitlement.agreement_id is not null then
    select * into target_agreement
    from public.agreements
    where id = target_entitlement.agreement_id
      and organization_id = target_entitlement.organization_id
    for share;
    if not found then
      raise exception using errcode = '42501', message = 'Entitlement agreement source is outside the organization.';
    end if;

    select * into target_agreement_version
    from public.agreement_versions
    where id = target_entitlement.agreement_version_id
      and agreement_id = target_agreement.id
      and status = 'ACTIVE'
    for share;
    if not found or not exists (
      select 1
      from public.agreement_acceptances acceptance
      where acceptance.agreement_id = target_agreement.id
        and acceptance.agreement_version_id = target_agreement_version.id
    ) then
      raise exception using errcode = '22023', message = 'Entitlement agreement source must be the accepted active version.';
    end if;
  end if;

  if target_entitlement.payment_settlement_id is not null then
    select * into target_settlement
    from public.payment_settlements
    where id = target_entitlement.payment_settlement_id
    for share;
    if not found then
      raise exception using errcode = 'P0002', message = 'Entitlement payment settlement was not found.';
    end if;

    select * into target_attempt
    from public.payment_attempts
    where id = target_settlement.payment_attempt_id
    for share;
    if not found
      or target_attempt.organization_id is distinct from target_settlement.organization_id
      or target_attempt.payment_obligation_id is distinct from target_settlement.payment_obligation_id
      or target_attempt.amount_minor is distinct from target_settlement.amount_minor
      or upper(target_attempt.currency) is distinct from upper(target_settlement.currency) then
      raise exception using errcode = '42501', message = 'Settlement payment attempt does not match its payment source.';
    end if;

    if target_settlement.organization_id is distinct from target_entitlement.organization_id
      or target_settlement.project_id is distinct from target_entitlement.project_id
      or target_settlement.payment_obligation_id is distinct from target_entitlement.payment_obligation_id
      or target_settlement.proposal_id is distinct from target_entitlement.proposal_id
      or target_settlement.proposal_version_id is distinct from target_entitlement.proposal_version_id
      or target_settlement.agreement_id is distinct from target_entitlement.agreement_id
      or target_settlement.agreement_version_id is distinct from target_entitlement.agreement_version_id
      or target_settlement.amount_minor is distinct from target_obligation.amount_minor
      or upper(target_settlement.currency) is distinct from upper(target_obligation.currency) then
      raise exception using errcode = '42501', message = 'Settlement does not match the entitlement commercial source.';
    end if;
  end if;

  select * into existing_activation
  from public.delivery_activations
  where entitlement_id = target_entitlement.id
  for update;
  if found then
    if existing_activation.organization_id is distinct from target_entitlement.organization_id
      or existing_activation.project_id is distinct from target_entitlement.project_id
      or existing_activation.project_service_id is distinct from target_entitlement.project_service_id
      or existing_activation.activation_reference is distinct from normalized_reference
      or existing_activation.idempotency_key is distinct from normalized_key then
      raise exception using errcode = '23505', message = 'This entitlement already has a conflicting delivery activation.';
    end if;
    return existing_activation;
  end if;

  select * into existing_activation
  from public.delivery_activations
  where organization_id = target_entitlement.organization_id
    and idempotency_key = normalized_key
  for update;
  if found then
    raise exception using errcode = '23505', message = 'Delivery activation idempotency key was already used for a different activation.';
  end if;

  insert into public.delivery_activations (
    organization_id,
    project_id,
    project_service_id,
    entitlement_id,
    delivery_stage,
    activation_snapshot,
    activation_reference,
    idempotency_key,
    created_by
  ) values (
    target_entitlement.organization_id,
    target_entitlement.project_id,
    target_entitlement.project_service_id,
    target_entitlement.id,
    'IMPLEMENTATION',
    jsonb_build_object(
      'entitlement_id', target_entitlement.id,
      'payment_obligation_id', target_entitlement.payment_obligation_id,
      'payment_settlement_id', target_entitlement.payment_settlement_id,
      'project_service_id', target_entitlement.project_service_id,
      'activation_context', coalesce(p_activation_context, '{}'::jsonb)
    ),
    normalized_reference,
    normalized_key,
    actor_id
  ) returning * into created_activation;

  perform private.record_delivery_activation_audit(
    'delivery_activation_activated',
    created_activation.organization_id,
    created_activation.project_id,
    created_activation.entitlement_id,
    created_activation.id,
    jsonb_build_object(
      'delivery_stage', created_activation.delivery_stage,
      'activation_reference', created_activation.activation_reference
    )
  );
  return created_activation;
end;
$$;

revoke all on function public.activate_delivery(uuid, text, text, jsonb, uuid) from public;
revoke execute on function public.activate_delivery(uuid, text, text, jsonb, uuid) from anon, authenticated;
grant execute on function public.activate_delivery(uuid, text, text, jsonb, uuid) to service_role;

comment on function public.activate_delivery(uuid, text, text, jsonb, uuid) is
  'Service-role-only delivery activation boundary requiring an active verified entitlement and consistent commercial source relationships. Activation begins at IMPLEMENTATION and does not initialize downstream lifecycle records.';
