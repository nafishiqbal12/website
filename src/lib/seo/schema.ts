const SITE_NAME = 'BlockWaveLab';
const SITE_URL = 'https://blockwavelab.com';

export type SchemaProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
};

export function generateBlogPostingSchema({
  title,
  description,
  canonical,
  image,
  publishedTime,
  modifiedTime,
  author,
  tags,
}: SchemaProps) {
  const url = canonical ?? SITE_URL;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: image ? [image] : undefined,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: author
      ? { '@type': 'Person', name: author }
      : { '@type': 'Organization', name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: tags ? tags.join(', ') : undefined,
  };

  return schema;
}

export function generateServiceSchema({
  title,
  description,
}: SchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    description: description ?? `Services from ${SITE_NAME}`,
    serviceType: title ?? 'Crypto Marketing',
    url: SITE_URL,
  };
}

export function generateCaseStudySchema(caseStudy: import('../caseStudies').CaseStudy) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CaseStudy',
    name: caseStudy.title,
    headline: `${caseStudy.client} — ${caseStudy.title}`,
    description: caseStudy.summary,
    datePublished: caseStudy.publishedAt,
    dateModified: caseStudy.updatedAt || caseStudy.publishedAt,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    about: caseStudy.niche,
    mainEntity: {
      '@type': 'Thing',
      name: caseStudy.client,
    },
    keywords: caseStudy.tags ? caseStudy.tags.join(', ') : undefined,
    image: caseStudy.screenshots && caseStudy.screenshots.length ? caseStudy.screenshots[0] : undefined,
    metrics: caseStudy.metrics,
  } as Record<string, unknown>;
}
