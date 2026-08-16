import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type GridProps = {
  children: ReactNode;
  className?: string;
  cols?: '1' | '2' | '3' | '4';
};

const COL_MAP = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
} as const;

export function Grid({ children, className, cols = '3' }: GridProps) {
  return <div className={cn('grid gap-5', COL_MAP[cols], className)}>{children}</div>;
}
