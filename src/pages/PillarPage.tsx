import { ArrowRight } from 'lucide-react';
import { HeroShell, PageShell } from '../components/shells';
import {
  Badge,
  Button,
  Container,
  Grid,
  SectionHeader,
  StatusIndicator,
} from '../components/ui';
import type { PillarKey } from '../lib/design/pillars';
import { PILLAR_ORDER, PILLAR_THEMES } from '../lib/design/pillars';

type Pillar = 'build' | 'automate' | 'operate' | 'grow';

type PillarPageProps = {
  pillar: Pillar;
  onNavigate: (target: string) => void;
};

const PILLAR_CONTENT: Record<
  Pillar,
  {
    eyebrow: string;
    title: string;
    summary: string;
    points: string[];
  }
> = {
  build: {
    eyebrow: 'BUILD',
    title: 'DevOps and Cloud Infrastructure',
    summary:
      'Design and implement reliable infrastructure foundations for Web3 teams to build and ship with confidence.',
    points: [
      'Cloud and environment architecture',
      'CI/CD and release pipeline setup',
      'Deployment readiness and reliability baselines',
    ],
  },
  automate: {
    eyebrow: 'AUTOMATE',
    title: 'AI Agents and Workflow Automation',
    summary:
      'Automate repetitive operational workflows with governed AI-assisted execution and human oversight where needed.',
    points: [
      'Workflow automation design',
      'Agent-assisted task orchestration',
      'Approval checkpoints for high-impact actions',
    ],
  },
  operate: {
    eyebrow: 'OPERATE',
    title: 'Managed DevOps and AI Operations',
    summary:
      'Operate production systems with structured delivery, incident response, and ongoing optimization support.',
    points: [
      'Managed deployment and release operations',
      'Operational reliability and response workflows',
      'Continuous stabilization and optimization support',
    ],
  },
  grow: {
    eyebrow: 'GROW',
    title: 'Growth, Content and Community',
    summary:
      'Align growth execution with product and operations maturity using practical content and community systems.',
    points: [
      'Growth execution aligned with delivery readiness',
      'Content operations for technical authority',
      'Community workflows connected to product adoption',
    ],
  },
};

export default function PillarPage({ pillar, onNavigate }: PillarPageProps) {
  const content = PILLAR_CONTENT[pillar];
  const tone: Record<Pillar, 'build' | 'automate' | 'operate' | 'grow'> = {
    build: 'build',
    automate: 'automate',
    operate: 'operate',
    grow: 'grow',
  };

  const currentTheme = PILLAR_THEMES[pillar as PillarKey];

  return (
    <div className="pt-16">
      <HeroShell tone={tone[pillar]} aria-label={`${content.eyebrow} overview`}>
        <div className="mx-auto max-w-4xl text-center">
          <Badge className={currentTheme.chipClass}>{content.eyebrow}</Badge>
          <h1 className="mt-5 text-4xl font-semibold text-slate-100 sm:text-5xl">{content.title}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-slate-300 sm:text-lg">{content.summary}</p>
          <div className="mt-6 flex justify-center">
            <StatusIndicator tone="online" label="Execution lane ready" />
          </div>
        </div>
      </HeroShell>

      <PageShell>
        <section aria-label={`${content.eyebrow} capabilities`}>
          <SectionHeader
            eyebrow={`${content.eyebrow} Capabilities`}
            title="Designed for delivery, reliability, and scaling"
            description="Each lane is implementation-oriented and can run independently or as part of a full stack engagement."
          />
          <Grid cols="3">
            {content.points.map((point) => (
              <article key={point} className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
                <p className="font-semibold text-slate-100">{point}</p>
              </article>
            ))}
          </Grid>
        </section>

        <section className="mt-14" aria-label="Cross pillar navigation">
          <Container className="bw-shell p-8 text-center">
            <h2 className="text-2xl font-semibold text-slate-100 mb-3">Build. Automate. Operate. Grow.</h2>
            <p className="text-slate-300 mb-6">
              Start with one service category or combine multiple categories based on project needs.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {PILLAR_ORDER.map((item) => (
                <Button
                  key={item}
                  variant={item === pillar ? 'primary' : 'outline'}
                  onClick={() => onNavigate(`/${item}`)}
                >
                  {PILLAR_THEMES[item].label}
                </Button>
              ))}
            </div>
            <div className="mx-auto mt-8 max-w-xl rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-left">
              <p className="text-sm text-slate-300">Next recommended lane</p>
              <button
                onClick={() => {
                  const currentIndex = PILLAR_ORDER.indexOf(pillar as PillarKey);
                  const nextKey = PILLAR_ORDER[(currentIndex + 1) % PILLAR_ORDER.length];
                  onNavigate(`/${nextKey}`);
                }}
                className="bw-focus mt-2 inline-flex items-center gap-2 text-slate-100 hover:text-cyan-300"
              >
                Explore follow-up lane
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </Container>
        </section>
      </PageShell>
    </div>
  );
}
