import type { PaymentAttempt, PaymentObligation } from '../organizations/types';
import type { CreateCheckoutRequest, CreateCheckoutResult, PaymentVerificationResult, PaymentWebhookVerificationResult, PaymentSettlementResult, SettlementValidationInput } from './types';
import type { PaymentProviderAdapter } from './providerAdapter';
import { createStripeProviderAdapter } from './stripeProviderAdapter';

const notConfigured = (message: string) => ({
  ok: false as const,
  error: { code: 'PROVIDER_NOT_CONFIGURED' as const, message, retryable: false },
});

export function createProviderNeutralPaymentService(adapter: PaymentProviderAdapter | null = null) {
  return {
    async createCheckoutSession(_request: CreateCheckoutRequest, obligation: PaymentObligation, attempt: PaymentAttempt): Promise<CreateCheckoutResult> {
      if (!adapter) return notConfigured('Payment checkout is unavailable until a payment provider is configured and integrated.');
      return adapter.createCheckoutSession({ obligation, attempt });
    },
    async verifyPaymentResult(obligation: PaymentObligation, attempt: PaymentAttempt, providerReference: string): Promise<PaymentVerificationResult> {
      if (!adapter) return notConfigured('Payment verification is unavailable until a payment provider is configured and integrated.');
      return adapter.verifyPaymentResult({ obligation, attempt }, providerReference);
    },
    async verifyWebhookEvent(rawBody: string | Uint8Array, signature: string | undefined): Promise<PaymentWebhookVerificationResult> {
      if (!adapter) return notConfigured('Stripe webhook verification is unavailable until a payment provider is configured and integrated.');
      return adapter.verifyWebhookEvent(rawBody, signature);
    },
    async createInternalSettlement(_input: SettlementValidationInput): Promise<PaymentSettlementResult> {
      // This boundary is intentionally server-side only. It exists to represent the verified,
      // reconciled settlement record after a cryptographically verified Stripe webhook event has
      // passed internal amount/currency/attempt obligation validation. Live execution requires a
      // trusted server-side database function or service-role boundary, which the browser cannot use.
      return {
        ok: false,
        error: {
          code: 'PROVIDER_NOT_INTEGRATED',
          message: 'Internal payment settlement reconciliation is not yet wired to a trusted server-side database boundary in this runtime.',
          retryable: false,
        },
      };
    },
  };
}

export const paymentService = createProviderNeutralPaymentService(createStripeProviderAdapter());
