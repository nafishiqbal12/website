import type { CheckoutStatusResult, CreateCheckoutResult, PaymentProviderKey, PaymentSourceContext, PaymentVerificationResult } from './types';

export type PaymentProviderAdapter = {
  readonly provider: PaymentProviderKey;
  createCheckoutSession(context: PaymentSourceContext): Promise<CreateCheckoutResult>;
  retrieveCheckoutStatus(context: PaymentSourceContext): Promise<CheckoutStatusResult>;
  verifyPaymentResult(context: PaymentSourceContext, providerReference: string): Promise<PaymentVerificationResult>;
};
