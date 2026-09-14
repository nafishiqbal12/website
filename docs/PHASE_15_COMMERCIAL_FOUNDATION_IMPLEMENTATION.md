# BlockWaveLab V2 Phase 15 Commercial Foundation

## Status

Phase 15 commercial foundation is implemented and deployed through migration `202609140011_commercial_foundation.sql`.

This slice implements proposal, immutable proposal-version/item snapshots, agreement/version records, authenticated agreement acceptance, commercial-state boundaries, trusted authorization, RLS, and the minimum project-level UI. It does not implement payment processing, checkout, invoices, subscriptions, entitlements, delivery activation, trials, or external providers.

## Approved Business Decisions Implemented

- BlockWaveLab remains an AI Automation + DevOps Partner for Web3 Projects.
- The existing four-pillar catalog remains unchanged: `BUILD`, `AUTOMATE`, `OPERATE`, and `GROW`.
- Organization remains the customer and tenant boundary; project remains the delivery container.
- Pricing is proposal-based and scope-oriented. No actual prices, tax percentages, discounts, payment percentages, or margin values were created.
- `USD` is the primary commercial currency context. Additional currencies are not implemented.
- One-time implementation and separately paid ongoing service remain distinct.
- Agreement is a separate object and is available for the approved medium/large/custom/recurring policy boundary; this foundation does not attempt to infer engagement size or legal applicability.
- First acceptance is authenticated in-platform and records actor, timestamp, exact version, checksum, and idempotency key. No e-signature or legal-enforceability claim is made.
- Commercial acceptance is owner-only in this first implementation. `ADMIN`, `MEMBER`, `PROJECT_MANAGER`, `CONTRIBUTOR`, and `VIEWER` do not gain final commercial authority through ordinary access.
- Proposal/agreement acceptance does not create payment, entitlement, subscription, observation, delivery, or ongoing-service activation.
- Observation remains a paid implementation stage and is not represented as free support.

## Schema

Migration: `supabase/migrations/202609140011_commercial_foundation.sql`

Tables created:

- `public.proposals`: organization/project commercial negotiation aggregate, status, validity, issuer, and current version reference.
- `public.proposal_versions`: versioned scope/commercial snapshots, USD currency context, checksum, lineage, validity, and immutable issued-history boundary.
- `public.proposal_items`: historical service/offering/pillar snapshots, optional project-service traceability, scope snapshot, commercial snapshot, and optional quantity/unit fields.
- `public.agreements`: separate organization/project agreement aggregate linked to an accepted proposal version where applicable.
- `public.agreement_versions`: terms snapshots, checksum, version lineage, status, and effective/expiry dates.
- `public.agreement_acceptances`: immutable authenticated acceptance record with exact agreement version, actor, timestamp, checksum, and idempotency key.

All foreign keys use restrictive history-preserving behavior. Proposal versions are unique per proposal/version number, agreement versions are unique per agreement/version number, acceptance idempotency is unique per agreement/key, and one acceptance is limited per agreement/version.

Historical records store snapshots rather than relying only on mutable catalog descriptions. Existing catalog and `project_services` tables were not duplicated or altered except for audit references.

## Commercial State Model

Proposal statuses are bounded to:

```text
DRAFT -> INTERNAL_REVIEW -> SENT -> VIEWED -> CHANGES_REQUESTED
                           -> ACCEPTED | REJECTED | EXPIRED | CANCELLED
```

Only valid draft proposal versions can be issued. Acceptance requires an issued current version, expected version number, and valid date. Issued and terminal snapshots cannot have their historical content changed.

Agreement statuses are bounded to:

```text
DRAFT -> PENDING_ACCEPTANCE -> ACTIVE -> SUSPENDED -> TERMINATED | EXPIRED
```

Agreement acceptance activates the agreement record and exact version only within the commercial aggregate. It does not activate service delivery or payment.

Payment and entitlement states are deliberately not implemented. Delivery remains the existing project lifecycle and is independent of proposal/agreement status.

## Proposal and Version Model

Trusted functions create proposals, create version/item snapshots, issue a current version, and accept a current issued version. Proposal items may reference an existing `project_service`; the function resolves and snapshots its project, offering, pillar, service, and offering identity. Custom item input must remain within one approved pillar and include service/offering snapshots.

No live catalog join is used as the historical commercial description. Catalog edits cannot rewrite an issued proposal snapshot. Proposal acceptance records an audit event but does not mutate `project_services` to `ACTIVE`.

## Agreement and Acceptance Model

Agreements are separate from proposals. An agreement may reference an accepted proposal/version and is created as `DRAFT`. A trusted agreement-version function creates a versioned terms snapshot and checksum. The authenticated acceptance function:

- resolves the agreement and version server-side;
- requires the current authenticated user to be the active organization owner;
- rejects invalid agreement-version states;
- returns an existing record for a repeated agreement/idempotency-key request;
- inserts one immutable acceptance record;
- marks the agreement/version `ACTIVE`;
- records `agreement_accepted` and `agreement_activated` audit events.

