# BlockWaveLab V2 Phase 15.1 Implementation

## Status

Phase 15.1 Catalog Foundation is implemented locally and is ready for the approved linked Supabase deployment.

- Four-pillar catalog foundation: **PASS**
- Service/offering structure: **PASS**
- Project-service relationship: **PASS**
- RLS and trusted boundary: **PASS**
- Local validation: **PASS**
- Migration deployment: **PASS**
- Remote structural verification: **PASS**
- Runtime authenticated tests: **DEFERRED**

The approved business model is unchanged: BlockWaveLab is an AI Automation and DevOps Partner for Web3 Projects with exactly BUILD, AUTOMATE, OPERATE, and GROW.

## Entities

Migration: `supabase/migrations/202609130008_catalog_foundation.sql`

### `catalog_pillars`

A fixed catalog table containing exactly the four approved pillars:

- `BUILD`
- `AUTOMATE`
- `OPERATE`
- `GROW`

Pillar codes are database-constrained and seeded idempotently. Clients cannot create, update, or delete pillar records.

### `catalog_services`

A capability belongs to exactly one pillar through `pillar_id`. The table supports stable codes, names, descriptions, active state, and timestamps. No specific service products were invented because approved service names do not yet exist.

### `service_offerings`

An offering belongs to one service and supports versioned selectable variants, scope-template JSON, active state, display ordering, effective dates, and billing shape:

- `ONE_TIME`
- `RECURRING`
- `ONE_TIME_AND_RECURRING`

Billing mode is catalog metadata only. No recurring billing or payment logic was implemented.

### `project_services`

Connects an existing project to a selected service offering. It records requested scope and a scope snapshot, but selection is not proof of payment, entitlement, agreement, or delivery activation.

## Constraints and Indexes

- UUID primary keys on all four entities.
- Foreign keys preserve organization/project/catalog ownership with restrictive deletes.
- Pillar code limited to the four approved values.
- Service code, name, and offering name are bounded.
- Offering version must be positive and unique per service.
- Offering billing mode is bounded to the three approved modes.
- Offering effective window must end after it starts.
- JSON scope fields must be objects.
- Project-service status is bounded to the pre-commercial selection lifecycle.
- Project/offering selection is unique per project.
- Indexes cover pillar/service/offering/project foreign keys, active catalog ordering, and project-service status.

## RLS Policies

RLS is enabled on `catalog_pillars`, `catalog_services`, `service_offerings`, and `project_services`.

- Authenticated users may read active pillars.
- Authenticated users may read active services whose pillar is active.
- Authenticated users may read active, currently effective offerings whose service and pillar are active.
- Authorized project users may read project-service rows through `private.has_project_access(project_id)`.
- Direct client insert/update/delete is denied for pillars, services, offerings, and project services.
- Catalog administration is intentionally not exposed as a browser role or UI.

Existing `audit_events` is reused and extended with `project_service_id`; no second audit system was created. Project-service insert/update events are recorded through the existing trusted audit pattern.

## Trusted Function

`public.select_project_service(uuid, uuid, jsonb)` is the only new client mutation boundary.

It:

1. Resolves the project and owning organization from the database.
2. Requires active organization membership and project manager/admin authority.
3. Requires the offering, service, and pillar to be active and currently effective.
4. Stores requested scope without asserting payment or entitlement.
5. Creates a `REQUESTED` project-service row atomically.

It is `SECURITY DEFINER`, uses a fixed `search_path`, has PUBLIC/anonymous execution revoked, and grants execution only to `authenticated`.

## Data Access

`src/lib/organizations/types.ts` now includes:

- `CatalogPillar`
- `CatalogService`
- `ServiceOffering`
- `ProjectService`
- fixed pillar and billing-mode unions

`src/lib/organizations/data.ts` now provides browser-safe reads for active catalog data and a wrapper for `select_project_service`. It uses the existing public Supabase client and does not expose service-role capabilities.

No catalog UI was added because Phase 15.1 is explicitly backend/domain/data-access focused and the existing Phase 14 platform does not require a catalog screen yet.

## Deferred Scope

Not implemented:

- final service/product names
- pricing or price values
- proposals and proposal versions
- agreements
- payments, invoices, refunds, credits
- subscriptions or recurring billing
- entitlements
- service delivery or observation lifecycle
- checkout/provider webhooks
- invitation changes
- AI, monitoring, support, admin, or Phase 16+ work

## Validation

- `npm run typecheck`: passed.
- `npm run lint`: passed with the existing two `SEO.tsx` warnings.
- `npm run build`: passed.
- `git diff --check`: passed.
- No direct privileged catalog/project-service table writes were added.
- No service-role keys, secrets, passwords, or payment data were added.
- Existing public routes and Phase 12 auth/profile files remain unchanged.

## Deployment and Remote Verification

Migration `202609130008_catalog_foundation.sql` was deployed successfully with `supabase db push --linked`.

Migration synchronization confirms local and remote `202609130008` are aligned.

Read-only remote verification confirmed:

- `catalog_pillars`, `catalog_services`, `service_offerings`, and `project_services` exist with RLS enabled.
- The exact active pillars are `AUTOMATE`, `BUILD`, `GROW`, and `OPERATE`.
- `catalog_services`: `0` rows; `service_offerings`: `0` rows; no unapproved product catalog was invented.
- Catalog and project-service foreign keys, unique constraints, bounded checks, and indexes are deployed.
- Active catalog reads are available to authenticated users; inactive catalog records are filtered.
- Direct catalog/project-service client writes and deletes are denied.
- `select_project_service` is `SECURITY DEFINER`, uses `search_path=public, private, pg_temp`, and is executable only by `authenticated`.
- Project-service audit linkage exists through `audit_events.project_service_id`.
- Project-service rows: `0`; audit-event rows: `0`.
- Proposals, agreements, payments, invoices, subscriptions, entitlements, refunds, and credits were not introduced.

No test data was inserted.

## Business Model Compliance

The migration introduces no additional top-level business category, no legacy crypto marketing model, no unsupported AI claim, no employee replacement claim, no mandatory subscription, and no free observation period. Observation and all delivery/commercial lifecycle work remain deferred.

## Next Step

After deployment and read-only structural verification, proceed only with the approved catalog content decision or the next separately approved commercial phase. Do not implement pricing, checkout, payments, proposals, or entitlements in Phase 15.1.
