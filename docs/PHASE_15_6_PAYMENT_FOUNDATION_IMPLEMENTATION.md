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

## Phase 15.18E — Stripe Live Test Readiness and Fail-Closed Configuration

### Required secret names

The payment implementation currently expects the following server-bound names:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

These names are the current trusted runtime contract. No `VITE_STRIPE_SECRET_KEY` or `VITE_STRIPE_WEBHOOK_SECRET` values are used anywhere in the client or build path. No secret names were renamed to avoid a concrete inconsistency; the implementation remains aligned with the existing deployed server configuration.

### Secret handling and boundary

- `src/lib/payments/stripeProviderAdapter.ts` reads `STRIPE_SECRET_KEY` only through a server-side environment guard that explicitly refuses browser execution via `typeof window !== 'undefined'`.
- `supabase/functions/stripe-webhook/index.ts` reads `STRIPE_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` from the trusted Edge Function environment only.
- Missing Stripe secrets fail closed. Checkout creation returns a provider-not-configured error and never fabricates a checkout URL. Webhook processing returns an explicit failing response before any settlement logic runs.
- No secret literals are embedded in source or documentation. No secret values were printed into chat, logs, or generated output.
- The browser bundle never receives these values. The Supabase client boundary remains browser-safe and uses the public anon-facing variables only.

### Checkout metadata correlation

The checkout session creation path already includes stable internal correlation identifiers in metadata and the provider reference record:

- `payment_obligation_id`
- `payment_attempt_id`
- `organization_id`
- `project_id`
- `idempotency_key`
- `provider`
- `client_reference_id` set to `payment_attempt_id`

The webhook reconciliation path validates that the verified Stripe event contains the internal IDs and matches the stored obligation/attempt records. This uses internal IDs as the correlation source and does not rely on email, project name, organization name, amount, or timestamp as the primary key.

### Webhook verification and fail-closed behavior

`supabase/functions/stripe-webhook/index.ts` preserves the raw request body and requires the `Stripe-Signature` header before processing. The function:

- rejects non-POST requests;
- rejects missing `Stripe-Signature` headers;
- rejects missing `STRIPE_WEBHOOK_SECRET` or `STRIPE_SECRET_KEY` before signature verification;
- verifies the payload via `stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)`;
- ignores unsupported event types after verification;
- rejects verified events without the internal correlation metadata required for settlement reconciliation;
- performs settlement only through the trusted `create_payment_settlement(...)` RPC after obligation/attempt validation and amount/currency checks.

There is no unsigned alternative webhook path. Browser redirects and client callbacks cannot trigger settlement directly.

### READY FOR REAL TEST

This implementation is ready for real Stripe test-mode configuration when the trusted environment contains the required server secrets and the runtime remains operational.

The required configuration contract is limited to:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The implementation works with Stripe test-mode credentials, provided they are installed in the trusted server/runtime environment and the Edge Function can start successfully. It does not require production credentials.

### ACTUALLY LIVE VERIFIED

No live Stripe event has been processed in this session. The work remains at readiness verification only because the trusted environment does not currently carry the Stripe secrets, and the remote Edge Function runtime remains subject to the existing `WORKER_RESOURCE_LIMIT` condition.

No fake provider data, fake signatures, fake settlements, fake checkout sessions, or manual payment success markers were created.

### WORKER_RESOURCE_LIMIT investigation

The `WORKER_RESOURCE_LIMIT` condition was checked with safe available diagnostics only:

- the function is configured as `stripe-webhook` and is `ACTIVE`;
- the payment implementation uses a minimal server-only provider boundary and does not import the browser app into the Edge Function;
- the Stripe SDK is lazy-loaded only inside the server-side runtime path;
- the webhook uses a narrow runtime surface and the verified event pipeline is separate from the browser app;
- the function dependency graph remains intentionally small and does not add a broad app bundle into the worker;
- the runtime issue remains external to the app’s security design, and the implementation therefore does not remove verification or weaken the boundary.

The current evidence indicates the issue is a runtime capacity or worker limit on the Supabase-side deployment rather than a result of the fail-closed Stripe verification logic itself. No insecure bypass of signature verification or no-secret handling was introduced.

### Runtime status and real test status

