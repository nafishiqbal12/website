import SEO from '../lib/seo/SEO';
import { ArrowRight } from 'lucide-react';
import type { MouseEvent } from 'react';

interface Props { onNavigate: (t: string) => void }

const FAQ = [
  { q: 'When should I start token launch marketing?', a: 'Start 3–6 weeks before token events to build narrative, partners, and creator warm-up.' },
  { q: 'Do you manage CEX listing comms?', a: 'Yes — we coordinate pre-listing comms, market-maker readiness checks, and post-listing campaigns.' },
];

export default function TokenLaunchMarketing({ onNavigate }: Props) {
  const handleNav = (e: MouseEvent<HTMLAnchorElement>, t: string) => { e.preventDefault(); onNavigate(t); };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
  };

  return (
    <main className="pt-16">
      <SEO
        title="Token Launch Marketing — Pre-Launch To Post-Launch"
        description="Token launch marketing for crypto projects: narrative, creator waves, community activation, and listing coordination for measurable outcomes."
        canonical="https://blockwavelab.com/token-launch-marketing"
        type="service"
        jsonLd={faqSchema}
      />

      <section className="bg-gradient-to-br from-blue-800 to-cyan-600 text-white py-20" aria-label="Hero">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Token Launch Marketing</h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-6">Launch with coordination across creators, communities, and exchanges for durable momentum.</p>
          <a href="/contact" onClick={(e) => handleNav(e, 'contact')} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold focus:ring-2 focus:ring-cyan-400">
            Book Launch Consult <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="py-16 bg-white" aria-label="Features">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">What We Cover</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <li className="bg-gray-50 p-6 rounded-lg border">Narrative & Messaging</li>
            <li className="bg-gray-50 p-6 rounded-lg border">Creator & PR Waves</li>
            <li className="bg-gray-50 p-6 rounded-lg border">Liquidity & Listing Coordination</li>
          </ul>
        </div>
      </section>

      <section className="py-16 bg-gray-50" aria-label="CTA">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-3">Ready to plan your token launch?</h3>
          <p className="text-gray-600 mb-6">We build launch playbooks tied to metrics that matter: qualified wallets, listing health, and community retention.</p>
          <a href="/contact" onClick={(e)=>handleNav(e,'contact')} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold">Get Launch Plan</a>
        </div>
      </section>

      <section className="py-16 bg-white" aria-label="FAQ">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((f, i) => (
              <details key={i} className="bg-gray-50 p-4 rounded-lg"><summary className="font-semibold">{f.q}</summary><p className="mt-2 text-gray-700">{f.a}</p></details>
            ))}
          </div>
          <div className="mt-8 text-sm text-gray-600">See related: <a href="/blog" onClick={(e)=>handleNav(e,'blog')} className="text-blue-600">Blog</a> · <a href="/case-studies" onClick={(e)=>handleNav(e,'cases')} className="text-blue-600">Case Studies</a></div>
        </div>
      </section>
    </main>
  );
}
