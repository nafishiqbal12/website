import SEO from '../lib/seo/SEO';
import { ArrowRight } from 'lucide-react';
import type { MouseEvent } from 'react';

interface Props { onNavigate: (t: string) => void }

const FAQ = [
  { q: 'What is Web3 influencer marketing?', a: 'Creator-led campaigns tailored to Web3 audiences across YouTube, X, and Telegram focusing on trust and education.' },
  { q: 'How do you prevent fake engagement?', a: 'We vet creators by engagement quality, comment depth, and past campaign performance before onboarding.' },
];

export default function Web3InfluencerMarketing({ onNavigate }: Props) {
  const handleNav = (e: MouseEvent<HTMLAnchorElement>, t: string) => { e.preventDefault(); onNavigate(t); };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
  };

  return (
    <main className="pt-16">
      <SEO
        title="Web3 Influencer Marketing — Creator-Led Campaigns"
        description="Web3 influencer marketing: educational creator campaigns, long-form trust-building content, and measurable conversions for crypto projects."
        canonical="https://blockwavelab.com/web3-influencer-marketing"
        type="service"
        jsonLd={faqSchema}
      />

      <section className="bg-gradient-to-br from-[#081028] via-[#062743] to-[#023e4a] text-white py-20" aria-label="Hero">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">Web3 Influencer Marketing</h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-6">Long-form creator content that educates your audience and drives qualified interest.</p>
          <a href="/contact" onClick={(e)=>handleNav(e,'contact')} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#023e4a] rounded-lg font-semibold">Start a Campaign <ArrowRight size={16}/></a>
        </div>
      </section>

      <section className="py-16 bg-white" aria-label="Approach">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Our Approach</h2>
          <p className="text-gray-700 mb-6">We combine creative brief design, creator education, and measurable CTA funnels so that influencer content converts to engaged users.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">Brief & Messaging</div>
            <div className="bg-gray-50 p-6 rounded-lg">Creator Briefing & Compliance</div>
            <div className="bg-gray-50 p-6 rounded-lg">Conversion Tracking</div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" aria-label="FAQ">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">FAQ</h2>
          <div className="space-y-4">
            {FAQ.map((f,i)=> (
              <details key={i} className="bg-white p-4 rounded-lg"><summary className="font-semibold">{f.q}</summary><p className="mt-2 text-gray-700">{f.a}</p></details>
            ))}
          </div>
          <div className="mt-8 text-sm text-gray-600">Related: <a href="/blog" onClick={(e)=>handleNav(e,'blog')} className="text-blue-600">Blog</a> · <a href="/services" onClick={(e)=>handleNav(e,'services')} className="text-blue-600">Services</a></div>
        </div>
      </section>
    </main>
  );
}
