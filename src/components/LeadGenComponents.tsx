import React, { useState } from 'react';

// CTA Button Component - Reusable across pages
interface CTAButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  disabled = false,
  children,
  className = '',
  type = 'button',
  icon,
}) => {
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 justify-center';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/50',
    secondary:
      'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/50',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const Element = href ? 'a' : 'button';

  return (
    // @ts-ignore
    <Element
      href={href}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {icon}
      {children}
    </Element>
  );
};

// Lead Capture Form Component
interface LeadFormProps {
  fields: 'short' | 'medium' | 'long';
  onSubmit: (data: LeadFormData) => void;
  submitButtonText?: string;
  headline?: string;
  subheadline?: string;
  successMessage?: string;
}

export interface LeadFormData {
  email: string;
  firstName: string;
  projectName?: string;
  niche?: string;
  stage?: string;
  budget?: string;
  challenge?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  fields = 'medium',
  onSubmit,
  submitButtonText = 'Get My Audit',
  headline = 'Get Your Free Crypto Marketing Audit',
  subheadline = "See what's holding you back from 10K+ community members",
  successMessage = 'Thanks! Check your email for your audit report.',
}) => {
  const [formData, setFormData] = useState<Partial<LeadFormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send to HubSpot/CRM or own API
      const response = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'lead-form',
          timestamp: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        setSubmitted(true);
        onSubmit(formData as LeadFormData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✓</div>
        <p className="text-xl font-semibold text-gray-800 mb-2">{successMessage}</p>
        <p className="text-gray-600">We'll email you shortly with insights and next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {headline && <h3 className="text-2xl font-bold text-gray-900">{headline}</h3>}
      {subheadline && <p className="text-gray-600 mb-6">{subheadline}</p>}

      {/* Email - Always shown */}
      <input
        type="email"
        name="email"
        placeholder="your@email.com"
        value={formData.email || ''}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />

      {/* First Name - Always shown */}
      <input
        type="text"
        name="firstName"
        placeholder="First name"
        value={formData.firstName || ''}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />

      {/* Project Name - Medium & Long */}
      {(fields === 'medium' || fields === 'long') && (
        <input
          type="text"
          name="projectName"
          placeholder="Project name (e.g., MyToken, NFT Collection)"
          value={formData.projectName || ''}
          onChange={handleChange}
          required={fields === 'long'}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      )}

      {/* Niche - Medium & Long */}
      {(fields === 'medium' || fields === 'long') && (
        <select
          name="niche"
          value={formData.niche || ''}
          onChange={handleChange}
          required={fields === 'long'}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">Select your niche...</option>
          <option value="defi">DeFi Protocol</option>
          <option value="nft">NFT Project</option>
          <option value="exchange">Exchange/Dex</option>
          <option value="gaming">Web3 Gaming</option>
          <option value="metaverse">Metaverse</option>
          <option value="wallet">Wallet/Infrastructure</option>
          <option value="other">Other</option>
        </select>
      )}

      {/* Stage - Long form only */}
      {fields === 'long' && (
        <select
          name="stage"
          value={formData.stage || ''}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">Select your stage...</option>
          <option value="pre-seed">Pre-seed / Ideation</option>
          <option value="seed">Seed</option>
          <option value="series-a">Series A</option>
          <option value="series-b">Series B+</option>
          <option value="bootstrapped">Bootstrapped</option>
        </select>
      )}

      {/* Challenge - Long form only */}
      {fields === 'long' && (
        <textarea
          name="challenge"
          placeholder="What's your biggest growth challenge?"
          value={formData.challenge || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
        />
      )}

      <CTAButton
        type="submit"
        disabled={loading}
        size="lg"
        className="w-full"
      >
        {loading ? 'Submitting...' : submitButtonText}
      </CTAButton>

      {/* Social Proof */}
      <div className="text-center text-sm text-gray-600 pt-2">
        <p>✓ 500+ audits completed | ✓ 95% recommend | ✓ Zero spam</p>
      </div>
    </form>
  );
};

// Exported component exports
export default { CTAButton, LeadForm };
