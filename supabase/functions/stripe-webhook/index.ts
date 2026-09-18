// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./deno.d.ts" />

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

type StripeEvent = {
  id: string;
  type: string;
  data: { object: unknown };
};

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const SUPPORTED_EVENTS = new Set(['checkout.session.completed']);

function isValidHttpMethod(method: string | null): boolean {
  return method === 'POST';
}

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(request: Request): Promise<Response> {
  if (!isValidHttpMethod(request.method)) {
    return jsonError(405, 'Method not allowed. Stripe webhooks accept POST only.');
  }

  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text();

  if (!signature) {
    return jsonError(400, 'Missing Stripe-Signature header.');
  }

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return jsonError(500, 'Stripe server secrets are not configured.');
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonError(500, 'Supabase server configuration is incomplete.');
  }

  let event: StripeEvent;
  try {
    const [{ createClient }, { default: Stripe }] = await Promise.all([
      import('npm:@supabase/supabase-js@2'),
      import('npm:stripe@22.6.2'),
    ]);
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return jsonError(400, `Invalid Stripe signature: ${error instanceof Error ? error.message : 'unknown error'}`);
  }

  if (!SUPPORTED_EVENTS.has(event.type)) {
    return Response.json({ ok: true, received: true, eventType: event.type, status: 'unsupported_event_ignored' }, { status: 200 });
  }

  const session = event.data.object as unknown as Record<string, unknown>;
  const sessionId = typeof session.id === 'string' ? session.id : null;
  const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;
  const amountTotal = typeof session.amount_total === 'number' ? session.amount_total : null;
  const currency = typeof session.currency === 'string' ? session.currency.toUpperCase() : null;
  const metadata = (session.metadata && typeof session.metadata === 'object' ? session.metadata : {}) as Record<string, unknown>;
  const paymentAttemptId = typeof metadata.payment_attempt_id === 'string' ? metadata.payment_attempt_id : null;
  const paymentObligationId = typeof metadata.payment_obligation_id === 'string' ? metadata.payment_obligation_id : null;
  const organizationId = typeof metadata.organization_id === 'string' ? metadata.organization_id : null;
  const projectId = typeof metadata.project_id === 'string' ? metadata.project_id : null;

  if (!sessionId || !paymentAttemptId || !paymentObligationId || !organizationId) {
    return jsonError(400, 'Verified Stripe event is missing the internal correlation metadata required for settlement reconciliation.');
  }

  const { createClient } = await import('npm:@supabase/supabase-js@2');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: attempt, error: attemptError } = await supabase
    .from('payment_attempts')
    .select('*')
    .eq('id', paymentAttemptId)
    .maybeSingle();

  if (attemptError || !attempt) {
    return jsonError(404, 'No payment attempt matched the verified provider event.');
  }

  const expectedObligationId = String(attempt.payment_obligation_id ?? '');
  if (expectedObligationId !== paymentObligationId) {
    return jsonError(400, 'Verified payment event does not match the internal payment obligation reference.');
  }

  const { data: obligation, error: obligationError } = await supabase
    .from('payment_obligations')
    .select('*')
    .eq('id', paymentObligationId)
    .maybeSingle();

  if (obligationError || !obligation) {
    return jsonError(404, 'No payment obligation matched the verified provider event.');
  }

  if (String(obligation.organization_id ?? '') !== organizationId) {
    return jsonError(400, 'Verified payment event organization does not match the internal obligation.');
  }

  if (projectId && String(obligation.project_id ?? '') !== projectId) {
    return jsonError(400, 'Verified payment event project does not match the internal obligation.');
  }

  const expectedAmount = Number(obligation.amount_minor ?? 0);
  if (amountTotal == null || amountTotal !== expectedAmount) {
    return jsonError(400, 'Verified payment amount does not match the internal payment obligation.');
  }

  const expectedCurrency = String(obligation.currency ?? 'USD');
  if (currency !== expectedCurrency) {
    return jsonError(400, 'Verified payment currency does not match the internal payment obligation.');
  }

  const { data: settlement, error: settlementError } = await supabase.rpc('create_payment_settlement', {
    p_organization_id: organizationId,
    p_project_id: projectId,
    p_payment_obligation_id: paymentObligationId,
    p_payment_attempt_id: paymentAttemptId,
    p_provider: 'stripe',
    p_provider_event_id: event.id,
    p_provider_checkout_session_id: sessionId,
    p_provider_payment_intent_id: paymentIntentId,
    p_provider_event_type: event.type,
    p_amount_minor: expectedAmount,
    p_currency: expectedCurrency,
    p_provider_metadata: {
      checkout_session_id: sessionId,
      payment_intent_id: paymentIntentId,
      amount_total: amountTotal,
      currency,
      metadata,
      stripe_event_id: event.id,
      stripe_event_type: event.type,
    },
  });

  if (settlementError) {
    const message = settlementError.message || 'Settlement reconciliation failed.';
    if (message.includes('already used') || message.includes('already has a verified settlement')) {
      return Response.json({ ok: true, received: true, eventType: event.type, status: 'idempotent_noop', settlementId: null }, { status: 200 });
    }
    return jsonError(400, message);
  }

  return Response.json({
    ok: true,
    received: true,
    eventType: event.type,
    status: 'settlement_recorded',
    settlementId: settlement?.id ?? null,
    paymentAttemptId,
    paymentObligationId,
  }, { status: 200 });
}
