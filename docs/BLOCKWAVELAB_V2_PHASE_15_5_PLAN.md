# BlockWaveLab V2 Phase 15.5 Plan

## Commercial Lifecycle Planning and Audit

## Status

This is a planning and audit document only. No application code, SQL, migration, RPC, UI, payment integration, provider, test user, or deployment was created for Phase 15.5.

**Phase 15.5 planning verdict: GO FOR PLANNING / BLOCKED FOR COMMERCIAL IMPLEMENTATION**

The current repository and linked Supabase migration chain are synchronized through `202609140012`. The commercial foundation is deployed and the scoped cross-tenant remediation is deployed, but the lifecycle domains after proposal/agreement remain intentionally absent.

## 1. Current-State Audit

### Verified platform baseline

- The application is a Vite/React/TypeScript SPA using the existing custom history router.
- Supabase Auth is the identity boundary.
- `organizations` is the tenant/customer boundary.
- `projects` are delivery containers owned by organizations.
- Organization roles are `OWNER`, `ADMIN`, and `MEMBER`.
- Project roles are `PROJECT_MANAGER`, `CONTRIBUTOR`, and `VIEWER`.
- Existing authorization helpers and RLS are database-owned and deny by default.
- The existing `audit_events` table is append-only from the client and is written by trusted functions/triggers.
- The approved catalog remains exactly four pillars and ten services. No catalog or business-category change is proposed.

### Verified commercial baseline

The deployed commercial foundation contains:

- `proposals`
- `proposal_versions`
- `proposal_items`
- `agreements`
- `agreement_versions`
- `agreement_acceptances`

The commercial foundation also contains trusted functions for:

- proposal creation
- proposal version/item snapshot creation
- proposal issue
- proposal acceptance
- agreement creation
- agreement version creation
- agreement acceptance

All six commercial tables have RLS. Direct client table writes are denied. Sensitive mutations use `SECURITY DEFINER`, fixed search paths, and authenticated-only grants. `OWNER` is the current commercial mutation/acceptance authority. `ADMIN` is not automatically granted final commercial authority.

The remediation migration `202609140012_commercial_gap_remediation.sql` validates organization, project, proposal, and accepted current proposal-version relationships before agreement creation. It preserves the original foundation migration and is synchronized remotely.

### Existing project/service lifecycle baseline

- `projects.delivery_stage` already contains delivery concepts including `IMPLEMENTATION`, `DEPLOYMENT`, `OBSERVATION`, `STABILIZATION`, `DOCUMENTATION`, `HANDOVER`, and `ONGOING_SERVICE`.
- `project_services.status` contains `REQUESTED`, `QUOTED`, `APPROVED`, `PAYMENT_PENDING`, `ACTIVE`, `PAUSED`, `CANCELLED`, and `COMPLETED`.
- The existing selection RPC creates only `REQUESTED` project-service rows and does not create proposals, agreements, payments, entitlements, or delivery activation.
- No deployed trusted RPC currently advances a project service from commercial approval/payment gates into `ACTIVE` delivery.
- Existing project audit triggers record project and project-service changes, but they do not implement a complete commercial-to-delivery gate.

### Explicitly absent

No deployed tables or trusted boundaries exist for:

- payment intents/orders
- payment transactions or settlements
- payment provider events/webhooks
- invoices
- refunds, credits, or chargebacks
- subscriptions or recurring billing schedules
- entitlements
- service delivery engagements
- observation records
- commercial activation gates
- payment reconciliation
- trial instances or trial-abuse controls

The current UI exposes project-level proposal/agreement actions and standalone authenticated proposal/agreement index/detail routes. It clearly states that acceptance does not create payment, entitlement, or delivery activation. It does not expose payment, entitlement, subscription, or delivery activation controls.

## 2. Existing Implementation Inventory

### Do not rebuild

The following existing foundations should be reused:

