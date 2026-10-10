import { useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  Code2,
  CreditCard,
  HelpCircle,
  Menu,
  Network,
  Search,
  Settings2,
  ShieldCheck,
  X,
  type LucideIcon,
} from 'lucide-react';
import { PageShell } from '../components/shells';
import { Badge, Button, Card, Container } from '../components/ui';

interface DocsPageProps {
  path: string;
  onNavigate: (target: string) => void;
}

type PillarKey = 'BUILD' | 'AUTOMATE' | 'OPERATE' | 'GROW';

type ServiceDoc = {
  name: string;
  slug: string;
  pillar: PillarKey;
  summary: string;
  boundary: string;
  readinessLabel: string;
  details: ServiceDetails;
};

type ServiceDetails = {
  audience: string;
  problem: string;
  workflow: string[];
  inputs: string[];
  deliverables: string[];
  exclusions: string[];
  dependencies: string[];
  acceptance: string[];
  handover: string;
  nextSteps: string[];
};

type ServiceGroup = {
  label: PillarKey;
  slug: Lowercase<PillarKey>;
  services: ServiceDoc[];
};

type DocCategory = {
  name: string;
  description: string;
  icon: LucideIcon;
  path?: string;
  summary: string;
};

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    label: 'BUILD',
    slug: 'build',
    services: [
      {
        name: 'Delivery Infrastructure Foundation',
        slug: 'delivery-infrastructure-foundation',
        pillar: 'BUILD',
        summary: 'A technical baseline for reliable Web3 delivery, environments, access boundaries, and handover.',
        boundary: 'Provider selection, uptime, security guarantees, and unsupported operational coverage remain scope-dependent or excluded.',
        readinessLabel: 'DOCUMENTED · DELIVERY BASELINE PENDING',
        details: {
          audience: 'Teams with unclear environments, providers, repositories, access boundaries, or infrastructure ownership.',
          problem: 'Establishes a shared technical baseline so delivery ownership, environment plans, and access boundaries are explicit.',
          workflow: ['Context discovery', 'Environment, provider, and repository review', 'Baseline architecture and access review', 'Implementation planning and approved implementation', 'Deployment readiness and documentation'],
          inputs: ['Technical context and requirements', 'Repository and cloud access through approved paths', 'Environment information', 'Stakeholder approvals'],
          deliverables: ['Baseline architecture', 'Access and security baseline', 'Scope and implementation plan', 'Agreed handover documentation where in scope'],
          exclusions: ['Guaranteed uptime or security', 'Unapproved cloud or SaaS choices', 'Unsupported operational coverage'],
          dependencies: ['Client access and environment context', 'Cloud and repository ownership', 'Environment complexity', 'Deployment readiness'],
          acceptance: ['Approved scope and baseline artifacts', 'Access review evidence', 'Implementation acceptance', 'Documented limitations and readiness evidence'],
          handover: 'Handover follows stabilization and documentation. Any ongoing OPERATE service is separate and optional.',
          nextSteps: ['Bring the current environment, repository, provider, and access context.', 'Identify the client stakeholders who can approve architecture and access decisions.', 'Agree the scope baseline and evidence required before implementation or deployment.'],
        },
      },
      {
        name: 'CI/CD Hardening and Release Workflow',
        slug: 'cicd-hardening-release-workflow',
        pillar: 'BUILD',
        summary: 'Repeatable build, validation, deployment, and rollback-readiness workflows.',
        boundary: 'Existing provider context and environment parity are required; deployment success and uptime are not guaranteed.',
        readinessLabel: 'DOCUMENTED · RELEASE EVIDENCE PENDING',
        details: {
          audience: 'Teams with manual, fragile, or opaque releases that need clearer validation and release controls.',
          problem: 'Makes build, validation, deployment, and rollback-readiness workflows more repeatable and auditable.',
          workflow: ['Pipeline discovery', 'Failure and readiness analysis', 'Hardening plan', 'Authorized implementation and validation', 'Controlled deployment readiness and handover'],
          inputs: ['Repository and CI/CD access', 'Deployment environment and release history', 'Rollback context', 'Approval authority'],
          deliverables: ['Pipeline review', 'Authorized hardening changes', 'Deployment workflow', 'Validation evidence', 'Rollback and readiness guidance'],
          exclusions: ['Guaranteed deployment success or uptime', 'Unapproved production changes', 'A commitment to a particular provider or new SaaS'],
          dependencies: ['Repository state and CI/CD access', 'Environment parity', 'Provider limits', 'Rollback capability'],
          acceptance: ['Pipeline validation output', 'Documented release criteria', 'Deployment acceptance evidence', 'Known limitations and rollback readiness'],
          handover: 'Handover includes workflow documentation. Maintenance or OPERATE support requires separate scope.',
          nextSteps: ['Provide the current pipeline, deployment environments, and recent release history.', 'Identify release and rollback approval authority.', 'Agree the checks, acceptance evidence, and safe failure path for the release scope.'],
        },
      },
    ],
  },
  {
    label: 'AUTOMATE',
    slug: 'automate',
    services: [
      {
        name: 'Automation Workflow Foundation',
        slug: 'automation-workflow-foundation',
        pillar: 'AUTOMATE',
        summary: 'Bounded automation for reporting, triage, and routine delivery or operations workflows.',
        boundary: 'Provider-backed runtime scope is unresolved. Tools, permissions, project boundaries, human approvals, and audit expectations must be defined.',
        readinessLabel: 'DOCUMENTED · PROVIDER SCOPE UNRESOLVED',
        details: {
          audience: 'Teams with manual reporting, triage, or routine workflow overhead where bounded automation may be appropriate.',
          problem: 'Reduces repetitive delivery and operations work without granting unrestricted agent or production authority.',
          workflow: ['Workflow mapping', 'Boundary and risk analysis', 'Tool and permission design', 'Human approval checkpoint design', 'Controlled implementation, validation, and handover'],
          inputs: ['Workflow description and failure examples', 'Systems and APIs', 'Data boundaries', 'Approval requirements and operational context'],
          deliverables: ['Workflow map', 'Automation boundary', 'Approval design', 'Implementation scope', 'Audit expectations and operating documentation'],
          exclusions: ['Unrestricted agents or autonomous production control', 'Employee replacement claims', 'Unsupported model or provider promises'],
          dependencies: ['Client systems and APIs', 'Future provider selection', 'Data sensitivity', 'Prompt or policy quality', 'Explicit failure handling'],
          acceptance: ['Approved workflow map and permission boundary', 'Test cases', 'Audit records', 'Human approval path', 'Documented limitations'],
          handover: 'Prompt, policy, workflow, and operating documentation are required. Ongoing automation operations are separate and optional.',
          nextSteps: ['Describe one bounded workflow and its current failure modes.', 'Identify data, tool, permission, and approval boundaries.', 'Agree stop, retry, escalation, and audit evidence requirements before implementation.'],
        },
      },
    ],
  },
  {
    label: 'OPERATE',
    slug: 'operate',
    services: [
      {
        name: 'Managed Release Operations',
        slug: 'managed-release-operations',
        pillar: 'OPERATE',
        summary: 'Scoped release coordination and operational continuity after implementation.',
        boundary: 'Monitoring, support, escalation, coverage, and recurring service terms require explicit scope; no SLA or uptime commitment is implied.',
        readinessLabel: 'DOCUMENTED · OPERATIONAL COVERAGE UNRESOLVED',
        details: {
          audience: 'Clients needing scoped release coordination, runbook execution, change governance, or operational continuity.',
          problem: 'Coordinates agreed release and deployment operations after implementation or within an explicitly scoped operational engagement.',
          workflow: ['Existing-environment assessment', 'Operational scope and runbook agreement', 'Readiness review', 'Controlled release or runbook execution', 'Reporting, incident/change follow-up, review, and handover'],
          inputs: ['Existing system context and access', 'Deployment workflow and runbooks', 'Monitoring and support expectations', 'Incident context and escalation contacts'],
          deliverables: ['Agreed operational scope', 'Runbook execution records', 'Release and change records', 'Incident coordination', 'Operational documentation'],
          exclusions: ['Undefined monitoring subscriptions', '24/7 or SLA commitments', 'Guaranteed uptime', 'Unapproved provider coverage'],
          dependencies: ['Existing system health', 'Least-privilege operational access', 'Runbooks and monitoring context', 'Client availability and escalation paths'],
          acceptance: ['Approved operational scope and access', 'Runbook and release/change evidence', 'Incident outcomes', 'Client acceptance and documented limitations'],
          handover: 'Managed Release Operations is the documented recurring-service candidate, but ongoing terms must be separately purchased, scoped, and approved.',
          nextSteps: ['Provide the current environment, runbooks, monitoring context, and escalation contacts.', 'Define the operational scope and any required human authority.', 'Agree the evidence, incident handling, and handover conditions before activation.'],
        },
      },
    ],
  },
  {
    label: 'GROW',
    slug: 'grow',
    services: [
      {
        name: 'Technical Readiness and Trust Systems',
        slug: 'technical-readiness-trust-systems',
        pillar: 'GROW',
        summary: 'Growth work connected to technical readiness, authority, trust, content, and community enablement.',
        boundary: 'Launchable GROW scope remains unresolved; no guaranteed growth outcome or generic marketing-agency model is implied.',
        readinessLabel: 'DOCUMENTED · LAUNCHABLE SCOPE UNRESOLVED',
        details: {
          audience: 'Teams whose growth activity is disconnected from product readiness, delivery evidence, or technical trust.',
          problem: 'Connects technical readiness with authority, trust, content, community, and delivery-aligned feedback systems.',
          workflow: ['Readiness and context discovery', 'Trust, content, and community workflow mapping', 'Delivery feedback-loop design', 'Scoped implementation or advisory work', 'Review and handover'],
          inputs: ['Product context and technical readiness evidence', 'Content or community workflows', 'Feedback needs', 'Stakeholders and approvals'],
          deliverables: ['Readiness findings', 'Trust or content workflow', 'Community or delivery feedback-loop recommendations', 'Agreed documentation'],
          exclusions: ['Token promotion', 'Influencer campaigns or paid crypto advertising', 'Guaranteed users or fundraising', 'Generic marketing-agency packages'],
          dependencies: ['Client product context', 'Content and community workflow', 'Approval access', 'Unresolved GROW launch scope'],
          acceptance: ['Approved scope', 'Readiness findings', 'Workflow artifacts', 'Feedback-loop evidence', 'Client acceptance'],
          handover: 'Handover includes the agreed readiness findings, workflow artifacts, feedback-loop recommendations, and open limitations. Recurring work requires separate approval and scope.',
          nextSteps: ['Bring product-readiness evidence and the current content or community workflow.', 'Identify publication, strategic, and reputational approval owners.', 'Scope the evidence-based readiness or trust work before treating it as launchable.'],
        },
      },
    ],
  },
];