- Edge Function runtime: deployed and `ACTIVE`.
- Stripe secrets: absent in the current trusted environment.
- Webhook verification: implemented and fail-closed.
- Real Stripe test mode: not performed because the required real credentials are absent and the runtime is still blocked by the worker limit.
- Real settlement verification: not performed because no real Stripe event reached the function.
- Entitlement activation: intentionally not connected in this phase.

### Deferred blockers

The exact blockers remaining are:

1. `STRIPE_SECRET_KEY` is not configured in the trusted environment.
2. `STRIPE_WEBHOOK_SECRET` is not configured in the trusted environment.
3. The remote Edge Function runtime remains subject to `WORKER_RESOURCE_LIMIT`.
4. No real Stripe test-mode Checkout/webhook lifecycle was executed.

These blockers remain outside the payment implementation itself and are not bypassed by weakening the security boundary.

### Entitlement boundary

Settlement remains separate from entitlement activation and delivery activation. The lifecycle remains:

Settlement
↓
separate trusted entitlement activation
↓
delivery activation
↓
implementation
↓
deployment
↓
observation
↓
stabilization
↓
documentation
↓
handover
↓
optional ongoing service

No automatic entitlement or delivery activation is triggered by a verified settlement in this phase.

## Phase 15.18F — Controlled Stripe Test-Mode Verification + Runtime Blocker Handling

### Verification scope

This phase verified the actual repository and remote state without inventing a Stripe test or bypassing the fail-closed runtime boundary. The evidence used was the current code in `src/lib/payments/`, the deployed Edge Function in Supabase, the live migration ledger, and the existing trusted secret inventory available from the linked project.

### Trusted secret configuration status

The trusted runtime currently reports these configuration states without exposing values:

- `STRIPE_SECRET_KEY`: ABSENT / NOT CONFIGURED
- `STRIPE_WEBHOOK_SECRET`: ABSENT / NOT CONFIGURED
- `SUPABASE_URL`: PRESENT
- `SUPABASE_SERVICE_ROLE_KEY`: PRESENT
- `VITE_STRIPE_SECRET_KEY`: NOT PRESENT
- `VITE_STRIPE_WEBHOOK_SECRET`: NOT PRESENT

No secret values were printed, logged, committed, or added to source or documentation. The code path remains server-only, and no browser-side Stripe secret handling is present.

### Real Stripe test-mode execution status

A real Stripe test-mode Checkout → webhook → settlement verification was not executed because the required trusted Stripe secrets were not configured in the runtime and the Edge Function remains constrained by the current `WORKER_RESOURCE_LIMIT` condition. This is a deliberate blocker, not a fallback or synthetic success path.

### Checkout metadata verification

The current checkout creation path contains the required internal correlation metadata in the Stripe Checkout Session payload:

- `payment_obligation_id`
- `payment_attempt_id`
- `organization_id`
- `project_id`
- `idempotency_key`
- `provider`
- `client_reference_id` set to the attempt ID

The webhook reconciliation path enforces the same internal IDs and therefore remains bound to the trusted obligation/attempt records instead of relying on user-supplied identity data.

### Webhook verification status

The implementation remains in a correct fail-closed state:

- raw request body is preserved;
- `Stripe-Signature` is required;
- missing signatures are rejected;
- invalid signatures are rejected;
- missing webhook secret rejects the request;
- unsupported event types are ignored safely after verification;
- settlement is only attempted after the verified event matches the internal obligation and attempt state;
- browser redirects or client data do not create settlements.

This is still a verified configuration boundary and not a live runtime success claim.

### Negative security tests

The following security checks are possible only when the trusted runtime is operational. They remain deferred or blocked rather than simulated:

- missing `Stripe-Signature` → BLOCKED by absent runtime + missing Stripe secret configuration
- invalid `Stripe-Signature` → NOT EXECUTED against a real webhook in this environment
- malformed event → NOT EXECUTED
- unsupported event type → SAFELY HANDLED in code path, but not exercised against a real runtime webhook
- wrong amount/currency → code path exists but not executed with a real Stripe test event
- unknown payment attempt / mismatched obligation → code path exists but not executed against a live provider event
- duplicate provider event / duplicate settlement → code path exists and is enforced in the trusted RPC, but not exercised with a real event in this environment

No insecure workaround was introduced to bypass signature verification or simulate a successful webhook path.

### WORKER_RESOURCE_LIMIT status

