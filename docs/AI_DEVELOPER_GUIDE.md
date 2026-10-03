# BlockWaveLab AI Developer Guide

## Purpose

This guide is the repository-specific operating contract for AI coding assistants working inside BlockWaveLab. It explains how to understand, inspect, modify, validate, review, and document changes safely.

This is not a generic Copilot tutorial, a business plan, an architecture replacement, or a code walkthrough. The current Software Requirements Specification is in `docs/BLOCKWAVELAB_SRS.md`; the documentation operating hierarchy is in `docs/DOCUMENTATION_ARCHITECTURE.md`.

## Four-Layer Reasoning Model

AI work must move through this hierarchy:

```text
BUSINESS
  -> ARCHITECTURE
    -> CODE
      -> DATABASE / RUNTIME / INFRASTRUCTURE
```

1. **Business** defines what BlockWaveLab is allowed to be.
2. **Architecture** defines how the approved system is structured.
3. **Code** implements that architecture.
4. **Database/runtime/infrastructure** determines what is persisted, deployed, configured, and executing.

A lower layer must not silently redefine a higher layer. If code appears to conflict with an approved business or architecture decision, stop, identify the conflict, and request the appropriate decision. If documentation conflicts with implementation, distinguish planning intent from code evidence. Source code is not proof of production deployment, and a local migration is not proof of remote application.

## Source-of-Truth Hierarchy

Use these sources in order for the question being answered:

1. Approved business decisions and `docs/BLOCKWAVELAB_V2_SPEC.md`.
2. `docs/BLOCKWAVELAB_SRS.md` for software requirements.
3. `docs/DOCUMENTATION_ARCHITECTURE.md` for documentation governance.
4. Current architecture, authorization, domain, API, database, and client-journey documents.
5. Actual source code.
6. Actual database migrations and SQL functions.
7. Supabase Edge Functions.
8. Repository configuration and package scripts.
9. Verified remote deployment/runtime state.
10. Historical phase reports.

Historical reports preserve context. Planning documents describe intent. Neither is proof of implementation or deployment. Runtime claims require current runtime evidence.

Use explicit evidence labels in reports:

- `LOCAL`
- `STRUCTURALLY VERIFIED`
- `REMOTE VERIFIED`
- `RUNTIME VERIFIED`
- `DEFERRED/BLOCKED`
- `HISTORICAL`

## Repository Reality

Current implementation surfaces include:

- Vite 7, React 18, TypeScript, Tailwind/PostCSS, MDX, and Lucide dependencies from `package.json`.
- Vite configuration in `vite.config.ts` with React, MDX, and syntax highlighting plugins.
- Route resolution in `src/routes/routeConfig.ts` and route composition in `src/routes/router.tsx`.
- Public pages under `src/pages/`, authenticated platform surfaces under `src/pages/platform/`, and shared UI under `src/components/`.
- Supabase browser boundaries under `src/lib/supabase/`.
- Organization, commercial, payment, entitlement, and delivery data helpers under `src/lib/organizations/`.
- Provider-neutral payment contracts under `src/lib/payments/`.
- Server-only Stripe behavior in `src/lib/payments/stripeProviderAdapter.ts` and `supabase/functions/stripe-webhook/index.ts`.
- Append-only database history under `supabase/migrations/`.
- Current corrective payment/lifecycle migrations `202610030001` through `202610030004`.

The linked Supabase project is currently inactive. Remote migration, database security, authenticated runtime, and live Stripe behavior are not verified. Preserve that limitation in every report until the environment changes and the checks are actually executed.

## Standard AI Workflow

```text
UNDERSTAND
  -> INSPECT
    -> TRACE
      -> PLAN
        -> IMPLEMENT
          -> VALIDATE
            -> REVIEW
              -> DOCUMENT
```

### Understand

- Restate the requested behavior in repository terms.
- Identify affected business rules and SRS requirement IDs.
- Identify affected architecture/domain boundaries.
- Classify the change as business, architecture, code, database, runtime/infrastructure, documentation, or cross-layer.
- Identify whether the request is current, planned, deferred, owner-controlled, or out of scope.

