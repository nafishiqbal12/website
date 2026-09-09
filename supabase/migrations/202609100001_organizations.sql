create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null
    constraint organizations_name_not_blank check (length(btrim(name)) between 1 and 160),
  status text not null default 'ACTIVE'
    constraint organizations_status_valid check (status in ('ACTIVE', 'SUSPENDED', 'ARCHIVED')),
  owner_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists organizations_owner_id_idx on public.organizations (owner_id);
create index if not exists organizations_status_idx on public.organizations (status);

create or replace function public.prevent_organization_owner_change()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.owner_id is distinct from new.owner_id then
    raise exception using
      errcode = '42501',
      message = 'Organization ownership cannot be changed through a normal update.';
  end if;

  if old.created_at is distinct from new.created_at then
    raise exception using
      errcode = '42501',
      message = 'Organization creation time cannot be changed.';
  end if;

  if old.status is distinct from new.status then
    raise exception using
      errcode = '42501',
      message = 'Organization status must be changed through a controlled lifecycle operation.';
  end if;

  return new;
end;
$$;

comment on function public.prevent_organization_owner_change() is
  'Prevents ordinary updates from transferring organization ownership; ownership changes require a future reviewed workflow.';

drop trigger if exists prevent_organization_owner_change on public.organizations;
create trigger prevent_organization_owner_change
before update on public.organizations
for each row execute procedure public.prevent_organization_owner_change();

create or replace function public.set_organization_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

comment on function public.set_organization_updated_at() is
  'Maintains the organization updated_at timestamp on permitted updates.';

drop trigger if exists set_organization_updated_at on public.organizations;
create trigger set_organization_updated_at
before update on public.organizations
for each row execute procedure public.set_organization_updated_at();

alter table public.organizations enable row level security;

 drop policy if exists "Organization owners can view their organizations" on public.organizations;
create policy "Organization owners can view their organizations"
on public.organizations for select
to authenticated
using (owner_id = (select auth.uid()));

 drop policy if exists "Authenticated users can create self-owned organizations" on public.organizations;
create policy "Authenticated users can create self-owned organizations"
on public.organizations for insert
to authenticated
with check (owner_id = (select auth.uid()));

 drop policy if exists "Organization owners can update permitted fields" on public.organizations;
create policy "Organization owners can update permitted fields"
on public.organizations for update
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

 drop policy if exists "Organization deletion is disabled" on public.organizations;
create policy "Organization deletion is disabled"
on public.organizations for delete
to authenticated
using (false);

comment on table public.organizations is
  'Phase 13.1 organization foundation. Direct ownership is temporary until membership ownership is introduced in Phase 13.2.';
comment on column public.organizations.owner_id is
  'Authenticated creator and current owner for Phase 13.1; immutable through ordinary updates.';