const DOC_CATEGORIES: DocCategory[] = [
  {
    name: 'Getting Started',
    description: 'Orient yourself around the documented BlockWaveLab engagement model.',
    icon: BookOpen,
    path: '/docs/getting-started',
    summary: 'Start with the four pillars, qualification, scope, and the evidence boundary.',
  },
  {
    name: 'Platform Overview',
    description: 'Understand the intended BlockWaveLab platform surface and its evidence status.',
    icon: Network,
    path: '/docs/platform',
    summary: 'Review the public website, tenancy, projects, commercial boundaries, delivery, and planned automation.',
  },
  {
    name: 'How BlockWaveLab Works',
    description: 'Follow the documented delivery and operating model from request through handover.',
    icon: Code2,
    path: '/docs/how-it-works',
    summary: 'Understand the separation between proposal, payment, entitlement, delivery activation, and handover.',
  },
  {
    name: 'Client Guide',
    description: 'See the client inputs, approvals, evidence, and blockers that shape delivery.',
    icon: BookOpen,
    path: '/docs/client-guide',
    summary: 'Prepare context, access, requirements, approvals, and acceptance evidence without assuming runtime availability.',
  },
  {
    name: 'Projects',
    description: 'Understand projects as delivery containers with scoped service selection.',
    icon: Settings2,
    path: '/docs/projects',
    summary: 'Projects organize delivery records and selected services; selection is not payment, entitlement, or activation.',
  },
  {
    name: 'Services',
    description: 'Browse the five current working-catalog services.',
    icon: Network,
    path: '/docs/services',
    summary: 'The service catalog is a draft documented baseline pending owner review and runtime delivery evidence.',
  },
  {
    name: 'Service Lifecycle',
    description: 'Review the documented stages from qualification through optional ongoing service.',
    icon: Code2,
    path: '/docs/lifecycle',
    summary: 'Each stage has documented entry conditions, evidence expectations, and status boundaries.',
  },
  {
    name: 'Account & Workspace',
    description: 'Review the intended identity, organization, membership, and project boundaries.',
    icon: Settings2,
    path: '/docs/account',
    summary: 'Authentication and workspace flows are documented, but complete runtime behavior is not verified.',
  },
  {
    name: 'Payments & Billing',
    description: 'See the documented payment and settlement boundary without inventing commercial policy.',
    icon: CreditCard,
    path: '/docs/payments',
    summary: 'Payment obligations, attempts, settlement, refunds, credits, disputes, and entitlements are separate concepts; provider runtime is unverified.',
  },
  {
    name: 'Security',
    description: 'Review the documented security and authorization boundaries.',
    icon: ShieldCheck,
    path: '/docs/security',
    summary: 'Server authorization, tenant boundaries, least privilege, secrets, and audit controls are documented design requirements.',
  },
  {
    name: 'FAQ',
    description: 'Get concise answers to common questions using the current documented boundaries.',
    icon: HelpCircle,
    path: '/docs/faq',
    summary: 'Answers distinguish documented intent from implemented and runtime-verified behavior.',
  },
  {
    name: 'Troubleshooting',
    description: 'Use the documented blocker, failure, and recovery vocabulary.',
    icon: HelpCircle,
    path: '/docs/troubleshooting',
    summary: 'Missing information, failed checks, unauthorized access, duplicate events, and deployment failures require controlled handling.',
  },
];

