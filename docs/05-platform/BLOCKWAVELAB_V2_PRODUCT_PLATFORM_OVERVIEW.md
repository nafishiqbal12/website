# BlockWaveLab V2 Product & Platform Overview

| Field | Value |
|---|---|
| Document ID | BWL-PLATFORM-001 |
| Version | 0.1 |
| Status | DRAFT — DOCUMENTED PLATFORM OVERVIEW |
| Owner | Accountable owner not yet assigned |
| Review status | Pending architecture and security review |
| Authority | Platform reference; not an implementation or release approval |
| Last updated | 2026-10-09 |

## 1. Purpose

This document explains the intended role of the BlockWaveLab V2 product and
platform using the existing architecture, domain, authorization, database, SRS,
and release documents.

## 2. Platform Layers

```text
Public website
  → identity and tenancy
  → projects and catalog
  → commercial records
  → payment/provider boundary
  → entitlement and delivery
  → operations, support, monitoring, and future automation
```

The layers are documented architecture and implementation boundaries. Their
complete runtime operation is not verified.

## 3. Product Surfaces

### Public website — LOCAL / STRUCTURALLY VERIFIED

The Vite/React public SPA presents the approved four pillars, service context,
blog/case-study resources, route-driven SEO, and lifecycle-oriented calls to
action. It is not proof that authenticated delivery or payment flows operate.

### Authentication and organizations — LOCAL / RUNTIME NOT VERIFIED

Authentication establishes user identity. Organizations are the customer and
tenant boundary. Membership and role context are used for authorization.
Client-selected organization context is never sufficient authorization evidence.

### Projects and service catalog — STRUCTURALLY VERIFIED

Projects are delivery containers. Catalog records represent pillars, services,
offerings, and project-service selection. Selection is not payment, entitlement,
subscription, or delivery activation.

### Proposals and agreements — STRUCTURALLY VERIFIED / RUNTIME NOT VERIFIED

Proposal and agreement records use versioned snapshots, immutable historical
content, authenticated acceptance boundaries, expected-state checks, and audit
records. Legal enforceability is not claimed.

### Payments and settlements — STRUCTURALLY VERIFIED / PROVIDER RUNTIME NOT VERIFIED

The architecture separates payment obligations, attempts, settlement, refunds,
credits, disputes, entitlements, and delivery. Provider/webhook boundaries are
documented; live provider execution and replay evidence remain unverified.

### Entitlements and delivery — LOCAL / RUNTIME NOT VERIFIED

Entitlements are intended to be scoped, source-linked, server-controlled, and
audited. Delivery activation is a separate explicit gate before implementation.

### Internal operations — PLANNED / SCOPE-DEPENDENT

Internal operations are intended to manage organizations, proposals,
commercials, delivery, support, monitoring, approvals, notifications, and
audit. Exact staffing, role assignment, operational coverage, and production
readiness are unresolved.

### Automation and future AI agents — PLANNED / DEFERRED

Future agents may operate only within explicit tools, permissions, project
boundaries, human approvals, and audit records. No current AI runtime should be
inferred from marketing or architecture documents.

## 4. Architecture Principles

- Modular monolith first; microservices only with documented justification.
- Public content separate from authenticated data and authorization.
- Tenant ownership enforced through persisted organization/project relationships.
- Sensitive changes use trusted server/database boundaries.
- RLS, fixed search paths, restricted grants, and append-only audit evidence.
- Immutable commercial snapshots and forward-only migrations.
- Provider adapters isolate external payment or future AI providers.
- Browser clients never receive provider secrets or service-role credentials.

## 5. Security Boundaries

- Organization/project access is server-authorized.
- Direct client writes to sensitive commercial/payment/entitlement/delivery
  domains are denied or constrained through trusted boundaries.
- Webhooks verify raw payload signatures and fail closed on missing secrets.
- Browser redirects cannot mark payment successful.
- Invitations, recovery, and errors must not disclose protected tenant data.
- Negative, cross-tenant, replay, and runtime tests are required before release.

## 6. Data and Lifecycle Boundaries

The domain model separates:

```text
Organization
→ Project
→ Catalog/service selection
→ Proposal/agreement
→ Payment obligation/settlement
→ Entitlement
→ Delivery activation
→ Implementation/deployment/observation/stabilization/handover
```

No single status field should represent all commercial and delivery facts.

## 7. Current Evidence and Future Scope

| Area | Evidence status |
|---|---|
| Public website and four-pillar taxonomy | LOCAL / STRUCTURALLY VERIFIED |
| Authenticated platform foundations | LOCAL / RUNTIME NOT VERIFIED |
| Commercial and payment foundations | STRUCTURALLY VERIFIED / RUNTIME NOT VERIFIED |
| Remote deployment and provider state | NOT VERIFIED consistently across documents |
| Support, monitoring, operations, richer onboarding, and AI runtime | PLANNED / DEFERRED |
| Production readiness | BLOCKED |

This overview must not be used as a claim that the full platform is deployed,
configured, or production-ready.
