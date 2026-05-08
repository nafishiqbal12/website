import React, { useState, useEffect } from 'react';

// Trust Badge Component
interface TrustBadgeProps {
  icon?: string;
  text: string;
  description?: string;
  link?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ icon = '✓', text, description, link }) => {
  const content = (
    <div className="flex flex-col items-center text-center p-4 hover:shadow-md transition rounded-lg cursor-pointer">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="font-semibold text-gray-800 text-sm">{text}</p>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
  );

  if (link) {
    return <a href={link} target="_blank" rel="noopener noreferrer">{content}</a>;
  }
  return content;
};

// Trust Badges Wall
export const TrustBadgesWall: React.FC = () => {
  const badges = [
    { icon: '✓', text: '500+ Projects Audited' },
    { icon: '⭐', text: '95% Client Satisfaction', description: 'NPS Score' },
    { icon: '🏆', text: 'Top Crypto Agency 2024' },
    { icon: '🛡️', text: 'ISO 27001 Secured' },
    { icon: '💰', text: 'Money-Back Guarantee', description: '30-Day guarantee' },
    { icon: '✍️', text: 'Featured in Coindesk', description: '2023, 2024' },
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl">
      <h3 className="text-center text-2xl font-bold text-gray-900 mb-8">Why 500+ Founders Trust Us</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
        {badges.map((badge, idx) => (
          <TrustBadge key={idx} {...badge} />
        ))}
      </div>
    </section>
  );
};

// Testimonial Component
interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  metric?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoAdvance?: boolean;
  autoAdvanceInterval?: number;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  autoAdvance = true,
  autoAdvanceInterval = 8000,
}) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (!autoAdvance || isPaused) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, autoAdvanceInterval);

    return () => clearInterval(timer);
  }, [autoAdvance, autoAdvanceInterval, testimonials.length, isPaused]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  const testimonial = testimonials[current];

  return (
    <section className="py-12 bg-gray-50 rounded-xl">
      <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">What Founders Say</h2>

      {/* Main Testimonial */}
      <div
        className="max-w-3xl mx-auto px-6 py-8 bg-white rounded-lg shadow-md"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-xl">★</span>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-xl text-gray-800 italic font-medium mb-6 leading-relaxed">
          &quot;{testimonial.quote}&quot;
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-4">
          <img
            src={testimonial.avatar}
            alt={testimonial.author}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-bold text-gray-900">{testimonial.author}</p>
            <p className="text-sm text-gray-600">
              {testimonial.role} at {testimonial.company}
            </p>
            {testimonial.metric && <p className="text-sm text-green-600 font-semibold mt-1">📈 {testimonial.metric}</p>}
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition ${
              idx === current ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <p className="text-center text-sm text-gray-500 mt-4">
        {current + 1} / {testimonials.length}
      </p>
    </section>
  );
};

// Social Proof Wall (Company Logos)
interface CompanyLogosProps {
  title?: string;
  subtitle?: string;
}

export const SocialProofWall: React.FC<CompanyLogosProps> = ({
  title = 'Trusted by 500+ Crypto Projects',
  subtitle = 'Leading DeFi, NFT, Exchange, and Gaming projects trust our growth strategies',
}) => {
  const companies = [
    { name: 'Project Alpha', logo: '📊', chain: 'Ethereum' },
    { name: 'NFT Studio', logo: '🎨', chain: 'Polygon' },
    { name: 'DeFi Hub', logo: '⚙️', chain: 'Solana' },
    { name: 'Token Sphere', logo: '🪙', chain: 'Ethereum' },
    { name: 'Gaming Guild', logo: '🎮', chain: 'Arbitrum' },
    { name: 'Meta Corp', logo: '🌐', chain: 'Polygon' },
    { name: 'Exchange Pro', logo: '📈', chain: 'Multi-Chain' },
    { name: 'Wallet Fund', logo: '🔐', chain: 'Solana' },
  ];

  return (
    <section className="py-12">
      <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">{subtitle}</p>

      {/* Logo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
        {companies.map((company, idx) => (
          <a
            key={idx}
            href="#"
            className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:shadow-md hover:bg-white transition"
            title={`${company.name} on ${company.chain}`}
          >
            <div className="text-4xl mb-2">{company.logo}</div>
            <p className="text-xs font-semibold text-gray-700 text-center">{company.name}</p>
            <p className="text-xs text-gray-500 mt-1">{company.chain}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

// Awards & Recognition
export const AwardsRecognition: React.FC = () => {
  const awards = [
    { title: 'Top Crypto Marketing Agency 2024', source: 'Award Council', icon: '🏆' },
    { title: '50 Best Web3 Agencies', source: 'CryptoWeekly', icon: '⭐' },
    { title: 'Recommended by Y Combinator', source: 'Y Combinator Community', icon: '🚀' },
    { title: 'Featured in Coindesk', source: 'CoinDesk', icon: '📰' },
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">Recognition & Awards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {awards.map((award, idx) => (
          <div key={idx} className="text-center">
            <div className="text-5xl mb-3">{award.icon}</div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{award.title}</h3>
            <p className="text-xs text-gray-600">{award.source}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Founder Story Section
interface FounderStoryProps {
  founder: string;
  image: string;
  story: string;
  milestone1: { year: string; achievement: string };
  milestone2: { year: string; achievement: string };
}

export const FounderStory: React.FC<FounderStoryProps> = ({ founder, image, story, milestone1, milestone2 }) => {
  return (
    <section className="py-16 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
        {/* Image */}
        <div>
          <img src={image} alt={founder} className="rounded-lg shadow-lg w-full h-64 object-cover" />
        </div>

        {/* Story */}
        <div>
          <p className="text-gray-700 leading-relaxed mb-4">{story}</p>
          <p className="text-gray-700 leading-relaxed">
            "We treat your project like our own. Your success is our success."
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Milestones</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <span className="text-2xl font-bold text-blue-600">{milestone1.year}</span>
            <p className="text-gray-700 mt-1">{milestone1.achievement}</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-2xl font-bold text-blue-600">{milestone2.year}</span>
            <p className="text-gray-700 mt-1">{milestone2.achievement}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Case Study Teasers
interface CaseStudyTeaser {
  metric: string;
  project: string;
  description: string;
  slug: string;
}

interface CaseStudyTeasersProps {
  studies: CaseStudyTeaser[];
}

export const CaseStudyTeasers: React.FC<CaseStudyTeasersProps> = ({ studies }) => {
  return (
    <section className="py-12">
      <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">Proven Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {studies.map((study, idx) => (
          <a
            key={idx}
            href={`/case-studies/${study.slug}`}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-500 transition group"
          >
            <p className="text-3xl font-bold text-green-600 mb-2">{study.metric}</p>
            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">{study.project}</h3>
            <p className="text-sm text-gray-600 mb-4">{study.description}</p>
            <span className="text-blue-600 font-semibold text-sm">Read Full Case Study →</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default {
  TrustBadge,
  TrustBadgesWall,
  TestimonialCarousel,
  SocialProofWall,
  AwardsRecognition,
  FounderStory,
  CaseStudyTeasers,
};
