# BlockWaveLab V2 Client Delivery Playbook

| Field | Value |
|---|---|
| Document ID | BWL-DELIVERY-001 |
| Version | 0.1 |
| Status | DRAFT — INTENDED DELIVERY BASELINE |
| Owner | Accountable owner not yet assigned |
| Review status | Pending owner and operations review |
| Authority | Delivery reference; runtime behavior not implied |
| Last updated | 2026-10-09 |

## 1. Purpose and Evidence Boundary

This playbook describes the documented intended client journey and delivery
gates. It does not claim that the full journey is implemented or runtime
verified.

Primary source: [BLOCKWAVELAB_V2_CLIENT_JOURNEY.md](../BLOCKWAVELAB_V2_CLIENT_JOURNEY.md).
Commercial and release boundaries come from the [SRS](../BLOCKWAVELAB_SRS.md)
and [Release Readiness Checklist](../RELEASE_READINESS_CHECKLIST.md).

## 2. Lifecycle State Boundary

```text
Qualification
→ Onboarding
→ Scope
→ Proposal
→ Approval
→ Payment
→ Entitlement
→ Delivery activation
→ Implementation
→ Deployment
→ Paid observation
→ Stabilization
→ Documentation
→ Handover
→ Optional ongoing service
```

Proposal acceptance is not payment success. Payment settlement is not
entitlement activation. Entitlement activation is not delivery activation.

## 3. Stage Playbook

| Stage | Entry conditions | Responsible role | Inputs/actions | Outputs and gate evidence | Failure/recovery | Status |
|---|---|---|---|---|---|---|
| Qualification | Visitor or direct-contact request | Internal operator; role assignment not formally established | Capture context, selected pillar, and qualification information | Qualification record or blocker | Missing information is assigned, reminded, and escalated | DOCUMENTED INTENT |
| Account/organization | Qualified contact or invitation | Client owner/operator | Create or join account, verify identity, establish organization | Verified account and organization context | Verification expiry or invitation mismatch uses a new controlled flow | NOT VERIFIED at runtime |
| Project setup | Organization exists | Client owner/operator | Create project, assign membership, select services | Project and selected service records | Unauthorized or cross-tenant access must fail closed | STRUCTURALLY VERIFIED / RUNTIME NOT VERIFIED |
| Onboarding | Project/service context exists | Client and delivery/operator roles | Provide systems, goals, access, constraints, and service context | Complete onboarding or explicit blocker | Reminders, owner, escalation, and scope revision | DOCUMENTED INTENT |
| Scoping | Onboarding accepted | Engineering/delivery roles | Clarify requirements, estimate scope/time/cost without inventing prices | Scope baseline and acceptance criteria | Changes require a new or revised scope record | DOCUMENTED INTENT |
| Proposal | Scope baseline exists | Authorized commercial role; owner not assigned | Issue immutable proposal version for review | Sent/viewed/changes-requested history | Expiry or rejection requires a new version | STRUCTURALLY VERIFIED / RUNTIME NOT VERIFIED |
| Approval/agreement | Client reviews proposal | Authorized owner/client approver | Approve proposal; create/accept agreement where required | Approved version, agreement, acceptance evidence | Invalid authority, stale version, or duplicate request fails safely | STRUCTURALLY VERIFIED / RUNTIME NOT VERIFIED |
| Payment | Approved commercial source and obligation | Provider/trusted server boundary | Reconcile required payment through approved provider path | Settlement evidence and payment status | Failed, duplicate, expired, or invalid events remain auditable | DEFERRED / RUNTIME NOT VERIFIED |
| Entitlement | Verified settlement or approved source according to policy | Trusted server boundary | Issue scoped entitlement if approved policy permits | Entitlement record with source and scope | Suspension/revocation/expiry follow approved policy | NOT VERIFIED |
| Delivery activation | Commercial and readiness prerequisites | Authorized delivery/operator role | Explicitly admit service into delivery | Activation record and audit event | Stale state, missing prerequisite, or unauthorized action blocks | RUNTIME VERIFICATION REQUIRED |
| Implementation | Delivery activated | Engineering/delivery | Execute approved implementation scope | Implementation acceptance evidence | Blockers are recorded; scope changes require control | DOCUMENTED INTENT |
| Deployment | Implementation ready | Engineering/release | Controlled release, environment checks, rollback readiness | Deployment acceptance | Failed readiness blocks release and triggers recovery/rollback planning | DOCUMENTED INTENT |
| Observation | Production deployment accepted | Delivery/operations | Paid observation of reliability, behavior, and operational quality for the current policy of **30 calendar days after deployment**, approved by the Founder/Business Owner under D-018 on 2026-10-09; this does not claim implementation, automation, contractual enforceability, or runtime verification | Findings, KPI context, stabilization plan, required observation evidence, and authorized exit approval | Issues are prioritized and tracked; observation is not free support and is not an SLA/SLO commitment | DOCUMENTED POLICY / RUNTIME-UNVERIFIED |
| Stabilization | Observation findings exist | Engineering/operations | Execute prioritized fixes and optimization | Predictable operation or documented limitations | Residual limitations are accepted or escalated | DOCUMENTED INTENT |
| Documentation | Stabilization complete or limitations recorded | Delivery/engineering | Complete architecture, workflows, runbooks, and change history | Documentation gate | Missing artifacts block handover | DOCUMENTED INTENT |
| Handover | Documentation complete | Delivery/operator and client owner | Transfer ownership, training context, limitations, and access | Handover acceptance | Open items remain tracked with owner and due condition | DOCUMENTED INTENT |
| Ongoing service | Handover accepted and separate service purchased | Operations | Operate agreed scope, support, monitoring, or optimization | Active service record and operational evidence | Pause, cancel, renew, or add service only through explicit change | DEFERRED / SCOPE-DEPENDENT |

