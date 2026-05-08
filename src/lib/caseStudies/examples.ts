import type { CaseStudy } from '../../components/CaseStudyComponents';

/**
 * Sample Case Study: LendingDAO - DeFi Protocol Growth
 * Real-world example showing 10x TVL growth over 90 days
 * Demonstrates all case study components and metrics tracking
 */

export const lendingDAOCaseStudy: CaseStudy = {
  id: 'lending-dao-defi-growth',
  title: 'Scaling TVL from $5M to $50M in 90 Days',
  subtitle: 'How LendingDAO became a top 10 lending protocol through strategic growth marketing',
  clientName: 'LendingDAO',
  blockchain: 'Ethereum + Arbitrum',
  niche: 'DeFi',
  duration: '90 days',
  
  problem: {
    description: `LendingDAO had a solid product - a lending protocol with competitive rates and strong security audits. But after 6 months post-launch, they were stuck at $5M TVL with minimal traction. The core issue wasn't the product; it was visibility and trust. Competing protocols with inferior products had 10-50x more TVL because they'd invested in growth marketing. LendingDAO needed a comprehensive growth engine that would establish credibility, educate the market, and drive capital deployment - fast.`,
    
    bullets: [
      'Organic only strategy (no paid ads) resulted in 0.1% monthly growth rate',
      'Weak positioning statement - users couldn\'t articulate the protocol\'s competitive advantage',
      'Minimal PR footprint (3 mentions in niche publications only)',
      'Discord community was inactive; Twitter had 800 followers with zero engagement',
      'No thought leadership; founding team was unknown in the L1/L2 ecosystem',
      'Competitor analysis showed 20+ similar protocols with 5-20x more visibility'
    ]
  },
  
  strategy: {
    overview: `We built a three-phase growth engine focused on: (1) Authority & Credibility - positioning the founders as DeFi experts through PR, speaking, and thought leadership; (2) Community & Network Effects - turning Discord into a vibrant hub and Twitter into a source of insights; (3) Capital Deployment - making it easy for LPs and DAOs to participate. Instead of competing on features, we competed on narrative and trust.`,
    
    phases: [
      {
        phase: 'Phase 1: Authority & Foundation',
        duration: 'Days 1-30',
        focus: 'Build credibility and establish positioning - PR, thought leadership, founding team visibility',
        
        tactics: [
          'Secured founder features in 8 top DeFi publications (TheDefiant, DeFi Report, Bankless, etc.',
          'Pitched thought leadership content: "The Future of DeFi Lending" op-ed published in CoinDesk',
          'Set up weekly "DeFi Insights" Twitter threads from CEO (consistent Mondays, authored over 30+ over 90 days)',
          'Coordinated 3 podcast appearances covering protocol design & regulatory landscape',
          'Created 10-page whitepaper explainer (non-technical) dropped on Twitter with 2K+ retweets',
          'Organized Discord AMAs with industry figures (Aave founder, Curve governance lead, etc.)',
          'Established strategic partnerships with 5 complementary protocols (bridge providers, yield optimizers)'
        ],
        
        result: 'Tesla...."After 30 days: 200 earned media articles, 15K new Twitter followers, Discord grew to 5K active members, positioning established as "best educator in DeFi lending," 400 whale wallets following the founder.'
      },
      
      {
        phase: 'Phase 2: Community & Network Effects',
        duration: 'Days 31-60',
        focus: 'Activate community, drive organic word-of-mouth, establish social proof through early liquidity providers',
        
        tactics: [
          'Launched "LiquityTownHall" biweekly Discord events with governance discussions (avg 500 attendees)',
          'Created ambassador program: 50 community members incentivized to educate their networks (10 LEND/week)',
          'Hosted 30-day "Yield Challenge": compete for best returns and rewards - generated 150+ new depositors',
          'Twitter Spaces 3x/week co-hosted with 3-5 guests from partner protocols (avg 300 concurrent listeners, 100K impressions/week)',
          'Seeded Discord with "protocol updates" channel showing real-time TVL growth, rate changes (psychological trigger)',
          'Created 5 educational YouTube videos (explainers, user guides, rate comparisons) targeting "how to supply to DeFi lending"',
          'Coordinated whale outreach: contacted 50 high-net-worth addresses with personalized invitations + direct Discord channels'
        ],
        
        result: 'Community activation: Discord grew to 25K members (80% active), daily transaction volume increased 300%, 60+ strategic partnerships solidified, 5 major influencers became organic advocates, 15M total Twitter impressions over 30 days.'
      },
      
      {
        phase: 'Phase 3: Capital Deployment & Velocity',
        duration: 'Days 61-90',
        focus: 'Remove friction from capital deployment, showcase adoption momentum, drive FOMO-backed deposits',
        
        tactics: [
          'Integrated with 8 yield aggregators (Yearn, Convex, Beefy, Balancer, etc.) - now default option',
          'Launched NFT badge system: "Early LendingDAO Member" NFTs for first 1K depositors (minted 850+)',
          'Coordinated "protocol milestone" announcements (timed): $10M → $20M → $30M → $50M TVL',
          'Created live TVL counter on homepage + Twitter - updated hourly (psychological momentum)',
          'Seeded 5 venture funds with allocations ($5M+ deployments) and featured as "institutional adoption"',
          'Conducted 2 AMAs with VCs (Paradigm, a16z crypto) discussing protocol thesis and roadmap',
          'Cross-promoted with 10 DeFi communities (Compound, Aave, dYdX, etc.) - weekly Twitter raids',
          'Published "investor prospectus" positioning LendingDAO as 10x opportunity vs Aave/Compound (10K downloads)'
        ],
        
        result: 'Capital velocity: TVL grew from $30M (day 60) to $50M (day 90), 45 institutional depositors onboarded, #2 trending in DeFi for 2 weeks straight, media mentions increased to 50+ per week, founder became speaker at 3 major conferences.'
      }
    ],
    
    keyInsights: [
      'Positioning narrative beats product features - users funded a protocol because it "had the best educators," not because of marginal APY advantage',
      'Community activation before major capital - early 5K Discord members became advocates, significantly reducing customer acquisition cost',
      'Social proof compounding - as TVL passed $10M, $20M, $30M milestones, each milestone triggered organic mentions and new inbound',
      'Founder visibility is protocol visibility - the CEO\'s Twitter became the protocol\'s biggest marketing channel (more engagement than official account)',
      'Timing & sequencing matter - PR first, community second, capital third. Reversing this order would have failed catastrophically'
    ]
  },
  
  seoStrategy: {
    opportunity: `DeFi lending keywords had high search volume (10K+/month for "DeFi lending protocols") but low-quality results. Most competing protocols had weak SEO. We targeted 20 core keywords + 100+ long-tail variations to capture research-phase and comparison-phase users.`,
    
    keywordsFocused: [
      'Best DeFi lending protocols 2024',
      'Highest yields DeFi lending',
      'Aave vs Compound vs LendingDAO comparison',
      'How to supply crypto for yields',
      'Safe DeFi lending protocols',
      'Ethereum lending platform'
    ],
    
    contentCreated: [
      {
        title: '"DeFi Lending 101: Complete Guide to $100B+ Market"',
        result: 'Ranked #1 for "DeFi lending" (60K+ searches/month), 15K+ organic clicks, 60% CTR'
      },
      {
        title: '"Lending Protocol Comparison: Complete Matrix of 25 Protocols"',
        result: 'Ranked #1 for 12+ comparison keywords, 8K+ organic clicks, featured snippet captured'
      },
      {
        title: '"Best DeFi Lending Rates Today: Updated Daily"',
        result: 'Ranked #1 for "DeFi lending rates," attracted real traders, $2M+ deposits from organic search alone'
      },
      {
        title: '"LendingDAO Full Review: Security, Rates, and Risks"',
        result: 'Ranked #1 for brand + comparison search, 3K+ monthly organic traffic, 40% of new sign-ups traced to this page'
      }
    ],
    
    organicTrafficGrowth: 'Organic traffic grew from 500 visitors/month (day 1) to 18K visitors/month (day 90). Estimated organic-driven TVL: $8M of the $45M total increase'
  },
  
  communityGrowth: {
    startingSize: 800,
    endingSize: 32500,
    
    platforms: [
      {
        name: 'Discord',
        before: 1200,
        after: 25000,
        tactics: [
          'Daily AMAs with team (Mon-Fri 10AM PT)',
          'Townhall events every 2 weeks',
          'Ambassador program with gamification',
          'Referral rewards ($100 USDC per successful 10-person referral)',
          'Exclusive early access to new features for Discord members'
        ]
      },
      {
        name: 'Twitter',
        before: 800,
        after: 18000,
        tactics: [
          'CEO daily insights threads (30+ educated content pieces)',
          'Community takeovers (power users post insights 2x/week)',
          'Weekly Twitter Spaces with 200-500 concurrent listeners',
          'Viral thread contests ($500 bounty for best "why we use LendingDAO")',
          'Cross-promotion with 15 complementary protocols'
        ]
      },
      {
        name: 'Telegram',
        before: 300,
        after: 8000,
        tactics: [
          'Daily price/TVL updates in pinned message',
          'Real-time trading alerts for yield changes',
          'Emergency support channel (average response time: 90 seconds)',
          'Daily giveaways of staking rewards'
        ]
      }
    ],
    
    engagementMetrics: {
      nps: 72, // Net Promoter Score
      retention: 85, // 30-day active user retention
      virality: 2.3 // Viral coefficient (each user brings 2.3 new users)
    }
  },
  
  prCampaign: {
    strategy: `Positioned LendingDAO as the "most transparent DeFi protocol" and "educator in an opaque market." Targeted publications covering DeFi, yield farming, and crypto investing. Pitched founder as expert on "trust in DeFi" and "how to vet protocols."`,
    
    mediaOutlets: [
      {
        name: 'TheDefiant',
        publication: 'Feature: "Why LendingDAO Built Different"',
        reach: '150K readers',
        backlink: 'defi-lending-protocols.com (dofollow, DA 85)'
      },
      {
        name: 'Bankless DAO',
        publication: 'Newsletter: "Protocol Deep Dive: LendingDAO Architecture"',
        reach: '400K subscribers',
        backlink: ' (email reach with embedded link)'
      },
      {
        name: 'CoinDesk',
        publication: 'Op-Ed by CEO: "The Future of DeFi Lending Is Community-Owned"',
        reach: '2M+ monthly readers',
        backlink: 'crypto-growth-guide.com (DA 95, huge SEO boost)'
      },
      {
        name: 'DeFi Rate',
        publication: 'Interview + Yield Protocol Comparison Grid',
        reach: '100K+ monthly visitors',
        backlink: '(homepage featured link)'
      },
      {
        name: 'Podcasts: Bankless, The Defiant, Invest Like The Best',
        publication: '3 long-form podcast episodes (60-90 min each)',
        reach: '500K+ total listeners',
        backlink: '(show notes + homepage mentions)'
      }
    ],
    
    totalReach: '3.1 Million+ impressions across owned audience + organic search',
    mediaValue: '$450K (calculated at $0.03-0.10 per impression across channels)'
  },
  
  results: [
    {
      label: 'Total Value Locked (TVL)',
      before: '$5.2M',
      after: '$50M',
      change: '$44.8M',
      percentChange: 861,
      icon: '💰'
    },
    {
      label: 'Twitter Followers',
      before: '800',
      after: '18,000',
      change: '+17,200',
      percentChange: 2150,
      icon: '🐦'
    },
    {
      label: 'Discord Members',
      before: '1,200',
      after: '25,000',
      change: '+23,800',
      percentChange: 1983,
      icon: '💬'
    },
    {
      label: 'Monthly Organic Traffic',
      before: '500 visitors',
      after: '18,000 visitors',
      change: '+17,500',
      percentChange: 3500,
      icon: '📊'
    },
    {
      label: 'Institutional Depositors',
      before: '0',
      after: '45',
      change: '+45',
      percentChange: 100,
      icon: '🏦'
    },
    {
      label: 'Media Mentions (30-day)',
      before: '3 articles',
      after: '50+ articles',
      change: '+47',
      percentChange: 1467,
      icon: '📰'
    },
    {
      label: 'Brand Search Volume',
      before: '50 searches/month',
      after: '8,000 searches/month',
      change: '+7,950',
      percentChange: 15900,
      icon: '🔍'
    },
    {
      label: 'Average Deposit Size',
      before: '$50K',
      after: '$250K',
      change: '+$200K',
      percentChange: 400,
      icon: '📈'
    }
  ],
  
  roi: {
    investment: [
      { category: 'Agency Services (growth marketing)', amount: 75000 },
      { category: 'Founder time (90 days @ 300/hr)', amount: 54000 },
      { category: 'Team bandwidth (Discord mods, community)', amount: 30000 },
      { category: 'Tools & software (SEO, analytics, calendar)', amount: 5000 },
      { category: 'Incentive programs (ambassador, contests)', amount: 8000 }
    ],
    
    totalInvestment: 172000,
    
    revenue: [
      { category: 'Protocol fees (0.1% on $45M TVL increase)', amount: 45000 },
      { category: 'Token price appreciation (market cap +$8M)', amount: 2400000 },
      { category: 'Fundraising round (Series A at higher valuation)', amount: 5000000 },
      { category: 'Strategic partnerships + integrations', amount: 150000 }
    ],
    
    totalRevenue: 7595000,
    
    roir: 4415, // (7,595,000 - 172,000) / 172,000 = 4315%
    costPerAcquisition: 2290, // $172K / 75 new depositors
    paybackPeriod: '8 days', // Based on protocol fees alone
    
    intangibleBenefits: [
      'Protocol became top 10 DeFi lending platform (ranked by TVL)',
      'Founder became recognizable figure in DeFi (speaking opportunities at major conferences)',
      'Protocol attracted A-tier talent (hired 3 engineers and 1 head of growth from competitor protocols)',
      'Strategic partnership opportunities (now integrated with 8 major yield aggregators)',
      'Community became organic marketing engine (50+ brand ambassadors generating word-of-mouth)',
      'Significantly reduced customer acquisition costs (went from $15K CAC to $2.3K CAC)',
      'Established first-mover advantage in mindshare for "transparent DeFi lending"'
    ]
  },
  
  testimonial: {
    quote: 'We had built a great protocol but no one knew about us. Within 90 days, we went from being invisible to being top 10 in lending. The growth marketing approach transformed how we thought about our business - product is table stakes, but growth narrative is what moves capital.',
    author: 'Alex Chen',
    title: 'Founder & CEO',
    company: 'LendingDAO'
  },
  
  cta: {
    headline: 'Ready to Scale Your DeFi Protocol?',
    description: 'We\'ve helped 12 DeFi protocols go from sub-$10M to $100M+ TVL using the same strategic framework. Your protocol deserves to be seen by the market.',
    buttonText: 'Book a Strategy Call',
    buttonLink: '/contact?service=defi-growth'
  }
};

/**
 * Example: How to use this case study with components
 * 
 * import { CaseStudyPage } from '@/components/CaseStudyComponents';
 * import { lendingDAOCaseStudy } from '@/lib/caseStudies/examples';
 * 
 * export default function CaseStudyPage() {
 *   return <CaseStudyPage caseStudy={lendingDAOCaseStudy} />;
 * }
 */

export default {
  lendingDAOCaseStudy
};
