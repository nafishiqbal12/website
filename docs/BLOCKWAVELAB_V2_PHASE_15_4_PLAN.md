# BlockWaveLab V2 Phase 15.4 Plan

## Proposals and Agreements Planning/Audit

## Status

This document is a planning and audit artifact only. No Phase 15.4 database object, migration, RPC, application code, UI, test user, deployment, payment integration, or agreement/proposal runtime was created.

The current database migration chain is synchronized through `202609140010`, including the Phase 15.1 catalog foundation, Phase 15.2 catalog content, and Phase 15.3 project-service selection hardening. The repository contains no proposal, proposal version, proposal item, quote, agreement, agreement acceptance, pricing, payment, invoice, subscription, entitlement, or delivery record tables.

## Executive Summary

Phase 15.4 should define the commercial proposal and agreement boundary without pretending that unresolved business, pricing, tax, payment, legal, or acceptance decisions have been made.

The recommended boundary is:

```text
organization -> project -> project_service -> proposal -> immutable proposal_version
                                                     -> proposal_items
                                                     -> agreement -> immutable acceptance record
```

A proposal is a negotiation and commercial presentation container. An accepted proposal version is not automatically a payment, entitlement, subscription, or delivery activation. An agreement is the explicit commercial/legal commitment boundary, but its legal language, acceptance authority, and signature requirements remain unresolved. Agreement acceptance must not automatically create payment, entitlement, subscription, observation, or delivery activation.

The existing `organizations`, `projects`, `project_services`, authorization helpers, RLS, and append-only `audit_events` foundation remain authoritative. No second tenant, permission, or audit system is recommended.

## 1. Current Architecture Findings

### Verified repository and database baseline

- The application is a Vite/React/TypeScript client with a browser-safe Supabase client. No service-role credential is exposed in browser code.
- Supabase Auth is the identity boundary. Organization and project authorization is implemented through database-owned helper functions, trusted RPCs, and RLS.
- `organizations` is the current tenant and commercial customer boundary. `projects` belong to one organization.
- Organization roles currently implemented are `OWNER`, `ADMIN`, and `MEMBER`.
- Project roles currently implemented are `PROJECT_MANAGER`, `CONTRIBUTOR`, and `VIEWER`.
- The catalog contains exactly four constrained pillars: `BUILD`, `AUTOMATE`, `OPERATE`, and `GROW`.
- `catalog_services` belongs to one pillar. `service_offerings` are versioned catalog variants with effective dates and descriptive billing modes.
- `project_services` links a project to a selected offering. Its current selection RPC creates only `REQUESTED` state and is idempotent for an existing project/offering pair.
- `project_services.requested_scope` and `scope_snapshot` are JSON objects. The current selection path does not yet establish an approved commercial scope.
- The deployed `audit_events` table is append-only from client perspective, organization-linked, and already extended with project and project-service references. Trusted triggers record membership, invitation, project, project-membership, and project-service events.
- Current remote migration state matches local migration state through `202609140010`. No later commercial migration is present.

### Existing Phase 15 document findings

- Phase 15 planning recommends organization ownership of commercial records, project-scoped delivery, catalog snapshots, immutable proposal versions, first-class agreements, separate commercial/delivery state, and reuse of `audit_events`.
- Phase 15.1 implemented the catalog foundation and explicitly deferred proposals, agreements, payments, and entitlements.
- Phase 15.2 added ten unpriced service offerings and explicitly deferred prices, currency, tax, discounts, and payment terms.
- Phase 15.3 implemented project-service selection and explicitly states that `REQUESTED` does not mean payment completed, proposal approved, agreement signed, entitlement granted, delivery activated, subscription started, or managed service started.
- Phase 11/13/15 authorization documents provide the deny-by-default and tenant-isolation model but do not resolve commercial authority, legal acceptance, or pricing policy.
- Existing architecture documents use proposal/agreement concepts as future contracts, not as evidence that those tables or workflows exist today.

## 2. Commercial Boundary

Use the existing organization as the initial commercial customer and tenant. A project remains the delivery container. A proposal should be owned by one organization and associated with one project for the first implementation boundary. The organization should be retained directly on commercial records where practical, with project ownership checked against that organization.

