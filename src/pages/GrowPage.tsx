import {
  ArrowRightLeft,
  BookOpenCheck,
  CircleDot,
  Compass,
  Gauge,
  MessagesSquare,
  Network,
  Scale,
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

type GrowPageProps = {
  onNavigate: (target: string) => void;
};

const GROW_CAPABILITIES = [
  {
    title: 'Technical growth systems tied to product and operations readiness',
    description:
      'Structure growth work around product maturity, delivery readiness, and the operational systems that support sustainable expansion.',
    value: 'Practical value: growth priorities stay connected to what the project can reliably deliver.',
    icon: <Compass size={18} aria-hidden="true" />,
  },
  {
    title: 'Content operations for authority and trust',
    description:
      'Build repeatable content operations that communicate technical context clearly and support trust with the project audience.',
    value: 'Practical value: more consistent authority-building content aligned with project readiness.',
    icon: <BookOpenCheck size={18} aria-hidden="true" />,
  },
  {
    title: 'Community operations and enablement workflows',
    description:
      'Create practical community workflows that help teams share information, coordinate enablement, and support project understanding.',
    value: 'Practical value: clearer community operations without turning GROW into a channel-specific agency model.',
    icon: <MessagesSquare size={18} aria-hidden="true" />,
  },
  {
    title: 'Demand support integrated with delivery lifecycle',
    description:
      'Coordinate demand support with implementation, deployment, observation, stabilization, and operational readiness.',
    value: 'Practical value: demand activity is better matched to actual delivery capacity and lifecycle timing.',
    icon: <Gauge size={18} aria-hidden="true" />,
  },
  {
    title: 'Cross-functional feedback loops between growth and operations',
    description:
      'Connect feedback from growth and operations so project teams can identify friction, opportunities, and readiness gaps.',
    value: 'Practical value: decisions improve through shared context across delivery and growth work.',
    icon: <ArrowRightLeft size={18} aria-hidden="true" />,
  },
] as const;

const GROW_LIFECYCLE = [
  'Implementation',
  'Deployment',
  'Observation',
  'Stabilization',
  'Documentation',
  'Handover',
  'Optional ongoing service',
] as const;

export default function GrowPage({ onNavigate }: GrowPageProps) {
  return (
    <div className="pt-16">
      <HeroShell tone="grow" aria-label="GROW hero section">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="bg-violet-500/15 text-violet-100 border-violet-300/35">GROW</Badge>
          <h1 className="mt-5 text-balance text-4xl font-semibold text-slate-100 sm:text-5xl">
            Growth, Content, and Community Systems for Web3 Projects
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-slate-300 sm:text-lg">
            BlockWaveLab helps projects improve and expand through growth systems connected to product readiness, automation, operations, and delivery lifecycle context.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={() => onNavigate('/operate')}>Discuss growth requirements</Button>
            <Button variant="outline" onClick={() => onNavigate('/automate')}>See AUTOMATE connection</Button>
            <Link href="mailto:hello@blockwavelab.com" className="inline-flex items-center rounded-xl border border-slate-600 px-4 py-2.5 text-slate-100 hover:bg-slate-800/60">
              Contact via email
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-5">
            <StatusIndicator tone="online" label="Delivery-aligned growth systems" />
            <StatusIndicator tone="online" label="Content and community operations" />
          </div>
        </div>
      </HeroShell>

      <PageShell>
        <section aria-label="GROW capabilities">
          <SectionHeader
            eyebrow="Section 2"
            title="Approved GROW capabilities"
            description="GROW is the growth-oriented part of the BlockWaveLab model, focused on systems that connect growth work with product and operations readiness."
          />
          <Grid cols="2">
            {GROW_CAPABILITIES.map((capability) => (
              <ServiceCard
                key={capability.title}
                pillar="grow"
                title={capability.title}
                description={capability.description}
                examples={[capability.value]}
                icon={capability.icon}
              />
            ))}
          </Grid>
        </section>

        <section className="mt-16" aria-label="Growth through better systems">
          <SectionHeader
            eyebrow="Section 3"
            title="Growth through better systems"
            description="GROW is not a separate agency layer. It helps projects use their technical foundation, automation, and operations context to make better growth decisions."
          />
          <Grid cols="4">
            <Card className="h-full">
              <Network size={18} className="text-violet-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">BUILD foundation</h3>
              <p className="mt-2 text-sm text-slate-300">Technical delivery foundations give growth work a more reliable base.</p>
            </Card>
            <Card className="h-full">
              <CircleDot size={18} className="text-violet-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">AUTOMATE repetition</h3>
              <p className="mt-2 text-sm text-slate-300">Automation can support repeatable content and community workflows.</p>
            </Card>
            <Card className="h-full">
              <Gauge size={18} className="text-violet-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">OPERATE continuity</h3>
              <p className="mt-2 text-sm text-slate-300">Operational context helps growth timing stay aligned with delivery reality.</p>
            </Card>
            <Card className="h-full">
              <Scale size={18} className="text-violet-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">GROW expansion</h3>
              <p className="mt-2 text-sm text-slate-300">Growth systems connect audience, content, community, and operational feedback.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Automation and operational efficiency">
          <SectionHeader
            eyebrow="Section 4"
            title="Automation-enabled growth operations"
            description="GROW can use the wider BlockWaveLab foundation to reduce repeated work and improve coordination without promising unsupported outcomes."
          />
          <Grid cols="2">
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Where automation can help</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Repeatable content operations and review workflows</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Community enablement and information workflows</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Feedback collection between growth and operations teams</span></li>
              </ul>
            </Card>
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">What remains important</h3>
              <p className="mt-2 text-sm text-slate-300">Human teams still set direction, review context, handle exceptions, and decide how growth support should fit the project lifecycle.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Project growth support">
          <SectionHeader
            eyebrow="Section 5"
            title="Project growth support tied to readiness"
            description="Growth support is most useful when it reflects what the project can explain, deliver, operate, and improve."
          />
          <Grid cols="3">
            <Card className="h-full">
              <BookOpenCheck size={18} className="text-violet-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Authority and trust</h3>
              <p className="mt-2 text-sm text-slate-300">Content operations can make technical context easier to understand and maintain consistently.</p>
            </Card>
            <Card className="h-full">
              <MessagesSquare size={18} className="text-violet-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Community enablement</h3>
              <p className="mt-2 text-sm text-slate-300">Community workflows can support information sharing and coordinated project understanding.</p>
            </Card>
            <Card className="h-full">
              <ArrowRightLeft size={18} className="text-violet-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Delivery feedback</h3>
              <p className="mt-2 text-sm text-slate-300">Cross-functional feedback loops help teams identify where growth and operations need better alignment.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Who GROW is for">
          <SectionHeader
            eyebrow="Section 6"
            title="Who GROW is for"
            description="GROW is useful across project sizes when growth complexity and delivery readiness need to be coordinated."
          />
          <Grid cols="4">
            <Card><h3 className="text-lg font-semibold text-slate-100">Small projects</h3><p className="mt-2 text-sm text-slate-300">Need a practical way to connect early growth work with product and delivery readiness.</p></Card>
            <Card><h3 className="text-lg font-semibold text-slate-100">Growing projects</h3><p className="mt-2 text-sm text-slate-300">Need repeatable content, community, and feedback workflows as execution expands.</p></Card>
            <Card><h3 className="text-lg font-semibold text-slate-100">Established projects</h3><p className="mt-2 text-sm text-slate-300">Need better alignment between growth priorities, operational context, and product readiness.</p></Card>
            <Card><h3 className="text-lg font-semibold text-slate-100">Larger organizations</h3><p className="mt-2 text-sm text-slate-300">Need cross-functional growth systems that coordinate multiple teams and delivery stages.</p></Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Engagement model">
          <SectionHeader
            eyebrow="Section 7"
            title="GROW engagement model"
            description="GROW can be purchased as focused support or composed with the other approved categories around project requirements."
          />
          <Grid cols="3">
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Individual or project-based scope</h3>
              <p className="mt-2 text-sm text-slate-300">Address a specific growth system, content operation, community workflow, or feedback requirement.</p>
            </Card>
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Monthly and annual service</h3>
              <p className="mt-2 text-sm text-slate-300">Continue with optional monthly or annual service when ongoing growth operations support is appropriate.</p>
            </Card>
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Multi-service and enterprise options</h3>
              <p className="mt-2 text-sm text-slate-300">Combine GROW with BUILD, AUTOMATE, and OPERATE through phased or custom enterprise engagement.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Four-category relationship">
          <SectionHeader
            eyebrow="Section 8"
            title="How GROW connects with the other categories"
            description="GROW works as part of the same BlockWaveLab system rather than as an unrelated marketing service."
          />
          <Grid cols="4">
            <Card><p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">BUILD</p><h3 className="mt-2 text-lg font-semibold text-slate-100">Build the foundation</h3><p className="mt-2 text-sm text-slate-300">Create the technical systems growth work depends on.</p></Card>
            <Card><p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">AUTOMATE</p><h3 className="mt-2 text-lg font-semibold text-slate-100">Automate workflows</h3><p className="mt-2 text-sm text-slate-300">Reduce repetitive work across project and growth operations.</p></Card>
            <Card><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">OPERATE</p><h3 className="mt-2 text-lg font-semibold text-slate-100">Support continuity</h3><p className="mt-2 text-sm text-slate-300">Maintain operational context as project delivery continues.</p></Card>
            <Card><p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">GROW</p><h3 className="mt-2 text-lg font-semibold text-slate-100">Improve and expand</h3><p className="mt-2 text-sm text-slate-300">Use the combined foundation to support project growth.</p></Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Observation and handover">
          <Container className="bw-shell p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-violet-500/15 text-violet-100 border-violet-300/35">Section 9</Badge>
              <StatusIndicator tone="online" label="Observation plus handover" />
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-slate-100 sm:text-4xl">Growth support follows the same delivery lifecycle</h2>
            <p className="mt-4 max-w-3xl text-slate-300">After implementation and deployment, the delivered system is observed for the agreed observation period, stabilized and optimized as needed, documented, and handed over.</p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {GROW_LIFECYCLE.map((step, index) => (
                <div key={step} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">Step {index + 1}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">{step}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 max-w-3xl text-slate-300">Observation is part of the purchased implementation engagement. Any ongoing GROW service after handover is optional and requires explicit continuation.</p>
          </Container>
        </section>

        <section className="mt-16" aria-label="GROW call to action">
          <Container className="bw-shell bw-grid-noise p-8 sm:p-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">Section 10</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-100 sm:text-4xl">Start with GROW</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">Discuss how growth, content, community, and delivery readiness can work together within your project lifecycle.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button onClick={() => onNavigate('/operate')}>Explore the right engagement</Button>
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
