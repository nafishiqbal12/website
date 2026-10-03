create or replace function public.accept_agreement(
  p_agreement_id uuid,
  p_agreement_version_id uuid,
  p_idempotency_key text
)
returns public.agreement_acceptances
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_agreement public.agreements;
  target_version public.agreement_versions;
  existing_acceptance public.agreement_acceptances;
  created_acceptance public.agreement_acceptances;
  normalized_key text;
begin
  normalized_key := btrim(coalesce(p_idempotency_key, ''));
  if length(normalized_key) < 8 or length(normalized_key) > 128 then
    raise exception using errcode = '22023', message = 'Agreement acceptance idempotency key is invalid.';
  end if;

  select * into target_agreement
  from public.agreements
  where id = p_agreement_id
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Agreement was not found.';
  end if;
  if not private.commercial_owner(target_agreement.organization_id) then
    raise exception using errcode = '42501', message = 'Only the organization owner can accept agreements.';
  end if;
  if target_agreement.status not in ('DRAFT', 'PENDING_ACCEPTANCE') then
    raise exception using errcode = '22023', message = 'Only a pending agreement can be accepted.';
  end if;

  select * into target_version
  from public.agreement_versions
  where id = p_agreement_version_id
    and agreement_id = p_agreement_id
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Agreement version was not found.';
  end if;
  if target_version.status not in ('DRAFT', 'PENDING_ACCEPTANCE') then
    raise exception using errcode = '22023', message = 'Only a pending agreement version can be accepted.';
  end if;

  select * into existing_acceptance
  from public.agreement_acceptances
  where agreement_id = p_agreement_id
    and idempotency_key = normalized_key
  for update;
  if found then
    if existing_acceptance.agreement_version_id is distinct from target_version.id
      or existing_acceptance.accepted_version_number is distinct from target_version.version_number
      or existing_acceptance.content_checksum is distinct from target_version.content_checksum then
      raise exception using errcode = '23505', message = 'Agreement acceptance idempotency key was already used for a different version.';
    end if;
    return existing_acceptance;
  end if;

  insert into public.agreement_acceptances (
    agreement_id,
    agreement_version_id,
    organization_id,
    accepting_user_id,
    accepted_version_number,
    content_checksum,
    idempotency_key
  ) values (
    p_agreement_id,
    p_agreement_version_id,
    target_agreement.organization_id,
    (select auth.uid()),
    target_version.version_number,
    target_version.content_checksum,
    normalized_key
  ) returning * into created_acceptance;

  update public.agreement_versions
  set status = 'ACTIVE', effective_at = coalesce(effective_at, timezone('utc', now()))
  where id = p_agreement_version_id;
  update public.agreements
  set status = 'ACTIVE', effective_at = coalesce(effective_at, timezone('utc', now()))
  where id = p_agreement_id;

  perform private.record_commercial_audit(
    'agreement_accepted',
    target_agreement.organization_id,
    target_agreement.project_id,
    null,
    null,
    p_agreement_id,
    p_agreement_version_id,
    jsonb_build_object('acceptance_id', created_acceptance.id)
  );
  perform private.record_commercial_audit(
    'agreement_activated',
    target_agreement.organization_id,
    target_agreement.project_id,
    null,
    null,
    p_agreement_id,
    p_agreement_version_id
  );
  return created_acceptance;
end;
$$;

revoke all on function public.accept_agreement(uuid, uuid, text) from public;
revoke execute on function public.accept_agreement(uuid, uuid, text) from anon;
grant execute on function public.accept_agreement(uuid, uuid, text) to authenticated;

revoke execute on function public.activate_entitlement(uuid, uuid, text, timestamptz, timestamptz, text, jsonb, jsonb, uuid) from service_role;

comment on function public.activate_entitlement(uuid, uuid, text, timestamptz, timestamptz, text, jsonb, jsonb, uuid) is
  'Legacy direct entitlement activation is disabled. Entitlements must be created through the verified settlement activation boundary.';