## 4. Approval and Evidence Rules

- High-impact actions require human approval.
- Client-provided tenant/project identifiers are not authorization evidence.
- Sensitive commercial and payment transitions are server-authoritative.
- Immutable proposal, agreement, acceptance, and audit history is preserved.
- Runtime verification is separate from migration or static inspection.
- No stage may be called production-ready without current evidence and release
  approval.

## 5. Service-Specific Delivery Notes

- **BUILD:** Requires environment, repository, deployment, and access context.
- **AUTOMATE:** Requires workflow, tool, data, permission, and human-approval
  boundaries; provider selection is not established.
- **OPERATE:** Requires existing environment context and explicit monitoring,
  support, and escalation scope.
- **GROW:** Requires product/readiness, content/community, and feedback-loop
  context; launchable scope remains unresolved.

## 6. Failure and Recovery Vocabulary

The documented journey supports these controlled paths:

- Proposal expiry → preserve history; issue a new version.
- Proposal rejection → preserve reason; revise through a new version.
- Payment failure → no activation until reconciled.
- Missing client information → blocker, reminder, owner, escalation.
- Unauthorized access → forbidden or safe denial without tenant disclosure.
- Session expiry → preserve safe draft where possible and reauthenticate.
- Duplicate/replayed transition → idempotent response or safe conflict.
- Deployment failure → stop, record evidence, and use approved rollback/recovery.

Exact refund, cancellation, dispute, tax, legal, accounting, and provider
policies remain unresolved or externally dependent.

## 7. Runtime Verification Boundary

The complete client journey is **NOT VERIFIED**. Required runtime evidence
includes authenticated organization and role flows, cross-tenant denial,
commercial acceptance, payment/provider execution, entitlement, delivery
activation, browser refresh/deep-link behavior, and operational evidence.

## 8. Stage Exit, Approval, and Evidence Matrix

The following exit conditions apply to the intended process. They do not
indicate that the live platform automatically advances between stages.