### Inspect

Before editing, inspect the narrowest relevant surfaces:

- source files and imports;
- current routes and page ownership;
- data helpers and Supabase calls;
- RPC names and argument contracts;
- migrations, constraints, triggers, RLS, and grants;
- Edge Functions and provider adapters;
- package scripts and configuration;
- neighboring tests or static checks;
- relevant current documentation and historical reports.

Prefer targeted search and local reads over reading the whole repository blindly. Do not infer an implementation from a document when the source exists.

### Trace

Trace the complete path that controls the requested behavior:

```text
UI -> client logic -> data helper -> RPC/API -> database policy/function
```

For commercial changes, trace:

```text
Catalog -> project service -> proposal/version -> agreement/acceptance
-> payment obligation -> payment attempt -> verified webhook
-> settlement -> entitlement -> delivery activation -> downstream record
```

Also trace organization/project ownership, role checks, RLS, immutable fields, idempotency, and audit calls. For integrations, trace browser boundary, server adapter, Edge Function, provider event, and persistence.

### Plan

State one falsifiable local hypothesis and one cheap check that could disconfirm it before making a substantive edit. Then choose the smallest safe change. Identify:

- dependencies and affected layers;
- migration and ordering impact;
- security and tenant-isolation impact;
- backward-compatibility impact;
- documentation and release-evidence impact;
- whether remote verification is available.

### Implement

- Modify only the required surfaces.
- Preserve established framework, package, route, domain, and data-access patterns.
- Prefer a small targeted change over a rewrite.
- Do not introduce duplicate tables, utilities, RPCs, providers, or lifecycle systems.
- Do not refactor unrelated code while solving a focused request.
- Preserve public APIs and existing error semantics unless the requirement requires a change.

### Validate

After the first substantive edit, run the narrowest useful check immediately. Depending on the change, use:

- `npm run typecheck -- --pretty false`
- `npm run lint`
- `npm run build`
- focused static or targeted checks;
- migration ordering/syntax/RLS/grant checks;
- `git diff --check`;
- `git status --short --untracked-files=all`.

Do not run deployment or runtime commands when the environment is known to be inactive. Never report a check that was not executed.

### Review

Review the result against:

- approved business rules;
- SRS requirements and stable IDs;
- architecture boundaries;
- tenant and project isolation;
- role and grant boundaries;
- immutable source relationships;
- lifecycle ordering;
- payment and provider integrity;
- idempotency and concurrency;
- audit correlation;
- unrelated file changes and generated artifacts.

### Document

Update the correct source-of-truth documentation after implementation. Record local evidence, remote evidence, runtime evidence, deferred checks, and blockers separately. Do not upgrade `LOCAL` to `REMOTE VERIFIED` by implication.

## Repository Exploration Rules

Use targeted searches such as:

- domain/entity names: `entitlements`, `payment_attempts`, `delivery_activations`;
- function names: `activate_entitlement_from_settlement`, `activate_delivery`;
- route names in `src/routes/routeConfig.ts`;
- Supabase calls: `.from(` and `.rpc(`;
- grants and RLS: `grant execute`, `revoke execute`, `enable row level security`, `create policy`;
- provider boundaries: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `constructEvent`;
- migration filenames and numeric ordering.

Inspect imports and call sites, not just definitions. A forwarding UI component may not own the behavior; follow the nearest function that computes, mutates, authorizes, or persists it.

## Change Classification

Classify every requested change where practical:

- `BUSINESS CHANGE`
- `ARCHITECTURE CHANGE`
- `CODE CHANGE`
- `DATABASE CHANGE`
- `RUNTIME / INFRASTRUCTURE CHANGE`
- `DOCUMENTATION CHANGE`
- `CROSS-LAYER CHANGE`

Cross-layer changes require review of every affected layer. A database change that changes user-visible lifecycle behavior is also an SRS, security, migration, and release-evidence change.

