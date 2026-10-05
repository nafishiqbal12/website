// Polar checkout creation is server-only. The browser calls this function with
// internal IDs; the OAT and product IDs stay in the trusted function environment.

declare const Deno: {
  env: { get(key: string): string | undefined };
};

type CheckoutRequest = {
  paymentObligationId?: unknown;
  paymentAttemptId?: unknown;
  idempotencyKey?: unknown;
};

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return jsonError(405, 'Polar checkout accepts POST only.');

  const accessToken = Deno.env.get('POLAR_ACCESS_TOKEN');
  const environment = (Deno.env.get('POLAR_ENVIRONMENT') ?? 'sandbox').toLowerCase();
  const oneTimeProductId = Deno.env.get('POLAR_ONE_TIME_PRODUCT_ID');
  const subscriptionProductId = Deno.env.get('POLAR_SUBSCRIPTION_PRODUCT_ID');
  const successUrl = Deno.env.get('POLAR_SUCCESS_URL');
  const returnUrl = Deno.env.get('POLAR_RETURN_URL');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!accessToken || !supabaseUrl || !serviceRoleKey) {
    return jsonError(500, 'Polar checkout server configuration is incomplete.');
  }
  if (!successUrl) return jsonError(500, 'POLAR_SUCCESS_URL is not configured.');
  if (environment !== 'sandbox' && environment !== 'production') {
    return jsonError(500, 'POLAR_ENVIRONMENT must be sandbox or production.');
  }

  const authorization = request.headers.get('authorization');
  const bearer = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!bearer) return jsonError(401, 'Authenticated user authorization is required.');

  const body = await request.json().catch(() => null) as CheckoutRequest | null;
  const paymentObligationId = getString(body?.paymentObligationId);
  const paymentAttemptId = getString(body?.paymentAttemptId);
  const idempotencyKey = getString(body?.idempotencyKey);
  if (!paymentObligationId || !paymentAttemptId || !idempotencyKey) {
    return jsonError(422, 'Payment obligation, attempt, and idempotency key are required.');
  }

  const { createClient } = await import('npm:@supabase/supabase-js@2');
  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: userData, error: userError } = await admin.auth.getUser(bearer);
  if (userError || !userData.user) return jsonError(401, 'Authenticated user could not be verified.');

  const { data: obligation, error: obligationError } = await admin
    .from('payment_obligations')
    .select('*')
    .eq('id', paymentObligationId)
    .maybeSingle();
  if (obligationError || !obligation) return jsonError(404, 'Payment obligation was not found.');

  const { data: membership, error: membershipError } = await admin
    .from('organization_members')
    .select('id, role, status')
    .eq('organization_id', obligation.organization_id)
    .eq('user_id', userData.user.id)
    .eq('status', 'ACTIVE')
    .maybeSingle();
  if (membershipError || !membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
    return jsonError(403, 'Only an active organization owner or admin may start checkout.');
  }

  const { data: attempt, error: attemptError } = await admin
    .from('payment_attempts')
    .select('*')
    .eq('id', paymentAttemptId)
    .eq('payment_obligation_id', paymentObligationId)
    .maybeSingle();
  if (attemptError || !attempt) return jsonError(404, 'Payment attempt was not found.');
  if (attempt.status !== 'CREATED' && attempt.status !== 'PROCESSING') return jsonError(422, 'Payment attempt is not eligible for checkout.');
  if (obligation.status !== 'PENDING') return jsonError(422, 'Payment obligation is not pending.');
  if (String(attempt.amount_minor) !== String(obligation.amount_minor) || attempt.currency !== obligation.currency) {
    return jsonError(422, 'Payment attempt does not match the obligation.');
  }

  const productId = obligation.payment_purpose === 'ONGOING_SERVICE' ? subscriptionProductId : oneTimeProductId;
  if (!productId) return jsonError(500, 'The Polar product ID for this payment purpose is not configured.');

  const apiBase = environment === 'production' ? 'https://api.polar.sh/v1' : 'https://sandbox-api.polar.sh/v1';
  const successRedirect = new URL(successUrl);
  successRedirect.searchParams.set('checkout_id', '{CHECKOUT_ID}');
  const response = await fetch(`${apiBase}/checkouts/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      products: [productId],
      success_url: successRedirect.toString(),
      return_url: returnUrl ?? null,
      external_customer_id: userData.user.id,
      metadata: {
        organization_id: obligation.organization_id,
        project_id: obligation.project_id ?? '',
        payment_obligation_id: paymentObligationId,
        payment_attempt_id: paymentAttemptId,
        idempotency_key: idempotencyKey,
        provider: 'polar',
      },
    }),
  });

  const responseBody = await response.json().catch(() => null) as Record<string, unknown> | null;
  if (!response.ok) return jsonError(502, `Polar checkout creation failed with status ${response.status}.`);

  const checkoutUrl = getString(responseBody?.url);
  const checkoutId = getString(responseBody?.id);
  if (!checkoutUrl || !checkoutId) return jsonError(502, 'Polar returned an incomplete checkout session.');

  return Response.json({
    ok: true,
    provider: 'polar',
    checkoutSessionReference: checkoutId,
    checkoutUrl,
  });
}
