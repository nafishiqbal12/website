# BlockWaveLab V2 Domain Model

## Purpose
Canonical domain vocabulary for future client-platform implementation. This document defines ownership and lifecycle boundaries; it does not implement runtime behavior.

## Core Aggregates

### Identity
- `User/Profile`: authenticated person and profile metadata.
- `OrganizationMembership`: user-to-organization relationship, role, status, invitation metadata.

### Organization
- `Organization`: tenant boundary and commercial owner.
- `OrganizationSettings`: configurable organization preferences.

### Project
- `Project`: delivery container owned by one organization.
- `ProjectMembership`: project-specific access and role.
- `ProjectLifecycleEvent`: immutable state transition record.

### Catalog
- `Pillar`: exactly BUILD, AUTOMATE, OPERATE, GROW.
- `Service`: capability belonging to a pillar.
- `ServiceOffering`: selectable/commercial variant with effective dates, scope template, availability, billing mode.
- `ProjectService`: project selection and lifecycle status for an offering.

### Commercial
- `Quote`: calculated commercial snapshot.
- `Proposal`: logical negotiation container.
- `ProposalVersion`: immutable client-facing scope/commercial version.
- `ProposalItem`: service/deliverable/fee line.
- `Invoice`, `Payment`, `Subscription`, `SubscriptionItem`: settlement and ongoing service records.

### Delivery
- `OnboardingSession`, `OnboardingAnswer`.
- `Requirement`, `RequirementItem`, `RequirementApproval`.
- `ChangeRequest`.
- `Milestone`, `Task`, `TaskDependency`, `Deliverable`.
- `Document`, `DocumentVersion`, `DocumentAccess`.

### Operations
- `SupportTicket`, `SupportMessage`.
- Future `Monitor`, `Incident`, `Alert`, `MonitoringEvent`.
- Future `Agent`, `AgentConfig`, `AgentSkill`, `ToolPermission`, `AgentExecution`, `HumanApproval`.

### Cross-cutting
- `Notification`, `NotificationPreference`, `NotificationDelivery`.
- `AuditLog`.

## Ownership Rules
- Organization owns projects, memberships, commercial records, and organization documents.
- Project owns delivery records, project services, requirements, tasks, milestones, deliverables, project documents, support, and future monitoring/agent records.
- Users do not own tenant data directly; they receive access through memberships.
- Every query path must resolve organization ownership before returning data.

## Core Relationships

```text
User -> OrganizationMembership -> Organization -> Project -> ProjectMembership -> User
Organization -> ProjectService -> ServiceOffering -> Service -> Pillar
Project -> OnboardingSession -> OnboardingAnswer
Project -> Requirement -> RequirementItem -> Approval
Project -> Proposal -> ProposalVersion -> ProposalItem
Project -> Milestone -> Task -> Deliverable
Project -> Document -> DocumentVersion
Organization/Project -> Invoice -> Payment
Project -> Subscription -> SubscriptionItem
Organization/Project -> AuditLog
```

## State Ownership
- Business status transitions are server-owned.
- UI may request a transition but cannot directly set lifecycle state.
- Approved proposal versions, paid invoices, audit logs, and document versions are immutable records.
- Archival is distinct from deletion; deletion rules require legal/privacy decisions.

## Four-Pillar Capability Map

| Pillar | Approved capability family |
|---|---|
| BUILD | cloud/environment design, CI/CD, container/deployment workflows, reliability baselines, security/access baseline |
| AUTOMATE | AI-assisted delivery/operations workflows, agent task orchestration, reporting/triage/routine flow automation, human checkpoints, prompt/policy versioning |
| OPERATE | managed releases, incident/runbook coordination, reliability operations, change governance, ongoing AI operations support |
| GROW | technical growth systems, authority/trust content operations, community enablement, delivery-aligned demand support, growth/operations feedback loops |

## Decisions Deferred
- Whether agreements/contracts need first-class relational entities or document-backed records.
- Whether a project service may have multiple concurrent offerings.
- Whether cross-project organization documents are needed.
- Whether task assignment supports external collaborators.

## Phase 11.1 Resolved Additions

### Identity and membership
- `AuthIdentity`: provider/user identifier linked one-to-one to a profile; provider owns credentials and verification state.
- `SecurityEvent`: sign-in, sign-out, verification, reset, session revoke, MFA/security changes, and suspicious activity.
- `OrganizationInvitation`: invitation state and secure token metadata.
- `OrganizationMembership`: `PENDING`, `ACTIVE`, `SUSPENDED`, `REMOVED`.

### Commercial aggregates
- `TrialPolicy`: versioned eligibility/duration/entitlement policy.
- `TrialInstance`: organization/project/service enrollment and lifecycle.
- `Entitlement`: time-bounded capability granted by trial, payment, or subscription.
- `AgreementAcceptance`: immutable acceptance snapshot linking actor, organization/project, proposal/version, terms reference, and timestamp.
- `Refund`, `Credit`, and `PaymentEvent`: settlement corrections and provider reconciliation.
- `PolicyVersion`: typed configuration snapshot with owner, effective dates, and audit history.

### Lifecycle events
- `ProjectLifecycleEvent`: immutable transition record with actor, organization, project, previous state, next state, reason, evidence references, correlation ID, and timestamp.
- `ServiceLifecycleEvent`: equivalent record for a project service when its commercial or delivery status changes independently.

### State ownership
Commercial status, delivery stage, project-service status, trial state, entitlement state, membership state, invitation state, and subscription state are separate state machines. No UI component may infer one state machine from another.