The current Supabase Edge Function runtime remains subject to `WORKER_RESOURCE_LIMIT` while the Stripe secrets are absent. The evidence available is limited to safe diagnostics only:

- the `stripe-webhook` function is deployed and `ACTIVE`;
- the runtime is not currently able to process a real Stripe webhook in this environment;
- the handler is minimal and does not import browser-only code or expose secrets;
- the security verification logic remains in place and unweakened.

This is a runtime capacity/deployment blocker rather than an application-level security bypass. The function remains protected by signature verification, not by custom/insecure verification logic.

### Settlement verification status

Settlement verification remains `NOT EXECUTED` because no real Stripe checkout session or `checkout.session.completed` event reached the trusted server in this environment. The database side remains guarded by the trusted RPC and the migration constraints, but no real settlement row was created in this phase.

### Entitlement boundary confirmation

The current boundary remains unchanged:

Stripe settlement
→ separate trusted entitlement activation
→ separate delivery activation

No automatic entitlement activation, delivery initialization, or downstream lifecycle progression was added or triggered in this phase.

### Validation commands and results

The following validation steps were executed and passed where applicable:

- `npm run typecheck -- --pretty false` → PASS
- `npm run lint` → PASS with 2 existing SEO warnings and 0 errors
- `npm run build` → PASS
- `git diff --check` → PASS
- `supabase migration list --linked` → PASS; migrations synchronized through `202609150025`
- `supabase functions list --output json` → PASS; `stripe-webhook` list entry shows status `ACTIVE`

The working tree was checked after validation and only the intended documentation update remained.

### Remaining blockers

1. `STRIPE_SECRET_KEY` is absent from the trusted runtime.
2. `STRIPE_WEBHOOK_SECRET` is absent from the trusted runtime.
3. The Supabase Edge Function runtime remains blocked by `WORKER_RESOURCE_LIMIT`.
4. No real Stripe test-mode payment flow was executed in the linked environment.

### Verdict for this phase

`PASS WITH DEFERRED RUNTIME TESTS`

The implementation is correct and fail-closed, but a real Stripe test-mode webhook and settlement verification remains deferred because the trusted runtime does not currently provide the required Stripe credentials and the function runtime is still constrained.

## Phase 15.18G — Final Deployment Verification and Closure

### Local migration status

The intended next migration is present at `supabase/migrations/202610030001_settlement_entitlement_activation.sql`. The local migration order is:

- `202609150025_payment_settlements.sql`
- `202610030001_settlement_entitlement_activation.sql`

No duplicate migration version or ordering conflict was found. The migration was kept as the intended next migration; no additional migration was created.

The local review covered the existing entitlement schema and activation RPC, settlement schema and settlement RPC, audit event vocabulary, TypeScript entitlement model, and data mapping.

### Settlement to entitlement bridge

A new server-only transition was added to link a verified payment settlement to a single entitlement activation:

- `supabase/migrations/202610030001_settlement_entitlement_activation.sql`
- `public.activate_entitlement_from_settlement(...)`

This transition is intentionally limited to the first lifecycle boundary:

Verified settlement → active entitlement

The bridge requires a trusted service-role actor, a verified settlement, a pending obligation, a matching payment attempt, the same organization and project, matching proposal/version and agreement/version source fields, matching amount and currency, and a project service included in the accepted current proposal scope. It does not initialize delivery activation or downstream operational records.

### Source relationship validation

The trusted activation path validates all core source relationships before creating entitlement state:

- payment settlement exists;
- payment attempt exists and matches the settlement;
- payment obligation matches the settlement source fields, amount, currency, organization, and project;
- project service belongs to the same organization/project as the obligation;
- proposal and accepted current proposal version match the obligation source;
- project service is included in the proposal scope;
- agreement and active accepted agreement version match when the obligation has an agreement source;
- date window is valid;
- no conflicting settlement-to-entitlement mapping already exists.

The new `payment_settlement_id` source link is protected by a database trigger against mutation after entitlement creation.

The path intentionally rejects mismatches instead of creating partial entitlement state.

### Idempotency strategy

The activation function uses both:

- a unique `payment_settlement_id` -> entitlement mapping; and
- a stable idempotency key (`idempotency_key`)

This prevents duplicate active entitlements on retry, duplicate webhook replay, or repeated trusted activation attempts. Repeated activation of the same settlement returns the existing entitlement instead of creating a second record. The unique settlement link, organization/idempotency constraint, row locks, and conflict checks protect concurrent and conflicting activation attempts at the database/RPC boundary.

