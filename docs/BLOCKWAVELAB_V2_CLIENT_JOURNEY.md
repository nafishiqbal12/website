# BlockWaveLab V2 Client Journey

## Primary Journey

```text
Visitor
 -> Public pillars and resources
 -> Select one or more services
 -> Contact or onboarding entry
 -> Account creation / invitation
 -> Email verification
 -> Organization creation or join
 -> Project creation
 -> Service selection
 -> Dynamic onboarding
 -> Requirements and scope
 -> Proposal version
 -> Client review and approval
 -> Payment confirmation
 -> Project activation
 -> Implementation
 -> Deployment
 -> Observation
 -> Stabilization
 -> Documentation
 -> Handover
 -> Optional ongoing service
 -> Monitoring / operations / support
 -> Renew, upgrade, pause, cancel, or add services
```

Observation is a paid implementation stage. It is never free support or free monitoring.

## Entry Journeys

### Authentication flow
1. User submits signup/sign-in through the planned provider boundary.
2. Provider establishes a PKCE session and returns authenticated state.
3. Unverified accounts are routed to verification-pending UX.
4. Verification completion activates normal organization actions.
5. Password reset uses single-use expiring provider tokens; reset/security changes revoke sessions according to policy.
6. Logout revokes the current session; account recovery never reveals whether another email exists.

### Service-first
Landing page → pillar page → “Discuss”/onboarding → selected pillar prefilled → account/org/project creation.

### Direct-contact
Contact request → internal qualification → operator creates organization/project shell or sends invitation → client completes onboarding.

### Organization invitation
Invite link → account verification/sign-in → accept membership → project access based on assigned role.

Invitation states are `CREATED → PENDING → VIEWED → ACCEPTED`, with terminal `EXPIRED`, `REVOKED`, or `DECLINED` states. Acceptance requires matching intended email or an explicit secure account-linking policy.

### Existing client
Dashboard → organization/project → add service or change request → proposal version → approval/payment → project service activation.

## Pillar Journeys

- BUILD: infrastructure context, environment, deployment, CI/CD, access baseline.
- AUTOMATE: workflow, systems, use case, boundaries, approval requirements.
- OPERATE: existing environment, operational scope, monitoring/support expectations, incident context.
- GROW: product readiness, content/community workflow, demand context, feedback loops.

## Lifecycle Gate Table

| Stage | Client action | Internal action | Exit evidence |
|---|---|---|---|
| Onboarding | provide project/service context | validate completeness | onboarding accepted |
| Scoping | clarify requirements | estimate scope/time/cost | scope baseline |
| Proposal | review version | issue proposal | sent/viewed/changes |
| Approval | approve or request changes | lock approved version | approved snapshot |
| Payment | settle required invoice | reconcile provider event | payment confirmed |
| Implementation | provide access/context | execute approved scope | implementation acceptance |
| Deployment | approve readiness | controlled release | deployment acceptance |
| Observation | review findings | observe/stabilize | findings and plan |
| Stabilization | approve priorities | execute fixes | predictable operation or limitations |
| Documentation | review artifacts | complete package | documentation gate |
| Handover | accept ownership | transfer context | handover acceptance |
| Ongoing service | explicitly continue | operate agreed scope | active service record |

## Edge Journeys

- Proposal expires: read-only history, new version required.
- Proposal rejected: preserve rejection reason; allow revised version.
- Payment fails: no activation until reconciled; retain client-visible proposal/history.
- Service upgrade/addition: new proposal/change request; no silent mutation.
- Pause/cancel: explicit reason/effective date; preserve documents and audit history.
- Missing client information: blocker status, reminders, owner, escalation.
- Deliverable not approved: remains pending with comments and escalation path.
- Multiple organizations: organization switcher changes context; server reauthorizes every request.
- Session expired: preserve safe draft state where possible, require reauthentication, and retry only idempotent reads.
- Verification expired: issue a new verification flow without revealing account existence.
- Suspended membership: show a forbidden state and contact path; do not expose tenant data.
- Owner transfer: pending owner accepts before current owner loses ownership; last-owner removal is blocked.

## UX Requirements
Every major screen has loading, empty, error, unauthorized, forbidden, partial-data, success, and retry states. Approved proposals, payments, lifecycle transitions, and documents show version/history rather than only a mutable current view.
