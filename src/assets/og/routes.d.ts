export declare const SITE_URL: string;
export declare const OG_BASE_URL: string;
export declare function toSlug(value: unknown): string;
export declare function normalizePath(canonical: string): string;
export declare function getBlogOgImageUrl(slug: string): string;
export declare function getTagOgImageUrl(tag: string): string;
export declare function getServiceOgImageUrl(route: string): string;
export declare function getCaseStudyOgImageUrl(route: string): string;
export declare function getStaticOgImageUrl(key: string): string;
export declare function resolveOgImageUrl(input: {
  canonical?: string;
  type?: 'website' | 'article' | 'service';
  title?: string;
  tags?: string[];
}): string;
export declare function getOgImageAltText(title?: string): string;
