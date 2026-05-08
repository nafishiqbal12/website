import { Helmet } from 'react-helmet-async';
import { getOgImageAltText, resolveOgImageUrl } from '../../assets/og/routes';
import { generateBlogPostingSchema, generateServiceSchema } from './schema';

type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'service';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  jsonLd?: JsonLd;
};

const SITE_NAME = 'BlockWaveLab';
const SITE_URL = 'https://blockwavelab.com';

function buildTitle(title?: string) {
  if (!title) return `${SITE_NAME} | Crypto Marketing Agency`;
  return `${title} — ${SITE_NAME}`;
}

export { generateBlogPostingSchema, generateServiceSchema };

export default function SEO({
  title,
  description,
  canonical,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
  jsonLd,
}: SEOProps) {
  const fullTitle = buildTitle(title);
  const metaDescription = description || 'BlockWaveLab is a crypto marketing agency specializing in KOL marketing, token launches, influencer campaigns, and community growth.';
  const url = canonical ?? SITE_URL;

  const defaultImage = image ?? resolveOgImageUrl({ canonical: url, type, title, tags });
  const imageAlt = getOgImageAltText(title ?? SITE_NAME);

  const articleLd =
    type === 'article'
      ? generateBlogPostingSchema({ title, description, canonical: url, image: defaultImage, publishedTime, modifiedTime, author, tags })
      : undefined;

  const serviceLd = type === 'service' ? generateServiceSchema({ title, description }) : undefined;

  const jsonLdPayloads: JsonLd[] = [];
  if (articleLd) jsonLdPayloads.push(articleLd);
  if (serviceLd) jsonLdPayloads.push(serviceLd);
  if (jsonLd) jsonLdPayloads.push(jsonLd);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />

      <link rel="canonical" href={url} />

      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type === 'article' ? 'article' : 'website'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={url} />
      {defaultImage && <meta property="og:image" content={defaultImage} />}
      {defaultImage && <meta property="og:image:secure_url" content={defaultImage} />}
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Blockwavelab" />
      <meta name="twitter:creator" content="@Blockwavelab" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {defaultImage && <meta name="twitter:image" content={defaultImage} />}
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* JSON-LD */}
      {jsonLdPayloads.length > 0 && (
        <script type="application/ld+json">{JSON.stringify(jsonLdPayloads.length === 1 ? jsonLdPayloads[0] : jsonLdPayloads)}</script>
      )}
    </Helmet>
  );
}
