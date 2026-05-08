import React, { useState, useEffect } from 'react';
import { LeadForm, LeadFormData } from './LeadGenComponents';

// Popup Component - Base modal for various popups
interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'welcome' | 'exit-intent' | 'newsletter' | 'offer' | 'engagement';
  onSubmit?: (data: LeadFormData) => void;
}

export const Popup: React.FC<PopupProps> = ({ isOpen, onClose, type, onSubmit }) => {
  if (!isOpen) return null;

  interface PopupConfig {
    welcome: { headline: string; subheadline: string; formFields: 'medium'; color: string; icon: string };
    'exit-intent': { headline: string; subheadline: string; formFields: 'short'; color: string; icon: string; bonus: string };
    newsletter: { headline: string; subheadline: string; formFields: 'short'; color: string; icon: string };
    offer: { headline: string; subheadline: string; formFields: 'short'; color: string; icon: string; urgency: boolean };
    engagement: { headline: string; subheadline: string; formFields: 'short'; color: string; icon: string; buttons: boolean };
  }
  const popupConfig: PopupConfig = {
    welcome: {
      headline: 'Get Your Free Crypto Marketing Audit',
      subheadline: "See what's holding you back from 10K+ community members",
      formFields: 'medium' as const,
      color: 'from-blue-600 to-blue-700',
      icon: '📊',
    },
    'exit-intent': {
      headline: 'Wait! Before You Go...',
      subheadline: 'Join 5K+ crypto founders getting weekly growth tips',
      formFields: 'short' as const,
      color: 'from-purple-600 to-purple-700',
      icon: '⏰',
      bonus: 'Free PDF: Token Launch Playbook (valued at $497)',
    },
    newsletter: {
      headline: 'Get Weekly Web3 Growth Tips',
      subheadline: 'Real tactics from 500+ crypto founders',
      formFields: 'short' as const,
      color: 'from-green-600 to-green-700',
      icon: '📧',
    },
    offer: {
      headline: 'Exclusive Offer for Serious Founders',
      subheadline: 'First hour of strategy call = free. Valid for 48 hours.',
      formFields: 'short' as const,
      color: 'from-red-600 to-red-700',
      icon: '🎁',
      urgency: true,
    },
    engagement: {
      headline: 'One Quick Question...',
      subheadline: "What's your biggest challenge right now?",
      formFields: 'short' as const,
      color: 'from-indigo-600 to-indigo-700',
      icon: '❓',
      buttons: true,
    },
  };

  const config = popupConfig[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full relative animate-in fade-in slide-in-from-center-4 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className={`bg-gradient-to-r ${config.color} text-white p-6 rounded-t-lg`}>
          <div className="text-4xl mb-2">{config.icon}</div>
          <h2 className="text-2xl font-bold">{config.headline}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">{config.subheadline}</p>

          {/* Show bonus for exit-intent */}
          {(config as any).bonus && <p className="text-sm text-green-600 font-semibold mb-4">✓ {(config as any).bonus}</p>}

          {/* Show urgency for offer */}
          {(config as any).urgency && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-red-700 text-sm font-semibold">⏰ Spots filling up. Only 1 left this week!</p>
            </div>
          )}

          {/* Engagement Buttons */}
          {type === 'engagement' && (
            <div className="space-y-2 mb-4">
              {['Growing our community', 'Paid ads performance', 'Launching smart'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    // Track which option was clicked
                    console.log('Selected:', option);
                    onClose();
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-gray-700 font-medium text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          {type !== 'engagement' && (
            <LeadForm
              fields={config.formFields}
              headline=""
              subheadline=""
              submitButtonText={
                type === 'offer' ? 'Claim Your Free Hour' : type === 'newsletter' ? 'Subscribe' : 'Get My Audit'
              }
              onSubmit={(data) => {
                onSubmit?.(data);
                onClose();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Popup Manager - Handles showing popups based on triggers
interface PopupManagerProps {
  pageType?: 'home' | 'service' | 'blog' | 'case-study';
}

export const PopupManager: React.FC<PopupManagerProps> = ({ pageType: _pageType } = {}) => {
  const [activePopup, setActivePopup] = useState<PopupProps['type'] | null>(null);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  // Track time on page
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollPercentage(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show welcome popup at 2-3 seconds
  useEffect(() => {
    if (timeOnPage === 2 && !activePopup && isFirstVisit()) {
      // Only show on first visit
      setTimeout(() => setActivePopup('welcome'), 500);
    }
  }, [timeOnPage, activePopup]);

  // Show engagement popup at 45-60 seconds after 30% scroll
  useEffect(() => {
    if (
      timeOnPage > 45 &&
      scrollPercentage > 30 &&
      !activePopup &&
      !hasSeenPopup('engagement')
    ) {
      setActivePopup('engagement');
      markPopupSeen('engagement');
    }
  }, [timeOnPage, scrollPercentage, activePopup]);

  // Show exit intent popup
  useEffect(() => {
    const handleMouseLeave = () => {
      if (!activePopup && scrollPercentage > 60 && !hasSeenPopup('exit-intent')) {
        setActivePopup('exit-intent');
        markPopupSeen('exit-intent');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [activePopup, scrollPercentage]);

  return (
    <Popup
      isOpen={activePopup !== null}
      onClose={() => setActivePopup(null)}
      type={activePopup || 'welcome'}
      onSubmit={(data) => {
        console.log('Lead captured:', data);
        // Send to CRM
      }}
    />
  );
};

// Helper functions for localStorage tracking
const isFirstVisit = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !localStorage.getItem('visited_before');
};

const hasSeenPopup = (popupType: string): boolean => {
  if (typeof window === 'undefined') return false;
  const key = `popup_${popupType}_seen`;
  return localStorage.getItem(key) === 'true';
};

const markPopupSeen = (popupType: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`popup_${popupType}_seen`, 'true');
  localStorage.setItem('visited_before', 'true');
};

export default { Popup, PopupManager };
