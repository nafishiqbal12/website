import SEO from '../lib/seo/SEO';
import { ArrowRight } from 'lucide-react';
import type { MouseEvent } from 'react';
import { getAllPosts } from '../lib/blog';

interface Props {
  tag: string;
  onNavigate: (target: string) => void;
}

const SUPPORTED_TAGS = [
  'BUILD',
  'AUTOMATE',
  'OPERATE',
  'GROW',
  'Web3 infrastructure',
  'workflow automation',
  'community operations',
];

function normaliseTag(t: string) {
  return t.trim().toLowerCase();
}

export default function BlogTag({ tag, onNavigate }: Props) {
  const canonical = `https://blockwavelab.com/blog/tag/${encodeURIComponent(tag)}`;
  const title = `${tag} — BlockWaveLab Blog`;
  const description = `Articles and insights about ${tag} from BlockWaveLab — Web3 infrastructure, automation, operations, and delivery-aligned growth.`;

  const handleNav = (e: MouseEvent<HTMLAnchorElement>, t: string) => {
    e.preventDefault();
    onNavigate(t);
  };

  const normalized = normaliseTag(tag);

  // Filter posts by tag (case-insensitive)
  const all = getAllPosts();
  const posts = all.filter((p) => (p.tags || []).some((pt) => normaliseTag(pt) === normalized));

  // Related posts: top 3 other posts
  const related = all.filter((p) => !posts.includes(p)).slice(0, 3);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://blockwavelab.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://blockwavelab.com/blog' },
      { '@type': 'ListItem', position: 3, name: `Tag: ${tag}`, item: canonical },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Posts tagged ${tag}`,
    itemListElement: posts.map((post, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://blockwavelab.com/blog/${post.slug}`, name: post.title })),
  };

  return (
    <main className="pt-16">
      <SEO title={title} description={description} canonical={canonical} jsonLd={[breadcrumbSchema, itemListSchema]} />

      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white py-12" aria-label="Tag header">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Tag: {tag}</h1>
          <p className="mt-2 text-blue-100 max-w-2xl mx-auto">{`Curated posts and insights about ${tag} — filtered for relevance to Web3 teams and technical delivery.`}</p>
        </div>
      </section>

      <nav className="max-w-6xl mx-auto px-4 mt-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li><a href="/" onClick={(e) => handleNav(e, 'home')} className="hover:underline">Home</a></li>
          <li>›</li>
          <li><a href="/blog" onClick={(e) => handleNav(e, 'blog')} className="hover:underline">Blog</a></li>
          <li>›</li>
          <li aria-current="page" className="font-semibold">{tag}</li>
        </ol>
      </nav>

      <section className="py-12 bg-white" aria-label="Tagged posts">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Articles tagged "{tag}"</h2>

          {posts.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">No posts found for this tag yet.</p>
              <p className="text-sm text-gray-600">Try exploring related topics:</p>
              <ul className="flex flex-wrap gap-2 mt-3">
                {SUPPORTED_TAGS.map((t) => (
                  <li key={t}><a href={`/blog/tag/${encodeURIComponent(t)}`} onClick={(e) => handleNav(e, `/blog/tag/${encodeURIComponent(t)}`)} className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">{t}</a></li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <article key={post.slug} className="bg-white rounded-lg border border-gray-100 p-6">
                  <time className="text-sm text-gray-500">{post.publishedAt}</time>
                  <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-2">{post.title}</h3>
                  <p className="text-gray-700 mb-4">{post.description}</p>
                  <div className="flex items-center justify-between">
                    <a href={`/blog/${post.slug}`} onClick={(e) => handleNav(e, `/blog/${post.slug}`)} className="text-blue-600 font-semibold inline-flex items-center gap-2">Read article <ArrowRight size={14} /></a>
                    <div className="text-sm text-gray-500">{post.readingTime ?? ''}</div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <aside className="py-12 bg-gray-50" aria-label="Related posts and navigation">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold mb-3">Related posts</h4>
              <div className="space-y-4">
                {related.map((r) => (
                  <article key={r.slug} className="bg-white p-4 rounded-lg border">
                      <a href={`/blog/${r.slug}`} onClick={(e) => handleNav(e, `/blog/${r.slug}`)} className="font-semibold text-gray-900 hover:underline">{r.title}</a>
                      <div className="text-sm text-gray-600">{r.description}</div>
                    </article>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Explore tags</h4>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_TAGS.map((t) => (
                  <a key={t} href={`/blog/tag/${encodeURIComponent(t)}`} onClick={(e) => handleNav(e, `/blog/tag/${encodeURIComponent(t)}`)} className="inline-block px-3 py-1 rounded-full bg-white border text-sm text-gray-800">{t}</a>
                ))}
              </div>

              <div className="mt-6">
                <h5 className="font-semibold mb-2">Related pages</h5>
                <ul className="space-y-2 text-sm">
                  <li><a href="/build" onClick={(e) => handleNav(e, '/build')} className="text-blue-600">BUILD</a></li>
                  <li><a href="/operate" onClick={(e) => handleNav(e, '/operate')} className="text-blue-600">OPERATE</a></li>
                  <li><a href="/case-studies" onClick={(e) => handleNav(e, 'cases')} className="text-blue-600">Case Studies</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
