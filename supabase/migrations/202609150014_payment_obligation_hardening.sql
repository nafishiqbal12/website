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
    and not (old.status = 'PENDING' and new.status in ('CANCELLED', 'EXPIRED')) then
    raise exception using errcode = '22023', message = 'Payment obligation lifecycle transition is not allowed.';
  end if;

  return new;
end;
$$;

revoke all on function private.prevent_payment_obligation_mutation() from public;
revoke execute on function private.prevent_payment_obligation_mutation() from anon;

drop trigger if exists prevent_payment_obligation_mutation on public.payment_obligations;
create trigger prevent_payment_obligation_mutation
before update or delete on public.payment_obligations
for each row execute procedure private.prevent_payment_obligation_mutation();

create or replace function public.expire_payment_obligation(
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
  expired_obligation public.payment_obligations;
begin
  select * into target_obligation
  from public.payment_obligations
  where id = p_payment_obligation_id
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Payment obligation was not found.';
  end if;
  if not private.commercial_owner(target_obligation.organization_id) then
    raise exception using errcode = '42501', message = 'Only the organization owner can expire payment obligations.';
  end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target_obligation.status then
    raise exception using errcode = '40001', message = 'Payment obligation state changed. Refresh and retry.';
  end if;
  if target_obligation.status <> 'PENDING' then
    raise exception using errcode = '22023', message = 'Only pending payment obligations can be expired.';
  end if;
  if target_obligation.expires_at is null or target_obligation.expires_at > timezone('utc', now()) then
    raise exception using errcode = '22023', message = 'Payment obligation has not reached its expiry time.';
  end if;

  update public.payment_obligations
  set status = 'EXPIRED'
  where id = target_obligation.id
  returning * into expired_obligation;

  perform private.record_payment_obligation_audit(
    'payment_obligation_expired',
    expired_obligation.organization_id,
    expired_obligation.project_id,
    expired_obligation.id,
    jsonb_build_object('previous_status', target_obligation.status)
  );
  return expired_obligation;
end;
$$;

revoke all on function public.expire_payment_obligation(uuid, text) from public;
revoke execute on function public.expire_payment_obligation(uuid, text) from anon;
grant execute on function public.expire_payment_obligation(uuid, text) to authenticated;

comment on function public.expire_payment_obligation(uuid, text) is
  'Expires only a pending payment obligation whose explicit expiry timestamp has passed. Provider settlement and entitlement remain separate domains.';