# Phase 15.6 Payment Foundation Implementation

## Status

**Implemented and deployed: provider-neutral payment obligation, payment-attempt, entitlement, delivery activation, implementation, deployment, observation, stabilization, documentation, handover, and optional ongoing-service foundations with lifecycle hardening and authenticated client visibility.**

This phase does not implement payment settlement, a payment provider, checkout, webhooks, reconciliation, refunds, credits, disputes, tax calculation, subscriptions, recurring billing execution, delivery activation, observation automation, e-signature, or new commercial roles.

## Phase 15.18D - Deployment and Remote Security Verification

### Implemented

- `202609150025_payment_settlements.sql` defines verified Stripe settlement records, trusted settlement reconciliation, audit linkage, RLS, and uniqueness constraints.
- `supabase/functions/stripe-webhook/index.ts` accepts POST requests, verifies the raw Stripe webhook body and signature, reconciles internal payment metadata, and calls the trusted settlement RPC.
- The settlement RPC uses `SECURITY DEFINER`, a fixed `search_path`, server-role enforcement, tenant and obligation/attempt relationship checks, amount and currency validation, idempotency checks, and audit creation.
- Settlement remains separate from entitlement and delivery activation; no downstream lifecycle is advanced automatically.

### Remote deployed

- Migration `202609150025` was applied successfully to the linked Supabase project and `supabase migration list --linked` confirms synchronization through `202609150025`.
- Edge Function `stripe-webhook` was deployed successfully and is reported `ACTIVE` at version 2.
- Function configuration reports `verify_jwt: false` for this function only. Stripe webhook authentication remains enforced by `Stripe-Signature` verification in the function.

### Verified

- The remote migration ledger confirms the settlement migration is applied after `202609150024`.
- The deployed function is named `stripe-webhook` and uses the intended entrypoint.
- The migration defines `public.payment_settlements`, `payment_settlement_id` on `audit_events`, the `payment_settlement_created` audit event, provider-event uniqueness, and payment-attempt uniqueness.
- RLS and trusted-server-only insert/update/delete policies are defined by the deployed migration; authenticated members have read access only within the existing organization/project authorization boundary.
- The function preserves the raw request body, rejects non-POST requests and missing signatures, verifies signatures before trusting event payloads, ignores unsupported verified event types safely, and never trusts browser redirects or client payment state.
- Structural idempotency is verified from the deployed migration. Real replay behavior requires a genuine Stripe event and remains deferred.

### Deferred

- Stripe secrets are not configured in the remote function environment; no `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` was present in the secret inventory.
- No real Stripe payment or webhook event was sent. Live signature validation, provider delivery, and replay/idempotency runtime testing remain deferred.
- Entitlement activation, delivery activation, implementation, deployment, observation, stabilization, documentation, handover, and ongoing service remain intentionally separate from settlement.

## Migration


## Database Object

## Provider-Neutral Payment Integration Boundary

The internal payment foundation now has a provider-neutral TypeScript boundary in `src/lib/payments/`:

- `types.ts`: checkout request/result, checkout status, verification, provider error, and source-context contracts;
- `providerAdapter.ts`: future provider adapter contract for checkout creation, status retrieval, result verification, normalized provider references, and safe errors;
- `service.ts`: fail-safe payment service that returns `PROVIDER_NOT_CONFIGURED` or `PROVIDER_NOT_INTEGRATED` and never fabricates a checkout URL, transaction reference, payment success, settlement, or entitlement activation.

Checkout requests reference existing internal payment obligation and attempt IDs. Amount, currency, tenant, project, commercial source, and payment state remain server-authoritative database facts. No provider SDK, credentials, webhook, settlement, or migration was added.

The project payment panel is intentionally truthful and shows the provider boundary state, while the real processor flow lives behind the server-only adapter layer.

### Stripe provider status

The first real provider integration has been implemented as a server-only Stripe adapter behind the neutral payment boundary:

- `src/lib/payments/stripeProviderAdapter.ts` loads `STRIPE_SECRET_KEY` only from the server process environment and never from browser/Vite values;
- the adapter creates Stripe Checkout sessions using `stripe.checkout.sessions.create(...)` with a provider-specific metadata payload and safe redirect URLs;
- the adapter can retrieve checkout session status and inspect the related `payment_intent` without exposing Stripe secrets to the client;
- the adapter returns provider-not-configured errors until a trusted server secret is present, preventing fabricated success or fake settlement claims;
- checkout initiation remains governed by the existing payment obligation and payment-attempt lifecycle; no entitlement or delivery activation is triggered by a browser redirect alone.

