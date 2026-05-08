import ServiceTemplate from '../components/ServiceTemplate';
import SEO from '../lib/seo/SEO';

export default function AiBlockchainMarketing({ onNavigate }: { onNavigate: (t: string) => void }) {
  const services = ['AI-assisted creative generation', 'Audience segmentation with ML', 'Predictive influencer matching', 'Automated reporting'];
  const faqs = [{ q: 'How does AI help marketing?', a: 'AI scales creative ideation, audience segmentation, and performance prediction for faster experiment cycles.' }];

  return (
    <>
      <SEO title="AI Blockchain Marketing — Data-Driven Web3 Growth" description="AI-driven blockchain marketing: predictive campaigns, creative generation, and smarter audience segmentation for token projects." />
      <ServiceTemplate title="AI Blockchain Marketing" subtitle="Data-driven growth for tokens & dApps" services={services} faqs={faqs} onNavigate={onNavigate} />
    </>
  );
}
