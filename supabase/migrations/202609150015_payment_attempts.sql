create table if not exists public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  project_id uuid references public.projects(id) on delete restrict,
  payment_obligation_id uuid not null references public.payment_obligations(id) on delete restrict,
  amount_minor bigint not null
    constraint payment_attempts_amount_positive check (amount_minor > 0),
  currency text not null default 'USD'
    constraint payment_attempts_currency_code_valid check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'CREATED'
    constraint payment_attempts_status_valid check (status in ('CREATED', 'PROCESSING', 'FAILED', 'CANCELLED', 'EXPIRED')),
  commercial_snapshot jsonb not null
    constraint payment_attempts_commercial_snapshot_object check (jsonb_typeof(commercial_snapshot) = 'object'),
  status_reason text,
  idempotency_key text not null
    constraint payment_attempts_idempotency_key_valid check (length(btrim(idempotency_key)) between 8 and 128),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint payment_attempts_idempotency_unique unique (organization_id, idempotency_key)
);

create index if not exists payment_attempts_organization_created_at_idx
  on public.payment_attempts (organization_id, created_at desc);
create index if not exists payment_attempts_project_created_at_idx
  on public.payment_attempts (project_id, created_at desc);
create index if not exists payment_attempts_obligation_created_at_idx
  on public.payment_attempts (payment_obligation_id, created_at desc);
create index if not exists payment_attempts_status_idx
  on public.payment_attempts (organization_id, status, created_at desc);

alter table public.audit_events
  add column if not exists payment_attempt_id uuid references public.payment_attempts(id) on delete set null;

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
  'payment_attempt_created', 'payment_attempt_transitioned'
));

create index if not exists audit_events_payment_attempt_created_at_idx
  on public.audit_events (payment_attempt_id, created_at);

create or replace function public.set_payment_attempt_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_payment_attempts_updated_at on public.payment_attempts;
create trigger set_payment_attempts_updated_at
before update on public.payment_attempts
for each row execute procedure public.set_payment_attempt_updated_at();

create or replace function private.record_payment_attempt_audit(
  p_event_type text,
  p_organization_id uuid,
  p_project_id uuid,
  p_payment_obligation_id uuid,
  p_payment_attempt_id uuid,
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
    metadata
  ) values (
    p_event_type,
    (select auth.uid()),
    p_organization_id,
    p_project_id,
    p_payment_obligation_id,
    p_payment_attempt_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

revoke all on function private.record_payment_attempt_audit(text, uuid, uuid, uuid, uuid, jsonb) from public;
revoke execute on function private.record_payment_attempt_audit(text, uuid, uuid, uuid, uuid, jsonb) from anon;

create or replace function public.create_payment_attempt(
  p_payment_obligation_id uuid,
  p_amount_minor bigint,
  p_currency text,
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
  existing_attempt public.payment_attempts;
  created_attempt public.payment_attempts;
  normalized_currency text;
  normalized_key text;
  snapshot jsonb;
begin
  actor_id := (select auth.uid());
  if actor_id is null then
    raise exception using errcode = '42501', message = 'An authenticated user is required.';
  end if;

  select * into target_obligation
  from public.payment_obligations
  where id = p_payment_obligation_id
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Payment obligation was not found.';
  end if;
  if not private.commercial_owner(target_obligation.organization_id) then
    raise exception using errcode = '42501', message = 'Only the organization owner can create payment attempts.';
  end if;
  if target_obligation.status <> 'PENDING' then
    raise exception using errcode = '22023', message = 'Payment attempts require a pending payment obligation.';
  end if;

  normalized_currency := upper(btrim(coalesce(p_currency, '')));
  normalized_key := btrim(coalesce(p_idempotency_key, ''));
  if p_amount_minor is null or p_amount_minor <= 0 then
    raise exception using errcode = '22023', message = 'Payment attempt amount must be a positive minor-unit integer.';
  end if;
  if p_amount_minor is distinct from target_obligation.amount_minor
    or normalized_currency is distinct from target_obligation.currency then
    raise exception using errcode = '22023', message = 'Payment attempt amount and currency must match the payment obligation.';
  end if;
  if length(normalized_key) < 8 or length(normalized_key) > 128 then
    raise exception using errcode = '22023', message = 'Payment attempt idempotency key is invalid.';
  end if;
  if jsonb_typeof(coalesce(p_commercial_snapshot, '{}'::jsonb)) <> 'object' then
    raise exception using errcode = '22023', message = 'Payment attempt commercial snapshot must be a JSON object.';
  end if;

  select * into existing_attempt
  from public.payment_attempts
  where organization_id = target_obligation.organization_id
    and idempotency_key = normalized_key
  for update;
  if found then
    if existing_attempt.payment_obligation_id is distinct from target_obligation.id
      or existing_attempt.amount_minor is distinct from p_amount_minor
      or existing_attempt.currency is distinct from normalized_currency then
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
      'status', created_attempt.status
    )
  );
  return created_attempt;
end;
$$;

create or replace function public.transition_payment_attempt(
  p_payment_attempt_id uuid,
  p_next_status text,
  p_expected_status text default 'CREATED',
  p_status_reason text default null
)
returns public.payment_attempts
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_attempt public.payment_attempts;
  transitioned_attempt public.payment_attempts;
  next_status text;
  expected_status text;