This is an implementation of the Stripe boundary, not a live payment settlement or entitlement activation. The following are still deferred until deployment secrets and webhook configuration are available:

- secure settlement reconciliation against provider events;
- persistence of successful payment verification into trusted settlement records;
- entitlement activation after verified settlement;
- production checkout success/cancel callback handling and webhook-driven state transitions;
- end-to-end runtime verification against actual Stripe credentials and test/live events.

### Stripe webhook verification foundation

The provider boundary now adds a server-side verification step that validates the raw Stripe request body against the `Stripe-Signature` header using `stripe.webhooks.constructEvent(...)` and `STRIPE_WEBHOOK_SECRET` from the trusted server environment. This is the minimum required safety gate for receiving provider events without trusting browser callbacks or redirect success URLs.

The verification result is intentionally limited to signature validation and event correlation:

- it returns a verified `eventId`, `eventType`, object type, and provider object reference;
- it does not assert settlement success, entitlement activation, or delivery progression;
- it fails closed if the secret is missing or the signature header is absent or invalid;
- it remains behind the provider-neutral payment service and never exposes Stripe secrets to the browser.

This allows future server routes or worker jobs to ingest provider events, correlate them to internal `payment_attempt`s, and apply a separate, policy-controlled settlement transition only after a trusted server verifies the webhook and the business rules permit it.

### `public.payment_obligations`

The table represents a concrete amount owed from an accepted commercial source. It does not mean that money was paid, payment settled, entitlement activated, or delivery activated.

Stored fields include:

- organization and optional project ownership
- exact proposal and accepted current proposal-version references
- optional agreement and agreement-version references as a paired source
- `IMPLEMENTATION` or `ONGOING_SERVICE` purpose
- `UPFRONT`, `DEPOSIT`, `MILESTONE`, or `RECURRING` schedule entry point
- positive integer `amount_minor`
- current `USD` currency context with a three-letter extensibility check
- due and expiry timestamps
- conservative obligation states: `PENDING`, `CANCELLED`, `EXPIRED`
- immutable commercial snapshot JSON
- schedule snapshot JSON
- server-enforced idempotency key
- creator and timestamps

No floating-point monetary arithmetic is used. No percentage, price, tax, discount, or provider behavior is invented.

The foundation intentionally does not expose `SUCCEEDED`: provider settlement truth belongs to a future payment settlement/transaction domain.

## Trusted RPCs

### `public.create_payment_obligation(...)`

- accepts USD only in this foundation;
- validates purpose and schedule entry point;
- validates JSON object snapshots and due/expiry ordering;
- validates agreement organization/project/source proposal relationship;
- requires a supplied agreement version to be active and accepted;
- persists a server-built commercial source snapshot;
- returns the existing obligation for an identical idempotent retry;
- rejects reuse of an idempotency key for a different obligation;
- writes `payment_obligation_created` to `audit_events` atomically with creation.

### `public.cancel_payment_obligation(...)`

The cancellation RPC:

- requires an authenticated organization owner;
- locks the target obligation;
- requires an expected state, defaulting to `PENDING`;
- permits only `PENDING -> CANCELLED`;
- rejects stale or already transitioned state;

The project commercial surface also shows a read-only ongoing-service section with ongoing-service ID, handover ID, project service, entitlement ID, status, monthly/annual billing mode, reference, and start context. If no record exists, it shows an empty state. No subscription, checkout, billing, payment, pause, resume, completion, cancellation, or collection controls are exposed.
- writes `payment_obligation_cancelled` to `audit_events` atomically.

No success, settlement, refund, credit, dispute, expiry automation, entitlement, or delivery transition RPC was created.

## Lifecycle Hardening

Migration `202609150014_payment_obligation_hardening.sql` adds a database trigger that makes the organization, project, proposal/version, agreement/version, purpose, schedule, amount, currency, due/expiry timestamps, snapshots, idempotency key, creator, and creation timestamp immutable after creation.

The only permitted status transitions are:

```text
PENDING -> CANCELLED
PENDING -> EXPIRED
```

`CANCELLED` and `EXPIRED` cannot transition back to another state or between each other. Direct client updates and deletes remain denied, and the trigger also protects trusted-function boundaries.

`public.expire_payment_obligation(...)` was added. It is owner-authorized, expected-state checked, and only expires a pending obligation whose explicit `expires_at` timestamp has passed. It records `payment_obligation_expired` through the existing audit sink.

