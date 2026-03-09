import { TrendingUp, Users, Eye, ArrowRight } from 'lucide-react';
import type { MouseEvent } from 'react';

interface CaseStudiesProps {
  onNavigate: (page: string) => void;
}

export default function CaseStudies({ onNavigate }: CaseStudiesProps) {
  const handleNav = (event: MouseEvent<HTMLAnchorElement>, page: string) => {
    event.preventDefault();
    onNavigate(page);
  };

  const cases = [
    {
      title: 'MEXC Listing Campaign',
      category: 'Exchange Launch',
      description:
        'A comprehensive marketing campaign for a DeFi token listing on MEXC. We coordinated with 25+ KOLs, secured press coverage, and built pre-launch hype through strategic community engagement.',
      image: 'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: {
        reach: '15M+',
        impressions: '45M+',
        engagement: '8.5%',
      },
      highlights: [
        '25+ Twitter KOLs with combined 5M followers',
        'Featured on Cointelegraph and Benzinga',
        '40K+ new Telegram members in 2 weeks',
        '$2M trading volume on launch day',
      ],
    },
    {
      title: 'Web3 Game Launch',
      category: 'Game Marketing',
      description:
        'Full-scale marketing campaign for a play-to-earn blockchain game. Leveraged gaming influencers, YouTube content creators, and strategic partnerships to build an active player base.',
      image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: {
        reach: '22M+',
        impressions: '68M+',
        engagement: '12.3%',
      },
      highlights: [
        '50+ YouTube gaming influencers',
        '100K+ game pre-registrations',
        '15K daily active users within first month',
        'Featured on major gaming and crypto platforms',
      ],
    },
    {
      title: 'Meme Coin Hype Campaign',
      category: 'Viral Marketing',
      description:
        'Explosive growth campaign for a community-driven meme token. Created viral content, coordinated with meme pages, and leveraged Twitter trends to achieve rapid community expansion.',
      image: 'https://images.pexels.com/photos/5980866/pexels-photo-5980866.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: {
        reach: '30M+',
        impressions: '95M+',
        engagement: '15.7%',
      },
      highlights: [
        'Trending on Twitter for 3 consecutive days',
        '75K+ Telegram members in 1 week',
        '500+ organic social media mentions daily',
        '10x increase in holder count within 2 weeks',
      ],
    },
    {
      title: 'Influencer Takeover Event',
      category: 'Community Event',
      description:
        'A 48-hour influencer takeover featuring top crypto KOLs hosting AMAs, giveaways, and exclusive content. Generated massive engagement and attracted new community members.',
      image: 'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=800',
      metrics: {
        reach: '18M+',
        impressions: '52M+',
        engagement: '10.8%',
      },
      highlights: [
        '20+ influencers participated',
        '15 live AMA sessions over 2 days',
        '$50K+ in giveaway prizes distributed',
        '25K+ new community members acquired',
      ],
    },
  ];

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Case Studies</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Real campaigns, real results. Explore how we've helped crypto projects achieve exceptional growth.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {cases.map((caseStudy, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <img
                      src={caseStudy.image}
                      alt={caseStudy.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                      <span className="bg-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        {caseStudy.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <h2 className="text-4xl font-bold mb-4 text-gray-900">{caseStudy.title}</h2>
                  <p className="text-lg text-gray-600 mb-6">{caseStudy.description}</p>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center text-blue-600 mb-2">
                        <Eye size={24} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{caseStudy.metrics.reach}</div>
                      <div className="text-sm text-gray-600">Total Reach</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center text-cyan-600 mb-2">
                        <TrendingUp size={24} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{caseStudy.metrics.impressions}</div>
                      <div className="text-sm text-gray-600">Impressions</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center text-blue-600 mb-2">
                        <Users size={24} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{caseStudy.metrics.engagement}</div>
                      <div className="text-sm text-gray-600">Engagement</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-900">Key Highlights</h3>
                    <ul className="space-y-2">
                      {caseStudy.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Success Metrics That Matter</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Every campaign is backed by real data and measurable outcomes. We don't just create buzz—we deliver results.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-5xl font-bold mb-2">500M+</div>
                <div className="text-blue-100">Total Impressions</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">150+</div>
                <div className="text-blue-100">Campaigns Launched</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">200+</div>
                <div className="text-blue-100">Partner KOLs</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">98%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
              <a href="/services" onClick={(event: MouseEvent<HTMLAnchorElement>) => handleNav(event, 'services')} className="px-4 py-2 rounded-lg bg-white/15 border border-white/20 hover:bg-white/25 transition-colors">Explore Services</a>
              <a href="/blog" onClick={(event: MouseEvent<HTMLAnchorElement>) => handleNav(event, 'blog')} className="px-4 py-2 rounded-lg bg-white/15 border border-white/20 hover:bg-white/25 transition-colors">Read Blog Insights</a>
              <a href="/about" onClick={(event: MouseEvent<HTMLAnchorElement>) => handleNav(event, 'about')} className="px-4 py-2 rounded-lg bg-white/15 border border-white/20 hover:bg-white/25 transition-colors">About BlockWaveLab</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Create Your Success Story?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's discuss how we can craft a winning campaign for your crypto project.
          </p>
          <a
            href="/contact"
            onClick={(event: MouseEvent<HTMLAnchorElement>) => handleNav(event, 'contact')}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center space-x-2"
          >
            <span>Start Your Campaign</span>
            <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </div>
  );
}