### Trust boundary and security

The new transition is not exposed to normal browser clients:

- `security definer` is used;
- `search_path` is fixed;
- execution is restricted to `service_role` only;
- anonymous and authenticated execution is revoked;
- direct browser writes remain blocked by the existing RLS/privilege model;
- RLS remains enabled with authenticated read-only access inside the existing organization/project boundary;
- anonymous and authenticated direct insert, update, and delete paths remain denied;
- source and grant fields remain immutable, including `payment_settlement_id`;
- no client-side secret or payment success flag is trusted.

The activation path only consumes the trusted persisted payment settlement and internal commercial relationships.

### Audit behavior

The transition writes an `entitlement_activated` audit event and includes settlement correlation metadata in the audit payload:

- organization
- project
- entitlement
- payment obligation
- payment settlement
- project service
- activation reference

No secrets are written to audit metadata.

### Delivery boundary

This phase does not initialize delivery activation, implementation, deployment, observation, stabilization, documentation, handover, or ongoing service. The boundary remains:

Settlement = verified
Entitlement = ACTIVE
Delivery activation = not automatically created

### Migration and status

Migration file created:

- `supabase/migrations/202610030001_settlement_entitlement_activation.sql`

This migration adds a `payment_settlement_id` link to `public.entitlements` and creates the trusted `activate_entitlement_from_settlement(...)` function. This is the minimum required schema/API bridge for the verified settlement → entitlement transition.

Remote migration status is **UNVERIFIED**. The link is correctly configured for project `icoyljzozkwdeegodnly` (`Blockwavelab`), and authenticated `supabase projects list` access succeeds. The project currently reports `status: INACTIVE`; consequently, both `supabase migration list --linked` and `supabase db push --linked` fail during login-role initialization with `LegacyDbConfigLoginRoleStatusError` and a connection timeout. The migration was not deployed through a bypass, and remote application of `202610030001` is not claimed. The deployed function inventory independently reports `stripe-webhook` as `ACTIVE`, but that does not prove the database migration is applied.

### Runtime tests

The following runtime tests remain deferred because the trusted Stripe runtime is not available in this environment:

- genuine Stripe Checkout session creation
- real Stripe `checkout.session.completed` webhook delivery
- real Stripe signature verification
- real settlement creation from a provider event
- real settlement → entitlement activation over an actual provider event

The implementation was validated structurally and safely, not with fabricated provider events or synthetic success records.

### Validation results

### Audit and delivery boundary

Activation records an `entitlement_activated` audit event with internal settlement correlation only. Audit metadata contains no Stripe secret, webhook secret, service-role key, or credential material.

The resulting lifecycle boundary is:

Verified settlement
→ active entitlement
→ stop

No settlement path calls or creates delivery activation, implementation, deployment, observation, stabilization, documentation, handover, or ongoing service. Delivery activation remains Phase 15.18H and is intentionally not started here.

### Validation results

The code and project validation commands were executed as follows:

- `npm run typecheck -- --pretty false` → PASS
- `npm run lint` → PASS with two pre-existing SEO warnings, zero errors
- `npm run build` → PASS
- `git diff --check` → PASS
- `supabase migration list --linked` → BLOCKED because the correctly linked remote project reports `INACTIVE`, causing Supabase CLI login-role initialization to time out; remote migration status remains unverified
- `supabase functions list --output json` → PASS; `stripe-webhook` is `ACTIVE` with `verify_jwt: false`, relying on Stripe signature verification
- `supabase db lint --local` → BLOCKED because local Postgres is not running on `127.0.0.1:54322`
- no authenticated identity was available for identity-based runtime tests

### Deferred tests and exact blockers

- genuine Stripe Checkout and webhook execution;
- real settlement creation from a provider event;
- live settlement-to-entitlement activation;
- replay and concurrent activation runtime tests;
- authenticated browser authorization tests;
- remote schema verification and migration deployment.

The exact blockers are:

