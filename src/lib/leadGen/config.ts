import React, { useCallback } from 'react';

// Lead Generation Configuration & Hooks

// CRM/API Integration
export interface CRMConfig {
  provider: 'hubspot' | 'pipedrive' | 'custom';
  apiKey: string;
  listId?: string;
  endpoint?: string;
}

export interface LeadGenConfig {
  crm: CRMConfig;
  calendly: {
    username: string;
    timeSlots: number; // How many days ahead to show
  };
  analytics: {
    gtmId?: string;
    useGA4?: boolean;
  };
  emailProvider: 'mailchimp' | 'convertkit' | 'beehiiv' | 'custom';
  popupSettings: {
    enableWelcome: boolean;
    enableExitIntent: boolean;
    enableEngagement: boolean;
    enableOffer: boolean;
    maxPopupsPerSession: number;
  };
  formSettings: {
    defaultFields: 'short' | 'medium' | 'long';
    successRedirect?: string;
    successMessage: string;
  };
}

// Default configuration
export const defaultLeadGenConfig: LeadGenConfig = {
  crm: {
    provider: 'custom',
    apiKey: process.env.REACT_APP_CRM_API_KEY || '',
    endpoint: process.env.REACT_APP_CRM_ENDPOINT || '/api/leads/capture',
  },
  calendly: {
    username: process.env.REACT_APP_CALENDLY_USERNAME || 'yourname',
    timeSlots: 7,
  },
  analytics: {
    gtmId: process.env.REACT_APP_GTM_ID,
    useGA4: true,
  },
  emailProvider: 'custom',
  popupSettings: {
    enableWelcome: true,
    enableExitIntent: true,
    enableEngagement: true,
    enableOffer: true,
    maxPopupsPerSession: 2,
  },
  formSettings: {
    defaultFields: 'medium',
    successMessage: 'Thanks! Check your email for your audit report.',
  },
};

// Hook: Track lead generation events
export const useLeadGenTracking = () => {
  const trackEvent = useCallback(
    (eventName: string, eventData: Record<string, any>) => {
      // Google Analytics or GTM
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', eventName, eventData);
      }

      // Custom analytics
      console.log('[LeadGen Event]', eventName, eventData);
    },
    []
  );

  return { trackEvent };
};

// Hook: Form submission handling
export const useLeadFormSubmit = (config: LeadGenConfig) => {
  const { trackEvent } = useLeadGenTracking();

  const submitLead = useCallback(
    async (leadData: any) => {
      try {
        // Track form submission
        trackEvent('lead_form_submit', {
          source: leadData.source || 'unknown',
          niche: leadData.niche,
          stage: leadData.stage,
        });

        // Call CRM API
        const endpoint = config.crm.endpoint || '/api/leads/capture';
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.crm.apiKey}`,
          },
          body: JSON.stringify({
            ...leadData,
            timestamp: new Date().toISOString(),
            source: 'website',
          }),
        });

        if (!response.ok) {
          throw new Error(`CRM API error: ${response.status}`);
        }

        const result = await response.json();

        // Track successful submission
        trackEvent('lead_form_success', {
          leadId: result.id,
          email: leadData.email,
        });

        return result;
      } catch (error) {
        console.error('Lead form submission error:', error);
        trackEvent('lead_form_error', {
          error: String(error),
          leadEmail: leadData.email,
        });
        throw error;
      }
    },
    [config, trackEvent]
  );

  return { submitLead };
};

// Hook: Popup management
export const usePopupManager = (
  config: LeadGenConfig
) => {
  const [shown, setShown] = React.useState<Set<string>>(new Set());

  const canShowPopup = useCallback((popupType: string) => {
    const sessionKey = `popup_${popupType}_session`;
    const isShownThisSession = sessionStorage.getItem(sessionKey) === 'true';
    return !isShownThisSession && shown.size < config.popupSettings.maxPopupsPerSession;
  }, [config, shown]);

  const showPopup = useCallback(
    (popupType: string) => {
      if (canShowPopup(popupType)) {
        sessionStorage.setItem(`popup_${popupType}_session`, 'true');
        setShown((prev) => new Set([...prev, popupType]));
      }
    },
    [canShowPopup]
  );

  return { canShowPopup, showPopup, shown };
};

// Service for building Calendly URLs
export const CalendlyService = {
  buildURL: (username: string, params?: Record<string, string>) => {
    const url = new URL(`https://calendly.com/${username}/30min`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  },

  openBooking: (username: string, params?: Record<string, string>) => {
    const url = CalendlyService.buildURL(username, params);
    window.open(url, '_blank');
  },
};

// Service for segmenting leads
export const LeadSegmentation = {
  byNiche: (leadData: any) => {
    const niche = leadData.niche?.toLowerCase();
    return {
      isDeFi: niche?.includes('defi') || niche?.includes('protocol'),
      isNFT: niche?.includes('nft') || niche?.includes('collection'),
      isExchange: niche?.includes('exchange') || niche?.includes('dex'),
      isGaming: niche?.includes('gaming') || niche?.includes('game'),
      other: ![niche?.includes('defi'), niche?.includes('nft'), niche?.includes('exchange'), niche?.includes('gaming')].some(Boolean),
    };
  },

  byStage: (leadData: any) => {
    const stage = leadData.stage?.toLowerCase();
    return {
      isEarly: stage?.includes('pre-seed') || stage?.includes('seed') || stage?.includes('bootstrapped'),
      isGrowing: stage?.includes('series-a') || stage?.includes('series-b'),
      isScaling: stage?.includes('series-b+') || stage?.includes('growth'),
    };
  },

  getEmailSequence: (leadData: any) => {
    const niche = LeadSegmentation.byNiche(leadData);
    const stage = LeadSegmentation.byStage(leadData);

    if (niche.isDeFi) {
      return 'defi-sequence';
    }
    if (niche.isNFT) {
      return 'nft-sequence';
    }
    if (niche.isGaming) {
      return 'gaming-sequence';
    }
    if (stage.isEarly) {
      return 'early-stage-sequence';
    }
    return 'default-sequence';
  },
};

// Service for CRM integrations
export const CRMIntegration = {
  hubspot: {
    createContact: async (apiKey: string, leadData: any) => {
      const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            email: leadData.email,
            firstname: leadData.firstName,
            lastname: leadData.lastName || '',
            company: leadData.projectName,
            lifecyclestage: 'lead',
            hs_lead_status: 'new',
            notes: `Niche: ${leadData.niche}\nStage: ${leadData.stage}\nBudget: ${leadData.budget}`,
          },
        }),
      });
      return response.json();
    },
  },

  pipedrive: {
    createPerson: async (apiKey: string, leadData: any) => {
      const response = await fetch('https://api.pipedrive.com/v1/persons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: leadData.firstName,
          email: [{ value: leadData.email, primary: true }],
          org_id: leadData.projectName,
          notes: `Niche: ${leadData.niche}, Stage: ${leadData.stage}`,
          api_token: apiKey,
        }),
      });
      return response.json();
    },
  },

  custom: {
    createLead: async (endpoint: string, apiKey: string, leadData: any) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(leadData),
      });
      return response.json();
    },
  },
};

