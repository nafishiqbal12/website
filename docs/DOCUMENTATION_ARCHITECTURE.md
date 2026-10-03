# BlockWaveLab Documentation Architecture

## Purpose

This document defines how BlockWaveLab documentation is organized, governed, and trusted. It is an index and operating contract, not a replacement for the business specification, architecture documents, source code, database migrations, or runtime evidence.

Documentation must help business owners, architects, developers, AI coding assistants, maintainers, and release owners answer three different questions:

- **KNOWLEDGE:** What is BlockWaveLab and how is it designed?
- **OPERATING:** How should people safely build, test, maintain, and change it?
- **RELEASE:** What evidence shows that a particular version is ready or deployed?

Lower-level documents may explain or implement higher-level decisions, but they must not silently redefine them.

## Four-Layer Project Model

The repository is understood in this order:

```text
BUSINESS
  -> ARCHITECTURE
    -> CODE
      -> DATABASE / RUNTIME / INFRASTRUCTURE
```

### BUSINESS

Defines what BlockWaveLab is, its approved four-pillar model, commercial rules, roles, lifecycle meaning, and decisions that require owner approval. Business documents are not rewritten by implementation convenience.

### ARCHITECTURE

Defines how the product is structured: domains, boundaries, tenancy, authorization, client journeys, APIs, data ownership, and lifecycle relationships. Architecture must preserve approved business decisions.

### CODE

Defines how the architecture is implemented in the repository. Actual source code, tests, configuration, and migration files are implementation evidence. Code cannot be inferred solely from planning documents.

### DATABASE / RUNTIME / INFRASTRUCTURE

Defines what is persisted, secured, deployed, configured, and executing. Migrations describe intended database changes; a remote migration ledger, deployed function inventory, runtime configuration, and observed execution are required to claim current remote state.

## Documentation Categories

Every document should have one primary category:

### KNOWLEDGE

Stable understanding of the business, architecture, domain model, data model, and system boundaries.

### OPERATING

Instructions for development, AI-assisted changes, testing, migrations, deployment, incidents, maintenance, and documentation updates.

### RELEASE

Evidence and decisions for a specific build or deployment: validation results, migration state, runtime state, known blockers, approvals, and release records.

A phase report may contain all three kinds of information, but its primary status is historical unless it is explicitly updated with current evidence.

## Source-of-Truth Rules

1. The approved business decision is authoritative for business behavior.
2. Architecture documents are authoritative for approved design intent within their stated scope.
3. Actual source code is authoritative for implemented code behavior.
4. Database migrations are authoritative for intended schema/function/policy changes in repository history.
5. The remote database, deployed Edge Functions, runtime configuration, and observed execution are authoritative for what is actually deployed or executing.
6. Release records are authoritative only for the evidence and time they explicitly cover.
7. Documentation must state whether a claim is planned, locally implemented, remotely verified, or historical.
8. A document must never claim a runtime state that has not been verified.

### Conflict Precedence

When sources conflict, resolve them in this order for the relevant question:

```text
Approved business decision
  -> approved architecture decision
    -> actual source code and migrations
      -> verified deployed/runtime state
        -> explanatory or historical documentation
```

The final authority depends on the claim. Deployed/runtime state wins for current deployment claims; source code wins for code behavior; approved business decisions win for business rules. A newer source does not automatically erase an unresolved business decision. Conflicts must be recorded and resolved explicitly.

## Documentation and Repository Code

Documentation describes intent, constraints, and evidence. The repository determines what can actually run. A change to routes, domain behavior, authorization, SQL, migrations, environment contracts, build scripts, or provider boundaries must be checked against the relevant source files and tests.

Documentation must link to stable repository paths where useful. It must not duplicate implementation logic in a way that can drift. Security claims must be checked against actual RLS policies, grants, RPC definitions, triggers, and runtime behavior, not documentation alone.

## Documentation and Deployed Runtime

A local migration file does not prove that a remote migration is applied. A function source file does not prove that an Edge Function is deployed or active. A successful build does not prove that a provider event was processed.

Use explicit labels:

- **LOCAL:** present and checked in the repository.
- **STRUCTURALLY VERIFIED:** supported by source/migration inspection or a local static check.
- **REMOTE VERIFIED:** confirmed through the linked project or deployed runtime command.
- **RUNTIME VERIFIED:** exercised against an actual configured runtime.
- **DEFERRED/BLOCKED:** not verified, with the exact reason recorded.
- **HISTORICAL:** evidence from an earlier phase or time.

