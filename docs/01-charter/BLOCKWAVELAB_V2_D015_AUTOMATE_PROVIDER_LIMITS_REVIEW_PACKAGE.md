# BlockWaveLab V2 — D-015 AUTOMATE Provider, Permissions and Limits Review Package

## 1. Document Control

| Field | Value |
|---|---|
| Document ID | BWL-D015-REVIEW-001 |
| Title | BlockWaveLab V2 D-015 AUTOMATE Provider, Permissions and Limits Review Package |
| Version | 0.1 |
| Status | DRAFT — SPECIALIST REVIEW PACKAGE; NOT AN APPROVED AI, PROVIDER, SECURITY, PRIVACY, COMMERCIAL, OR RELEASE POLICY |
| Owner | Accountable owner not yet assigned |
| Approver | Founder/Business Owner and required security, privacy, provider, operations, product, and release review pending |
| Effective date | 2026-10-09 |
| Decision | D-015 — AUTOMATE provider and limits |

This package organizes the owner, product, engineering, security, privacy,
provider, operations, delivery, and release questions needed to bound
AUTOMATE. It does not select a model, provider, workflow engine, tool,
permission, spending limit, autonomy level, retention policy, or customer
commitment. D-015 remains **UNRESOLVED / EXTERNAL INPUT**.

## 2. Authoritative Current Position

The [Owner Decision Matrix, D-015](./BLOCKWAVELAB_V2_OWNER_DECISION_MATRIX.md)
records that no provider is selected, human governance is required, and
security, privacy, and provider input remains necessary. The
[Charter Decision Register, D-015](./BLOCKWAVELAB_V2_CHARTER_DECISION_REGISTER.md)
records the status as **UNRESOLVED / EXTERNAL INPUT**. The
[Owner Decision Resolution Plan, D-015](./BLOCKWAVELAB_V2_OWNER_DECISION_RESOLUTION_PLAN.md)
requires provider review, data/tool-permission review, usage limits,
approvals, audit design, and runtime tests.

Current documented boundaries are:

- AUTOMATE is one of the four approved pillars.
- Automation Workflow Foundation is the current working-catalog service
  mapped to AUTOMATE; provider and model selection are not established.
- The documented capability concerns AI-assisted delivery/operations
  workflows, reporting, triage, and routine workflow automation.
- Workflow mapping, risk analysis, tool/permission design, human approval
  checkpoints, controlled implementation, validation, and handover are
  documented intent rather than a production capability.
- High-impact, sensitive, strategic, publication, payment, entitlement,
  delivery, and release decisions remain human-governed; unrestricted agents
  and unsupervised production control are excluded.
- No current AI runtime, provider integration, model deployment, agent
  execution, or provider-backed production capability is claimed.

## 3. Evidence Classes and Safety Boundary

### Documented intent and proposed design

The SRS, platform architecture, API blueprint, authorization model, service
catalog, delivery playbook, and product specification describe future agents,
bounded tools, project scope, human approvals, auditability, monitoring, and
failure controls. These documents do not approve an implementation or provider.

### Implemented or structurally represented

The repository contains general authorization, lifecycle, audit, provider
adapter, fail-closed, and server-side secret boundaries. Those boundaries do
not prove an AI provider integration, agent identity, tool enforcement,
prompt-safety control, tenant isolation at runtime, cost limit, or execution
behavior.

### Unverified or not approved

No provider, model, workflow engine, prompt policy, tool allowlist, network
boundary, quota, concurrency limit, timeout, retry rule, cost ceiling,
retention period, human coverage, autonomy level, sandbox/live configuration,
or production AI capability is selected by this package.

## 4. Review Questions

Each question requires an explicit approved outcome, documented deferral, or
evidence-based closure. This package does not answer the questions.

