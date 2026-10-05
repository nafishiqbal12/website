// Polar sends raw signed webhook requests. This function validates the request
// before reading event metadata or creating a trusted settlement.

declare const Deno: {
  env: { get(key: string): string | undefined };
};

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return jsonError(405, 'Polar webhooks accept POST only.');

  const webhookSecret = Deno.env.get('POLAR_WEBHOOK_SECRET');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!webhookSecret || !supabaseUrl || !serviceRoleKey) return jsonError(500, 'Polar webhook server configuration is incomplete.');

  const rawBody = await request.text();
  let event: Record<string, unknown>;
  try {
    const { validateEvent } = await import('npm:@polar-sh/sdk/webhooks');
    event = asRecord(validateEvent(rawBody, request.headers, webhookSecret));
  } catch {
    return jsonError(400, 'Invalid Polar webhook signature.');
  }

  const eventType = stringValue(event.type);
  if (!eventType || !['order.paid', 'subscription.active'].includes(eventType)) {
    return Response.json({ ok: true, received: true, eventType, status: 'unsupported_event_ignored' });
  }

  const payload = asRecord(event.data);
  const metadata = asRecord(payload.metadata);
  const paymentAttemptId = stringValue(metadata.payment_attempt_id);
  const paymentObligationId = stringValue(metadata.payment_obligation_id);
  const organizationId = stringValue(metadata.organization_id);
  const projectId = stringValue(metadata.project_id);
  const providerEventId = stringValue(event.id) ?? stringValue(payload.id);
  const checkoutId = stringValue(payload.checkout_id) ?? stringValue(payload.id);
  const amountMinor = typeof payload.total_amount === 'number' ? payload.total_amount : null;
  const currency = stringValue(payload.currency)?.toUpperCase() ?? null;

  if (!paymentAttemptId || !paymentObligationId || !organizationId || !providerEventId || amountMinor === null || !currency) {
    return jsonError(400, 'Verified Polar event is missing settlement correlation or payment fields.');
  }

  const { createClient } = await import('npm:@supabase/supabase-js@2');
  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: attempt, error: attemptError } = await supabase
    .from('payment_attempts')
    .select('*')
    .eq('id', paymentAttemptId)
    .maybeSingle();
  if (attemptError || !attempt) return jsonError(404, 'No payment attempt matched the verified Polar event.');

  const { data: obligation, error: obligationError } = await supabase
    .from('payment_obligations')
    .select('*')
    .eq('id', paymentObligationId)
    .maybeSingle();
  if (obligationError || !obligation) return jsonError(404, 'No payment obligation matched the verified Polar event.');
  if (String(attempt.payment_obligation_id) !== paymentObligationId || String(obligation.organization_id) !== organizationId) {
    return jsonError(400, 'Verified Polar event does not match the internal payment source.');
  }
  if (projectId && String(obligation.project_id ?? '') !== projectId) return jsonError(400, 'Verified Polar event project does not match the obligation.');
  if (Number(obligation.amount_minor) !== amountMinor || String(obligation.currency).toUpperCase() !== currency) {
    return jsonError(400, 'Verified Polar amount or currency does not match the obligation.');
  }

  const { data: settlement, error: settlementError } = await supabase.rpc('create_payment_settlement', {
    p_organization_id: organizationId,
    p_project_id: projectId,
    p_payment_obligation_id: paymentObligationId,
    p_payment_attempt_id: paymentAttemptId,
    p_provider: 'polar',
    p_provider_event_id: providerEventId,
    p_provider_checkout_session_id: checkoutId,
    p_provider_payment_intent_id: null,
    p_provider_event_type: eventType,
    p_amount_minor: amountMinor,
    p_currency: currency,
    p_provider_metadata: {
      polar_event_id: providerEventId,
      polar_event_type: eventType,
      checkout_id: checkoutId,
      metadata,
    },
  });

  if (settlementError) {
    const message = settlementError.message || 'Polar settlement reconciliation failed.';
    if (message.includes('already used') || message.includes('already has a verified settlement')) {
      return Response.json({ ok: true, received: true, eventType, status: 'idempotent_noop' });
    }
    return jsonError(400, message);
  }

  return Response.json({ ok: true, received: true, eventType, status: 'settlement_recorded', settlementId: settlement?.id ?? null });
}
