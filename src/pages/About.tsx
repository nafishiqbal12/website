import { Target, Briefcase, Workflow, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';

interface AboutProps {
  onNavigate: (page: string) => void;
}

interface InternalLinkProps {
  to: string;
  page: string;
  onNavigate: (page: string) => void;
  className?: string;
  children: ReactNode;
}

function InternalLink({ to, page, onNavigate, className, children }: InternalLinkProps) {
  return (
    <a
      href={to}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onNavigate(page);
      }}
      className={className}
    >
      {children}
    </a>
  );
}

export default function About({ onNavigate }: AboutProps) {
  const offerings = [
    'Crypto KOL marketing campaigns',
    'Web3 influencer partnerships',
    'Community growth across Telegram, Discord, and X',
    'PR and media coverage in crypto publications',
  ];

  const processSteps = [
    {
      title: 'Discover',
      description:
        'We audit your brand, token narrative, audience profile, and growth goals to define the right campaign direction.',
    },
    {
      title: 'Plan',
      description:
        'We build a practical strategy covering KOL selection, influencer content flow, community activations, and PR angle.',
    },
    {
      title: 'Execute',
      description:
        'Our team launches and manages campaigns end-to-end, coordinating creators, content timing, and channel performance.',
    },
    {
      title: 'Optimize',
      description:
        'We continuously refine based on engagement and conversion data to improve outcomes and scale what works.',
    },
  ];

  const reasons = [
    'Crypto-native team with hands-on Web3 campaign experience',
    'Vetted creator and KOL network with authentic reach',
    'Transparent reporting and measurable performance metrics',
    'Full-funnel support from awareness to community retention',
  ];

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white py-20" aria-label="About hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-100 mb-4">About BlockWaveLab</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">Growth Marketing for Web3 Teams</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            BlockWaveLab is a crypto marketing agency helping Web3 projects grow using KOL marketing, influencer campaigns,
            community growth, and PR.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white" aria-label="Company mission">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center mb-5">
                <Target size={28} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Company Mission</h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to help serious Web3 projects earn real attention and trust in a crowded market. We focus on
                sustainable growth by connecting your project with the right creators, communities, and media channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" aria-label="What we do">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Briefcase size={24} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-lg text-gray-600">
              We design and execute integrated marketing campaigns that help crypto startups, protocols, and ecosystems scale.
            </p>
            <p className="text-base text-gray-700 mt-4">
              Explore our
              {' '}
              <InternalLink
                to="/services"
                page="services"
                onNavigate={onNavigate}
                className="text-blue-600 font-semibold hover:text-cyan-500 transition-colors"
              >
                crypto marketing services
              </InternalLink>
              {' '}
              to see how we support every stage of Web3 growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerings.map((item) => (
              <article key={item} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 text-lg">{item}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" aria-label="Our Web3 marketing approach">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="w-12 h-12 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center mb-4">
              <Workflow size={24} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Web3 Marketing Approach</h2>
            <p className="text-lg text-gray-600">A clear framework that keeps campaigns aligned with your business outcomes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processSteps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-gray-100 p-7 bg-gradient-to-br from-blue-50 to-cyan-50">
                <p className="text-sm font-semibold tracking-wide text-blue-700 mb-2">STEP {index + 1}</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" aria-label="Why choose us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose BlockWaveLab</h2>
            <p className="text-lg text-gray-600">We combine crypto-native insight with performance-focused execution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map((reason) => (
              <div key={reason} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-cyan-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white" aria-label="Call to action">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-5">Ready to Grow Your Web3 Project?</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-9">
            Let us build a campaign strategy tailored to your token, audience, and launch goals.
          </p>
          <div className="flex items-center justify-center">
            <InternalLink
              to="/contact"
              page="contact"
              onNavigate={onNavigate}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              <span>Contact BlockWaveLab</span>
              <ArrowRight size={20} />
            </InternalLink>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Prefer to review our offerings first?
            {' '}
            <InternalLink
              to="/services"
              page="services"
              onNavigate={onNavigate}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View Services
            </InternalLink>
          </p>
        </div>
      </section>
    </div>
  );
}
