import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  Layers3,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { PageShell } from '../components/shells';
import { Badge, Button, Card, Container, Link } from '../components/ui';

type PricingPageProps = { onNavigate: (target: string) => void };

const scopeFactors = [
  'Project stage, delivery goals, and the services required',
  'Environment, repository, provider, and access context',
  'Integration boundaries, data handling, and approval requirements',
  'Readiness, deployment, rollback, and documentation needs',
  'Client dependencies, stakeholder availability, and change risk',
];

const quoteSteps = [
  {
    number: '01',
    title: 'Share the context',
    description: 'Describe the project, current constraints, and the outcome you need to make clearer.',
  },
  {
    number: '02',
    title: 'Shape the scope',
    description: 'Review the relevant service areas, inputs, dependencies, exclusions, and acceptance evidence.',
  },
  {
    number: '03',
    title: 'Review the proposal',
    description: 'Receive a proposal with defined deliverables and commercial terms for the agreed scope.',
  },
  {
    number: '04',
    title: 'Approve the engagement',
    description: 'Work begins only after the applicable approval and agreement steps are complete.',
  },
];

const faqs = [
  {
    question: 'Why are prices not listed publicly?',
    answer:
      'The current commercial direction does not approve public numerical pricing or fixed public tiers. Scope, dependencies, and required evidence vary by project, so the documented approach is to prepare a quotation for the agreed work.',
  },
  {
    question: 'What does a standard engagement include?',
    answer:
      'Standard engagements are intended to use fixed-scope, one-time implementation pricing. The proposal defines the selected services, deliverables, dependencies, exclusions, and commercial terms. Exact scope is not established until it is reviewed and approved.',
  },
  {
    question: 'How is Managed Operations priced?',
    answer:
      'Managed Operations is separately scoped and approved when it is the right fit. Its coverage, ownership, monitoring, support, escalation, and commercial boundaries require explicit agreement; no support hours, SLA, uptime target, or operational guarantee is implied here.',
  },
  {
    question: 'What happens if the scope changes?',
    answer:
      'Material changes should be recorded through documented change control. They may require a revised scope or proposal before the additional work is accepted. The page does not establish a change-fee formula or automatic approval path.',
  },
  {
    question: 'Are discounts available?',
    answer:
      'Case-by-case introductory discounts may be considered only with documented approval, a documented reason, and supporting evidence. No discount amount, cap, or automatic eligibility is published.',
  },
  {
    question: 'Is there a commitment or active free trial?',
    answer:
      'There is no active free-trial offer. An engagement is not activated through this page; the documented path is qualification, scope, proposal, approval/agreement, and the applicable payment and entitlement gates.',
  },
  {
    question: 'Does a quotation guarantee delivery or operational coverage?',
    answer:
      'No. A quotation defines an agreed scope, not guaranteed uptime, security, delivery success, runtime behavior, or support coverage. Delivery and operations remain dependent on client inputs, approved access, implementation evidence, and the separately documented lifecycle gates.',
  },
];