Do not add a separate customer, workspace, billing account, or commercial account merely to model proposals. A separate commercial/billing profile is a later decision only if legal entities, tax identities, invoice recipients, or payer relationships cannot safely be represented by the organization model.

The commercial boundary must not be inferred from a client-provided organization or project ID. The database must resolve ownership from the persisted project and active organization membership.

## 3. Proposal Lifecycle

A proposal is the negotiation container. A proposal version is the client-facing commercial snapshot. The exact state vocabulary needs product approval, but the following is the recommended bounded lifecycle:

```text
DRAFT -> INTERNAL_REVIEW -> SENT -> VIEWED -> CHANGES_REQUESTED
                           -> ACCEPTED
                           -> REJECTED
                           -> EXPIRED
                           -> CANCELLED
```

Recommended rules:

- `DRAFT` can be edited by an authorized internal commercial actor before issuance.
- `INTERNAL_REVIEW` is an optional controlled review state and must not be confused with client acceptance.
- `SENT` and `VIEWED` record presentation, not agreement or payment.
- `CHANGES_REQUESTED` requires a new version or a controlled return to draft; it must not mutate an issued snapshot.
- `ACCEPTED` applies to one exact proposal version and requires an immutable acceptance record.
- `REJECTED`, `EXPIRED`, and `CANCELLED` remain historical outcomes.
- Validity dates, concurrency checks, and idempotency are required for acceptance.
- Proposal acceptance may create a pending agreement record, but must not activate delivery or grant an entitlement automatically.

Whether acceptance may occur before payment, and whether an agreement is mandatory for every proposal, are business decisions. They must not be assumed by implementation.

## 4. Proposal Versioning and Immutability

`proposals` should be the stable negotiation aggregate. `proposal_versions` should contain the immutable versions presented to a client. A revision creates a new version with a monotonically increasing number and an explicit reason or supersession reference.

At minimum, a proposal version should retain:

- proposal and organization/project references
- version number and supersedes reference
- lifecycle status and validity/expiry timestamp
- scope snapshot and commercial summary snapshot
- currency and amount fields only after those concepts are approved
- issuer/reviewer/acceptance actor references as appropriate
- issued, viewed, accepted, rejected, expired, and cancelled timestamps
- terms/reference version and a deterministic content checksum

Issued, sent, viewed, accepted, rejected, expired, and cancelled versions must be immutable. Status changes should be controlled transitions with event history, not arbitrary row updates. If a correction is needed, create a new version. The database should enforce unique `(proposal_id, version_number)` and trusted mutation paths should enforce expected-version/concurrency rules.

Historical versions must retain text/scope/commercial snapshots rather than relying on current catalog names or mutable offering descriptions. Later catalog edits, offering retirement, or changed scope templates must not change what a historical proposal meant.

## 5. Proposal Item Design

`proposal_items` should be child records of one immutable proposal version. Items should represent the commercial lines presented in that version, not live catalog joins.

Each item should retain, subject to business approval of the commercial fields:

- immutable item identity and stable ordering
- proposal version reference
- optional source `project_service_id`
- optional source offering/service/pillar IDs for traceability, never as the historical description source
- offering/service/pillar code and display-name snapshots
- scope, assumptions, exclusions, dependencies, and completion/acceptance criteria snapshots
- quantity and unit description, only after quantity policy is approved
- fee mode or component type, such as implementation versus separately purchased ongoing service, only after approved vocabulary
- amount/price snapshot, currency, tax/discount treatment, and total fields only after business decisions are approved
- item status or cancellation semantics if partial changes are allowed

Do not invent a price, currency, tax method, discount model, payment term, quantity default, unit, rounding rule, or legal wording. Those are explicit blockers below. A zero, null, or placeholder amount must not be treated as a commercial decision.

## 6. Relationship Between Proposal Items and `project_services`

`project_services` is the project selection/request record. It is not the proposal and is not the source of truth for historical commercial terms.

Recommended relationship:

```text
project_service (requested selection)
    -> proposal_item (version-specific snapshot, optional traceability link)
    -> accepted proposal_version
    -> agreement item/scope snapshot if an agreement is created
```

A proposal may include one or more selected `project_services`, and a custom proposal item may be allowed only after an approved policy defines how it is represented. One `project_service` may appear in multiple proposal versions over time, but each proposal item snapshots the exact scope and catalog identity used in that version.