## Payment Attempt Foundation

### `public.payment_attempts`

The table sits after a payment obligation and before any future provider settlement layer. It preserves organization/project ownership derived from the obligation, the linked obligation ID, amount/currency, an immutable commercial snapshot, idempotency key, actor, timestamps, and an attempt status.

Attempt statuses are limited to:

```text
CREATED
PROCESSING
FAILED
CANCELLED
EXPIRED
```

No `SUCCEEDED`, `SETTLED`, `REFUNDED`, or `DISPUTED` state was added.

### `public.create_payment_attempt(...)`

The trusted creation RPC:

- requires an authenticated organization owner;
- locks and validates a `PENDING` payment obligation;
- derives organization and project from the obligation rather than trusting browser ownership fields;
- requires amount and currency to match the obligation;
- rejects cross-tenant or invalid obligation references;
- persists obligation and commercial source context in an immutable snapshot;
- returns the existing attempt for an identical idempotent retry;
- rejects conflicting idempotency-key reuse;
- writes `payment_attempt_created` to `audit_events`.

### `public.transition_payment_attempt(...)`

The lifecycle RPC permits only:

```text
CREATED -> PROCESSING
CREATED -> FAILED
CREATED -> CANCELLED
CREATED -> EXPIRED
PROCESSING -> FAILED
PROCESSING -> CANCELLED
PROCESSING -> EXPIRED
```

Terminal attempt states cannot transition again. Failed attempts require a reason. No provider settlement or success transition is exposed.

### Attempt immutability and security

An immutable-field trigger protects attempt identity, ownership, obligation, amount, currency, commercial snapshot, idempotency key, creator, and creation timestamp. Direct client writes remain denied by RLS, and trusted lifecycle changes are expected-state checked and audited.

## Entitlement Foundation

### `public.entitlements`

The entitlement table represents a future validated right for an organization/project to receive a scoped project service. It remains separate from payment attempts, provider settlement, and delivery activation.

It preserves organization, project, canonical `project_service_id`, payment-obligation and exact proposal/version sources, optional agreement/version sources, source type `VERIFIED_COMMERCIAL_EVENT`, states `PENDING`, `ACTIVE`, `PAUSED`, `EXPIRED`, and `CANCELLED`, start/end timestamps, immutable scope/source snapshots, activation reference, idempotency key, actor, and timestamps.

No entitlement is created automatically by a payment attempt. Existing attempt states cannot activate an entitlement.

### Activation boundary

`public.activate_entitlement(...)` is a service-role-only trusted boundary reserved for a future verified commercial event. It is not granted to `authenticated`, has no browser data helper, and is not called by payment attempts or the current UI.

When eventually called, it validates the pending obligation, matching project service, accepted current proposal version, active/accepted agreement when present, source integrity, date window, activation reference, and idempotency.

### Entitlement lifecycle

Allowed transitions are:

```text
PENDING -> ACTIVE
PENDING -> CANCELLED
ACTIVE -> PAUSED
ACTIVE -> EXPIRED
ACTIVE -> CANCELLED
PAUSED -> ACTIVE
PAUSED -> EXPIRED
PAUSED -> CANCELLED
```

Expiry requires an elapsed `ends_at`. Source, grant, ownership, snapshot, identity, and creation fields are immutable; direct writes and deletes remain denied. OWNER-authorized lifecycle helpers cover pause, resume, expiry, and cancellation.

## Phase 15.9 Delivery Activation Foundation

### `public.delivery_activations`

Delivery activation is a separate admission layer after entitlement. It requires an active entitlement and begins at the approved `IMPLEMENTATION` delivery stage.

The table preserves organization, project, project service, entitlement, activation status, delivery stage, immutable activation snapshot, activation reference, idempotency identity, activation/completion timestamps, actor, and status reason.

Delivery activation states are `ACTIVE`, `PAUSED`, `COMPLETED`, and `CANCELLED`. Delivery stages remain the approved lifecycle vocabulary: `IMPLEMENTATION`, `DEPLOYMENT`, `OBSERVATION`, `STABILIZATION`, `DOCUMENTATION`, `HANDOVER`, and `ONGOING_SERVICE`.

No automatic stage progression is implemented. Activation does not imply payment settlement, deployment, implementation completion, observation completion, handover, or ongoing service.

### Activation authority

