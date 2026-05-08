import ServiceTemplate from '../components/ServiceTemplate';
import SEO from '../lib/seo/SEO';

export default function CryptoMarketingAgency({ onNavigate }: { onNavigate: (t: string) => void }) {
  const services = ['KOL marketing', 'Creator partnerships', 'Community growth', 'Paid amplification'];
  const faqs = [{ q: 'Do you run paid ads?', a: 'Yes — we manage crypto-compliant paid channels and creator amplification.' }];

  return (
    <>
      <SEO title="Crypto Marketing Agency — Performance-Driven Web3 Growth" description="Crypto marketing agency delivering KOL, influencer and community growth tailored for token projects and founders." />
      <ServiceTemplate title="Crypto Marketing Agency" subtitle="Performance-driven campaigns for token projects" services={services} faqs={faqs} onNavigate={onNavigate} />
    </>
  );
}
