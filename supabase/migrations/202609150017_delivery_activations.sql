drop function if exists public.activate_entitlement(uuid, uuid, text, timestamptz, timestamptz, text, jsonb, jsonb);

create or replace function public.activate_entitlement(
  p_payment_obligation_id uuid,
  p_project_service_id uuid,
  p_activation_reference text,
  p_starts_at timestamptz,
  p_ends_at timestamptz default null,
  p_idempotency_key text default null,
  p_scope_snapshot jsonb default '{}'::jsonb,
  p_activation_context jsonb default '{}'::jsonb,
  p_actor_user_id uuid default null
)
returns public.entitlements
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  actor_id uuid;
  target_obligation public.payment_obligations;
  target_project_service public.project_services;
  target_proposal public.proposals;
  target_version public.proposal_versions;
  target_agreement public.agreements;
  target_agreement_version public.agreement_versions;
  existing_entitlement public.entitlements;
  created_entitlement public.entitlements;
  normalized_reference text;
  normalized_key text;
  source_snapshot jsonb;
begin
  actor_id := coalesce((select auth.uid()), p_actor_user_id);
  if actor_id is null or not exists (select 1 from auth.users where id = actor_id) then
    raise exception using errcode = '42501', message = 'A valid trusted activation actor is required.';
  end if;
  normalized_reference := btrim(coalesce(p_activation_reference, ''));
  normalized_key := btrim(coalesce(p_idempotency_key, ''));
  if length(normalized_reference) < 8 or length(normalized_reference) > 256 then
    raise exception using errcode = '22023', message = 'Entitlement activation reference is invalid.';
  end if;
  if length(normalized_key) < 8 or length(normalized_key) > 128 then
    raise exception using errcode = '22023', message = 'Entitlement idempotency key is invalid.';
  end if;
  if p_starts_at is null or p_ends_at is not null and p_ends_at <= p_starts_at then
    raise exception using errcode = '22023', message = 'Entitlement date window is invalid.';
  end if;
  if jsonb_typeof(coalesce(p_scope_snapshot, '{}'::jsonb)) <> 'object'
    or jsonb_typeof(coalesce(p_activation_context, '{}'::jsonb)) <> 'object' then
    raise exception using errcode = '22023', message = 'Entitlement snapshots must be JSON objects.';
  end if;

  select * into target_obligation from public.payment_obligations where id = p_payment_obligation_id for share;
  if not found then raise exception using errcode = 'P0002', message = 'Payment obligation was not found.'; end if;
  if target_obligation.status <> 'PENDING' then
    raise exception using errcode = '22023', message = 'Entitlement activation requires a pending payment obligation.';
  end if;
  select * into target_project_service from public.project_services where id = p_project_service_id for share;
  if not found then raise exception using errcode = 'P0002', message = 'Project service was not found.'; end if;
  if not exists (
    select 1 from public.projects project
    where project.id = target_project_service.project_id
      and project.organization_id = target_obligation.organization_id
      and project.status <> 'ARCHIVED'
  ) or target_obligation.project_id is distinct from target_project_service.project_id then
    raise exception using errcode = '42501', message = 'Project service does not match the payment obligation organization/project.';
  end if;

  select * into target_proposal from public.proposals where id = target_obligation.proposal_id and organization_id = target_obligation.organization_id for share;
  if not found then raise exception using errcode = '42501', message = 'Entitlement proposal source is outside the organization.'; end if;
  select * into target_version
  from public.proposal_versions
  where id = target_obligation.proposal_version_id and proposal_id = target_proposal.id and status = 'ACCEPTED' and target_proposal.current_version_id = id
  for share;
  if not found then raise exception using errcode = '22023', message = 'Entitlement proposal source must be the accepted current version.'; end if;
  if not exists (select 1 from public.proposal_items item where item.proposal_version_id = target_version.id and item.project_service_id = target_project_service.id) then
    raise exception using errcode = '42501', message = 'Project service is not included in the entitlement proposal scope.';
  end if;

  if target_obligation.agreement_id is not null then
    select * into target_agreement from public.agreements where id = target_obligation.agreement_id and organization_id = target_obligation.organization_id for share;
    if not found then raise exception using errcode = '42501', message = 'Entitlement agreement source is outside the organization.'; end if;
    select * into target_agreement_version from public.agreement_versions where id = target_obligation.agreement_version_id and agreement_id = target_agreement.id and status = 'ACTIVE' for share;
    if not found or not exists (select 1 from public.agreement_acceptances acceptance where acceptance.agreement_id = target_agreement.id and acceptance.agreement_version_id = target_agreement_version.id) then
      raise exception using errcode = '22023', message = 'Entitlement agreement source must be the accepted active version.';
    end if;
  end if;

  select * into existing_entitlement from public.entitlements where organization_id = target_obligation.organization_id and idempotency_key = normalized_key for update;
  if found then
    if existing_entitlement.payment_obligation_id is distinct from target_obligation.id or existing_entitlement.project_service_id is distinct from target_project_service.id or existing_entitlement.activation_reference is distinct from normalized_reference then
      raise exception using errcode = '23505', message = 'Entitlement idempotency key was already used for a different grant.';
    end if;
    return existing_entitlement;
  end if;

  source_snapshot := jsonb_build_object(
    'payment_obligation_id', target_obligation.id,
    'proposal_id', target_obligation.proposal_id,
    'proposal_version_id', target_obligation.proposal_version_id,
    'agreement_id', target_obligation.agreement_id,
    'agreement_version_id', target_obligation.agreement_version_id,
    'project_id', target_project_service.project_id,
    'project_service_id', target_project_service.id,
    'activation_reference', normalized_reference,
    'activation_context', coalesce(p_activation_context, '{}'::jsonb),
    'payment_obligation_snapshot', target_obligation.commercial_snapshot
  );

  insert into public.entitlements (
    organization_id, project_id, project_service_id, payment_obligation_id, proposal_id, proposal_version_id,
    agreement_id, agreement_version_id, source_type, status, starts_at, ends_at, scope_snapshot, source_snapshot,
    activation_reference, idempotency_key, created_by
  ) values (
    target_obligation.organization_id, target_project_service.project_id, target_project_service.id, target_obligation.id, target_obligation.proposal_id, target_obligation.proposal_version_id,
    target_obligation.agreement_id, target_obligation.agreement_version_id, 'VERIFIED_COMMERCIAL_EVENT', 'ACTIVE', p_starts_at, p_ends_at, coalesce(p_scope_snapshot, '{}'::jsonb), source_snapshot,
    normalized_reference, normalized_key, actor_id
  ) returning * into created_entitlement;

  perform private.record_entitlement_audit('entitlement_activated', created_entitlement.organization_id, created_entitlement.project_id, created_entitlement.id, created_entitlement.payment_obligation_id, jsonb_build_object('activation_reference', created_entitlement.activation_reference));
  return created_entitlement;
