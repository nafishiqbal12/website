# BlockWaveLab v2 Migration Map

## Scope and Method
- Phase: Specification and migration planning only
- No application source code changes in this phase
- Classification model: KEEP, REFACTOR, REBUILD, REMOVE
- Decision rule: Preserve reusable technical foundations; replace retired business logic

## Verified Pre-Implementation Technical Issues

### Blocker 1: Build Script Recursion (Verified)
- File: package.json
- Current script: `"build": "npm run build"`
- Impact: Recursive build command that can loop/fail CI/CD and production deployment
- Verification source: package.json currently differs from prior successful build chain recorded in build-output.txt
- Required action before feature implementation: Fix build script to call explicit build pipeline (not changed in this phase)

### Blocker 2: Sitemap Quality and Consistency
- Files: sitemap.xml, public/sitemap.xml, scripts/generate-sitemap.mjs
- Impact: Duplicate sitemap sources and malformed route output risk SEO correctness
- Required action before launch-quality v2 SEO: Consolidate to one generated canonical sitemap source

### Blocker 3: API Runtime Ambiguity
- Files: src/api/leads/capture.ts, netlify.toml
- Impact: API handler pattern is template/mixed style and not clearly wired as production Netlify function endpoint
- Required action: Define and standardize serverless API contract before v2 lifecycle/billing work starts

---

## Classification Matrix (Important Existing Files and Modules)

## A. Root and Build System

| File or Module | Classification | Why | v2 Target Role |
|---|---|---|---|
| package.json | REFACTOR | Core project manifest is reusable but scripts/deps need alignment to v2 and build blocker must be fixed | Stable build/lint/typecheck and v2 runtime dependency baseline |
| package-lock.json | REFACTOR | Must stay in sync with package.json changes | Deterministic installs |
| vite.config.ts | REFACTOR | Vite+React+MDX pipeline is useful; settings need cleanup for v2 content/routing | Primary frontend bundler config |
| tsconfig.json | KEEP | Technically reusable TypeScript foundation with no business conflict | Shared TS compiler baseline |
| tsconfig.app.json | KEEP | Reusable app-level TS config | App compilation contract |
| tsconfig.node.json | KEEP | Reusable Node/tooling TS config | Scripts/tooling compilation support |
| eslint.config.js | KEEP | Reusable code quality guardrails | Linting baseline for refactor/rebuild work |
| postcss.config.js | KEEP | Standard CSS processing setup | Tailwind/PostCSS pipeline base |
| tailwind.config.js | REFACTOR | Useful framework but theme tokens tied to previous identity | v2 design token and utility baseline |
| index.html | REBUILD | Business metadata and static schema reflect retired positioning | New v2 metadata/bootstrap shell |
| netlify.toml | REFACTOR | Deploy foundation is useful but needs security headers/functions/env conventions | v2 deployment policy and routing baseline |
| .github/workflows/webpack.yml | REFACTOR | CI pipeline useful but must match corrected build commands and checks | v2 CI validation pipeline |

## B. Public Static and SEO Artifacts