A proposal item must not rewrite `project_services` history. A proposal revision must not silently replace an active project-service row or mutate its requested scope. The project-service status may later be advanced through a separately authorized commercial workflow, but proposal acceptance alone must not set it to `ACTIVE`.

The existing unique `(project_id, offering_id)` constraint means a later implementation must decide how repeated, phased, or separately scoped purchases of the same offering are represented. That is a business/domain decision, not something to guess in Phase 15.4.

## 7. Agreement Model

Use a first-class agreement aggregate because a proposal is a negotiation snapshot and an agreement is a distinct commitment record. Do not treat an accepted proposal row as a legal contract by implication.

A future agreement should reference:

- organization and project
- source proposal and exact accepted proposal version
- agreement/terms version and content checksum or immutable terms reference
- bounded status
- effective and expiry timestamps where applicable
- cancellation/termination metadata where legally approved
- created/updated actors and timestamps

A candidate lifecycle is:

```text
DRAFT -> PENDING_ACCEPTANCE -> ACTIVE -> SUSPENDED -> TERMINATED | EXPIRED
```

This is a proposal, not an approved legal state machine. The business must decide whether agreements are required for all commercial commitments, whether one agreement can cover multiple proposals/projects, how amendments and renewals work, and which terms are legally authoritative.

Do not add legal document storage, e-signature integrations, or external contract providers in this phase. A terms version/checksum and a reference to approved content are sufficient for planning until legal requirements are decided.

## 8. Agreement Acceptance and Auditability

Agreement acceptance should be an immutable acceptance record tied to one exact agreement version. It should capture:

- agreement/version reference
- authenticated accepting user
- organization/project context
- acceptance timestamp from the trusted database boundary
- terms checksum or immutable terms reference
- acceptance method only after that method is approved
- safe request context only where legally and privacy-wise justified
- idempotency key/correlation ID
- resulting audit-event reference

The application must not claim legal signature validity, identity assurance, consent language, clickwrap sufficiency, or e-signature equivalence until business/legal owners decide those requirements. If a qualified or third-party signature is required, that becomes a separate approved integration decision; no external provider is assumed.

Agreement acceptance must not automatically create payment, payment intent, invoice, subscription, entitlement, observation, service delivery, or managed-service activation. Any downstream transition must be an explicit, separately authorized workflow governed by approved commercial policy and recorded as its own event.

## 9. Authorization Implications

Existing organization/project authorization remains authoritative.

### Organization roles

- `OWNER` may be eligible for organization-level commercial administration only if an explicit policy grants it. Ownership alone must not be treated as legal acceptance authority.
- `ADMIN` may manage organization/project administration, but must not automatically approve commercial commitments or agreements.
- `MEMBER` must not approve commercial commitments by default. A member may view or contribute to project information only where existing policy permits; membership is not acceptance authority.

### Project roles

- `PROJECT_MANAGER` may manage assigned project workflow where policy permits, but project management does not automatically grant authority to accept prices, proposals, or agreements.
- `CONTRIBUTOR` may contribute project information only within its project permissions and must not approve commercial commitments.
- `VIEWER` is read-only for accessible project-visible records and must not approve, revise, issue, or accept commercial records.

A later approval policy must define the exact commercial approver role or organization-level permission without inventing a new internal BlockWaveLab staff role. Until then, proposal issuance, revision, agreement activation, and acceptance are blocked for implementation. No client role may cross organizations or projects.

## 10. RLS and Multi-Tenant Isolation

Every proposal, proposal version, proposal item, agreement, and acceptance record must be organization-scoped directly where practical and project-scoped where appropriate. Project ownership must resolve to the same organization. Cross-tenant references must be rejected by foreign keys, trusted functions, and authorization checks.

Required controls:

- Enable RLS on every commercial table.
- Scope reads through active organization membership and accessible project membership.
- Keep client writes disabled for immutable versions, items, acceptance records, and audit events.
- Use trusted, `SECURITY DEFINER` RPCs or server boundary functions with fixed `search_path` for state-changing operations.
- Resolve organization/project ownership from database rows, never from request payload alone.
- Require active membership and reject suspended, removed, archived, or inaccessible contexts.
- Use expected version, valid status, expiry, and idempotency checks in proposal/agreement transitions.
- Preserve safe `404`/`403` behavior where resource existence could disclose another tenant.
- Prevent an item from referencing a `project_service` belonging to another project or organization.
- Deny direct client updates to issued/accepted commercial versions and direct client inserts into audit history.