begin
  select * into target_attempt
  from public.payment_attempts
  where id = p_payment_attempt_id
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Payment attempt was not found.';
  end if;
  if not private.commercial_owner(target_attempt.organization_id) then
    raise exception using errcode = '42501', message = 'Only the organization owner can transition payment attempts.';
  end if;

  next_status := upper(btrim(coalesce(p_next_status, '')));
  expected_status := upper(btrim(coalesce(p_expected_status, '')));
  if target_attempt.status <> expected_status then
    raise exception using errcode = '40001', message = 'Payment attempt state changed. Refresh and retry.';
  end if;
  if next_status not in ('PROCESSING', 'FAILED', 'CANCELLED', 'EXPIRED') then
    raise exception using errcode = '22023', message = 'Payment attempt lifecycle transition is invalid.';
  end if;
  if not (
    (target_attempt.status = 'CREATED' and next_status in ('PROCESSING', 'FAILED', 'CANCELLED', 'EXPIRED'))
    or (target_attempt.status = 'PROCESSING' and next_status in ('FAILED', 'CANCELLED', 'EXPIRED'))
  ) then
    raise exception using errcode = '22023', message = 'Payment attempt lifecycle transition is not allowed.';
  end if;
  if next_status = 'FAILED' and length(btrim(coalesce(p_status_reason, ''))) = 0 then
    raise exception using errcode = '22023', message = 'A failed payment attempt requires a reason.';
  end if;

  update public.payment_attempts
  set status = next_status,
      status_reason = nullif(btrim(p_status_reason), '')
  where id = target_attempt.id
  returning * into transitioned_attempt;

  perform private.record_payment_attempt_audit(
    'payment_attempt_transitioned',
    transitioned_attempt.organization_id,
    transitioned_attempt.project_id,
    transitioned_attempt.payment_obligation_id,
    transitioned_attempt.id,
    jsonb_build_object(
      'previous_status', target_attempt.status,
      'new_status', transitioned_attempt.status,
      'status_reason', transitioned_attempt.status_reason
    )
  );
  return transitioned_attempt;
end;
$$;

create or replace function private.prevent_payment_attempt_mutation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    raise exception using errcode = '42501', message = 'Payment attempt history cannot be deleted.';
  end if;

  if old.id is distinct from new.id
    or old.organization_id is distinct from new.organization_id
    or old.project_id is distinct from new.project_id
    or old.payment_obligation_id is distinct from new.payment_obligation_id
    or old.amount_minor is distinct from new.amount_minor
    or old.currency is distinct from new.currency
    or old.commercial_snapshot is distinct from new.commercial_snapshot
    or old.idempotency_key is distinct from new.idempotency_key
    or old.created_by is distinct from new.created_by
    or old.created_at is distinct from new.created_at then
    raise exception using errcode = '42501', message = 'Payment attempt source and snapshot fields are immutable.';
  end if;

  if new.status is distinct from old.status
    and not (
      (old.status = 'CREATED' and new.status in ('PROCESSING', 'FAILED', 'CANCELLED', 'EXPIRED'))
      or (old.status = 'PROCESSING' and new.status in ('FAILED', 'CANCELLED', 'EXPIRED'))
    ) then
    raise exception using errcode = '22023', message = 'Payment attempt lifecycle transition is not allowed.';
  end if;

  if new.status = 'FAILED' and length(btrim(coalesce(new.status_reason, ''))) = 0 then
    raise exception using errcode = '22023', message = 'A failed payment attempt requires a reason.';
  end if;
  return new;
end;
$$;

revoke all on function private.prevent_payment_attempt_mutation() from public;
revoke execute on function private.prevent_payment_attempt_mutation() from anon;

drop trigger if exists prevent_payment_attempt_mutation on public.payment_attempts;
create trigger prevent_payment_attempt_mutation
before update or delete on public.payment_attempts
for each row execute procedure private.prevent_payment_attempt_mutation();

revoke all on function public.create_payment_attempt(uuid, bigint, text, text, jsonb) from public;
revoke all on function public.transition_payment_attempt(uuid, text, text, text) from public;
revoke execute on function public.create_payment_attempt(uuid, bigint, text, text, jsonb) from anon;
revoke execute on function public.transition_payment_attempt(uuid, text, text, text) from anon;
grant execute on function public.create_payment_attempt(uuid, bigint, text, text, jsonb) to authenticated;
grant execute on function public.transition_payment_attempt(uuid, text, text, text) to authenticated;

alter table public.payment_attempts enable row level security;

create policy "Accessible members can view payment attempts"
on public.payment_attempts
for select to authenticated
using (
  private.has_organization_role(organization_id, 'MEMBER')
  and (project_id is null or private.has_project_access(project_id))
);

create policy "Payment attempt inserts require trusted functions"
on public.payment_attempts
for insert to authenticated
with check (false);

create policy "Payment attempt updates require trusted functions"
on public.payment_attempts
for update to authenticated
using (false)
with check (false);

create policy "Payment attempt deletes are disabled"
on public.payment_attempts
for delete to authenticated
using (false);

comment on table public.payment_attempts is
  'Provider-neutral payment attempts linked to a payment obligation. Attempts do not represent settlement or successful receipt of funds.';

comment on column public.payment_attempts.status is
  'Attempt workflow status only. Provider settlement, success, refund, dispute, and reconciliation states are outside this domain.';