| ID | Question | Current documented position | What remains unresolved or unverified | Accountable role or external specialist | Dependencies on other decisions | Evidence needed for closure | Exact source document paths |
|---|---|---|---|---|---|---|---|
| D015-Q01 | What is the initial AUTOMATE scope, and which capabilities are explicitly excluded? | AUTOMATE covers bounded AI-assisted delivery/operations workflows, reporting, triage, and routine workflow automation; unrestricted agents, unsupervised production control, and employee-replacement claims are excluded. | Client-selectable workflows, service variants, target users, supported actions, environments, deliverables, and whether provider-backed automation is offered or deferred. | Founder/Business Owner; product and engineering owner. | D-001, D-003, D-013, D-014, D-016. | Founder-approved scope, catalog entry, workflow boundary, exclusions, acceptance criteria, and change record. | `docs/01-charter/BLOCKWAVELAB_V2_OWNER_DECISION_MATRIX.md` — D-015; `docs/01-charter/BLOCKWAVELAB_V2_CHARTER_DECISION_REGISTER.md` — D-015; `docs/03-services/BLOCKWAVELAB_V2_SERVICE_CATALOG_BASELINE.md` — Automation Workflow Foundation; `docs/02-business/BLOCKWAVELAB_V2_BUSINESS_PRODUCT_BASELINE.md` — Four-Pillar Business Model. |
| D015-Q02 | Which AI model/provider and workflow-engine choices, if any, are approved? | No AI model, provider, workflow engine, or provider-backed runtime is selected; architecture proposes provider adapters and future AI-provider integrations only. | Provider/model shortlist, hosting and region, workflow engine, version pinning, fallback behavior, commercial terms, data-processing terms, and owner authorization. | Founder/Business Owner; provider and security/privacy specialists; engineering. | D-003, D-005, D-007, D-014; provider review under D-015. | Dated owner decision, provider/model assessment, architecture decision record, approved terms, region/data-flow review, and configured test evidence. | `docs/01-charter/BLOCKWAVELAB_V2_OWNER_DECISION_RESOLUTION_PLAN.md` — D-015; `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md` — Future Integration Boundaries; `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — Future Monitoring/Agents and AI execution; `docs/03-services/BLOCKWAVELAB_V2_SERVICE_CATALOG_BASELINE.md` — Automation Workflow Foundation. |
| D015-Q03 | How are provider credentials and secrets stored, rotated, accessed, audited, and revoked? | Provider secrets must remain server-side; API rules prohibit exposing provider secrets or service-role credentials, and the SRS treats provider configuration as deferred/unverified. | Secret manager, names and environments, access roles, rotation frequency, revocation trigger, break-glass handling, provider key scope, audit records, and recovery after compromise. | Security specialist; platform/operations owner; provider specialist. | D-007, D-014, D-016; D-015 provider selection. | Secret-management design without values, access review, rotation/revocation exercise, environment separation, compromise runbook, and specialist sign-off. | `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — API Rules; `docs/BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md` — Planned Identity Boundary and Sensitive Actions; `docs/BLOCKWAVELAB_SRS.md` — NFR-REQ-015 and AI requirements; `docs/RELEASE_READINESS_CHECKLIST.md` — Environment configuration and Secrets/configuration dependencies. |
| D015-Q04 | What agent identity, roles, permissions, least-privilege controls, and tenant-isolation rules apply? | Future agents are intended to use explicit tools, permissions, project boundaries, human approvals, and audit records; ordinary client roles must not cross organization boundaries. | Agent identity lifecycle, service/user identity distinction, role mapping, token scope, project/organization binding, delegated authority, revocation, policy versioning, and runtime enforcement. | Security and authorization specialist; engineering; Founder/Business Owner for authority. | D-007, D-010, D-011, D-014, D-016. | Agent authorization model, permission matrix, policy tests, cross-tenant denial tests, revocation evidence, and audit records. | `docs/BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md` — AI agents, Explicit Authorization Algorithm, Tenant Isolation Rules, and Sensitive Actions; `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md` — Multi-Tenancy and Roles; `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — Execute AI action; `docs/BLOCKWAVELAB_SRS.md` — AI-REQ-005 and SEC requirements. |
| D015-Q05 | Which actions require human approval, confirmation, dual control, or explicit owner authority? | High-impact actions require human approval; AI does not replace governance gates; strategic, sensitive, approval, publication, payment, entitlement, delivery, and release responsibilities remain human-governed. | Action-risk taxonomy, approval roles, separation of duties, approval expiry, delegation, emergency handling, rejection/revision behavior, and whether any low-risk action may run without approval. | Founder/Business Owner; security/privacy, legal, product, and operations specialists. | D-004, D-007, D-010, D-011, D-014, D-016. | Approved action-risk matrix, approval workflow, authority/delegation records, negative tests, immutable approval audit, and exercised emergency path. | `docs/03-services/BLOCKWAVELAB_V2_SERVICE_CATALOG_BASELINE.md` — Human/AI boundary and Acceptance evidence; `docs/BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md` — Sensitive Actions; `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — Execute AI action; `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md` — AI Agent Architecture. |
| D015-Q06 | What tools, API permissions, network boundaries, repositories, environments, and data sources may an agent access? | Tool and permission boundaries are required per workflow; provider adapters and server-side authorization are proposed, while no AI tool runtime is implemented. | Tool inventory, read/write/delete scope, network egress, repository/cloud permissions, environment restrictions, file/document handling, rate limits, and third-party allowlist. | Engineering/platform and security specialists; operations and client owner where data is client-controlled. | D-002, D-007, D-011, D-014; D-015 provider and agent policy. | Versioned tool allowlist, API scopes, network/data-flow diagram, sandbox tests, denied-action tests, tenant fixtures, and client approval where required. | `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md` — Future Integration Boundaries and AI Agent Architecture; `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — API Rules and Execute AI action; `docs/BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md` — Tenant Isolation Rules; `docs/03-services/BLOCKWAVELAB_V2_SERVICE_CATALOG_BASELINE.md` — Security/privacy. |
| D015-Q07 | What execution limits govern quotas, concurrency, timeouts, retries, backoff, idempotency, and cost? | The API blueprint anticipates approval timeouts and background jobs; the architecture requires controlled retry for AI failures, but no numerical limits or cost policy is approved. | Per-tenant and per-agent quotas, token/request budgets, concurrency, timeout, retry/backoff, duplicate execution, queue limits, spend ceiling, provider throttling, and overage behavior. | Founder/Business Owner; engineering/operations and provider/accounting specialists. | D-003, D-005, D-009, D-014, D-016; D-015 provider selection. | Approved limits matrix, server-enforced counters, queue/concurrency tests, timeout/retry/idempotency evidence, cost alerts, and provider usage records. | `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — Background Jobs, Standard Failure Contract, and Idempotency; `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md` — Edge Cases and Configurable Business Rules; `docs/03-services/BLOCKWAVELAB_V2_SERVICE_CATALOG_BASELINE.md` — Failure/recovery and Pricing status. |
| D015-Q08 | How are prompt injection, untrusted inputs, data leakage, malicious tools, and unsafe output handled? | Validation, server-side authorization, data minimization, fail-closed behavior, and explicit tool boundaries are documented; a complete prompt-injection or agent threat model is not approved or runtime-verified. | Trust boundaries, content classification, instruction/data separation, retrieval controls, output validation, tool-call confirmation, exfiltration detection, poisoning, abuse, and user-visible failure behavior. | Security/privacy specialist; AI/provider security specialist; engineering. | D-007, D-014, D-015 provider/tool decisions; D-016 accountability. | Threat model, abuse cases, red-team/security tests, input/output controls, egress tests, sensitive-data fixtures, incident runbook, and residual-risk acceptance. | `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md` — Security Requirements, Edge Cases, and Privacy; `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — API Rules and Standard Failure Contract; `docs/BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md` — Tenant Isolation Rules; `docs/BLOCKWAVELAB_SRS.md` — SEC and AI requirements. |
| D015-Q09 | What audit logs, traceability, reproducibility, and evidence-retention rules apply to AI executions and approvals? | The architecture requires audit actor, organization, project, action, target, timestamp, metadata, correlation ID, and security context; AI execution/approval audit is planned, not implemented or runtime-verified. | Prompt/input/output capture policy, model/version and tool trace, reproducibility fields, redaction, retention, access, immutable storage, export, and legal/privacy limits. | Security/privacy and audit specialists; engineering; Founder/Business Owner for retention policy. | D-007, D-010, D-014, D-016; provider retention and D-015 policy. | Audit schema, sample redacted trace, correlation linkage, retention/access matrix, immutability test, reconstruction exercise, and specialist approval. | `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md` — Auditability and Observability; `docs/BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md` — Sensitive Actions; `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — API Rules; `docs/BLOCKWAVELAB_SRS.md` — AUD-REQ-001..002 and AI requirements. |
| D015-Q10 | How do failures stop safely, avoid duplicate side effects, support rollback/compensation, and recover? | AI failures and high-impact actions are intended to fail closed and require controlled retry or human approval; lifecycle and webhook operations use safe conflicts/idempotency concepts. | Stop conditions, cancellation, partial execution, compensation, rollback authority, queue recovery, dead-letter handling, provider outage, state reconciliation, and customer/operator communication. | Operations/release owner; engineering; security and provider specialists. | D-011, D-012, D-014, D-016, D-017; payment/entitlement/delivery boundaries. | Failure-state matrix, safe-stop and kill-switch exercise, idempotency/duplicate tests, rollback or compensation runbook, outage drill, and recovery evidence. | `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md` — Edge Cases, Backup/Recovery, and Future Integration Boundaries; `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — Standard Failure Contract and Idempotency; `docs/04-delivery/BLOCKWAVELAB_V2_CLIENT_DELIVERY_PLAYBOOK.md` — Failure and Recovery Vocabulary; `docs/RELEASE_READINESS_CHECKLIST.md` — Rollback considerations. |
| D015-Q11 | How are customer data, privacy, provider retention, subprocessors, and external transfers handled? | Privacy requires data minimization and purpose-based access; no provider, jurisdiction, retention, subprocessor, transfer, or customer-data policy is selected. | Data categories, lawful basis/contract terms, prompts and outputs, training use, provider/subprocessor access, region, retention/deletion, export, client notice, and cross-border transfer. | Qualified legal/privacy specialist; security and provider specialists; Founder/Business Owner. | D-002, D-005, D-007, D-015 provider/model choice, D-016. | Data-flow/classification matrix, privacy and provider terms review, DPA/subprocessor records, retention/deletion tests, transfer assessment, and approved customer wording. | `docs/01-charter/BLOCKWAVELAB_V2_D007_LEGAL_PRIVACY_REVIEW_PACKAGE.md`; `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md` — Privacy and Data Ownership; `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — API Rules; `docs/BLOCKWAVELAB_SRS.md` — AI and security requirements. |
| D015-Q12 | What monitoring, incident response, operational ownership, and support boundaries apply to AUTOMATE? | Monitoring, incidents, support, and future agents are planned/scope-dependent; D-014 has not approved OPERATE coverage, and no AI runtime support model exists. | Metrics/logs/traces, provider health, failed jobs, alert ownership, severity/escalation, service hours, on-call, client support, maintenance, and incident communication. | Operations owner; security incident specialist; Founder/Business Owner; provider specialist. | D-014, D-016, D-017; provider and runtime evidence under D-015. | Approved monitoring/support boundary, runbook, alert matrix, incident exercise, on-call/escalation record, provider status evidence, and support wording. | `docs/01-charter/BLOCKWAVELAB_V2_D014_OPERATE_COVERAGE_SUPPORT_REVIEW_PACKAGE.md`; `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md` — Monitoring and Support Architecture; `docs/RELEASE_READINESS_CHECKLIST.md` — Observability and Operations Readiness; `docs/03-services/BLOCKWAVELAB_V2_SERVICE_CATALOG_BASELINE.md` — Automation Workflow Foundation. |
| D015-Q13 | How are provider sandbox and live environments separated, and what runtime/security evidence is required? | No AI provider runtime exists; release readiness says authenticated, provider, security, and operational verification is incomplete, and static evidence does not prove runtime behavior. | Sandbox/live projects, credentials, data rules, network controls, deployment promotion, test identities, fixtures, provider event/evaluation evidence, rollback, and release authority. | Security/release owner; provider and engineering specialists; Founder/Business Owner. | D-011, D-012, D-014, D-016, D-017; D-015 provider decision. | Environment matrix, non-production tests, authenticated negative tests, provider security review, penetration/abuse results, runtime traces, promotion approval, and release checklist closure. | `docs/RELEASE_READINESS_CHECKLIST.md` — Current Release State, Launch Blockers, and Pre-Launch Gates; `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md` — Deployment and Future Integration Boundaries; `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — Provider and AI boundaries; `docs/BLOCKWAVELAB_SRS.md` — NFR-REQ-014..015 and AI requirements. |
| D015-Q14 | How does AUTOMATE integrate with BUILD, OPERATE, GROW, payments, entitlements, and delivery activation without bypassing gates? | AUTOMATE may support delivery/operations workflows; payment, entitlement, delivery, and release transitions remain separate server-authoritative boundaries, and automation must not self-authorize them. | Permitted combinations, trigger/source rules, read/write effects, approval ownership, failure behavior, handoff, service activation, payment/entitlement status effects, and GROW publication boundaries. | Founder/Business Owner; product, engineering, delivery, operations, security, and payment/provider specialists. | D-003, D-007, D-010, D-011, D-012, D-013, D-014, D-016. | Cross-domain state/authority matrix, integration contracts, denied-bypass tests, audit lineage, client-facing boundary wording, and approved end-to-end evidence. | `docs/04-delivery/BLOCKWAVELAB_V2_CLIENT_DELIVERY_PLAYBOOK.md` — Service-Specific Delivery Notes and Approval/Evidence Rules; `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md` — Complete Client Journey and Integration Boundaries; `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — Important Operation Contracts; `docs/01-charter/BLOCKWAVELAB_V2_D010_ENTITLEMENT_LIFECYCLE_REVIEW_PACKAGE.md`; `docs/01-charter/BLOCKWAVELAB_V2_D011_DELIVERY_ACTIVATION_REVIEW_PACKAGE.md`; `docs/01-charter/BLOCKWAVELAB_V2_D012_PAYMENT_SETTLEMENT_REVIEW_PACKAGE.md`. |
| D015-Q15 | What approval criteria, unresolved decisions, dependencies, accountable roles, and release gates must pass before AUTOMATE is activated or advertised? | D-015 remains `UNRESOLVED / EXTERNAL INPUT`; TR-004 is planned/proposed/deferred, no AI runtime is claimed, and release readiness remains blocked by required runtime gates. | Closure ordering, owner and specialist approvals, residual-risk acceptance, required runtime/security evidence, named evidence owners, release scope, and customer-claim limits. | Founder/Business Owner; security/privacy/provider, product, operations, delivery, and release authorities. | D-003, D-007, D-011, D-013, D-014, D-016, D-017; all D-015 questions. | Approved provider/AI policy, accountable RACI, security/privacy/provider sign-off, tool/permission and limits matrix, runtime test bundle, operational evidence, release approval, and controlled documentation updates. | `docs/01-charter/BLOCKWAVELAB_V2_OWNER_DECISION_RESOLUTION_PLAN.md` — D-015; `docs/06-requirements/BLOCKWAVELAB_V2_CAPABILITY_TRACEABILITY_BASELINE.md` — TR-004 and Requirement Evidence Rules; `docs/RELEASE_READINESS_CHECKLIST.md` — Launch Blockers and Pre-Launch Gates; `docs/01-charter/BLOCKWAVELAB_V2_PROJECT_CHARTER.md` — D-015 and release posture. |