`public.activate_delivery(...)` is service-role-only and requires a valid trusted actor UUID. It validates an `ACTIVE` entitlement, prevents duplicate active activation for the same entitlement, derives organization/project/service relationships from the entitlement, snapshots the source, and starts at `IMPLEMENTATION`.

Payment attempts, payment obligations, and authenticated browser clients cannot call this activation boundary.

OWNER-authorized trusted operations support `ACTIVE -> PAUSED`, `PAUSED -> ACTIVE`, `ACTIVE/PAUSED -> COMPLETED`, and `ACTIVE/PAUSED -> CANCELLED`. Source identity, entitlement, ownership, activation snapshot, activation reference, idempotency identity, original stage, actor, and creation metadata are immutable. Important mutations are recorded in `audit_events`.

## Delivery Implementation Foundation

### `public.implementation_records`

Implementation records represent the work workspace after delivery activation and only for the `IMPLEMENTATION` stage. Each record links the organization, project, project service, delivery activation, and entitlement.

The record preserves implementation status, implementation reference, immutable scope/source snapshots, idempotency identity, status reason, started/paused/completed timestamps, actor, and audit timestamps.

Implementation states are `ACTIVE`, `PAUSED`, `COMPLETED`, and `CANCELLED`. Initialization requires all of the following:

- an active delivery activation;
- delivery stage `IMPLEMENTATION`;
- an active entitlement;
- matching organization, project, project-service, entitlement, and activation relationships.

### Initialization authority

`public.initialize_implementation(...)` is service-role-only and requires a valid trusted actor UUID. It is idempotent by delivery activation/idempotency identity and is not exposed to authenticated browser clients.

The server builds a source snapshot from the delivery activation and entitlement context. No payment attempt, provider, client request, or later delivery stage can initialize implementation directly.

### Implementation lifecycle

OWNER-authorized trusted operations support:

```text
ACTIVE -> PAUSED
PAUSED -> ACTIVE
ACTIVE/PAUSED -> COMPLETED
ACTIVE/PAUSED -> CANCELLED
```

Source fields, scope snapshot, delivery/entitlement links, implementation identity, original actor, and creation metadata are immutable. Direct writes and deletes remain denied, and all lifecycle mutations are audited.

## Deployment Foundation

### `public.deployment_records`

Deployment records represent the state boundary after implementation and do not execute deployment work. Each record links organization, project, project service, implementation record, delivery activation, and entitlement.

The record preserves deployment reference, idempotency identity, immutable deployment scope/configuration snapshot, status, started/paused/completed timestamps, status reason, actor, and audit timestamps.

Deployment states are `ACTIVE`, `PAUSED`, `COMPLETED`, and `CANCELLED`.

### Initialization authority

`public.initialize_deployment(...)` is service-role-only and requires:

- an active implementation record;
- an active delivery activation at `IMPLEMENTATION`;
- an active entitlement;
- matching organization, project, project-service, implementation, activation, and entitlement relationships.

Initialization is idempotent and rejects conflicting reuse. The browser cannot initialize deployment, and no infrastructure/provider action is performed.

### Deployment lifecycle

OWNER-authorized trusted operations support `ACTIVE -> PAUSED`, `PAUSED -> ACTIVE`, `ACTIVE/PAUSED -> COMPLETED`, and `ACTIVE/PAUSED -> CANCELLED`. Source links, deployment reference, idempotency identity, configuration snapshot, actor, and creation metadata are immutable. Mutations are audited through `audit_events`.

## Observation Foundation

### `public.observation_records`

Observation is the paid implementation stage immediately downstream of an active deployment. Each observation record links organization, project, project service, entitlement, delivery activation, implementation record, and deployment record.

Observation states are `ACTIVE`, `PAUSED`, `COMPLETED`, and `CANCELLED`. The record preserves observation reference, idempotency identity, immutable observation snapshot, status reason, and started/paused/completed timestamps.

### Full upstream prerequisite chain

`public.initialize_observation(...)` is service-role-only and requires all of these records to remain valid:

```text
ACTIVE entitlement
	-> ACTIVE delivery activation
	-> ACTIVE implementation record
	-> ACTIVE deployment record
	-> observation record
```

The RPC validates same-tenant, same-project, same-project-service relationships across every source, rejects paused/completed/cancelled upstream records, rejects inactive entitlements, and enforces deployment-record idempotency/conflict rules. It does not create observation automatically, change the delivery activation stage, or bypass implementation/deployment.

