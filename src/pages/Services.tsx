import {
  Megaphone,
  UserCheck,
  Rocket,
  Users,
  Newspaper,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import type { MouseEvent } from 'react';

interface ServicesProps {
  onNavigate: (page: string) => void;
}

interface ContactLinkProps {
  onNavigate: (page: string) => void;
  label: string;
  className: string;
  ariaLabel: string;
}

function ContactLink({ onNavigate, label, className, ariaLabel }: ContactLinkProps) {
  return (
    <a
      href="/contact"
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onNavigate('contact');
      }}
      className={className}
      aria-label={ariaLabel}
    >
      {label}
    </a>
  );
}

const services = [
  {
    icon: <Megaphone size={30} />,
    title: 'Crypto KOL Marketing',
    description:
      'Partner with trusted crypto KOLs to promote your project to active, high-intent communities across X, Telegram, and YouTube.',
  },
  {
    icon: <UserCheck size={30} />,
    title: 'Web3 Influencer Marketing',
    description:
      'Launch creator-led campaigns with Web3-native influencers who can explain your product clearly and drive quality engagement.',
  },
  {
    icon: <Rocket size={30} />,
    title: 'Token Launch Marketing',
    description:
      'Build momentum before, during, and after launch with narrative strategy, launch-day activation, and ecosystem amplification.',
  },
  {
    icon: <Users size={30} />,
    title: 'Community Growth',
    description:
      'Grow engaged communities on Telegram, Discord, and X through retention programs, events, and moderation that keeps users active.',
  },
  {
    icon: <Newspaper size={30} />,
    title: 'PR & Media Coverage',
    description:
      'Secure placements in leading crypto media to strengthen trust, attract investors, and increase project visibility at key milestones.',
  },
];

const benefits = [
  {
    title: 'Crypto-Native Strategy',
    description:
      'Campaigns built by operators who understand token cycles, audience sentiment, and exchange ecosystem dynamics.',
  },
  {
    title: 'Measurable Performance',
    description:
      'Clear KPIs, transparent reporting, and optimization loops focused on meaningful growth, not vanity numbers.',
  },
  {
    title: 'Trusted Creator Network',
    description:
      'Access vetted KOLs and influencers with authentic engagement and aligned audiences for your project category.',
  },
  {
    title: 'Launch-to-Scale Support',
    description:
      'From early awareness to post-launch retention, we provide full-funnel marketing support for sustainable traction.',
  },
];

export default function Services({ onNavigate }: ServicesProps) {
  return (
    <div className="pt-16">
      <section
        className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white py-20"
        aria-label="Services hero"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-100 mb-4">BlockWaveLab Services</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
            Crypto Marketing Agency Services for Web3 Growth
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            We help Web3 teams launch faster, grow stronger communities, and earn visibility through crypto KOL marketing, web3 influencer marketing, and strategic media coverage.
          </p>
          <div className="flex items-center justify-center">
            <ContactLink
              onNavigate={onNavigate}
              label="Contact Us"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-7 py-3 rounded-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all"
              ariaLabel="Contact BlockWaveLab"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" aria-label="Services grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Crypto KOL Marketing & Web3 Influencer Marketing Services</h2>
            <p className="text-lg text-gray-600">
              End-to-end crypto marketing services designed to help your project stand out in a competitive Web3 market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-7 hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center mb-5">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
                <div className="mt-5">
                  <ContactLink
                    onNavigate={onNavigate}
                    label="Talk to our team"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-cyan-500 transition-colors"
                    ariaLabel={`Talk to BlockWaveLab about ${service.title}`}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" aria-label="Benefits section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why BlockWaveLab</h2>
            <p className="text-lg text-gray-600">
              We combine execution speed, market context, and creator relationships to move your growth metrics in the right direction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={22} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-700">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white"
        aria-label="Call to action"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-5">Ready to Scale Your Crypto Project?</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-9">
            Book a strategy call and get a practical growth plan tailored to your token, audience, and launch timeline.
          </p>
          <div className="flex items-center justify-center">
            <ContactLink
              onNavigate={onNavigate}
              label="Get In Touch"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
              ariaLabel="Go to contact page"
            />
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <a
              href="/contact"
              onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
                onNavigate('contact');
              }}
              className="hover:text-cyan-400 transition-colors inline-flex items-center gap-2"
            >
              <span>Prefer email or Telegram? Visit our contact page</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
