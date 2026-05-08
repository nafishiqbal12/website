import ServiceTemplate from '../components/ServiceTemplate';
import SEO from '../lib/seo/SEO';

export default function BlockchainPRServices({ onNavigate }: { onNavigate: (t: string) => void }) {
  const services = ['Media strategy', 'Thought leadership', 'Press placement in crypto outlets', 'Announcement amplification'];
  const faqs = [{ q: 'Can you secure media placements?', a: 'Yes — we maintain relationships with crypto publishers and journalists for targeted coverage.' }];

  return (
    <>
      <SEO title="Blockchain PR Services — Earn Trusted Coverage" description="Blockchain PR services to secure coverage in crypto media, establish thought leadership, and amplify launches." />
      <ServiceTemplate title="Blockchain PR Services" subtitle="Earn trusted coverage and attention" services={services} faqs={faqs} onNavigate={onNavigate} />
    </>
  );
}