| File or Module | Classification | Why | v2 Target Role |
|---|---|---|---|
| public/_redirects | KEEP | SPA fallback routing is valid and reusable | Runtime route fallback |
| public/robots.txt | REFACTOR | Technically valid baseline but content must match v2 sitemap and policy | v2 crawl policy |
| public/sitemap.xml | REBUILD | Contains legacy route taxonomy and quality issues | Generated v2 sitemap |
| sitemap.xml | REMOVE | Duplicate root sitemap conflicts with public canonical sitemap process | Remove duplicate source to avoid SEO drift |
| public/google3f437b20b9da007e.html | KEEP | Reusable verification artifact if still required | Search console verification |
| google3f437b20b9da007e (1).html | REMOVE | Duplicate verification source causing sync ambiguity | Eliminate duplicate verification file |
| public/og/static/* | REFACTOR | OG infra reusable, but imagery and labels are legacy-positioned | v2 OG brand assets |
| public/*.png, public/*.svg partner logos | REFACTOR | Asset pipeline reusable; many assets reflect old campaigns/services | Curated v2 proof and partner visuals |

## C. Scripts

| File or Module | Classification | Why | v2 Target Role |
|---|---|---|---|
| scripts/generate-sitemap.mjs | REFACTOR | Useful automation but route/source mapping must be rebuilt for v2 IA | Canonical sitemap generation |
| scripts/generate-og.mjs | REFACTOR | OG generation pipeline is reusable; prompts/content taxonomy are legacy | v2 OG image pipeline |
| scripts/sync-google-verification.mjs | REFACTOR | Useful utility but currently tolerates duplicate file sources | Deterministic verification sync |

## D. App Shell and Global UI

| File or Module | Classification | Why | v2 Target Role |
|---|---|---|---|
| src/main.tsx | KEEP | Standard React bootstrap with Helmet provider; no business lock-in | v2 app bootstrap |
| src/App.tsx | KEEP | Thin app shell that delegates to router is reusable | Root app composition |
| src/index.css | REFACTOR | Global styling system reusable but visual direction is legacy | v2 global design system surface |
| src/types.ts | REFACTOR | Generic interfaces can be adapted; current entities are old-service centric | Shared v2 UI/domain types |
| src/vite-env.d.ts | KEEP | Environment typing scaffold is reusable | TS env typing support |

## E. Routing and SEO Runtime

| File or Module | Classification | Why | v2 Target Role |
|---|---|---|---|
| src/routes/router.tsx | REBUILD | Current route rendering and metadata logic are deeply tied to retired pages/services | v2 route orchestration and page composition |
| src/routes/routeConfig.ts | REBUILD | Path map and aliases encode old service architecture | v2 information architecture and route map |
| src/routes/seoConfig.ts | REBUILD | Titles/keywords/descriptions are legacy business narrative | v2 positioning-based SEO mapping |

## F. Core Reusable Components

| File or Module | Classification | Why | v2 Target Role |
|---|---|---|---|
| src/components/Navigation.tsx | REFACTOR | Component is reusable structurally; nav items and messaging are legacy | v2 primary navigation |
| src/components/Footer.tsx | REFACTOR | Reusable shell; links/tagline/contact emphasis must change | v2 footer with lifecycle/support links |

## G. Legacy or Obsolete UI Components

| File or Module | Classification | Why | v2 Target Role |
|---|---|---|---|
| src/components/Navbar.tsx | REMOVE | Obsolete alternate nav with unrelated wallet-centric copy and unused runtime role | No v2 role |
| src/components/Hero.tsx | REMOVE | Legacy standalone hero not used by active route architecture and old narrative | No v2 role |
| src/components/PartnersGrid.tsx | REMOVE | Unused component with stale asset paths and old partner framing | No v2 role |
| src/components/ExchangeMarquee.tsx | REMOVE | Old exchange-listing focus conflicts with v2 core positioning | No v2 role |
| src/components/TrustComponents.tsx | REMOVE | Old trust/testimonial system tied to retired service framing | Replace with v2 proof system later |
| src/components/LeadGenComponents.tsx | REMOVE | Legacy lead form assumptions, old fields, and non-v2 qualification model | Replace with v2 lifecycle intake UX |
| src/components/EmailCaptureComponents.tsx | REMOVE | Legacy marketing funnel CTA library does not match v2 lifecycle and service model | No direct v2 role |
| src/components/PopupManager.tsx | REMOVE | Aggressive legacy popup logic misaligned with v2 enterprise positioning | No direct v2 role |
| src/components/ServiceTemplate.tsx | REBUILD | Template concept useful but embedded old problem statements/services | v2 pillar page template |
| src/components/CaseStudyComponents.tsx | REFACTOR | Technically valuable case-study UI system; content model needs v2 operations framing | v2 case-study presentation layer |

## H. Pages

| File or Module | Classification | Why | v2 Target Role |
|---|---|---|---|
| src/pages/Home.tsx | REBUILD | Core page purpose remains but narrative and sections are legacy | v2 homepage for Build/Automate/Operate/Grow |
| src/pages/About.tsx | REBUILD | Purpose remains; business story must be replaced | v2 company/operating model page |
| src/pages/Services.tsx | REBUILD | Purpose remains but service taxonomy is retired | v2 four-pillar overview page |
| src/pages/Contact.tsx | REBUILD | Purpose remains but intake model and fields are legacy and non-lifecycle | v2 qualification and lifecycle entry page |
| src/pages/Blog.tsx | REFACTOR | Blog listing infrastructure is reusable | v2 blog index with new editorial positioning |
| src/pages/BlogPost.tsx | REFACTOR | Blog rendering shell is reusable | v2 article detail presentation |
| src/pages/BlogTag.tsx | REFACTOR | Tag routing UI is reusable | v2 taxonomy/tag discovery |
| src/pages/CaseStudies.tsx | REBUILD | Purpose remains but static entries are old campaign examples | v2 case studies index by delivery outcomes |
| src/pages/CaseStudyPage.tsx | REFACTOR | Detail renderer reusable with model changes | v2 case study detail page |
| src/pages/CaseStudyDetail.tsx | REMOVE | Demo/sample page not required in production IA | No v2 role |
| src/pages/CaseStudyLendingDAO.tsx | REMOVE | Demo/extended sample page not required in production IA | No v2 role |
| src/pages/AiBlockchainMarketing.tsx | REMOVE | Legacy service page naming/taxonomy conflicts with fixed four-category model | Service content moves to new pillar structure |
| src/pages/BlockchainMarketingAgency.tsx | REMOVE | Retired marketing-agency positioning | No v2 primary service role |
| src/pages/BlockchainPRServices.tsx | REMOVE | Retired PR-first service as primary offering | No v2 primary service role |
| src/pages/BlockchainSEO.tsx | REMOVE | Old standalone crypto SEO service page taxonomy | SEO becomes cross-site strategy, not primary page family |
| src/pages/CryptoCommunityManagement.tsx | REMOVE | Old standalone crypto-marketing service taxonomy | Merged under GROW category in rebuilt pages |
| src/pages/CryptoInfluencerMarketing.tsx | REMOVE | Retired influencer-first standalone service model | No v2 primary service role |
| src/pages/CryptoKolMarketing.tsx | REMOVE | KOL-specific retired primary service | No v2 primary service role |
| src/pages/CryptoMarketingAgency.tsx | REMOVE | Retired agency positioning | No v2 role |
| src/pages/CryptoPRMarketing.tsx | REMOVE | Retired PR-first standalone service | No v2 primary role |
| src/pages/CryptoPaidAds.tsx | REMOVE | Legacy paid-ads service framing not in fixed v2 taxonomy | No v2 primary role |
| src/pages/TelegramCommunityGrowth.tsx | REMOVE | Legacy channel-specific service page from retired model | Folded into GROW messaging where relevant |
| src/pages/TokenLaunchMarketing.tsx | REMOVE | Retired token-launch primary service page | No v2 primary role |
| src/pages/Web3GrowthMarketing.tsx | REMOVE | Legacy marketing-specific standalone page taxonomy | No v2 primary role |
| src/pages/Web3InfluencerMarketing.tsx | REMOVE | Retired influencer-first standalone model | No v2 primary role |

## I. API and Lead/CRM Layer

| File or Module | Classification | Why | v2 Target Role |
|---|---|---|---|
| src/api/leads/capture.ts | REBUILD | Endpoint purpose remains (intake), but implementation is template-grade and legacy CRM assumptions dominate | v2 lifecycle intake and qualification API |
| src/lib/leadGen/config.ts | REMOVE | Legacy client-side CRM integration and popup segmentation are not suitable for v2 lifecycle architecture | No v2 role; replace with server-side controlled intake stack |
| src/lib/leadGen/*.md | REMOVE | Legacy playbooks tied to retired funnel model | No v2 role |

## J. Blog, Case Study, and Content Infrastructure

| File or Module | Classification | Why | v2 Target Role |
|---|---|---|---|
| src/lib/blog.ts | KEEP | Solid MDX loader and post resolver with minimal business coupling | v2 blog content loader |
| src/content/blog/*.mdx | REBUILD | Technical content format reusable, but topics are legacy | v2 editorial content aligned with new positioning |
| src/lib/caseStudies.ts | REFACTOR | Useful MDX case-study loader and related-item utilities; mapping logic needs new taxonomy | v2 case-study data access layer |
| src/content/case-studies/*.mdx | REBUILD | File format reusable; narrative and KPIs need v2 lifecycle orientation | v2 operational case studies |
| src/lib/caseStudies/examples.ts | REMOVE | Demo dataset from old storyline; not production content source | No v2 role |
| src/lib/caseStudies/CASE_STUDY_TEMPLATE.md | REFACTOR | Useful authoring template but must be rewritten for v2 outcomes model | v2 case-study authoring guide |

## K. SEO Utilities

| File or Module | Classification | Why | v2 Target Role |
|---|---|---|---|
| src/lib/seo/SEO.tsx | REFACTOR | Useful shared SEO component; defaults/content are legacy | v2 reusable SEO component |
| src/lib/seo/schema.ts | REFACTOR | Useful structured-data generation base; service schema content is legacy | v2 structured data helpers |
| src/assets/og/routes.js | REFACTOR | Useful OG route resolution infrastructure; route map and labels are legacy | v2 OG resolver for new IA |
| src/assets/og/template.js | REFACTOR | Useful OG rendering utility; visual content needs v2 brand language | v2 OG template renderer |
| src/assets/og/*.d.ts | KEEP | Useful typing for OG utilities | Type safety for OG generation |

## L. Documentation and Generated Artifacts

| File or Module | Classification | Why | v2 Target Role |
|---|---|---|---|
| README.md | REFACTOR | Needs update for v2 architecture and run/deploy docs | Primary project documentation |
| PRODUCTION_AUDIT_REPORT.md | REFACTOR | Useful historical reference; must be superseded with v2 readiness criteria | Historical audit archive or updated checklist |
| SEO_ACCESSIBILITY_AUDIT.md | REFACTOR | Useful reference, but business framing outdated | v2 SEO/a11y checklist reference |
| SEO_ACCESSIBILITY_SUMMARY.md | REFACTOR | Useful reference, content outdated | v2 summary checklist |
| IMPLEMENTATION_COMPLETE.md | REMOVE | Milestone file for prior model; no durable v2 operational role | No v2 role |
| CASE_STUDY_DEPLOYMENT_SUMMARY.md | REMOVE | Legacy case-study subsystem summary with old assumptions | No v2 role |
| CASE_STUDY_COMPONENTS_GUIDE.md | REFACTOR | Useful component guide if rewritten to v2 case-study model | v2 case-study component docs |
| TAILWIND_BEST_PRACTICES.md | KEEP | Generic styling guidance remains useful | Engineering style reference |
| build-output.txt | REFACTOR | Useful evidence artifact for blockers and regression checks | Temporary migration verification evidence |
| typecheck-output.txt | REFACTOR | Useful evidence artifact for baseline health | Temporary migration verification evidence |

---

## Consolidated Deliverables for Phase 2 Planning

## 1) Files that will remain (KEEP)
- tsconfig.json
- tsconfig.app.json
- tsconfig.node.json
- eslint.config.js
- postcss.config.js
- public/_redirects
- public/google3f437b20b9da007e.html
- src/main.tsx
- src/App.tsx
- src/vite-env.d.ts
- src/lib/blog.ts
- src/assets/og/routes.d.ts
- src/assets/og/template.d.ts
- TAILWIND_BEST_PRACTICES.md

## 2) Files that will be refactored (REFACTOR)
- package.json
- package-lock.json
- vite.config.ts
- tailwind.config.js
- netlify.toml
- .github/workflows/webpack.yml
- public/robots.txt
- scripts/generate-sitemap.mjs
- scripts/generate-og.mjs
- scripts/sync-google-verification.mjs
- src/index.css
- src/types.ts
- src/components/Navigation.tsx
- src/components/Footer.tsx
- src/components/CaseStudyComponents.tsx
- src/pages/Blog.tsx
- src/pages/BlogPost.tsx
- src/pages/BlogTag.tsx
- src/pages/CaseStudyPage.tsx
- src/lib/caseStudies.ts
- src/lib/seo/SEO.tsx
- src/lib/seo/schema.ts
- src/assets/og/routes.js
- src/assets/og/template.js
- README.md
- PRODUCTION_AUDIT_REPORT.md
- SEO_ACCESSIBILITY_AUDIT.md
- SEO_ACCESSIBILITY_SUMMARY.md
- CASE_STUDY_COMPONENTS_GUIDE.md
- build-output.txt
- typecheck-output.txt

## 3) Files that will eventually be rebuilt (REBUILD)
- index.html
- public/sitemap.xml
- src/routes/router.tsx
- src/routes/routeConfig.ts
- src/routes/seoConfig.ts
- src/pages/Home.tsx
- src/pages/About.tsx
- src/pages/Services.tsx
- src/pages/Contact.tsx
- src/pages/CaseStudies.tsx
- src/api/leads/capture.ts
- src/content/blog/*.mdx
- src/content/case-studies/*.mdx

## 4) Files that will eventually be removed (REMOVE)
- sitemap.xml
- google3f437b20b9da007e (1).html
- src/components/Navbar.tsx
- src/components/Hero.tsx
- src/components/PartnersGrid.tsx
- src/components/ExchangeMarquee.tsx
- src/components/TrustComponents.tsx
- src/components/LeadGenComponents.tsx
- src/components/EmailCaptureComponents.tsx
- src/components/PopupManager.tsx
- src/pages/CaseStudyDetail.tsx
- src/pages/CaseStudyLendingDAO.tsx
- src/pages/AiBlockchainMarketing.tsx
- src/pages/BlockchainMarketingAgency.tsx
- src/pages/BlockchainPRServices.tsx
- src/pages/BlockchainSEO.tsx
- src/pages/CryptoCommunityManagement.tsx
- src/pages/CryptoInfluencerMarketing.tsx
- src/pages/CryptoKolMarketing.tsx
- src/pages/CryptoMarketingAgency.tsx
- src/pages/CryptoPRMarketing.tsx
- src/pages/CryptoPaidAds.tsx
- src/pages/TelegramCommunityGrowth.tsx
- src/pages/TokenLaunchMarketing.tsx
- src/pages/Web3GrowthMarketing.tsx
- src/pages/Web3InfluencerMarketing.tsx
- src/lib/leadGen/config.ts
- src/lib/leadGen/*.md
- src/lib/caseStudies/examples.ts
- IMPLEMENTATION_COMPLETE.md
- CASE_STUDY_DEPLOYMENT_SUMMARY.md

## 5) Reusable infrastructure
- Vite + React + TypeScript baseline
- MDX content pipeline
- SEO component framework (after refactor)
- OG generation pipeline (after refactor)
- Sitemap generation automation (after refactor)
- SPA deployment and redirect baseline

## 6) Business logic to replace
- Retired crypto-marketing agency positioning
- KOL/PR/token-launch as primary service architecture
- Legacy popup-heavy lead funnel and client-side CRM assumptions
- Legacy service-route taxonomy and associated SEO keyword strategy

## 7) Technical blockers
- Build script recursion in package.json (verified)
- Sitemap duplication/quality inconsistency
- Ambiguous production API/serverless integration pattern

## 8) Migration order
1. Resolve build blocker and CI command alignment
2. Freeze v2 specification and migration map approvals
3. Refactor shared infra (SEO utilities, scripts, styling tokens, docs)
4. Rebuild route and page architecture to four-pillar model
5. Rebuild intake/lifecycle API contracts
6. Rebuild business content for blog and case studies
7. Finalize SEO/sitemap/OG with v2 positioning
8. Validate accessibility, security, and release readiness

## 9) Risks
- Drift risk if old and new route/content systems coexist too long
- SEO volatility during metadata and URL taxonomy transition
- Hidden coupling from legacy components not yet removed
- Conversion risk if lifecycle intake is not rebuilt early
- Delivery risk if build blocker persists into implementation phase
