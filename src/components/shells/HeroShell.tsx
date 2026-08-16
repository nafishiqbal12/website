import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Container } from '../ui';
import { cn } from '../../lib/cn';

type HeroTone = 'build' | 'automate' | 'operate' | 'grow' | 'neutral';

type HeroShellProps = {
  children: ReactNode;
  className?: string;
  tone?: HeroTone;
} & ComponentPropsWithoutRef<'section'>;

const TONE_CLASS: Record<HeroTone, string> = {
  build: 'before:from-cyan-400/25 before:via-blue-500/10 before:to-transparent',
  automate: 'before:from-indigo-400/25 before:via-sky-500/10 before:to-transparent',
  operate: 'before:from-emerald-400/25 before:via-teal-500/10 before:to-transparent',
  grow: 'before:from-violet-400/25 before:via-fuchsia-500/10 before:to-transparent',
  neutral: 'before:from-slate-300/20 before:via-slate-500/10 before:to-transparent',
};

export function HeroShell({
  children,
  className,
  tone = 'neutral',
  ...props
}: HeroShellProps) {
  return (
    <section
      {...props}
      className={cn(
        'relative overflow-hidden py-16 sm:py-20 lg:py-24',
        'before:pointer-events-none before:absolute before:-top-40 before:left-1/2 before:h-[24rem] before:w-[24rem] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:blur-3xl before:content-[""]',
        TONE_CLASS[tone],
        className,
      )}
    >
      <Container className="relative">{children}</Container>
    </section>
  );
}