## Authoritative and Explanatory Documents

Authoritative documents define decisions or current operating contracts within a named scope. Explanatory/reference documents help readers understand a system but cannot override an authoritative source. Historical reports preserve what was attempted or observed and must not be used as current deployment proof.

The documentation map below assigns these classifications conservatively. The classification is about documentation authority, not whether the underlying implementation is currently deployed.

## Current Repository Documentation Map

This map covers the repository documentation found during this pass. Marketing content under `src/content/` and code comments are content/code assets, not project governance documents.

### AUTHORITATIVE

- `docs/BLOCKWAVELAB_V2_SPEC.md` — approved business and product specification, including the four pillars and lifecycle intent.
- `docs/BLOCKWAVELAB_V2_PHASE_15_4B_DECISION_REGISTER.md` — commercial decision register within its stated decision scope.
- `docs/BLOCKWAVELAB_V2_PHASE_15_4_BUSINESS_DECISIONS.md` — business-decision resolution and unresolved-decision record within its stated scope.
- `docs/BLOCKWAVELAB_V2_PHASE_15_5D_OWNER_DECISION_CLOSURE.md` — final owner-decision closure matrix within its stated scope.
- `docs/PHASE_15_6_PAYMENT_FOUNDATION_IMPLEMENTATION.md` — current repository implementation report for the commercial/payment boundary; remote claims remain evidence-dependent.
- `docs/BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md` — authorization model and role intent, subject to actual policies and grants for implementation truth.

### OPERATING

- `README.md` — repository entry point; currently minimal and should eventually link to this architecture and operating system.
- `docs/TAILWIND_BEST_PRACTICES.md` — styling/tooling guidance.
- `CASE_STUDY_COMPONENTS_GUIDE.md` — case-study component guidance.
- `src/lib/caseStudies/CASE_STUDY_TEMPLATE.md` — content authoring template.
- `src/lib/leadGen/README.md` — legacy lead-generation module guidance; needs review before treating as a v2 operating contract.
- `src/lib/leadGen/IMPLEMENTATION_GUIDE.md` — legacy implementation guidance; needs review.
- `src/lib/leadGen/strategy.md` — legacy strategy reference; needs review.
- `src/lib/leadGen/COPY_LIBRARY.md` — legacy copy reference; needs review.
- `src/lib/marketing/BACKLINK_TEMPLATES_AND_TRACKING.md` — marketing operating reference.
- `src/lib/marketing/BACKLINK_QUICK_START.md` — marketing operating reference.
- `src/lib/marketing/WHITEHAT_BACKLINK_STRATEGY.md` — marketing operating reference.

### REFERENCE

