import {
  Activity,
  ClipboardList,
  Gauge,
  LifeBuoy,
  Radar,
  Siren,
  Wrench,
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

type OperatePageProps = {
  onNavigate: (target: string) => void;
};

const OPERATE_CAPABILITIES = [
  {
    title: 'Managed deployment and release operations',
    description:
      'Support production release execution with controlled operational procedures after implementation delivery.',
    value: 'Practical value: more predictable release handling and improved operational continuity.',
    icon: <Activity size={18} aria-hidden="true" />,
  },
  {
    title: 'Incident response coordination and runbook execution',
    description:
      'Coordinate incident-oriented response flows using defined runbooks and clear operational ownership paths.',
    value: 'Practical value: faster structured responses for operational issues and interruptions.',
    icon: <Siren size={18} aria-hidden="true" />,
  },
  {
    title: 'Performance and reliability operations',
    description:
      'Apply ongoing reliability-oriented operational practices to keep delivery and runtime behavior stable.',
    value: 'Practical value: stronger operational consistency as project workloads evolve.',
    icon: <Gauge size={18} aria-hidden="true" />,
  },
  {
    title: 'Change-management and operational governance',
    description:
      'Guide operational changes through controlled governance practices and documented procedures.',
    value: 'Practical value: reduced change risk and better alignment across internal teams.',
    icon: <ClipboardList size={18} aria-hidden="true" />,
  },
  {
    title: 'Ongoing AI operations support for deployed automations',
    description:
      'Support day-to-day operations for deployed automation systems within agreed managed-service scope.',
    value: 'Practical value: steadier automation operations and clearer support pathways over time.',
    icon: <Wrench size={18} aria-hidden="true" />,
  },
] as const;

const OPERATE_LIFECYCLE = [
  'Implementation',
  'Deployment',
  'Observation',
  'Stabilization',
  'Documentation',
  'Handover',
  'Optional ongoing support',
] as const;

export default function OperatePage({ onNavigate }: OperatePageProps) {
  return (
    <div className="pt-16">
      <HeroShell tone="operate" aria-label="OPERATE hero section">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="bg-emerald-500/15 text-emerald-100 border-emerald-300/35">OPERATE</Badge>
          <h1 className="mt-5 text-balance text-4xl font-semibold text-slate-100 sm:text-5xl">
            Technical Operations, Monitoring, and Ongoing Support
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-slate-300 sm:text-lg">
            BlockWaveLab provides ongoing technical operations support for projects that need continued operational assistance after implementation and handover milestones.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={() => onNavigate('/grow')}>Discuss ongoing operations</Button>
            <Button variant="outline" onClick={() => onNavigate('/build')}>See BUILD foundation</Button>
            <Link href="mailto:hello@blockwavelab.com" className="inline-flex items-center rounded-xl border border-slate-600 px-4 py-2.5 text-slate-100 hover:bg-slate-800/60">
              Contact via email
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-5">
            <StatusIndicator tone="online" label="Operational continuity support" />
            <StatusIndicator tone="online" label="Monitoring and reliability focus" />
          </div>
        </div>
      </HeroShell>

      <PageShell>
        <section aria-label="Operations capabilities">
          <SectionHeader
            eyebrow="Section 2"
            title="Approved OPERATE capabilities"
            description="Capabilities in this section follow the approved OPERATE scope from the BlockWaveLab v2 specification."
          />
          <Grid cols="2">
            {OPERATE_CAPABILITIES.map((capability) => (
              <ServiceCard
                key={capability.title}
                pillar="operate"
                title={capability.title}
                description={capability.description}
                examples={[capability.value]}
                icon={capability.icon}
              />
            ))}
          </Grid>
        </section>

        <section className="mt-16" aria-label="Monitoring concept">
          <SectionHeader
            eyebrow="Section 3"
            title="Monitoring as an operational visibility layer"
            description="Monitoring is addressed as a high-level operational practice to improve visibility and issue awareness during delivery and managed operations."
          />
          <Grid cols="3">
            <Card className="h-full">
              <Radar size={18} className="text-emerald-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">System health visibility</h3>
              <p className="mt-2 text-sm text-slate-300">Operational visibility into runtime behavior helps teams identify patterns and prioritize responses.</p>
            </Card>
            <Card className="h-full">
              <Activity size={18} className="text-emerald-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Deployment awareness</h3>
              <p className="mt-2 text-sm text-slate-300">Operational teams maintain awareness around release behavior and environment status during change windows.</p>
            </Card>
            <Card className="h-full">
              <LifeBuoy size={18} className="text-emerald-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Issue detection support</h3>
              <p className="mt-2 text-sm text-slate-300">Structured detection and response workflows help teams act earlier when operational issues appear.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Ongoing support model">
          <SectionHeader
            eyebrow="Section 4"
            title="Ongoing support after implementation"
            description="Teams can continue with BlockWaveLab after implementation and handover when ongoing technical operations support is required."
          />
          <Grid cols="2">
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">What ongoing support can include</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Continued technical assistance</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Operational guidance and maintenance support</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Troubleshooting and ongoing optimization where applicable</span></li>
              </ul>
            </Card>
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Support framing</h3>
              <p className="mt-2 text-sm text-slate-300">Support scope is aligned to agreed engagement terms and operational requirements, with continuation defined by explicit managed-service agreement.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Project lifecycle alignment">
          <SectionHeader
            eyebrow="Section 5"
            title="OPERATE in the project lifecycle"
            description="OPERATE connects post-implementation operations to long-term continuity with clear lifecycle boundaries."
          />
          <Grid cols="3">
            {OPERATE_LIFECYCLE.map((step, index) => (
              <Card key={step} className="h-full">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Step {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-100">{step}</h3>
              </Card>
            ))}
          </Grid>
          <p className="mt-5 text-sm text-slate-300">Implementation engagement and optional ongoing OPERATE service are distinct lifecycle stages with separate continuation decisions.</p>
        </section>

        <section className="mt-16" aria-label="Who OPERATE is for">
          <SectionHeader
            eyebrow="Section 6"
            title="Who OPERATE is for"
            description="OPERATE supports teams across sizes when operational complexity and continuity requirements increase."
          />
          <Grid cols="4">
            <Card><h3 className="text-lg font-semibold text-slate-100">Small projects</h3><p className="mt-2 text-sm text-slate-300">Need structured operations support without building a large internal operations team immediately.</p></Card>
            <Card><h3 className="text-lg font-semibold text-slate-100">Growing projects</h3><p className="mt-2 text-sm text-slate-300">Need operational consistency as release velocity and infrastructure complexity expand.</p></Card>
            <Card><h3 className="text-lg font-semibold text-slate-100">Established projects</h3><p className="mt-2 text-sm text-slate-300">Need dedicated reliability-oriented support and operational governance reinforcement.</p></Card>
            <Card><h3 className="text-lg font-semibold text-slate-100">Larger programs</h3><p className="mt-2 text-sm text-slate-300">Need coordinated operations practices across broader delivery and support surfaces.</p></Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Engagement model">
          <SectionHeader
            eyebrow="Section 7"
            title="OPERATE engagement model"
            description="OPERATE can be purchased based on operational requirements as standalone support or as part of multi-service execution."
          />
          <Grid cols="3">
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Individual or project-based scope</h3>
              <p className="mt-2 text-sm text-slate-300">Address a specific operations requirement through scoped support engagement.</p>
            </Card>
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Monthly and annual support</h3>
              <p className="mt-2 text-sm text-slate-300">Continue with optional monthly or annual managed service aligned to delivery and support needs.</p>
            </Card>
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Multi-service and enterprise options</h3>
              <p className="mt-2 text-sm text-slate-300">Combine OPERATE with BUILD, AUTOMATE, and GROW via phased multi-service or custom enterprise models.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Observation versus ongoing service">
          <Container className="bw-shell p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-emerald-500/15 text-emerald-100 border-emerald-300/35">Section 8</Badge>
              <StatusIndicator tone="online" label="Observation vs ongoing service" />
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-slate-100 sm:text-4xl">Observation is implementation lifecycle scope</h2>
            <p className="mt-4 max-w-3xl text-slate-300">Observation is part of the purchased implementation engagement and supports stabilization, optimization, documentation, and handover completion.</p>
            <p className="mt-3 max-w-3xl text-slate-300">After handover, ongoing OPERATE service is optional and requires explicit continuation based on project requirements.</p>
          </Container>
        </section>

        <section className="mt-16" aria-label="OPERATE call to action">
          <Container className="bw-shell bw-grid-noise p-8 sm:p-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Section 9</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-100 sm:text-4xl">Start with OPERATE</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">Discuss operational requirements, evaluate monitoring and support priorities, and define the right ongoing service path.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button onClick={() => onNavigate('/automate')}>Explore monitoring and support</Button>
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
