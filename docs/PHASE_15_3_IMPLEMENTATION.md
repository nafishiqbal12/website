# BlockWaveLab V2 Phase 15.3 Implementation

## Status

Phase 15.3 Project Services & Commercial Selection Foundation is implemented locally and ready for deployment after validation.

- Project-service selection UI: **PASS**
- Catalog/project data access: **PASS**
- Idempotent trusted selection boundary: **PASS**
- Commercial/delivery separation: **PASS**
- Local validation: **PASS**
- Migration deployment: **PASS**
- Remote structural verification: **PASS**
- Runtime authenticated tests: **DEFERRED**

## Scope

The project detail surface now lets an authorized organization owner/admin or project manager request an active catalog offering for an active project. The resulting state is always `REQUESTED`.

Selection does not mean:

- payment completed
- proposal approved
- agreement signed
- entitlement granted
- delivery activated
- subscription started
- managed service started

No pricing, payment, proposal, agreement, entitlement, delivery, observation, AI provider, email provider, or checkout functionality was added.

## Application Changes

- `src/pages/platform/PlatformApp.tsx`: added a project-service selection panel to project detail.
- `src/lib/organizations/data.ts`: existing catalog/project-service reads and selection RPC wrapper are reused.
- Existing organization/project role checks remain UX-only; database RLS/RPC authorization remains authoritative.
- The panel shows active pillar, service, offering, current selection state, and a clear `REQUESTED` boundary message.
- Inaccessible projects remain unavailable through the existing RLS-scoped project lookup.

## Trusted Boundary

The existing `public.select_project_service(uuid, uuid, jsonb)` RPC was hardened in:

```text
supabase/migrations/202609140010_project_service_selection_hardening.sql
```

The function now:

- requires an `ACTIVE` project
- resolves the organization from the project row
- requires active organization authorization
- allows organization `OWNER`/`ADMIN` or project `PROJECT_MANAGER`
- validates active/effective offering, service, and pillar
- returns an existing project-service record for repeated selection
- creates only a new `REQUESTED` row when no record exists
- preserves the unique `(project_id, offering_id)` constraint
- uses `SECURITY DEFINER` with `search_path = public, private, pg_temp`
- grants execution only to `authenticated`

## Security

- Direct project-service INSERT/UPDATE/DELETE remains denied by RLS.
- No service-role key or secret is used in browser code.
- Project and organization isolation remains enforced by existing RLS and trusted authorization helpers.
- Inactive services, offerings, pillars, and projects cannot be selected.
- Project-service selection does not create entitlement or payment state.
- Existing project-service audit trigger remains in use.

## Validation Plan

Required local checks:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `git diff --check`

Required remote checks after deployment:

- migration list synchronization
- four pillars, ten services, ten offerings remain unchanged
- selection function ACL/search path/security-definer metadata
- project-service RLS remains enabled and direct writes remain denied
- existing project-service rows remain intact
- no proposals, payments, subscriptions, invoices, entitlements, or delivery tables introduced

## Runtime Tests

No test credentials were created. User A/User B testing remains deferred until approved authenticated identities are available.

Manual checks should verify:

1. Authorized owner/admin/project manager can request an active offering.
2. Repeating the same selection returns the existing row without duplication.
3. Member/contributor/viewer cannot select a service unless backend policy grants it.
4. Inactive project/service/offering selection fails safely.
5. Cross-organization project IDs fail closed.
6. The resulting state remains `REQUESTED`.
7. Anonymous requests are denied.

## Deferred Items

- pricing and profitability
- proposals and proposal versions
- agreements and acceptance
- payments, checkout, invoices, refunds, credits
- subscriptions and recurring billing
- entitlements
- service delivery and observation
- Phase 15.4

## Deployment

After local validation, deploy only:

```bash
supabase db push --linked
```

Then run:

```bash
supabase migration list
```

No destructive or reset command is required.

## Deployment Result

Migration synchronization confirms:

```text
202609140010 -> remote 202609140010
```

Read-only remote verification confirmed:

- pillars: `4`
- services: `10`
- offerings: `10`
- project-service rows: `0`
- requested project-service rows: `0`
- project-services RLS: enabled
- selection RPC: `SECURITY DEFINER`, fixed search path, authenticated-only execution
- selection RPC: active-project guard present
- selection RPC: existing-record idempotency guard present
- direct project-service writes: denied
- deferred commercial tables: absent

**Phase 15.3 status: COMPLETE WITH DEFERRED RUNTIME TESTS.**
