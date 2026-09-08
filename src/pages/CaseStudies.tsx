import { ArrowRight, BookOpenCheck, GitBranch, ShieldCheck } from 'lucide-react';
import { PageShell } from '../components/shells';
import { Badge, Button, Card, Grid, Link, SectionHeader } from '../components/ui';

type CaseStudiesProps = {
  onNavigate: (page: string) => void;
};

export default function CaseStudies({ onNavigate }: CaseStudiesProps) {
  return (
    <PageShell>
      <section aria-label="Case studies overview">
        <SectionHeader
          eyebrow="Delivery outcomes"
          title="Operational case studies are being refreshed for the v2 model"
          description="The case-study pipeline remains available, while public examples are being aligned to BlockWaveLab's current focus on infrastructure, automation, operations, and delivery-aligned growth."
        />
        <Grid cols="3">
          <Card className="h-full">
            <GitBranch size={18} className="text-cyan-300" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold text-slate-100">Implementation foundations</h2>
            <p className="mt-2 text-sm text-slate-300">Future case studies will document cloud, delivery, and deployment outcomes without unsupported performance claims.</p>
          </Card>
          <Card className="h-full">
            <ShieldCheck size={18} className="text-cyan-300" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold text-slate-100">Operational continuity</h2>
            <p className="mt-2 text-sm text-slate-300">The refreshed model will focus on observation, stabilization, documentation, handover, and optional ongoing service.</p>
          </Card>
          <Card className="h-full">
            <BookOpenCheck size={18} className="text-cyan-300" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold text-slate-100">Reusable delivery context</h2>
            <p className="mt-2 text-sm text-slate-300">Technical narratives will show how teams use BUILD, AUTOMATE, OPERATE, and GROW together.</p>
          </Card>
        </Grid>
      </section>

      <section className="mt-16" aria-label="Case study navigation">
        <Card className="bw-shell bw-grid-noise p-8 text-center">
          <Badge tone="info">BlockWaveLab v2</Badge>
          <h2 className="mt-4 text-3xl font-semibold text-slate-100">Explore the active service categories</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">Start with the service lane that matches your current technical or growth requirement.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button onClick={() => onNavigate('/build')}>Explore BUILD</Button>
            <Button variant="secondary" onClick={() => onNavigate('/automate')}>Explore AUTOMATE</Button>
            <Button variant="outline" onClick={() => onNavigate('/operate')}>Explore OPERATE</Button>
            <Button variant="outline" onClick={() => onNavigate('/grow')}>Explore GROW</Button>
            <Link href="/blog" onNavigate={onNavigate} targetPath="/blog" className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-4 py-2.5 text-slate-100 hover:bg-slate-800/60">
              Read delivery insights <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