- `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — planned API boundary reference.
- `docs/BLOCKWAVELAB_V2_CLIENT_JOURNEY.md` — planned client journey reference.
- `docs/BLOCKWAVELAB_V2_DATABASE_BLUEPRINT.md` — proposed database/data architecture reference.
- `docs/BLOCKWAVELAB_V2_DOMAIN_MODEL.md` — proposed domain model reference.
- `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md` — Phase 11 architecture proposal and repository audit reference.
- `docs/CASE_STUDY_DEPLOYMENT_SUMMARY.md` — case-study deployment reference.
- `docs/PRODUCTION_AUDIT_REPORT.md` — prior production audit reference.
- `docs/SEO_ACCESSIBILITY_AUDIT.md` — prior SEO/accessibility audit reference.
- `docs/SEO_ACCESSIBILITY_SUMMARY.md` — prior SEO/accessibility summary reference.
- `docs/FINAL_AUDIT_REPORT.md` — prior broad audit reference.
- `IMPLEMENTATION_COMPLETE.md` — root-level milestone reference.
- `build-output.txt` — generated build evidence artifact.
- `typecheck-output.txt` — generated typecheck evidence artifact.

### HISTORICAL

The following files are retained as phase history. They may document an earlier plan, implementation, or verification state and must not be read as proof of the current repository or deployment state:

- `docs/BLOCKWAVELAB_V2_PHASE_11_ARCHITECTURE_REVIEW.md`
- `docs/BLOCKWAVELAB_V2_PHASE_11_GAP_RESOLUTION.md`
- `docs/BLOCKWAVELAB_V2_PHASE_11_PLAN.md`
- `docs/BLOCKWAVELAB_V2_PHASE_12_PLAN.md`
- `docs/BLOCKWAVELAB_V2_PHASE_13_PLAN.md`
- `docs/BLOCKWAVELAB_V2_PHASE_15_2_SERVICE_CATALOG.md`
- `docs/BLOCKWAVELAB_V2_PHASE_15_4_PLAN.md`
- `docs/BLOCKWAVELAB_V2_PHASE_15_5_PLAN.md`
- `docs/BLOCKWAVELAB_V2_PHASE_15_5A_POLICY_RESOLUTION.md`
- `docs/BLOCKWAVELAB_V2_PHASE_15_5B_OWNER_DECISION_FINALIZATION.md`
- `docs/BLOCKWAVELAB_V2_PHASE_15_5C_OWNER_DECISION_RESOLUTION.md`
- `docs/BLOCKWAVELAB_V2_PHASE_15_PLAN.md`
- `docs/PHASE_3_REPORT.md`
- `docs/PHASE_4_REPORT.md`
- `docs/PHASE_5_REPORT.md`
- `docs/PHASE_6_REPORT.md`
- `docs/PHASE_7_REPORT.md`
- `docs/PHASE_8_REPORT.md`
- `docs/PHASE_9_REPORT.md`
- `docs/PHASE_10_REPORT.md`
- `docs/PHASE_12_1_LIVE_VERIFICATION.md`
- `docs/PHASE_12_IMPLEMENTATION.md`
- `docs/PHASE_12_REPORT.md`
- `docs/PHASE_13_IMPLEMENTATION.md`
- `docs/PHASE_13_1_IMPLEMENTATION.md`
- `docs/PHASE_13_2_IMPLEMENTATION.md`
- `docs/PHASE_14_IMPLEMENTATION.md`
- `docs/PHASE_15_1_IMPLEMENTATION.md`
- `docs/PHASE_15_2_IMPLEMENTATION.md`
- `docs/PHASE_15_3_IMPLEMENTATION.md`
- `docs/PHASE_15_COMMERCIAL_FOUNDATION_IMPLEMENTATION.md`
- `docs/PHASE_15_COMMERCIAL_FOUNDATION_GAP_REMEDIATION.md`
- `docs/PHASE_15_COMMERCIAL_FOUNDATION_RUNTIME_AUDIT.md`

### NEEDS REVIEW

- `docs/BLOCKWAVELAB_V2_MIGRATION_MAP.md` contains verified-at-the-time planning findings that may be stale after later implementation work; review before using it as an active backlog.
- `docs/PHASE_13_IMPLEMENTATION.md` and `docs/PHASE_13_2_IMPLEMENTATION.md` contain deployment claims that require comparison with current remote evidence.
- `docs/PHASE_14_IMPLEMENTATION.md` contains local/runtime qualification language that should be reconciled with current application and Supabase state.
- `docs/PHASE_15_1_IMPLEMENTATION.md`, `docs/PHASE_15_2_IMPLEMENTATION.md`, and `docs/PHASE_15_3_IMPLEMENTATION.md` contain phase-specific deployment/readiness claims that require current migration-ledger verification.
- `docs/PHASE_12_1_LIVE_VERIFICATION.md` is explicitly deferred historical evidence and should not be used as current environment status.
- `docs/FINAL_AUDIT_REPORT.md`, `docs/PRODUCTION_AUDIT_REPORT.md`, `docs/SEO_ACCESSIBILITY_AUDIT.md`, and `docs/SEO_ACCESSIBILITY_SUMMARY.md` need a current-scope review before serving as release evidence.
- `README.md` does not yet provide a complete v2 developer/onboarding path.

There is no `docs/BLOCKWAVELAB_V2_MASTER_DOCUMENTATION.md` in the current repository. There is also no dedicated AI developer guide, release readiness checklist, production runbook, launch record, or changelog.

## Future Documentation Roadmap

These documents are needed or should be consolidated in future documentation work. They are not created by this change:

### Core

- `docs/BLOCKWAVELAB_V2_MASTER_DOCUMENTATION.md` — navigational knowledge index and stable project overview.
- `docs/AI_DEVELOPER_GUIDE.md` — AI navigation, safe-edit rules, validation, and evidence requirements.
- `docs/RELEASE_READINESS_CHECKLIST.md` — release gates and evidence checklist.
- `docs/PRODUCTION_RUNBOOK.md` — normal operations and recovery procedures.
- `docs/LAUNCH_RECORD.md` — dated production launch evidence.
- `docs/CHANGELOG.md` — user and maintainer-facing change history.

### Business

- `docs/business/BUSINESS_MODEL.md`
- `docs/business/SERVICE_CATALOG.md`
- `docs/business/COMMERCIAL_POLICY.md`

These must derive from approved business decisions and must not invent prices, services, or lifecycle rules.

### Architecture

- `docs/architecture/SYSTEM_ARCHITECTURE.md`
- `docs/architecture/DOMAIN_MODEL.md`
- `docs/architecture/SECURITY_ARCHITECTURE.md`
- `docs/architecture/DATA_ARCHITECTURE.md`

Existing `BLOCKWAVELAB_V2_*` documents should be consolidated or cross-linked before new overlapping architecture files are created.

### Engineering

- `docs/engineering/ENGINEERING_GUIDE.md`
- `docs/engineering/API_CONTRACTS.md`
- `docs/engineering/DATABASE_MIGRATION_POLICY.md`
- `docs/engineering/TESTING_STRATEGY.md`

### Runtime

- `docs/runtime/DEPLOYMENT_GUIDE.md`
- `docs/runtime/ENVIRONMENT_MATRIX.md`
- `docs/runtime/INFRASTRUCTURE.md`
- `docs/runtime/INCIDENT_RESPONSE.md`

Release and runtime documents must distinguish repository intent from verified deployed state.

## AI Navigation Order

AI assistants should navigate the repository in this order:

1. Business source of truth
2. Architecture source of truth
3. Engineering/code rules
4. Database/runtime/infrastructure
5. Release documentation
6. Actual code
7. Actual deployed/runtime state

The final step is the authority for claims about what is currently deployed or executing. Actual source code is the implementation authority for code behavior. If a lower-level artifact conflicts with a higher-level decision, stop and identify the conflict rather than silently changing the business rule.

AI assistants must:

- inspect the relevant source before editing;
- search for existing tables, functions, routes, and policies before creating new ones;
- preserve existing architecture and public APIs unless an approved change requires otherwise;
- treat migrations as append-only and never edit an applied historical migration;
- run the narrowest useful validation before broad validation;
- report what was locally checked, remotely verified, deferred, or blocked;
- never infer secrets, credentials, provider success, or deployment from documentation alone.

## Developer Documentation Update Rules

After a business change, update the business decision source first. After an architecture change, update the architecture source and identify affected code/database boundaries. After code or migration changes, update the relevant operating and release evidence. After deployment, record the actual remote migration/function/runtime evidence with its timestamp or command context.

Do not copy the same business, security, payment, or authorization rule into many files. Keep one authoritative rule and link to it. Explanatory documents should summarize and point back to the authority. If a rule must appear in multiple layers, state whether it is a decision, implementation constraint, or verified evidence.

## Historical Phase Reports

Phase reports are append-only historical records of decisions, implementation, and evidence at a point in time. They are valuable for context and audit trails, but they are not current system truth unless explicitly revalidated. A later report may supersede an earlier report for its scope, but only verified code, migration history, and runtime evidence establish current behavior and deployment.

## Future Feature Documentation

For a future feature, create documentation only after identifying its approved business decision and architecture owner. Add one knowledge document for stable behavior, one operating document if maintainers need procedures, and release evidence only when the feature is implemented and verified. Include scope, source-of-truth links, affected code/database/runtime boundaries, security implications, migration plan, validation, rollout, and rollback evidence. Do not create a feature document merely to make an unimplemented feature appear real.

## Explicit Safety Rules

- Never invent missing project facts.
- Never treat old phase reports as current system truth.
- Never treat documentation as proof of deployment.
- Never claim a migration is deployed unless verified.
- Never claim a runtime test passed unless actually executed.
- Never fabricate Stripe, Supabase, or provider configuration.
- Never change business rules implicitly while implementing code.
- Never add services, pricing, features, or lifecycle states without approved business decisions.
- Verify security boundaries against actual database policies, functions, grants, and runtime behavior, not documentation alone.
- Never expose secrets in documentation, source, logs, or audit metadata.
- Never use a client-side hidden control as an authorization boundary.

## Documentation Change Protocol

```text
Business decision
  → Architecture decision
    → Code implementation
      → Database/runtime implementation
        → Verification
          → Documentation update
            → Release readiness
              → Release record
```

Each step must be evidenced before the next step is represented as complete. A documentation update may record that work is planned, local, verified, deferred, or blocked; it must not upgrade one state into another.
