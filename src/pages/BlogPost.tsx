import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import { Badge, Card, Container, Link } from '../components/ui';
import { PageShell } from '../components/shells';
import SEO from '../lib/seo/SEO';
import { getAllPosts, type Post } from '../lib/blog';

interface BlogPostPageProps {
  post: Post;
  onNavigate: (target: string) => void;
}

export default function BlogPostPage({ post, onNavigate }: BlogPostPageProps) {
  const relatedPosts = getAllPosts().filter((item) => item.slug !== post.slug).slice(0, 3);
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { '@type': 'Organization', name: post.author ?? 'BlockWaveLab Team' },
    publisher: { '@type': 'Organization', name: 'BlockWaveLab', url: 'https://blockwavelab.com' },
    mainEntityOfPage: `https://blockwavelab.com/blog/${post.slug}`,
    keywords: post.tags.join(', '),
  };

  return (
    <PageShell>
      <SEO title={post.title} description={post.description} canonical={`https://blockwavelab.com/blog/${post.slug}`} type="article" publishedTime={post.publishedAt} modifiedTime={post.updatedAt} author={post.author} tags={post.tags} jsonLd={articleSchema} />
      <Container narrow>
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" onNavigate={onNavigate} targetPath="/">Home</Link><span aria-hidden="true">/</span><Link href="/blog" onNavigate={onNavigate} targetPath="/blog">Blog</Link><span aria-hidden="true">/</span><span aria-current="page" className="truncate text-slate-300">{post.title}</span>
        </nav>
        <Link href="/blog" onNavigate={onNavigate} targetPath="/blog" className="inline-flex items-center gap-2 text-sm"><ArrowLeft size={16} />Back to blog</Link>
        <header className="mt-8 border-b border-slate-800 pb-10">
          <Badge tone="info">Editorial draft</Badge>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-50 sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">{post.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <time dateTime={post.publishedAt} className="inline-flex items-center gap-1"><Calendar size={15} />{post.publishedAt}</time>
            <span className="inline-flex items-center gap-1"><Clock size={15} />{post.readingTime ?? 'Editorial note'}</span>
            <span>By {post.author ?? 'BlockWaveLab Team'}</span>
          </div>
        </header>
        <article className="prose prose-invert prose-lg max-w-none py-12" aria-label="Article content">
          <post.Component />
        </article>
        <div className="flex flex-wrap gap-2 border-t border-slate-800 pt-6">
          {post.tags.map((tag) => <span key={tag} className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-2.5 py-1 text-xs text-cyan-200">{tag}</span>)}
        </div>
        <Card className="mt-12 border-cyan-300/20 bg-cyan-300/[0.05]">
          <h2 className="text-2xl font-semibold text-slate-50">Apply the thinking to your project</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">Review the documented services or share context through the existing inquiry route. This article does not establish a delivery guarantee or production capability.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/docs/services" onNavigate={onNavigate} targetPath="/docs/services" className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-5 py-3 text-slate-100 hover:bg-slate-800/60">Explore services</Link>
            <Link href="/contact" onNavigate={onNavigate} targetPath="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-medium text-slate-950 hover:from-cyan-300 hover:to-blue-400">Discuss your project <ArrowRight size={16} /></Link>
          </div>
        </Card>
        {relatedPosts.length > 0 ? (
          <section className="mt-16 border-t border-slate-800 pt-10" aria-labelledby="related-articles-title">
            <h2 id="related-articles-title" className="text-2xl font-bold text-slate-50">More editorial notes</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {relatedPosts.map((related) => <Card key={related.slug} className="p-5"><h3 className="font-semibold text-slate-100">{related.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{related.description}</p><Link href={`/blog/${related.slug}`} onNavigate={onNavigate} targetPath={`/blog/${related.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm">Read article <ArrowRight size={15} /></Link></Card>)}
            </div>
          </section>
        ) : null}
      </Container>
    </PageShell>
  );
}