Existing RLS patterns are a strong reusable foundation, but commercial policies do not yet exist and must not be implied by current catalog policies. The current catalog permits authenticated active-catalog reads; that does not grant proposal or agreement access.

## 11. Commercial-State vs Delivery-State Separation

Commercial commitment and delivery execution must be separate state machines and separate records.

Commercial records may later use bounded states such as `DRAFT`, `SENT`, `ACCEPTED`, `PAYMENT_PENDING`, `PAID`, `ACTIVE`, `SUSPENDED`, `CANCELLED`, `EXPIRED`, and `COMPLETED`, but the exact state set belongs to each aggregate and requires approval.

Delivery remains the existing project lifecycle and future service-delivery model:

```text
IMPLEMENTATION -> DEPLOYMENT -> OBSERVATION -> STABILIZATION
                -> DOCUMENTATION -> HANDOVER -> ONGOING_SERVICE
```

Proposal acceptance is not delivery activation. Agreement acceptance is not delivery activation. Payment, if later required, is not by itself unrestricted service access. Observation remains a paid implementation stage, not free support or a promotional period. Ongoing service is separately purchased and separately entitled.

A future workflow may explicitly activate a `project_service` or create a delivery record after all approved commercial gates are satisfied, but that transition must be separately authorized, idempotent, and audited.

## 12. Audit-Event Requirements

Reuse the existing append-only `public.audit_events` foundation. Do not create `commercial_audit_events`, a second timeline store, or client-writable audit history.

The existing foundation should be extended only through a future approved migration with references and event types needed for commercial records. Candidate events include:

- proposal created, revised, submitted for review, issued, viewed, changes requested, accepted, rejected, expired, and cancelled
- proposal version superseded or invalidated
- proposal item added or removed before issuance
- agreement created, issued, amended, activated, suspended, terminated, or expired
- agreement acceptance attempted, accepted, rejected, or replayed
- authorization denial for sensitive commercial transitions where security policy requires it

Every event should retain actor, organization, project where applicable, target record references, previous/next status where applicable, correlation/idempotency reference, safe metadata, and trusted timestamp. Sensitive legal text, provider secrets, payment credentials, and unnecessary personal/request data do not belong in metadata.

Audit inserts must be performed by trusted mutation paths or controlled triggers. Audit history must survive proposal/agreement edits, catalog changes, cancellation, expiry, and later payment or delivery changes.

## 13. Security and Threat Analysis

### Tenant and authorization threats

- Cross-organization IDs in proposal or acceptance requests could expose or mutate another tenant. Resolve all ownership from persisted relationships and enforce RLS plus server-side checks.
- A `MEMBER`, `CONTRIBUTOR`, or `VIEWER` could attempt to approve a commercial commitment. Require an explicitly approved acceptance permission; default deny.
- A project manager could be mistaken for a commercial approver. Keep delivery permissions and commercial approval permissions separate.
- A suspended membership could retain access through cached UI state. Re-check active membership in every trusted read and mutation.

### Integrity and replay threats

- Replaying acceptance could create duplicate commitments or downstream effects. Require idempotency keys, expected version checks, and immutable acceptance records.
- Concurrent revision/acceptance could accept the wrong version. Lock or compare the expected proposal version and valid status in one transaction.
- Issued or accepted snapshots could be altered after the fact. Deny updates, use immutable version records, and record state transitions as events.
- Catalog edits could rewrite history. Store catalog, scope, terms, and commercial snapshots in proposal items and agreement records.

### Commercial and legal threats

- Guessing price, tax, currency, payment terms, or discount semantics creates an unauthorized commercial commitment. Leave these fields policy-gated and unresolved.
- Treating a click as a legally binding signature without legal approval creates false assurance. Store an acceptance fact and method only after the acceptance standard is decided.
- Automatically activating service from acceptance can create unapproved obligations. Keep proposal/agreement acceptance separate from payment, entitlement, and delivery transitions.

### Data and operational threats

