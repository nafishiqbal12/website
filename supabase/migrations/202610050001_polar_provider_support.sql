alter table public.payment_settlements
drop constraint if exists payment_settlements_provider_valid;

alter table public.payment_settlements
add constraint payment_settlements_provider_valid check (provider in ('stripe', 'polar'));

create or replace function public.create_payment_settlement(
  p_organization_id uuid,
  p_project_id uuid,
  p_payment_obligation_id uuid,
  p_payment_attempt_id uuid,
  p_provider text,
  p_provider_event_id text,
  p_provider_event_type text,
  p_amount_minor bigint,
  p_provider_checkout_session_id text default null,
  p_provider_payment_intent_id text default null,
  p_currency text default 'USD',
  p_provider_metadata jsonb default '{}'::jsonb,
  p_actor_user_id uuid default null
)
returns public.payment_settlements
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  actor_id uuid;
  target_obligation public.payment_obligations;
  target_attempt public.payment_attempts;
  normalized_provider text;
  normalized_currency text;
  normalized_event_id text;
  normalized_event_type text;
  effective_project_id uuid;
  created_settlement public.payment_settlements;
begin
  actor_id := coalesce((select auth.uid()), p_actor_user_id);
  if current_setting('role', true) is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'Only the trusted server role can create a payment settlement record.';
  end if;

  normalized_provider := lower(btrim(coalesce(p_provider, '')));
  normalized_currency := upper(btrim(coalesce(p_currency, '')));
  normalized_event_id := btrim(coalesce(p_provider_event_id, ''));
  normalized_event_type := btrim(coalesce(p_provider_event_type, ''));

  if normalized_provider not in ('stripe', 'polar') then
    raise exception using errcode = '22023', message = 'Only the approved payment providers are supported.';
  end if;
  if length(normalized_event_id) < 8 or length(normalized_event_id) > 512 then
    raise exception using errcode = '22023', message = 'Provider event ID is invalid.';
  end if;
  if length(normalized_event_type) < 3 or length(normalized_event_type) > 128 then
    raise exception using errcode = '22023', message = 'Provider event type is invalid.';
  end if;
  if p_amount_minor is null or p_amount_minor <= 0 then
    raise exception using errcode = '22023', message = 'Settlement amount must be a positive minor-unit integer.';
  end if;
  if normalized_currency <> 'USD' then
    raise exception using errcode = '22023', message = 'Only USD settlement records are supported in this foundation.';
  end if;
  if jsonb_typeof(coalesce(p_provider_metadata, '{}'::jsonb)) <> 'object' then
    raise exception using errcode = '22023', message = 'Provider metadata must be a JSON object.';
  end if;

  select * into target_obligation
  from public.payment_obligations
  where id = p_payment_obligation_id
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Payment obligation was not found.';
  end if;
  if target_obligation.organization_id is distinct from p_organization_id then
    raise exception using errcode = '42501', message = 'Payment obligation organization mismatch.';
  end if;

  select * into target_attempt
  from public.payment_attempts
  where id = p_payment_attempt_id
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Payment attempt was not found.';
  end if;
  if target_attempt.organization_id is distinct from p_organization_id
    or target_attempt.payment_obligation_id is distinct from target_obligation.id
    or target_attempt.amount_minor is distinct from target_obligation.amount_minor
    or target_attempt.currency is distinct from target_obligation.currency then
    raise exception using errcode = '42501', message = 'Payment attempt does not reconcile to the obligation.';
  end if;

  effective_project_id := coalesce(p_project_id, target_attempt.project_id, target_obligation.project_id);
  if effective_project_id is not null
    and target_attempt.project_id is not null
    and target_attempt.project_id is distinct from effective_project_id then
    raise exception using errcode = '42501', message = 'Project mismatch for settlement reconciliation.';
  end if;

  if target_attempt.status in ('FAILED', 'CANCELLED', 'EXPIRED') then
    raise exception using errcode = '22023', message = 'Payment attempt lifecycle does not allow verified settlement reconciliation.';
  end if;
  if target_obligation.status <> 'PENDING' then
    raise exception using errcode = '22023', message = 'Only a pending obligation may reconcile a verified settlement.';
  end if;
  if p_amount_minor is distinct from target_obligation.amount_minor then
    raise exception using errcode = '22023', message = 'Settlement amount does not match the payment obligation.';
  end if;

  if exists (
    select 1 from public.payment_settlements
    where organization_id = p_organization_id
      and provider = normalized_provider
      and provider_event_id = normalized_event_id
  ) then
    raise exception using errcode = '23505', message = 'The provider event was already used for a verified settlement.';
  end if;

  if exists (
    select 1 from public.payment_settlements
    where payment_attempt_id = p_payment_attempt_id
  ) then
    raise exception using errcode = '23505', message = 'The payment attempt already has a verified settlement record.';
  end if;

  insert into public.payment_settlements (
    organization_id, project_id, payment_obligation_id, payment_attempt_id,
    proposal_id, proposal_version_id, agreement_id, agreement_version_id,
    provider, provider_event_id, provider_checkout_session_id,
    provider_payment_intent_id, provider_event_type, amount_minor, currency,
    provider_metadata, created_by
  ) values (
    p_organization_id, effective_project_id, p_payment_obligation_id, p_payment_attempt_id,
    target_obligation.proposal_id, target_obligation.proposal_version_id,
    target_obligation.agreement_id, target_obligation.agreement_version_id,
    normalized_provider, normalized_event_id, p_provider_checkout_session_id,
    p_provider_payment_intent_id, normalized_event_type, p_amount_minor,
    normalized_currency, coalesce(p_provider_metadata, '{}'::jsonb), actor_id
  ) returning * into created_settlement;

  perform private.record_payment_settlement_audit(
    'payment_settlement_created',
    created_settlement.organization_id,
    created_settlement.project_id,
    created_settlement.payment_obligation_id,
    created_settlement.payment_attempt_id,
    created_settlement.id,
    jsonb_build_object(
      'provider', created_settlement.provider,
      'provider_event_id', created_settlement.provider_event_id,
      'provider_event_type', created_settlement.provider_event_type,
      'amount_minor', created_settlement.amount_minor,
      'currency', created_settlement.currency
    )
  );
  return created_settlement;
end;
$$;

revoke all on function public.create_payment_settlement(uuid, uuid, uuid, uuid, text, text, text, bigint, text, text, text, jsonb, uuid) from public;
revoke execute on function public.create_payment_settlement(uuid, uuid, uuid, uuid, text, text, text, bigint, text, text, text, jsonb, uuid) from anon, authenticated;
grant execute on function public.create_payment_settlement(uuid, uuid, uuid, uuid, text, text, text, bigint, text, text, text, jsonb, uuid) to service_role;

comment on table public.payment_settlements is
  'Verified provider settlement records linked to a payment obligation and payment attempt. Approved providers are Stripe and Polar; records remain separate from entitlement and delivery activation triggers.';
