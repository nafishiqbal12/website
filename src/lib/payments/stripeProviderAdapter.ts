import type { PaymentProviderAdapter } from './providerAdapter';
import type { PaymentSourceContext } from './types';

const DEFAULT_API_VERSION = '2024-06-20';

function getServerEnvValue(name: string): string | undefined {
  if (typeof window !== 'undefined') return undefined;
  const maybeProcess = typeof process !== 'undefined' ? process : undefined;
  const value = maybeProcess?.env?.[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}

function runtimeProviderNotConfigured(message: string) {
  return {
    ok: false as const,
    error: {
      code: 'PROVIDER_NOT_CONFIGURED' as const,
      message,
      retryable: false,
    },
  };
}

function getProviderStatus(status: string | null | undefined): 'CREATED' | 'PROCESSING' | 'FAILED' | 'CANCELLED' | 'EXPIRED' {
  switch ((status ?? '').toLowerCase()) {
    case 'complete':
      return 'PROCESSING';
    case 'open':
      return 'PROCESSING';
    case 'expired':
      return 'EXPIRED';
    case 'canceled':
      return 'CANCELLED';
    case 'payment_failed':
      return 'FAILED';
    default:
      return 'CREATED';
  }
}

export function createStripeProviderAdapter(): PaymentProviderAdapter {
  const providerKey = 'stripe';

  return {
    provider: providerKey,

    async createCheckoutSession(context: PaymentSourceContext) {
      const secretKey = getServerEnvValue('STRIPE_SECRET_KEY');
      if (!secretKey) {
        return runtimeProviderNotConfigured('Stripe is not configured in the server environment. Checkout is unavailable until STRIPE_SECRET_KEY is set.');
      }

      try {
        const { default: Stripe } = await import('stripe');
        const stripe = new Stripe(secretKey, { apiVersion: DEFAULT_API_VERSION as any });
        const amount = Number(context.obligation.amountMinor);
        const currency = (context.obligation.currency ?? 'USD').toLowerCase();
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency,
                unit_amount: Number.isFinite(amount) ? amount : 0,
                product_data: {
                  name: `BlockWaveLab payment obligation ${context.obligation.id.slice(0, 8)}`,
                  description: `Payment obligation for ${context.obligation.paymentPurpose.toLowerCase()} billing.`,
                },
              },
            },
          ],
          metadata: {
            organization_id: context.obligation.organizationId,
            project_id: context.obligation.projectId ?? '',
            payment_obligation_id: context.obligation.id,
            payment_attempt_id: context.attempt.id,
            idempotency_key: context.attempt.idempotencyKey,
            provider: providerKey,
          },
          client_reference_id: context.attempt.id,
          success_url: `${typeof window !== 'undefined' ? window.location.origin : 'https://blockwavelab.com'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${typeof window !== 'undefined' ? window.location.origin : 'https://blockwavelab.com'}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
        });

        return {
          ok: true,
          provider: providerKey,
          checkoutSessionReference: session.id,
          checkoutUrl: session.url,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Stripe checkout could not be created.';
        return {
          ok: false,
          error: {
            code: 'PROVIDER_ERROR',
            message,
            retryable: false,
          },
        };
      }
    },

    async retrieveCheckoutStatus(context: PaymentSourceContext) {
      const secretKey = getServerEnvValue('STRIPE_SECRET_KEY');
      if (!secretKey) {
        return runtimeProviderNotConfigured('Stripe is not configured in the server environment. Payment status is unavailable until STRIPE_SECRET_KEY is set.');
      }

      const providerReference = (context.attempt.commercialSnapshot as Record<string, unknown> | undefined)?.provider_checkout_session_id as string | undefined;
      if (!providerReference) {
        return {
          ok: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'No Stripe checkout session reference exists for this payment attempt.',
            retryable: false,
          },
        };
      }

      try {
        const { default: Stripe } = await import('stripe');
        const stripe = new Stripe(secretKey, { apiVersion: DEFAULT_API_VERSION as any });
        const session = await stripe.checkout.sessions.retrieve(providerReference);
        const providerPaymentReference = typeof session.payment_intent === 'string' ? session.payment_intent : session.id ?? null;
        return {
          ok: true,
          provider: providerKey,
          providerStatus: session.status ?? 'unknown',
          attemptStatus: getProviderStatus(session.status),
          providerPaymentReference,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Stripe checkout status could not be retrieved.';
        return {
          ok: false,
          error: {
            code: 'PROVIDER_ERROR',
            message,
            retryable: false,
          },
        };
      }
    },

    async verifyPaymentResult(_context: PaymentSourceContext, providerReference: string) {
      const secretKey = getServerEnvValue('STRIPE_SECRET_KEY');
      if (!secretKey) {
        return runtimeProviderNotConfigured('Stripe verification is unavailable until the server environment is configured.');
      }

      try {
        const { default: Stripe } = await import('stripe');
        const stripe = new Stripe(secretKey, { apiVersion: DEFAULT_API_VERSION as any });
        const session = await stripe.checkout.sessions.retrieve(providerReference);
        const paymentIntentId = session.payment_intent;

        if (!paymentIntentId || typeof paymentIntentId !== 'string') {
          return {
            ok: true,
            provider: providerKey,
            providerPaymentReference: providerReference,
            settlementVerified: false,
            reason: 'SETTLEMENT_NOT_IMPLEMENTED',
          };
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === 'succeeded') {
          return {
            ok: true,
            provider: providerKey,
            providerPaymentReference: paymentIntent.id,
            settlementVerified: false,
            reason: 'SETTLEMENT_NOT_IMPLEMENTED',
          };
        }

        return {
          ok: true,
          provider: providerKey,
          providerPaymentReference: paymentIntent.id,
          settlementVerified: false,
          reason: 'SETTLEMENT_NOT_IMPLEMENTED',
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Stripe payment verification failed.';
        return {
          ok: false,
          error: {
            code: 'PROVIDER_ERROR',
            message,
            retryable: false,
          },
        };
      }
    },

    async verifyWebhookEvent(rawBody: string | Uint8Array, signature: string | undefined) {
      const secretKey = getServerEnvValue('STRIPE_SECRET_KEY');
      const webhookSecret = getServerEnvValue('STRIPE_WEBHOOK_SECRET');

      if (!secretKey || !webhookSecret) {
        return runtimeProviderNotConfigured('Stripe webhook verification is unavailable until STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are configured on the server.');
      }

      if (!signature) {
        return {
          ok: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'A Stripe webhook signature header is required before a provider event can be accepted.',
            retryable: false,
          },
        };
      }

      try {
        const { default: Stripe } = await import('stripe');
        const stripe = new Stripe(secretKey, { apiVersion: DEFAULT_API_VERSION as any });
        const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        const object = event.data?.object as unknown;
        const objectRecord = object && typeof object === 'object' ? (object as Record<string, unknown>) : undefined;

        return {
          ok: true,
          provider: providerKey,
          eventId: event.id,
          eventType: event.type,
          objectType: typeof objectRecord?.object === 'string' ? objectRecord.object : 'unknown',
          objectId: typeof objectRecord?.id === 'string' ? objectRecord.id : null,
          verificationStatus: 'VERIFIED',
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Stripe webhook verification failed.';
        return {
          ok: false,
          error: {
            code: 'PROVIDER_ERROR',
            message,
            retryable: false,
          },
        };
      }
    },
  };
}
