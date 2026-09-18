create table if not exists public.payment_settlements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  project_id uuid references public.projects(id) on delete restrict,
  payment_obligation_id uuid not null references public.payment_obligations(id) on delete restrict,
  payment_attempt_id uuid not null references public.payment_attempts(id) on delete restrict,
  proposal_id uuid references public.proposals(id) on delete restrict,
  proposal_version_id uuid references public.proposal_versions(id) on delete restrict,
  agreement_id uuid references public.agreements(id) on delete restrict,
  agreement_version_id uuid references public.agreement_versions(id) on delete restrict,
  provider text not null
    constraint payment_settlements_provider_valid check (provider = 'stripe'),
  provider_event_id text not null,
  provider_checkout_session_id text,
  provider_payment_intent_id text,
  provider_event_type text not null,
  amount_minor bigint not null
    constraint payment_settlements_amount_positive check (amount_minor > 0),
  currency text not null default 'USD'
    constraint payment_settlements_currency_code_valid check (currency ~ '^[A-Z]{3}$'),
  settled_at timestamptz not null default timezone('utc', now()),
  provider_metadata jsonb not null default '{}'::jsonb
    constraint payment_settlements_provider_metadata_object check (jsonb_typeof(provider_metadata) = 'object'),
  created_by uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint payment_settlements_event_unique unique (organization_id, provider, provider_event_id),
  constraint payment_settlements_attempt_unique unique (payment_attempt_id),
  constraint payment_settlements_check_session_unique unique (provider_checkout_session_id)
);

create index if not exists payment_settlements_organization_created_at_idx
  on public.payment_settlements (organization_id, created_at desc);
create index if not exists payment_settlements_project_created_at_idx
  on public.payment_settlements (project_id, created_at desc);
create index if not exists payment_settlements_obligation_created_at_idx
  on public.payment_settlements (payment_obligation_id, created_at desc);
create index if not exists payment_settlements_provider_event_idx
  on public.payment_settlements (provider, provider_event_id);

alter table public.audit_events
  add column if not exists payment_settlement_id uuid references public.payment_settlements(id) on delete set null;

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
  'payment_settlement_created',
  'entitlement_activated', 'entitlement_paused', 'entitlement_resumed', 'entitlement_expired', 'entitlement_cancelled',
  'delivery_activation_activated', 'delivery_activation_paused', 'delivery_activation_resumed', 'delivery_activation_completed', 'delivery_activation_cancelled'
));

create index if not exists audit_events_payment_settlement_created_at_idx
  on public.audit_events (payment_settlement_id, created_at);

create or replace function public.set_payment_settlement_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_payment_settlements_updated_at on public.payment_settlements;
create trigger set_payment_settlements_updated_at
before update on public.payment_settlements
for each row execute procedure public.set_payment_settlement_updated_at();

create or replace function private.record_payment_settlement_audit(
  p_event_type text,
  p_organization_id uuid,
  p_project_id uuid,
  p_payment_obligation_id uuid,
  p_payment_attempt_id uuid,
  p_payment_settlement_id uuid,
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
    payment_obligation_id,
    payment_attempt_id,
    payment_settlement_id,
    metadata
  ) values (
    p_event_type,
    (select auth.uid()),
    p_organization_id,
    p_project_id,
    p_payment_obligation_id,
    p_payment_attempt_id,
    p_payment_settlement_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

revoke all on function private.record_payment_settlement_audit(text, uuid, uuid, uuid, uuid, uuid, jsonb) from public;
revoke execute on function private.record_payment_settlement_audit(text, uuid, uuid, uuid, uuid, uuid, jsonb) from anon;

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

  if normalized_provider <> 'stripe' then
    raise exception using errcode = '22023', message = 'Only Stripe settlement records are supported in this foundation.';
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
    organization_id,
    project_id,
    payment_obligation_id,
    payment_attempt_id,
    proposal_id,
    proposal_version_id,
    agreement_id,
    agreement_version_id,
    provider,
    provider_event_id,
    provider_checkout_session_id,
    provider_payment_intent_id,
    provider_event_type,
    amount_minor,
    currency,
    provider_metadata,
    created_by
  ) values (
    p_organization_id,
    effective_project_id,
    p_payment_obligation_id,
    p_payment_attempt_id,
    target_obligation.proposal_id,
    target_obligation.proposal_version_id,
    target_obligation.agreement_id,
    target_obligation.agreement_version_id,
    normalized_provider,
    normalized_event_id,
    p_provider_checkout_session_id,
    p_provider_payment_intent_id,
    normalized_event_type,
    p_amount_minor,
    normalized_currency,
    coalesce(p_provider_metadata, '{}'::jsonb),
    actor_id
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

alter table public.payment_settlements enable row level security;

drop policy if exists "Members can view verified settlements within their organization" on public.payment_settlements;
drop policy if exists "Payment settlements are trusted-server only" on public.payment_settlements;
drop policy if exists "Payment settlements are trusted-server only for update" on public.payment_settlements;
drop policy if exists "Payment settlements cannot be deleted" on public.payment_settlements;

create policy "Members can view verified settlements within their organization"
on public.payment_settlements
for select to authenticated
using (
  private.has_organization_role(organization_id, 'MEMBER')
  and (project_id is null or private.has_project_access(project_id))
);

create policy "Payment settlements are trusted-server only"
on public.payment_settlements
for insert to authenticated
with check (false);

create policy "Payment settlements are trusted-server only for update"
on public.payment_settlements
for update to authenticated
using (false)
with check (false);

create policy "Payment settlements cannot be deleted"
on public.payment_settlements
for delete to authenticated
using (false);

comment on table public.payment_settlements is
  'Verified provider settlement records linked to a payment obligation and payment attempt. They reflect a cryptographically verified Stripe event and remain separate from entitlement and delivery activation triggers.';

comment on column public.payment_settlements.provider_event_id is
  'Unique provider event identifier used to make webhook handling idempotent and safe against replay.';

comment on column public.payment_settlements.provider_metadata is
  'Immutable provider-supplied event metadata used for evidence and reconciliation; no secrets are stored.';
