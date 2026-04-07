import {
  type PaymentProvider,
  type CreatePaymentParams,
  type CreatePaymentResult,
  type VerifyReturnParams,
  type VerifyReturnResult,
  type VerifyWebhookParams,
  type VerifyWebhookResult,
} from '../types'

/**
 * SePay / VietQR Manual Payment Provider
 * Redirects user to our internal QR code display page.
 */
export class SePayProvider implements PaymentProvider {
  readonly name = 'sepay'
  readonly isTestMode = false

  async createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
    // Determine redirect path. Note: params.returnUrl typically contains type=registration or type=donation.
    // We will just pass the type directly if needed, or just redirect to our custom checkout page.
    // For simplicity, we just extract the type from returnUrl if present, else default to 'registration'
    const type = params.returnUrl?.includes('type=donation') ? 'donation' : 'registration'

    // We will navigate the user to our internal VietQR display page.
    const paymentUrl = `/thanh-toan/sepay?code=${params.orderId}&amount=${params.amount}&type=${type}`
    
    return {
      success: true,
      paymentUrl,
      providerOrderId: params.orderId,
      rawResponse: { type: 'vietqr' }
    }
  }

  async verifyReturn(params: VerifyReturnParams): Promise<VerifyReturnResult> {
    // SePay doesn't have a synchronous return hash (since it's a manual QR transfer).
    // When exactly this is called, we just return true.
    return {
      success: true,
      orderId: params.query.code || '',
      amount: 0,
      status: 'success', // or pending
      rawData: params.query,
    }
  }

  async verifyWebhook(params: VerifyWebhookParams): Promise<VerifyWebhookResult> {
    // We handle the webhook logic entirely in `/api/webhooks/sepay/route.ts` instead.
    // This is just a stub for the interface.
    return {
      valid: true,
      orderId: '',
      amount: 0,
      status: 'success',
      externalEventId: '',
      rawData: {},
    }
  }
}
