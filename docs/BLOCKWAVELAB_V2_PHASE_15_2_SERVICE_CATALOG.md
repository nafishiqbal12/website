# BlockWaveLab V2 Phase 15.2A

## Service Catalog Content Planning

## Status

Phase 15.2 content implementation is complete for the approved grouped catalog. The schema was reused without modification, one forward-only content migration was created, and no pricing or later commercial functionality was added.

Phase 15.1 provides the deployed catalog structure and exactly four active pillars. Phase 15.2 seeds ten approved grouped services and ten unpriced offerings using the existing tables.

## Business Model Guardrails

BlockWaveLab is:

> AI Automation + DevOps Partner for Web3 Projects

The catalog has exactly four pillars:

1. BUILD
2. AUTOMATE
3. OPERATE
4. GROW

No fifth pillar, legacy crypto-marketing category, generic marketing-agency package, employee-replacement claim, forced subscription, unsupported AI promise, or free observation/support offer is approved by this document.

Observation remains a paid implementation stage. Optional ongoing service is separately purchased and separately paid.

## 1. Existing Approved Service Concepts

The existing architecture defines capability families, not finalized sellable service names. The following concepts are explicitly supported by the current documentation and may be used as the source vocabulary for final catalog approval.

### BUILD

Source wording includes:

- cloud/environment design
- DevOps and cloud infrastructure
- environments, providers, repositories, deployment, CI/CD, infrastructure needs
- CI/CD pipeline design and hardening
- containerization and deployment workflows
- infrastructure reliability baselines
- security and access baseline setup

Purpose: help Web3 projects establish, harden, and operate the technical foundation required to implement and deploy software safely.

### AUTOMATE

Source wording includes:

- AI-assisted delivery/operations workflows
- AI agents and workflow automation
- agent task orchestration
- reporting, triage, and routine flow automation
- workflows, systems, use cases, APIs, and approval boundaries
- human-in-the-loop checkpoints for high-impact actions
- prompt and policy versioning for controlled automation

Purpose: reduce repetitive delivery and operations work through governed automation. AI assists teams and does not replace humans.

### OPERATE

Source wording includes:

- managed releases
- incident/runbook coordination
- reliability operations
- change governance
- ongoing AI operations support
- existing system, monitoring/support scope, incidents, and operational expectations
- optional managed operations after BUILD handover

Purpose: provide explicitly scoped technical operations after an existing system or delivered implementation has an agreed operational boundary.

This wording supports an OPERATE capability family, but the exact sellable service names, operational coverage, response commitments, and provider dependencies still require approval.

### GROW

Source wording includes:

- technical growth systems
- authority/trust content operations
- community enablement
- delivery-aligned demand support
- growth and operations feedback loops
- product readiness, content/community workflow, growth context, and feedback needs

Purpose: support technical product readiness and trust-oriented growth systems connected to delivery and operations.

This wording does not approve the old crypto marketing-agency model, influencer packages, paid ads, token promotion, PR packages, or any other legacy category.

## 2. Service Concepts by Approval Status

### A. Explicitly approved concepts

These are approved as capability families because they appear in the existing architecture:

| Pillar | Explicit concept | Implementation nature | Recurring nature | Approval status |
|---|---|---|---|---|
| BUILD | DevOps and cloud infrastructure | Usually implementation-led | May have optional ongoing OPERATE follow-up | Explicitly supported |
| BUILD | CI/CD pipeline design and hardening | Implementation-led | Optional maintenance only if separately approved | Explicitly supported |
| BUILD | Containerization and deployment workflows | Implementation-led | Optional ongoing operational support | Explicitly supported |
| BUILD | Infrastructure reliability baselines | Implementation-led | May connect to separately purchased OPERATE work | Explicitly supported |
| BUILD | Security and access baseline setup | Implementation-led | Ongoing governance only if separately approved | Explicitly supported |
| AUTOMATE | AI-assisted delivery/operations workflows | Implementation-led | Optional ongoing automation operations | Explicitly supported |
| AUTOMATE | Internal agent task orchestration | Implementation-led | Optional ongoing AI operations | Explicitly supported |
| AUTOMATE | Reporting, triage, and routine flow automation | Implementation or scoped improvement | Optional ongoing support | Explicitly supported |
| AUTOMATE | Human-in-the-loop automation controls | Implementation/control design | Optional policy maintenance | Explicitly supported |
| OPERATE | Managed release and deployment operations | Recurring or scoped operational engagement | Recurring where explicitly purchased | Explicitly supported |
| OPERATE | Incident/runbook coordination | Scoped operational engagement | Recurring where explicitly purchased | Explicitly supported |
| OPERATE | Reliability operations and change governance | Scoped operational engagement | Recurring where explicitly purchased | Explicitly supported |
| GROW | Technical growth systems tied to product and operations readiness | Scoped implementation/advisory work | Recurring only if separately approved | Explicitly supported as a capability family |
| GROW | Technical content operations for authority and trust | Scoped implementation/advisory work | Recurring only if separately approved | Explicitly supported as a capability family |
| GROW | Community enablement and delivery feedback loops | Scoped implementation/advisory work | Recurring only if separately approved | Explicitly supported as a capability family |

