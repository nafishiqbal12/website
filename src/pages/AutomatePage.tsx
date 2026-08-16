import {
  Bot,
  ClipboardList,
  GitFork,
  Handshake,
  MessageCircleReply,
  MessagesSquare,
  Sparkles,
  Workflow,
} from 'lucide-react';
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

type AutomatePageProps = {
  onNavigate: (target: string) => void;
};

const AUTOMATE_CAPABILITIES = [
  {
    title: 'AI-assisted workflow design for delivery and operations',
    description:
      'Design automation around delivery and operations workflows where repetitive steps can be standardized safely.',
    value: 'Practical value: reduced manual repetition and clearer operational flow design.',
    icon: <Workflow size={18} aria-hidden="true" />,
  },
  {
    title: 'Internal agent task orchestration',
    description:
      'Coordinate internal agent-assisted tasks with defined boundaries for project-specific operational use cases.',
    value: 'Practical value: repeatable task handling with project-level control and consistency.',
    icon: <Bot size={18} aria-hidden="true" />,
  },
  {
    title: 'Automation for reporting, triage, and routine operational flows',
    description:
      'Automate recurring operational reporting and triage paths to improve responsiveness for routine work.',
    value: 'Practical value: faster routine processing and improved team focus on higher-value tasks.',
    icon: <ClipboardList size={18} aria-hidden="true" />,
  },
  {
    title: 'Human-in-the-loop checkpoints for high-impact actions',
    description:
      'Apply explicit approval checkpoints before high-impact or sensitive operational actions are executed.',
    value: 'Practical value: better governance and reduced risk in automation-heavy workflows.',
    icon: <Handshake size={18} aria-hidden="true" />,
  },
  {
    title: 'Prompt and policy versioning for controlled automation',
    description:
      'Maintain versioned prompt and policy controls to support consistency, traceability, and safer iteration.',
    value: 'Practical value: stronger control over automation behavior as workflows evolve.',
    icon: <GitFork size={18} aria-hidden="true" />,
  },
] as const;

const AUTOMATION_FLOW = [
  'Project requirements',
  'Workflow analysis',
  'Automation design',
  'Implementation',
  'Testing',
  'Deployment',
  'Observation',
  'Optimization',
  'Documentation',
  'Handover',
] as const;

