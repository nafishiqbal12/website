import { Bot, CloudCog, Cog, LifeBuoy, Radar, Rocket, ShieldCheck, Sparkles } from 'lucide-react';
import { HeroShell, PageShell } from '../components/shells';
import {
  Alert,
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

type HomeProps = {
  onNavigate: (target: string) => void;
};

const PILLARS = [
  {
    key: 'build',
    label: 'BUILD',
    title: 'DevOps and Cloud Infrastructure',
    description:
      'Design cloud architecture, delivery pipelines, and deployment foundations for stable technical execution.',
    examples: [
      'Cloud architecture and environment design',
      'CI/CD pipeline design and hardening',
      'Containerization and deployment workflows',
    ],
    ctaPath: '/build',
    ctaLabel: 'Open BUILD lane',
  },
  {
    key: 'automate',
    label: 'AUTOMATE',
    title: 'AI Agents and Workflow Automation',
    description:
      'Implement governed AI-assisted workflows that reduce repetitive operational work while keeping approval controls.',
    examples: [
      'AI-assisted workflow design for operations',
      'Automation for reporting, triage, and routine flows',
      'Human-in-the-loop checkpoints for high-impact actions',
    ],
    ctaPath: '/automate',
    ctaLabel: 'Open AUTOMATE lane',
  },
  {
    key: 'operate',
    label: 'OPERATE',
    title: 'Managed DevOps and AI Operations',
    description:
      'Run production systems with managed release execution, incident coordination, and operational governance.',
    examples: [
      'Managed deployment and release operations',
      'Incident response coordination and runbook execution',
      'Performance and reliability operations',
    ],
    ctaPath: '/operate',
    ctaLabel: 'Open OPERATE lane',
  },
  {
    key: 'grow',
    label: 'GROW',
    title: 'Growth, Content and Community',
    description:
      'Connect growth execution with delivery readiness through technical content and community workflows.',
    examples: [
      'Content operations for authority and trust',
      'Community operations and enablement workflows',
      'Feedback loops between growth and operations',
    ],
    ctaPath: '/grow',
    ctaLabel: 'Open GROW lane',
  },
] as const;

const LIFECYCLE_STEPS = [
  'Discovery',
  'Package/Scope',
  'Implementation',
  'Deployment',
  'Observation',
  'Optimization/Stabilization',
  'Documentation',
  'Handover',
  'Optional ongoing support',
] as const;

export default function V2Home({ onNavigate }: HomeProps) {
  return (
    <div className="pt-16">
      <HeroShell tone="build" className="pb-14 sm:pb-20" aria-label="BlockWaveLab hero">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/30 bg-cyan-500/10 px-4 py-1.5 animate-enter">
            <Sparkles size={16} className="text-cyan-300" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">BlockWaveLab</p>
          </div>
          <h1 className="mt-6 text-balance text-4xl font-bold text-slate-100 sm:text-5xl lg:text-6xl animate-enter-delay-1">
            AI Automation and DevOps Partner for Web3 Projects
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-slate-300 sm:text-lg animate-enter-delay-2">
            We help Web3 teams build infrastructure, automate workflows, operate production systems, and support growth with practical lifecycle execution.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3 animate-enter-delay-3">
            <Button onClick={() => onNavigate('/build')}>Discuss your project</Button>
            <Button variant="outline" onClick={() => onNavigate('/automate')}>Explore service lanes</Button>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-5 text-left">
            <StatusIndicator tone="online" label="BUILD and OPERATE workflows" />
            <StatusIndicator tone="online" label="AUTOMATE governance controls" />
            <StatusIndicator tone="online" label="GROW execution alignment" />
          </div>
        </div>
      </HeroShell>

      <PageShell>
        <section aria-label="Problem and value">
          <SectionHeader
            eyebrow="Problem and Value"
            title="Technical execution needs can exceed in-house bandwidth"
            description="Many projects need DevOps, cloud infrastructure, automation, monitoring, and operational support, but maintaining a full senior technical team is not always efficient. BlockWaveLab operates as a technical partner across implementation and operations lifecycle stages."
          />
          <Grid cols="2">
            <Card>
              <h3 className="text-xl font-semibold text-slate-100">What teams often face</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Delivery delays from fragmented tooling and ownership</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Operational drift between launch and day-to-day reliability</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Repetitive manual tasks that consume experienced operators</span></li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold text-slate-100">How BlockWaveLab helps</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Build resilient infrastructure and delivery baselines</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Automate routine workflows with governance controls</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Operate and optimize production systems through handover</span></li>
              </ul>
            </Card>
          </Grid>
        </section>

        <section aria-label="BlockWaveLab service categories">
          <SectionHeader
            eyebrow="Service Pillars"
            title="Four core categories"
            description="Select one category or combine multiple categories based on project stage and operational needs."
          />
          <Grid cols="2">
            {PILLARS.map((pillar) => (
              <ServiceCard
                key={pillar.key}
                pillar={pillar.key}
                title={pillar.title}
                description={pillar.description}
                examples={pillar.examples}
                ctaLabel={pillar.ctaLabel}
                onAction={() => onNavigate(pillar.ctaPath)}
                icon={
                  pillar.key === 'build' ? <CloudCog size={18} />
                  : pillar.key === 'automate' ? <Bot size={18} />
                  : pillar.key === 'operate' ? <LifeBuoy size={18} />
                  : <Rocket size={18} />
                }
              />
            ))}
          </Grid>
        </section>

        <section className="mt-16" aria-label="How the engagement works">
          <SectionHeader
            eyebrow="Lifecycle"
            title="How the engagement works"
            description="Delivery follows a defined lifecycle from initial discovery through handover and optional ongoing support."
          />
          <Grid cols="3">
            {LIFECYCLE_STEPS.map((step, index) => (
              <Card key={step} className="h-full">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Step {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-100">{step}</h3>
              </Card>
            ))}
          </Grid>
        </section>

        <section className="mt-16" aria-label="Flexible engagement model">
          <SectionHeader
            eyebrow="Engagement model"
            title="Flexible engagement options"
            description="Projects can start with a focused lane, run multi-lane implementation, or move into managed monthly, annual, or custom enterprise engagement structures."
          />
          <Grid cols="3">
            <Card className="h-full">
              <Badge tone="info">Project-based</Badge>
              <h3 className="mt-3 text-xl font-semibold text-slate-100">Implementation engagement</h3>
              <p className="mt-2 text-sm text-slate-300">One-time implementation scoped to one or multiple categories with clear delivery milestones.</p>
            </Card>
            <Card className="h-full">
              <Badge tone="success">Managed service</Badge>
              <h3 className="mt-3 text-xl font-semibold text-slate-100">Monthly or annual support</h3>
              <p className="mt-2 text-sm text-slate-300">Optional ongoing operational support after handover, aligned to your selected service categories.</p>
            </Card>
            <Card className="h-full">
              <Badge tone="warning">Custom enterprise</Badge>
              <h3 className="mt-3 text-xl font-semibold text-slate-100">Multi-team composition</h3>
              <p className="mt-2 text-sm text-slate-300">Custom engagement structure for larger programs requiring broader scope and phased expansion.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="AI automation value">
          <SectionHeader
            eyebrow="AI automation value"
            title="AI-powered operational assistance"
            description="Automation is applied to repetitive workflows so teams can respond faster and spend more time on high-impact technical decisions."
          />
          <Grid cols="2">
            <Card>
              <div className="mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/20 text-indigo-200">
                <Bot size={18} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">Automation examples</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Community assistance workflows</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Social content workflow automation</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Project-specific operational assistance</span></li>
              </ul>
            </Card>
            <Alert title="Governance-first automation" tone="info">
              Automations are implemented with approval checkpoints for high-impact actions and designed to augment teams, not remove human oversight.
            </Alert>
          </Grid>
        </section>

        <section className="mt-16" aria-label="DevOps and infrastructure value">
          <SectionHeader
            eyebrow="DevOps and Infrastructure"
            title="Production reliability capabilities"
            description="BlockWaveLab supports cloud delivery foundations and operational practices required for stable releases and continuity."
          />
          <Grid cols="3">
            <Card className="h-full">
              <CloudCog size={18} className="text-cyan-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Cloud and delivery</h3>
              <p className="mt-2 text-sm text-slate-300">Cloud infrastructure, CI/CD standards, deployment automation, and infrastructure-as-code aligned to release quality.</p>
            </Card>
            <Card className="h-full">
              <Radar size={18} className="text-emerald-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Monitoring and reliability</h3>
              <p className="mt-2 text-sm text-slate-300">Operational visibility and reliability practices that support incident response and stabilization decisions.</p>
            </Card>
            <Card className="h-full">
              <ShieldCheck size={18} className="text-violet-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Security-oriented operations</h3>
              <p className="mt-2 text-sm text-slate-300">Access baseline setup and controlled operational practices to reduce avoidable production risk.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="60-day observation model">
          <Container className="bw-shell p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="info">60-day observation model</Badge>
              <StatusIndicator tone="online" label="Post-deployment lifecycle stage" />
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-slate-100 sm:text-4xl">Observation, stabilization, documentation, handover</h2>
            <p className="mt-4 max-w-3xl text-slate-300">
              After implementation and deployment, BlockWaveLab observes system behavior for the agreed observation period, performs necessary stabilization and optimization work, prepares operational documentation, and completes formal handover. This period is part of the purchased implementation engagement.
            </p>
          </Container>
        </section>

        <section className="mt-16" aria-label="Trust and credibility">
          <SectionHeader
            eyebrow="Built for"
            title="Credibility through operating approach"
            description="BlockWaveLab is designed for teams that need disciplined execution, clear lifecycle accountability, and reusable technical systems across growth stages."
          />
          <Grid cols="3">
            <Card className="h-full">
              <Cog size={18} className="text-cyan-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Engineering-first execution</h3>
              <p className="mt-2 text-sm text-slate-300">Delivery decisions prioritize reliability, maintainability, and operational continuity.</p>
            </Card>
            <Card className="h-full">
              <LifeBuoy size={18} className="text-cyan-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Lifecycle ownership</h3>
              <p className="mt-2 text-sm text-slate-300">Engagements span implementation, deployment, observation, stabilization, and handover.</p>
            </Card>
            <Card className="h-full">
              <Rocket size={18} className="text-cyan-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Modular growth model</h3>
              <p className="mt-2 text-sm text-slate-300">Teams can start with one category and expand to multi-category execution over time.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Primary call to action">
          <Container className="bw-shell bw-grid-noise p-8 sm:p-10 text-center">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-cyan-200">Start with a suitable engagement</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-100 sm:text-4xl">Plan the right build, automate, operate, and grow path</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Discuss your project goals, review the relevant service categories, and define a practical implementation scope.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button onClick={() => onNavigate('/build')}>Discuss your project</Button>
              <Button variant="secondary" onClick={() => onNavigate('/grow')}>Explore services</Button>
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