## 5. Explicit Non-Approval and Exclusions

Until an explicit authorized decision and required specialist evidence are
recorded, this package does not authorize:

- Any AI model, provider, workflow engine, tool, agent identity, permission,
  network access, data source, autonomy level, quota, concurrency, timeout,
  retry policy, spending limit, retention period, or production deployment.
- Provider credentials, client-side secret exposure, unrestricted network
  egress, cross-tenant access, unsupervised production changes, autonomous
  payment/entitlement/delivery activation, or irreversible customer actions.
- Customer claims about AI capability, accuracy, availability, security,
  privacy, cost, productivity, response time, or provider support.
- Use of static architecture, proposed requirements, migrations, schemas,
  source inspection, or documentation as proof of verified AI runtime behavior.
- A change to any existing product, commercial, legal, security, provider,
  operational, entitlement, delivery, or release decision.

## 6. Closure Checklist

D-015 should remain **UNRESOLVED / EXTERNAL INPUT** until applicable items are
recorded:

- [ ] Initial AUTOMATE scope, exclusions, and customer-facing boundary.
- [ ] Approved or explicitly deferred provider, model, and workflow-engine
      decision.
- [ ] Credential, secret, rotation, revocation, and environment controls.
- [ ] Agent identity, role, least privilege, tenant isolation, and policy tests.
- [ ] Human approval and consequential-action matrix.
- [ ] Tool, API, network, repository, and data-access allowlist.
- [ ] Quota, concurrency, timeout, retry, idempotency, and cost controls.
- [ ] Prompt-injection, untrusted-input, leakage, and misuse threat evidence.
- [ ] Audit, traceability, reproducibility, redaction, and retention policy.
- [ ] Safe-stop, rollback/compensation, recovery, and outage evidence.
- [ ] Privacy, provider-retention, subprocessor, and transfer review.
- [ ] Monitoring, incident, support, on-call, and operational ownership under
      the approved D-014 boundary.
