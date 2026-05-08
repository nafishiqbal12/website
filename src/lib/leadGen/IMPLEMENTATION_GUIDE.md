# Lead Generation System Implementation Guide

## Overview

This lead generation system includes:
- **CTA Components**: Reusable buttons with variants
- **Forms**: Configurable field sets (short/medium/long)
- **Popups**: Welcome, exit-intent, engagement, offer, newsletter
- **Trust Components**: Social proof, testimonials, awards, badges
- **Email Capture**: Hero CTAs, mid-page sections, sidebars, footers
- **Analytics & CRM**: Segment leads, track funnels, integrate with HubSpot/Pipedrive
- **Calendly Integration**: Booking popup with pre-fill
- **A/B Testing**: Built-in variant tracking

---

## Quick Start

### 1. Configure Lead Gen System

Create/update `.env.local`:

```env
REACT_APP_CRM_API_KEY=your_crm_api_key
REACT_APP_CRM_ENDPOINT=/api/leads/capture
REACT_APP_CALENDLY_USERNAME=your_calendly_username
REACT_APP_GTM_ID=GTM-XXXXX
```

### 2. Add PopupManager to Root Layout

In `src/App.tsx`:

```tsx
import { PopupManager } from './components/PopupManager';

export default function App() {
  return (
    <>
      <PopupManager pageType="home" />
      {/* Rest of app */}
    </>
  );
}
```

### 3. Add Components to Pages

#### Service Page Example

```tsx
import { HeroCTA, ServiceSidebarCTA, EndOfPostCTA } from '@/components/EmailCaptureComponents';
import { TestimonialCarousel, CaseStudyTeasers } from '@/components/TrustComponents';
import { useLeadFormSubmit } from '@/lib/leadGen/config';
import { defaultLeadGenConfig } from '@/lib/leadGen/config';

export default function ServicePage() {
  const { submitLead } = useLeadFormSubmit(defaultLeadGenConfig);

  const handleFormSubmit = async (data) => {
    try {
      await submitLead({
        ...data,
        source: 'defi-marketing-service-page',
        service: 'DeFi Marketing',
      });
    } catch (error) {
      console.error('Failed to submit lead');
    }
  };

  return (
    <>
      {/* Hero + Form */}
      <HeroCTA
        headline="Get Your Free DeFi Marketing Audit"
        subheadline="See what's holding you back from 10K+ community members in 15 minutes"
        onSubmit={handleFormSubmit}
      />

      {/* Service content here */}

      {/* Mid-page testimonial + CTA */}
      <MidPageCTA
        testimonial="They grew our protocol from $5M to $50M TVL in just 3 months."
        author="Sarah Chen"
        company="LendingDAO"
        onSubmit={handleFormSubmit}
      />

      {/* Testimonials carousel */}
      <TestimonialCarousel testimonials={testimonials} />

      {/* Case study teasers */}
      <CaseStudyTeasers studies={caseStudies} />

      {/* End of page CTA */}
      <EndOfPostCTA
        headline="Ready to Scale Your Protocol?"
        onSubmit={handleFormSubmit}
      />
    </>
  );
}
```

#### Blog Post Example

```tsx
import { EndOfPostCTA, SidebarNewsletter } from '@/components/EmailCaptureComponents';
import { useLeadFormSubmit } from '@/lib/leadGen/config';

export default function BlogPost() {
  const { submitLead } = useLeadFormSubmit(defaultLeadGenConfig);

  return (
    <article className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <main className="lg:col-span-3">
        {/* Blog content */}

        {/* End of post CTA */}
        <EndOfPostCTA
          headline="Looking for Growth Strategies for Your Project?"
          onSubmit={(data) =>
            submitLead({
              ...data,
              source: 'blog-post',
              postTitle: 'DeFi Growth Hacks',
            })
          }
        />
      </main>

      <aside>
        <SidebarNewsletter
          onSubmit={(email) =>
            submitLead({
              email,
              source: 'blog-sidebar-newsletter',
            })
          }
        />
      </aside>
    </article>
  );
}
```

---

## Component Usage Reference

### CTA Button

```tsx
import { CTAButton } from '@/components/LeadGenComponents';

<CTAButton
  variant="primary" // 'primary' | 'secondary' | 'outline'
  size="lg" // 'sm' | 'md' | 'lg'
  onClick={() => console.log('clicked')}
  icon={<Icon />}
>
  Get Your Audit
</CTAButton>
```

### Lead Form (Flexible Field Count)

```tsx
import { LeadForm } from '@/components/LeadGenComponents';

<LeadForm
  fields="medium" // 'short' (2 fields) | 'medium' (4 fields) | 'long' (6+ fields)
  headline="Get Your Free Audit"
  subheadline="See your growth gaps"
  submitButtonText="Get My Audit"
  onSubmit={(data) => console.log(data)}
/>
```

