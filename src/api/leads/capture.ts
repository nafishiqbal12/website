// API Route Handler for Lead Capture
// Place in: src/api/leads/capture.ts (or your API routes directory)

// NOTE: This file is designed for Next.js projects with the App Router
// For Vite/Express projects, convert to Express request/response handlers
// See implementation-guide.md for Vite conversion

// import { NextRequest, NextResponse } from 'next/server';
// For Vite, use: import { Request, Response } from 'express';

// Type definitions
interface LeadData {
  email: string;
  firstName: string;
  projectName?: string;
  niche?: string;
  stage?: string;
  budget?: string;
  challenge?: string;
  source?: string;
  timestamp?: string;
  phoneNumber?: string;
}

export interface CRMResponse {
  id: string;
  email: string;
  status: string;
  sequence: string;
  calendlyURL?: string;
  error?: string;
}

// HubSpot Integration
async function sendToHubSpot(lead: LeadData): Promise<any> {
  const hubspotApiKey = process.env.HUBSPOT_API_KEY;
  if (!hubspotApiKey) {
    throw new Error('HubSpot API key not configured');
  }

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hubspotApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          email: lead.email,
          firstname: lead.firstName,
          company: lead.projectName || '',
          hs_lead_status: 'new',
          lifecyclestage: 'lead',
          hs_lead_source: lead.source || 'website_form',
        },
      }),
    });

    const data = await response.json();

    // Add custom properties for segments
    if (data.id) {
      await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${hubspotApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            niche_type: lead.niche || '',
            startup_stage: lead.stage || '',
            marketing_budget: lead.budget || '',
            growth_challenge: lead.challenge || '',
            lead_source_page: lead.source || '',
            form_submission_date: lead.timestamp || new Date().toISOString(),
          },
        }),
      });
    }

    return data;
  } catch (error) {
    console.error('HubSpot error:', error);
    throw error;
  }
}

// Pipedrive Integration
async function sendToPipedrive(lead: LeadData): Promise<any> {
  const pipedriveApiToken = process.env.PIPEDRIVE_API_TOKEN;
  if (!pipedriveApiToken) {
    throw new Error('Pipedrive API token not configured');
  }

  try {
    const response = await fetch('https://api.pipedrive.com/v1/persons', {
      method: 'POST',
      body: JSON.stringify({
        name: lead.firstName,
        email: [{ value: lead.email, primary: true }],
        phone: lead.phoneNumber ? [{ value: lead.phoneNumber, primary: true }] : [],
        org_id: lead.projectName || '',
        notes: `Niche: ${lead.niche}\nStage: ${lead.stage}\nBudget: ${lead.budget}\nChallenge: ${lead.challenge}`,
        api_token: pipedriveApiToken,
      }),
    });

    return response.json();
  } catch (error) {
    console.error('Pipedrive error:', error);
    throw error;
  }
}

// Database Storage (Optional - for your own database)
async function saveToDB(lead: LeadData): Promise<any> {
  // This would save to your own database (MongoDB, PostgreSQL, etc.)
  // Example with Supabase:
  /*
  const { data, error } = await supabase
    .from('leads')
    .insert([lead]);
  
  if (error) throw error;
  return data;
  */

  console.log('Would save to DB:', lead);
  return { id: `lead_${Date.now()}`, ...lead };
}

// Email notification (send to internal team)
async function sendNotificationEmail(lead: LeadData): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.log('Resend API key not configured, skipping email notification');
    return;
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'leads@youragency.com',
        to: process.env.INTERNAL_LEAD_EMAIL || 'team@youragency.com',
        subject: `🚀 New Lead: ${lead.firstName} from ${lead.projectName}`,
        html: `
          <h2>New Lead Submission</h2>
          <p><strong>Name:</strong> ${lead.firstName}</p>
          <p><strong>Email:</strong> ${lead.email}</p>
          <p><strong>Project:</strong> ${lead.projectName}</p>
          <p><strong>Niche:</strong> ${lead.niche}</p>
          <p><strong>Stage:</strong> ${lead.stage}</p>
          <p><strong>Budget:</strong> ${lead.budget}</p>
          <p><strong>Challenge:</strong> ${lead.challenge}</p>
          <p><strong>Source:</strong> ${lead.source}</p>
          <p><strong>Submitted:</strong> ${lead.timestamp}</p>
          <hr />
          <p><a href="https://app.hubspot.com/search/contacts?q=${lead.email}">View in HubSpot</a></p>
        `,
      }),
    });
  } catch (error) {
    console.error('Email notification error:', error);
  }
}