end;
$$;

revoke all on function public.activate_entitlement(uuid, uuid, text, timestamptz, timestamptz, text, jsonb, jsonb, uuid) from public;
revoke execute on function public.activate_entitlement(uuid, uuid, text, timestamptz, timestamptz, text, jsonb, jsonb, uuid) from anon, authenticated;
grant execute on function public.activate_entitlement(uuid, uuid, text, timestamptz, timestamptz, text, jsonb, jsonb, uuid) to service_role;

create table if not exists public.delivery_activations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  project_id uuid not null references public.projects(id) on delete restrict,
  project_service_id uuid not null references public.project_services(id) on delete restrict,
  entitlement_id uuid not null references public.entitlements(id) on delete restrict,
  status text not null default 'ACTIVE'
    constraint delivery_activations_status_valid check (status in ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED')),
  delivery_stage text not null default 'IMPLEMENTATION'
    constraint delivery_activations_stage_valid check (delivery_stage in ('IMPLEMENTATION', 'DEPLOYMENT', 'OBSERVATION', 'STABILIZATION', 'DOCUMENTATION', 'HANDOVER', 'ONGOING_SERVICE')),
  activation_snapshot jsonb not null
    constraint delivery_activations_snapshot_object check (jsonb_typeof(activation_snapshot) = 'object'),
  activation_reference text not null
    constraint delivery_activations_reference_valid check (length(btrim(activation_reference)) between 8 and 256),
  idempotency_key text not null
    constraint delivery_activations_idempotency_valid check (length(btrim(idempotency_key)) between 8 and 128),
  status_reason text,
  activated_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint delivery_activations_entitlement_unique unique (entitlement_id),
  constraint delivery_activations_idempotency_unique unique (organization_id, idempotency_key),
  constraint delivery_activations_completed_time_valid check (completed_at is null or completed_at >= activated_at)
);

create index if not exists delivery_activations_organization_created_at_idx on public.delivery_activations (organization_id, created_at desc);
create index if not exists delivery_activations_project_status_idx on public.delivery_activations (project_id, status, created_at desc);
create index if not exists delivery_activations_project_service_idx on public.delivery_activations (project_service_id, created_at desc);
create index if not exists delivery_activations_entitlement_idx on public.delivery_activations (entitlement_id, created_at desc);

