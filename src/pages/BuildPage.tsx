import {
  CloudCog,
  GitBranch,
  PackageCheck,
  Radar,
  Rocket,
  ServerCog,
  ShieldCheck,
  TimerReset,
} from 'lucide-react';
import { HeroShell, PageShell } from '../components/shells';
import {
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Link,
  SectionHeader,
  ServiceCard,
  StatusIndicator,
} from '../components/ui';

type BuildPageProps = {
  onNavigate: (target: string) => void;
};

const BUILD_CAPABILITIES = [
  {
    title: 'Cloud architecture and environment design',
    description:
      'Design production-ready cloud environments with clear separation across lifecycle stages and operational responsibilities.',
    value: 'Practical value: clearer deployment paths and reduced setup friction for growing teams.',
    icon: <CloudCog size={18} aria-hidden="true" />,
  },
  {
    title: 'CI/CD pipeline design and hardening',
    description:
      'Implement delivery pipelines with validation and release controls aligned to reliable production change management.',
    value: 'Practical value: faster release cycles with better consistency and lower manual error risk.',
    icon: <GitBranch size={18} aria-hidden="true" />,
  },
  {
    title: 'Containerization and deployment workflows',
    description:
      'Package and deploy services using repeatable workflows that support controlled rollout and rollback readiness.',
    value: 'Practical value: more predictable deployments and easier environment portability.',
    icon: <Rocket size={18} aria-hidden="true" />,
  },
  {
    title: 'Infrastructure reliability baselines',
    description:
      'Establish baseline reliability standards that guide operational quality during implementation and deployment.',
    value: 'Practical value: stronger operational stability before and after go-live.',
    icon: <TimerReset size={18} aria-hidden="true" />,
  },
  {
    title: 'Security and access baseline setup',
    description:
      'Apply foundational access and security-oriented operational controls as part of initial infrastructure setup.',
    value: 'Practical value: better default protection and clearer governance from day one.',
    icon: <ShieldCheck size={18} aria-hidden="true" />,
  },
] as const;

const BUILD_WORKFLOW = [
  'Discovery',
  'Scope / Package',
  'Implementation',
  'Deployment',
  'Observation',
  'Optimization / Stabilization',
  'Documentation',
  'Handover',
  'Optional ongoing support',
] as const;