## Business Safety Rules

AI must not silently modify:

- BlockWaveLab positioning;
- the exact BUILD, AUTOMATE, OPERATE, and GROW pillars;
- approved service architecture;
- commercial or pricing policy;
- payment semantics;
- delivery lifecycle meaning;
- authorization policy or ownership authority;
- AI responsibility boundaries.

If a requested change conflicts with approved business rules:

```text
STOP -> IDENTIFY CONFLICT -> DOCUMENT CONFLICT -> REQUIRE OWNER DECISION
```

Do not solve an ambiguous business decision with an implementation assumption.

## Code Safety Rules

- Preserve Vite, React, TypeScript, Tailwind/PostCSS, MDX, Supabase, and Stripe package boundaries unless an approved change requires otherwise.
- Prefer small targeted edits and established local patterns.
- Avoid unrelated cleanup, dependency upgrades, renames, and rewrites.
- Do not create duplicate utilities, components, data-access paths, providers, tables, or lifecycle functions.
- Do not bypass authorization with hidden UI controls or client-supplied identity fields.
- Do not expose secrets or move server secrets into `VITE_*` configuration.
- Preserve tenant boundaries, immutable commercial/lifecycle fields, idempotency, auditability, and existing error handling.
- Preserve existing route behavior unless the requested change explicitly owns that route.
- Keep browser code limited to browser-safe Supabase and payment boundaries.

## Database and Migration Safety

Before database work:

1. Inspect the current migration chain and relevant tables/functions.
2. Check whether the behavior already exists.
3. Inspect constraints, triggers, RLS, grants, `SECURITY DEFINER`, and fixed `search_path` settings.
4. Check migration ordering and dependencies.
5. Identify whether an append-only corrective migration is actually required.

Rules:

- Never casually edit an already-applied migration.
- Use a new corrective migration only for a concrete defect.
- Never manually mutate the remote database outside normal migration tracking.
- Preserve RLS and trusted service-role operations.
- Do not bypass RLS for convenience.
- Do not create browser-direct privileged writes.
- Preserve immutable source relationships and lifecycle integrity.
- Review migration impact before implementation and verify it afterward when the environment is available.

The current local commercial/payment correction chain is:

```text
202610030001 settlement -> entitlement
202610030002 delivery activation integrity
202610030003 commercial boundary integrity
202610030004 payment failure/expiry hardening
```

## Supabase Operating Rules

- Use the browser-safe Supabase client only for permitted authenticated reads and approved client RPC calls.
- Treat RLS as an enforcement boundary, not a UI feature.
- Treat service-role RPCs as trusted server operations, never as browser capabilities.
- Preserve `SECURITY DEFINER` only where required and keep `search_path` fixed.
- Inspect organization/project ownership predicates on every trusted mutation path.
- Preserve authenticated read restrictions and direct-write denial.
- Do not invent environment variables, project references, credentials, or deployment state.
- The current linked project is inactive; do not retry remote deployment workarounds while it remains inactive.
- Source code and local migrations are implementation evidence, not proof of remote application.

## Stripe and Payment Safety

The payment chain is:

```text
Payment obligation
  -> payment attempt
    -> provider adapter / Stripe Checkout
      -> verified checkout.session.completed webhook
        -> payment settlement
          -> entitlement
            -> delivery activation
```

Current safeguards include:

- provider-neutral contracts in `src/lib/payments/`;
- server-only `STRIPE_SECRET_KEY` access in the Stripe adapter;
- raw-body `Stripe-Signature` verification in the Edge Function;
- fail-closed handling for missing secrets, signatures, correlation metadata, or Supabase configuration;
- only `checkout.session.completed` entering the settlement path;
- internal obligation/attempt/organization/project correlation;
- amount/currency validation;
- provider-event and payment-attempt uniqueness;
- failed/cancelled/expired attempt and obligation protection;
- post-settlement lifecycle protection;
- settlement-backed entitlement activation;
- active-entitlement delivery activation.

