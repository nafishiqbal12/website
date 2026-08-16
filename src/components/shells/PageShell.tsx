import type { ReactNode } from 'react';
import { Container } from '../ui';
import { cn } from '../../lib/cn';

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className={cn('pt-16', className)}>
      <Container className="py-14 sm:py-20 lg:py-24">{children}</Container>
    </main>
  );
}
