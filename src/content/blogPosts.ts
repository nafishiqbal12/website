export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  content: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'crypto-kol-marketing-playbook',
    title: 'Crypto KOL Marketing Playbook: How To Drive Real Investor Attention',
    excerpt:
      'A practical framework for selecting the right KOLs, structuring campaign briefs, and measuring impact beyond vanity metrics.',
    description:
      'Learn how Web3 teams can run KOL campaigns that generate trusted visibility, higher engagement, and qualified investor traffic.',
    author: 'BlockWaveLab Team',
    publishedAt: '2026-03-01',
    readTime: '6 min read',
    tags: ['KOL Marketing', 'Crypto Growth', 'Web3'],
    content: [
      'Most KOL campaigns fail because projects optimize for follower counts instead of audience trust. The right creator is not always the biggest creator. Start by mapping creators to the exact segment you need: traders, founders, builders, or retail communities.',
      'Create a campaign brief that includes narrative angle, mandatory proof points, compliance boundaries, and expected CTA. When creators understand the story and objective, content quality improves and trust remains intact with their audience.',
      'Track outcomes by link clicks, qualified traffic, wallet actions, and conversion events. Vanity metrics can help diagnose reach, but they should never be your final success metric in performance-focused Web3 campaigns.',
    ],
  },
  {
    slug: 'token-launch-marketing-checklist',
    title: 'Token Launch Marketing Checklist: Pre-Launch To Post-Launch Momentum',
    excerpt:
      'Use this launch checklist to align messaging, influencer activation, and community engagement before and after token launch.',
    description:
      'A launch-ready marketing checklist for crypto teams covering pre-launch hype, launch-day coordination, and post-launch retention.',
    author: 'BlockWaveLab Team',
    publishedAt: '2026-02-22',
    readTime: '7 min read',
    tags: ['Token Launch', 'Marketing Strategy', 'Community'],
    content: [
      'Pre-launch momentum should start at least 3 to 4 weeks before TGE or listing. Build a message ladder that explains problem, product, utility, and why timing matters now.',
      'On launch day, coordinate KOL content waves, social media updates, community moderator coverage, and PR distribution by timezone. Consistency across channels increases confidence and reduces mixed messaging.',
      'After launch, keep attention alive through milestone storytelling, roadmap updates, and community participation loops. The post-launch window is where long-term brand trust is built or lost.',
    ],
  },
  {
    slug: 'web3-community-growth-strategies',
    title: 'Web3 Community Growth Strategies That Improve Retention',
    excerpt:
      'Community size is easy to buy, but retention is earned. Here are strategies that keep Web3 communities active and aligned.',
    description:
      'Discover practical community growth systems for Discord, Telegram, and X that improve retention and long-term engagement.',
    author: 'BlockWaveLab Team',
    publishedAt: '2026-02-15',
    readTime: '5 min read',
    tags: ['Community Growth', 'Web3 Marketing', 'Retention'],
    content: [
      'Build community around recurring value, not one-time giveaways. Weekly market updates, founder sessions, and transparent progress reports give members reasons to stay engaged.',
      'Segment your community into cohorts such as newcomers, active holders, and contributors. Tailored messaging improves relevance and creates stronger user journeys from awareness to advocacy.',
      'Use community analytics to monitor active members, discussion depth, response time, and sentiment trends. Real growth comes from healthy participation, not inflated member counts.',
    ],
  },
];

export const BLOG_SLUGS = BLOG_POSTS.map((post) => post.slug);