OWNER-authorized lifecycle operations support `ACTIVE -> PAUSED`, `PAUSED -> ACTIVE`, `ACTIVE/PAUSED -> COMPLETED`, and `ACTIVE/PAUSED -> CANCELLED`. Source links, observation reference, idempotency identity, snapshot, actor, and creation metadata are immutable and audited.

## Authorization

The implementation reuses the existing commercial authorization boundary:

- `OWNER`: may create/cancel payment obligations through trusted functions.
- `ADMIN`: does not automatically receive OWNER-level final commercial authority.
- `MEMBER`: no payment-obligation creation authority.
- Project roles do not automatically become payment authorities.

No new role was introduced.

## RLS and Security

`public.payment_obligations` has RLS enabled with:

- authenticated organization/project-scoped reads through existing membership and project-access helpers;
- direct authenticated INSERT denied;
- direct authenticated UPDATE denied;
- direct authenticated DELETE denied.

The trusted functions use:

```text
search_path = public, private, pg_temp
```

The functions have restricted public/anonymous execution and authenticated execution grants. No browser service-role key, secret, raw payment credential, card data, or provider token was added.

## Idempotency and Concurrency

- Unique `(organization_id, idempotency_key)` constraint prevents duplicate creation.
- Existing obligations are returned for matching retries.
- Reuse of a key with different source, scope, amount, purpose, or schedule is rejected.
- Creation is protected by the database uniqueness constraint and transactional RPC execution.
- Cancellation uses row locking and an expected-state check.
- Provider event idempotency is deferred because no provider event layer exists in this phase.

## Commercial Snapshot

The server-built snapshot preserves:

- proposal ID
- proposal version ID
- agreement ID/version ID when supplied
- effective project scope
- amount and currency context
- payment purpose
- schedule type
- caller commercial snapshot
- source proposal checksum

The table also stores the schedule snapshot separately. Later catalog or proposal changes cannot rewrite the obligation snapshot.

## Audit Behavior

The existing `audit_events` mechanism remains the audit sink. The migration adds:

- `payment_obligation_id` correlation to `audit_events`;
- `payment_obligation_created` event type;
- `payment_obligation_cancelled` event type;
- `payment_obligation_expired` event type reserved for future trusted expiry processing.

`payment_obligations` remains the financial-domain source record. `audit_events` is not used as a substitute for it.

## TypeScript Data Layer

Added typed models and helpers in the existing organization data boundary:

- `PaymentObligationStatus`
- `PaymentPurpose`
- `PaymentScheduleType`
- `PaymentObligation`
- `listPaymentObligations`
- `createPaymentObligation`
- `cancelPaymentObligation`
- `getPaymentObligation`
- `expirePaymentObligation`
- `listPaymentAttempts`
- `getPaymentAttempt`
- `createPaymentAttempt`
- `transitionPaymentAttempt`
- `listProjectEntitlements`
- `getEntitlement`
- `pauseEntitlement`
- `resumeEntitlement`
- `expireEntitlement`
- `cancelEntitlement`
- `listProjectDeliveryActivations`
- `getDeliveryActivation`
- `listEntitlementDeliveryActivations`
- `pauseDeliveryActivation`
- `resumeDeliveryActivation`
- `completeDeliveryActivation`
- `cancelDeliveryActivation`
- `listProjectImplementationRecords`
- `getImplementationRecord`
- `getImplementationForDeliveryActivation`
- `pauseImplementationRecord`
- `resumeImplementationRecord`
- `completeImplementationRecord`
- `cancelImplementationRecord`
- `listProjectDeploymentRecords`
- `getDeploymentRecord`
- `pauseDeploymentRecord`
- `resumeDeploymentRecord`
- `completeDeploymentRecord`
- `cancelDeploymentRecord`
- `listProjectObservationRecords`
- `getObservationRecord`
- `pauseObservationRecord`
- `resumeObservationRecord`
- `completeObservationRecord`
- `cancelObservationRecord`
- `listProjectStabilizationRecords`
- `getStabilizationRecord`
- `pauseStabilizationRecord`
- `resumeStabilizationRecord`
- `completeStabilizationRecord`
- `cancelStabilizationRecord`
- `listProjectHandoverRecords`
- `getHandoverRecord`
- `pauseHandoverRecord`
- `resumeHandoverRecord`
- `completeHandoverRecord`
- `cancelHandoverRecord`
- `listProjectOngoingServiceRecords`

Entitlement activation intentionally has no authenticated client helper because its RPC is service-role-only and reserved for a future verified commercial event.

