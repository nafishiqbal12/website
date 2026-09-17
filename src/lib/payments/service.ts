import type { PaymentAttempt, PaymentObligation } from '../organizations/types';
import type { CreateCheckoutRequest, CreateCheckoutResult, PaymentVerificationResult } from './types';
import type { PaymentProviderAdapter } from './providerAdapter';

const notConfigured = (message: string) => ({
  ok: false as const,
  error: { code: 'PROVIDER_NOT_CONFIGURED' as const, message, retryable: false },
});

export function createProviderNeutralPaymentService(adapter: PaymentProviderAdapter | null = null) {
  return {
    async createCheckoutSession(_request: CreateCheckoutRequest, _obligation: PaymentObligation, _attempt: PaymentAttempt): Promise<CreateCheckoutResult> {
      if (!adapter) return notConfigured('Payment checkout is unavailable until a payment provider is configured and integrated.');
      return notConfigured(`Payment provider ${adapter.provider} is not integrated in this application.`);
    },
    async verifyPaymentResult(_obligation: PaymentObligation, _attempt: PaymentAttempt, _providerReference: string): Promise<PaymentVerificationResult> {
      if (!adapter) return notConfigured('Payment verification is unavailable until a payment provider is configured and integrated.');
      return notConfigured(`Payment provider ${adapter.provider} is not integrated in this application.`);
    },
  };
}

export const paymentService = createProviderNeutralPaymentService();