const LIFECYCLE_STAGES = [
  ['Qualification', 'Capture context, selected pillar, and qualification information; missing information becomes a tracked blocker.'],
  ['Account/organization', 'Create or join the account, verify identity, and establish the organization context; runtime behavior is not verified.'],
  ['Project setup', 'Create the project, assign membership, and select services; authorization must remain organization-scoped and fail closed.'],
  ['Onboarding', 'Provide systems, goals, access, constraints, and service context before scope is finalized.'],
  ['Scope', 'Clarify requirements and acceptance criteria without inventing prices or unsupported commitments.'],
  ['Proposal', 'Issue an immutable proposal version for review; expiry or rejection requires a new version.'],
  ['Approval/agreement', 'Use an authorized owner or client approver and preserve the approved version, agreement, and acceptance evidence.'],
  ['Payment', 'Reconcile the required payment through the approved provider path; runtime provider behavior is not verified.'],
  ['Entitlement', 'Issue scoped entitlement only from an approved source and policy; entitlement is not delivery activation.'],
  ['Delivery activation', 'Explicitly admit the service into delivery after commercial and readiness prerequisites.'],
  ['Implementation', 'Execute the approved implementation scope and record acceptance evidence.'],
  ['Deployment', 'Use environment checks, controlled release, and rollback readiness before deployment.'],
  ['Observation', 'Observe reliability, behavior, and operational quality for the current policy of 30 calendar days after deployment. This does not establish an SLA/SLO, guaranteed acceptance, or proof of runtime behavior.'],
  ['Stabilization', 'Prioritize fixes and optimization, then record accepted limitations or escalation.'],
  ['Documentation', 'Complete architecture, workflows, runbooks, and change history before handover.'],
  ['Handover', 'Transfer ownership, training context, limitations, and access with open items tracked.'],
  ['Optional ongoing service', 'Operate only an explicitly scoped and separately purchased service after handover; coverage and support terms remain scope-dependent.'],
] as const;