| Stage | Exit criteria | Approval gate | Evidence to retain | Next permitted stage | Current evidence status |
|---|---|---|---|---|---|
| Qualification | Context, requested pillar/service, and blocker status are recorded. | None established. | Qualification record and unresolved questions. | Account/organization | DOCUMENTED INTENT |
| Account/organization | Identity and organization context are verified for the intended actor. | Client owner/operator confirmation where required. | Identity/organization evidence without secrets. | Project setup | RUNTIME-UNVERIFIED |
| Project setup | Project exists under the organization and selected service records are scoped. | Authorized organization/project role. | Project/service record and authorization result. | Onboarding | STRUCTURALLY VERIFIED / RUNTIME-UNVERIFIED |
| Onboarding | Required context, access boundaries, goals, and constraints are complete or explicitly blocked. | Client and delivery/operator review. | Onboarding checklist and blocker owner. | Scoping | DOCUMENTED INTENT |
| Scoping | Scope, assumptions, exclusions, and measurable acceptance criteria are recorded. | Client/authorized commercial review. | Scope baseline and acceptance matrix. | Proposal | DOCUMENTED INTENT |
| Proposal | Immutable proposal version is issued or the change request is recorded. | Authorized commercial role. | Proposal version, checksum, and history. | Approval/agreement | STRUCTURALLY VERIFIED / RUNTIME-UNVERIFIED |
| Approval/agreement | Required approval/agreement evidence references the reviewed version and actor. | Authorized client approver; legal policy remains unresolved where applicable. | Approval/agreement version and acceptance evidence. | Payment | STRUCTURALLY VERIFIED / RUNTIME-UNVERIFIED |
| Payment | Payment state is reconciled according to approved policy; no success is inferred from an unverified event. | Trusted server/provider boundary. | Payment obligation, attempt, settlement evidence, or failure record. | Entitlement | DEFERRED / RUNTIME-UNVERIFIED |
| Entitlement | A valid scoped entitlement exists only from the approved source and policy. | Trusted server boundary. | Entitlement source, scope, status, and audit evidence. | Delivery activation | RUNTIME-UNVERIFIED |
| Delivery activation | Active entitlement and all approved prerequisites are present; activation starts at IMPLEMENTATION. | Authorized delivery/operator role. | Activation record, prerequisite checklist, audit event. | Implementation | RUNTIME-UNVERIFIED |
| Implementation | Approved implementation scope is complete or residual limitations are recorded. | Client/delivery acceptance as scoped. | Implementation evidence, limitations, and acceptance. | Deployment | DOCUMENTED INTENT |
| Deployment | Release checks pass, deployment acceptance is recorded, and rollback/recovery readiness is documented. | Release owner approval; owner not assigned. | Release record, checks, deployment result, rollback note. | Observation | DOCUMENTED INTENT / RUNTIME-UNVERIFIED |
| Observation | The current D-018 policy duration of 30 calendar days after deployment is recorded, and observation findings, KPI context, stabilization actions, required evidence, and authorized exit approval are recorded. Duration alone does not authorize handover or stage progression. | Authorized owner/delivery/operations exit approval plus client review where applicable. | Findings, KPI context, limitations, owner records, policy reference, and exit approval evidence. | Stabilization | DOCUMENTED POLICY / RUNTIME-UNVERIFIED |
| Stabilization | Prioritized issues are resolved, accepted as limitations, or escalated with ownership. | Client/operations acceptance where applicable. | Fix/retest records and residual-risk acceptance. | Documentation | DOCUMENTED INTENT |
| Documentation | Architecture, workflows, runbooks, change history, and limitations are complete for the agreed scope. | Delivery/engineering review. | Documentation index and completeness checklist. | Handover | DOCUMENTED INTENT |
| Handover | Ownership, access transfer, training context, limitations, and open items are acknowledged. | Client owner and delivery/operator acceptance. | Handover record, access transfer, open-item register. | Optional ongoing service | DOCUMENTED INTENT |
| Ongoing service | A separate approved service scope exists after handover; operational boundaries are explicit. | Separate owner/client approval. | Service record, scope, operational evidence, and review cadence. | No automatic next stage | DEFERRED / SCOPE-DEPENDENT |

Where a stage remains `DOCUMENTED INTENT`, `RUNTIME-UNVERIFIED`, `DEFERRED`,
or `SCOPE-DEPENDENT`, the next stage is permitted only as an intended
governance transition after the stated gate, not as a claim about current
platform behavior.