- `organizations` as tenant/customer boundary.
- `projects` as delivery containers.
- `organization_members` and `project_members` as authorization relationships.
- Existing `OWNER`, `ADMIN`, `MEMBER`, `PROJECT_MANAGER`, `CONTRIBUTOR`, and `VIEWER` role definitions.
- Existing `private.current_active_organization_role`, `private.current_active_project_role`, `private.has_project_access`, and role helper patterns.
- Existing catalog tables and their four-pillar/ten-service content.
- Existing `project_services` selection record and `REQUESTED` entry boundary.
- Existing proposal/agreement tables, snapshots, checksums, version lineage, and immutability triggers.
- Existing typed organization data helpers and Supabase browser client boundary.
- Existing custom router and authenticated `PlatformApp` shell.
- Existing RLS pattern, fixed-search-path `SECURITY DEFINER` functions, authenticated-only grants, and client-denied sensitive writes.
- Existing append-only `audit_events` foundation.

### Current correctness boundary

The current foundation is sufficient for:

```text
Catalog
  -> requested project service
  -> proposal/version snapshot
  -> proposal acceptance
  -> agreement/version snapshot when required
  -> agreement acceptance fact
```

It is not sufficient for:

```text
agreement/payment relationship
  -> payment attempt/settlement
  -> payment event reconciliation
  -> entitlement issuance
  -> service activation
  -> delivery/observation start
```

## 3. Commercial Lifecycle Model

The approved conceptual sequence remains:

```text
CATALOG
  -> SERVICE_SELECTION / REQUESTED
  -> PROPOSAL
  -> PROPOSAL_ACCEPTANCE
  -> AGREEMENT WHEN REQUIRED
  -> PAYMENT
  -> ENTITLEMENT
  -> DELIVERY_ACTIVATION
  -> IMPLEMENTATION
  -> DEPLOYMENT
  -> PAID OBSERVATION
  -> STABILIZATION
  -> DOCUMENTATION
  -> HANDOVER
  -> OPTIONAL SEPARATELY PAID ONGOING_SERVICE
```

This is a sequence of separate state boundaries, not one universal status column. No step should infer or automatically create the next step.

### Existing proposal boundary

Existing proposal statuses are:

```text
DRAFT
INTERNAL_REVIEW
SENT
VIEWED
CHANGES_REQUESTED
ACCEPTED
REJECTED
EXPIRED
CANCELLED
```

The deployed functions enforce owner authority, current-version checks, validity checks, and issued/accepted snapshot protection. Proposal items snapshot catalog/service identity and scope rather than relying only on live catalog data.

Known limitations for later refinement:

- Proposal acceptance is a state transition, not a separate immutable proposal-acceptance relation.
- Proposal create/issue/accept operations do not all use an idempotency key.
- Runtime authorization and replay tests remain deferred.
- Proposal acceptance does not determine payment, entitlement, agreement applicability, or delivery activation.

### Existing agreement boundary

Existing agreement statuses are:

```text
DRAFT
PENDING_ACCEPTANCE
ACTIVE
SUSPENDED
TERMINATED
EXPIRED
```

Agreement versions snapshot terms and checksum. Agreement acceptance records actor, exact version, timestamp, checksum, and idempotency key. Acceptance activates only the agreement aggregate; it does not activate payment, entitlement, subscription, project service, or delivery.

The remediation now requires a supplied proposal and source version to resolve to the same organization/project and to be the accepted current proposal version. An organization/project-only agreement can still be created when no proposal reference is supplied; whether that is permitted for every engagement type belongs to policy and must not be used to bypass required agreement rules.

## 4. Proposed State Boundaries

These are design requirements for a future implementation phase, not deployed states.

### Commercial commitment state

Proposal and agreement states remain separate from settlement and delivery. A future policy should define whether accepted proposal state is binding, whether agreement is mandatory by engagement type, and the exact transition ownership.

### Payment state

Payment must have its own aggregate and state machine. Candidate states are provider-neutral and require approval:

```text
PENDING
REQUIRES_ACTION
PROCESSING
SUCCEEDED
FAILED
CANCELLED
REFUNDED
PARTIALLY_REFUNDED
DISPUTED
```

These are not approved final enums and must not be implemented by assumption.

### Entitlement state

Entitlement should represent what the organization/project may receive, from which source, during what period, and under what restrictions:

```text
PENDING
ACTIVE
SUSPENDED
REVOKED
EXPIRED
```

An entitlement must not be implied by proposal acceptance, agreement acceptance, payment intent creation, or browser state.

### Delivery activation state

