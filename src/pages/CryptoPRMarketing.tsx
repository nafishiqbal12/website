import SEO from '../lib/seo/SEO';
import { ArrowRight } from 'lucide-react';
import type { MouseEvent } from 'react';

interface Props { onNavigate: (t: string) => void }

const FAQ = [
  { q: 'What coverage can you secure?', a: 'We target crypto-native outlets and niche writers, prioritizing quality placements that influence investors and ecosystem partners.' },
  { q: 'Is PR effective for memecoins?', a: 'PR works when paired with genuine narrative and community signals — we advise on framing to avoid short-term hype.' },
];

export default function CryptoPRMarketing({ onNavigate }: Props) {
  const handleNav = (e: MouseEvent<HTMLAnchorElement>, t: string) => { e.preventDefault(); onNavigate(t); };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
  };

  return (
    <main className="pt-16">
      <SEO
        title="Crypto PR Agency — Media Coverage for Web3 Projects"
        description="Crypto PR marketing: secure placements in top crypto outlets, craft narratives for investors, and amplify launches with trusted media coverage."
        canonical="https://blockwavelab.com/crypto-pr-marketing"
        type="service"
        jsonLd={faqSchema}
      />

      <section className="bg-gradient-to-br from-purple-700 to-cyan-500 text-white py-20" aria-label="Hero">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Crypto PR Marketing</h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-6">Strategic media and PR programs that build credibility for token projects and Web3 founders.</p>
          <a href="/contact" onClick={(e)=>handleNav(e,'contact')} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-lg font-semibold">Book PR Strategy <ArrowRight size={16}/></a>
        </div>
      </section>

      <section className="py-16 bg-white" aria-label="Services list">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">PR Services</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <li className="bg-gray-50 p-6 rounded-lg">Media Targeting & Outreach</li>
            <li className="bg-gray-50 p-6 rounded-lg">Press Materials & Pitching</li>
            <li className="bg-gray-50 p-6 rounded-lg">Exclusive Briefings & Embargoes</li>
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
          <div className="mt-8 text-sm text-gray-600">Related: <a href="/case-studies" onClick={(e)=>handleNav(e,'cases')} className="text-blue-600">Case Studies</a> · <a href="/services" onClick={(e)=>handleNav(e,'services')} className="text-blue-600">Services</a></div>
        </div>
      </section>
    </main>
  );
}
