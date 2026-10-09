# BlockWaveLab V2 Capability Traceability Baseline

| Field | Value |
|---|---|
| Document ID | BWL-TRACE-001 |
| Version | 0.1 |
| Status | DRAFT — TRACEABILITY BASELINE |
| Owner | Accountable owner not yet assigned |
| Review status | Pending requirements and governance review |
| Authority | Traceability reference; does not change requirements |
| Last updated | 2026-10-09 |

## 1. Traceability Method

Future traceability follows:

```text
Business Goal
→ Product Capability
→ Service
→ Requirement
→ Architecture
→ Implementation
→ Test Evidence
→ Release Decision
```

This baseline maps only relationships supported by existing documentation. A
blank, unresolved, deferred, or not-verified field is intentional.

## 2. Capability Traceability

| Trace ID | Business/product capability | Service/pillar | Requirement/source | Architecture reference | Implementation evidence | Test/release evidence | Status |
|---|---|---|---|---|---|---|---|
| TR-001 | Approved four-pillar taxonomy | BUILD/AUTOMATE/OPERATE/GROW | BUS-REQ-001; V2 Spec | Platform Architecture; catalog | Public routes and catalog foundations | Final audit; release checklist | STRUCTURALLY VERIFIED |
| TR-002 | Cloud and delivery foundation | Delivery Infrastructure Foundation / BUILD | DEL-REQ-005; DEL-REQ-007; NFR-REQ-004; SEC-REQ-001; SEC-REQ-002; SEC-REQ-003; SEC-REQ-004 | Platform Architecture; Database Blueprint | Public/service foundations; future delivery scope | BWL-SVC-001-AC-01..05; runtime delivery evidence not complete | DOCUMENTED / RUNTIME-UNVERIFIED |
| TR-003 | CI/CD and release workflow | CI/CD Hardening and Release Workflow / BUILD | DEL-REQ-008; NFR-REQ-001; NFR-REQ-003; NFR-REQ-010; API-REQ-005 | Platform Architecture; API Blueprint | Existing CI/CD/build and provider-boundary foundation | BWL-SVC-002-AC-01..04; production workflow evidence scope-dependent | LOCAL / RUNTIME-UNVERIFIED |
| TR-004 | Governed workflow automation | Automation Workflow Foundation / AUTOMATE | AI-REQ-001; AI-REQ-002; AI-REQ-003; SEC-REQ-001; SEC-REQ-002; AUD-REQ-002 | Platform Architecture agents boundary; Authorization Model | No current AI runtime claimed | BWL-SVC-003-AC-01..04; runtime/provider evidence absent | PLANNED / PROPOSED / DEFERRED |
| TR-005 | Managed release operations | Managed Release Operations / OPERATE | DEL-REQ-007; DEL-REQ-008; DEL-REQ-009; DEL-REQ-010; DEL-REQ-011; DEL-REQ-012; AUD-REQ-001; AUD-REQ-002; NFR-REQ-005 | Platform Architecture operations/support; Release Checklist | Foundations and future boundaries | BWL-SVC-004-AC-01..04; operational evidence incomplete | DOCUMENTED / OWNER DECISION / RUNTIME-UNVERIFIED |
| TR-006 | Technical readiness and trust | Technical Readiness and Trust Systems / GROW | BUS-REQ-001; API-REQ-009; NFR-REQ-006; SEC-REQ-004; AUD-REQ-002 | Platform Architecture GROW journey; Authorization Model | Public positioning/content foundations | BWL-SVC-005-AC-01..04; service acceptance evidence absent | DOCUMENTED / PROPOSED / RUNTIME-UNVERIFIED |
| TR-007 | Organization tenant boundary | All services | ORG-REQ-001; ORG-REQ-004 | Authorization Model; Domain Model | Organization/membership migrations and helpers | Authenticated runtime tests deferred | STRUCTURALLY VERIFIED / NOT VERIFIED |
| TR-008 | Project delivery container | All services | PROJ-REQ-001; PROJ-REQ-004 | Domain Model; Database Blueprint | Project foundations | Cross-tenant runtime tests deferred | STRUCTURALLY VERIFIED / NOT VERIFIED |
| TR-009 | Catalog and project-service selection | All services | CAT-REQ-001; CAT-REQ-002; CAT-REQ-003; CAT-REQ-004; CAT-REQ-005; CAT-REQ-006 | Catalog/database blueprint | Catalog migrations and trusted selection boundary | Authenticated catalog/selection tests deferred | STRUCTURALLY VERIFIED / NOT VERIFIED |
| TR-010 | Proposal/agreement history | Commercially selected services | COM-REQ-001; COM-REQ-002; COM-REQ-003; COM-REQ-004; COM-REQ-005; COM-REQ-006; COM-REQ-007; COM-REQ-008; COM-REQ-009; COM-REQ-010 | Commercial foundation; Domain Model | Proposal/agreement migrations and UI | Acceptance and cross-tenant runtime tests deferred | STRUCTURALLY VERIFIED / NOT VERIFIED |
| TR-011 | Payment/provider boundary | Commercially selected services | PAY-REQ-009; PAY-REQ-010; SET-REQ-001; SET-REQ-002; SET-REQ-003; SET-REQ-004; SET-REQ-005 | Payment Foundation; API Blueprint | Adapter, settlement structures, webhook materials | Live provider/replay tests not verified | STRUCTURALLY VERIFIED / NOT VERIFIED |
| TR-012 | Entitlement and delivery separation | Services after approved commercial gate | ENT-REQ-001; ENT-REQ-002; ENT-REQ-003; ENT-REQ-004; DEL-REQ-001; DEL-REQ-002; DEL-REQ-003; DEL-REQ-004 | Domain Model; lifecycle migrations | Foundation documented/implemented in later phase | Authenticated lifecycle tests deferred | LOCAL / NOT VERIFIED |
| TR-013 | Documentation and handover | All delivered services | DEL-REQ-013; DEL-REQ-014; DEL-REQ-015; DEL-REQ-016 | Client Journey; Platform Architecture | Documentation requirements documented | Handover acceptance evidence absent | DOCUMENTED / NOT VERIFIED |