type SourceReference = { label: string; path: string };
type GuideContent = { title: string; eyebrow: string; description: string; status: string; audience: string; bullets: string[]; references: SourceReference[]; internalSources?: string[] };

const PUBLIC_SOURCE_REFERENCES: Record<string, SourceReference> = {
  services: { label: 'Service catalog view', path: '/docs/services' },
  lifecycle: { label: 'Client delivery lifecycle view', path: '/docs/lifecycle' },
  platform: { label: 'Platform overview', path: '/docs/platform' },
  payments: { label: 'Payments and billing boundaries', path: '/docs/payments' },
  security: { label: 'Security boundaries', path: '/docs/security' },
};

const FAQ_PAIRS = [
  ['Are all five services universally available?', 'No. They are the current working catalog, but launchable scope, owner review, and runtime delivery evidence remain pending.'],
  ['Does payment activate delivery?', 'No. Payment settlement, entitlement, and delivery activation are separate lifecycle stages with separate evidence.'],
  ['Does documentation prove production readiness?', 'No. Runtime, provider, security, operational, and release evidence are still required.'],
  ['Are support hours, uptime, or SLAs published?', 'No. Do not infer coverage, response targets, uptime, or SLA/SLO commitments from these pages.'],
];

const TROUBLESHOOTING_CHECKLIST = [
  'Identify the lifecycle stage and the exact transition or expected evidence that is blocked.',
  'Record the error, missing prerequisite, affected project context, time, and any safe reproduction details.',
  'Assign an owner and confirm the next reminder, escalation, or scope decision; do not leave blockers implicit.',
  'For failed checks or deployments, stop the release and record the retry, rollback, recovery, or limitation decision.',
  'For access, payment, entitlement, or activation issues, use the approved server-authoritative path; never bypass authorization or payment controls.',
];