export default function AutomatePage({ onNavigate }: AutomatePageProps) {
  return (
    <div className="pt-16">
      <HeroShell tone="automate" aria-label="AUTOMATE hero section">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="bg-indigo-500/15 text-indigo-100 border-indigo-300/35">AUTOMATE</Badge>
          <h1 className="mt-5 text-balance text-4xl font-semibold text-slate-100 sm:text-5xl">
            AI Automation and AI Agents for Web3 Workflow Operations
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-slate-300 sm:text-lg">
            BlockWaveLab helps teams automate repetitive operational and workflow tasks with project-specific AI-powered systems designed for practical execution and governance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={() => onNavigate('/operate')}>Discuss an automation requirement</Button>
            <Button variant="outline" onClick={() => onNavigate('/build')}>See adjacent BUILD lane</Button>
            <Link href="mailto:hello@blockwavelab.com" className="inline-flex items-center rounded-xl border border-slate-600 px-4 py-2.5 text-slate-100 hover:bg-slate-800/60">
              Contact via email
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-5">
            <StatusIndicator tone="online" label="AI workflow automation design" />
            <StatusIndicator tone="online" label="Human approval checkpoints" />
          </div>
        </div>
      </HeroShell>

      <PageShell>
        <section aria-label="Automation capabilities">
          <SectionHeader
            eyebrow="Section 2"
            title="Approved AUTOMATE capabilities"
            description="Capabilities in this section follow the approved AUTOMATE scope from the BlockWaveLab v2 specification."
          />
          <Grid cols="2">
            {AUTOMATE_CAPABILITIES.map((capability) => (
              <ServiceCard
                key={capability.title}
                pillar="automate"
                title={capability.title}
                description={capability.description}
                examples={[capability.value]}
                icon={capability.icon}
              />
            ))}
          </Grid>
        </section>

        <section className="mt-16" aria-label="AI agent concept">
          <SectionHeader
            eyebrow="Section 3"
            title="AI agent concept"
            description="AI agents are designed for specific project workflows to assist repetitive tasks while governance remains explicit."
          />
          <Grid cols="2">
            <Card className="h-full">
              <div className="mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/20 text-indigo-200">
                <Sparkles size={18} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">What the model supports</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Answering common community questions with approved project information</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Assisting routine community and content workflows</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Supporting repetitive operational processes with defined boundaries</span></li>
              </ul>
            </Card>
            <Alert title="Human-governed automation" tone="info">
              AI automation is used to reduce repetitive workload and improve response speed so human teams can focus on strategy, sensitive situations, approvals, and exceptions.
            </Alert>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Project-specific automation flow">
          <SectionHeader
            eyebrow="Section 4"
            title="Project-specific automation lifecycle"
            description="Automation is scoped around client requirements and delivered through a structured lifecycle, then stabilized and handed over."
          />
          <Grid cols="3">
            {AUTOMATION_FLOW.map((step, index) => (
              <Card key={step} className="h-full">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">Step {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-100">{step}</h3>
              </Card>
            ))}
          </Grid>
        </section>

        <section className="mt-16" aria-label="Automation examples">
          <SectionHeader
            eyebrow="Section 5"
            title="Automation concept examples"
            description="These are concept examples to illustrate delivery patterns, not turnkey product claims or pre-built integrations in this phase."
          />
          <Grid cols="3">
            <Card className="h-full">
              <MessageCircleReply size={18} className="text-indigo-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Community AI Assistant</h3>
              <p className="mt-2 text-sm text-slate-300">Project-specific assistant flows for common community questions and approved information responses.</p>
            </Card>
            <Card className="h-full">
              <MessagesSquare size={18} className="text-indigo-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Social Content Workflow</h3>
              <p className="mt-2 text-sm text-slate-300">Automation support for content drafting, review coordination, and scheduled publishing operations.</p>
            </Card>
            <Card className="h-full">
              <ClipboardList size={18} className="text-indigo-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-slate-100">Operational Assistant</h3>
              <p className="mt-2 text-sm text-slate-300">AI-assisted repetitive operational information workflows and routine process support.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Human and AI model">
          <SectionHeader
            eyebrow="Section 6"
            title="Human + AI operating model"
            description="Automation supports teams by handling repetitive tasks while people retain responsibility for high-value decisions and risk-sensitive contexts."
          />
          <Grid cols="2">
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">AI handles repetitive execution</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Routine triage and information workflows</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Repeatable content and community operations support</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Operational task acceleration where rules are defined</span></li>
              </ul>
            </Card>
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Human teams handle critical judgment</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Strategic decisions and exceptions</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Sensitive situations and high-value communication</span></li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-cyan-300">•</span><span>Approvals for high-impact actions</span></li>
              </ul>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Who AUTOMATE is for">
          <SectionHeader
            eyebrow="Section 7"
            title="Who AUTOMATE is for"
            description="AUTOMATE is useful across project sizes when workflow complexity and operational repetition begin to slow teams down."
          />
          <Grid cols="4">
            <Card><h3 className="text-lg font-semibold text-slate-100">Small projects</h3><p className="mt-2 text-sm text-slate-300">Need practical automation for recurring tasks without overbuilding systems.</p></Card>
            <Card><h3 className="text-lg font-semibold text-slate-100">Growing startups</h3><p className="mt-2 text-sm text-slate-300">Need workflow standardization as team volume and operational pressure increase.</p></Card>
            <Card><h3 className="text-lg font-semibold text-slate-100">Established projects</h3><p className="mt-2 text-sm text-slate-300">Need governed automation to reduce repetitive workload across mature operations.</p></Card>
            <Card><h3 className="text-lg font-semibold text-slate-100">Larger organizations</h3><p className="mt-2 text-sm text-slate-300">Need scalable automation patterns aligned to cross-team controls and approvals.</p></Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Engagement model">
          <SectionHeader
            eyebrow="Section 8"
            title="AUTOMATE engagement model"
            description="Automation support can be purchased as focused implementation, multi-service scope, or ongoing managed engagement based on requirements."
          />
          <Grid cols="3">
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Focused automation scope</h3>
              <p className="mt-2 text-sm text-slate-300">Address a specific automation requirement with project-based implementation scope.</p>
            </Card>
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Multi-service composition</h3>
              <p className="mt-2 text-sm text-slate-300">Combine AUTOMATE with BUILD, OPERATE, and GROW when cross-functional execution is needed.</p>
            </Card>
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Monthly, annual, and enterprise options</h3>
              <p className="mt-2 text-sm text-slate-300">Continue with monthly or annual managed support, including custom enterprise engagement paths.</p>
            </Card>
          </Grid>
        </section>

        <section className="mt-16" aria-label="Observation and handover">
          <Container className="bw-shell p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-indigo-500/15 text-indigo-100 border-indigo-300/35">Section 9</Badge>
              <StatusIndicator tone="online" label="Observation plus handover" />
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-slate-100 sm:text-4xl">Observation, stabilization, documentation, handover</h2>
            <p className="mt-4 max-w-3xl text-slate-300">
              After automation implementation and deployment, BlockWaveLab observes the delivered system for the agreed observation period, performs required stabilization and optimization actions, prepares documentation, and completes formal handover.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              This observation period is included in the purchased implementation lifecycle and does not imply open-ended support beyond agreed scope.
            </p>
          </Container>
        </section>

        <section className="mt-16" aria-label="AUTOMATE call to action">
          <Container className="bw-shell bw-grid-noise p-8 sm:p-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Section 10</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-100 sm:text-4xl">Start with AUTOMATE</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Discuss an automation requirement, design a project-specific AI agent workflow, and define the right implementation path.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button onClick={() => onNavigate('/operate')}>Explore automation options</Button>
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
