import React from 'react';
import { CTAButton, LeadForm } from './LeadGenComponents';

// Email Capture Sections for different page contexts

// Section 1: Hero CTA (Service Pages)
interface HeroCTAProps {
  headline: string;
  subheadline: string;
  onSubmit: (data: any) => void;
}

export const HeroCTA: React.FC<HeroCTAProps> = ({ headline, subheadline, onSubmit }) => (
  <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
    <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Left: Image Placeholder */}
      <div className="bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg h-80 flex items-center justify-center">
        <div className="text-6xl">📊</div>
      </div>

      {/* Right: Form */}
      <div>
        <LeadForm
          headline={headline}
          subheadline={subheadline}
          fields="medium"
          onSubmit={onSubmit}
        />
      </div>
    </div>
  </section>
);

// Section 2: Mid-Page Testimonial + CTA
interface MidPageCTAProps {
  testimonial: string;
  author: string;
  company: string;
  onSubmit: (data: any) => void;
}

export const MidPageCTA: React.FC<MidPageCTAProps> = ({ testimonial, author, company, onSubmit }) => (
  <section className="py-12 bg-white border-t-4 border-b-4 border-blue-500">
    <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Left: Testimonial */}
      <div className="bg-blue-50 rounded-lg p-8">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-400">★</span>
          ))}
        </div>
        <p className="text-lg text-gray-800 italic mb-4">&quot;{testimonial}&quot;</p>
        <p className="font-bold text-gray-900">{author}</p>
        <p className="text-sm text-gray-600">{company}</p>
      </div>

      {/* Right: CTA */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready for Growth?</h3>
        <p className="text-gray-600 mb-6">Join {author} and 500+ other founders who've scaled with us.</p>
        <LeadForm
          fields="short"
          onSubmit={onSubmit}
          submitButtonText="Schedule a Free Consultation"
        />
      </div>
    </div>
  </section>
);

// Section 3: Sidebar Email Newsletter
interface SidebarNewsletterProps {
  onSubmit: (email: string) => void;
}

export const SidebarNewsletter: React.FC<SidebarNewsletterProps> = ({ onSubmit }) => {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border-l-4 border-purple-600 sticky top-20 shadow-md">
      <h3 className="font-bold text-gray-900 mb-2">Get Weekly Growth Tips</h3>
      <p className="text-sm text-gray-600 mb-4">Real tactics from 500+ crypto founders</p>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
          <p className="text-sm text-green-700 font-semibold">✓ Check your email!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700 transition text-sm"
          >
            Subscribe
          </button>
        </form>
      )}

      <p className="text-xs text-gray-500 mt-3 text-center">+ $497 Lead Magnet Pack</p>
    </div>
  );
};

// Section 4: End-of-Post CTA (Blog)
interface EndOfPostCTAProps {
  headline: string;
  onSubmit: (data: any) => void;
}

export const EndOfPostCTA: React.FC<EndOfPostCTAProps> = ({ headline, onSubmit }) => (
  <section className="py-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl my-8">
    <div className="max-w-4xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{headline}</h2>
      <p className="text-gray-600 mb-8">
        Book a 30-minute strategy call with our growth experts. We'll review your project and suggest 3 specific tactics to get you
        moving.
      </p>
      <div className="max-w-md">
        <LeadForm
          fields="medium"
          onSubmit={onSubmit}
          submitButtonText="Schedule a Free Call"
        />
      </div>
    </div>
  </section>
);

// Section 5: Footer CTA Bar (All Pages)
interface FooterCTABarProps {
  onGetAudit: () => void;
  onScheduleCall: () => void;
  onJoinNewsletter: () => void;
}

