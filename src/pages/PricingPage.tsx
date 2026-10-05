import { ArrowRight, Check, FileText } from 'lucide-react';
import { PageShell } from '../components/shells';
import { Badge, Button, Card, Container } from '../components/ui';

type PricingPageProps = { onNavigate: (target: string) => void };

export default function PricingPage({ onNavigate }: PricingPageProps) {
  return (
    <PageShell>
      <Container narrow>
        <div className="text-center">
          <Badge tone="info">Engagement model</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">Pricing follows the work.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">BlockWaveLab engagements are scoped around your project stage, service categories, and delivery needs.</p>
        </div>
        <Card className="mt-10 border-cyan-300/20 bg-slate-900/80 p-7 sm:p-9">
          <div className="flex items-start gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300"><FileText size={21} /></div><div><h2 className="text-2xl font-semibold text-slate-100">Proposal-based engagements</h2><p className="mt-2 text-slate-400">A clear scope and proposal define the commercial terms for your selected service mix.</p></div></div>
          <ul className="mt-8 space-y-3 text-sm text-slate-300">{['Choose one or more BUILD, AUTOMATE, OPERATE, or GROW categories.', 'Align scope to the project stage and delivery lifecycle.', 'Review the proposal before any engagement is activated.'].map((item) => <li key={item} className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-emerald-300" />{item}</li>)}</ul>
          <div className="mt-8 flex flex-wrap gap-3"><Button onClick={() => onNavigate('/signup')}>Start Free Trial <ArrowRight size={16} /></Button><Button variant="secondary" onClick={() => onNavigate('/docs')}>Read the Docs</Button></div>
        </Card>
      </Container>
    </PageShell>
  );
}