1. The correctly linked Supabase project `icoyljzozkwdeegodnly` currently reports `INACTIVE`; its login-role initialization fails with `LegacyDbConfigLoginRoleStatusError` and connection timeout, preventing migration ledger verification and normal deployment.
2. `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are absent from the trusted runtime.
3. The remote Edge Function runtime remains subject to the existing `WORKER_RESOURCE_LIMIT` condition.
4. Local Supabase database lint requires a running local Postgres container, which is unavailable.

### Final verdict for this phase

`PASS WITH DEFERRED RUNTIME TESTS`

The local settlement → entitlement implementation is hardened and structurally reviewed, but remote migration deployment cannot be confirmed because the Supabase CLI login-role timeout blocks the required ledger check. This verdict does not claim that `202610030001` is deployed remotely. Phase 15.18H is not started.

## Phase 15.18H — Entitlement to Delivery Activation

### Implementation status

The existing `public.delivery_activations` table and `public.activate_delivery(...)` boundary were inspected and reused. The original foundation already provided the approved delivery vocabulary, service-role-only execution, RLS, immutable source fields, idempotency constraints, OWNER lifecycle controls, and audit integration.

The existing initialization function did not fully validate the settlement-aware entitlement source graph, project-service commercial state, active catalog source records, or deterministic conflicts for an existing entitlement activation. A minimal append-only corrective migration was therefore added:

- `supabase/migrations/202610030002_delivery_activation_integrity.sql`

The migration replaces only `public.activate_delivery(...)`. It does not create a duplicate delivery table, alter approved statuses or stages, change the four pillars, or modify the settlement-to-entitlement implementation.

### Trusted validation boundary

Before creating an activation, the trusted service-role function now validates:

- the actor is the service role and maps to a valid user;
- the entitlement exists, is `ACTIVE`, is `VERIFIED_COMMERCIAL_EVENT`, and is not expired;
- entitlement organization, project, project service, payment obligation, proposal, proposal version, and agreement relationships remain consistent;
- the project exists in the entitlement organization and is not archived;
- the project service belongs to the project and is in `REQUESTED`, `APPROVED`, `PAYMENT_PENDING`, or `ACTIVE` state;
- the offering, catalog service, and catalog pillar are active and the offering is within its effective window;
- the proposal is the accepted current version and includes the project service;
- an agreement source, when present, is the accepted active version;
- a linked payment settlement, when present, exists and matches the entitlement, obligation, attempt, organization, project, proposal, agreement, amount, and currency.

The entitlement row and existing activation rows are locked during validation. Existing activations for the entitlement return deterministically only when identity and source relationships match; conflicting reference or idempotency values fail safely. Database uniqueness constraints remain the final duplicate protection.

### Security, audit, and UI

The corrective function remains `SECURITY DEFINER` with a fixed `search_path`. Execution is revoked from `public`, `anon`, and `authenticated`, and granted only to `service_role`. Existing delivery activation RLS remains enabled: authenticated clients may read within their tenant/project boundary, while direct insert, update, and delete remain denied. Existing immutable source-field triggers remain in place. The client UI remains read-only and exposes no browser delivery activation control.

Activation preserves the existing `ACTIVE` state and `IMPLEMENTATION` initial stage. It records `delivery_activation_activated` through the existing audit mechanism and stores only internal lifecycle context, never provider credentials or secrets.

### Downstream boundary

Initializing delivery activation does not initialize implementation, deployment, observation, stabilization, documentation, handover, or ongoing service. Those remain separate lifecycle boundaries. Phase 15.18I is not started.

### Remote status and deferred verification

The corrective migration is locally present and structurally verified. Remote deployment and schema verification remain deferred because the linked Supabase project `icoyljzozkwdeegodnly` currently reports `INACTIVE`; `supabase migration list --linked` cannot initialize the login role and times out. No remote application of `202610030002` is claimed. Stripe runtime testing and authenticated/database runtime identity tests remain deferred.

### Validation

- delivery activation migration static boundary checks → PASS
- `npm run typecheck -- --pretty false` → PASS
- `npm run lint` → PASS with two existing warnings and zero errors
- `npm run build` → PASS
- `git diff --check` → PASS
- `supabase functions list --output json` → PASS; `stripe-webhook` remains `ACTIVE`
- remote migration list/deployment → BLOCKED by inactive Supabase project

### Final verdict for this phase

`BLOCKED`

The trusted Entitlement → Delivery Activation implementation is locally hardened and validated, but remote migration deployment and database verification cannot be completed while the Supabase project is inactive.

## Phase 15.18I — Commercial to Delivery End-to-End Integrity

### Findings

The inspected commercial chain is implemented through the approved boundaries:

Catalog/project service selection → proposal/version/items → agreement/version/acceptance where required → payment obligation → payment attempt → verified settlement → settlement-backed entitlement → delivery activation.

Existing protections verified locally include immutable issued proposal/agreement history, accepted-current-version checks for payment obligations, payment-attempt amount/currency matching, settlement amount/currency/provider-event and payment-attempt uniqueness, failed/cancelled/expired attempt rejection, settlement-backed entitlement validation, active-entitlement delivery admission, tenant relationship checks, RLS, trusted RPC grants, and correlated audit events.

### Concrete defects and corrective migrations

Two concrete gaps were found and corrected with append-only migrations:

1. `202610030002_delivery_activation_integrity.sql` hardens the existing `activate_delivery(...)` function with full entitlement, obligation, proposal, agreement, settlement, project, project-service, and active catalog validation, row locking, and deterministic duplicate/conflict handling.
2. `202610030003_commercial_boundary_integrity.sql` hardens agreement acceptance so terminated/expired agreements and invalid idempotency reuse cannot be accepted, and revokes service-role execution from the legacy direct `activate_entitlement(...)` RPC. Settlement-backed entitlement creation must use `activate_entitlement_from_settlement(...)`.

No duplicate tables, providers, stages, statuses, services, pricing, or lifecycle boundaries were introduced. No already-applied migration was edited.

### State safety and tenant isolation

The verified local path rejects failed, cancelled, or expired payment attempts; cancelled or expired obligations; missing or mismatched settlement records; invalid commercial source versions; inactive or expired entitlements; archived or cross-tenant projects; ineligible project-service states; and inactive catalog sources. Provider event and payment-attempt uniqueness, settlement linkage, entitlement linkage, delivery uniqueness, row locks, and conflict checks protect retries and concurrency.

Organization, project, project-service, proposal/version, agreement/version, obligation, attempt, settlement, entitlement, and delivery activation relationships are checked at each trusted transition. No refund or dispute logic was added.

### Security and audit

Browser clients remain unable to directly mutate commercial or lifecycle records. Trusted transitions use fixed `search_path` and appropriate `SECURITY DEFINER` boundaries; anonymous execution is denied, authenticated direct writes remain blocked by RLS, and OWNER controls remain limited to lifecycle status operations. Proposal/agreement/payment/attempt/entitlement/delivery source fields remain immutable through existing triggers and the corrective boundaries.

Settlement, entitlement activation, agreement acceptance, and delivery activation retain existing audit correlation. Audit metadata contains internal identifiers and state context only; no Stripe secrets, signatures, service-role keys, or sensitive provider payloads are recorded.

### Strict downstream boundary

Verification ends at:

Verified settlement → entitlement → delivery activation

Neither corrective migration initializes implementation, deployment, observation, stabilization, documentation, handover, or ongoing service. Phase 15.18J is not started.

### Remote and runtime status

The local chain and corrective migrations are structurally verified. The linked Supabase project `icoyljzozkwdeegodnly` still reports `INACTIVE`; remote migration ledger and schema verification are therefore unavailable. No remote migration synchronization is claimed. Stripe runtime testing remains deferred because trusted Stripe credentials and operational runtime capacity are unavailable.

### Validation

- commercial boundary migration static checks → PASS
- delivery activation migration static checks → PASS
- `npm run typecheck -- --pretty false` → PASS
- `npm run lint` → PASS with two existing warnings and zero errors
- `npm run build` → PASS
- `git diff --check` → PASS
- `supabase functions list --output json` → PASS; `stripe-webhook` remains `ACTIVE`
- remote migration/schema verification → BLOCKED by inactive Supabase project

### Final verdict for this phase

`BLOCKED`

The commercial chain is locally hardened through delivery activation, but remote migration deployment and database verification remain blocked by the inactive Supabase project. Phase 15.18J is not started.

## Phase 15.18J — Payment Failure, Expiry, and Cancellation Hardening

### Negative-path findings

The existing payment boundaries already reject failed, cancelled, and expired attempts during settlement creation; reject cancelled and expired obligations because settlement requires `PENDING`; enforce immutable amount/currency/source fields; and protect provider-event and payment-attempt uniqueness. The webhook remains restricted to verified `checkout.session.completed` events and settlement creation remains service-role-only.

A concrete state-integrity gap was found: after a settlement existed, the existing obligation and attempt lifecycle functions could still transition the upstream rows to `CANCELLED`, `EXPIRED`, or `FAILED`. That could invalidate the source state after settlement and weaken downstream negative-state guarantees.

### Corrective migration

Added the minimal append-only migration:

- `supabase/migrations/202610030004_payment_failure_expiry_hardening.sql`

It preserves all approved states and transitions while extending the existing immutable mutation triggers so a payment obligation or payment attempt with a verified settlement cannot change lifecycle state. No automatic expiry job, refund, dispute, chargeback, provider, table, or lifecycle stage was introduced.

### State and downstream safety

- `FAILED`, `CANCELLED`, and `EXPIRED` attempts cannot create settlements.
- `CANCELLED` and `EXPIRED` obligations cannot create settlements or settlement-backed entitlements.
- A verified settlement cannot be invalidated later by changing its attempt or obligation state.
- Duplicate provider events and payment attempts remain protected by database uniqueness constraints and trusted RPC checks.
- Settlement-backed entitlement activation remains service-role-only; the legacy direct entitlement path remains revoked by `202610030003`.
- Delivery activation still requires an active verified entitlement and validates the commercial/payment source chain through `202610030002`.
- No implementation, deployment, observation, stabilization, documentation, handover, or ongoing-service initialization occurs.

### Security and audit

RLS, tenant isolation, fixed `search_path`, `SECURITY DEFINER` boundaries, service-role-only settlement/entitlement/delivery paths, revoked anonymous execution, authenticated direct-write denial, immutable source fields, and existing audit correlation remain intact. Failure, cancellation, and expiry transitions continue using the existing payment audit events. No credentials, signatures, or sensitive provider payloads are logged.

### Stripe and remote status

No Stripe credentials or events were requested or fabricated. Live Stripe runtime tests remain deferred. The linked Supabase project `icoyljzozkwdeegodnly` remains `INACTIVE`; remote migration listing, deployment, and database runtime verification remain blocked. No remote synchronization is claimed.

### Validation

- payment failure hardening migration static checks → PASS
- `npm run typecheck -- --pretty false` → PASS
- `npm run lint` → PASS with two existing warnings and zero errors
- `npm run build` → PASS
- `git diff --check` → PASS
- `supabase functions list --output json` → PASS; `stripe-webhook` remains `ACTIVE`
- remote migration/schema/runtime tests → BLOCKED by inactive Supabase project

### Final verdict for this phase

`BLOCKED`

Negative payment paths are locally hardened, but remote migration deployment and database runtime verification remain blocked by the inactive Supabase project. Phase 15.18K is not started.

## Phase 15.18K — Final Security and Tenant Isolation Hardening

### Security findings

The implemented commercial/payment/delivery boundary was reviewed across proposals, proposal versions/items, agreements, agreement versions/acceptances, payment obligations, payment attempts, settlements, entitlements, delivery activations, and audit events. No additional concrete defect requiring a migration was found after the protections in `202610030001` through `202610030004`.

### Tenant isolation and roles

Trusted transitions validate organization, project, project service, proposal/version, agreement/version, obligation, attempt, settlement, entitlement, and delivery relationships. Existing catalog/project access checks and commercial-owner checks preserve the approved `OWNER`, `ADMIN`, `MEMBER`, and project-role model. No role definitions were changed.

Protected tables keep RLS enabled. Authenticated clients have scoped read access where approved and direct insert/update/delete denied. Audit events are not client-readable or client-writable. Anonymous execution is denied for protected RPCs, and service-role-only transitions remain limited to verified settlement creation, settlement-backed entitlement activation, and delivery activation. OWNER lifecycle operations remain guarded by `private.commercial_owner(...)`.

### Immutability and lifecycle bypass protection

Existing immutable triggers protect issued proposal/agreement history, payment obligation source fields, payment attempt source fields, settlement records, entitlement source/grant fields including settlement linkage, and delivery activation source/grant fields. `202610030004` additionally prevents settled obligations and attempts from later changing lifecycle state. `202610030003` keeps the legacy direct entitlement activation RPC unavailable to `service_role`; settlement-backed activation remains the trusted path.

The approved sequence remains:

Verified settlement → entitlement → delivery activation → existing downstream lifecycle

No direct browser path, failed/cancelled/expired payment path, or delivery activation path bypasses that sequence. Delivery activation does not initialize any later lifecycle stage.

### Idempotency, concurrency, and audit security

Provider-event, payment-attempt, obligation, agreement-acceptance, entitlement-settlement, entitlement-idempotency, and delivery-activation uniqueness constraints remain in place. Trusted functions use row locks and deterministic conflict handling where required. Audit records remain tenant/project correlated, client writes are denied, and metadata contains internal references only; Stripe secrets, webhook signatures, credentials, and sensitive provider payloads are excluded.

### Stripe boundary and remote status

The webhook preserves raw-body signature verification, fails closed when secrets/configuration are missing, accepts only `checkout.session.completed`, and keeps Stripe secrets server-only. No live Stripe test or credential configuration was attempted.

The linked Supabase project `icoyljzozkwdeegodnly` remains `INACTIVE`. Remote migration, RLS, grant, function-definition, and runtime verification are deferred; no remote synchronization is claimed. No corrective migration was created in Phase 15.18K.

### Validation

- local security/static inspection → PASS
- `npm run typecheck -- --pretty false` → PASS
- `npm run lint` → PASS with two existing warnings and zero errors
- `npm run build` → PASS
- `git diff --check` → PASS
- `supabase functions list --output json` → PASS; `stripe-webhook` remains `ACTIVE`
- remote database/security verification → BLOCKED by inactive Supabase project

### Final verdict for this phase

`BLOCKED`

Local security and tenant-isolation hardening is complete with no new migration required. Remote verification remains unavailable while the linked Supabase project is inactive. Phase 15.18L is not started.

## Phase 15.18L — Final Production-Readiness Closure

### Final local status

The commercial/payment/delivery implementation is locally complete and internally consistent through the approved sequence:

Catalog → service selection → proposal → proposal acceptance → agreement when required → payment obligation → payment attempt → Stripe Checkout → verified webhook → settlement → entitlement → delivery activation → existing downstream delivery lifecycle.

The final inspection confirmed:

- migrations `202610030001` through `202610030004` are present and correctly ordered;
- settlement creation is service-role-only, amount/currency/source constrained, and uniquely protected by provider event and payment attempt;
- the webhook preserves raw-body signature verification, fails closed on missing secrets, and accepts only `checkout.session.completed`;
- settlement-backed entitlement activation is the trusted path and the legacy direct entitlement grant remains revoked;
- delivery activation requires a valid active verified entitlement and consistent upstream commercial/payment relationships;
- failed, cancelled, or expired payment states cannot progress and settled obligations/attempts cannot later be invalidated;
- RLS, fixed `search_path`, `SECURITY DEFINER`, grants, immutable triggers, OWNER controls, idempotency, row locking, and tenant isolation remain intact;
- no fake payment success path, automatic lifecycle progression, browser activation shortcut, or downstream auto-initialization exists.

No new migration or schema/code correction was required in Phase 15.18L. No service categories, pricing, billing modes, providers, lifecycle stages, refund/dispute systems, background jobs, or approved business decisions were added or changed.

### Remote and runtime status

The linked Supabase project `icoyljzozkwdeegodnly` remains `INACTIVE`. Per scope, remote migration, grant/RLS/function-definition, and runtime identity verification were stopped after the single status check. No remote migrations are claimed as applied. The deployed `stripe-webhook` function is independently reported `ACTIVE`.

Live Stripe checkout/webhook execution, real settlement replay, authenticated database identity tests, and remote migration verification remain deferred solely because the Supabase project is inactive and trusted provider/runtime execution is unavailable. No credentials or fabricated events were used.

### Final validation

- complete production-closure static checks → PASS
- migration order check → PASS for `202610030001` through `202610030004`
- `npm run typecheck -- --pretty false` → PASS
- `npm run lint` → PASS with two existing warnings and zero errors
- `npm run build` → PASS
- `git diff --check` → PASS
- `supabase functions list --output json` → PASS; `stripe-webhook` is `ACTIVE`
- `git status --short --untracked-files=all` → inspected; generated sitemap noise restored

### Final verdict for this phase

`BLOCKED`

The implementation and local security/readiness checks pass. Required remote verification remains blocked by the inactive Supabase project. No phase after 15.18L was started.

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