The implementation records an acceptance fact. It does not claim that the action is a legally binding signature, qualified e-signature, or substitute for external legal review.

## Authorization

The existing organization/project model remains authoritative. Sensitive commercial mutations use `SECURITY DEFINER` functions with `search_path = public, private, pg_temp`, authenticated-only execution, and an owner check through `private.commercial_owner(uuid)`.

- `OWNER`: may create/revise/issue/accept commercial records through the new boundary.
- `ADMIN`: may not automatically issue or finally accept commercial records in this first slice.
- `MEMBER`: no commercial approval authority.
- `PROJECT_MANAGER`, `CONTRIBUTOR`, and `VIEWER`: retain project permissions and do not gain commercial acceptance authority.

Cross-organization project references are checked against persisted ownership. Safe not-found/authorization errors are returned by trusted functions without trusting request organization IDs as proof of access.

## RLS

RLS is enabled on all six commercial tables.

- Active organization members can read organization-scoped commercial records.
- Project-scoped rows additionally require accessible project authorization.
- Direct client inserts, updates, and deletes are denied for commercial tables.
- Immutable items and acceptance rows cannot be updated or deleted by trusted SQL triggers.
- Issued/accepted proposal versions and pending/active/terminal agreement versions cannot have historical content, checksum, identity, or lineage rewritten.
- Acceptance records cannot be deleted and cannot be duplicated for the same agreement version.

The existing audit-event RLS remains append-only from client perspective. Audit writes occur through the trusted commercial audit function.

## Audit Events

The existing `public.audit_events` foundation was extended with proposal, proposal-version, agreement, and agreement-version references and these event types:

- `proposal_created`
- `proposal_version_created`
- `proposal_issued`
- `proposal_accepted`
- `agreement_created`
- `agreement_version_created`
- `agreement_accepted`
- `agreement_activated`

No secrets, invitation tokens, payment credentials, provider secrets, or unnecessary request data are logged.

## Cost-Control Decisions

- Reused Supabase/Postgres, existing Auth, RLS, trusted RPC, and audit infrastructure.
- Added no payment, tax, accounting, email, AI, monitoring, or e-signature provider.
- Added no npm package or separate billing/customer abstraction.
- Stored bounded JSON snapshots and references instead of adding document storage or an unbounded pricing engine.
- Added no seeded amount, tax, discount, deposit, milestone, or payment data.
- Kept recurring-service behavior separate from one-time implementation and did not automatically continue ongoing service.
- Deferred provider and trial costs until a later approved phase.

## Payment Boundary

The foundation is provider-neutral. It leaves a future path from proposal/agreement to payment and entitlement without creating payment tables, provider customers, checkout, invoices, webhooks, reconciliation, refunds, credits, subscriptions, or tax calculation.

No payment state is authoritative in this implementation. Agreement acceptance does not imply payment, and no commercial operation grants unrestricted service access.

## Deliberately Deferred

- Real prices, pricing engine, price lists, amounts, taxes, VAT, discounts, margin percentages, and payment percentages.
- Payment terms implementation, deposits, milestones, invoices, checkout, provider integration, webhooks, reconciliation, refunds, credits, chargebacks, and subscriptions.
- Entitlement creation or activation.
- Automatic project-service activation or service delivery activation.
- Implementation, deployment, observation, stabilization, documentation, handover, and ongoing-service automation.
- Three-day trial and abuse/cost controls.
- E-signature provider, external signed documents, email/SMS delivery, AI provider, monitoring provider, and tax/accounting provider.
- Broader commercial delegation for ADMIN or other existing roles.
- Runtime A/B tests requiring authenticated test identities.

## Validation Results

- `npm run typecheck`: passed.
- `npm run lint`: passed with two pre-existing `SEO.tsx` fast-refresh warnings and no errors.
- `npm run build`: passed. The generated sitemap date-only churn was restored so it is not part of the implementation scope.
- `git diff --check`: passed.
- Editor diagnostics for commercial types, data helpers, and platform UI: no errors.
- Static scan of commercial source/migration surfaces: no service-role keys, payment provider secrets, signature secrets, or token logging found.
- Migration SQL inspection: six commercial tables, trusted RPCs, authenticated-only grants, RLS policies, immutability triggers, and audit references present.

## Deployment Result

Deployed only:

```text
supabase/migrations/202609140011_commercial_foundation.sql
```

`supabase db push --linked` completed successfully. `supabase migration list --linked` confirms local and remote migration `202609140011` are synchronized.

The attempted CLI schema-dump command was not available with the installed command syntax and displayed help only; it made no database change. Structural verification therefore relies on migration synchronization and static migration/object inspection.

## Runtime Tests

No test users or credentials were created. Authenticated A/B runtime tests remain deferred. No fake credentials were used.

## Final Scope

The commercial foundation is complete for this implementation slice. The next work must be separately approved and must not begin automatically with payment, entitlement, delivery activation, subscriptions, trials, or provider integration.
