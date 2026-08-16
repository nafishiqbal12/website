import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type BaseFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
};

type TextFieldProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement>;

type TextAreaFieldProps = BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

function FieldShell({
  label,
  hint,
  error,
  className,
  children,
}: BaseFieldProps & { children: React.ReactNode }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      {children}
      {error ? (
        <span className="mt-2 block text-xs text-rose-300">{error}</span>
      ) : hint ? (
        <span className="mt-2 block text-xs text-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}

const baseInputClass =
  'w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300';

export function TextField({ label, hint, error, className, ...props }: TextFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={className}>
      <input className={baseInputClass} {...props} />
    </FieldShell>
  );
}

export function TextAreaField({ label, hint, error, className, rows = 4, ...props }: TextAreaFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={className}>
      <textarea className={baseInputClass} rows={rows} {...props} />
    </FieldShell>
  );
}