Delivery activation should be a distinct controlled transition into a service-delivery record or equivalent. It must not reuse `project_services.status = ACTIVE` as an unguarded shortcut. The transition must preserve the existing delivery lifecycle and paid observation rule.

## 5. Missing Boundary: Proposal Acceptance to Delivery

The exact missing boundary is:

```text
Proposal ACCEPTED
  -> decide whether Agreement is required
  -> Agreement ACTIVE when required
  -> approved payment obligation/attempt
  -> verified settlement or approved exception
  -> entitlement decision
  -> explicit project-service/service-delivery activation
  -> delivery stage transition
```

Currently, proposal acceptance and agreement acceptance are implemented, while every later edge is absent. No current function safely answers:

- what amount is owed for a commitment;
- which payment attempt belongs to which proposal/agreement/version;
- whether a payment event is authentic and settled;
- whether a refund, credit, cancellation, or failed payment changes access;
- what capability/time window is entitled;
- whether a selected service is ready and authorized to activate;
- when implementation or paid observation may start.

The next implementation must not collapse these questions into one `ACTIVE` flag.

## 6. Payment Boundary Design Requirements

Payment implementation is not authorized by this plan. Before it begins, the following design must be approved:

### Commercial state machine

Define aggregate-specific transitions for proposal, agreement, payment obligation, payment attempt, and settlement. Specify whether payment may occur before or after acceptance, how full upfront versus deposit/milestone terms are represented, and how separately recurring ongoing service is handled.

No exact deposit percentage, tax rule, legal promise, price, or provider behavior may be invented.

### Payment intent/order abstraction

Introduce a provider-neutral server-owned payment obligation/intent abstraction linked to:

- organization
- project where applicable
- source proposal/version
- source agreement/version where applicable
- approved commercial snapshot reference
- amount/currency snapshot after pricing policy is implemented
- due/expiry policy
- idempotency key
- current processing state

The browser must request a server-created intent/order and must never set a payment to succeeded.

### Transaction model

Separate payment intent/order from immutable transaction/attempt records. A transaction should preserve provider-neutral attempt state, settlement timestamp, safe provider reference, amount/currency snapshot, failure category, and correlation/idempotency references. Do not store provider secrets or raw payment credentials.

### Payment event/webhook boundary

Create a server-only verified event boundary later. It must:

- verify provider signatures when a provider is selected;
- reject replayed event IDs;
- store an immutable safe event reference/payload hash;
- process events idempotently;
- reconcile asynchronous success/failure/dispute/refund outcomes;
- never trust browser payment success.

Provider selection is intentionally deferred.

### Refund/credit boundary

Define refund, credit, chargeback, and cancellation as separate settlement/policy records, not status edits. Link each correction to the originating payment/transaction and preserve proposal, agreement, audit, and entitlement history.

Refund/cancellation remains case-based and scope-aware. No unconditional no-refund or percentage policy is approved.

### Failure/cancellation handling

Define policy-driven outcomes for:

- payment failure before delivery activation;
- payment failure during an active commitment;
- expired payment intent;
- cancellation before implementation;
- cancellation during implementation;
- cancellation during paid observation;
- cancellation of ongoing monthly service;
- refund or dispute after entitlement/delivery has begun.

Each outcome must state whether new work stops, whether existing access remains readable, whether entitlement is suspended/revoked, and whether delivery is paused or terminated. Legal/accounting approval is required for customer-facing promises.

### Agreement/payment relationship

A payment obligation must reference the exact accepted commercial source and cannot be created from an arbitrary organization/project request. A recurring payment obligation must reference the separate ongoing-service commitment rather than assuming it from one-time implementation.

## 7. Entitlement Boundary Design Requirements

An entitlement model must be designed before service activation or protected capability access.

Required properties:

- organization and project/service subject;
- capability or offering key;
- source type and source reference, such as approved agreement/version, verified payment/transaction, approved exception, or later trial policy;
- starts/ends timestamps;
- bounded state;
- scope/limits snapshot;
- creation, suspension, revocation, and expiry actor/reason fields;
- correlation to originating commercial and audit records.

### Activation rules

Entitlement issuance must be a trusted server transition after approved prerequisites. It must not occur from:

