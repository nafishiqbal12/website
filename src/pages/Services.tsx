import {
  TrendingUp,
  Users,
  Newspaper,
  BarChart3,
  MessageCircle,
  Radio,
  Video,
  Award,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface ServicesProps {
  onNavigate: (page: string) => void;
}

export default function Services({ onNavigate }: ServicesProps) {
  const mainServices = [
    {
      icon: <TrendingUp size={40} />,
      title: 'Influencer Marketing',
      description: 'Connect with top-tier crypto KOLs across multiple platforms to amplify your project reach.',
      features: [
        'Twitter/X KOL campaigns with verified influencers',
        'YouTube crypto channel partnerships',
        'Telegram channel promotions and shoutouts',
        'TikTok and Instagram crypto content creators',
        'Micro and macro influencer strategies',
        'Performance tracking and ROI analytics',
      ],
    },
    {
      icon: <Users size={40} />,
      title: 'Community Growth',
      description: 'Build and nurture engaged communities that drive organic growth and long-term success.',
      features: [
        'Community management and moderation',
        'AMA (Ask Me Anything) sessions with founders',
        'Telegram and Discord community building',
        'Engagement campaigns and contests',
        'Giveaway strategy and execution',
        'Community ambassador programs',
      ],
    },
    {
      icon: <Newspaper size={40} />,
      title: 'PR & Media',
      description: 'Secure premium coverage in top-tier crypto publications to establish credibility and visibility.',
      features: [
        'Press release distribution (Cointelegraph, CoinDesk)',
        'Sponsored articles on Benzinga, NewsBTC',
        'Interview placements with crypto media',
        'Podcast guest appearances',
        'News syndication across crypto outlets',
        'Crisis management and reputation monitoring',
      ],
    },
    {
      icon: <BarChart3 size={40} />,
      title: 'Campaign Reporting',
      description: 'Data-driven insights and comprehensive analytics to measure and optimize campaign performance.',
      features: [
        'Real-time campaign dashboards',
        'Detailed engagement metrics and reach data',
        'Conversion tracking and attribution',
        'Competitor analysis and benchmarking',
        'Monthly performance reports',
        'ROI calculation and optimization recommendations',
      ],
    },
    {
      icon: <MessageCircle size={40} />,
      title: 'Social Media Management',
      description: 'Professional content creation and account management to maintain consistent brand presence.',
      features: [
        'Daily content creation and scheduling',
        'Twitter/X strategy and growth',
        'Engagement and community interaction',
        'Hashtag research and trending topic leverage',
        'Meme creation and viral content strategy',
        'Social listening and sentiment analysis',
      ],
    },
    {
      icon: <Radio size={40} />,
      title: 'Launch Campaigns',
      description: 'End-to-end marketing for token launches, exchange listings, and major project announcements.',
      features: [
        'Pre-launch hype building and awareness',
        'Exchange listing promotion (CEX & DEX)',
        'Launch day coordination and execution',
        'Multi-channel campaign orchestration',
        'Influencer takeover events',
        'Post-launch momentum maintenance',
      ],
    },
  ];

  const additionalServices = [
    {
      icon: <Video size={24} />,
      title: 'Video Content Production',
      description: 'Professional crypto explainer videos and promotional content',
    },
    {
      icon: <Award size={24} />,
      title: 'Airdrop Campaigns',
      description: 'Strategic airdrop planning and community distribution',
    },
  ];

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Comprehensive Web3 marketing solutions designed to accelerate your crypto project's growth and visibility.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Complete Marketing Solutions</h2>
            <p className="text-lg text-gray-600">
              From influencer campaigns to community management, we provide everything you need to succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mainServices.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white mb-6">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Additional Services</h2>
            <p className="text-lg text-gray-600">Specialized offerings to complement your marketing strategy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-all flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-6">How We Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
              <div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Discovery</h3>
                <p className="text-blue-100">We learn about your project, goals, and target audience</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Strategy</h3>
                <p className="text-blue-100">We craft a custom marketing plan with clear KPIs</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Execution</h3>
                <p className="text-blue-100">We launch campaigns and manage all moving parts</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-bold mb-2">Optimize</h3>
                <p className="text-blue-100">We analyze results and continuously improve performance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Amplify Your Project?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Book a free consultation to discuss your marketing needs and discover how we can help you grow.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center space-x-2"
          >
            <span>Book a Free Consultation</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
