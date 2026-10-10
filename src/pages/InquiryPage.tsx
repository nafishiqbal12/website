import { useState, type FormEvent } from 'react';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { PageShell } from '../components/shells';
import { Badge, Button, Card, Container, Link, TextAreaField, TextField } from '../components/ui';

type InquiryPageProps = {
  onNavigate: (target: string) => void;
};

const fieldClass =
  'w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300';

export default function InquiryPage({ onNavigate }: InquiryPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('');
  const [details, setDetails] = useState('');

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = `BlockWaveLab project inquiry${projectType ? ` · ${projectType}` : ''}`;
    const body = [
      `Name: ${name}`,
      `Work email: ${email}`,
      `Project or service focus: ${projectType || 'Not specified'}`,
      '',
      'Project context:',
      details,
    ].join('\n');

    window.location.href = `mailto:hello@blockwavelab.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <PageShell>
      <Container narrow>
        <section className="text-center" aria-labelledby="inquiry-title">
          <Badge tone="info">Project inquiry</Badge>
          <h1 id="inquiry-title" className="mt-4 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
            Start with the right context.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Share enough context for an initial qualification conversation. This form prepares an email draft; it does not create an account, proposal, payment, entitlement, or delivery activation.
          </p>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="p-6 sm:p-8">
            <form onSubmit={submitInquiry} className="space-y-5" aria-label="Project inquiry form">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="inquiry-name"
                  label="Name"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                  className={fieldClass}
                />
                <TextField
                  id="inquiry-email"
                  label="Work email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  required
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="inquiry-project-type" className="mb-2 block text-sm font-medium text-slate-200">
                  Project or service focus
                </label>
                <select
                  id="inquiry-project-type"
                  name="projectType"
                  value={projectType}
                  onChange={(event) => setProjectType(event.target.value)}
                  className={fieldClass}
                >
                  <option value="">Select a focus (optional)</option>
                  <option value="BUILD">BUILD — infrastructure and delivery</option>
                  <option value="AUTOMATE">AUTOMATE — bounded workflow automation</option>
                  <option value="OPERATE">OPERATE — scoped release operations</option>
                  <option value="GROW">GROW — technical readiness and trust</option>
                  <option value="Multiple service areas">Multiple service areas</option>
                </select>
              </div>
              <TextAreaField
                id="inquiry-details"
                label="Project context"
                name="details"
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                placeholder="What are you trying to deliver, what is blocked today, and which systems or constraints should we understand?"
                required
                rows={7}
                className={fieldClass}
              />
              <Button type="submit" size="lg">
                Prepare inquiry email <Mail size={17} />
              </Button>
              <p className="text-xs leading-6 text-slate-500">
                Your email client will open with the information you entered. No inquiry is stored by this website.
              </p>
            </form>
          </Card>

          <aside className="space-y-6">
            <Card className="border-cyan-300/20 bg-cyan-300/[0.05] p-6">
              <ShieldCheck className="text-cyan-300" size={22} />
              <h2 className="mt-4 text-xl font-semibold text-slate-100">What happens next?</h2>
              <ol className="mt-4 space-y-4 text-sm leading-6 text-slate-400">
                <li><strong className="text-slate-200">1. Qualification:</strong> clarify the project context and relevant service areas.</li>
                <li><strong className="text-slate-200">2. Scope:</strong> identify inputs, dependencies, exclusions, and acceptance evidence.</li>
                <li><strong className="text-slate-200">3. Proposal:</strong> prepare a proposal for review; no price or commitment is created by this form.</li>
                <li><strong className="text-slate-200">4. Approval:</strong> proceed only through the applicable agreement, payment, entitlement, and delivery gates.</li>
              </ol>
            </Card>
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-100">Before you write</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Reviewing the current service catalog can help you describe the problem without committing to a service or implying production readiness.
              </p>
              <Link href="/docs/services" onNavigate={onNavigate} targetPath="/docs/services" className="mt-5 inline-flex items-center gap-2">
                Explore services <ArrowRight size={16} />
              </Link>
            </Card>
          </aside>
        </div>
      </Container>
    </PageShell>
  );
}
