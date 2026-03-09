import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import { BLOG_POSTS, type BlogPost } from '../content/blogPosts';

interface BlogPostPageProps {
  post: BlogPost;
  onNavigate: (target: string) => void;
}

export default function BlogPostPage({ post, onNavigate }: BlogPostPageProps) {
  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white py-16" aria-label="Blog article header">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate('/blog')}
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-7"
            aria-label="Back to blog"
          >
            <ArrowLeft size={16} />
            <span>Back to Blog</span>
          </button>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">{post.title}</h1>
          <p className="text-lg text-blue-100 mb-6">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
            <span className="inline-flex items-center gap-1">
              <Calendar size={14} />
              {post.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={14} />
              {post.readTime}
            </span>
            <span>By {post.author}</span>
          </div>
        </div>
      </section>

      <article className="py-16 bg-white" aria-label="Blog article content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none prose-p:text-gray-700 prose-p:leading-relaxed">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-12 p-7 rounded-2xl bg-gray-50 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Apply this to your project</h2>
            <p className="text-gray-600 mb-5">
              If you want a custom growth strategy for your token or protocol, our team can help map the right creator, community, and PR mix.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('services')}
                className="px-6 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                View Services
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all"
              >
                Book Marketing Consultation
              </button>
            </div>
          </div>
        </div>
      </article>

      <section className="py-16 bg-gray-50" aria-label="Related articles">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {relatedPosts.map((related) => (
              <article key={related.slug} className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{related.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{related.excerpt}</p>
                <button
                  onClick={() => onNavigate(`/blog/${related.slug}`)}
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-cyan-500 transition-colors"
                >
                  <span>Read more</span>
                  <ArrowRight size={15} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
