import { cn } from '../../lib/cn';

type StatusTone = 'online' | 'degraded' | 'offline' | 'draft';

type StatusIndicatorProps = {
  label: string;
  tone?: StatusTone;
};

const toneClass: Record<StatusTone, string> = {
  online: 'bg-emerald-400',
  degraded: 'bg-amber-400',
  offline: 'bg-rose-400',
  draft: 'bg-slate-400',
};

export function StatusIndicator({ label, tone = 'draft' }: StatusIndicatorProps) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
      <span className={cn('h-2.5 w-2.5 rounded-full', toneClass[tone])} aria-hidden="true" />
      {label}
    </span>
  );
}
