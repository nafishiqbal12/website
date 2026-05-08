import SEO from '../lib/seo/SEO';
import { ArrowRight } from 'lucide-react';
import type { MouseEvent } from 'react';

interface Props {
  onNavigate: (target: string) => void;
}

const FAQ = [
  {
    q: 'What is crypto KOL marketing?',
    a: 'Crypto KOL marketing pairs projects with trusted creators (KOLs) to generate authentic awareness, community interest, and qualified traffic for token launches and product growth.',
  },
  {
    q: 'How do you measure success?',
    a: 'We measure qualified traffic, community growth, engagement quality, referral wallets, and post-campaign retention rather than vanity impressions.',
  },
  {
    q: 'Do you work with memecoin founders?',
    a: 'Yes — we advise on audience-fit, safety checks, and sustainable launch mechanics for memecoins while avoiding spammy tactics.',
  },
];

export default function CryptoKolMarketing({ onNavigate }: Props) {
  const handleNav = (e: MouseEvent<HTMLAnchorElement>, t: string) => {
    e.preventDefault();
    onNavigate(t);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <main className="pt-16">
      <SEO
        title="Crypto KOL Marketing Agency — Trusted Creator Campaigns"
        description="Crypto KOL marketing agency for token launches and growth — targeted creator campaigns, authentic engagement, and measurable results for Web3 projects."
        canonical="https://blockwavelab.com/crypto-kol-marketing"
        type="service"
        jsonLd={faqSchema}
      />

      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white py-20" aria-label="Hero">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Crypto KOL Marketing Agency</h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-6">
            We connect your project with vetted KOLs who drive real engagement, community growth, and qualified investor interest.
          </p>
          <div className="flex justify-center gap-3">
            <a
              href="/contact"
              onClick={(e) => handleNav(e, 'contact')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
            >
              Book a Strategy Call
              <ArrowRight size={16} />
            </a>
            <a
              href="/services"
              onClick={(e) => handleNav(e, 'services')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30"
            >
              View Services
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" aria-label="Why KOL">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why KOLs Matter For Crypto Growth</h2>
              <p className="text-gray-700 mb-4">
                KOLs provide narrative authority in Web3: they shape perception, validate product-market fit, and bring audiences who take action. Our approach selects creators by engagement quality and audience fit, not follower count.
              </p>
              <ul className="list-disc ml-5 text-gray-700 space-y-2">
                <li>Vetted creator network across X, YouTube, and Telegram</li>
                <li>Message testing & narrative A/B</li>
                <li>Campaign measurement tied to wallet actions and community retention</li>
              </ul>
            </div>
            <div>
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-3">Trusted For:</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>Crypto startups & token launches</li>
                  <li>Memecoin launches with safety-first approach</li>
                  <li>TON ecosystem projects and niche protocols</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" aria-label="Process">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <article className="bg-white rounded-lg p-6 border border-gray-100">
              <h3 className="font-semibold mb-2">1. Discovery</h3>
              <p className="text-gray-600">Audience mapping, compliance checklist, and campaign KPI alignment.</p>
            </article>
            <article className="bg-white rounded-lg p-6 border border-gray-100">
              <h3 className="font-semibold mb-2">2. Creator Selection</h3>
              <p className="text-gray-600">Vet creators for engagement quality and audience fit with pilot activations.</p>
            </article>
            <article className="bg-white rounded-lg p-6 border border-gray-100">
              <h3 className="font-semibold mb-2">3. Scale & Measure</h3>
              <p className="text-gray-600">Iterate messaging, track qualified conversions, and optimize retention.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" aria-label="Case studies CTA">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">See Campaign Results</h2>
          <p className="text-gray-600 mb-6">Explore case studies showing measurable lift from KOL-driven campaigns.</p>
          <a
            href="/case-studies"
            onClick={(e) => handleNav(e, 'cases')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            View Case Studies
          </a>
        </div>
      </section>

      <section className="py-16 bg-white" aria-label="FAQ">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <details key={i} className="bg-gray-50 p-4 rounded-lg" aria-label={`FAQ ${i + 1}`}>
                <summary className="font-semibold cursor-pointer">{item.q}</summary>
                <p className="mt-2 text-gray-700">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