Delivery activation also has no client activation helper because its activation RPC is service-role-only. Lifecycle helpers are limited to trusted OWNER pause/resume/complete/cancel operations.

Minor-unit amounts are represented as strings in TypeScript to avoid unsafe JavaScript floating-point handling.

## UI Changes

The existing project commercial surface now includes a server-authoritative payment-obligation panel. It shows:

- obligation purpose and schedule type;
- stored USD minor-unit amount;
- proposal-version and optional agreement-version source context;
- current obligation state;
- an OWNER-only cancel action for pending obligations.

Each obligation also shows its read-only payment-attempt section with:

- attempt ID/reference;
- amount and currency;
- current attempt state;
- creation time;
- linked obligation context;
- failure or cancellation reason when recorded.

When no attempts exist, the panel shows an empty state. No attempt creation or lifecycle transition buttons are exposed.

The project commercial surface also shows a read-only entitlement section with entitlement ID, project-service reference, status, source payment-obligation reference, start/end dates, creation date, activation reference, and status reason when available. When no entitlements exist, it shows an empty state. No activation, pause, resume, expiry, cancellation, payment-success, or delivery controls are exposed.

It also shows a read-only delivery activation section with activation ID, project-service reference, entitlement ID, delivery status, current stage, activation/completion dates, activation reference, and status reason. Initial activations display `IMPLEMENTATION`; no activation, stage progression, deployment, observation, handover, or ongoing-service controls are exposed.

The project commercial surface also shows a read-only implementation workspace section with implementation ID, delivery activation ID, entitlement ID, project-service reference, status, implementation reference, started/completed dates, and status reason. If no record exists, it shows an initialization-empty state. No initialization, infrastructure, deployment, observation, handover, or ongoing-service controls are exposed.

It also shows a read-only deployment foundation section with deployment ID, implementation ID, delivery activation, entitlement, project-service reference, status, deployment reference, started/completed dates, and status reason. If no deployment record exists, it shows an empty state. No initialization, provider, cloud, infrastructure, CI/CD, or deployment execution controls are exposed.

The project commercial surface also shows a read-only observation section with observation ID, deployment ID, implementation ID, project-service reference, status, observation reference, started/completed dates, and status reason. If no observation record exists, it shows an empty state. No initialization, monitoring, timer, stabilization, or provider controls are exposed.

The project commercial surface also shows a read-only stabilization section with stabilization ID, observation ID, deployment ID, implementation ID, project-service reference, status, stabilization reference, started/completed dates, and status reason. If no stabilization record exists, it shows an empty state. No initialization, monitoring, remediation, documentation, handover, or ongoing-service controls are exposed.

The project commercial surface also shows a read-only handover section with handover ID, documentation ID, stabilization ID, observation ID, project-service reference, status, handover reference, started/completed dates, and status reason. If no handover record exists, it shows an empty state. No initialization, transfer, upload, download, signature, credentials, storage, or handover execution controls are exposed.

No amount-entry or obligation-creation control was added because the current UI has no approved concrete amount source. No checkout, payment-success, provider, settlement, refund, entitlement, or delivery controls were added.

Existing commercial UI behavior continues to state that proposal/agreement acceptance does not activate payment, entitlement, or delivery.

## Validation

Completed:

