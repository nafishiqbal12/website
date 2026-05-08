import SEO from '../lib/seo/SEO';
import { ArrowRight } from 'lucide-react';
import type { MouseEvent } from 'react';

interface Props { onNavigate: (t: string) => void }

const FAQ = [
  { q: 'How do you grow Telegram communities?', a: 'We focus on quality-first growth: targeted creator waves, activity loops, moderator training, and retention programs.' },
  { q: 'Can you manage moderation and bot protection?', a: 'Yes — we implement moderation playbooks, bot detection, and gated onboarding to keep communities healthy.' },
];

export default function TelegramCommunityGrowth({ onNavigate }: Props) {
  const handleNav = (e: MouseEvent<HTMLAnchorElement>, t: string) => { e.preventDefault(); onNavigate(t); };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
  };

  return (
    <main className="pt-16">
      <SEO
        title="Telegram Crypto Community Growth — Telegram Growth for Web3"
        description="Telegram community growth services for crypto projects: moderation, retention programs, gated onboarding, and creator-driven activation."
        canonical="https://blockwavelab.com/telegram-community-growth"
        type="service"
        jsonLd={faqSchema}
      />

      <section className="bg-gradient-to-br from-indigo-700 to-cyan-600 text-white py-20" aria-label="Hero">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Telegram Crypto Community Growth</h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-6">Build active Telegram communities that drive product retention and referral growth.</p>
          <a href="/contact" onClick={(e)=>handleNav(e,'contact')} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-lg font-semibold">Start Growth Plan <ArrowRight size={16}/></a>
        </div>
      </section>

      <section className="py-16 bg-white" aria-label="Offerings">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Offerings</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <li className="bg-gray-50 p-6 rounded-lg border">Moderator Training & Playbooks</li>
            <li className="bg-gray-50 p-6 rounded-lg border">Gated Onboarding & Whitelists</li>
            <li className="bg-gray-50 p-6 rounded-lg border">Creator Activation Waves</li>
            <li className="bg-gray-50 p-6 rounded-lg border">Bot & Spam Mitigation</li>
          </ul>
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
          <div className="mt-8 text-sm text-gray-600">Related: <a href="/services" onClick={(e)=>handleNav(e,'services')} className="text-blue-600">All Services</a> · <a href="/case-studies" onClick={(e)=>handleNav(e,'cases')} className="text-blue-600">Case Studies</a></div>
        </div>
      </section>
    </main>
  );
}
