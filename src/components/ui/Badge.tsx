import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type BadgeProps = {
  children: ReactNode;
  tone?: 'default' | 'info' | 'success' | 'warning';
  className?: string;
};

const toneClass = {
  default: 'bg-slate-800 text-slate-200 border-slate-700',
  info: 'bg-cyan-500/15 text-cyan-200 border-cyan-300/30',
  success: 'bg-emerald-500/15 text-emerald-100 border-emerald-300/35',
  warning: 'bg-amber-500/15 text-amber-100 border-amber-300/35',
} as const;

export function Badge({ children, tone = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide uppercase',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
