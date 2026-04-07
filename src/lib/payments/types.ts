// Payment Provider Interface
// All payment providers must implement this interface

export interface CreatePaymentParams {
  orderId: string // Unique order ID (registration_code or donation_code)
  amount: number // Amount in VND (integer)
  description: string
  returnUrl: string
  cancelUrl?: string
  metadata?: Record<string, string>
}

export interface CreatePaymentResult {
  success: boolean
  paymentUrl?: string // URL to redirect user to
  providerOrderId?: string // Provider's order reference
  error?: string
  rawResponse?: Record<string, unknown>
}

export interface VerifyReturnParams {
  query: Record<string, string> // URL query params from return URL
}

export interface VerifyReturnResult {
  success: boolean
  orderId: string
  providerTransactionId?: string
  amount: number
  status: 'success' | 'failed' | 'pending' | 'cancelled'
  rawData?: Record<string, unknown>
}

export interface VerifyWebhookParams {
  headers: Record<string, string>
  body: string | Record<string, unknown>
  query?: Record<string, string>
}

export interface VerifyWebhookResult {
  valid: boolean
  orderId: string
  providerTransactionId?: string
  amount: number
  status: 'success' | 'failed' | 'pending' | 'cancelled'
  externalEventId?: string // For idempotency
  rawData?: Record<string, unknown>
}

export interface PaymentProvider {
  readonly name: string
  readonly isTestMode: boolean

  /**
   * Create a payment and return a URL for the user to complete payment.
   */
  createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult>

  /**
   * Verify the return URL parameters when user comes back from payment.
   */
  verifyReturn(params: VerifyReturnParams): Promise<VerifyReturnResult>

  /**
   * Verify and parse a webhook/IPN callback from the provider.
   */
  verifyWebhook(params: VerifyWebhookParams): Promise<VerifyWebhookResult>
}
