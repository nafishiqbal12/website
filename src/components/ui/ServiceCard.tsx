import type { ReactNode } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import type { PillarKey } from '../../lib/design/pillars';
import { PILLAR_THEMES } from '../../lib/design/pillars';

type ServiceCardProps = {
  pillar: PillarKey;
  title: string;
  description: string;
  icon: ReactNode;
  examples?: readonly string[];
  ctaLabel?: string;
  onAction?: () => void;
};

export function ServiceCard({
  pillar,
  title,
  description,
  icon,
  examples = [],
  ctaLabel,
  onAction,
}: ServiceCardProps) {
  const theme = PILLAR_THEMES[pillar];

  return (
    <Card interactive className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${theme.accentClass} text-slate-950 grid place-items-center`}>
          {icon}
        </div>
        <Badge className={theme.chipClass}>{theme.label}</Badge>
      </div>
      <h3 className="text-xl font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
      {examples.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          {examples.map((example) => (
            <li key={example} className="flex gap-2">
              <span aria-hidden="true" className="text-cyan-300">•</span>
              <span>{example}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {ctaLabel && onAction ? (
        <Button variant="ghost" size="sm" className="mt-5 px-0" onClick={onAction}>
          {ctaLabel}
        </Button>
      ) : null}
    </Card>
  );
}
