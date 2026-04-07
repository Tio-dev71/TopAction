import crypto from 'crypto'
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
 * VNPay Payment Provider
 * 
 * Configuration via environment variables:
 * - VNPAY_TMN_CODE: Terminal ID (merchant code)
 * - VNPAY_HASH_SECRET: Secret key for HMAC signing
 * - VNPAY_URL: Payment gateway URL
 *   - Test: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
 *   - Production: https://pay.vnpay.vn/vpcpay.html
 * - VNPAY_API_URL: API endpoint for queries (optional)
 */
export class VNPayProvider implements PaymentProvider {
  readonly name = 'vnpay'
  readonly isTestMode: boolean

  private tmnCode: string
  private hashSecret: string
  private vnpUrl: string

  constructor() {
    this.tmnCode = process.env.VNPAY_TMN_CODE || ''
    this.hashSecret = process.env.VNPAY_HASH_SECRET || ''
    this.vnpUrl = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
    this.isTestMode = this.vnpUrl.includes('sandbox')

    if (!this.tmnCode || !this.hashSecret) {
      console.warn('[VNPay] Missing VNPAY_TMN_CODE or VNPAY_HASH_SECRET. Payment will fail.')
    }
  }

  async createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
    try {
      const now = new Date()
      const createDate = this.formatDate(now)
      const expireDate = this.formatDate(new Date(now.getTime() + 15 * 60 * 1000)) // 15 min expiry

      const vnpParams: Record<string, string> = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: this.tmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: params.orderId,
        vnp_OrderInfo: params.description.substring(0, 255),
        vnp_OrderType: 'other',
        vnp_Amount: (params.amount * 100).toString(), // VNPay expects amount * 100
        vnp_ReturnUrl: params.returnUrl,
        vnp_IpAddr: '127.0.0.1', // Will be overridden in server action
        vnp_CreateDate: createDate,
        vnp_ExpireDate: expireDate,
      }

      // Sort params alphabetically and create query string exactly as VNPay expects
      const sortedParams = this.sortObject(vnpParams)
      const signData = Object.keys(sortedParams)
        .map((key) => `${key}=${sortedParams[key]}`)
        .join('&')

      const hmac = crypto.createHmac('sha512', this.hashSecret)
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

      const paymentUrl = `${this.vnpUrl}?${signData}&vnp_SecureHash=${signed}`

      return {
        success: true,
        paymentUrl,
        providerOrderId: params.orderId,
        rawResponse: vnpParams,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create VNPay payment',
      }
    }
  }

  async verifyReturn(params: VerifyReturnParams): Promise<VerifyReturnResult> {
    const vnpParams = { ...params.query }
    const secureHash = vnpParams['vnp_SecureHash']
    
    delete vnpParams['vnp_SecureHash']
    delete vnpParams['vnp_SecureHashType']

    const sortedParams = this.sortObject(vnpParams)
    const signData = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join('&')
    const hmac = crypto.createHmac('sha512', this.hashSecret)
    const checkSum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

    if (secureHash !== checkSum) {
      return {
        success: false,
        orderId: vnpParams['vnp_TxnRef'] || '',
        amount: 0,
        status: 'failed',
        rawData: vnpParams,
      }
    }

    const responseCode = vnpParams['vnp_ResponseCode']
    const amount = parseInt(vnpParams['vnp_Amount'] || '0', 10) / 100

    return {
      success: responseCode === '00',
      orderId: vnpParams['vnp_TxnRef'] || '',
      providerTransactionId: vnpParams['vnp_TransactionNo'] || undefined,
      amount,
      status: responseCode === '00' ? 'success' : responseCode === '24' ? 'cancelled' : 'failed',
      rawData: vnpParams,
    }
  }

  async verifyWebhook(params: VerifyWebhookParams): Promise<VerifyWebhookResult> {
    // VNPay IPN uses the same mechanism as return URL verification
    const vnpParams: Record<string, string> = typeof params.body === 'string' 
      ? Object.fromEntries(new URLSearchParams(params.body))
      : params.query || {}

    // If body is JSON object, merge
    if (typeof params.body === 'object' && params.body !== null) {
      Object.assign(vnpParams, params.body as Record<string, string>)
    }

    const secureHash = vnpParams['vnp_SecureHash']
    delete vnpParams['vnp_SecureHash']
    delete vnpParams['vnp_SecureHashType']

    const sortedParams = this.sortObject(vnpParams)
    const signData = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join('&')
    const hmac = crypto.createHmac('sha512', this.hashSecret)
    const checkSum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

    const isValid = secureHash === checkSum
    const responseCode = vnpParams['vnp_ResponseCode']
    const amount = parseInt(vnpParams['vnp_Amount'] || '0', 10) / 100
    const transactionNo = vnpParams['vnp_TransactionNo'] || ''

    return {
      valid: isValid,
      orderId: vnpParams['vnp_TxnRef'] || '',
      providerTransactionId: transactionNo || undefined,
      amount,
      status: responseCode === '00' ? 'success' : responseCode === '24' ? 'cancelled' : 'failed',
      externalEventId: `vnpay_${vnpParams['vnp_TxnRef']}_${transactionNo}`,
      rawData: vnpParams,
    }
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear().toString()
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const d = date.getDate().toString().padStart(2, '0')
    const h = date.getHours().toString().padStart(2, '0')
    const i = date.getMinutes().toString().padStart(2, '0')
    const s = date.getSeconds().toString().padStart(2, '0')
    return `${y}${m}${d}${h}${i}${s}`
  }

  private sortObject(obj: Record<string, string>): Record<string, string> {
    const sorted: Record<string, string> = {}
    const keys = Object.keys(obj).sort()
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        // Encode key and value specifically for VNPay standard
        const encodedKey = encodeURIComponent(key)
        const encodedValue = encodeURIComponent(obj[key]).replace(/%20/g, '+')
        sorted[encodedKey] = encodedValue
      }
    }
    return sorted
  }
}