## 3. Requirement Evidence Rules

- Existing SRS requirement IDs remain authoritative for detailed requirements.
- This document does not create replacement requirement IDs.
- `STRUCTURALLY VERIFIED` means repository/static evidence only.
- `REMOTE VERIFIED` requires explicit linked-environment evidence.
- `RUNTIME VERIFIED` requires an executed configured test.
- A service mapping cannot resolve the ten-versus-five catalog conflict.
- No trace row implies production readiness.

## 4. Traceability Gaps

- Complete five-versus-ten service catalog mapping is unresolved.
- Geographic and jurisdictional requirements are absent.
- Named ownership and approval evidence are absent.
- Acceptance, accounting, tax, refund, dispute, and recurring-billing
  requirements are unresolved or externally dependent.
- Runtime evidence for authentication, tenant isolation, provider settlement,
  entitlement, delivery activation, and operations is incomplete.
- Service-level acceptance criteria are now defined, but criteria marked
  `PROPOSED`, `OWNER APPROVAL REQUIRED`, or `RUNTIME-UNVERIFIED` cannot be
  treated as passed.
- Delivery Infrastructure Foundation and CI/CD Hardening require approved
  service-level environment/release evidence beyond the existing broad SRS
  requirements.
- Automation and Technical Readiness require owner-approved boundaries before
  provider, agent, publication, or outcome claims can be baselined.

Requirement mappings in this table list individual SRS identifiers. IDs are
grouped in a row only when they support the same capability trace; the
service-specific acceptance matrix remains the more detailed relationship
record. No grouped shorthand is used as a substitute for an unavailable
requirement. TR-013 uses DEL-REQ-013 and DEL-REQ-014 for documentation
creation and completion prerequisites, and DEL-REQ-015 and DEL-REQ-016 for
handover initialization and its separate transition boundary. DEL-REQ-017 and
DEL-REQ-018 are intentionally not mapped to TR-013 because they govern the
separate optional ongoing-service and billing capability after handover.
