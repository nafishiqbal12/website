import { TrendingUp, Users, Newspaper, ArrowRight, CheckCircle, Send } from 'lucide-react';
import type { MouseEvent } from 'react';
import ExchangeMarquee from '../components/ExchangeMarquee';
import SEO from '../lib/seo/SEO';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const handleNav = (event: MouseEvent<HTMLAnchorElement>, page: string) => {
    event.preventDefault();
    onNavigate(page);
  };

  const services = [
    {
      icon: <TrendingUp size={32} />,
      title: "Getting Real Eyes on Your Project",
      description: "We connect you with KOLs who actually believe in what you're building. Their audiences trust them—so when they talk about your project, people listen and act. You get genuine interest, not bot clicks.",
    },
    {
      icon: <Users size={32} />,
      title: "Building Communities That Stick Around",
      description: "Anyone can buy followers. We help you build communities that care. People who ask questions, share ideas, and become your biggest advocates. Think Reddit threads that go deep, not Discord servers that go silent.",
    },
    {
      icon: <Newspaper size={32} />,
      title: "Getting Press That Actually Matters",
      description: "We get your story in front of journalists and publications that your investors read. Real coverage from CoinDesk, Cointelegraph, and outlets where credibility counts. Not just any press—the kind that moves the needle.",
    },
  ];

  const metrics = [
    { value: '500M+', label: 'Total Impressions' },
    { value: '150+', label: 'Successful Campaigns' },
    { value: '50+', label: 'Partner KOLs' },
    { value: '98%', label: 'Client Satisfaction' },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      handle: "@sarahchen_web3",
      role: "Marketing Director",
      company: "CryptoStartup XYZ",
      content: "BlockWave Lab delivered exceptional results for our token launch. Their KOL network and strategic approach helped us reach our target audience effectively.",
      platform: "twitter",
      verified: true,
    },
    {
      name: "Michael Torres",
      handle: "@mtorres_defi",
      role: "Founder",
      company: "DeFi Protocol",
      content: "Professional, data-driven, and results-oriented. The team understood our vision and connected us with the right influencers. Highly recommended!",
      platform: "telegram",
      verified: true,
    },
    {
      name: "Emma Williams",
      handle: "@emma_web3games",
      role: "Growth Lead",
      company: "Web3 Gaming Studio",
      content: "The community growth strategies implemented by BlockWave Lab were game-changing. We saw a 300% increase in active members within two months.",
      platform: "twitter",
      verified: true,
    },
    {
      name: "Alex Kim",
      handle: "@alexkim_nft",
      role: "Co-Founder",
      company: "NFT Marketplace",
      content: "Finally, an agency that gets it. No fluff, no fake numbers. Just real results. Our community grew 5x in 60 days.",
      platform: "telegram",
      verified: true,
    },
    {
      name: "David Park",
      handle: "@dpark_crypto",
      role: "CMO",
      company: "L2 Protocol",
      content: "Best decision we made. BlockWave connected us with legit KOLs who actually cared about the project. Authentic engagement, not bot farms.",
      platform: "twitter",
      verified: true,
    },
  ];

  const partners = [
    { name: 'Binance', logo: '/binance.png', large: true },
    { name: 'MEXC', logo: '/mexc.png' },
    { name: 'Gate.io', logo: '/gate.png' },
    { name: 'KuCoin', logo: '/kucoin.png' },
    { name: 'Bybit', logo: '/bybit.png' },
    { name: 'Cointelegraph', logo: '/cointelegraph.png', large: true },
  ];

  const clientLogos = [
    { name: 'Cartesi', logo: '/cartesi.png' },
    { name: 'Celer', logo: '/celer.png' },
    { name: 'Phala', logo: '/phala.png' },
    { name: 'Reef', logo: '/reef.png' },
    { name: 'Linear', logo: '/linear.png' },
    { name: 'Frontier', logo: '/frontier.png' },
  ];

  const cryptoProjectLogos = [
    { name: 'DeFiPulseX', logo: '/defipulsex.svg' },
    { name: 'ZeroLend', logo: '/zerolend.svg' },
    { name: 'GameVerse3D', logo: '/gameverse3d.svg' },
    { name: 'TokenForge', logo: '/tokenforge.svg' },
    { name: 'BridgeLayer', logo: '/bridgelayer.svg' },
    { name: 'NFTFlow', logo: '/nftflow.svg' },
  ];

  const caseStudies = [
    {
      title: 'Exchange Listing Growth Sprint',
      result: '15M+ reach and $2M launch-day volume',
      description:
        'Executed a coordinated KOL and PR campaign around a CEX listing with pre-launch narrative and post-launch retention content.',
    },
    {
      title: 'Web3 Game User Acquisition',
      result: '100K+ pre-registrations in 30 days',
      description:
        'Activated gaming influencers and creator partnerships across YouTube and X to convert interest into active players.',
    },
    {
      title: 'Community Revival Campaign',
      result: '10x daily active community members',
      description:
        'Redesigned community structure, content cadence, and mod operations to increase retention and meaningful engagement.',
    },
  ];

  const strategies = [
    {
      title: "How to Revive a Dead Discord Server",
      problem: "Your Discord has 5,000 members but only 3 people talking. Ghost town vibes.",
      solution: "We don't just post 'gm' and hope for magic. Here's the play:",
      tactics: [
        "Kill dead channels. Keep 5-7 max. Less is more.",
        "Launch daily voice AMAs. Text is dead, voices build trust.",
        "Create roles that actually matter. Not colors—real perks.",
        "Host competitions with small prizes. Gets people competing, not lurking.",
        "Bring in 2-3 active community mods who genuinely care.",
        "Post when your audience is awake. Check timezone analytics."
      ],
      result: "Within 30 days: Daily active users up 10x. Real conversations, not crickets."
    },
    {
      title: "Launching a Memecoin Without Bots",
      problem: "You launch. Suddenly 10,000 followers overnight. All bots. Zero real buyers.",
      solution: "Forget buying followers. Here's how we build real hype:",
      tactics: [
        "Partner with 5-10 micro KOLs who actually engage with replies.",
        "Create a private alpha group. 50 real people max.",
        "Build meme content that's funny, not cringe. Test in groupchats first.",
        "Go live on spaces. Real voices = real trust.",
        "Airdrop to wallets that are active, not dormant addresses.",
        "Launch on CT first. Build organic buzz before CEX push."
      ],
      result: "Launch day: Real wallets, real volume, real community. Not a bot farm."
    },
    {
      title: "Getting Press When You're Not Binance",
      problem: "Big outlets ignore you. Paid press releases get zero traction. Frustrating.",
      solution: "Journalists don't care about your project—they care about stories. Give them one:",
      tactics: [
        "Find the angle. What's actually new or different? Lead with that.",
        "Write the headline for them. Make it easy to say yes.",
        "Target writers who cover your niche, not generic 'crypto reporters.'",
        "Offer exclusive access. Embargo = urgency = coverage.",
        "Build relationships before you need them. Reply to their tweets.",
        "Data helps. 'We surveyed 500 founders' beats 'We launched a thing.'"
      ],
      result: "Coverage in outlets that matter. Real credibility, not purchased fluff."
    }
  ];

  return (
    <div className="pt-16">
      <SEO
        title="Crypto Marketing Agency & Web3 Growth"
        description="BlockWaveLab helps crypto startups, memecoin founders, and Web3 projects grow with KOL marketing, token launch support, influencer campaigns, PR, and community growth."
        canonical="https://blockwavelab.com"
      />
      <section className="relative bg-[#0B0E14] py-20 lg:py-40 overflow-hidden" aria-label="Hero section">
        {/* Animated Radial Gradient Glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-30">
            <div className="absolute inset-0 animate-radial-glow" style={{
              backgroundImage: 'radial-gradient(circle, rgba(0, 217, 255, 0.3) 0%, rgba(160, 32, 240, 0.2) 50%, transparent 100%)',
              borderRadius: '50%',
            }}></div>
          </div>
          
          {/* Subtle background grid effect */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl lg:text-7xl font-black mb-6 leading-tight fade-in-up">
              <span className="block fade-in-up-delay-1">Stop Chasing</span>
              <span className="block bg-gradient-to-r from-[#00D9FF] to-[#A020F0] bg-clip-text text-transparent fade-in-up-delay-2">
                Bots.
              </span>
              <span className="block fade-in-up-delay-2">Build With</span>
              <span className="block bg-gradient-to-r from-[#A020F0] to-[#00D9FF] bg-clip-text text-transparent fade-in-up-delay-3">
                Real People.
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 fade-in-up-delay-2 max-w-3xl mx-auto">
              Your product is real. Your marketing should be too. Connect with actual communities, real KOLs, and investors ready to move. No fake followers. No games. Just traction.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="relative px-8 py-4 rounded-lg font-semibold text-lg overflow-hidden group inline-flex items-center space-x-2 fade-in-up-delay-3 shine-effect"
            >
              {/* Glassmorphism background */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-lg border border-white/20 group-hover:border-white/40 group-hover:bg-white/10 transition-all duration-300"></div>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 217, 255, 0.3) 0%, transparent 70%)',
              }}></div>
              
              <span className="relative z-10 text-white">Get Started</span>
              <ArrowRight size={20} className="relative z-10" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" aria-label="Client logos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Client Logos</h2>
            <p className="text-gray-600">Trusted by ambitious Web3 teams across DeFi, gaming, and infrastructure.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {clientLogos.map((client) => (
              <div
                key={client.name}
                className="h-20 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:border-cyan-400/50 transition-all duration-300 flex items-center justify-center p-2"
              >
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    minHeight: '36px',
                    maxHeight: '50px',
                    display: 'block',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" aria-label="Partner networks">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Partner Networks</h2>
            <p className="text-gray-600">Exchange, media, and ecosystem relationships that increase campaign reach.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="h-20 rounded-xl border border-gray-200 bg-white flex items-center justify-center p-3 hover:border-cyan-400/50 transition-all duration-300"
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    minHeight: '36px',
                    maxHeight: partner.large ? '56px' : '44px',
                    display: 'block',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" aria-label="Crypto project logos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Crypto Project Logos</h2>
            <p className="text-gray-600">Campaigns delivered for launch-stage and scaling crypto projects.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cryptoProjectLogos.map((project) => (
              <div
                key={project.name}
                className="h-20 rounded-xl border border-gray-200 bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center text-gray-700 font-semibold p-2"
              >
                {project.logo ? (
                  <img
                    src={project.logo}
                    alt={`${project.name} logo`}
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                      minHeight: '36px',
                      maxHeight: '52px',
                      display: 'block',
                    }}
                  />
                ) : (
                  project.name
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-12 bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#0F172A] border-y border-white/10"
        aria-label="Trusted partners"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">From Launch to Listing</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              We help you navigate CEX requirements and connect with the right listing teams. These exchanges trust our referrals.
            </p>
          </div>
          <ExchangeMarquee />

          <div className="mt-10 max-w-4xl mx-auto relative overflow-hidden rounded-2xl p-6 border border-white/20 bg-gradient-to-br from-white/12 to-white/5 backdrop-blur-md shadow-[0_18px_45px_rgba(2,6,23,0.35)] transition-transform duration-300 hover:-translate-y-0.5">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
            <div className="pointer-events-none absolute -top-16 -right-20 w-56 h-56 rounded-full bg-cyan-300/10 blur-3xl" />
            <h2 className="text-2xl font-bold text-white mb-3 text-center">Explore BlockWaveLab</h2>
            <p className="text-slate-300 text-center mb-5">
              Learn about our services, team, case studies, and latest Web3 growth insights.
            </p>
            <div className="relative z-10 flex flex-wrap justify-center gap-3 text-sm">
              <a href="/services" onClick={(event: MouseEvent<HTMLAnchorElement>) => handleNav(event, 'services')} className="px-4 py-2 rounded-lg bg-white/12 text-slate-100 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_16px_rgba(2,6,23,0.2)] hover:bg-white/20 transition-all">Services</a>
              <a href="/about" onClick={(event: MouseEvent<HTMLAnchorElement>) => handleNav(event, 'about')} className="px-4 py-2 rounded-lg bg-white/12 text-slate-100 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_16px_rgba(2,6,23,0.2)] hover:bg-white/20 transition-all">About</a>
              <a href="/contact" onClick={(event: MouseEvent<HTMLAnchorElement>) => handleNav(event, 'contact')} className="px-4 py-2 rounded-lg bg-white/12 text-slate-100 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_16px_rgba(2,6,23,0.2)] hover:bg-white/20 transition-all">Contact</a>
              <a href="/blog" onClick={(event: MouseEvent<HTMLAnchorElement>) => handleNav(event, 'blog')} className="px-4 py-2 rounded-lg bg-white/12 text-slate-100 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_16px_rgba(2,6,23,0.2)] hover:bg-white/20 transition-all">Blog</a>
              <a href="/case-studies" onClick={(event: MouseEvent<HTMLAnchorElement>) => handleNav(event, 'cases')} className="px-4 py-2 rounded-lg bg-white/12 text-slate-100 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_16px_rgba(2,6,23,0.2)] hover:bg-white/20 transition-all">Case Studies</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" aria-label="About BlockWave Lab">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Who We Are</h2>
            
            <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-700 text-left">
              <p>
                <span className="font-semibold">We exist to solve one problem:</span> Crypto projects deserve marketing that actually works. Not hype. Not fake metrics. Real growth from real communities.
              </p>
              
              <p>
                Here's the hard truth we've seen a thousand times: Most crypto marketing is smoke and mirrors. Agencies buy followers, pad their case studies, and disappear after launch. Founders get angry. Communities get frustrated. Projects die. And nobody wins.
              </p>
              
              <p>
                That's why we started BlockWave Lab. We built this to be different.
              </p>
              
              <p>
                We work with KOLs we actually know and trust. We report numbers that are real—not inflated. We stick around after day one because our reputation depends on your success. When you grow, we grow. Simple as that.
              </p>
              
              <p>
                We've helped 150+ projects reach actual investors and build real communities. Not because we're magic. But because we show up, we care about what we do, and we know this space inside and out. We've made mistakes. We've learned. And we bring all of that to every campaign.
              </p>
              
              <p>
                If you're tired of BS marketing and ready to actually move the needle—that's where we come in.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" aria-label="Core services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Core Services</h2>
            <p className="text-lg text-gray-600">Comprehensive solutions for your Web3 marketing needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('services')}
              className="text-blue-600 font-semibold inline-flex items-center space-x-2 hover:space-x-3 transition-all"
            >
              <span>View All Services</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0B0E14]" aria-label="Growth strategies">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">How We Solve Real Problems</h2>
            <p className="text-xl text-gray-400">Tactical playbooks from campaigns we've actually run</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {strategies.map((strategy, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-white/10 hover:border-cyan-400/50 transition-all"
              >
                <h3 className="text-2xl font-bold mb-4 text-white">{strategy.title}</h3>
                
                <div className="mb-4">
                  <p className="text-red-400 font-semibold mb-2">The Problem:</p>
                  <p className="text-gray-300 text-sm">{strategy.problem}</p>
                </div>

                <div className="mb-4">
                  <p className="text-cyan-400 font-semibold mb-3">{strategy.solution}</p>
                  <ul className="space-y-2">
                    {strategy.tactics.map((tactic, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start">
                        <span className="text-cyan-400 mr-2">→</span>
                        <span>{tactic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-green-400 font-semibold mb-1">The Result:</p>
                  <p className="text-gray-300 text-sm">{strategy.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" aria-label="Homepage case studies">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Case Studies</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real Web3 campaigns with measurable outcomes across listings, community growth, and user acquisition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {caseStudies.map((item) => (
              <article key={item.title} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-7 shadow-sm hover:shadow-xl transition-all">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-cyan-700 font-semibold mb-4">{item.result}</p>
                <p className="text-gray-600">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('cases')}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all"
            >
              <span>View Full Case Studies</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-500 text-white" aria-label="Campaign metrics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Campaign Results</h2>
            <p className="text-blue-100 text-lg">Proven results that drive real growth</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold mb-2">{metric.value}</div>
                <div className="text-blue-100">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0B0E14]" aria-label="Client testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">What People Are Saying</h2>
            <p className="text-xl text-gray-400">Real founders, real results</p>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="break-inside-avoid mb-6"
              >
                {testimonial.platform === "twitter" ? (
                  /* Twitter/X Card Style */
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-cyan-400/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <span className="font-bold text-white">{testimonial.name}</span>
                            {testimonial.verified && (
                              <CheckCircle size={16} className="text-cyan-400 fill-cyan-400" />
                            )}
                          </div>
                          <div className="text-gray-400 text-sm">{testimonial.handle}</div>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {testimonial.content}
                    </p>
                    <div className="text-sm text-gray-500">
                      {testimonial.role} @ {testimonial.company}
                    </div>
                  </div>
                ) : (
                  /* Telegram Card Style */
                  <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-md rounded-2xl p-6 border border-cyan-400/20 hover:border-cyan-400/50 transition-all">
                    <div className="flex items-center space-x-2 mb-4">
                      <Send size={18} className="text-cyan-400" />
                      <span className="text-cyan-400 font-semibold text-sm">Telegram</span>
                    </div>
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-white text-sm">{testimonial.name}</span>
                          {testimonial.verified && (
                            <CheckCircle size={14} className="text-cyan-400 fill-cyan-400" />
                          )}
                        </div>
                        <div className="text-gray-400 text-xs">{testimonial.handle}</div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 mb-3">
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {testimonial.content}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {testimonial.role} @ {testimonial.company}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white" aria-label="Call to action">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Let's Build Your Next Big Campaign</h2>
          <p className="text-xl text-gray-300 mb-8">
            Ready to amplify your crypto project's reach? Partner with BlockWave Lab and connect with the right
            audiences through trusted influencers and strategic marketing.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center space-x-2"
          >
            <span>Get Started Today</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