These rows are not database seed instructions. They are the approved source vocabulary for product/business review.

### B. Reasonable candidates requiring business approval

The following are concise, operationally plausible catalog names derived from the approved wording, but they must not be seeded without explicit approval:

| Proposed name | Pillar | Purpose | Customer problem solved | High-level scope | Dependencies/cost | Approval |
|---|---|---|---|---|---|---|
| Delivery Infrastructure Foundation | BUILD | Establish a reliable technical baseline | Project lacks a repeatable environment and deployment foundation | Environment review, repository/provider context, baseline infrastructure and access plan | Cloud/provider access; no new SaaS required by default | Requires approval |
| CI/CD Hardening and Release Workflow | BUILD | Make delivery and releases repeatable | Releases are manual, fragile, or difficult to audit | Pipeline review, hardening plan, deployment workflow, rollback/readiness guidance | Existing CI/CD and cloud providers; implementation effort varies | Requires approval |
| Deployment and Container Workflow | BUILD | Standardize packaging and deployment | Teams struggle to move software reliably between environments | Container/deployment workflow design and implementation scope | Existing cloud/container platform; no new SaaS required by default | Requires approval |
| Automation Workflow Foundation | AUTOMATE | Automate repetitive delivery/operations workflows | Manual reporting, triage, and routine work consumes team capacity | Workflow mapping, controlled automation, approval checkpoints | May use existing APIs; no AI provider selected in this phase | Requires approval |
| Governed AI Agent Workflow | AUTOMATE | Apply AI assistance to bounded operational tasks | Teams need assistance without uncontrolled automation | Agent task boundaries, human approval points, policy/prompt versioning | Future model/provider cost must be assessed per scope | Requires approval |
| Managed Release Operations | OPERATE | Operate agreed release workflows after implementation | Client needs reliable ongoing release coordination | Release calendar/process, runbook coordination, operational reporting | Existing client/cloud systems; recurring staffing/operations cost | Requires approval |
| Reliability and Runbook Operations | OPERATE | Maintain agreed operational practices | Incidents and operational knowledge are inconsistent | Runbook coordination, change governance, incident-oriented operations | Monitoring/provider scope must be defined separately | Requires approval |
| Technical Readiness and Trust Systems | GROW | Connect growth work to product and delivery readiness | Growth activity is disconnected from technical/product readiness | Readiness context, authority/trust content workflow, feedback loops | Content/community tooling may vary; no mandatory SaaS | Requires approval |

These candidates intentionally avoid prices, promises, response-time SLAs, platform guarantees, and provider commitments.

### C. Unsupported or invented concepts that must not be added

Do not add these as BlockWaveLab catalog services under this business model:

- token marketing packages
- crypto influencer campaigns
- paid crypto advertising packages
- exchange listing services
- token launch promotion
- generic social media management
- guaranteed user growth or guaranteed fundraising
- employee replacement or autonomous company claims
- unrestricted AI agents or unsupervised production control
- generic SaaS products sold as BlockWaveLab offerings
- monitoring subscriptions without an approved OPERATE scope
- free observation, free support, or “two months free” offers
- mandatory monthly plans for every service
- a fifth category such as MARKETING, CONSULTING, SECURITY, or AI PRODUCTS

## 3. Final Minimal Initial Catalog

The approved initial catalog contains exactly ten services:

1. `Delivery Infrastructure Foundation` under BUILD
2. `CI/CD Hardening and Release Workflow` under BUILD
3. `Automation Workflow Foundation` under AUTOMATE
4. `Managed Release Operations` under OPERATE
5. `Technical Readiness and Trust Systems` under GROW

The ten services group the approved capability lists without creating one database record per bullet. This keeps catalog administration, scope review, and operational delivery manageable.

A selected service may later have one or more offerings. The initial offering configuration should use scope and billing mode only:

- implementation offering: `ONE_TIME`
- optional post-handover operations offering: `RECURRING`
- combined offering only when implementation and ongoing scope are explicitly separated: `ONE_TIME_AND_RECURRING`

No price, currency, tax, discount, margin, payment term, or profitability promise is included.

## 4. Candidate Service Detail

### Delivery Infrastructure Foundation

