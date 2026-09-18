import type { CheckoutStatusResult, CreateCheckoutResult, PaymentProviderKey, PaymentSourceContext, PaymentVerificationResult, PaymentWebhookVerificationResult } from './types';

export type PaymentProviderAdapter = {
  readonly provider: PaymentProviderKey;
  createCheckoutSession(context: PaymentSourceContext): Promise<CreateCheckoutResult>;
  retrieveCheckoutStatus(context: PaymentSourceContext): Promise<CheckoutStatusResult>;
  verifyPaymentResult(context: PaymentSourceContext, providerReference: string): Promise<PaymentVerificationResult>;
  verifyWebhookEvent(rawBody: string | Uint8Array, signature: string | undefined): Promise<PaymentWebhookVerificationResult>;
};
