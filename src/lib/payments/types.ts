import type { PaymentAttemptStatus, PaymentObligation, PaymentAttempt } from '../organizations/types';

export type PaymentProviderKey = string;

export type PaymentProviderErrorCode = 'PROVIDER_NOT_CONFIGURED' | 'PROVIDER_NOT_INTEGRATED' | 'INVALID_REQUEST' | 'PROVIDER_ERROR';

export type PaymentProviderError = {
  code: PaymentProviderErrorCode;
  message: string;
  retryable: boolean;
};

export type PaymentSourceContext = {
  obligation: PaymentObligation;
  attempt: PaymentAttempt;
};

export type CreateCheckoutRequest = {
  paymentObligationId: string;
  paymentAttemptId: string;
  idempotencyKey: string;
};

export type CreateCheckoutResult =
  | { ok: true; provider: PaymentProviderKey; checkoutSessionReference: string; checkoutUrl: string | null }
  | { ok: false; error: PaymentProviderError };

export type CheckoutStatusResult =
  | { ok: true; provider: PaymentProviderKey; providerStatus: string; attemptStatus: PaymentAttemptStatus; providerPaymentReference: string | null }
  | { ok: false; error: PaymentProviderError };

export type PaymentVerificationResult =
  | { ok: true; provider: PaymentProviderKey; providerPaymentReference: string; settlementVerified: false; reason: 'SETTLEMENT_NOT_IMPLEMENTED' }
  | { ok: false; error: PaymentProviderError };

export type PaymentWebhookVerificationResult =
  | { ok: true; provider: PaymentProviderKey; eventId: string; eventType: string; objectType: string; objectId: string | null; verificationStatus: 'VERIFIED' }
  | { ok: false; error: PaymentProviderError };

export type SettlementValidationInput = {
  organizationId: string;
  projectId: string | null;
  paymentObligationId: string;
  paymentAttemptId: string;
  amountMinor: string;
  currency: 'USD';
  provider: 'stripe';
  providerEventId: string;
  providerEventType: string;
  providerCheckoutSessionId?: string | null;
  providerPaymentIntentId?: string | null;
  providerMetadata?: Record<string, unknown>;
};

export type PaymentSettlementResult =
  | { ok: true; provider: 'stripe'; settlementId: string; paymentAttemptId: string; paymentObligationId: string; providerEventId: string; status: 'VERIFIED' }
  | { ok: false; error: PaymentProviderError };
