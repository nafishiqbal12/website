# BlockWaveLab V2 Phase 13.1 Implementation

## Status

Implemented locally. This slice adds only the organization foundation. The migration has not been pushed to Supabase.

Out of scope: memberships, invitations, projects, project memberships, billing, subscriptions, payments, audit UI, AI runtime, admin dashboard, and Phase 14 features.

## Schema

Migration: `supabase/migrations/202609100001_organizations.sql`

The migration creates `public.organizations` with:

- `id uuid primary key default gen_random_uuid()`
- `name text not null`, trimmed and limited to 160 characters
- `status text not null`, defaulting to `ACTIVE` and constrained to `ACTIVE`, `SUSPENDED`, or `ARCHIVED`
- `owner_id uuid not null references auth.users(id) on delete restrict`
- `created_at timestamptz`
- `updated_at timestamptz`

Indexes cover `owner_id` and `status`. No slug, settings, metadata, membership, or speculative business fields were added.

## Ownership Model

In Phase 13.1, the authenticated creator supplies the organization name and becomes the direct owner through `owner_id`. The owner relationship is deliberately direct because membership rows are not implemented in this slice.

Ownership is not a client-editable field:

- INSERT RLS requires `owner_id = auth.uid()`.
- UPDATE RLS requires the existing and resulting row to remain owned by `auth.uid()`.
- A database trigger rejects any change to `owner_id`, including changes attempted by a privileged client path that does not use a future reviewed ownership workflow.
- Ownership transfer is deferred to a future membership/ownership workflow.

The `updated_at` trigger maintains modification timestamps for permitted updates.

## RLS and Security Decisions

RLS is enabled on `public.organizations`.

- Unauthenticated users have no applicable policies and cannot read or mutate organizations.
- Authenticated owners can read only rows whose `owner_id` is their `auth.uid()`.
- Authenticated users can insert only rows owned by themselves.
- Owners can update organization fields while ownership remains unchanged.
- Direct DELETE is denied with an explicit false policy. Suspension or archival must be implemented through a future reviewed lifecycle operation; this slice provides no destructive deletion path.
- The owner foreign key uses `on delete restrict` so deleting an auth identity cannot silently orphan or cascade-delete an organization.

The only security-sensitive helper is `prevent_organization_owner_change()`. It exists solely to make owner immutability database-enforced independently of client behavior. It uses a fixed `public` search path, returns no data, and does not grant elevated access.

No React route guard or browser state is used as authorization. No service-role key, secret, or new environment variable was added.

## Verification

The repository has no automated Supabase SQL/RLS test harness, so no testing framework was introduced for this narrow slice. The migration contains the executable database constraints and policies. The following focused checks require an approved Supabase environment with two authenticated test users:

1. As user A, insert an organization with `owner_id = auth.uid()`; expect success.
2. As user A, select the created row; expect exactly one row.
3. As user A, update `name`; expect success and a changed `updated_at`.
4. As user A, update `owner_id` to user B; expect failure from RLS or the immutability trigger.
5. As user B, select or update the row; expect no visible row and no successful update.
6. Without a session, select/insert/update/delete; expect denial.
7. As user A, delete the row; expect denial.
8. Inspect `public.profiles` policies and migration text; expect the Phase 12 migration to remain unchanged.

A future live verification should also confirm that the approved Supabase project has `organizations` RLS enabled and that no policy is granted to `anon`.

## Files Changed

- `supabase/migrations/202609100001_organizations.sql`
- `src/lib/organizations/types.ts`
- `docs/PHASE_13_1_IMPLEMENTATION.md`

No application routes, public pages, auth provider code, profile code, or Phase 12 migration was changed.

## Known Limitations

- Direct owner access is intentionally temporary and will be replaced or complemented by membership-based organization access in Phase 13.2.
- There is no organization UI or data-access helper yet because this slice does not require a dashboard or application workflow.
- Live RLS verification requires a configured Supabase project and two test identities. It was not run automatically.
- Ownership transfer, organization lifecycle operations, and audit events are deferred to their approved later slices.

## Exact Next Step

**Phase 13.2 Membership + Organization Roles**

Add membership rows and organization role enforcement through a new forward-only migration. Do not rewrite `202609080001_profiles.sql` or use a destructive database reset.