- Client-writable audit rows could erase or forge history. Continue denying direct writes and use trusted paths.
- Sensitive terms or request metadata could leak through broad JSON fields. Validate schemas, minimize metadata, and do not store secrets or payment credentials.
- Unbounded proposal content can create abuse and denial-of-service risk. Apply size limits, structured inputs, rate limits, and pagination when implemented.
- A future webhook or provider callback must not be introduced here; when payment is approved later, signatures, replay protection, idempotency, and reconciliation must be server-side.

## 14. Unresolved Business Decisions and Explicit Blockers

The following are **BUSINESS DECISION BLOCKERS** and must not be silently selected by implementation:

1. Pricing ownership, price representation, and whether prices are fixed, calculated, negotiated, or manually entered.
2. Supported currency or currencies, minor-unit/rounding rules, and whether a proposal may contain multiple currencies.
3. Tax jurisdiction, tax calculation responsibility, tax-inclusive versus tax-exclusive display, exemptions, and tax evidence requirements.
4. Discount authority, discount representation, stacking rules, expiry, and approval limits.
5. Payment terms, payment-before-acceptance versus payment-after-acceptance, deposits, milestones, invoicing, late payment, refunds, credits, and chargebacks.
6. Whether a proposal can be accepted before payment and whether acceptance is binding without an agreement.
7. Whether an agreement is mandatory, what legal terms/version are authoritative, and how amendments, renewals, termination, and expiry work.
8. Who is authorized to issue, approve, and accept proposals and agreements. Existing `OWNER`, `ADMIN`, `MEMBER`, `PROJECT_MANAGER`, `CONTRIBUTOR`, and `VIEWER` roles must not be silently reinterpreted.
9. Whether `OWNER` or `ADMIN` can accept on behalf of an organization, and what evidence of authority is required. `MEMBER` must not be assumed to have that authority.
10. Acceptance method: ordinary authenticated acceptance, clickwrap, typed name, uploaded signature, qualified e-signature, or another legally reviewed method.
11. Required identity verification, consent text, IP/device retention, terms presentation, and evidence retention for acceptance.
12. Whether repeated offering purchases, phased work, custom items, partial approvals, or multiple projects per proposal are supported.
13. Whether one agreement may cover multiple projects or proposals.
14. The exact commercial state machines and what transitions are reversible.
15. The gates required before proposal/agreement acceptance can lead to payment, entitlement, service activation, observation, or delivery.

Until these decisions are approved, proposal/agreement implementation must remain limited to an approved schema and authorization contract, not production commercial commitment behavior.

## 15. READY FOR IMPLEMENTATION

The following planning outcomes are ready for implementation once a separately approved implementation phase begins, without inventing the blockers above:

- Reuse `organizations` as the initial commercial tenant/customer boundary.
- Keep `projects` as delivery containers and resolve organization ownership through the database.
- Reuse `catalog_pillars`, `catalog_services`, `service_offerings`, and `project_services`.
- Link proposal items to `project_services` optionally for traceability while storing immutable snapshots.
- Create a proposal aggregate plus immutable version boundary, subject to the approved status vocabulary.
- Enforce monotonically increasing proposal versions and immutable issued/accepted historical snapshots.
- Model proposal items as version-owned snapshot rows rather than live catalog projections.
- Create a distinct agreement aggregate rather than treating proposal acceptance as delivery activation.
- Store immutable agreement acceptance evidence tied to a specific agreement/terms version once the acceptance method is approved.
- Reuse and extend `audit_events`; do not create a duplicate audit system.
- Apply RLS, fixed search paths, trusted mutation functions, deny-by-default authorization, expected-version checks, and idempotency.
- Keep commercial state separate from project/service delivery stage.
- Keep proposal/agreement acceptance separate from payment, entitlement, subscription, observation, and delivery activation.
- Preserve historical meaning through scope, catalog identity, terms, and commercial snapshots.
- Use existing Supabase/Postgres infrastructure only and avoid paid SaaS or external providers.

These items are architecture-ready, not permission to create migrations or application code in this audit.

## 16. BLOCKED — BUSINESS DECISIONS REQUIRED

Implementation is blocked for any behavior that creates or represents an actual commercial commitment until the following are decided:

- price, currency, tax, discounts, totals, rounding, and pricing authority
- payment terms, invoice/payment flow, deposits, refunds, credits, and chargebacks
- legally authoritative agreement language and terms versioning
- acceptance authority and whether existing roles may accept
- acceptance/e-signature method and required evidence
- proposal/agreement state transitions and binding effect
- repeated/partial/custom service purchase semantics
- downstream gates for entitlement, payment, subscription, observation, and delivery activation