**Short form output**: `{ email, firstName }`
**Medium form output**: `{ email, firstName, projectName, niche }`
**Long form output**: `{ email, firstName, projectName, niche, stage, budget, challenge }`

### Popup

```tsx
import { Popup } from '@/components/PopupManager';

<Popup
  isOpen={isPopupOpen}
  onClose={() => setIsPopupOpen(false)}
  type="welcome" // 'welcome' | 'exit-intent' | 'newsletter' | 'offer' | 'engagement'
  onSubmit={(data) => console.log(data)}
/>
```

### Trust Components

```tsx
// Social proof wall
import { SocialProofWall } from '@/components/TrustComponents';
<SocialProofWall
  title="Trusted by 500+ Crypto Projects"
  subtitle="Leading DeFi, NFT, and Gaming projects..."
/>

// Testimonial carousel
import { TestimonialCarousel } from '@/components/TrustComponents';
<TestimonialCarousel
  testimonials={[
    {
      quote: "They grew our project 10x in 90 days",
      author: "Jane Founder",
      role: "CEO",
      company: "TokenDAO",
      avatar: "https://...",
      metric: "50K → 500K followers",
    },
  ]}
  autoAdvance={true}
  autoAdvanceInterval={8000}
/>

// Awards & Recognition
import { AwardsRecognition } from '@/components/TrustComponents';
<AwardsRecognition />

// Case Study Teasers
import { CaseStudyTeasers } from '@/components/TrustComponents';
<CaseStudyTeasers
  studies={[
    {
      metric: "10x Growth",
      project: "LendingDAO",
      description: "Grew from 5K to 50K followers using strategic DeFi tactics",
      slug: "lendingdao-10x-growth",
    },
  ]}
/>
```

### Email Capture Sections

```tsx
import {
  HeroCTA,
  MidPageCTA,
  SidebarNewsletter,
  EndOfPostCTA,
  FooterCTABar,
  ServiceSidebarCTA,
  NewsletterSubscribe,
} from '@/components/EmailCaptureComponents';

// Hero + Form
<HeroCTA
  headline="Get Your Free Crypto Marketing Audit"
  subheadline="See your growth gaps"
  onSubmit={(data) => console.log(data)}
/>

// Mid-page testimonial + CTA
<MidPageCTA
  testimonial="Best investment we made for growth"
  author="Founder Pro"
  company="MyToken"
  onSubmit={(data) => console.log(data)}
/>

// General newsletter subscription
<NewsletterSubscribe
  placement="header" // 'header' | 'sidebar' | 'footer' | 'popup'
  onSubscribe={(email) => console.log(email)}
/>
```

---

## Lead Segmentation & Sequencing

### Automatically Route Leads to Right Email Sequence

```tsx
import { LeadSegmentation } from '@/lib/leadGen/config';

const leadData = {
  email: 'founder@defi.xyz',
  niche: 'DeFi Protocol',
  stage: 'seed',
};

const emailSequence = LeadSegmentation.getEmailSequence(leadData);
// Returns: 'defi-sequence' (DeFi specific) or 'early-stage-sequence'
```

### Segment by Niche

```tsx
const segments = LeadSegmentation.byNiche(leadData);
console.log(segments); // { isDeFi: true, isNFT: false, isExchange: false, isGaming: false, other: false }
```

### Segment by Stage

```tsx
const stageSegments = LeadSegmentation.byStage(leadData);
console.log(stageSegments); // { isEarly: true, isGrowing: false, isScaling: false }
```

---

## Calendly Integration

### Option 1: Direct Button

```tsx
import { CalendlyButton } from '@/components/EmailCaptureComponents';

<CalendlyButton
  email="prospect@company.com"
  firstName="John"
  projectName="MyToken"
  bookText="Schedule Your Strategy Call"
/>
```

### Option 2: Calendly Service

```tsx
import { CalendlyService } from '@/lib/leadGen/config';

// Build URL with params
const url = CalendlyService.buildURL('yourname', {
  email: 'prospect@company.com',
  name: 'John Founder',
});

// Or open directly
CalendlyService.openBooking('yourname', {
  email: leadData.email,
  project: leadData.projectName,
});
```

---

## Popup Strategies & Timing

### Automatic Popup Manager

The `PopupManager` component automatically shows popups based on:

1. **Welcome Popup** (2-3 seconds on page load, first-time visitors)
2. **Engagement Popup** (45+ seconds after 30% scroll)
3. **Exit Intent Popup** (mouse leaves viewport)
4. **Offer Popup** (return visitors after 2nd visit, seen as "upgraded" offer)

```tsx
// In App.tsx
<PopupManager pageType="service" />
```

### Manual Popup Control

