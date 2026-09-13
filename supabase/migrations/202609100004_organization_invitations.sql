create table if not exists public.organization_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  inviter_user_id uuid not null references auth.users(id) on delete restrict,
  invitee_email text not null
    constraint organization_invitations_email_valid check (length(btrim(invitee_email)) between 3 and 320),
  role text not null
    constraint organization_invitations_role_valid check (role in ('ADMIN', 'MEMBER')),
  status text not null default 'PENDING'
    constraint organization_invitations_status_valid check (status in ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED')),
  token_hash text not null unique
    constraint organization_invitations_token_hash_valid check (length(token_hash) between 64 and 128),
  expires_at timestamptz not null,
  accepted_by uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  revoked_by uuid references auth.users(id) on delete set null,
  revoked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.audit_events
  add column if not exists invitation_id uuid references public.organization_invitations(id) on delete set null;

alter table public.audit_events
  drop constraint if exists audit_events_event_type_valid;

alter table public.audit_events
  add constraint audit_events_event_type_valid check (event_type in (
    'membership_created',
    'membership_activated',
    'membership_role_changed',
    'membership_suspended',
    'membership_removed',
    'invitation_created',
    'invitation_accepted',
    'invitation_revoked',
    'invitation_expired',
    'project_created',
    'project_updated',
    'project_archived',
    'project_membership_created',
    'project_membership_activated',
    'project_membership_role_changed',
    'project_membership_suspended',
    'project_membership_removed'
  ));

create unique index if not exists organization_invitations_pending_email_idx
  on public.organization_invitations (organization_id, lower(invitee_email))
  where status = 'PENDING';
create index if not exists organization_invitations_organization_status_idx
  on public.organization_invitations (organization_id, status);
create index if not exists organization_invitations_expiry_idx
  on public.organization_invitations (expires_at)
  where status = 'PENDING';
create index if not exists audit_events_invitation_created_at_idx
  on public.audit_events (invitation_id, created_at);

create or replace function private.record_invitation_audit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_events (
      event_type,
      actor_user_id,
      organization_id,
      invitation_id,
      target_user_id,
      new_role,
      new_status
    )
    values (
      'invitation_created',
      (select auth.uid()),
      new.organization_id,
      new.id,
      new.accepted_by,
      new.role,
      new.status
    );
  elsif tg_op = 'UPDATE' and old.status is distinct from new.status then
    insert into public.audit_events (
      event_type,
      actor_user_id,
      organization_id,
      invitation_id,
      target_user_id,
      new_role,
      previous_status,
      new_status
    )
    values (
      case new.status
        when 'ACCEPTED' then 'invitation_accepted'
        when 'EXPIRED' then 'invitation_expired'
        when 'REVOKED' then 'invitation_revoked'
        else 'invitation_created'
      end,
      coalesce(new.accepted_by, new.revoked_by, (select auth.uid())),
      new.organization_id,
      new.id,
      new.accepted_by,
      new.role,
      old.status,
      new.status
    );
  end if;

  return new;
end;
$$;

create trigger record_invitation_audit
after insert or update on public.organization_invitations
for each row execute procedure private.record_invitation_audit();

create or replace function public.create_organization_invitation(
  p_organization_id uuid,
  p_invitee_email text,
  p_role text,
  p_token_hash text,
  p_expires_at timestamptz
)
returns public.organization_invitations
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  created_invitation public.organization_invitations;
  normalized_email text;
  existing_user_id uuid;
begin
  if not private.has_organization_role(p_organization_id, 'ADMIN') then
    raise exception using
      errcode = '42501',
      message = 'Only an active organization owner or admin can create invitations.';
  end if;

  if p_role not in ('ADMIN', 'MEMBER') then
    raise exception using
      errcode = '22023',
      message = 'Invitation role must be ADMIN or MEMBER.';
  end if;

  if p_expires_at <= timezone('utc', now()) then
    raise exception using
      errcode = '22023',
      message = 'Invitation expiration must be in the future.';
  end if;

  if length(p_token_hash) not between 64 and 128 then
    raise exception using
      errcode = '22023',
      message = 'Invitation token hash has an invalid length.';
  end if;

  normalized_email := lower(btrim(p_invitee_email));
  select id into existing_user_id from auth.users where lower(email) = normalized_email limit 1;

  if existing_user_id is not null and exists (
    select 1
    from public.organization_members
    where organization_id = p_organization_id
      and user_id = existing_user_id
      and status in ('PENDING', 'ACTIVE', 'SUSPENDED')
  ) then
    raise exception using
      errcode = '23505',
      message = 'The invitee already has an organization membership.';
  end if;

  insert into public.organization_invitations (
    organization_id,
    inviter_user_id,
    invitee_email,
    role,
    token_hash,
    expires_at
  )
  values (
    p_organization_id,
    (select auth.uid()),
    normalized_email,
    p_role,
    p_token_hash,
    p_expires_at
  )
  returning * into created_invitation;

  return created_invitation;
end;
$$;

create or replace function public.accept_organization_invitation(p_token_hash text)
returns public.organization_members
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  invitation public.organization_invitations;
  current_user_id uuid;
  current_email text;
  current_email_confirmed_at timestamptz;
  accepted_membership public.organization_members;
begin
  current_user_id := (select auth.uid());
  select lower(btrim(email)), email_confirmed_at
    into current_email, current_email_confirmed_at
  from auth.users
  where id = current_user_id;

  if current_user_id is null or current_email is null or current_email_confirmed_at is null then
    raise exception using
      errcode = '42501',
      message = 'A verified authenticated identity is required to accept an invitation.';
  end if;

  select * into invitation
  from public.organization_invitations
  where token_hash = p_token_hash
    and status = 'PENDING'
    and expires_at > timezone('utc', now())
  for update;

  if not found then
    raise exception using
      errcode = 'P0002',
      message = 'Invitation is invalid, expired, revoked, or already accepted.';
  end if;

  if invitation.invitee_email <> current_email then
    raise exception using
      errcode = '42501',
      message = 'Invitation email does not match the authenticated identity.';
  end if;

  if exists (
    select 1
    from public.organization_members
    where organization_id = invitation.organization_id
      and user_id = current_user_id
  ) then
    raise exception using
      errcode = '23505',
      message = 'The authenticated user already has membership history in this organization.';
  end if;

  insert into public.organization_members (
    organization_id,
    user_id,
    role,
    status,
    invited_by,
    accepted_at
  )
  values (
    invitation.organization_id,
    current_user_id,
    invitation.role,
    'ACTIVE',
    invitation.inviter_user_id,
    timezone('utc', now())
  )
  returning * into accepted_membership;

  update public.organization_invitations
  set status = 'ACCEPTED',
      accepted_by = current_user_id,
      accepted_at = timezone('utc', now()),
      updated_at = timezone('utc', now())
  where id = invitation.id;

  return accepted_membership;
end;
$$;

create or replace function public.revoke_organization_invitation(p_invitation_id uuid)
returns public.organization_invitations
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  invitation public.organization_invitations;
  revoked_invitation public.organization_invitations;
begin
  select * into invitation
  from public.organization_invitations
  where id = p_invitation_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'Invitation was not found.';
  end if;

  if not private.has_organization_role(invitation.organization_id, 'ADMIN') then
    raise exception using errcode = '42501', message = 'Only an active organization owner or admin can revoke invitations.';
  end if;

  if invitation.status <> 'PENDING' then
    raise exception using errcode = '22023', message = 'Only pending invitations can be revoked.';
  end if;

  update public.organization_invitations
  set status = 'REVOKED',
      revoked_by = (select auth.uid()),
      revoked_at = timezone('utc', now()),
      updated_at = timezone('utc', now())
  where id = p_invitation_id
  returning * into revoked_invitation;

  return revoked_invitation;
end;
$$;

create or replace function public.expire_organization_invitation(p_invitation_id uuid)
returns public.organization_invitations
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  expired_invitation public.organization_invitations;
begin
  update public.organization_invitations
  set status = 'EXPIRED', updated_at = timezone('utc', now())
  where id = p_invitation_id
    and status = 'PENDING'
    and expires_at <= timezone('utc', now())
  returning * into expired_invitation;

  if not found then
    raise exception using errcode = 'P0002', message = 'No pending expired invitation was found.';
  end if;

  return expired_invitation;
end;
$$;

revoke all on function private.record_invitation_audit() from public;
revoke all on function public.create_organization_invitation(uuid, text, text, text, timestamptz) from public;
revoke all on function public.accept_organization_invitation(text) from public;
revoke all on function public.revoke_organization_invitation(uuid) from public;
revoke all on function public.expire_organization_invitation(uuid) from public;
revoke execute on function private.record_invitation_audit() from anon;
revoke execute on function public.create_organization_invitation(uuid, text, text, text, timestamptz) from anon;
revoke execute on function public.accept_organization_invitation(text) from anon;
revoke execute on function public.revoke_organization_invitation(uuid) from anon;
revoke execute on function public.expire_organization_invitation(uuid) from anon;
grant execute on function public.create_organization_invitation(uuid, text, text, text, timestamptz) to authenticated;
grant execute on function public.accept_organization_invitation(text) to authenticated;
grant execute on function public.revoke_organization_invitation(uuid) to authenticated;

alter table public.organization_invitations enable row level security;

drop policy if exists "Organization admins can view invitation metadata" on public.organization_invitations;
create policy "Organization admins can view invitation metadata"
on public.organization_invitations for select
to authenticated
using (private.has_organization_role(organization_id, 'ADMIN'));

drop policy if exists "Invitation inserts require a trusted function" on public.organization_invitations;
create policy "Invitation inserts require a trusted function"
on public.organization_invitations for insert
to authenticated
with check (false);

drop policy if exists "Invitation updates require a trusted function" on public.organization_invitations;
create policy "Invitation updates require a trusted function"
on public.organization_invitations for update
to authenticated
using (false)
with check (false);

drop policy if exists "Invitation deletes are disabled" on public.organization_invitations;
create policy "Invitation deletes are disabled"
on public.organization_invitations for delete
to authenticated
using (false);

comment on table public.organization_invitations is
  'Invitation foundation. Only token hashes are stored; invitations and projects remain separate authorization boundaries.';
comment on column public.organization_invitations.token_hash is
  'Hash of a high-entropy invitation token. Raw token material is never stored.';
