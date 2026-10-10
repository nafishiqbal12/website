import { useMemo, useState, type FormEvent } from 'react';
import { ArrowRight, Calendar, Clock, Search } from 'lucide-react';
import { Badge, Button, Card, Container, Link } from '../components/ui';
import { PageShell } from '../components/shells';
import SEO from '../lib/seo/SEO';
import { getAllPosts, type Post } from '../lib/blog';

interface BlogProps {
  onNavigate: (target: string) => void;
}

const description = 'Editorial notes on Web3 infrastructure, release engineering, governed automation, security boundaries, and operational readiness.';

export default function Blog({ onNavigate }: BlogProps) {
  const posts = useMemo(() => getAllPosts(), []);
  const categories = useMemo(() => ['All', ...Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 12)], [posts]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = activeCategory === 'All' || post.tags.includes(activeCategory);
      const matchesQuery =
        !normalizedQuery ||
        [post.title, post.description, ...post.tags].some((value) => value?.toLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, posts, query]);

  const featuredPost = filteredPosts[0];
  const latestPosts = filteredPosts.slice(1);
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'BlockWaveLab editorial articles',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://blockwavelab.com/blog/${post.slug}`,
      name: post.title,
    })),
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <PageShell>
      <SEO title="Blog — Web3 DevOps and Automation Insights" description={description} canonical="https://blockwavelab.com/blog" jsonLd={itemListSchema} />
      <Container>
        <section className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/[0.12] via-slate-900/90 to-blue-500/[0.08] px-6 py-12 sm:px-10 sm:py-16 lg:px-16" aria-labelledby="blog-title">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <Badge tone="info">BlockWaveLab editorial</Badge>
            <h1 id="blog-title" className="mt-5 text-4xl font-bold tracking-tight text-slate-50 sm:text-6xl">
              Engineering notes for Web3 teams.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Practical perspectives on infrastructure, CI/CD, release engineering, governed automation, security boundaries, and operational readiness.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              These are editorial drafts from the current content repository, not customer case studies, guarantees, or proof of runtime capability.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-label="Blog discovery tools">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Browse the library</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50">Find a useful starting point</h2>
            </div>
            <form onSubmit={submitSearch} className="w-full lg:max-w-md" role="search">
              <label htmlFor="blog-search" className="sr-only">Search articles</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 text-slate-500" size={18} aria-hidden="true" />
                <input
                  id="blog-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search infrastructure, automation..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-2.5 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                />
              </div>
            </form>
          </div>
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Article categories">
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                size="sm"
                variant={activeCategory === category ? 'primary' : 'secondary'}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {featuredPost ? (
          <>
            <section className="mt-12" aria-labelledby="featured-article-title">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Featured article</h2>
                <span className="text-sm text-slate-500">{filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}</span>
              </div>
              <ArticleCard post={featuredPost} featured onNavigate={onNavigate} />
            </section>
            {latestPosts.length > 0 ? (
              <section className="mt-16" aria-labelledby="latest-articles-title">
                <h2 id="latest-articles-title" className="text-3xl font-bold tracking-tight text-slate-50">Latest articles</h2>
                <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {latestPosts.map((post) => <ArticleCard key={post.slug} post={post} onNavigate={onNavigate} />)}
                </div>
              </section>
            ) : null}
          </>
        ) : (
          <Card className="mt-12 border-amber-300/20 bg-amber-300/[0.05] text-center">
            <h2 className="text-xl font-semibold text-slate-100">No articles match this search.</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">Try another term or return to the full editorial library.</p>
            <Button className="mt-5" onClick={() => { setQuery(''); setActiveCategory('All'); }}>Clear filters</Button>
          </Card>
        )}

        <section className="mt-16 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.05] px-6 py-10 text-center sm:px-10" aria-labelledby="blog-next-step-title">
          <h2 id="blog-next-step-title" className="text-2xl font-bold text-slate-50 sm:text-3xl">Turn a delivery question into a clear scope.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-400">Review the documented service baseline or share project context through the existing inquiry route.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/docs/services" onNavigate={onNavigate} targetPath="/docs/services" className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-5 py-3 text-slate-100 hover:bg-slate-800/60">Explore services</Link>
            <Link href="/contact" onNavigate={onNavigate} targetPath="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-medium text-slate-950 hover:from-cyan-300 hover:to-blue-400">Discuss your project <ArrowRight size={16} /></Link>
          </div>
        </section>
      </Container>
    </PageShell>
  );
}

function ArticleCard({ post, featured = false, onNavigate }: { post: Post; featured?: boolean; onNavigate: (target: string) => void }) {
  return (
    <Card className={featured ? 'border-cyan-300/20 bg-gradient-to-br from-slate-900 to-slate-950 p-7 sm:p-9' : 'h-full p-6'} interactive>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <time dateTime={post.publishedAt} className="inline-flex items-center gap-1"><Calendar size={14} />{post.publishedAt}</time>
        <span className="inline-flex items-center gap-1"><Clock size={14} />{post.readingTime ?? 'Editorial note'}</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {post.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-2.5 py-1 text-xs text-cyan-200">{tag}</span>)}
      </div>
      <h3 id={featured ? 'featured-article-title' : undefined} className={featured ? 'mt-5 text-3xl font-bold leading-tight text-slate-50 sm:text-4xl' : 'mt-5 text-xl font-semibold leading-tight text-slate-100'}>
        {post.title}
      </h3>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">{post.description}</p>
      <Link href={`/blog/${post.slug}`} onNavigate={onNavigate} targetPath={`/blog/${post.slug}`} className="mt-6 inline-flex items-center gap-2 font-medium">
        Read article <ArrowRight size={16} />
      </Link>
    </Card>
  );
}
