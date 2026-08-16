import type { ReactNode } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

type PricingCardProps = {
  plan: string;
  summary: string;
  cadence: string;
  ctaLabel: string;
  bullets: string[];
  onClick?: () => void;
  highlight?: ReactNode;
};

export function PricingCard({
  plan,
  summary,
  cadence,
  ctaLabel,
  bullets,
  onClick,
  highlight,
}: PricingCardProps) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">{plan}</h3>
          <p className="text-sm text-slate-300 mt-1">{summary}</p>
        </div>
        {highlight ?? <Badge tone="info">{cadence}</Badge>}
      </div>
      <ul className="space-y-2 text-sm text-slate-300 mb-6">
        {bullets.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className="text-cyan-300">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Button variant="outline" full onClick={onClick}>{ctaLabel}</Button>
    </Card>
  );
}