```tsx
import { Popup } from '@/components/PopupManager';

const [showPopup, setShowPopup] = useState(false);

<Popup
  isOpen={showPopup}
  onClose={() => setShowPopup(false)}
  type="exit-intent"
  onSubmit={(data) => submitLead(data)}
/>
```

---

## CRM Integration

### HubSpot Example

```tsx
import { CRMIntegration } from '@/lib/leadGen/config';

const result = await CRMIntegration.hubspot.createContact(
  process.env.REACT_APP_CRM_API_KEY,
  {
    email: 'founder@example.com',
    firstName: 'John',
    projectName: 'MyToken',
    niche: 'DeFi',
    stage: 'seed',
  }
);
```

### Pipedrive Example

```tsx
const result = await CRMIntegration.pipedrive.createPerson(
  process.env.REACT_APP_CRM_API_KEY,
  leadData
);
```

### Custom API

```tsx
const result = await CRMIntegration.custom.createLead(
  process.env.REACT_APP_CRM_ENDPOINT,
  process.env.REACT_APP_CRM_API_KEY,
  leadData
);
```

---

## Analytics & Tracking

### Track Funnel Steps

```tsx
import { FunnelTracking } from '@/lib/leadGen/config';

// Step 1: Form viewed
FunnelTracking.trackStep('audit-request', 1, 'form_viewed', {
  page: 'defi-service-page',
});

// Step 2: Form started
FunnelTracking.trackStep('audit-request', 2, 'form_started', {
  email: 'user@example.com',
});

// Step 3: Form completed (conversion)
FunnelTracking.trackConversion('audit-request', {
  leadId: 123,
  niche: 'DeFi',
});

// Or track abandonment
FunnelTracking.trackAbandonment('audit-request', 'stage_selection', {
  email: 'user@example.com',
});
```

### A/B Testing

```tsx
import { ABTestHelper } from '@/lib/leadGen/config';

const ctaCopy = ABTestHelper.getVariant('cta-copy', [
  'Get Your Audit',
  'Schedule a Call',
  'Start Growing',
]);

// Track which variant user engaged with
ABTestHelper.trackVariant('cta-copy', ctaCopy, 'click');
```

---

## Best Practices

### 1. Form Length by Page Type

| Page Type        | Recommended Fields |
|------------------|--------------------|
| Blog posts       | short (2 fields)   |
| Service pages    | medium (4 fields)  |
| Landing pages    | medium or long     |
| Popup            | short (2 fields)   |
| Sticky sidebar   | short (2 fields)   |

### 2. CTA Placement

- **Hero section**: Medium form + testimonial
- **After case study**: Short form for Calendly booking
- **Before footer**: 3-button CTA bar (audit, call, newsletter)
- **Blog sidebar**: Newsletter only
- **Exit intent**: Newsletter or free resource

### 3. Popup Frequency

- Max 2 popups per session
- Show different popup types to repeat visitors
- Suppress popup after 1st dismissal for 24 hours
- Don't show popup to users already on a form

### 4. Email Sequences

Segment by:
- **Niche**: DeFi, NFT, Exchange, Gaming sequences
- **Stage**: Pre-seed, Seed, Series A sequences
- **Source**: Blog, service page, podcast sequences

Each sequence tailored to pain points and budget.

### 5. Conversion Optimization

- **Risk reversal**: "Free audit, zero obligations"
- **Social proof**: "500+ projects audited"
- **Urgency**: "Spots filling up this week"
- **Specificity**: "Grow your community 10x like we did for LendingDAO"

---

## API Endpoints (Backend)

### Lead Capture Endpoint

`POST /api/leads/capture`

**Request**:
```json
{
  "email": "founder@example.com",
  "firstName": "John",
  "projectName": "MyToken",
  "niche": "DeFi",
  "stage": "seed",
  "budget": "10-25k",
  "source": "defi-service-page",
  "timestamp": "2024-05-08T10:30:00Z"
}
```

**Response**:
```json
{
  "id": "lead_12345",
  "email": "founder@example.com",
  "status": "new",
  "sequence": "defi-sequence",
  "calendlyURL": "https://calendly.com/demo/30min?email=founder@example.com"
}
```

---

## Monitoring & Optimization

### Key Metrics to Track

| Metric                    | Target  | Action if Below |
|---------------------------|---------|-----------------|
| Form view-to-submit rate  | 25-30%  | Simplify form    |
| Popup conversion rate     | 5-8%    | Test new copy    |
| Email open rate           | 35%+    | Refresh subjects |
| Email click rate          | 5%+     | Improve content  |
| Calendly booking rate     | 20%     | Add incentive    |

### Monthly Optimization

- Review form abandonment rates
- A/B test CTA copy variants
- Analyze best-performing lead magnets
- Optimize email sequences by open/click rates
- Track cost-per-qualified-lead