- **Pillar:** BUILD
- **Purpose:** establish the technical baseline required for reliable Web3 delivery.
- **Customer problem:** unclear environments, access boundaries, or infrastructure ownership.
- **Scope:** environment/provider/repository context, baseline architecture, access/security baseline, implementation plan.
- **Nature:** one-time implementation; optional separate OPERATE follow-up.
- **Dependencies:** client cloud/repository access and technical context.
- **Potential cost:** client cloud usage and implementation labor; no mandatory paid SaaS.
- **Approval:** candidate requiring business approval.

### CI/CD Hardening and Release Workflow

- **Pillar:** BUILD
- **Purpose:** make build, test, deployment, and rollback workflows more reliable.
- **Customer problem:** manual or fragile releases.
- **Scope:** pipeline review, hardening, deployment workflow, readiness and rollback guidance.
- **Nature:** one-time implementation; optional recurring operations only through a separate commitment.
- **Dependencies:** existing CI/CD, repository, and deployment providers.
- **Potential cost:** provider usage may increase; no new paid SaaS required by default.
- **Approval:** candidate requiring business approval.

### Automation Workflow Foundation

- **Pillar:** AUTOMATE
- **Purpose:** reduce repetitive delivery and operations work with bounded automation.
- **Customer problem:** manual reporting, triage, and routine workflow overhead.
- **Scope:** workflow mapping, automation boundaries, approval checkpoints, controlled implementation.
- **Nature:** one-time implementation; optional recurring support.
- **Dependencies:** client systems/APIs; provider choices must be scoped later.
- **Potential cost:** API/model usage may apply later; no provider is selected here.
- **Approval:** candidate requiring business approval.

### Managed Release Operations

- **Pillar:** OPERATE
- **Purpose:** coordinate agreed release and deployment operations after implementation.
- **Customer problem:** teams need dependable release execution and operational continuity.
- **Scope:** release coordination, runbook execution, change governance, operational reporting.
- **Nature:** recurring where explicitly purchased; may follow BUILD.
- **Dependencies:** client systems, access, deployment workflows, and agreed operational scope.
- **Potential cost:** recurring operations labor and existing provider usage.
- **Approval:** candidate requiring business approval.

### Technical Readiness and Trust Systems

- **Pillar:** GROW
- **Purpose:** connect technical/product readiness with authority, trust, content, and feedback systems.
- **Customer problem:** growth work is disconnected from product and delivery readiness.
- **Scope:** readiness context, technical trust/content workflow, community/delivery feedback loops.
- **Nature:** scoped implementation/advisory work; recurring only if separately approved.
- **Dependencies:** client product context and content/community workflow; no mandatory SaaS.
- **Potential cost:** content/community tooling may be client-selected; no provider commitment here.
- **Approval:** candidate requiring business approval.

## 5. Cost and Operational Implications

- Keep service count small; do not seed every capability family as a separate SKU.
- Reuse the deployed catalog tables and RLS; no schema expansion is needed for content approval.
- Do not add pricing columns or pricing rules until pricing ownership, currency, tax, discounts, margins, and approval authority are defined.
- Do not select an AI model provider, monitoring provider, cloud provider, content platform, or community SaaS in the catalog.
- Treat provider/API usage as a future offering dependency and record it in scope documentation rather than promising a fixed cost.
- Separate implementation labor from optional recurring operations in offerings.
- Avoid offering a recurring mode for every service by default.
- Require operational owner, scope template, dependencies, and completion criteria before activating any service record.

## 6. Unresolved Business Decisions

These block catalog seeding but not this planning document:

1. Which candidate service names and descriptions are approved for public/client-facing catalog use?
2. Should `GROW` be client-selectable in the first catalog release, or remain a reviewed capability family until delivery scope is clearer?
3. Which OPERATE activities require a defined monitoring/support boundary before they can be offered?
4. Which AUTOMATE work requires an approved model/provider and what usage limits apply?
5. Which offerings are one-time, recurring, or both?
6. Who owns catalog administration and service activation internally?
7. What scope evidence and acceptance criteria are required before a service can be marked active?
8. What profitability/cost model will later determine offering viability without exposing internal pricing rules to clients?

## 7. Explicitly Not Implemented

No schema changes were made. The content migration only inserts catalog services and offerings. Pricing, proposals, agreements, payments, subscriptions, invoices, entitlements, delivery lifecycle, observation lifecycle, AI integrations, and UI changes were not implemented.

## 8. Final Confirmation

- Exactly four pillars remain.
- No old marketing-agency business model was reintroduced.
- The ten grouped services are represented as approved Phase 15.2 catalog content.
- No prices or commercial promises were invented.
- No new application code or database schema was added. The content migration was deployed through the approved migration workflow.

**Phase 15.2 status: COMPLETE WITH DEFERRED COMMERCIAL ITEMS.**