const SECTION_CONTENT: Record<string, GuideContent> = {
  '/docs/getting-started': {
    title: 'Getting started',
    eyebrow: 'Documentation / Getting Started',
    description: 'Begin with the four-pillar model and the evidence boundary for the BlockWaveLab V2 experience.',
    status: 'DOCUMENTED INTENT',
    audience: 'For prospective clients and stakeholders preparing an initial qualification or onboarding discussion.',
    references: [PUBLIC_SOURCE_REFERENCES.services, PUBLIC_SOURCE_REFERENCES.lifecycle],
    bullets: [
      'Choose one or more documented pillars: BUILD, AUTOMATE, OPERATE, or GROW.',
      'Bring project context, requirements, approved access, constraints, and stakeholder approvals into qualification and onboarding.',
      'Expect account/organization, project setup, scope, proposal, approval/agreement, payment, entitlement, delivery activation, implementation, deployment, observation, stabilization, documentation, and handover to remain separate stages.',
      'Treat this public documentation as a reference. It does not prove authenticated delivery, provider execution, or production readiness.',
    ],
  },
  '/docs/platform': {
    title: 'Platform overview',
    eyebrow: 'Documentation / Platform Overview',
    description: 'The intended platform layers run from public content through identity, tenancy, projects, commercial boundaries, delivery, and future automation.',
    status: 'DRAFT — DOCUMENTED PLATFORM OVERVIEW',
    audience: 'For project stakeholders and technical reviewers who need a high-level map of the intended platform boundaries.',
    references: [PUBLIC_SOURCE_REFERENCES.platform, PUBLIC_SOURCE_REFERENCES.services],
    internalSources: ['Software Requirements Specification', 'Release Readiness Checklist'],
    bullets: [
      'The public website presents the four pillars and lifecycle-oriented entry points.',
      'Organizations are the customer and tenant boundary; projects are delivery containers.',
      'Catalog selection is separate from payment, entitlement, subscription, and delivery activation.',
      'Authentication, payments, entitlements, delivery, internal operations, and future AI runtime have explicit runtime or planning limitations in the source platform overview.',
    ],
  },
  '/docs/how-it-works': {
    title: 'How BlockWaveLab works',
    eyebrow: 'Documentation / Operating Model',
    description: 'The model connects technical implementation with controlled delivery, evidence, handover, and optional ongoing service.',
    status: 'DOCUMENTED INTENT',
    audience: 'For prospective clients and delivery stakeholders evaluating how work moves from qualification through handover.',
    references: [PUBLIC_SOURCE_REFERENCES.lifecycle, PUBLIC_SOURCE_REFERENCES.services],
    internalSources: ['Software Requirements Specification', 'Release Readiness Checklist'],
    bullets: [
      'BUILD establishes the technical and delivery foundation; AUTOMATE addresses bounded workflow automation with human checkpoints.',
      'OPERATE covers scoped release and operational continuity; GROW connects readiness, authority, content, community, and feedback loops.',
      'Proposal acceptance is not payment success, payment settlement is not entitlement activation, and entitlement activation is not delivery activation.',
      'No service page should be read as an uptime, security, growth, support-hours, or SLA guarantee.',
    ],
  },
  '/docs/client-guide': {
    title: 'Client guide',
    eyebrow: 'Documentation / Client Guide',
    description: 'Client participation supplies the context and approvals needed to define safe, reviewable delivery work.',
    status: 'DOCUMENTED INTENT',
    audience: 'For onboarding clients and client-side owners responsible for requirements, access, approvals, and acceptance evidence.',
    references: [PUBLIC_SOURCE_REFERENCES.lifecycle, PUBLIC_SOURCE_REFERENCES.services],
    bullets: [
      'Provide technical context, repositories, environments, approved access paths, requirements, constraints, and stakeholder approvals where relevant.',
      'Review scope and acceptance criteria before implementation and preserve a clear approval authority.',
      'Treat missing information or blocked access as a recorded blocker with an owner, reminder, escalation, or scope revision.',
      'Handover includes ownership transfer, training context, known limitations, and tracked open items.',
    ],
  },
  '/docs/projects': {
    title: 'Projects',
    eyebrow: 'Documentation / Projects',
    description: 'Projects organize delivery records, memberships, selected services, and lifecycle context.',
    status: 'STRUCTURALLY VERIFIED / RUNTIME NOT VERIFIED',
    audience: 'For project owners and technical stakeholders reviewing organization, membership, and service-selection boundaries.',
    references: [PUBLIC_SOURCE_REFERENCES.platform, PUBLIC_SOURCE_REFERENCES.lifecycle],
    internalSources: ['Software Requirements Specification', 'Release Readiness Checklist'],
    bullets: [
      'A project is a delivery container within an organization.',
      'Project and service selection does not itself create payment, entitlement, subscription, or delivery activation.',
      'Project access must remain organization-scoped and server-authorized; client-supplied identifiers are not authorization evidence.',
      'Runtime organization, role, cross-tenant, and lifecycle behavior still requires verification.',
    ],
  },
  '/docs/account': {
    title: 'Account & workspace',
    eyebrow: 'Documentation / Account & Workspace',
    description: 'Identity, organizations, memberships, roles, and project context form the intended workspace boundary.',
    status: 'LOCAL / RUNTIME NOT VERIFIED',
    audience: 'For client owners and workspace administrators reviewing identity, membership, and tenant-boundary expectations.',
    references: [PUBLIC_SOURCE_REFERENCES.platform, PUBLIC_SOURCE_REFERENCES.security],
    internalSources: ['Software Requirements Specification', 'Release Readiness Checklist'],
    bullets: [
      'Authentication establishes identity; organization membership and role context govern workspace access.',
      'Organizations are the tenant boundary and projects are scoped delivery containers.',
      'Authorization is expected to be server-controlled with deny-by-default and tenant-isolation checks.',
      'The public Docs experience does not claim that all authenticated workspace flows are deployed or runtime verified.',
    ],
  },
  '/docs/payments': {
    title: 'Payments & billing',
    eyebrow: 'Documentation / Payments & Billing',
    description: 'The documented commercial model separates payment obligations, attempts, settlement, refunds, credits, disputes, entitlements, and delivery.',
    status: 'STRUCTURALLY VERIFIED / PROVIDER RUNTIME NOT VERIFIED',
    audience: 'For prospective clients and commercial stakeholders reviewing the boundary between proposal, payment, entitlement, and delivery.',
    references: [PUBLIC_SOURCE_REFERENCES.payments, PUBLIC_SOURCE_REFERENCES.lifecycle],
    internalSources: ['Business product baseline', 'Software Requirements Specification', 'Release Readiness Checklist'],
    bullets: [
      'Payment confirmation or settlement does not automatically imply entitlement or delivery activation.',
      'Provider and webhook boundaries are documented, but live provider execution and replay evidence remain unverified.',
      'Pricing, tax, refund, cancellation, chargeback, recurring-billing, and settlement policies remain decision- or provider-dependent.',
      'No public price or billing guarantee is established by this page.',
    ],
  },
  '/docs/security': {
    title: 'Security',
    eyebrow: 'Documentation / Security',
    description: 'Security boundaries are documented as design requirements and must be evaluated against implementation and runtime evidence.',
    status: 'DOCUMENTED DESIGN / RUNTIME EVIDENCE REQUIRED',
    audience: 'For client security reviewers, technical owners, and stakeholders preparing access and acceptance evidence.',
    references: [PUBLIC_SOURCE_REFERENCES.security, PUBLIC_SOURCE_REFERENCES.platform],
    internalSources: ['Software Requirements Specification', 'Release Readiness Checklist'],
    bullets: [
      'Organization and project access must be server-authorized and tenant-scoped.',
      'Sensitive commercial, payment, entitlement, and delivery writes must use trusted boundaries.',
      'Secrets and provider credentials must remain in trusted environments; browser clients must not receive service-role credentials.',
      'Negative, cross-tenant, replay, and runtime tests are required before release; no security guarantee is implied here.',
    ],
  },
  '/docs/faq': {
    title: 'FAQ',
    eyebrow: 'Documentation / FAQ',
    description: 'These answers summarize current documented boundaries rather than adding new policy.',
    status: 'REFERENCE — CURRENT DOCUMENTED BOUNDARIES',
    audience: 'For prospective clients looking for concise answers before qualification or onboarding.',
    references: [PUBLIC_SOURCE_REFERENCES.services, PUBLIC_SOURCE_REFERENCES.lifecycle, PUBLIC_SOURCE_REFERENCES.payments],
    bullets: [
      'Are all services available? No. The five services listed here are the current working catalog; launchable scope and runtime delivery evidence remain dependent on review.',
      'Is AUTOMATE unrestricted? No. Automation is bounded by tools, permissions, project boundaries, human approvals, and audit records.',
      'Does documentation mean production readiness? No. Runtime, provider, security, operational, and release evidence remain separate requirements.',
      'Are support hours or SLAs published? No. Do not infer coverage, response targets, uptime, or SLA/SLO commitments from these pages.',
    ],
  },
  '/docs/troubleshooting': {
    title: 'Troubleshooting',
    eyebrow: 'Documentation / Troubleshooting',
    description: 'Use controlled blocker and recovery paths rather than bypassing missing context, failed checks, or authorization boundaries.',
    status: 'DOCUMENTED FAILURE / RECOVERY VOCABULARY',
    audience: 'For onboarding clients, project owners, and delivery stakeholders triaging a blocked stage or missing evidence.',
    references: [PUBLIC_SOURCE_REFERENCES.lifecycle, PUBLIC_SOURCE_REFERENCES.security],
    internalSources: ['Software Requirements Specification', 'Release Readiness Checklist'],
    bullets: [
      ...TROUBLESHOOTING_CHECKLIST,
    ],
  },
};

