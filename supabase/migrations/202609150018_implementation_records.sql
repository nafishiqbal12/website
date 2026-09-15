create table if not exists public.implementation_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  project_id uuid not null references public.projects(id) on delete restrict,
  project_service_id uuid not null references public.project_services(id) on delete restrict,
  delivery_activation_id uuid not null references public.delivery_activations(id) on delete restrict,
  entitlement_id uuid not null references public.entitlements(id) on delete restrict,
  status text not null default 'ACTIVE'
    constraint implementation_records_status_valid check (status in ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED')),
  implementation_reference text not null
    constraint implementation_records_reference_valid check (length(btrim(implementation_reference)) between 8 and 256),
  scope_snapshot jsonb not null
    constraint implementation_records_scope_snapshot_object check (jsonb_typeof(scope_snapshot) = 'object'),
  source_snapshot jsonb not null
    constraint implementation_records_source_snapshot_object check (jsonb_typeof(source_snapshot) = 'object'),
  idempotency_key text not null
    constraint implementation_records_idempotency_valid check (length(btrim(idempotency_key)) between 8 and 128),
  status_reason text,
  started_at timestamptz not null default timezone('utc', now()),
  paused_at timestamptz,
  completed_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint implementation_records_activation_unique unique (delivery_activation_id),
  constraint implementation_records_idempotency_unique unique (organization_id, idempotency_key),
  constraint implementation_records_completed_time_valid check (completed_at is null or completed_at >= started_at)
);

create index if not exists implementation_records_organization_created_at_idx on public.implementation_records (organization_id, created_at desc);
create index if not exists implementation_records_project_status_idx on public.implementation_records (project_id, status, created_at desc);
create index if not exists implementation_records_project_service_idx on public.implementation_records (project_service_id, created_at desc);
create index if not exists implementation_records_delivery_activation_idx on public.implementation_records (delivery_activation_id, created_at desc);
create index if not exists implementation_records_entitlement_idx on public.implementation_records (entitlement_id, created_at desc);

alter table public.audit_events
  add column if not exists implementation_record_id uuid references public.implementation_records(id) on delete set null;

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
  'implementation_initialized', 'implementation_paused', 'implementation_resumed', 'implementation_completed', 'implementation_cancelled'
));

create index if not exists audit_events_implementation_record_created_at_idx on public.audit_events (implementation_record_id, created_at);

create or replace function public.set_implementation_record_updated_at()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin new.updated_at = timezone('utc', now()); return new; end;
$$;

drop trigger if exists set_implementation_records_updated_at on public.implementation_records;
create trigger set_implementation_records_updated_at before update on public.implementation_records for each row execute procedure public.set_implementation_record_updated_at();

