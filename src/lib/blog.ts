import type { ComponentType } from 'react';

type PostModuleProps = Record<string, unknown>;

type PostModule = {
  default: ComponentType<PostModuleProps>;
};

export type Post = {
  title: string;
  description?: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  coverImage?: string;
  author?: string;
  readingTime?: string;
  Component: ComponentType<PostModuleProps>;
};

// Vite: import all MDX modules eagerly
const modules = import.meta.glob(
  '../content/blog/*.mdx',
  { eager: true }
) as Record<string, PostModule>;

const editorialMetadata: Record<string, Omit<Post, 'Component'>> = {
  'web3-deployment-readiness-for-growing-projects': {
    title: 'Web3 Deployment Readiness for Growing Projects',
    description: 'A practical checklist for reviewing cloud environments, delivery workflows, rollback readiness, and operational ownership before deployment.',
    slug: 'web3-deployment-readiness-for-growing-projects',
    publishedAt: '2026-03-11',
    updatedAt: '2026-03-11',
    tags: ['BUILD', 'Web3 infrastructure', 'Deployment'],
    author: 'BlockWaveLab Team',
    readingTime: '8 min read',
  },
  'governed-workflow-automation-for-web3-teams': {
    title: 'Governed Workflow Automation for Web3 Teams',
    description: 'How to identify repetitive delivery and operations workflows that can benefit from controlled AI-assisted automation.',
    slug: 'governed-workflow-automation-for-web3-teams',
    publishedAt: '2026-03-01',
    updatedAt: '2026-03-01',
    tags: ['AUTOMATE', 'Workflow automation', 'AI agents'],
    author: 'BlockWaveLab Team',
    readingTime: '6 min read',
  },
  'common-workflow-automation-mistakes': {
    title: 'Common Workflow Automation Mistakes',
    description: 'Practical lessons for scoping AI-assisted automation, handling exceptions, and keeping human approval visible.',
    slug: 'common-workflow-automation-mistakes',
    publishedAt: '2026-03-07',
    updatedAt: '2026-03-07',
    tags: ['AUTOMATE', 'Governance', 'Operations'],
    author: 'BlockWaveLab Team',
    readingTime: '8 min read',
  },
  'community-operations-for-web3-projects': {
    title: 'Community Operations for Web3 Projects',
    description: 'A systems-oriented approach to community enablement, approved information flows, and feedback connected to project operations.',
    slug: 'community-operations-for-web3-projects',
    publishedAt: '2026-03-03',
    updatedAt: '2026-03-03',
    tags: ['GROW', 'Community operations', 'Delivery readiness'],
    author: 'BlockWaveLab Team',
    readingTime: '7 min read',
  },
  'technical-readiness-checklist-for-web3-projects': {
    title: 'Technical Readiness Checklist for Web3 Projects',
    description: 'A concise readiness framework covering implementation scope, deployment acceptance, observation, documentation, and handover.',
    slug: 'technical-readiness-checklist-for-web3-projects',
    publishedAt: '2026-02-22',
    updatedAt: '2026-02-22',
    tags: ['OPERATE', 'Implementation', 'Handover'],
    author: 'BlockWaveLab Team',
    readingTime: '7 min read',
  },
  'retention-through-community-operations': {
    title: 'Retention Through Community Operations',
    description: 'How community enablement workflows and delivery feedback can support durable project understanding and participation.',
    slug: 'retention-through-community-operations',
    publishedAt: '2026-02-15',
    updatedAt: '2026-02-15',
    tags: ['GROW', 'Community operations', 'Feedback loops'],
    author: 'BlockWaveLab Team',
    readingTime: '5 min read',
  },
};

export function getAllPosts(): Post[] {
  const posts: Post[] = Object.entries(modules)
    .map(([path, module]) => {
      const pathSlug = path.split('/').pop()?.replace(/\.mdx$/, '');
      const metadata = pathSlug ? editorialMetadata[pathSlug] : undefined;

      if (!metadata) {
        throw new Error(`Missing editorial metadata for blog module: ${path}`);
      }

      return { ...metadata, Component: module.default };
    })
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}
