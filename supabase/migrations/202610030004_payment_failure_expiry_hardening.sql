create or replace function private.prevent_payment_obligation_mutation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    raise exception using errcode = '42501', message = 'Payment obligation history cannot be deleted.';
  end if;

  if old.id is distinct from new.id
    or old.organization_id is distinct from new.organization_id
    or old.project_id is distinct from new.project_id
    or old.proposal_id is distinct from new.proposal_id
    or old.proposal_version_id is distinct from new.proposal_version_id
    or old.agreement_id is distinct from new.agreement_id
    or old.agreement_version_id is distinct from new.agreement_version_id
    or old.payment_purpose is distinct from new.payment_purpose
    or old.schedule_type is distinct from new.schedule_type
    or old.amount_minor is distinct from new.amount_minor
    or old.currency is distinct from new.currency
    or old.due_at is distinct from new.due_at
    or old.expires_at is distinct from new.expires_at
    or old.commercial_snapshot is distinct from new.commercial_snapshot
    or old.schedule_snapshot is distinct from new.schedule_snapshot
    or old.idempotency_key is distinct from new.idempotency_key
    or old.created_by is distinct from new.created_by
    or old.created_at is distinct from new.created_at then
    raise exception using errcode = '42501', message = 'Payment obligation source and snapshot fields are immutable.';
  end if;

  if new.status is distinct from old.status
    and exists (
      select 1
      from public.payment_settlements settlement
      where settlement.payment_obligation_id = old.id
    ) then
    raise exception using errcode = '22023', message = 'A payment obligation with a verified settlement cannot change lifecycle state.';
  end if;

  if new.status is distinct from old.status
    and not (old.status = 'PENDING' and new.status in ('CANCELLED', 'EXPIRED')) then
    raise exception using errcode = '22023', message = 'Payment obligation lifecycle transition is not allowed.';
  end if;

  return new;
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
    and exists (
      select 1
      from public.payment_settlements settlement
      where settlement.payment_attempt_id = old.id
    ) then
    raise exception using errcode = '22023', message = 'A payment attempt with a verified settlement cannot change lifecycle state.';
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

revoke all on function private.prevent_payment_obligation_mutation() from public;
revoke execute on function private.prevent_payment_obligation_mutation() from anon, authenticated;
revoke all on function private.prevent_payment_attempt_mutation() from public;
revoke execute on function private.prevent_payment_attempt_mutation() from anon, authenticated;

comment on function private.prevent_payment_obligation_mutation() is
  'Payment obligation source fields are immutable, and lifecycle state cannot change after verified settlement.';

comment on function private.prevent_payment_attempt_mutation() is
  'Payment attempt source fields are immutable, and lifecycle state cannot change after verified settlement.';
