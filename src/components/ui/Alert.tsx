import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type AlertProps = {
  title: string;
  children: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'danger';
  className?: string;
};

const toneClass = {
  info: 'border-cyan-300/35 bg-cyan-500/10 text-cyan-100',
  success: 'border-emerald-300/35 bg-emerald-500/10 text-emerald-100',
  warning: 'border-amber-300/35 bg-amber-500/10 text-amber-100',
  danger: 'border-rose-300/35 bg-rose-500/10 text-rose-100',
} as const;

export function Alert({ title, children, tone = 'info', className }: AlertProps) {
  return (
    <div className={cn('rounded-xl border px-4 py-3', toneClass[tone], className)} role="status" aria-live="polite">
      <p className="font-semibold mb-1">{title}</p>
      <div className="text-sm opacity-90">{children}</div>
    </div>
  );
}