- `npm run typecheck`: passed.
- `npm run lint`: passed with two pre-existing warnings in `src/lib/seo/SEO.tsx`.
- `npm run build`: passed.
- `git diff --check`: passed.
- linked migration push: passed.
- `supabase migration list --linked`: local and remote synchronized through `202609150020`.
- remote table/RLS inspection: `payment_obligations` exists with RLS enabled and four expected policies.
- remote function inspection: creation, cancellation, and expiry RPCs report `SECURITY DEFINER` and fixed `search_path = public, private, pg_temp`.
- remote grant inspection: creation, cancellation, and expiry RPCs have authenticated execution and no anonymous execution grant.
- lifecycle hardening inspection: immutable-field trigger and forward-only cancellation/expiry transitions deployed.
- payment-attempt inspection: attempt table/RLS, obligation linkage, immutable-field trigger, idempotent creation, and guarded lifecycle RPC deployed.
- entitlement inspection: entitlement table/RLS, future-event-only service-role activation boundary, OWNER lifecycle RPCs, immutable-field trigger, idempotency, and audit correlation deployed.
- delivery activation inspection: delivery table/RLS, active-entitlement source enforcement, service-role-only activation, initial `IMPLEMENTATION` stage, immutable-field trigger, idempotency, OWNER lifecycle RPCs, and audit correlation deployed.
- implementation inspection: implementation table/RLS, active delivery/entitlement/stage enforcement, service-role-only initialization, immutable scope/source trigger, idempotency, OWNER lifecycle RPCs, and audit correlation deployed.
- deployment inspection: deployment table/RLS, active implementation/activation/entitlement enforcement, service-role-only initialization, immutable configuration trigger, idempotency, OWNER lifecycle RPCs, and audit correlation deployed.
- observation inspection: observation table/RLS, full active upstream-chain enforcement, service-role-only initialization, immutable snapshot trigger, idempotency, OWNER lifecycle RPCs, and audit correlation deployed.
- stabilization inspection: stabilization table/RLS, full active upstream-chain enforcement through observation, service-role-only initialization, immutable snapshot trigger, idempotency, OWNER lifecycle RPCs, and audit correlation deployed.
- documentation/handover inspection: documentation foundation restored through `202609150022`; handover table/RLS, full active upstream-chain enforcement through documentation, service-role-only initialization, immutable snapshot trigger, idempotency, OWNER lifecycle RPCs, and audit correlation deployed.
- ongoing-service inspection: optional post-handover table/RLS, completed-handover/full-chain validation, service-role-only initialization, monthly/annual-only billing attribute, immutable source trigger, idempotency, OWNER lifecycle RPCs, and audit correlation deployed.
- sitemap was restored after the build script changed generated dates; final sitemap diff is empty.
- no browser service-role secret or payment provider credential was added.

Local `supabase db lint --local` could not connect because no local Postgres container was running on `127.0.0.1:54322`. The migration was nevertheless applied successfully to the linked database and remotely inspected.

## Runtime Security Tests

No approved authenticated test identities were available in the workspace. No credentials were created or exposed.

Deferred runtime tests:

- authorized creation;
- duplicate idempotent creation;
- unauthorized creation;
- wrong-organization proposal;
- wrong-project proposal;
- wrong agreement/version;
- unaccepted proposal version;
- invalid amount/currency;
- unauthorized cancellation;
- authorized expiry after the expiry timestamp;
- premature expiry rejection;
- invalid lifecycle transition rejection;
- immutable source/snapshot update rejection;
- cross-tenant read;
- direct client write rejection.
- payment-attempt authorized/unauthorized creation;
- payment-attempt obligation mismatch;
- payment-attempt duplicate/conflicting idempotency;
- payment-attempt invalid lifecycle transition;
- payment-attempt cross-tenant read.
- entitlement authorized/unauthorized read;
- entitlement activation denied to authenticated clients;
- entitlement source mismatch and invalid date rejection;
- entitlement duplicate/conflicting idempotency;
- entitlement invalid lifecycle transition rejection;
- entitlement direct client write rejection.
- delivery activation authorized/unauthorized read;
- delivery activation denied without active entitlement;
- delivery activation denied to authenticated clients;
- delivery activation duplicate/conflicting idempotency;
- delivery activation invalid lifecycle transition rejection;
- delivery activation direct client write rejection.
- implementation initialization denied to authenticated clients;
- implementation rejected for inactive/paused/completed/cancelled delivery activation;
- implementation rejected for inactive entitlement or mismatched source relationships;
- implementation duplicate/conflicting idempotency;
- implementation invalid lifecycle transition rejection;
- implementation direct client write rejection.
- deployment initialization denied to authenticated clients;
- deployment rejected for inactive implementation;
- deployment rejected for paused/completed/cancelled activation or inactive entitlement;
- deployment source relationship mismatch rejection;
- deployment duplicate/conflicting idempotency;
- deployment invalid lifecycle transition rejection;
- deployment direct client write rejection.
- observation initialization denied to authenticated clients;
- observation rejected without active entitlement;
- observation rejected for paused/completed/cancelled upstream records;
- observation rejected for mismatched tenant/project/service relationships;
- observation duplicate/conflicting idempotency;
- observation invalid lifecycle transition rejection;
- observation direct client write rejection.
- stabilization initialization denied to authenticated clients;
- stabilization rejected without active observation;
- stabilization rejected for paused/completed/cancelled upstream records;
- stabilization rejected for mismatched tenant/project/service relationships;
- stabilization duplicate/conflicting idempotency;
- stabilization invalid lifecycle transition rejection;
- stabilization direct client write rejection.

