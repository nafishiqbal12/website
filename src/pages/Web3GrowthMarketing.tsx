import ServiceTemplate from '../components/ServiceTemplate';
import SEO from '../lib/seo/SEO';

export default function Web3GrowthMarketing({ onNavigate }: { onNavigate: (t: string) => void }) {
  const services = ['Community funnels', 'Creator-led product education', 'Retention cohorts', 'Growth experiments'];
  const faqs = [{ q: 'Is growth only about paid channels?', a: 'No — we mix creators, product hooks and retention to create sustainable growth.' }];

  return (
    <>
      <SEO title="Web3 Growth Marketing — Scalable Growth for Tokens & dApps" description="Web3 growth marketing combining creators, community and product to drive adoption and retention for blockchain projects." />
      <ServiceTemplate title="Web3 Growth Marketing" subtitle="Scalable acquisition + retention" services={services} faqs={faqs} onNavigate={onNavigate} />
    </>
  );
}