AI must not:

- treat browser redirects or client payment state as trusted settlement evidence;
- fabricate payment success, provider events, signatures, settlements, or entitlements;
- create entitlement directly from an untrusted event;
- bypass the settlement integrity boundary;
- add `payment_intent.succeeded` or another event type unless an approved change explicitly requires it;
- claim live Stripe verification without actual configured execution and evidence.

The adapter may create or inspect checkout behavior locally, but provider-not-configured results and `settlementVerified: false` are not payment success.

## Delivery Lifecycle Safety

Preserve this order:

```text
Catalog
  -> Service Selection/Request
    -> Proposal
      -> Proposal Acceptance
        -> Agreement when required
          -> Payment
            -> Entitlement
              -> Delivery Activation
                -> Implementation
                  -> Deployment
                    -> Observation
                      -> Stabilization
                        -> Documentation
                          -> Handover
                            -> Optional Ongoing Service
```

Rules:

- Commercial acceptance is not delivery activation.
- Settlement is not entitlement.
- Entitlement is not delivery activation.
- Downstream records require valid upstream state and matching tenant/project/source relationships.
- Delivery activation begins at `ACTIVE` / `IMPLEMENTATION`.
- Ongoing service is optional and separately paid.
- No payment, entitlement, or delivery operation may initialize later stages automatically.
- Do not add lifecycle stages or shortcuts.

## Security Operating Rules

Treat security changes as high-risk. Inspect the current model before editing:

- authentication and active membership;
- organization and project authorization;
- OWNER, ADMIN, MEMBER, and project-role boundaries;
- RLS policies;
- protected inserts, updates, and deletes;
- service-role-only trusted operations;
- `SECURITY DEFINER` and fixed `search_path`;
- immutable source fields and lifecycle triggers;
- audit events and correlation fields;
- anonymous execution restrictions;
- cross-tenant relationship checks;
- payment and lifecycle idempotency.

A hidden button is not authorization. A client-supplied organization/project ID is not ownership proof. Security claims require actual policy, function, grant, trigger, and runtime evidence where applicable.

## Client and UI Rules

Current UI ownership is route-driven through `src/routes/routeConfig.ts` and `src/routes/router.tsx`. Public pages live under `src/pages/`; authenticated platform views are composed in `src/pages/platform/PlatformApp.tsx`; organization/payment/lifecycle data access is centralized in `src/lib/organizations/data.ts`.

When changing UI:

- follow existing route and component patterns;
- use existing data helpers and typed domain models;
- preserve loading, empty, error, unauthorized, forbidden, and retry states;
- keep delivery and downstream lifecycle views read-only unless an approved existing OWNER control owns the operation;
- never expose service-role RPCs or payment secrets in browser code;
- do not invent unsupported screens, buttons, statuses, or workflows;
- re-check server authorization even when the UI hides a control.

## Testing and Validation Rules

### Code changes

Run the relevant narrow checks, normally:

- `npm run typecheck -- --pretty false`
- `npm run lint`
- `npm run build`
- focused tests or static checks;
- `git diff --check`.

### Database changes

Check migration order, SQL/function syntax, constraints, RLS, grants, immutable triggers, idempotency, and tenant relationships. Use runtime database verification only when the linked environment is reachable.

### Payment changes

Check webhook signature and raw-body handling, event allowlist, correlation, amount/currency matching, negative states, uniqueness, idempotency, and settlement-to-entitlement boundaries. Live provider verification requires real trusted infrastructure; never simulate it.

### Documentation-only changes

Check required sections, stable IDs, terminology, source-path references, contradiction with `DOCUMENTATION_ARCHITECTURE.md`, duplicate identifiers, and `git diff --check`.

Never claim a validation command was run if it was not run.

## Current Environment Limitation

The Supabase project is currently inactive/paused. Preserve these states:

- remote database deployment: `NOT VERIFIED`;
- runtime security verification: `NOT VERIFIED`;
- authenticated runtime testing: `DEFERRED`;
- live Stripe Checkout/webhook testing: `DEFERRED`;
- settlement replay/idempotency runtime testing: `DEFERRED`.