- catalog selection;
- proposal acceptance alone;
- agreement acceptance alone;
- a client-provided payment-success flag;
- an unverified provider callback;
- a browser route or UI status.

### Revocation/suspension rules

Future policy must define effects of payment failure, cancellation, refund, credit, dispute, agreement termination, expiry, and project/service pause. Entitlement history must remain immutable even when current access changes.

### One-time versus ongoing service

One-time implementation entitlement and optional ongoing-service entitlement must be separate source-linked decisions. Ongoing service is monthly-primary and separately purchased; it must not continue forever after handover or be inferred from implementation completion.

## 8. Delivery Activation Boundary Design Requirements

Delivery activation must be separate from commercial acceptance and settlement.

Before activation, a trusted transition must verify at least:

- organization and project remain active and accessible;
- the target `project_service` belongs to that project and approved catalog lineage;
- proposal/agreement requirements for the engagement type are satisfied;
- required payment/settlement or approved exception is verified;
- required entitlement exists and is active;
- scope snapshot and delivery prerequisites are present;
- actor has the approved activation authority;
- expected state/version checks pass;
- the transition is idempotent;
- an audit event is written atomically.

Activation must not automatically skip implementation, deployment, paid observation, stabilization, documentation, or handover. Ongoing service requires a separate commitment and activation after the appropriate boundary, normally after handover.

## 9. Data Model Requirements

Future implementation should add only aggregates needed by approved policy.

### Payment domain

Potential provider-neutral records:

- payment obligations/intents/orders;
- payment attempts/transactions;
- immutable payment events;
- refund/credit/chargeback records;
- reconciliation/processing state where required.

Every tenant-owned record must have an organization path. Project-scoped records must enforce project ownership. Financial records must use restrictive delete behavior and immutable settlement snapshots.

### Entitlement domain

Potential records:

- entitlements;
- entitlement lifecycle events or immutable transition records;
- source references to accepted agreement/version and verified settlement/exception;
- scope/limits and effective windows.

### Delivery domain

Potential records:

- service delivery engagement linked to `project_service`;
- delivery stage/status separated from commercial/payment state;
- observation record with paid implementation scope, start/end, findings, and stabilization handoff;
- service/project lifecycle events for controlled transitions.

Do not create a second tenant, customer, catalog, role, or audit foundation. Do not add tables merely because they appear in an older conceptual blueprint; confirm ownership, lifecycle, and retention first.

## 10. API/RPC Requirements

Future sensitive operations should use trusted server/RPC boundaries with fixed search paths, authenticated-only grants, safe errors, and expected-version/idempotency checks.

Required future operation families:

- create/issue payment obligation from an exact accepted source;
- create or confirm a provider-neutral payment attempt through a server boundary;
- receive and verify provider events after provider selection;
- reconcile payment state idempotently;
- create/suspend/revoke/expire entitlement through trusted transitions;
- activate/pause/cancel a project service or service-delivery engagement through explicit gates;
- advance delivery/observation lifecycle with evidence and concurrency checks;
- record refunds/credits/disputes without erasing history.

The browser must not write financial, entitlement, activation, webhook, or lifecycle rows directly. Do not create these functions in Phase 15.5 planning.

## 11. Authorization Requirements

Preserve the existing role ceilings:

- `OWNER`: ultimate commercial authority according to approved policy; does not bypass state, source, payment, entitlement, or audit gates.
- `ADMIN`: operational commercial management only where explicitly permitted; no automatic OWNER-level final authority.
- `MEMBER`: no commercial approval authority by default.
- `PROJECT_MANAGER`: delivery/project authority only unless a separate approved policy grants a specific activation action; never infer financial acceptance authority.
- `CONTRIBUTOR`: project work only.
- `VIEWER`: read-only project-visible access.

Future payment, entitlement, and delivery actions require action-specific policies. A project role cannot cross organizations or authorize payment settlement. Platform/internal operator access must use an existing approved policy path; no new commercial role should be invented in this phase.

## 12. RLS and Security Requirements

Every future payment, entitlement, and delivery table needs RLS and tenant predicates before exposure.

Required controls:

