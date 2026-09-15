create table if not exists public.payment_obligations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  project_id uuid references public.projects(id) on delete restrict,
  proposal_id uuid not null references public.proposals(id) on delete restrict,
  proposal_version_id uuid not null references public.proposal_versions(id) on delete restrict,
  agreement_id uuid references public.agreements(id) on delete restrict,
  agreement_version_id uuid references public.agreement_versions(id) on delete restrict,
  payment_purpose text not null
    constraint payment_obligations_purpose_valid check (payment_purpose in ('IMPLEMENTATION', 'ONGOING_SERVICE')),
  schedule_type text not null
    constraint payment_obligations_schedule_valid check (schedule_type in ('UPFRONT', 'DEPOSIT', 'MILESTONE', 'RECURRING')),
  amount_minor bigint not null
    constraint payment_obligations_amount_positive check (amount_minor > 0),
  currency text not null default 'USD'
    constraint payment_obligations_currency_code_valid check (currency ~ '^[A-Z]{3}$'),
  due_at timestamptz,
  expires_at timestamptz,
  status text not null default 'PENDING'
    constraint payment_obligations_status_valid check (status in ('PENDING', 'CANCELLED', 'EXPIRED')),
  commercial_snapshot jsonb not null
    constraint payment_obligations_commercial_snapshot_object check (jsonb_typeof(commercial_snapshot) = 'object'),
  schedule_snapshot jsonb not null default '{}'::jsonb
    constraint payment_obligations_schedule_snapshot_object check (jsonb_typeof(schedule_snapshot) = 'object'),
  idempotency_key text not null
    constraint payment_obligations_idempotency_key_valid check (length(btrim(idempotency_key)) between 8 and 128),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint payment_obligations_agreement_pair_valid check ((agreement_id is null) = (agreement_version_id is null)),
  constraint payment_obligations_expiry_valid check (expires_at is null or due_at is null or expires_at >= due_at),
  constraint payment_obligations_idempotency_unique unique (organization_id, idempotency_key)
);

create index if not exists payment_obligations_organization_created_at_idx
  on public.payment_obligations (organization_id, created_at desc);
create index if not exists payment_obligations_project_created_at_idx
  on public.payment_obligations (project_id, created_at desc);
create index if not exists payment_obligations_proposal_version_idx
  on public.payment_obligations (proposal_version_id, created_at desc);
create index if not exists payment_obligations_agreement_version_idx
  on public.payment_obligations (agreement_version_id, created_at desc);
create index if not exists payment_obligations_status_idx
  on public.payment_obligations (organization_id, status, created_at desc);

alter table public.audit_events
  add column if not exists payment_obligation_id uuid references public.payment_obligations(id) on delete set null;

alter table public.audit_events drop constraint if exists audit_events_event_type_valid;
alter table public.audit_events add constraint audit_events_event_type_valid check (event_type in (
  'membership_created', 'membership_activated', 'membership_role_changed', 'membership_suspended', 'membership_removed',
  'invitation_created', 'invitation_accepted', 'invitation_revoked', 'invitation_expired',
  'project_created', 'project_updated', 'project_archived',
  'project_membership_created', 'project_membership_activated', 'project_membership_role_changed', 'project_membership_suspended', 'project_membership_removed',
  'project_service_requested', 'project_service_updated',
  'proposal_created', 'proposal_version_created', 'proposal_issued', 'proposal_accepted', 'proposal_rejected', 'proposal_cancelled',
  'agreement_created', 'agreement_version_created', 'agreement_accepted', 'agreement_activated', 'agreement_terminated',
  'payment_obligation_created', 'payment_obligation_cancelled', 'payment_obligation_expired'
));

create index if not exists audit_events_payment_obligation_created_at_idx
  on public.audit_events (payment_obligation_id, created_at);

create or replace function public.set_payment_obligation_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_payment_obligations_updated_at on public.payment_obligations;
create trigger set_payment_obligations_updated_at
before update on public.payment_obligations
for each row execute procedure public.set_payment_obligation_updated_at();