// Determine email sequence based on lead segmentation
function determineEmailSequence(lead: LeadData): string {
  const niche = lead.niche?.toLowerCase() || '';
  const stage = lead.stage?.toLowerCase() || '';

  if (niche.includes('defi')) {
    return 'defi-growth-sequence';
  }
  if (niche.includes('nft')) {
    return 'nft-drop-sequence';
  }
  if (niche.includes('gaming')) {
    return 'gaming-ua-sequence';
  }
  if (niche.includes('exchange')) {
    return 'exchange-growth-sequence';
  }

  if (stage.includes('seed')) {
    return 'seed-stage-sequence';
  }
  if (stage.includes('series-a')) {
    return 'series-a-sequence';
  }

  return 'default-sequence';
}

// Generate Calendly URL with pre-filled params
function generateCalendlyURL(lead: LeadData): string {
  const params = new URLSearchParams();
  params.append('email', lead.email);
  params.append('name', lead.firstName);
  if (lead.projectName) {
    params.append('project', lead.projectName);
  }

  const calendlyUsername = process.env.CALENDLY_USERNAME || 'yourname';
  return `https://calendly.com/${calendlyUsername}/30min?${params.toString()}`;
}

// Validate lead data
function validateLead(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email address');
  }

  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push('First name is required');
  }

  if (data.phoneNumber && !/^[\d\s\-\+\(\)]+$/.test(data.phoneNumber)) {
    errors.push('Invalid phone number format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Main handler
// For Next.js:
// export async function POST(request: NextRequest): Promise<NextResponse<CRMResponse>> {

// For Vite/Express:
export async function handleLeadCapture(request: any): Promise<CRMResponse> {
  try {
    // Parse request body (for both Next.js and Express)
    let body;
    if (typeof request.json === 'function') {
      body = await request.json();
    } else {
      body = request.body || {};
    }
    
    const lead: LeadData = {
      email: body.email,
      firstName: body.firstName,
      projectName: body.projectName,
      niche: body.niche,
      stage: body.stage,
      budget: body.budget,
      challenge: body.challenge,
      source: body.source,
      timestamp: body.timestamp || new Date().toISOString(),
      phoneNumber: body.phoneNumber,
    };

    // Validate lead
    const validation = validateLead(lead);
    if (!validation.valid) {
    // For Vite/Express:
    return {
      id: '',
      email: lead.email,
      status: 'error',
      sequence: '',
      error: validation.errors.join(', '),
    };
    }

    // Determine email sequence
    const emailSequence = determineEmailSequence(lead);

    // Send to CRM(s)
    let crmId: string = '';

    // Try HubSpot first
    const hubspotEnabled = process.env.HUBSPOT_API_KEY;
    if (hubspotEnabled) {
      try {
        const hsResult = await sendToHubSpot(lead);
        crmId = hsResult.id;
        console.log('Lead sent to HubSpot:', crmId);
      } catch (error) {
        console.error('HubSpot integration failed:', error);
        // Fall back to database
      }
    }

    // Also try Pipedrive if configured
    const pipedriveEnabled = process.env.PIPEDRIVE_API_TOKEN;
    if (pipedriveEnabled && !hubspotEnabled) {
      try {
        const pdResult = await sendToPipedrive(lead);
        crmId = pdResult.data.id;
        console.log('Lead sent to Pipedrive:', crmId);
      } catch (error) {
        console.error('Pipedrive integration failed:', error);
      }
    }

    // Save to database
    try {
      const dbResult = await saveToDB(lead);
      if (!crmId) {
        crmId = dbResult.id;
      }
    } catch (error) {
      console.error('Database save failed:', error);
    }

    // Send notification email to team
    try {
      await sendNotificationEmail(lead);
    } catch (error) {
      console.error('Notification email failed:', error);
    }

    // Generate Calendly URL
    const calendlyURL = generateCalendlyURL(lead);

    // Return success response
    return {
      id: crmId || `lead_${Date.now()}`,
      email: lead.email,
      status: 'success',
      sequence: emailSequence,
      calendlyURL,
    };
  } catch (error) {
    console.error('Lead capture error:', error);

    return {
      id: '',
      email: '',
      status: 'error',
      sequence: '',
      error: 'Failed to process lead. Please try again.',
    };
  }
}

// For Next.js, use REPL form: export async function POST(request: NextRequest): Promise<NextResponse<CRMResponse>>