export default function PricingPage({ onNavigate }: PricingPageProps) {
  return (
    <PageShell>
      <Container>
        <section className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/[0.12] via-slate-900/90 to-blue-500/[0.08] px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20" aria-labelledby="pricing-title">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <Badge tone="info">Scope-based engagement model</Badge>
            <h1 id="pricing-title" className="mt-5 text-4xl font-bold tracking-tight text-slate-50 sm:text-6xl">
              Engineering clarity. Pricing with purpose.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              We scope the work around your Web3 project&apos;s infrastructure, automation, and operational requirements. Every engagement begins with clearly defined deliverables, dependencies, and commercial terms.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Public numerical pricing and tiers are not currently approved. This page explains the documented engagement model; it is not a quote, contract, payment flow, or production-readiness statement.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => onNavigate('/contact')}>
                Discuss Your Project <Mail size={17} />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => onNavigate('/docs/services')}>
                Explore Services <ArrowRight size={17} />
              </Button>
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-500">
              The project-discussion CTA opens the existing BlockWaveLab email contact. No dedicated quotation or scheduling workflow is currently exposed.
            </p>
          </div>
        </section>

        <section className="mt-20" aria-labelledby="engagement-options-title">
          <div className="max-w-2xl">
            <Badge>How the model works</Badge>
            <h2 id="engagement-options-title" className="mt-4 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
              Three ways to shape the work
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-400">
              The service catalog provides the working structure. The final commercial shape depends on the approved scope and the evidence needed for your project.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <PricingModelCard
              icon={<Layers3 size={21} />}
              eyebrow="Implementation"
              title="Fixed-scope, one-time work"
              description="Standard engagements are intended to cover clearly defined implementation deliverables with a one-time quotation."
              items={['Defined service mix', 'Documented deliverables and exclusions', 'Acceptance and handover evidence']}
            />
            <PricingModelCard
              icon={<ClipboardCheck size={21} />}
              eyebrow="Non-standard requirements"
              title="Custom quotation"
              description="Requirements outside the documented baseline need additional scoping before a commercial commitment can be described."
              items={['Clarified assumptions', 'Dependencies and client inputs', 'Documented approval for material changes']}
            />
            <PricingModelCard
              icon={<ShieldCheck size={21} />}
              eyebrow="Separately approved"
              title="Managed Operations"
              description="Ongoing operations are separate from implementation and only apply when coverage and commercial terms are explicitly approved."
              items={['Explicit operational scope', 'Separate ownership and escalation boundaries', 'No implied SLA or support guarantee']}
            />
          </div>
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]" aria-labelledby="quotation-process-title">
          <div>
            <Badge tone="success">From context to approval</Badge>
            <h2 id="quotation-process-title" className="mt-4 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
              A four-step quotation process
            </h2>
            <div className="mt-8 space-y-4">
              {quoteSteps.map((step) => (
                <div key={step.number} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <span className="shrink-0 text-sm font-semibold tracking-[0.18em] text-cyan-300">{step.number}</span>
                  <div>
                    <h3 className="font-semibold text-slate-100">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Card className="h-fit border-slate-800 bg-slate-900/80 p-7 sm:p-8">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300"><FileText size={21} /></div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-100">What shapes a quotation?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              These factors help define scope. They are not a price calculator, eligibility rule, or delivery promise.
            </p>
            <ul className="mt-6 space-y-3">
              {scopeFactors.map((factor) => (
                <li key={factor} className="flex gap-3 text-sm leading-6 text-slate-300">
                  <Check size={17} className="mt-1 shrink-0 text-emerald-300" aria-hidden="true" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="mt-20 grid gap-5 md:grid-cols-3" aria-label="Scope boundaries">
          <BoundaryCard title="Deliverables" description="The approved proposal should identify the service work, artifacts, implementation boundaries, acceptance evidence, and handover expectations." />
          <BoundaryCard title="Exclusions and dependencies" description="Unapproved providers, guaranteed uptime or security, unsupported operational coverage, and missing client access remain outside the documented baseline." />
          <BoundaryCard title="Change control" description="Material scope changes require documented review. No automatic pricing formula, discount, tax, refund, or cancellation policy is established on this page." />
        </section>

        <section className="mt-20 border-y border-slate-800 py-16" aria-labelledby="pricing-faq-title">
          <div className="max-w-2xl">
            <Badge>Commercial questions</Badge>
            <h2 id="pricing-faq-title" className="mt-4 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
              Pricing, scope, and coverage FAQ
            </h2>
          </div>
          <div className="mt-8 grid gap-3 lg:grid-cols-2">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 open:border-cyan-300/30">
                <summary className="cursor-pointer list-none pr-8 font-semibold text-slate-100 marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950">
                  <span className="relative block after:absolute after:right-0 after:top-0 after:text-cyan-300 after:content-['+'] group-open:after:content-['−']">{faq.question}</span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.05] px-6 py-10 text-center sm:px-10 sm:py-14" aria-labelledby="pricing-next-step-title">
          <h2 id="pricing-next-step-title" className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            Start with the right scope.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Share your project context or review the current service baseline before discussing a quotation.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={() => onNavigate('/contact')}>
              Discuss Your Project <Mail size={17} />
            </Button>
            <Link href="/docs/services" onNavigate={onNavigate} targetPath="/docs/services" className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-5 py-3 text-slate-100 hover:bg-slate-800/60">
              Explore Services
            </Link>
          </div>
        </section>

        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-6 text-slate-500">
          Source boundaries: <Link href="/docs/services" onNavigate={onNavigate} targetPath="/docs/services">service catalog</Link>, <Link href="/docs/lifecycle" onNavigate={onNavigate} targetPath="/docs/lifecycle">delivery lifecycle</Link>, and <Link href="/docs/payments" onNavigate={onNavigate} targetPath="/docs/payments">payment documentation</Link>. These public references describe documented intent and do not establish production readiness or runtime verification.
        </p>
      </Container>
    </PageShell>
  );
}

function PricingModelCard({
  icon,
  eyebrow,
  title,
  description,
  items,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <Card className="h-full border-slate-800 bg-slate-900/70 p-7">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">{icon}</div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-semibold text-slate-100">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
      <ul className="mt-6 space-y-3 border-t border-slate-800 pt-5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-slate-300">
            <Check size={17} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function BoundaryCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="h-full border-slate-800 bg-slate-950/40 p-6">
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
    </Card>
  );
}
