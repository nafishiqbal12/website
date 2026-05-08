import ServiceTemplate from '../components/ServiceTemplate';
import SEO from '../lib/seo/SEO';

export default function CryptoCommunityManagement({ onNavigate }: { onNavigate: (t: string) => void }) {
  const services = ['Community growth strategy', 'Moderation & ops', 'Onboarding funnels', 'Retention programs'];
  const faqs = [{ q: 'Do you provide moderation teams?', a: 'Yes — we staff and train community managers for Telegram and Discord.' }];

  return (
    <>
      <SEO title="Crypto Community Management — Retain & Activate Users" description="Community management for crypto projects: onboarding, moderation, retention strategies and community ops." />
      <ServiceTemplate title="Crypto Community Management" subtitle="Retain and activate your users" services={services} faqs={faqs} onNavigate={onNavigate} />
    </>
  );
}