- direct organization/project ownership resolution from persisted rows;
- active membership checks on reads and mutations;
- cross-tenant foreign-key and relationship validation;
- client-denied writes for financial, entitlement, lifecycle-event, and webhook records;
- `SECURITY DEFINER` only where necessary, with fixed search paths and restricted execute grants;
- safe `404`/`403` behavior without tenant existence leakage;
- append-only source/event records and restricted mutable processing fields;
- no service-role credential in browser code;
- no secrets or raw payment credentials in ordinary business rows;
- replay protection for event IDs and idempotency keys;
- rate limits and bounded payloads for callbacks and mutation endpoints.

The current `create_agreement` remediation demonstrates the required source-relationship validation pattern and should be reused.

## 13. Idempotency Requirements

Idempotency must be designed per operation, not treated as a single generic flag.

Required future keys/guards include:

- payment obligation creation for one accepted source and commercial purpose;
- provider payment attempt creation;
- provider event ID processing;
- refund/credit/dispute processing;
- entitlement issuance/revocation transitions;
- service/delivery activation;
- delivery stage transitions;
- notification/reconciliation jobs if introduced.

Expected-version locks must prevent concurrent acceptance, payment state changes, entitlement issuance, and activation from acting on stale commercial state. Replays must return the existing safe result or a deterministic conflict, never duplicate financial/access effects.

## 14. Audit/Event Requirements

The existing `audit_events` foundation should remain the single business/security audit sink. It is sufficient for actor/action/target history, but it is not a substitute for transactional domain records.

### Reuse `audit_events` for

- payment intent/attempt created or state changed;
- provider event accepted/rejected/replayed;
- refund/credit/chargeback decisions;
- entitlement issued/suspended/revoked/expired;
- service activation/pause/cancel;
- delivery and observation transitions;
- authorization denials for sensitive actions.

### Add persistent lifecycle/event structures when needed for

- immutable provider event payload/reference and processing state;
- payment reconciliation queues;
- entitlement transition history that must be queried as domain state;
- delivery/observation evidence and stage-specific history;
- retryable asynchronous processing.

A generic duplicate audit table must not be created. Domain event records should carry organization/project/source references, previous/next state, actor, correlation/idempotency reference, safe metadata, and trusted timestamps.

## 15. UI Implications

Current UI behavior is correctly bounded:

- project selection says `REQUESTED` only;
- proposal/agreement screens show commercial state and snapshots;
- acceptance copy states payment, entitlement, and delivery remain separate;
- no payment, checkout, invoice, subscription, entitlement, or delivery activation controls are exposed;
- private commercial routes use authenticated `noindex, nofollow` behavior.

Future UI must not show:

- “paid” from proposal/agreement acceptance;
- active entitlement from payment intent creation;
- active service from a selected `project_service`;
- delivery/observation started from agreement activation;
- recurring service continuing automatically after implementation.

Future payment/entitlement/delivery UI should be added only with server-confirmed states, explicit loading/error/forbidden/reconciliation states, and visible source/version history.

## 16. Deferred Items

Deferred from Phase 15.5 planning and implementation:

- actual prices, pricing engine, tax/VAT calculation, discounts, margins, and payment percentages;
- payment provider selection, checkout, invoices, payment webhooks, settlement, reconciliation, refunds, credits, and chargebacks;
- subscriptions and recurring billing implementation, while preserving monthly-primary/annual-later policy;
- entitlements and entitlement enforcement;
- automatic service activation and delivery automation;
- observation execution, monitoring, stabilization, documentation, and handover automation;
- three-day trial and abuse/cost controls;
- e-signature/legal-provider integration;
- email/SMS/payment notifications;
- runtime A/B/security tests requiring approved authenticated identities;
- new business categories, services, roles, customer abstractions, or duplicate audit systems.

## 17. Explicit Implementation Order

This is a future sequence, not authorization to implement now:

