import { getAllCaseStudies, type CaseStudy } from '../lib/caseStudies';
import { getAllPosts, type Post } from '../lib/blog';

type FAQItem = { q: string; a: string };

type Props = {
  title: string;
  subtitle?: string;
  services?: string[];
  faqs?: FAQItem[];
  ctaText?: string;
  onNavigate: (target: string) => void;
};

export default function ServiceTemplate({ title, subtitle, services = [], faqs = [], ctaText = 'Get a custom plan', onNavigate }: Props) {
  const caseStudies: CaseStudy[] = getAllCaseStudies().slice(0, 3);
  const posts: Post[] = getAllPosts().slice(0, 3);

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        {subtitle && <p className="text-slate-300 mt-2">{subtitle}</p>}
        <div className="mt-4 flex gap-3">
          <button onClick={() => onNavigate('/contact')} className="px-5 py-3 bg-cyan-500 rounded font-semibold">{ctaText}</button>
          <button onClick={() => onNavigate('/case-studies')} className="px-5 py-3 bg-slate-800 rounded">See case studies</button>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Problem Statement</h2>
        <p className="text-slate-300">We work with Web3 founders to fix acquisition, retention, and narrative problems that block token growth, community trust, and listings.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Services Breakdown</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.length ? services.map((s) => <li key={s} className="bg-slate-900 p-3 rounded">{s}</li>) : <li className="bg-slate-900 p-3 rounded">Custom campaign design</li>}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Proof — Case Studies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {caseStudies.map((c) => (
            <div key={c.slug} className="bg-slate-900 p-4 rounded">
              <h3 className="font-semibold">{c.client}</h3>
              <p className="text-slate-300 text-sm">{c.summary}</p>
              <div className="mt-3">
                <button onClick={() => onNavigate(`/case-studies/${c.slug}`)} className="text-cyan-400">Read case study</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Related Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {posts.map((p) => (
            <div key={p.slug} className="bg-slate-900 p-4 rounded">
              <h4 className="font-semibold">{p.title}</h4>
              <button onClick={() => onNavigate(`/blog/${p.slug}`)} className="text-cyan-400">Read</button>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">FAQs</h2>
        <div>
          {faqs.length ? faqs.map((f) => (
            <div key={f.q} className="mb-3">
              <strong>{f.q}</strong>
              <p className="text-slate-300">{f.a}</p>
            </div>
          )) : (
            <p className="text-slate-300">Contact us for detailed FAQs tailored to your campaign.</p>
          )}
        </div>
      </section>

      <section className="mt-12 p-6 bg-gradient-to-r from-cyan-800 to-purple-800 rounded text-center">
        <h3 className="text-xl font-bold">Ready to launch?</h3>
        <p className="text-slate-200 mt-2">Book a strategy session to review a custom growth plan.</p>
        <div className="mt-4">
          <button onClick={() => onNavigate('/contact')} className="px-6 py-3 bg-white text-black rounded font-semibold">Get Started</button>
        </div>
      </section>
    </main>
  );
}
