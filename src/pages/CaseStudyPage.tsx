import SEO from '../lib/seo/SEO';
import { generateCaseStudySchema } from '../lib/seo/schema';
import { getRelatedCaseStudies, mapRelatedServices, type CaseStudy } from '../lib/caseStudies';

type Props = {
  caseStudy: CaseStudy;
  onNavigate: (target: string) => void;
};

export default function CaseStudyPage({ caseStudy, onNavigate }: Props) {
  const related = getRelatedCaseStudies(caseStudy, 3);
  const services = mapRelatedServices(caseStudy);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-white">
      <SEO
        title={`${caseStudy.client} — ${caseStudy.title}`}
        description={caseStudy.summary}
        canonical={`https://blockwavelab.com/case-studies/${caseStudy.slug}`}
        image={caseStudy.screenshots && caseStudy.screenshots[0]}
        type="article"
        publishedTime={caseStudy.publishedAt}
        modifiedTime={caseStudy.updatedAt}
        author="BlockWaveLab Team"
        tags={caseStudy.tags}
        jsonLd={generateCaseStudySchema(caseStudy)}
      />

      <article>
        <h1 className="text-4xl font-bold mb-2">{caseStudy.client} — {caseStudy.title}</h1>
        <p className="text-slate-400 mb-6">{caseStudy.summary}</p>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold">Key Metrics</h3>
            <ul className="mt-2 text-slate-300">
              {Object.entries(caseStudy.metrics).map(([k, v]) => (
                <li key={k}>{k.replace(/_/g, ' ')}: <strong className="text-white">{String(v)}</strong></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Timeline</h3>
            <pre className="bg-slate-900 p-3 rounded mt-2 text-sm text-slate-300">{caseStudy.timeline}</pre>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="font-semibold mb-2">Screenshots</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {caseStudy.screenshots.map((s) => (
              <img key={s} src={s} alt={`${caseStudy.client} screenshot`} className="w-full rounded" />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h3 className="font-semibold mb-2">Related Case Studies</h3>
          <div className="flex gap-4">
            {related.map((r) => (
              <button key={r.slug} onClick={() => onNavigate(`/case-studies/${r.slug}`)} className="px-4 py-2 bg-slate-800 rounded">{r.client}</button>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h3 className="font-semibold mb-2">Related Service Categories</h3>
          <div className="flex gap-4">
            {services.map((s) => (
              <button key={s} onClick={() => onNavigate(s)} className="px-4 py-2 bg-cyan-600 rounded">Explore category</button>
            ))}
          </div>
        </section>

        <div className="mt-12 p-6 bg-gradient-to-r from-cyan-800 to-purple-800 rounded text-center">
          <h3 className="text-xl font-bold">Review the right BlockWaveLab category</h3>
          <p className="text-slate-200 mt-2">Use the active service pages to understand the current implementation and operations model.</p>
          <div className="mt-4">
            <button onClick={() => onNavigate('/operate')} className="px-6 py-3 bg-white text-black rounded font-semibold">Explore OPERATE</button>
          </div>
        </div>
      </article>
    </main>
  );
}