export const FooterCTABar: React.FC<FooterCTABarProps> = ({
  onGetAudit,
  onScheduleCall,
  onJoinNewsletter,
}) => (
  <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
    <div className="max-w-5xl mx-auto px-6">
      <h2 className="text-3xl font-bold mx-auto text-center mb-8">Ready to Scale Your Crypto Project?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Option 1 */}
        <button
          onClick={onGetAudit}
          className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:shadow-lg transition text-center"
        >
          <p className="text-lg mb-1">📊 Get Free Audit</p>
          <p className="text-sm">See your growth gaps</p>
        </button>

        {/* Option 2 */}
        <button
          onClick={onScheduleCall}
          className="border-2 border-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-blue-600 transition text-center"
        >
          <p className="text-lg mb-1">📞 Schedule a Call</p>
          <p className="text-sm">30 min strategy session</p>
        </button>

        {/* Option 3 */}
        <button
          onClick={onJoinNewsletter}
          className="border-2 border-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-purple-600 transition text-center"
        >
          <p className="text-lg mb-1">📧 Join Newsletter</p>
          <p className="text-sm">Weekly growth tips</p>
        </button>
      </div>
      <p className="text-center text-white text-sm mt-6 opacity-80">Still deciding? Pick an option. No obligation.</p>
    </div>
  </section>
);

// Section 6: Service Page CTA Sidebar
interface ServiceSidebarCTAProps {
  serviceTitle: string;
  onSubmit: (data: any) => void;
}

export const ServiceSidebarCTA: React.FC<ServiceSidebarCTAProps> = ({ serviceTitle, onSubmit }) => (
  <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-500 sticky top-20">
    <h3 className="font-bold text-gray-900 mb-4 text-lg">Get a {serviceTitle} Plan</h3>
    <LeadForm
      fields="short"
      headline=""
      subheadline=""
      onSubmit={onSubmit}
      submitButtonText={`Get My ${serviceTitle} Plan`}
    />
    <p className="text-xs text-gray-500 mt-4 text-center">✓ 15-minute consultation included</p>
  </div>
);

// Calendly Booking Redirect Component
interface CalendlyButtonProps {
  email?: string;
  firstName?: string;
  projectName?: string;
  bookText?: string;
}

export const CalendlyButton: React.FC<CalendlyButtonProps> = ({
  email,
  firstName,
  projectName,
  bookText = 'Schedule Your Call',
}) => {
  const handleClick = () => {
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (firstName) params.append('name', firstName);
    if (projectName) params.append('project', projectName);

    const calendlyURL = `https://calendly.com/[YOUR_CALENDLY_USERNAME]/30min${params.toString() ? '?' + params.toString() : ''}`;
    window.open(calendlyURL, '_blank');
  };

  return (
    <CTAButton
      onClick={handleClick}
      size="lg"
      className="w-full"
    >
      {bookText}
    </CTAButton>
  );
};

// Newsletter Subscription Widget
interface NewsletterSubscribeProps {
  placement: 'header' | 'sidebar' | 'footer' | 'popup';
  onSubscribe: (email: string) => void;
}

export const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({ placement, onSubscribe }) => {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubscribe(email);
    setSubmitted(true);
    setEmail('');
  };

  const placementStyles = {
    header: 'flex gap-2 items-center',
    sidebar: 'flex flex-col space-y-2',
    footer: 'flex gap-2 items-center',
    popup: 'flex flex-col space-y-3',
  };

  if (submitted && placement !== 'header' && placement !== 'footer') {
    return <p className="text-sm text-green-600 font-semibold">✓ Thanks for subscribing!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={placementStyles[placement]}>
      <input
        type="email"
        placeholder={placement === 'popup' ? 'Enter your email' : 'your@email.com'}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={`${
          placement === 'popup' ? 'w-full px-4 py-3' : 'flex-1 px-3 py-2'
        } border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm`}
      />
      <button
        type="submit"
        className={`${
          placement === 'popup' ? 'w-full' : ''
        } bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition ${
          placement === 'header' || placement === 'footer' ? 'px-4 py-2 text-sm' : 'px-4 py-3'
        }`}
      >
        {submitted ? '✓ Subscribed' : 'Subscribe'}
      </button>
    </form>
  );
};

export default {
  HeroCTA,
  MidPageCTA,
  SidebarNewsletter,
  EndOfPostCTA,
  FooterCTABar,
  ServiceSidebarCTA,
  CalendlyButton,
  NewsletterSubscribe,
};
