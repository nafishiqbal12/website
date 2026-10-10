import { ArrowRight } from 'lucide-react';
import { Badge, Card, Container, Link } from '../components/ui';
import { PageShell } from '../components/shells';
import SEO from '../lib/seo/SEO';

export default function BlogPostNotFound({ slug, onNavigate }: { slug?: string; onNavigate: (target: string) => void }) {
  return (
    <PageShell>
      <Container narrow>
        <SEO title="Article not found | BlockWaveLab" description="The requested BlockWaveLab article could not be found." canonical="https://blockwavelab.com/blog" />
        <Card className="text-center">
          <Badge tone="warning">Article not found</Badge>
          <h1 className="mt-5 text-3xl font-bold text-slate-50">We could not find that article.</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">{slug ? `No editorial article matches “${slug}”.` : 'The requested article is unavailable.'}</p>
          <Link href="/blog" onNavigate={onNavigate} targetPath="/blog" className="mt-6 inline-flex items-center gap-2">Return to the blog <ArrowRight size={16} /></Link>
        </Card>
      </Container>
    </PageShell>
  );
}