No amount of schema or UI work should conceal these decisions with nulls, defaults, invented values, or permissive role checks.

## 17. Cost-Control Assessment

The current design is cost-controlled:

- It reuses the existing Supabase/Postgres deployment, Auth, RLS, RPC, and audit foundation.
- It requires no paid SaaS, payment provider, e-signature provider, AI provider, email provider, or monitoring provider.
- It keeps the catalog small and does not add duplicate customer, billing, or audit systems.
- It stores snapshots and references instead of copying external files or introducing document storage prematurely.
- It avoids payment and legal integrations until their business owners define requirements.
- It preserves one-time implementation and separately purchased ongoing service instead of forcing recurring billing.
- It should use bounded JSON snapshots and structured fields with size limits, not an unbounded generic rules engine.
- It should add indexes only for actual tenant/project/version/lookup paths and validate pagination before any client list surface.

Future cost risk comes primarily from provider selection, tax/payment operations, legal/e-signature requirements, storage and retention, and operational labor. Those costs cannot be estimated or promised from the current repository and must remain decisions rather than invented numbers.

## 18. Recommended Future Phase 15.4 Implementation Sequence

This is a future sequence, not work performed in this phase:

1. Obtain written decisions for all commercial and legal blockers, especially pricing, currency, tax, discounts, payment terms, acceptance authority, legal terms, and acceptance method.
2. Approve the proposal/agreement state machines, repeat-purchase semantics, and downstream activation gates.
3. Define the minimal domain contract: proposal, proposal version, proposal item, agreement, acceptance record, references, snapshots, and immutable transition rules.
4. Define the commercial authorization matrix using existing organization/project roles plus explicitly approved action policies. Keep `MEMBER` non-approving unless expressly changed by policy.
5. Define RLS predicates and trusted RPC contracts with cross-tenant and negative authorization cases before schema deployment.
6. Add a forward-only Supabase/Postgres migration for the approved tables, constraints, indexes, RLS, and audit-event references.
7. Implement trusted proposal creation/revision/issuance and immutable version transitions with idempotency and expected-version checks.
8. Implement proposal item snapshot creation and validation against accessible `project_services` without mutating historical rows.
9. Implement agreement creation/acceptance only after legal terms and acceptance evidence are approved.
10. Add focused authorization, RLS, immutability, concurrency, replay, expiry, and audit tests. Do not create test users without approval.
11. Validate that acceptance does not create payment, entitlement, subscription, observation, or delivery activation.
12. Run repository validation and read-only structural verification, then conduct an explicit commercial/legal/security readiness review before any deployment.

## 19. Readiness Score

**Phase 15.4 readiness: 42/100**

Rationale:

- **Architecture foundation: 18/20**. Tenant, project, catalog, role, RLS, trusted RPC, and audit foundations exist and are coherent.
- **Proposal/agreement domain definition: 12/25**. The target separation, snapshot, lifecycle, and audit principles are clear, but exact implementation contracts remain to be approved.
- **Authorization/security readiness: 8/20**. The general authorization and RLS model is strong, but commercial approval authority and acceptance evidence are unresolved.
- **Commercial/legal readiness: 2/25**. Pricing, currency, tax, discounts, payment terms, legal terms, acceptance authority, and acceptance/e-signature requirements are not decided.
- **Operational verification readiness: 2/10**. The migration chain is verified, but no commercial tables or runtime commercial tests exist.

The score measures readiness to begin an approved implementation, not product quality or business viability. It is intentionally below implementation-ready because the unresolved commercial/legal decisions control the correctness of the domain.

## Scope Confirmation

- EXACTLY ONE FILE CHANGED/CREATED: `docs/BLOCKWAVELAB_V2_PHASE_15_4_PLAN.md`
- NO DATABASE CHANGES
- NO APPLICATION CHANGES
- NO DEPLOYMENT
- NO PHASE 15.5 WORK

## 20. Final Phase 15.4 Status

Phase 15.4 planning/audit is complete. No implementation should begin for commercial commitment behavior until the explicit business decision blockers are resolved.

PHASE 15.4 STATUS:
BLOCKED — BUSINESS DECISIONS REQUIRED