create or replace function private.record_implementation_audit(
  p_event_type text,
  p_organization_id uuid,
  p_project_id uuid,
  p_project_service_id uuid,
  p_delivery_activation_id uuid,
  p_entitlement_id uuid,
  p_implementation_record_id uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  insert into public.audit_events (event_type, actor_user_id, organization_id, project_id, project_service_id, delivery_activation_id, entitlement_id, implementation_record_id, metadata)
  values (p_event_type, (select auth.uid()), p_organization_id, p_project_id, p_project_service_id, p_delivery_activation_id, p_entitlement_id, p_implementation_record_id, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

revoke all on function private.record_implementation_audit(text, uuid, uuid, uuid, uuid, uuid, uuid, jsonb) from public;
revoke execute on function private.record_implementation_audit(text, uuid, uuid, uuid, uuid, uuid, uuid, jsonb) from anon;

create or replace function public.initialize_implementation(
  p_delivery_activation_id uuid,
  p_implementation_reference text,
  p_idempotency_key text,
  p_scope_snapshot jsonb default '{}'::jsonb,
  p_source_context jsonb default '{}'::jsonb,
  p_actor_user_id uuid default null
)
returns public.implementation_records
language plpgsql security definer set search_path = public, private, pg_temp as $$
declare
  actor_id uuid;
  target_activation public.delivery_activations;
  target_entitlement public.entitlements;
  target_service public.project_services;
  existing_record public.implementation_records;
  created_record public.implementation_records;
  normalized_reference text;
  normalized_key text;
  source_snapshot jsonb;
begin
  actor_id := coalesce((select auth.uid()), p_actor_user_id);
  if actor_id is null or not exists (select 1 from auth.users where id = actor_id) then raise exception using errcode = '42501', message = 'A valid trusted implementation actor is required.'; end if;
  normalized_reference := btrim(coalesce(p_implementation_reference, ''));
  normalized_key := btrim(coalesce(p_idempotency_key, ''));
  if length(normalized_reference) < 8 or length(normalized_reference) > 256 or length(normalized_key) < 8 or length(normalized_key) > 128 then raise exception using errcode = '22023', message = 'Implementation identity is invalid.'; end if;
  if jsonb_typeof(coalesce(p_scope_snapshot, '{}'::jsonb)) <> 'object' or jsonb_typeof(coalesce(p_source_context, '{}'::jsonb)) <> 'object' then raise exception using errcode = '22023', message = 'Implementation snapshots must be JSON objects.'; end if;

  select * into target_activation from public.delivery_activations where id = p_delivery_activation_id for share;
  if not found then raise exception using errcode = 'P0002', message = 'Delivery activation was not found.'; end if;
  if target_activation.status <> 'ACTIVE' or target_activation.delivery_stage <> 'IMPLEMENTATION' then raise exception using errcode = '22023', message = 'Implementation requires an active delivery activation at the IMPLEMENTATION stage.'; end if;
  select * into target_entitlement from public.entitlements where id = target_activation.entitlement_id for share;
  if not found or target_entitlement.status <> 'ACTIVE' then raise exception using errcode = '22023', message = 'Implementation requires an active entitlement.'; end if;
  if target_entitlement.organization_id is distinct from target_activation.organization_id or target_entitlement.project_id is distinct from target_activation.project_id or target_entitlement.project_service_id is distinct from target_activation.project_service_id then raise exception using errcode = '42501', message = 'Entitlement and delivery activation relationships do not match.'; end if;
  select * into target_service from public.project_services where id = target_activation.project_service_id for share;
  if not found or target_service.project_id is distinct from target_activation.project_id then raise exception using errcode = '42501', message = 'Project service does not match the delivery activation project.'; end if;

  select * into existing_record from public.implementation_records where organization_id = target_activation.organization_id and idempotency_key = normalized_key for update;
  if found then
    if existing_record.delivery_activation_id is distinct from target_activation.id or existing_record.implementation_reference is distinct from normalized_reference then raise exception using errcode = '23505', message = 'Implementation idempotency key was already used for a different record.'; end if;
    return existing_record;
  end if;

  source_snapshot := jsonb_build_object(
    'delivery_activation_id', target_activation.id,
    'entitlement_id', target_entitlement.id,
    'payment_obligation_id', target_entitlement.payment_obligation_id,
    'project_id', target_activation.project_id,
    'project_service_id', target_activation.project_service_id,
    'delivery_stage', target_activation.delivery_stage,
    'source_context', coalesce(p_source_context, '{}'::jsonb),
    'delivery_activation_snapshot', target_activation.activation_snapshot,
    'entitlement_source_snapshot', target_entitlement.source_snapshot
  );

  insert into public.implementation_records (
    organization_id, project_id, project_service_id, delivery_activation_id, entitlement_id,
    status, implementation_reference, scope_snapshot, source_snapshot, idempotency_key, created_by
  ) values (
    target_activation.organization_id, target_activation.project_id, target_activation.project_service_id, target_activation.id, target_entitlement.id,
    'ACTIVE', normalized_reference, coalesce(p_scope_snapshot, '{}'::jsonb), source_snapshot, normalized_key, actor_id
  ) returning * into created_record;

  perform private.record_implementation_audit('implementation_initialized', created_record.organization_id, created_record.project_id, created_record.project_service_id, created_record.delivery_activation_id, created_record.entitlement_id, created_record.id, jsonb_build_object('implementation_reference', created_record.implementation_reference));
  return created_record;
end;
$$;

create or replace function public.pause_implementation_record(p_implementation_record_id uuid, p_expected_status text default 'ACTIVE', p_status_reason text default null)
returns public.implementation_records language plpgsql security definer set search_path = public, private, pg_temp as $$
declare target public.implementation_records; changed public.implementation_records;
begin
  select * into target from public.implementation_records where id = p_implementation_record_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Implementation record was not found.'; end if;
  if not private.commercial_owner(target.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can pause implementation records.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target.status or target.status <> 'ACTIVE' then raise exception using errcode = '40001', message = 'Implementation record is not active or has changed. Refresh and retry.'; end if;
  update public.implementation_records set status = 'PAUSED', paused_at = timezone('utc', now()), status_reason = nullif(btrim(p_status_reason), '') where id = target.id returning * into changed;
  perform private.record_implementation_audit('implementation_paused', changed.organization_id, changed.project_id, changed.project_service_id, changed.delivery_activation_id, changed.entitlement_id, changed.id, jsonb_build_object('previous_status', target.status, 'status_reason', changed.status_reason)); return changed;
end;
$$;

create or replace function public.resume_implementation_record(p_implementation_record_id uuid, p_expected_status text default 'PAUSED', p_status_reason text default null)
returns public.implementation_records language plpgsql security definer set search_path = public, private, pg_temp as $$
declare target public.implementation_records; changed public.implementation_records;
begin
  select * into target from public.implementation_records where id = p_implementation_record_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Implementation record was not found.'; end if;
  if not private.commercial_owner(target.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can resume implementation records.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target.status or target.status <> 'PAUSED' then raise exception using errcode = '40001', message = 'Implementation record is not paused or has changed. Refresh and retry.'; end if;
  update public.implementation_records set status = 'ACTIVE', paused_at = null, status_reason = nullif(btrim(p_status_reason), '') where id = target.id returning * into changed;
  perform private.record_implementation_audit('implementation_resumed', changed.organization_id, changed.project_id, changed.project_service_id, changed.delivery_activation_id, changed.entitlement_id, changed.id, jsonb_build_object('previous_status', target.status, 'status_reason', changed.status_reason)); return changed;
end;
$$;

create or replace function public.complete_implementation_record(p_implementation_record_id uuid, p_expected_status text default 'ACTIVE', p_status_reason text default null)
returns public.implementation_records language plpgsql security definer set search_path = public, private, pg_temp as $$
declare target public.implementation_records; changed public.implementation_records;
begin
  select * into target from public.implementation_records where id = p_implementation_record_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Implementation record was not found.'; end if;
  if not private.commercial_owner(target.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can complete implementation records.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target.status or target.status not in ('ACTIVE', 'PAUSED') then raise exception using errcode = '40001', message = 'Implementation record is not active/paused or has changed. Refresh and retry.'; end if;
  update public.implementation_records set status = 'COMPLETED', completed_at = timezone('utc', now()), status_reason = nullif(btrim(p_status_reason), '') where id = target.id returning * into changed;
  perform private.record_implementation_audit('implementation_completed', changed.organization_id, changed.project_id, changed.project_service_id, changed.delivery_activation_id, changed.entitlement_id, changed.id, jsonb_build_object('previous_status', target.status, 'status_reason', changed.status_reason)); return changed;
end;
$$;

create or replace function public.cancel_implementation_record(p_implementation_record_id uuid, p_expected_status text default 'ACTIVE', p_status_reason text default null)
returns public.implementation_records language plpgsql security definer set search_path = public, private, pg_temp as $$
declare target public.implementation_records; changed public.implementation_records;
begin
  select * into target from public.implementation_records where id = p_implementation_record_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Implementation record was not found.'; end if;
  if not private.commercial_owner(target.organization_id) then raise exception using errcode = '42501', message = 'Only the organization owner can cancel implementation records.'; end if;
  if upper(btrim(coalesce(p_expected_status, ''))) <> target.status or target.status not in ('ACTIVE', 'PAUSED') then raise exception using errcode = '40001', message = 'Implementation record is not active/paused or has changed. Refresh and retry.'; end if;
  update public.implementation_records set status = 'CANCELLED', status_reason = nullif(btrim(p_status_reason), '') where id = target.id returning * into changed;
  perform private.record_implementation_audit('implementation_cancelled', changed.organization_id, changed.project_id, changed.project_service_id, changed.delivery_activation_id, changed.entitlement_id, changed.id, jsonb_build_object('previous_status', target.status, 'status_reason', changed.status_reason)); return changed;
end;
$$;

create or replace function private.prevent_implementation_record_mutation()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if tg_op = 'DELETE' then raise exception using errcode = '42501', message = 'Implementation history cannot be deleted.'; end if;
  if old.id is distinct from new.id or old.organization_id is distinct from new.organization_id or old.project_id is distinct from new.project_id or old.project_service_id is distinct from new.project_service_id or old.delivery_activation_id is distinct from new.delivery_activation_id or old.entitlement_id is distinct from new.entitlement_id or old.implementation_reference is distinct from new.implementation_reference or old.scope_snapshot is distinct from new.scope_snapshot or old.source_snapshot is distinct from new.source_snapshot or old.idempotency_key is distinct from new.idempotency_key or old.started_at is distinct from new.started_at or old.created_by is distinct from new.created_by or old.created_at is distinct from new.created_at then
    raise exception using errcode = '42501', message = 'Implementation source and scope fields are immutable.';
  end if;
  if new.status is distinct from old.status and not ((old.status = 'ACTIVE' and new.status in ('PAUSED', 'COMPLETED', 'CANCELLED')) or (old.status = 'PAUSED' and new.status in ('ACTIVE', 'COMPLETED', 'CANCELLED'))) then
    raise exception using errcode = '22023', message = 'Implementation lifecycle transition is not allowed.';
  end if;
  return new;
end;
$$;

revoke all on function private.prevent_implementation_record_mutation() from public;
revoke execute on function private.prevent_implementation_record_mutation() from anon;
drop trigger if exists prevent_implementation_record_mutation on public.implementation_records;
create trigger prevent_implementation_record_mutation before update or delete on public.implementation_records for each row execute procedure private.prevent_implementation_record_mutation();

revoke all on function public.initialize_implementation(uuid, text, text, jsonb, jsonb, uuid) from public;
revoke execute on function public.initialize_implementation(uuid, text, text, jsonb, jsonb, uuid) from anon, authenticated;
grant execute on function public.initialize_implementation(uuid, text, text, jsonb, jsonb, uuid) to service_role;

revoke all on function public.pause_implementation_record(uuid, text, text) from public;
revoke all on function public.resume_implementation_record(uuid, text, text) from public;
revoke all on function public.complete_implementation_record(uuid, text, text) from public;
revoke all on function public.cancel_implementation_record(uuid, text, text) from public;
revoke execute on function public.pause_implementation_record(uuid, text, text) from anon;
revoke execute on function public.resume_implementation_record(uuid, text, text) from anon;
revoke execute on function public.complete_implementation_record(uuid, text, text) from anon;
revoke execute on function public.cancel_implementation_record(uuid, text, text) from anon;
grant execute on function public.pause_implementation_record(uuid, text, text) to authenticated;
grant execute on function public.resume_implementation_record(uuid, text, text) to authenticated;
grant execute on function public.complete_implementation_record(uuid, text, text) to authenticated;
grant execute on function public.cancel_implementation_record(uuid, text, text) to authenticated;

alter table public.implementation_records enable row level security;
create policy "Accessible members can view implementation records" on public.implementation_records for select to authenticated using (private.has_organization_role(organization_id, 'MEMBER') and private.has_project_access(project_id));
create policy "Implementation record inserts require trusted functions" on public.implementation_records for insert to authenticated with check (false);
create policy "Implementation record updates require trusted functions" on public.implementation_records for update to authenticated using (false) with check (false);
create policy "Implementation record deletes are disabled" on public.implementation_records for delete to authenticated using (false);

comment on table public.implementation_records is 'Provider-neutral implementation workspace record initialized only from an active IMPLEMENTATION-stage delivery activation. It does not automate deployment or later delivery stages.';
comment on function public.initialize_implementation(uuid, text, text, jsonb, jsonb, uuid) is 'Service-role-only implementation initialization boundary requiring an active delivery activation at the IMPLEMENTATION stage.';