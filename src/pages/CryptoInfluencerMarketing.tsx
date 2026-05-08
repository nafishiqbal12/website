import ServiceTemplate from '../components/ServiceTemplate';
import SEO from '../lib/seo/SEO';

export default function CryptoInfluencerMarketing({ onNavigate }: { onNavigate: (t: string) => void }) {
  const services = ['Creator research & selection', 'Campaign briefs & compliance', 'Performance tracking', 'Long-form creator partnerships'];
  const faqs = [{ q: 'How do you measure influencer ROI?', a: 'We use UTM links, conversion tracking and audience overlap analysis to measure outcomes.' }];

  return (
    <>
      <SEO title="Crypto Influencer Marketing — Creator-Led Growth" description="Crypto influencer marketing focused on creator trust, long-form content, and measurable conversions for token projects." />
      <ServiceTemplate title="Crypto Influencer Marketing" subtitle="Creator-led trust and conversions" services={services} faqs={faqs} onNavigate={onNavigate} />
    </>
  );
}
