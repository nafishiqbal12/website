export type PillarKey = 'build' | 'automate' | 'operate' | 'grow';

export type PillarTheme = {
  key: PillarKey;
  label: string;
  title: string;
  subtitle: string;
  accentClass: string;
  chipClass: string;
  ringClass: string;
};

export const PILLAR_THEMES: Record<PillarKey, PillarTheme> = {
  build: {
    key: 'build',
    label: 'BUILD',
    title: 'DevOps and Cloud Infrastructure',
    subtitle: 'Infrastructure reliability and deployment foundations.',
    accentClass: 'from-cyan-500 to-blue-500',
    chipClass: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/30',
    ringClass: 'ring-cyan-400/35',
  },
  automate: {
    key: 'automate',
    label: 'AUTOMATE',
    title: 'AI Agents and Workflow Automation',
    subtitle: 'Governed automation for repeatable technical execution.',
    accentClass: 'from-indigo-500 to-sky-500',
    chipClass: 'bg-indigo-500/15 text-indigo-100 border-indigo-300/35',
    ringClass: 'ring-indigo-400/35',
  },
  operate: {
    key: 'operate',
    label: 'OPERATE',
    title: 'Managed DevOps and AI Operations',
    subtitle: 'Production operations, incident response, and optimization.',
    accentClass: 'from-emerald-500 to-teal-500',
    chipClass: 'bg-emerald-500/15 text-emerald-100 border-emerald-300/35',
    ringClass: 'ring-emerald-400/35',
  },
  grow: {
    key: 'grow',
    label: 'GROW',
    title: 'Growth, Content and Community',
    subtitle: 'Execution systems that connect delivery and adoption.',
    accentClass: 'from-violet-500 to-fuchsia-500',
    chipClass: 'bg-violet-500/15 text-violet-100 border-violet-300/35',
    ringClass: 'ring-violet-400/35',
  },
};

export const PILLAR_ORDER: PillarKey[] = ['build', 'automate', 'operate', 'grow'];
