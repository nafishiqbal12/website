import { paymentService } from '../lib/payments/service';

export async function handleStripeWebhook(request: Request): Promise<Response> {
  const signature = request.headers.get('stripe-signature') ?? undefined;
  const rawBody = await request.text();

  const verification = await paymentService.verifyWebhookEvent(rawBody, signature);
  if (!verification.ok) {
    return Response.json(
      {
        ok: false,
        error: verification.error.message,
      },
      { status: 400 },
    );
  }

  return Response.json(
    {
      ok: true,
      provider: verification.provider,
      eventId: verification.eventId,
      eventType: verification.eventType,
      objectType: verification.objectType,
      objectId: verification.objectId,
      verificationStatus: verification.verificationStatus,
      settlement: 'pending-trusted-server-reconciliation',
    },
    { status: 200 },
  );
}
