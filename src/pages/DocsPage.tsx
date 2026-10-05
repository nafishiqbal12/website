import { useState } from 'react';
import { BookOpen, ChevronRight, Code2, CreditCard, HelpCircle, Menu, Network, Search, Settings2, ShieldCheck, X } from 'lucide-react';
import { PageShell } from '../components/shells';
import { Badge, Button, Card, Container } from '../components/ui';

interface DocsPageProps {
  path: string;
  onNavigate: (target: string) => void;
}

type ServiceGroup = {
  label: string;
  slug: string;
  services: Array<{ name: string; slug: string }>;
};

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    label: 'BUILD',
    slug: 'build',
    services: [
      { name: 'Cloud & DevOps Infrastructure', slug: 'cloud-devops-infrastructure' },
      { name: 'Infrastructure Reliability & Security', slug: 'infrastructure-reliability-security' },
    ],
  },
  {
    label: 'AUTOMATE',
    slug: 'automate',
    services: [
      { name: 'Custom AI Agents', slug: 'custom-ai-agents' },
      { name: 'Community & Social Automation', slug: 'community-social-automation' },
      { name: 'DevOps & Monitoring Automation', slug: 'devops-monitoring-automation' },
    ],
  },
  {
    label: 'OPERATE',
    slug: 'operate',
    services: [
      { name: 'Managed DevOps Operations', slug: 'managed-devops-operations' },
      { name: 'Security & Performance Operations', slug: 'security-performance-operations' },
    ],
  },
  {
    label: 'GROW',
    slug: 'grow',
    services: [
      { name: 'Content & Community Automation', slug: 'content-community-automation' },
      { name: 'Growth Analytics & SEO Support', slug: 'growth-analytics-seo-support' },
      { name: 'Campaign & Content Distribution', slug: 'campaign-content-distribution' },
    ],
  },
];

const DOC_CATEGORIES = [
  { name: 'Getting Started', description: 'Orient yourself and take the first step.', icon: BookOpen },
  { name: 'Platform Overview', description: 'Understand the BlockWaveLab platform surface.', icon: Network },
  { name: 'How BlockWaveLab Works', description: 'Follow the delivery and operating model.', icon: Code2 },
  { name: 'Client Guide', description: 'Find your way through client-facing workflows.', icon: BookOpen },
  { name: 'Projects', description: 'Project structure and delivery workspace guidance.', icon: Settings2 },
  { name: 'Services', description: 'Browse the service documentation map.', icon: Network, path: '/docs/services' },
  { name: 'Service Lifecycle', description: 'Review the public lifecycle stages.', icon: Code2, path: '/docs/lifecycle' },
  { name: 'Account & Workspace', description: 'Account, organization, and workspace orientation.', icon: Settings2 },
  { name: 'Payments & Billing', description: 'Payment and billing documentation placeholder.', icon: CreditCard },
  { name: 'Security', description: 'Security documentation placeholder.', icon: ShieldCheck },
  { name: 'FAQ', description: 'Frequently asked questions placeholder.', icon: HelpCircle },
  { name: 'Troubleshooting', description: 'Troubleshooting guidance placeholder.', icon: HelpCircle },
];

const LIFECYCLE_STAGES = ['Service Request', 'Proposal', 'Agreement', 'Payment', 'Implementation', 'Deployment', 'Observation', 'Stabilization', 'Documentation', 'Handover', 'Optional Ongoing Service'];

function servicePath(group: ServiceGroup, service: { slug: string }) {
  return `/docs/services/${group.slug}/${service.slug}`;
}

