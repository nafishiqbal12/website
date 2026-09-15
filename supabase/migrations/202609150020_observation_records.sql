create table if not exists public.observation_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  project_id uuid not null references public.projects(id) on delete restrict,
  project_service_id uuid not null references public.project_services(id) on delete restrict,
  entitlement_id uuid not null references public.entitlements(id) on delete restrict,
  delivery_activation_id uuid not null references public.delivery_activations(id) on delete restrict,
  implementation_record_id uuid not null references public.implementation_records(id) on delete restrict,
  deployment_record_id uuid not null references public.deployment_records(id) on delete restrict,
  observation_reference text not null
    constraint observation_records_reference_valid check (length(btrim(observation_reference)) between 8 and 256),
  idempotency_key text not null
    constraint observation_records_idempotency_valid check (length(btrim(idempotency_key)) between 8 and 128),
  observation_snapshot jsonb not null
    constraint observation_records_snapshot_object check (jsonb_typeof(observation_snapshot) = 'object'),
  status text not null default 'ACTIVE'
    constraint observation_records_status_valid check (status in ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED')),
  status_reason text,
  started_at timestamptz not null default timezone('utc', now()),
  paused_at timestamptz,
  completed_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint observation_records_deployment_unique unique (deployment_record_id),
  constraint observation_records_idempotency_unique unique (organization_id, idempotency_key),
  constraint observation_records_completed_time_valid check (completed_at is null or completed_at >= started_at)
);

create index if not exists observation_records_organization_created_at_idx on public.observation_records (organization_id, created_at desc);
create index if not exists observation_records_project_status_idx on public.observation_records (project_id, status, created_at desc);
create index if not exists observation_records_deployment_idx on public.observation_records (deployment_record_id, created_at desc);
create index if not exists observation_records_implementation_idx on public.observation_records (implementation_record_id, created_at desc);
create index if not exists observation_records_entitlement_idx on public.observation_records (entitlement_id, created_at desc);

alter table public.audit_events add column if not exists observation_record_id uuid references public.observation_records(id) on delete set null;

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
  'delivery_activation_activated', 'delivery_activation_paused', 'delivery_activation_resumed', 'delivery_activation_completed', 'delivery_activation_cancelled',
  'implementation_initialized', 'implementation_paused', 'implementation_resumed', 'implementation_completed', 'implementation_cancelled',
  'deployment_initialized', 'deployment_paused', 'deployment_resumed', 'deployment_completed', 'deployment_cancelled',
  'observation_initialized', 'observation_paused', 'observation_resumed', 'observation_completed', 'observation_cancelled'
));

create index if not exists audit_events_observation_record_created_at_idx on public.audit_events (observation_record_id, created_at);

create or replace function public.set_observation_record_updated_at()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin new.updated_at = timezone('utc', now()); return new; end;
$$;

drop trigger if exists set_observation_records_updated_at on public.observation_records;
create trigger set_observation_records_updated_at before update on public.observation_records for each row execute procedure public.set_observation_record_updated_at();