function servicePath(group: ServiceGroup, service: ServiceDoc) {
  return `/docs/services/${group.slug}/${service.slug}`;
}

function allServices() {
  return SERVICE_GROUPS.flatMap((group) => group.services.map((service) => ({ service, group })));
}

function findGroup(slug: string) {
  return SERVICE_GROUPS.find((group) => group.slug === slug);
}

export default function DocsPage({ path, onNavigate }: DocsPageProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isServices = path === '/docs/services' || path.startsWith('/docs/services/');
  const isLifecycle = path === '/docs/lifecycle';
  const sectionContent = SECTION_CONTENT[path];
  const serviceMatch = path.match(/^\/docs\/services\/([^/]+)(?:\/([^/]+))?$/);
  const serviceGroup = serviceMatch ? findGroup(serviceMatch[1]) : undefined;
  const currentService = serviceMatch?.[2]
    ? allServices().find(({ group, service }) => group.slug === serviceMatch[1] && service.slug === serviceMatch[2])
    : undefined;
  const isUnknownServicePath = Boolean(serviceMatch?.[2] && !currentService);
  const isUnknownGroupPath = Boolean(serviceMatch && !serviceMatch[2] && !serviceGroup);
  const isMalformedServicePath = path.startsWith('/docs/services/') && !serviceMatch;
  const isKnownGuidePath = path === '/docs' || path === '/docs/lifecycle' || path === '/docs/services' || Boolean(sectionContent);
  const isUnknownDocsPath = path.startsWith('/docs/') && !isKnownGuidePath && !serviceMatch;

  const closeMobileNav = () => setIsMobileNavOpen(false);

  return (
    <PageShell className="min-h-[calc(100vh-4rem)]">
      <Container>
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <p className="text-sm font-semibold text-slate-200">Docs navigation</p>
          <Button variant="secondary" size="sm" onClick={() => setIsMobileNavOpen((open) => !open)} aria-expanded={isMobileNavOpen} aria-label="Toggle docs navigation">
            {isMobileNavOpen ? <X size={16} /> : <Menu size={16} />}
            {isMobileNavOpen ? 'Close' : 'Browse'}
          </Button>
        </div>
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className={`${isMobileNavOpen ? 'block' : 'hidden'} lg:block`} aria-label="Documentation navigation">
            <div className="sticky top-24 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <button className="bw-focus flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-100 hover:bg-slate-800" onClick={() => { onNavigate('/docs'); closeMobileNav(); }}>
                <span className="flex items-center gap-2"><BookOpen size={16} className="text-cyan-300" /> Documentation</span>
                <ChevronRight size={15} />
              </button>
              <div className="mt-3 space-y-1 border-l border-slate-700 pl-3">
                <SidebarButton active={path === '/docs'} onClick={() => { onNavigate('/docs'); closeMobileNav(); }}>Overview</SidebarButton>
                <SidebarButton active={isServices} onClick={() => { onNavigate('/docs/services'); closeMobileNav(); }}>Services</SidebarButton>
                <SidebarButton active={isLifecycle} onClick={() => { onNavigate('/docs/lifecycle'); closeMobileNav(); }}>Service Lifecycle</SidebarButton>
              </div>
              <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Service groups</p>
              <div className="mt-2 space-y-1">
                {SERVICE_GROUPS.map((group) => (
                  <button key={group.slug} className="bw-focus flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100" onClick={() => { onNavigate(`/docs/services/${group.slug}`); closeMobileNav(); }}>
                    {group.label}<ChevronRight size={14} />
                  </button>
                ))}
              </div>
              <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Guides</p>
              <div className="mt-2 space-y-1">
                {DOC_CATEGORIES.filter((category) => category.name !== 'Services' && category.name !== 'Service Lifecycle').map((category) => (
                  <button key={category.name} className="bw-focus block w-full rounded px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100" onClick={() => { onNavigate(category.path ?? '/docs'); closeMobileNav(); }}>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            {currentService ? <ServicePage service={currentService.service} group={currentService.group} onNavigate={onNavigate} />
              : isUnknownServicePath ? <NotFoundPage title="Service documentation not found" description="That service slug is not part of the current working catalog." onNavigate={() => onNavigate('/docs/services')} />
                : isUnknownGroupPath ? <NotFoundPage title="Service group not found" description="Choose one of the documented BUILD, AUTOMATE, OPERATE, or GROW groups." onNavigate={() => onNavigate('/docs/services')} />
                  : isMalformedServicePath ? <NotFoundPage title="Service documentation route not found" description="Use a documented service group or service detail route." onNavigate={() => onNavigate('/docs/services')} />
                  : isUnknownDocsPath ? <NotFoundPage title="Documentation page not found" description="That documentation route is not part of the current Docs experience." onNavigate={() => onNavigate('/docs')} />
                  : isLifecycle ? <LifecyclePage />
                    : isServices ? <ServicesPage activeGroup={serviceGroup} onNavigate={onNavigate} />
                      : sectionContent ? <DocSectionPage path={path} content={sectionContent} onNavigate={onNavigate} />
                        : <DocsOverview searchQuery={searchQuery} setSearchQuery={setSearchQuery} onNavigate={onNavigate} />}
          </section>
        </div>
      </Container>
    </PageShell>
  );
}

function SidebarButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return <button className={`bw-focus block w-full rounded px-3 py-2 text-left text-sm ${active ? 'bg-cyan-400/10 text-cyan-300' : 'text-slate-400 hover:text-slate-100'}`} onClick={onClick}>{children}</button>;
}

function DocsOverview({ searchQuery, setSearchQuery, onNavigate }: { searchQuery: string; setSearchQuery: (value: string) => void; onNavigate: (target: string) => void }) {
  const query = searchQuery.trim().toLowerCase();
  const results = useMemo(() => {
    if (!query) return [];
    const categoryResults = DOC_CATEGORIES.filter((category) => `${category.name} ${category.description} ${category.summary}`.toLowerCase().includes(query)).map((category) => ({
      title: category.name,
      summary: category.summary,
      path: category.path ?? '/docs',
      label: 'Guide',
    }));
    const serviceResults = allServices().filter(({ service }) => `${service.name} ${service.pillar} ${service.summary}`.toLowerCase().includes(query)).map(({ service, group }) => ({
      title: service.name,
      summary: service.summary,
      path: servicePath(group, service),
      label: service.pillar,
    }));
    return [...categoryResults, ...serviceResults];
  }, [query]);

  return (
    <>
      <div className="border-b border-slate-800 pb-8">
        <Badge tone="info">BlockWaveLab Docs</Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">Build with a clear operating model.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">A documented guide to BlockWaveLab services, platform boundaries, delivery lifecycle, and client workspaces.</p>
        <label className="mt-6 flex max-w-xl items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-300 focus-within:border-cyan-300/60">
          <Search size={17} aria-hidden="true" className="shrink-0 text-slate-500" />
          <span className="sr-only">Search documentation</span>
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search documentation" className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500" />
        </label>
        {query ? <div className="mt-4" aria-live="polite">
          <p className="text-sm text-slate-400">{results.length ? `${results.length} documentation result${results.length === 1 ? '' : 's'}` : 'No documentation matches that search.'}</p>
          {results.length > 0 && <div className="mt-3 space-y-2">{results.map((result) => <button key={`${result.label}-${result.path}`} className="bw-focus flex w-full items-start justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left hover:border-cyan-300/40" onClick={() => onNavigate(result.path)}><span><span className="block text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">{result.label}</span><span className="mt-1 block font-semibold text-slate-100">{result.title}</span><span className="mt-1 block text-sm leading-6 text-slate-400">{result.summary}</span></span><ChevronRight size={16} className="mt-1 shrink-0 text-cyan-300" /></button>)}</div>}
        </div> : null}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {DOC_CATEGORIES.map((category) => {
          const Icon = category.icon;
          return <Card key={category.name} className="h-full border-slate-800 bg-slate-900/60 p-5"><Icon size={19} className="text-cyan-300" aria-hidden="true" /><h2 className="mt-4 text-lg font-semibold text-slate-100">{category.name}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{category.description}</p><button className="bw-focus mt-4 inline-flex items-center gap-1 rounded text-sm font-medium text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate(category.path ?? '/docs')}>Explore <ChevronRight size={14} /></button></Card>;
        })}
      </div>
    </>
  );
}

function DocSectionPage({ path, content, onNavigate }: { path: string; content: GuideContent; onNavigate: (target: string) => void }) {
  const isFaq = path === '/docs/faq';
  const isTroubleshooting = path === '/docs/troubleshooting';
  return <div>
    <Badge tone="info">{content.status}</Badge>
    <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50">{content.title}</h1>
    <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{content.description}</p>
    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Intended audience</p>
      <p className="mt-2 text-sm leading-7 text-slate-300">{content.audience}</p>
    </div>
    {isFaq ? <div className="mt-8 space-y-3">{FAQ_PAIRS.map(([question, answer]) => <details key={question} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><summary className="cursor-pointer text-base font-semibold text-slate-100">{question}</summary><p className="mt-3 text-sm leading-7 text-slate-300">{answer}</p></details>)}</div>
      : <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">{isTroubleshooting ? 'Safe triage checklist' : `${content.title} guidance`}</p><ul className="mt-4 space-y-4">{content.bullets.map((bullet) => <li key={bullet} className="flex gap-3 text-sm leading-7 text-slate-300"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />{bullet}</li>)}</ul></div>}
    <div className="mt-8 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Related documentation</p>
      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <button className="bw-focus rounded text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate('/docs/lifecycle')}>Service lifecycle <ChevronRight size={14} className="inline" /></button>
        <button className="bw-focus rounded text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate('/docs/services')}>Services <ChevronRight size={14} className="inline" /></button>
        {path !== '/docs/client-guide' ? <button className="bw-focus rounded text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate('/docs/client-guide')}>Client guide <ChevronRight size={14} className="inline" /></button> : null}
      </div>
    </div>
    <SourceReferences references={content.references} internalSources={content.internalSources} onNavigate={onNavigate} />
  </div>;
}

function SourceReferences({ references, internalSources, onNavigate }: { references: SourceReference[]; internalSources?: string[]; onNavigate: (target: string) => void }) {
  return <div className="mt-6 text-sm text-slate-400">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Source basis</p>
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
      {references.map((reference) => <button key={reference.path} className="bw-focus rounded text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate(reference.path)}>{reference.label} <ChevronRight size={13} className="inline" /></button>)}
    </div>
    {internalSources?.length ? <p className="mt-3 text-xs leading-6 text-slate-500">Internal evidence sources used for boundary review: {internalSources.join(', ')}. These are not linked because client-facing publication suitability is not established.</p> : null}
  </div>;
}

function ServicesPage({ activeGroup, onNavigate }: { activeGroup?: ServiceGroup; onNavigate: (target: string) => void }) {
  const groups = activeGroup ? [activeGroup] : SERVICE_GROUPS;
  return <><div className="border-b border-slate-800 pb-8"><Badge tone="info">DRAFT — DOCUMENTED SERVICE BASELINE</Badge><h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50">{activeGroup ? `${activeGroup.label} services` : 'Services documentation'}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">The current working catalog contains five documented services. Catalog approval, scope, and runtime delivery evidence remain subject to review.</p></div><div className="mt-8 space-y-6">{groups.map((group) => <div key={group.slug}><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">{group.label}</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{group.services.map((service) => <button key={service.slug} className="bw-focus flex items-start justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left text-slate-100 transition-colors hover:border-cyan-300/40 hover:bg-slate-900" onClick={() => onNavigate(servicePath(group, service))}><span><span className="block font-semibold">{service.name}</span><span className="mt-1 block text-sm leading-6 text-slate-400">{service.summary}</span></span><ChevronRight size={16} className="mt-1 shrink-0 text-cyan-300" /></button>)}</div></div>)}</div></>;
}

function ServicePage({ service, group, onNavigate }: { service: ServiceDoc; group: ServiceGroup; onNavigate: (target: string) => void }) {
  const { details } = service;
  return <div>
    <button className="bw-focus mb-8 inline-flex items-center gap-2 rounded text-sm text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate(`/docs/services/${group.slug}`)}><ChevronRight size={15} className="rotate-180" /> Back to {group.label}</button>
    <Badge tone="info">{service.pillar} service · {service.readinessLabel}</Badge>
    <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50">{service.name}</h1>
    <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{service.summary}</p>
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Decision boundary</p>
      <p className="mt-3 leading-7 text-slate-300">{service.boundary}</p>
      <p className="mt-6 text-sm leading-7 text-slate-400">This page reflects a documented service baseline. It does not establish pricing, provider approval, production readiness, support hours, SLA/SLO commitments, or verified runtime delivery.</p>
    </div>
    <div className="mt-8 grid gap-4 lg:grid-cols-2">
      <ServiceDetailSection title="Who this service is for" text={details.audience} />
      <ServiceDetailSection title="Problem addressed" text={details.problem} />
      <ServiceDetailSection title="Scope and typical workflow" items={details.workflow} />
      <ServiceDetailSection title="Client prerequisites and required inputs" items={details.inputs} />
      <ServiceDetailSection title="Expected deliverables" items={details.deliverables} />
      <ServiceDetailSection title="Explicit exclusions" items={details.exclusions} />
      <ServiceDetailSection title="Dependencies and decision points" items={details.dependencies} />
      <ServiceDetailSection title="Acceptance evidence and verification boundaries" items={details.acceptance} />
      <ServiceDetailSection title="Handover expectations" text={details.handover} />
      <ServiceDetailSection title="Practical next steps" items={details.nextSteps} />
    </div>
    <SourceReferences references={[PUBLIC_SOURCE_REFERENCES.services, PUBLIC_SOURCE_REFERENCES.lifecycle]} onNavigate={onNavigate} />
  </div>;
}

function ServiceDetailSection({ title, text, items }: { title: string; text?: string; items?: string[] }) {
  return <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
    <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
    {text ? <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p> : null}
    {items ? <ul className="mt-3 space-y-2">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-7 text-slate-300"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />{item}</li>)}</ul> : null}
  </section>;
}

function LifecyclePage() {
  return <div><Badge tone="info">DOCUMENTED INTENT · RUNTIME NOT VERIFIED</Badge><h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50">Service lifecycle</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">A public map of the documented stages that organize BlockWaveLab engagements from qualification through handover and optional ongoing service.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{LIFECYCLE_STAGES.map(([stage, description], index) => <div key={stage} className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cyan-400/10 text-sm font-semibold text-cyan-300">{index + 1}</span><div><h2 className="font-semibold text-slate-100">{stage}</h2><p className="mt-1 text-sm leading-6 text-slate-400">{description}</p></div></div>)}</div><div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-5 text-sm leading-7 text-slate-300"><strong className="text-amber-200">Evidence boundary:</strong> The 30-calendar-day observation policy is documented guidance after deployment. It does not establish an SLA/SLO, guaranteed acceptance, or proof that the lifecycle is implemented or runtime verified.</div></div>;
}

function NotFoundPage({ title, description, onNavigate }: { title: string; description: string; onNavigate: () => void }) {
  return <div><Badge tone="warning">NOT FOUND</Badge><h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50">{title}</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">{description}</p><button className="bw-focus mt-6 inline-flex items-center gap-1 rounded text-sm font-medium text-cyan-300 hover:text-cyan-200" onClick={onNavigate}>Browse documented services <ChevronRight size={14} /></button></div>;
}
