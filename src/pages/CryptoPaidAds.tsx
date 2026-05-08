import ServiceTemplate from '../components/ServiceTemplate';
import SEO from '../lib/seo/SEO';

export default function CryptoPaidAds({ onNavigate }: { onNavigate: (t: string) => void }) {
  const services = ['Channel strategy', 'Compliance review', 'Creative & landing pages', 'Performance optimization'];
  const faqs = [{ q: 'Which channels do you run?', a: 'We focus on compliant paid channels and creator amplification; channel mix depends on region and compliance.' }];

  return (
    <>
      <SEO title="Crypto Paid Ads — Compliant Paid Growth" description="Crypto paid ads and amplification services to drive qualified traffic and conversions while staying compliant." />
      <ServiceTemplate title="Crypto Paid Ads" subtitle="Compliant paid growth for token projects" services={services} faqs={faqs} onNavigate={onNavigate} />
    </>
  );
}
