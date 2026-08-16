import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type CardProps = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
};

export function Card({ children, className, interactive = false }: CardProps) {
  return (
    <article
      className={cn(
        'rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_12px_24px_rgba(2,6,23,0.25)]',
        interactive && 'transition-transform duration-200 hover:-translate-y-1 hover:border-cyan-400/40',
        className,
      )}
    >
      {children}
    </article>
  );
}