export default function DocsPage({ path, onNavigate }: DocsPageProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isServices = path === '/docs/services' || path.startsWith('/docs/services/');
  const isLifecycle = path === '/docs/lifecycle';
  const serviceMatch = path.match(/^\/docs\/services\/([^/]+)\/([^/]+)$/);
  const currentService = serviceMatch
    ? SERVICE_GROUPS.flatMap((group) => group.services.map((service) => ({ ...service, group }))).find((service) => service.group.slug === serviceMatch[1] && service.slug === serviceMatch[2])
    : undefined;

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
              <button className="bw-focus flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-100 hover:bg-slate-800" onClick={() => { onNavigate('/docs'); setIsMobileNavOpen(false); }}>
                <span className="flex items-center gap-2"><BookOpen size={16} className="text-cyan-300" /> Documentation</span>
                <ChevronRight size={15} />
              </button>
              <div className="mt-3 space-y-1 border-l border-slate-700 pl-3">
                <button className={`bw-focus block w-full rounded px-3 py-2 text-left text-sm ${!isServices && !isLifecycle ? 'bg-cyan-400/10 text-cyan-300' : 'text-slate-400 hover:text-slate-100'}`} onClick={() => { onNavigate('/docs'); setIsMobileNavOpen(false); }}>Overview</button>
                <button className={`bw-focus block w-full rounded px-3 py-2 text-left text-sm ${isServices ? 'bg-cyan-400/10 text-cyan-300' : 'text-slate-400 hover:text-slate-100'}`} onClick={() => { onNavigate('/docs/services'); setIsMobileNavOpen(false); }}>Services</button>
                <button className={`bw-focus block w-full rounded px-3 py-2 text-left text-sm ${isLifecycle ? 'bg-cyan-400/10 text-cyan-300' : 'text-slate-400 hover:text-slate-100'}`} onClick={() => { onNavigate('/docs/lifecycle'); setIsMobileNavOpen(false); }}>Service Lifecycle</button>
              </div>
              <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Service groups</p>
              <div className="mt-2 space-y-1">
                {SERVICE_GROUPS.map((group) => (
                  <button key={group.slug} className="bw-focus flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100" onClick={() => { onNavigate(`/docs/services/${group.slug}`); setIsMobileNavOpen(false); }}>
                    {group.label}<ChevronRight size={14} />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            {currentService ? <ServicePlaceholder service={currentService} onNavigate={onNavigate} /> : isLifecycle ? <LifecyclePage /> : isServices ? <ServicesPage onNavigate={onNavigate} /> : <DocsOverview onNavigate={onNavigate} />}
          </section>
        </div>
      </Container>
    </PageShell>
  );
}

function DocsOverview({ onNavigate }: { onNavigate: (target: string) => void }) {
  return (
    <>
      <div className="border-b border-slate-800 pb-8">
        <Badge tone="info">BlockWaveLab Docs</Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">Build with a clear operating model.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">A growing documentation space for the BlockWaveLab platform, services, delivery lifecycle, and client workspaces.</p>
        <div className="mt-6 flex max-w-xl items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-500"><Search size={17} aria-hidden="true" /><span className="text-sm">Search documentation (coming soon)</span></div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {DOC_CATEGORIES.map((category) => {
          const Icon = category.icon;
          return <Card key={category.name} className="h-full border-slate-800 bg-slate-900/60 p-5"><Icon size={19} className="text-cyan-300" aria-hidden="true" /><h2 className="mt-4 text-lg font-semibold text-slate-100">{category.name}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{category.description}</p>{category.path ? <button className="bw-focus mt-4 inline-flex items-center gap-1 rounded text-sm font-medium text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate(category.path)}>Explore <ChevronRight size={14} /></button> : <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">Coming soon</p>}</Card>;
        })}
      </div>
    </>
  );
}

function ServicesPage({ onNavigate }: { onNavigate: (target: string) => void }) {
  return (
    <>
      <div className="border-b border-slate-800 pb-8"><Badge tone="info">Documentation / Services</Badge><h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50">Services documentation</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">Each service has a dedicated place for future setup guidance, operating notes, and delivery references.</p></div>
      <div className="mt-8 space-y-6">{SERVICE_GROUPS.map((group) => <div key={group.slug}><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">{group.label}</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{group.services.map((service) => <button key={service.slug} className="bw-focus flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left text-slate-100 transition-colors hover:border-cyan-300/40 hover:bg-slate-900" onClick={() => onNavigate(servicePath(group, service))}><span>{service.name}</span><ChevronRight size={16} className="text-cyan-300" /></button>)}</div></div>)}</div>
    </>
  );
}

function ServicePlaceholder({ service, onNavigate }: { service: { name: string; group: ServiceGroup }; onNavigate: (target: string) => void }) {
  return <div><button className="bw-focus mb-8 inline-flex items-center gap-2 rounded text-sm text-cyan-300 hover:text-cyan-200" onClick={() => onNavigate('/docs/services')}><ChevronRight size={15} className="rotate-180" /> Back to Services</button><Badge tone="info">{service.group.label} service</Badge><h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50">{service.name}</h1><div className="mt-8 rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/[0.04] p-7 sm:p-10"><BookOpen size={22} className="text-cyan-300" aria-hidden="true" /><h2 className="mt-4 text-2xl font-semibold text-slate-100">Documentation coming soon</h2><p className="mt-3 max-w-2xl leading-7 text-slate-400">This service documentation page is reserved for future BlockWaveLab guidance. No service details are published here yet.</p></div></div>;
}

function LifecyclePage() {
  return <div><Badge tone="info">Documentation / Service Lifecycle</Badge><h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50">Service lifecycle</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">A public map of the stages that organize BlockWaveLab engagements from request through handover.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{LIFECYCLE_STAGES.map((stage, index) => <div key={stage} className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cyan-400/10 text-sm font-semibold text-cyan-300">{index + 1}</span><div><h2 className="font-semibold text-slate-100">{stage}</h2><p className="mt-1 text-sm text-slate-500">Lifecycle documentation placeholder</p></div></div>)}</div></div>;
}
