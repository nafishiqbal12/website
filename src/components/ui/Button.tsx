import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  full?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClass: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400',
  secondary:
    'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700',
  outline:
    'bg-transparent text-slate-100 border border-slate-500 hover:bg-slate-800/60',
  ghost: 'bg-transparent text-slate-200 hover:bg-slate-800/60',
};

const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm sm:text-base',
  lg: 'px-5 py-3 text-base',
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  full = false,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        'disabled:pointer-events-none disabled:opacity-60',
        variantClass[variant],
        sizeClass[size],
        full && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