// Service for Email Marketing integrations
export const EmailIntegration = {
  subscribe: async (provider: string, email: string, config: any) => {
    if (provider === 'mailchimp') {
      // Mailchimp API call
      const response = await fetch('https://us1.api.mailchimp.com/3.0/lists/{list_id}/members', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`anystring:${config.apiKey}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
        }),
      });
      return response.json();
    }

    if (provider === 'convertkit') {
      // ConvertKit API call
      const response = await fetch(`https://api.convertkit.com/v3/forms/${config.formId}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          api_key: config.apiKey,
        }),
      });
      return response.json();
    }

    // Custom endpoint
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },
};

// A/B Testing helper
export const ABTestHelper = {
  getVariant: (testName: string, variants: string[]): string => {
    if (typeof window === 'undefined') return variants[0];
    const key = `ab_test_${testName}`;
    let variant = localStorage.getItem(key);

    if (!variant) {
      variant = variants[Math.floor(Math.random() * variants.length)];
      localStorage.setItem(key, variant);
    }

    return variant;
  },

  trackVariant: (testName: string, variant: string, action: string) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'ab_test_tracking', {
        test_name: testName,
        variant,
        action,
      });
    }
  },
};

// Funnel tracking
export const FunnelTracking = {
  trackStep: (funnelName: string, stepNumber: number, stepName: string, data?: any) => {
    console.log(`[Funnel: ${funnelName}] Step ${stepNumber}: ${stepName}`, data);

    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'funnel_step', {
        funnel_name: funnelName,
        step_number: stepNumber,
        step_name: stepName,
        ...data,
      });
    }
  },

  trackConversion: (funnelName: string, data?: any) => {
    console.log(`[Funnel: ${funnelName}] Conversion!`, data);

    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'funnel_conversion', {
        funnel_name: funnelName,
        ...data,
      });
    }
  },

  trackAbandonment: (funnelName: string, stepName: string, data?: any) => {
    console.log(`[Funnel: ${funnelName}] Abandoned at ${stepName}`, data);

    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'funnel_abandonment', {
        funnel_name: funnelName,
        abandoned_at_step: stepName,
        ...data,
      });
    }
  },
};

export default {
  defaultLeadGenConfig,
  useLeadGenTracking,
  useLeadFormSubmit,
  usePopupManager,
  CalendlyService,
  LeadSegmentation,
  CRMIntegration,
  EmailIntegration,
  ABTestHelper,
  FunnelTracking,
};
