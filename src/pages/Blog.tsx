import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { BLOG_POSTS } from '../content/blogPosts';

interface BlogProps {
  onNavigate: (target: string) => void;
}

export default function Blog({ onNavigate }: BlogProps) {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white py-20" aria-label="Blog hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-100 mb-4">BlockWaveLab Blog</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">Crypto Marketing Insights</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            Tactical playbooks for KOL campaigns, token launches, community growth, and PR strategies in Web3.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50" aria-label="Blog posts">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500" />
                <div className="p-7">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={14} />
                      {post.publishedAt}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{post.title}</h2>
                  <p className="text-gray-600 mb-5">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onNavigate(`/blog/${post.slug}`)}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-cyan-500 transition-colors"
                    aria-label={`Read ${post.title}`}
                  >
                    <span>Read article</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Need help applying these strategies?</h3>
            <p className="text-gray-600 mb-6">Talk to BlockWaveLab for a custom growth plan based on your stage and goals.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('services')}
                className="px-6 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                Explore Services
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
