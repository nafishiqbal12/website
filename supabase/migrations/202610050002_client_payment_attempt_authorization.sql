create or replace function public.create_client_payment_attempt(
  p_payment_obligation_id uuid,
  p_idempotency_key text,
  p_commercial_snapshot jsonb default '{}'::jsonb
)
returns public.payment_attempts
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  actor_id uuid;
  target_obligation public.payment_obligations;
  target_proposal public.proposals;
  target_version public.proposal_versions;
  target_agreement public.agreements;
  target_agreement_version public.agreement_versions;
  existing_attempt public.payment_attempts;
  created_attempt public.payment_attempts;
  normalized_key text;
  snapshot jsonb;
begin
  actor_id := (select auth.uid());
  if actor_id is null then
    raise exception using errcode = '42501', message = 'An authenticated user is required.';
  end if;

  normalized_key := btrim(coalesce(p_idempotency_key, ''));
  if length(normalized_key) < 8 or length(normalized_key) > 128 then
    raise exception using errcode = '22023', message = 'Payment attempt idempotency key is invalid.';
  end if;
  if jsonb_typeof(coalesce(p_commercial_snapshot, '{}'::jsonb)) <> 'object' then
    raise exception using errcode = '22023', message = 'Payment attempt commercial snapshot must be a JSON object.';
  end if;

  select * into target_obligation
  from public.payment_obligations
  where id = p_payment_obligation_id
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Payment obligation was not found.';
  end if;
  if target_obligation.project_id is null
    or not exists (
      select 1
      from public.projects project
      where project.id = target_obligation.project_id
        and project.organization_id = target_obligation.organization_id
        and project.status <> 'ARCHIVED'
    )
    or not private.has_organization_role(target_obligation.organization_id, 'MEMBER')
    or not private.has_project_access(target_obligation.project_id) then
    raise exception using errcode = '42501', message = 'Payment obligation is outside the authenticated user project access boundary.';
  end if;
  if target_obligation.status <> 'PENDING'
    or (target_obligation.expires_at is not null and target_obligation.expires_at <= timezone('utc', now())) then
    raise exception using errcode = '22023', message = 'Payment obligation is not currently payable.';
  end if;

  select * into target_proposal
  from public.proposals
  where id = target_obligation.proposal_id
    and organization_id = target_obligation.organization_id
    and status = 'ACCEPTED'
  for share;
  if not found then
    raise exception using errcode = '22023', message = 'Payment obligation proposal is not accepted.';
  end if;

  select * into target_version
  from public.proposal_versions
  where id = target_obligation.proposal_version_id
    and proposal_id = target_proposal.id
    and status = 'ACCEPTED'
    and target_proposal.current_version_id = id
  for share;
  if not found then
    raise exception using errcode = '22023', message = 'Payment obligation proposal version is not accepted and current.';
  end if;

  if target_obligation.agreement_id is not null then
    select * into target_agreement
    from public.agreements
    where id = target_obligation.agreement_id
      and organization_id = target_obligation.organization_id
    for share;
    if not found then
      raise exception using errcode = '42501', message = 'Payment obligation agreement is outside the organization.';
    end if;

    select * into target_agreement_version
    from public.agreement_versions
    where id = target_obligation.agreement_version_id
      and agreement_id = target_agreement.id
      and status = 'ACTIVE'
    for share;
    if not found or not exists (
      select 1
      from public.agreement_acceptances acceptance
      where acceptance.agreement_id = target_agreement.id
        and acceptance.agreement_version_id = target_agreement_version.id
    ) then
      raise exception using errcode = '22023', message = 'Payment obligation agreement is not accepted and active.';
    end if;
  end if;

  select * into existing_attempt
  from public.payment_attempts
  where organization_id = target_obligation.organization_id
    and idempotency_key = normalized_key
  for update;
  if found then
    if existing_attempt.payment_obligation_id is distinct from target_obligation.id then
      raise exception using errcode = '23505', message = 'Idempotency key was already used for a different payment attempt.';
    end if;
    return existing_attempt;
  end if;

  snapshot := jsonb_build_object(
    'payment_obligation_id', target_obligation.id,
    'organization_id', target_obligation.organization_id,
    'project_id', target_obligation.project_id,
    'proposal_id', target_obligation.proposal_id,
    'proposal_version_id', target_obligation.proposal_version_id,
    'agreement_id', target_obligation.agreement_id,
    'agreement_version_id', target_obligation.agreement_version_id,
    'amount_minor', target_obligation.amount_minor,
    'currency', target_obligation.currency,
    'payment_purpose', target_obligation.payment_purpose,
    'schedule_type', target_obligation.schedule_type,
    'obligation_snapshot', target_obligation.commercial_snapshot,
    'attempt_snapshot', coalesce(p_commercial_snapshot, '{}'::jsonb)
  );

  insert into public.payment_attempts (
    organization_id,
    project_id,
    payment_obligation_id,
    amount_minor,
    currency,
    commercial_snapshot,
    idempotency_key,
    created_by
  ) values (
    target_obligation.organization_id,
    target_obligation.project_id,
    target_obligation.id,
    target_obligation.amount_minor,
    target_obligation.currency,
    snapshot,
    normalized_key,
    actor_id
  ) returning * into created_attempt;

  perform private.record_payment_attempt_audit(
    'payment_attempt_created',
    created_attempt.organization_id,
    created_attempt.project_id,
    created_attempt.payment_obligation_id,
    created_attempt.id,
    jsonb_build_object(
      'amount_minor', created_attempt.amount_minor,
      'currency', created_attempt.currency,
      'status', created_attempt.status,
      'client_initiated', true
    )
  );
  return created_attempt;
end;
$$;

revoke all on function public.create_client_payment_attempt(uuid, text, jsonb) from public;
revoke execute on function public.create_client_payment_attempt(uuid, text, jsonb) from anon;
revoke execute on function public.create_client_payment_attempt(uuid, text, jsonb) from service_role;
grant execute on function public.create_client_payment_attempt(uuid, text, jsonb) to authenticated;

comment on function public.create_client_payment_attempt(uuid, text, jsonb) is
  'Authenticated client payment-attempt entry point. Derives organization, project, amount, and currency from a payable obligation and never creates settlement, entitlement, or delivery state.';