create or replace function private.record_observation_audit(
  p_event_type text,
  p_organization_id uuid,
  p_project_id uuid,
  p_project_service_id uuid,
  p_delivery_activation_id uuid,
  p_entitlement_id uuid,
  p_observation_record_id uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  insert into public.audit_events (event_type, actor_user_id, organization_id, project_id, project_service_id, delivery_activation_id, entitlement_id, observation_record_id, metadata)
  values (p_event_type, (select auth.uid()), p_organization_id, p_project_id, p_project_service_id, p_delivery_activation_id, p_entitlement_id, p_observation_record_id, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

revoke all on function private.record_observation_audit(text, uuid, uuid, uuid, uuid, uuid, uuid, jsonb) from public;
revoke execute on function private.record_observation_audit(text, uuid, uuid, uuid, uuid, uuid, uuid, jsonb) from anon;

create or replace function public.initialize_observation(
  p_deployment_record_id uuid,
  p_observation_reference text,
  p_idempotency_key text,
  p_observation_snapshot jsonb default '{}'::jsonb,
  p_actor_user_id uuid default null
)
returns public.observation_records
language plpgsql security definer set search_path = public, private, pg_temp as $$
declare
  actor_id uuid;
  target_deployment public.deployment_records;
  target_implementation public.implementation_records;
  target_activation public.delivery_activations;
  target_entitlement public.entitlements;
  existing_record public.observation_records;
  created_record public.observation_records;
  normalized_reference text;
  normalized_key text;
begin
  actor_id := coalesce((select auth.uid()), p_actor_user_id);
  if actor_id is null or not exists (select 1 from auth.users where id = actor_id) then raise exception using errcode = '42501', message = 'A valid trusted observation actor is required.'; end if;
  normalized_reference := btrim(coalesce(p_observation_reference, ''));
  normalized_key := btrim(coalesce(p_idempotency_key, ''));
  if length(normalized_reference) < 8 or length(normalized_reference) > 256 or length(normalized_key) < 8 or length(normalized_key) > 128 then raise exception using errcode = '22023', message = 'Observation identity is invalid.'; end if;
  if jsonb_typeof(coalesce(p_observation_snapshot, '{}'::jsonb)) <> 'object' then raise exception using errcode = '22023', message = 'Observation snapshot must be a JSON object.'; end if;

  select * into target_deployment from public.deployment_records where id = p_deployment_record_id for share;
  if not found or target_deployment.status <> 'ACTIVE' then raise exception using errcode = '22023', message = 'Observation requires an active deployment record.'; end if;
  select * into target_implementation from public.implementation_records where id = target_deployment.implementation_record_id for share;
  if not found or target_implementation.status <> 'ACTIVE' then raise exception using errcode = '22023', message = 'Observation requires an active implementation record.'; end if;
  select * into target_activation from public.delivery_activations where id = target_deployment.delivery_activation_id for share;
  if not found or target_activation.status <> 'ACTIVE' then raise exception using errcode = '22023', message = 'Observation requires an active delivery activation.'; end if;
  select * into target_entitlement from public.entitlements where id = target_deployment.entitlement_id for share;
  if not found or target_entitlement.status <> 'ACTIVE' then raise exception using errcode = '22023', message = 'Observation requires an active entitlement.'; end if;
  if target_deployment.organization_id is distinct from target_implementation.organization_id or target_deployment.project_id is distinct from target_implementation.project_id or target_deployment.project_service_id is distinct from target_implementation.project_service_id or target_deployment.delivery_activation_id is distinct from target_implementation.delivery_activation_id or target_deployment.entitlement_id is distinct from target_implementation.entitlement_id then
    raise exception using errcode = '42501', message = 'Deployment and implementation relationships do not match.';
  end if;
  if target_activation.organization_id is distinct from target_deployment.organization_id or target_activation.project_id is distinct from target_deployment.project_id or target_activation.project_service_id is distinct from target_deployment.project_service_id then
    raise exception using errcode = '42501', message = 'Delivery activation relationships do not match.';
  end if;
  if target_entitlement.organization_id is distinct from target_deployment.organization_id or target_entitlement.project_id is distinct from target_deployment.project_id or target_entitlement.project_service_id is distinct from target_deployment.project_service_id then
    raise exception using errcode = '42501', message = 'Entitlement relationships do not match.';
  end if;

  select * into existing_record from public.observation_records where organization_id = target_deployment.organization_id and idempotency_key = normalized_key for update;
  if found then
    if existing_record.deployment_record_id is distinct from target_deployment.id or existing_record.observation_reference is distinct from normalized_reference then raise exception using errcode = '23505', message = 'Observation idempotency key was already used for a different record.'; end if;
    return existing_record;
  end if;

  insert into public.observation_records (
    organization_id, project_id, project_service_id, entitlement_id, delivery_activation_id, implementation_record_id, deployment_record_id,
    observation_reference, idempotency_key, observation_snapshot, created_by
  ) values (
    target_deployment.organization_id, target_deployment.project_id, target_deployment.project_service_id, target_deployment.entitlement_id, target_deployment.delivery_activation_id, target_deployment.implementation_record_id, target_deployment.id,
    normalized_reference, normalized_key, jsonb_build_object('deployment_record_id', target_deployment.id, 'implementation_record_id', target_deployment.implementation_record_id, 'delivery_activation_id', target_deployment.delivery_activation_id, 'entitlement_id', target_deployment.entitlement_id, 'deployment_snapshot', target_deployment.deployment_snapshot, 'observation_context', coalesce(p_observation_snapshot, '{}'::jsonb)), actor_id
  ) returning * into created_record;
  perform private.record_observation_audit('observation_initialized', created_record.organization_id, created_record.project_id, created_record.project_service_id, created_record.delivery_activation_id, created_record.entitlement_id, created_record.id, jsonb_build_object('observation_reference', created_record.observation_reference));
  return created_record;
end;
$$;

create or replace function public.pause_observation_record(p_observation_record_id uuid, p_expected_status text default 'ACTIVE', p_status_reason text default null)
returns public.observation_records language plpgsql security definer set search_path = public, private, pg_temp as $$
declare target public.observation_records; changed public.observation_records;
begin
  select * into target from public.observation_records where id = p_observation_record_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Observation record was not found.'; end if;
  if not private.commercial_owner(target.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can pause observation records.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target.status or target.status <> 'ACTIVE' then raise exception using errcode = '40001', message = 'Observation record is not active or has changed. Refresh and retry.'; end if;
  update public.observation_records set status = 'PAUSED', paused_at = timezone('utc', now()), status_reason = nullif(btrim(p_status_reason), '') where id = target.id returning * into changed;
  perform private.record_observation_audit('observation_paused', changed.organization_id, changed.project_id, changed.project_service_id, changed.delivery_activation_id, changed.entitlement_id, changed.id, jsonb_build_object('previous_status', target.status, 'status_reason', changed.status_reason)); return changed;
end;
$$;

create or replace function public.resume_observation_record(p_observation_record_id uuid, p_expected_status text default 'PAUSED', p_status_reason text default null)
returns public.observation_records language plpgsql security definer set search_path = public, private, pg_temp as $$
declare target public.observation_records; changed public.observation_records;
begin
  select * into target from public.observation_records where id = p_observation_record_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Observation record was not found.'; end if;
  if not private.commercial_owner(target.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can resume observation records.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target.status or target.status <> 'PAUSED' then raise exception using errcode = '40001', message = 'Observation record is not paused or has changed. Refresh and retry.'; end if;
  update public.observation_records set status = 'ACTIVE', paused_at = null, status_reason = nullif(btrim(p_status_reason), '') where id = target.id returning * into changed;
  perform private.record_observation_audit('observation_resumed', changed.organization_id, changed.project_id, changed.project_service_id, changed.delivery_activation_id, changed.entitlement_id, changed.id, jsonb_build_object('previous_status', target.status, 'status_reason', changed.status_reason)); return changed;
end;
$$;

create or replace function public.complete_observation_record(p_observation_record_id uuid, p_expected_status text default 'ACTIVE', p_status_reason text default null)
returns public.observation_records language plpgsql security definer set search_path = public, private, pg_temp as $$
declare target public.observation_records; changed public.observation_records;
begin
  select * into target from public.observation_records where id = p_observation_record_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Observation record was not found.'; end if;
  if not private.commercial_owner(target.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can complete observation records.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target.status or target.status not in ('ACTIVE', 'PAUSED') then raise exception using errcode = '40001', message = 'Observation record is not active/paused or has changed. Refresh and retry.'; end if;
  update public.observation_records set status = 'COMPLETED', completed_at = timezone('utc', now()), status_reason = nullif(btrim(p_status_reason), '') where id = target.id returning * into changed;
  perform private.record_observation_audit('observation_completed', changed.organization_id, changed.project_id, changed.project_service_id, changed.delivery_activation_id, changed.entitlement_id, changed.id, jsonb_build_object('previous_status', target.status, 'status_reason', changed.status_reason)); return changed;
end;
$$;

create or replace function public.cancel_observation_record(p_observation_record_id uuid, p_expected_status text default 'ACTIVE', p_status_reason text default null)
returns public.observation_records language plpgsql security definer set search_path = public, private, pg_temp as $$
declare target public.observation_records; changed public.observation_records;
begin
  select * into target from public.observation_records where id = p_observation_record_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Observation record was not found.'; end if;
  if not private.commercial_owner(target.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can cancel observation records.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target.status or target.status not in ('ACTIVE', 'PAUSED') then raise exception using errcode = '40001', message = 'Observation record is not active/paused or has changed. Refresh and retry.'; end if;
  update public.observation_records set status = 'CANCELLED', status_reason = nullif(btrim(p_status_reason), '') where id = target.id returning * into changed;
  perform private.record_observation_audit('observation_cancelled', changed.organization_id, changed.project_id, changed.project_service_id, changed.delivery_activation_id, changed.entitlement_id, changed.id, jsonb_build_object('previous_status', target.status, 'status_reason', changed.status_reason)); return changed;
end;
$$;

create or replace function private.prevent_observation_record_mutation()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if tg_op = 'DELETE' then raise exception using errcode = '42501', message = 'Observation history cannot be deleted.'; end if;
  if old.id is distinct from new.id or old.organization_id is distinct from new.organization_id or old.project_id is distinct from new.project_id or old.project_service_id is distinct from new.project_service_id or old.entitlement_id is distinct from new.entitlement_id or old.delivery_activation_id is distinct from new.delivery_activation_id or old.implementation_record_id is distinct from new.implementation_record_id or old.deployment_record_id is distinct from new.deployment_record_id or old.observation_reference is distinct from new.observation_reference or old.idempotency_key is distinct from new.idempotency_key or old.observation_snapshot is distinct from new.observation_snapshot or old.started_at is distinct from new.started_at or old.created_by is distinct from new.created_by or old.created_at is distinct from new.created_at then
    raise exception using errcode = '42501', message = 'Observation source and configuration fields are immutable.';
  end if;
  if new.status is distinct from old.status and not ((old.status = 'ACTIVE' and new.status in ('PAUSED', 'COMPLETED', 'CANCELLED')) or (old.status = 'PAUSED' and new.status in ('ACTIVE', 'COMPLETED', 'CANCELLED'))) then
    raise exception using errcode = '22023', message = 'Observation lifecycle transition is not allowed.';
  end if;
  return new;
end;
$$;

revoke all on function private.prevent_observation_record_mutation() from public;
revoke execute on function private.prevent_observation_record_mutation() from anon;
drop trigger if exists prevent_observation_record_mutation on public.observation_records;
create trigger prevent_observation_record_mutation before update or delete on public.observation_records for each row execute procedure private.prevent_observation_record_mutation();

revoke all on function public.initialize_observation(uuid, text, text, jsonb, uuid) from public;
revoke execute on function public.initialize_observation(uuid, text, text, jsonb, uuid) from anon, authenticated;
grant execute on function public.initialize_observation(uuid, text, text, jsonb, uuid) to service_role;

revoke all on function public.pause_observation_record(uuid, text, text) from public;
revoke all on function public.resume_observation_record(uuid, text, text) from public;
revoke all on function public.complete_observation_record(uuid, text, text) from public;
revoke all on function public.cancel_observation_record(uuid, text, text) from public;
revoke execute on function public.pause_observation_record(uuid, text, text) from anon;
revoke execute on function public.resume_observation_record(uuid, text, text) from anon;
revoke execute on function public.complete_observation_record(uuid, text, text) from anon;
revoke execute on function public.cancel_observation_record(uuid, text, text) from anon;
grant execute on function public.pause_observation_record(uuid, text, text) to authenticated;
grant execute on function public.resume_observation_record(uuid, text, text) to authenticated;
grant execute on function public.complete_observation_record(uuid, text, text) to authenticated;
grant execute on function public.cancel_observation_record(uuid, text, text) to authenticated;

alter table public.observation_records enable row level security;
create policy "Accessible members can view observation records" on public.observation_records for select to authenticated using (private.has_organization_role(organization_id, 'MEMBER') and private.has_project_access(project_id));
create policy "Observation record inserts require trusted functions" on public.observation_records for insert to authenticated with check (false);
create policy "Observation record updates require trusted functions" on public.observation_records for update to authenticated using (false) with check (false);
create policy "Observation record deletes are disabled" on public.observation_records for delete to authenticated using (false);

comment on table public.observation_records is 'Provider-neutral paid implementation observation record initialized only from a valid active deployment and its complete upstream lifecycle chain. It does not automate monitoring or stabilization.';
comment on function public.initialize_observation(uuid, text, text, jsonb, uuid) is 'Service-role-only observation initialization boundary requiring active entitlement, delivery activation, implementation, and deployment records with consistent source relationships.';