alter table public.audit_events
  add column if not exists delivery_activation_id uuid references public.delivery_activations(id) on delete set null;

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
  'entitlement_activated', 'entitlement_paused', 'entitlement_resumed', 'entitlement_expired', 'entitlement_cancelled',
  'delivery_activation_activated', 'delivery_activation_paused', 'delivery_activation_resumed', 'delivery_activation_completed', 'delivery_activation_cancelled'
));

create index if not exists audit_events_delivery_activation_created_at_idx on public.audit_events (delivery_activation_id, created_at);

create or replace function public.set_delivery_activation_updated_at()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin new.updated_at = timezone('utc', now()); return new; end;
$$;

drop trigger if exists set_delivery_activations_updated_at on public.delivery_activations;
create trigger set_delivery_activations_updated_at before update on public.delivery_activations for each row execute procedure public.set_delivery_activation_updated_at();

create or replace function private.record_delivery_activation_audit(
  p_event_type text,
  p_organization_id uuid,
  p_project_id uuid,
  p_entitlement_id uuid,
  p_delivery_activation_id uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  insert into public.audit_events (event_type, actor_user_id, organization_id, project_id, entitlement_id, delivery_activation_id, metadata)
  values (p_event_type, (select auth.uid()), p_organization_id, p_project_id, p_entitlement_id, p_delivery_activation_id, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

revoke all on function private.record_delivery_activation_audit(text, uuid, uuid, uuid, uuid, jsonb) from public;
revoke execute on function private.record_delivery_activation_audit(text, uuid, uuid, uuid, uuid, jsonb) from anon;

create or replace function public.activate_delivery(
  p_entitlement_id uuid,
  p_activation_reference text,
  p_idempotency_key text,
  p_activation_context jsonb default '{}'::jsonb,
  p_actor_user_id uuid default null
)
returns public.delivery_activations
language plpgsql security definer set search_path = public, private, pg_temp as $$
declare
  actor_id uuid;
  target_entitlement public.entitlements;
  target_activation public.delivery_activations;
  created_activation public.delivery_activations;
  normalized_reference text;
  normalized_key text;
begin
  actor_id := coalesce((select auth.uid()), p_actor_user_id);
  if actor_id is null or not exists (select 1 from auth.users where id = actor_id) then raise exception using errcode = '42501', message = 'A valid trusted activation actor is required.'; end if;
  normalized_reference := btrim(coalesce(p_activation_reference, ''));
  normalized_key := btrim(coalesce(p_idempotency_key, ''));
  if length(normalized_reference) < 8 or length(normalized_reference) > 256 or length(normalized_key) < 8 or length(normalized_key) > 128 then raise exception using errcode = '22023', message = 'Delivery activation identity is invalid.'; end if;
  if jsonb_typeof(coalesce(p_activation_context, '{}'::jsonb)) <> 'object' then raise exception using errcode = '22023', message = 'Delivery activation context must be a JSON object.'; end if;

  select * into target_entitlement from public.entitlements where id = p_entitlement_id for share;
  if not found then raise exception using errcode = 'P0002', message = 'Entitlement was not found.'; end if;
  if target_entitlement.status <> 'ACTIVE' then raise exception using errcode = '22023', message = 'Delivery activation requires an active entitlement.'; end if;
  if target_entitlement.ends_at is not null and target_entitlement.ends_at <= timezone('utc', now()) then raise exception using errcode = '22023', message = 'Expired entitlements cannot activate delivery.'; end if;

  select * into target_activation from public.delivery_activations where organization_id = target_entitlement.organization_id and idempotency_key = normalized_key for update;
  if found then
    if target_activation.entitlement_id is distinct from target_entitlement.id or target_activation.activation_reference is distinct from normalized_reference then raise exception using errcode = '23505', message = 'Delivery activation idempotency key was already used for a different activation.'; end if;
    return target_activation;
  end if;
  if exists (select 1 from public.delivery_activations where entitlement_id = target_entitlement.id and status in ('ACTIVE', 'PAUSED')) then raise exception using errcode = '23505', message = 'This entitlement already has an active delivery activation.'; end if;

  insert into public.delivery_activations (organization_id, project_id, project_service_id, entitlement_id, delivery_stage, activation_snapshot, activation_reference, idempotency_key, created_by)
  values (target_entitlement.organization_id, target_entitlement.project_id, target_entitlement.project_service_id, target_entitlement.id, 'IMPLEMENTATION', jsonb_build_object('entitlement_id', target_entitlement.id, 'payment_obligation_id', target_entitlement.payment_obligation_id, 'project_service_id', target_entitlement.project_service_id, 'activation_context', coalesce(p_activation_context, '{}'::jsonb)), normalized_reference, normalized_key, actor_id)
  returning * into created_activation;
  perform private.record_delivery_activation_audit('delivery_activation_activated', created_activation.organization_id, created_activation.project_id, created_activation.entitlement_id, created_activation.id, jsonb_build_object('delivery_stage', created_activation.delivery_stage, 'activation_reference', created_activation.activation_reference));
  return created_activation;
end;
$$;

create or replace function public.pause_delivery_activation(p_delivery_activation_id uuid, p_expected_status text default 'ACTIVE', p_status_reason text default null)
returns public.delivery_activations language plpgsql security definer set search_path = public, private, pg_temp as $$
declare target public.delivery_activations; changed public.delivery_activations;
begin
  select * into target from public.delivery_activations where id = p_delivery_activation_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Delivery activation was not found.'; end if;
  if not private.commercial_owner(target.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can pause delivery activations.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target.status or target.status <> 'ACTIVE' then raise exception using errcode = '40001', message = 'Delivery activation is not active or has changed. Refresh and retry.'; end if;
  update public.delivery_activations set status = 'PAUSED', status_reason = nullif(btrim(p_status_reason), '') where id = target.id returning * into changed;
  perform private.record_delivery_activation_audit('delivery_activation_paused', changed.organization_id, changed.project_id, changed.entitlement_id, changed.id, jsonb_build_object('previous_status', target.status, 'status_reason', changed.status_reason)); return changed;
end;
$$;

create or replace function public.resume_delivery_activation(p_delivery_activation_id uuid, p_expected_status text default 'PAUSED', p_status_reason text default null)
returns public.delivery_activations language plpgsql security definer set search_path = public, private, pg_temp as $$
declare target public.delivery_activations; changed public.delivery_activations;
begin
  select * into target from public.delivery_activations where id = p_delivery_activation_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Delivery activation was not found.'; end if;
  if not private.commercial_owner(target.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can resume delivery activations.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target.status or target.status <> 'PAUSED' then raise exception using errcode = '40001', message = 'Delivery activation is not paused or has changed. Refresh and retry.'; end if;
  update public.delivery_activations set status = 'ACTIVE', status_reason = nullif(btrim(p_status_reason), '') where id = target.id returning * into changed;
  perform private.record_delivery_activation_audit('delivery_activation_resumed', changed.organization_id, changed.project_id, changed.entitlement_id, changed.id, jsonb_build_object('previous_status', target.status, 'status_reason', changed.status_reason)); return changed;
end;
$$;

create or replace function public.complete_delivery_activation(p_delivery_activation_id uuid, p_expected_status text default 'ACTIVE', p_status_reason text default null)
returns public.delivery_activations language plpgsql security definer set search_path = public, private, pg_temp as $$
declare target public.delivery_activations; changed public.delivery_activations;
begin
  select * into target from public.delivery_activations where id = p_delivery_activation_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Delivery activation was not found.'; end if;
  if not private.commercial_owner(target.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can complete delivery activations.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target.status or target.status not in ('ACTIVE', 'PAUSED') then raise exception using errcode = '40001', message = 'Delivery activation is not active/paused or has changed. Refresh and retry.'; end if;
  update public.delivery_activations set status = 'COMPLETED', completed_at = timezone('utc', now()), status_reason = nullif(btrim(p_status_reason), '') where id = target.id returning * into changed;
  perform private.record_delivery_activation_audit('delivery_activation_completed', changed.organization_id, changed.project_id, changed.entitlement_id, changed.id, jsonb_build_object('previous_status', target.status, 'status_reason', changed.status_reason)); return changed;
end;
$$;

create or replace function public.cancel_delivery_activation(p_delivery_activation_id uuid, p_expected_status text default 'ACTIVE', p_status_reason text default null)
returns public.delivery_activations language plpgsql security definer set search_path = public, private, pg_temp as $$
declare target public.delivery_activations; changed public.delivery_activations;
begin
  select * into target from public.delivery_activations where id = p_delivery_activation_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Delivery activation was not found.'; end if;
  if not private.commercial_owner(target.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can cancel delivery activations.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target.status or target.status not in ('ACTIVE', 'PAUSED') then raise exception using errcode = '40001', message = 'Delivery activation is not active/paused or has changed. Refresh and retry.'; end if;
  update public.delivery_activations set status = 'CANCELLED', status_reason = nullif(btrim(p_status_reason), '') where id = target.id returning * into changed;
  perform private.record_delivery_activation_audit('delivery_activation_cancelled', changed.organization_id, changed.project_id, changed.entitlement_id, changed.id, jsonb_build_object('previous_status', target.status, 'status_reason', changed.status_reason)); return changed;
end;
$$;

create or replace function private.prevent_delivery_activation_mutation()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if tg_op = 'DELETE' then raise exception using errcode = '42501', message = 'Delivery activation history cannot be deleted.'; end if;
  if old.id is distinct from new.id or old.organization_id is distinct from new.organization_id or old.project_id is distinct from new.project_id or old.project_service_id is distinct from new.project_service_id or old.entitlement_id is distinct from new.entitlement_id or old.delivery_stage is distinct from new.delivery_stage or old.activation_snapshot is distinct from new.activation_snapshot or old.activation_reference is distinct from new.activation_reference or old.idempotency_key is distinct from new.idempotency_key or old.activated_at is distinct from new.activated_at or old.created_by is distinct from new.created_by or old.created_at is distinct from new.created_at then
    raise exception using errcode = '42501', message = 'Delivery activation source and grant fields are immutable.';
  end if;
  if new.status is distinct from old.status and not ((old.status = 'ACTIVE' and new.status in ('PAUSED', 'COMPLETED', 'CANCELLED')) or (old.status = 'PAUSED' and new.status in ('ACTIVE', 'COMPLETED', 'CANCELLED'))) then
    raise exception using errcode = '22023', message = 'Delivery activation lifecycle transition is not allowed.';
  end if;
  if new.delivery_stage is distinct from old.delivery_stage then raise exception using errcode = '22023', message = 'Delivery stage progression is deferred to a future lifecycle operation.'; end if;
  return new;
end;
$$;

revoke all on function private.prevent_delivery_activation_mutation() from public;
revoke execute on function private.prevent_delivery_activation_mutation() from anon;
drop trigger if exists prevent_delivery_activation_mutation on public.delivery_activations;
create trigger prevent_delivery_activation_mutation before update or delete on public.delivery_activations for each row execute procedure private.prevent_delivery_activation_mutation();

revoke all on function public.activate_delivery(uuid, text, text, jsonb, uuid) from public;
revoke execute on function public.activate_delivery(uuid, text, text, jsonb, uuid) from anon, authenticated;
grant execute on function public.activate_delivery(uuid, text, text, jsonb, uuid) to service_role;

revoke all on function public.pause_delivery_activation(uuid, text, text) from public;
revoke all on function public.resume_delivery_activation(uuid, text, text) from public;
revoke all on function public.complete_delivery_activation(uuid, text, text) from public;
revoke all on function public.cancel_delivery_activation(uuid, text, text) from public;
revoke execute on function public.pause_delivery_activation(uuid, text, text) from anon;
revoke execute on function public.resume_delivery_activation(uuid, text, text) from anon;
revoke execute on function public.complete_delivery_activation(uuid, text, text) from anon;
revoke execute on function public.cancel_delivery_activation(uuid, text, text) from anon;
grant execute on function public.pause_delivery_activation(uuid, text, text) to authenticated;
grant execute on function public.resume_delivery_activation(uuid, text, text) to authenticated;
grant execute on function public.complete_delivery_activation(uuid, text, text) to authenticated;
grant execute on function public.cancel_delivery_activation(uuid, text, text) to authenticated;

alter table public.delivery_activations enable row level security;
create policy "Accessible members can view delivery activations" on public.delivery_activations for select to authenticated using (private.has_organization_role(organization_id, 'MEMBER') and private.has_project_access(project_id));
create policy "Delivery activation inserts require trusted functions" on public.delivery_activations for insert to authenticated with check (false);
create policy "Delivery activation updates require trusted functions" on public.delivery_activations for update to authenticated using (false) with check (false);
create policy "Delivery activation deletes are disabled" on public.delivery_activations for delete to authenticated using (false);

comment on table public.delivery_activations is 'Provider-neutral admission of an active entitlement into the BlockWaveLab delivery lifecycle. Activation begins at IMPLEMENTATION and does not imply payment settlement or delivery completion.';
comment on function public.activate_delivery(uuid, text, text, jsonb, uuid) is 'Service-role-only delivery activation boundary requiring an ACTIVE entitlement. Payment attempts and obligations do not call this function.';