import ServiceTemplate from '../components/ServiceTemplate';
import SEO from '../lib/seo/SEO';

export default function BlockchainSEO({ onNavigate }: { onNavigate: (t: string) => void }) {
  const services = ['Technical SEO for dapps', 'Content & topical authority', 'Schema & rich snippets', 'Localized search for exchanges'];
  const faqs = [{ q: 'Can SEO work for tokens?', a: 'Yes — we focus on topical authority, developer docs, and trusted signals to rank token-related queries.' }];

  return (
    <>
      <SEO title="Blockchain SEO — Rank Token & dApp Content" description="Blockchain SEO for projects: developer docs, topical authority, and schema to surface token information in search." />
      <ServiceTemplate title="Blockchain SEO" subtitle="Rank your token and developer content" services={services} faqs={faqs} onNavigate={onNavigate} />
    </>
  );
}