create or replace function private.record_payment_obligation_audit(
  p_event_type text,
  p_organization_id uuid,
  p_project_id uuid,
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
    payment_obligation_id,
    metadata
  ) values (
    p_event_type,
    (select auth.uid()),
    p_organization_id,
    p_project_id,
    p_payment_obligation_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

revoke all on function private.record_payment_obligation_audit(text, uuid, uuid, uuid, jsonb) from public;
revoke execute on function private.record_payment_obligation_audit(text, uuid, uuid, uuid, jsonb) from anon;

create or replace function public.create_payment_obligation(
  p_organization_id uuid,
  p_proposal_id uuid,
  p_proposal_version_id uuid,
  p_amount_minor bigint,
  p_payment_purpose text,
  p_schedule_type text,
  p_idempotency_key text,
  p_project_id uuid default null,
  p_agreement_id uuid default null,
  p_agreement_version_id uuid default null,
  p_currency text default 'USD',
  p_due_at timestamptz default null,
  p_expires_at timestamptz default null,
  p_commercial_snapshot jsonb default '{}'::jsonb,
  p_schedule_snapshot jsonb default '{}'::jsonb
)
returns public.payment_obligations
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  actor_id uuid;
  target_proposal public.proposals;
  target_version public.proposal_versions;
  target_agreement public.agreements;
  target_agreement_version public.agreement_versions;
  existing_obligation public.payment_obligations;
  created_obligation public.payment_obligations;
  effective_project_id uuid;
  normalized_currency text;
  normalized_purpose text;
  normalized_schedule text;
  normalized_key text;
  snapshot jsonb;
begin
  actor_id := (select auth.uid());
  if actor_id is null then
    raise exception using errcode = '42501', message = 'An authenticated user is required.';
  end if;

  if not private.commercial_owner(p_organization_id) then
    raise exception using errcode = '42501', message = 'Only the organization owner can create payment obligations.';
  end if;

  normalized_currency := upper(btrim(coalesce(p_currency, '')));
  normalized_purpose := upper(btrim(coalesce(p_payment_purpose, '')));
  normalized_schedule := upper(btrim(coalesce(p_schedule_type, '')));
  normalized_key := btrim(coalesce(p_idempotency_key, ''));

  if p_amount_minor is null or p_amount_minor <= 0 then
    raise exception using errcode = '22023', message = 'Payment obligation amount must be a positive minor-unit integer.';
  end if;
  if normalized_currency <> 'USD' then
    raise exception using errcode = '22023', message = 'Only USD payment obligations are supported in this foundation.';
  end if;
  if normalized_purpose not in ('IMPLEMENTATION', 'ONGOING_SERVICE') then
    raise exception using errcode = '22023', message = 'Payment obligation purpose is invalid.';
  end if;
  if normalized_schedule not in ('UPFRONT', 'DEPOSIT', 'MILESTONE', 'RECURRING') then
    raise exception using errcode = '22023', message = 'Payment obligation schedule type is invalid.';
  end if;
  if length(normalized_key) < 8 or length(normalized_key) > 128 then
    raise exception using errcode = '22023', message = 'Payment obligation idempotency key is invalid.';
  end if;
  if jsonb_typeof(coalesce(p_commercial_snapshot, '{}'::jsonb)) <> 'object'
    or jsonb_typeof(coalesce(p_schedule_snapshot, '{}'::jsonb)) <> 'object' then
    raise exception using errcode = '22023', message = 'Payment obligation snapshots must be JSON objects.';
  end if;
  if p_expires_at is not null and p_due_at is not null and p_expires_at < p_due_at then
    raise exception using errcode = '22023', message = 'Payment obligation expiry cannot precede its due time.';
  end if;

  select * into target_proposal
  from public.proposals
  where id = p_proposal_id
    and organization_id = p_organization_id
  for share;
  if not found then
    raise exception using errcode = 'P0002', message = 'Proposal was not found in this organization.';
  end if;
  if target_proposal.status <> 'ACCEPTED' then
    raise exception using errcode = '22023', message = 'Payment obligation source proposal is not accepted.';
  end if;

  select * into target_version
  from public.proposal_versions
  where id = p_proposal_version_id
    and proposal_id = target_proposal.id
    and status = 'ACCEPTED'
    and target_proposal.current_version_id = id
  for share;
  if not found then
    raise exception using errcode = '22023', message = 'Payment obligation source must be the accepted current proposal version.';
  end if;

  effective_project_id := coalesce(p_project_id, target_proposal.project_id);
  if effective_project_id is not null and not exists (
    select 1 from public.projects
    where id = effective_project_id
      and organization_id = p_organization_id
      and status <> 'ARCHIVED'
  ) then
    raise exception using errcode = 'P0002', message = 'Payment obligation project was not found in this organization.';
  end if;
  if target_proposal.project_id is not null and target_proposal.project_id is distinct from effective_project_id then
    raise exception using errcode = '42501', message = 'Payment obligation project does not match the proposal project.';
  end if;
  if exists (
    select 1
    from public.proposal_items item
    left join public.projects item_project on item_project.id = item.project_id
    left join public.project_services item_service on item_service.id = item.project_service_id
    left join public.projects service_project on service_project.id = item_service.project_id
    where item.proposal_version_id = target_version.id
      and (
        (item.project_id is not null and item_project.organization_id is distinct from p_organization_id)
        or (item.project_service_id is not null and service_project.organization_id is distinct from p_organization_id)
      )
  ) then
    raise exception using errcode = '42501', message = 'Payment obligation proposal items cross an organization boundary.';
  end if;
  if target_proposal.project_id is null and effective_project_id is not null and not exists (
    select 1
    from public.proposal_items item
    left join public.project_services item_service on item_service.id = item.project_service_id
    where item.proposal_version_id = target_version.id
      and coalesce(item.project_id, item_service.project_id) = effective_project_id
  ) then
    raise exception using errcode = '42501', message = 'Payment obligation project is not included in the proposal scope.';
  end if;

  if (p_agreement_id is null) <> (p_agreement_version_id is null) then
    raise exception using errcode = '22023', message = 'Agreement and agreement version must be supplied together.';
  end if;
  if p_agreement_id is not null then
    select * into target_agreement
    from public.agreements
    where id = p_agreement_id
      and organization_id = p_organization_id
    for share;
    if not found then
      raise exception using errcode = 'P0002', message = 'Agreement was not found in this organization.';
    end if;
    if target_agreement.project_id is distinct from effective_project_id then
      raise exception using errcode = '42501', message = 'Agreement project does not match the payment obligation project.';
    end if;
    if target_agreement.source_proposal_version_id is distinct from target_version.id then
      raise exception using errcode = '22023', message = 'Agreement source does not match the accepted proposal version.';
    end if;
    select * into target_agreement_version
    from public.agreement_versions
    where id = p_agreement_version_id
      and agreement_id = target_agreement.id
      and status = 'ACTIVE'
    for share;
    if not found or not exists (
      select 1 from public.agreement_acceptances acceptance
      where acceptance.agreement_id = target_agreement.id
        and acceptance.agreement_version_id = target_agreement_version.id
    ) then
      raise exception using errcode = '22023', message = 'Payment obligation agreement source must be the accepted active agreement version.';
    end if;
  end if;

  select * into existing_obligation
  from public.payment_obligations
  where organization_id = p_organization_id
    and idempotency_key = normalized_key
  for update;
  if found then
    if existing_obligation.proposal_id is distinct from target_proposal.id
      or existing_obligation.proposal_version_id is distinct from target_version.id
      or existing_obligation.agreement_id is distinct from p_agreement_id
      or existing_obligation.agreement_version_id is distinct from p_agreement_version_id
      or existing_obligation.project_id is distinct from effective_project_id
      or existing_obligation.amount_minor is distinct from p_amount_minor
      or existing_obligation.currency is distinct from normalized_currency
      or existing_obligation.payment_purpose is distinct from normalized_purpose
      or existing_obligation.schedule_type is distinct from normalized_schedule then
      raise exception using errcode = '23505', message = 'Idempotency key was already used for a different payment obligation.';
    end if;
    return existing_obligation;
  end if;

  snapshot := jsonb_build_object(
    'proposal_id', target_proposal.id,
    'proposal_version_id', target_version.id,
    'agreement_id', p_agreement_id,
    'agreement_version_id', p_agreement_version_id,
    'project_id', effective_project_id,
    'amount_minor', p_amount_minor,
    'currency', normalized_currency,
    'payment_purpose', normalized_purpose,
    'schedule_type', normalized_schedule,
    'commercial_snapshot', coalesce(p_commercial_snapshot, '{}'::jsonb),
    'source_content_checksum', target_version.content_checksum
  );

  insert into public.payment_obligations (
    organization_id, project_id, proposal_id, proposal_version_id,
    agreement_id, agreement_version_id, payment_purpose, schedule_type,
    amount_minor, currency, due_at, expires_at, commercial_snapshot,
    schedule_snapshot, idempotency_key, created_by
  ) values (
    p_organization_id, effective_project_id, target_proposal.id, target_version.id,
    p_agreement_id, p_agreement_version_id, normalized_purpose, normalized_schedule,
    p_amount_minor, normalized_currency, p_due_at, p_expires_at, snapshot,
    coalesce(p_schedule_snapshot, '{}'::jsonb), normalized_key, actor_id
  ) returning * into created_obligation;

  perform private.record_payment_obligation_audit(
    'payment_obligation_created',
    created_obligation.organization_id,
    created_obligation.project_id,
    created_obligation.id,
    jsonb_build_object(
      'proposal_version_id', created_obligation.proposal_version_id,
      'agreement_version_id', created_obligation.agreement_version_id,
      'amount_minor', created_obligation.amount_minor,
      'currency', created_obligation.currency,
      'payment_purpose', created_obligation.payment_purpose,
      'schedule_type', created_obligation.schedule_type
    )
  );
  return created_obligation;
end;
$$;

create or replace function public.cancel_payment_obligation(
  p_payment_obligation_id uuid,
  p_expected_status text default 'PENDING'
)
returns public.payment_obligations
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_obligation public.payment_obligations;
  cancelled_obligation public.payment_obligations;
begin
  select * into target_obligation
  from public.payment_obligations
  where id = p_payment_obligation_id
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Payment obligation was not found.';
  end if;
  if not private.commercial_owner(target_obligation.organization_id) then
    raise exception using errcode = '42501', message = 'Only the organization owner can cancel payment obligations.';
  end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target_obligation.status then
    raise exception using errcode = '40001', message = 'Payment obligation state changed. Refresh and retry.';
  end if;
  if target_obligation.status <> 'PENDING' then
    raise exception using errcode = '22023', message = 'Only pending payment obligations can be cancelled.';
  end if;

  update public.payment_obligations
  set status = 'CANCELLED'
  where id = target_obligation.id
  returning * into cancelled_obligation;

  perform private.record_payment_obligation_audit(
    'payment_obligation_cancelled',
    cancelled_obligation.organization_id,
    cancelled_obligation.project_id,
    cancelled_obligation.id,
    jsonb_build_object('previous_status', target_obligation.status)
  );
  return cancelled_obligation;
end;
$$;

revoke all on function public.create_payment_obligation(uuid, uuid, uuid, bigint, text, text, text, uuid, uuid, uuid, text, timestamptz, timestamptz, jsonb, jsonb) from public;
revoke all on function public.cancel_payment_obligation(uuid, text) from public;
revoke execute on function public.create_payment_obligation(uuid, uuid, uuid, bigint, text, text, text, uuid, uuid, uuid, text, timestamptz, timestamptz, jsonb, jsonb) from anon;
revoke execute on function public.cancel_payment_obligation(uuid, text) from anon;
grant execute on function public.create_payment_obligation(uuid, uuid, uuid, bigint, text, text, text, uuid, uuid, uuid, text, timestamptz, timestamptz, jsonb, jsonb) to authenticated;
grant execute on function public.cancel_payment_obligation(uuid, text) to authenticated;

alter table public.payment_obligations enable row level security;

create policy "Accessible members can view payment obligations"
on public.payment_obligations
for select to authenticated
using (
  private.has_organization_role(organization_id, 'MEMBER')
  and (project_id is null or private.has_project_access(project_id))
);

create policy "Payment obligation inserts require trusted functions"
on public.payment_obligations
for insert to authenticated
with check (false);

create policy "Payment obligation updates require trusted functions"
on public.payment_obligations
for update to authenticated
using (false)
with check (false);

create policy "Payment obligation deletes are disabled"
on public.payment_obligations
for delete to authenticated
using (false);

comment on table public.payment_obligations is
  'Provider-neutral commercial payment obligations. Rows represent an amount owed from an immutable accepted commercial source; they do not represent provider settlement, entitlement, or delivery activation.';

comment on column public.payment_obligations.amount_minor is
  'Positive integer amount in the currency minor unit. This foundation currently accepts USD only and never uses floating-point money.';

comment on column public.payment_obligations.status is
  'Obligation workflow status only. Provider settlement truth is intentionally outside this domain; no succeeded state is exposed in this foundation.';