Do not fabricate runtime results or convert local migration/source evidence into production claims.

## Documentation Maintenance

### Business change

Update the approved business source, review the SRS, review architecture impact, then identify implementation impact. Do not implement an unresolved policy decision.

### Architecture change

Update the architecture owner document, review SRS traceability, then update affected engineering, database, and runtime documentation.

### Code change

Review the affected SRS IDs, source files, routes, data helpers, security paths, and validation. Update operating or release documentation when observable behavior changes.

### Database change

Use an append-only migration when a concrete change is approved. Update relevant data/security documentation and SRS traceability. Record whether the migration is local, remotely applied, or unverified.

### Payment change

Review commercial/payment documentation, the SRS, security boundaries, provider adapter, webhook, settlement, entitlement, and runtime evidence. Never describe client payment state as settlement truth.

### Release change

Update release readiness and release records when those documents exist. Record exact commands, evidence, blockers, and time/context. A phase report is not automatically a release record.

## Requirement Traceability

Map meaningful implementation changes to:

- SRS requirement IDs;
- relevant architecture documents;
- source files;
- migrations;
- Edge Functions;
- validation and runtime evidence.

If no requirement covers a proposed behavior, classify it as already approved but undocumented, planned, deferred, owner decision, or out of scope. Do not invent a requirement merely to justify implementation.

## Deferred and Not-Verified Rules

Never convert:

```text
static evidence -> runtime verification
local implementation -> production deployment
planned architecture -> implemented feature
source code -> live infrastructure
```

Use the exact status that the evidence supports. Report the blocker when a required check cannot run.

## Documentation Conflict Rule

When documents disagree:

1. Identify the conflict.
2. Determine whether one document is historical.
3. Compare both with current source and migrations.
4. Check verified runtime evidence if available.
5. Do not silently overwrite historical documentation.
6. Update the correct current source of truth only when authorized.
7. Report unresolved conflicts explicitly.

## Change Scope Control

Change only what is necessary to satisfy the requested requirement. Avoid unrelated refactors, dependency upgrades, route rewrites, architecture changes, historical-document deletion, speculative performance work, speculative AI features, and unsupported integrations.

If a larger change is required, explain the dependency and risk before editing.

## Git and Diff Safety

Before finishing a change:

- inspect `git status`;
- inspect `git diff` and changed files;
- run `git diff --check`;
- verify no unrelated files changed;
- verify no secrets were introduced;
- restore or explain generated artifacts;
- do not rewrite history unless explicitly requested.

## AI Work Report Format

Every coding-agent report should include:

1. Objective
2. Files inspected
3. Files changed
4. Business impact
5. Architecture impact
6. Database impact
7. Security impact
8. Implementation summary
9. Validation performed
10. Runtime verification state
11. Deferred items
12. Remaining risks
13. Documentation updated
14. Git diff summary

Do not report success without evidence.

## Stop Conditions

Stop and request clarification or an owner decision when:

- business rules conflict;
- pricing is unspecified;
- legal/accounting behavior is unclear;
- the security model would materially change;
- tenant isolation could weaken;
- the payment trust boundary would change;
- lifecycle integrity would change;
- a new service category or pillar is proposed;
- production credentials are required but unavailable;
- runtime state is required but unavailable;
- an applied migration would need unsafe modification;
- unsupported infrastructure is required;
- repository evidence is insufficient.

Do not guess in these cases.

## Guide Change Protocol

```text
Business decision
  -> SRS review
    -> Architecture review
      -> Code impact review
        -> Database/runtime impact review
          -> Implementation
            -> Verification
              -> Documentation update
                -> Release readiness
                  -> Release record
```

The guide itself is an operating document. It must stay aligned with `DOCUMENTATION_ARCHITECTURE.md`, `BLOCKWAVELAB_SRS.md`, actual source/migrations, and verified runtime evidence.
