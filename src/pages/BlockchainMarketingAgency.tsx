import ServiceTemplate from '../components/ServiceTemplate';
import SEO from '../lib/seo/SEO';

export default function BlockchainMarketingAgency({ onNavigate }: { onNavigate: (t: string) => void }) {
  const services = [
    'Token narrative & positioning',
    'KOL & influencer activation',
    'Community onboarding funnels',
    'Listing coordination & PR',
  ];

  const faqs = [
    { q: 'What budgets do you work with?', a: 'We scale programs for seed to growth budgets — contact for a scoped plan.' },
    { q: 'How long to see results?', a: 'Initial traction typically in 30–60 days; sustained growth in 3–6 months.' },
  ];

  return (
    <>
      <SEO title="Blockchain Marketing Agency — Trusted Growth for Web3 Projects" description="Blockchain marketing agency focused on token launches, community growth, and creator-led campaigns that scale user trust and listings." />
      <ServiceTemplate title="Blockchain Marketing Agency" subtitle="Trusted growth for blockchain projects" services={services} faqs={faqs} onNavigate={onNavigate} />
    </>
  );
}
