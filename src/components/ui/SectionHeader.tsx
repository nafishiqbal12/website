import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  actions?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  actions,
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`${alignClass} max-w-3xl mb-10`}>
      {eyebrow ? (
        <p className="text-xs tracking-[0.24em] font-semibold text-cyan-300 uppercase mb-3">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-100">{title}</h2>
      {description ? <p className="mt-4 text-base sm:text-lg text-slate-300">{description}</p> : null}
      {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