- [ ] Sandbox/live separation, runtime/security tests, and release evidence.
- [ ] Integration and lifecycle authority matrix across all dependent decisions.
- [ ] Accountable approvals, residual-risk record, and release authorization.

Release readiness remains **BLOCKED BY REQUIRED RUNTIME GATES**. This package
does not change that status.

## 7. Source Index

- [Charter Decision Register](./BLOCKWAVELAB_V2_CHARTER_DECISION_REGISTER.md)
- [Owner Decision Matrix](./BLOCKWAVELAB_V2_OWNER_DECISION_MATRIX.md)
- [Owner Decision Resolution Plan](./BLOCKWAVELAB_V2_OWNER_DECISION_RESOLUTION_PLAN.md)
- [Project Charter](./BLOCKWAVELAB_V2_PROJECT_CHARTER.md)
- [Business and Product Baseline](../02-business/BLOCKWAVELAB_V2_BUSINESS_PRODUCT_BASELINE.md)
- [Service Catalog Baseline](../03-services/BLOCKWAVELAB_V2_SERVICE_CATALOG_BASELINE.md)
- [Client Delivery Playbook](../04-delivery/BLOCKWAVELAB_V2_CLIENT_DELIVERY_PLAYBOOK.md)
- [Product and Platform Overview](../05-platform/BLOCKWAVELAB_V2_PRODUCT_PLATFORM_OVERVIEW.md)
- [Capability Traceability Baseline](../06-requirements/BLOCKWAVELAB_V2_CAPABILITY_TRACEABILITY_BASELINE.md)
- [Software Requirements Specification](../BLOCKWAVELAB_SRS.md)
- [Platform Architecture](../BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md)
- [API Blueprint](../BLOCKWAVELAB_V2_API_BLUEPRINT.md)
- [Authorization Model](../BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md)
- [D-005 Accounting and Tax Review Package](./BLOCKWAVELAB_V2_D005_ACCOUNTING_TAX_REVIEW_PACKAGE.md)
- [D-007 Legal and Privacy Review Package](./BLOCKWAVELAB_V2_D007_LEGAL_PRIVACY_REVIEW_PACKAGE.md)
- [D-010 Entitlement Lifecycle Review Package](./BLOCKWAVELAB_V2_D010_ENTITLEMENT_LIFECYCLE_REVIEW_PACKAGE.md)
- [D-011 Delivery Activation Review Package](./BLOCKWAVELAB_V2_D011_DELIVERY_ACTIVATION_REVIEW_PACKAGE.md)
- [D-012 Payment Settlement Review Package](./BLOCKWAVELAB_V2_D012_PAYMENT_SETTLEMENT_REVIEW_PACKAGE.md)
- [D-014 OPERATE Coverage Review Package](./BLOCKWAVELAB_V2_D014_OPERATE_COVERAGE_SUPPORT_REVIEW_PACKAGE.md)
- [Release Readiness Checklist](../RELEASE_READINESS_CHECKLIST.md)