export default function BuildPage({ onNavigate }: BuildPageProps) {
  return (
    <div className="pt-16">
      <HeroShell tone="build" aria-label="BUILD hero section">
        <div className="mx-auto max-w-4xl text-center">
          <Badge tone="info">BUILD</Badge>
          <h1 className="mt-5 text-balance text-4xl font-semibold text-slate-100 sm:text-5xl">
            DevOps and Cloud Infrastructure for Web3 Projects
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-slate-300 sm:text-lg">
            BlockWaveLab helps teams design and implement reliable infrastructure and delivery systems without requiring an immediate large in-house DevOps function.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={() => onNavigate('/operate')}>Discuss infrastructure needs</Button>
            <Button variant="outline" onClick={() => onNavigate('/automate')}>See adjacent AUTOMATE lane</Button>
            <Link href="mailto:hello@blockwavelab.com" className="inline-flex items-center rounded-xl border border-slate-600 px-4 py-2.5 text-slate-100 hover:bg-slate-800/60">
              Contact via email
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-5">
            <StatusIndicator tone="online" label="Cloud and CI/CD execution" />
            <StatusIndicator tone="online" label="Deployment and reliability baseline" />
          </div>
        </div>
      </HeroShell>

      <PageShell>
        <section aria-label="BUILD capabilities">
          <SectionHeader
            eyebrow="Section 2"
            title="Approved BUILD capabilities"
            description="Capabilities in this section are implemented from the approved BUILD scope in the v2 specification."
          />
          <Grid cols="2">
            {BUILD_CAPABILITIES.map((capability) => (
              <ServiceCard
                key={capability.title}
                pillar="build"
                title={capability.title}
                description={capability.description}
                examples={[capability.value]}
                icon={capability.icon}
              />
            ))}
          </Grid>
        </section>

        <section className="mt-16" aria-label="Infrastructure workflow">
          <SectionHeader
            eyebrow="Section 3"
            title="Infrastructure workflow"
            description="A BUILD engagement follows a defined lifecycle from discovery through handover and optional ongoing support."
          />
          <Grid cols="3">
            {BUILD_WORKFLOW.map((step, index) => (
              <Card key={step} className="h-full">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Step {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-100">{step}</h3>
              </Card>
            ))}
          </Grid>
          <p className="mt-5 text-sm text-slate-300">
            The observation stage is part of the purchased implementation engagement and is used for stabilization, optimization, documentation readiness, and handover quality.
          </p>
        </section>

        <section className="mt-16" aria-label="Technical areas">
          <SectionHeader
            eyebrow="Section 4"
            title="Technical areas covered"
            description="BUILD focuses on practical technical delivery areas supported by the approved specification and lifecycle model."
          />
          <Grid cols="3">
            <Card className="h-full">
              <ServerCog size={18} className="text-cyan-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Cloud infrastructure and deployment automation</h3>
              <p className="mt-2 text-sm text-slate-300">Environment architecture, deployment workflow design, and controlled release execution.</p>
            </Card>
            <Card className="h-full">
              <PackageCheck size={18} className="text-cyan-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">CI/CD and infrastructure-as-code practices</h3>
              <p className="mt-2 text-sm text-slate-300">Pipeline standards and repeatable infrastructure definitions that improve delivery consistency.</p>
            </Card>
            <Card className="h-full">
              <Radar size={18} className="text-cyan-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Monitoring, reliability, and security-oriented operations</h3>
              <p className="mt-2 text-sm text-slate-300">Operational visibility and baseline controls that support stable handover and ongoing operations.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Who BUILD is for">
          <SectionHeader
            eyebrow="Section 5"
            title="Who BUILD is for"
            description="BUILD supports projects at multiple maturity stages and is not restricted by team size."
          />
          <Grid cols="4">
            <Card><h3 className="text-lg font-semibold text-slate-100">Early-stage projects</h3><p className="mt-2 text-sm text-slate-300">Need reliable infrastructure foundations before scaling product delivery.</p></Card>
            <Card><h3 className="text-lg font-semibold text-slate-100">Growing projects</h3><p className="mt-2 text-sm text-slate-300">Require stronger CI/CD, deployment, and operational structure to reduce bottlenecks.</p></Card>
            <Card><h3 className="text-lg font-semibold text-slate-100">Established teams</h3><p className="mt-2 text-sm text-slate-300">Need targeted modernization, reliability baselines, or managed delivery support.</p></Card>
            <Card><h3 className="text-lg font-semibold text-slate-100">Larger programs</h3><p className="mt-2 text-sm text-slate-300">Need cross-team alignment and phased implementation across complex environments.</p></Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Engagement model">
          <SectionHeader
            eyebrow="Section 6"
            title="BUILD engagement model"
            description="BUILD can be purchased based on project requirements and combined with other approved categories."
          />
          <Grid cols="3">
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Category-first or multi-service</h3>
              <p className="mt-2 text-sm text-slate-300">Start with BUILD only, or combine BUILD with AUTOMATE, OPERATE, and GROW as needed.</p>
            </Card>
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Implementation, monthly, or annual</h3>
              <p className="mt-2 text-sm text-slate-300">Support implementation/project-based execution plus optional monthly or annual managed continuation.</p>
            </Card>
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Custom and enterprise options</h3>
              <p className="mt-2 text-sm text-slate-300">Custom scope and phased enterprise composition are available when broader operational programs are required.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Observation and handover">
          <Container className="bw-shell p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="info">Section 7</Badge>
              <StatusIndicator tone="online" label="Observation plus handover" />
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-slate-100 sm:text-4xl">Observation, stabilization, documentation, handover</h2>
            <p className="mt-4 max-w-3xl text-slate-300">
              After implementation and deployment, BlockWaveLab observes delivered infrastructure for the agreed observation period, performs required stabilization and optimization work, prepares documentation and runbook context, then transitions ownership through formal handover.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              This observation period is part of the purchased implementation lifecycle and is not unlimited free support.
            </p>
          </Container>
        </section>

        <section className="mt-16" aria-label="BUILD call to action">
          <Container className="bw-shell bw-grid-noise p-8 sm:p-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Section 8</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-100 sm:text-4xl">Start with BUILD</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Discuss your infrastructure requirements and define a practical BUILD package aligned to your project lifecycle.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button onClick={() => onNavigate('/operate')}>Explore the right package</Button>
              <Button variant="secondary" onClick={() => onNavigate('/')}>Return to homepage</Button>
              <Link href="mailto:hello@blockwavelab.com" className="inline-flex items-center rounded-xl border border-slate-600 px-4 py-2.5 text-slate-100 hover:bg-slate-800/60">
                Contact: hello@blockwavelab.com
              </Link>
            </div>
          </Container>
        </section>
      </PageShell>
    </div>
  );
}
