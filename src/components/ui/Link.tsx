import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type LinkProps = {
  children: ReactNode;
  onNavigate?: (target: string) => void;
  targetPath?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function Link({ children, className, onNavigate, targetPath, href, onClick, ...props }: LinkProps) {
  const handleClick: AnchorHTMLAttributes<HTMLAnchorElement>['onClick'] = (event) => {
    if (onNavigate && targetPath) {
      event.preventDefault();
      onNavigate(targetPath);
    }
    onClick?.(event);
  };

  return (
    <a
      href={href ?? targetPath ?? '#'}
      className={cn(
        'text-cyan-300 hover:text-cyan-200 transition-colors underline-offset-4 hover:underline',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 rounded-sm',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}