These are deferred identity-dependent tests only. Provider-dependent tests were not introduced because no provider layer exists.

## Phase 15.15 Handover Foundation

Migration `202609150023_handover_records.sql` adds `public.handover_records` after active documentation. The trusted initialization boundary validates the complete active chain through documentation, preserves all organization/project/service/source relationships, enforces idempotency, and is service-role-only.

Handover states are `ACTIVE`, `PAUSED`, `COMPLETED`, and `CANCELLED`. OWNER lifecycle RPCs support pause, resume, complete, and cancel with immutable source/scope/reference fields, RLS, fixed-search-path SECURITY DEFINER functions, and audit correlation. The project UI exposes handover records read-only only.

Handover remains a lifecycle foundation. File transfer, uploads, storage, downloads, signatures, credentials/secrets transfer, infrastructure-account transfer, notifications, AI-generated documents, and handover execution remain deferred.

## Phase 15.17 - Full Lifecycle Integration & Security Hardening

### Objective and result

Verified the implemented lifecycle from commercial source through optional ongoing service without adding automatic orchestration or new business behavior. The actual repository and linked Supabase project are synchronized through `202609150024`.

### Integrity verification

- Commercial/payment boundaries remain separate from entitlement and delivery activation.
- Downstream initializers enforce active upstream state and same organization/project/project-service relationships.
- Handover requires active documentation and ongoing service requires a `COMPLETED` handover.
- Idempotency and conflicting-reuse rejection are present across trusted initialization functions.
- Immutable-field triggers protect downstream source links and snapshots.
- No payment attempt, obligation, entitlement, delivery activation, or lifecycle record is automatically created by a later stage.
- All lifecycle tables remain tenant/project scoped and currently contain zero business records.

### Security verification

Remote inspection confirmed RLS enabled on payment and lifecycle tables, deny-write policies for protected records, service-role-only initialization grants, authenticated OWNER lifecycle grants, no anonymous initialization execution, `SECURITY DEFINER` functions, and fixed `search_path = public, private, pg_temp`.

Audit vocabulary and correlation columns cover entitlement, delivery activation, implementation, deployment, observation, stabilization, documentation, handover, and ongoing-service lifecycle mutations. No duplicate audit system was introduced.

### Application verification

The typed models/data helpers and project detail UI cover the current lifecycle as read-only server state: payment obligation, payment attempt, entitlement, delivery activation, implementation, deployment, observation, stabilization, documentation/handover, and optional ongoing service. No browser initialization, payment, subscription, provider, or automatic progression controls were added.

### Runtime verification

Authenticated OWNER/MEMBER/anonymous runtime A/B tests remain deferred because no approved test identities are available and no credentials were created. Static remote security metadata, RLS policy coverage, migration synchronization, zero-row counts, TypeScript diagnostics, and build validation were completed.

### Migration result

**No new migration required - existing schema already satisfied the Phase 15.17 integrity requirements.**

## Explicitly Deferred

- payment providers and checkout;
- provider webhooks/events;
- payment settlement and transactions;
- reconciliation;
- refunds, credits, chargebacks, and disputes;
- tax and accounting calculation;
- recurring billing execution/subscriptions;
- entitlement issuance and enforcement;
- delivery activation;
- implementation, observation, stabilization, documentation, and handover automation;
- e-signature/legal provider;
- trial behavior;
- entitlement activation from payment attempts or unverified client state;
- provider settlement/webhook integration;
- delivery activation from payment attempts or browser state;
- deployment automation, observation automation, handover automation, and ongoing-service activation;
- implementation initialization from arbitrary browser requests;
- infrastructure provisioning, CI/CD deployment, AI execution, monitoring automation, observation timers, stabilization automation, documentation automation, and handover automation;
- deployment initialization from arbitrary browser requests;
- actual deployment execution, cloud/infrastructure provisioning, provider actions, CI/CD execution, observation automation, stabilization automation, documentation automation, handover automation, and ongoing-service automation;
- observation initialization from arbitrary browser requests;
- monitoring-provider integration, observation timers, automatic stabilization, documentation, handover, and ongoing-service automation;
- stabilization initialization from arbitrary browser requests;
- monitoring/remediation automation, metrics/log ingestion, alerting, documentation, handover, and ongoing-service automation;
- handover initialization from arbitrary browser requests;
- document generation, templates, uploads, storage, downloads, signatures, transfers, credentials, secrets, infrastructure-account transfer, and handover execution;
- new roles, pillars, services, prices, percentages, or legal promises.
