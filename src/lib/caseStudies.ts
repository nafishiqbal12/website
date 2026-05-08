import type { ComponentType } from 'react';

type CaseModuleProps = Record<string, unknown>;

type CaseModule = {
  default: ComponentType<CaseModuleProps>;
  frontmatter: {
    title: string;
    client: string;
    niche?: string;
    blockchain?: string;
    slug: string;
    summary?: string;
    publishedAt?: string;
    updatedAt?: string;
    tags?: string[];
    screenshots?: string[];
    timeline?: string;
    metrics?: Record<string, string | number>;
    relatedServices?: string[];
    relatedPosts?: string[];
  };
};

export type CaseStudy = {
  title: string;
  client: string;
  niche?: string;
  blockchain?: string;
  slug: string;
  summary?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags: string[];
  screenshots: string[];
  timeline?: string;
  metrics: Record<string, string | number>;
  relatedServices: string[];
  relatedPosts: string[];
  Component: ComponentType<CaseModuleProps>;
};

// Vite: import all MDX modules eagerly
const modules = import.meta.glob('../content/case-studies/*.mdx', { eager: true }) as Record<string, CaseModule>;

export function getAllCaseStudies(): CaseStudy[] {
  const items: CaseStudy[] = Object.values(modules)
    .map((m) => {
      const fm = m.frontmatter || ((m as unknown) as Record<string, unknown>).meta || {};
      return {
        title: fm.title as string,
        client: fm.client as string,
        niche: fm.niche as string | undefined,
        blockchain: fm.blockchain as string | undefined,
        slug: fm.slug as string,
        summary: fm.summary as string | undefined,
        publishedAt: fm.publishedAt as string | undefined,
        updatedAt: (fm.updatedAt as string) || (fm.publishedAt as string) || undefined,
        tags: (fm.tags as string[]) || [],
        screenshots: (fm.screenshots as string[]) || [],
        timeline: fm.timeline as string | undefined,
        metrics: (fm.metrics as Record<string, string | number>) || {},
        relatedServices: (fm.relatedServices as string[]) || [],
        relatedPosts: (fm.relatedPosts as string[]) || [],
        Component: m.default,
      } as CaseStudy;
    })
    .sort((a, b) => (a.publishedAt && b.publishedAt ? (a.publishedAt < b.publishedAt ? 1 : -1) : 0));

  return items;
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  const all = getAllCaseStudies();
  return all.find((c) => c.slug === slug);
}

export function getRelatedCaseStudies(caseStudy: CaseStudy, limit = 3): CaseStudy[] {
  const all = getAllCaseStudies().filter((c) => c.slug !== caseStudy.slug);
  // simple scoring: shared niche + shared tags
  const scores = all.map((c) => {
    let score = 0;
    if (caseStudy.niche && c.niche && caseStudy.niche === c.niche) score += 3;
    const sharedTags = c.tags.filter((t) => caseStudy.tags.includes(t)).length;
    score += sharedTags;
    return { c, score };
  });

  return scores.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.c);
}

export function mapRelatedServices(caseStudy: CaseStudy): string[] {
  // Map explicit relatedServices or fall back to niche → service mapping
  if (caseStudy.relatedServices && caseStudy.relatedServices.length) return caseStudy.relatedServices;
  if (!caseStudy.niche) return [];
  const map: Record<string, string> = {
    'community': '/telegram-community-growth',
    'kol': '/kol-marketing',
    'token-launch': '/token-launch-marketing',
  };
  const key = caseStudy.niche.toLowerCase();
  return map[key] ? [map[key]] : [];
}