1. Approve final payment, cancellation/refund/credit, accounting, provider, and failure-state policies without inventing values.
2. Define provider-neutral payment obligation, attempt/transaction, and immutable event contracts.
3. Define exact agreement/payment relationship and source-version requirements.
4. Define entitlement source, time-window, scope, activation, suspension, revocation, and expiry policy.
5. Define delivery/service activation gates, project-service transitions, readiness evidence, and paid observation entry/exit conditions.
6. Define aggregate-specific states, action policies, idempotency keys, concurrency rules, and safe errors.
7. Define RLS predicates, cross-tenant negative tests, retention, and audit/event references.
8. Implement payment foundation only after the above approvals and provider selection.
9. Implement entitlement only against verified commercial/payment outcomes and approved exceptions.
10. Implement service/delivery activation only after entitlement and readiness gates are enforceable.
11. Add focused runtime/RLS/replay/immutability/reconciliation tests with approved identities and no fabricated credentials.
12. Perform a new readiness review before any production deployment.

## 18. Risks and Gaps

- No runtime authenticated A/B evidence exists yet; role and RLS conclusions are static until approved sessions are available.
- Payment provider, tax/accounting, refund/credit, and failure policy choices remain external or business-owned.
- `project_services` contains future payment/active statuses without a complete controlled commercial-to-delivery transition boundary.
- `audit_events` can record history but cannot provide payment settlement, webhook retry, entitlement window, or delivery evidence semantics by itself.
- Proposal acceptance lacks a dedicated immutable acceptance relation and broad create operations lack idempotency keys; this should be addressed only if approved in the next commercial design.
- Multiple-project, repeat, partial, and custom scope support exists in the proposal model direction but needs payment/entitlement allocation rules before activation.
- Recurring ongoing service must not be inferred from one-time implementation or agreement activation.
- Historical and financial retention requirements may add cost and legal/accounting obligations.
- Existing legacy marketing/lead-generation files contain unsupported older business language and provider-oriented concepts; they are outside the approved commercial platform boundary and must not be reused for Phase 15.5.

## 19. Readiness Score

**Phase 15.5 planning readiness: 68/100**

Rationale:

- **Current architecture and commercial foundation: 19/20.** Tenant, catalog, project-service, proposal, agreement, RLS, authorization, and audit foundations are deployed and scoped.
- **Payment boundary readiness: 14/25.** The required provider-neutral concepts and security boundary are clear, but provider, accounting, failure, refund, and payment sequencing policy remain unresolved.
- **Entitlement boundary readiness: 13/20.** Source-linked, time-bounded entitlement requirements are clear, but activation/revocation policy and enforcement do not exist.
- **Delivery activation readiness: 12/20.** Existing project/service lifecycle vocabulary exists, but controlled commercial-to-delivery gates and service-delivery records are absent.
- **Runtime/security evidence: 10/15.** Static validation and migration synchronization are strong; authenticated A/B/RLS/replay tests remain deferred.

This score means the next lifecycle phase is ready for detailed design and business/provider decisions. It does not mean payment, entitlement, or delivery implementation is ready to deploy.

## 20. Final Verdict

**GO FOR PHASE 15.5 PLANNING / BLOCKED FOR IMPLEMENTATION**

Phase 15.5 may proceed as design, policy-resolution, threat-model, and test-contract work. Payment, entitlement, and delivery activation implementation must remain blocked until the explicit boundaries, provider/accounting decisions, state machines, idempotency rules, and RLS/negative-test contracts are approved.

## 21. Audit Scope and Validation

Inspected:

- current worktree status and current `public/sitemap.xml` state;
- linked Supabase migration synchronization through `202609140012`;
- migrations for organizations, memberships, projects, project roles, audit events, catalog, project services, commercial foundation, and gap remediation;
- Phase 15 commercial implementation, runtime audit, and gap-remediation reports;
- Phase 15 planning, business-decision register, Phase 11/13 authorization architecture, database blueprint, API blueprint, client journey, and platform architecture;
- current typed organization/commercial data helpers and domain types;
- current project commercial panel, standalone commercial routes, custom router, and authenticated SEO configuration;
- static searches for payment, invoice, subscription, entitlement, provider, secret, and service-role access patterns in the relevant commercial surfaces.

Validation performed:

- read-only `git status` and sitemap diff inspection;
- read-only `supabase migration list --linked`;
- static schema/RPC/RLS/authorization/lifecycle inspection;
- no migrations, code, UI, SQL, users, credentials, or deployment were created by Phase 15.5 planning;
- `git diff --check`.

No existing files were modified by this Phase 15.5 planning task before this document was created. The existing unrelated worktree changes were preserved.
