import { type PaymentProvider } from './types'
import { VNPayProvider } from './providers/vnpay'

let provider: PaymentProvider | null = null

/**
 * Get the configured payment provider.
 * Currently supports: vnpay
 * Add more providers here as needed.
 */
export function getPaymentProvider(): PaymentProvider {
  if (!provider) {
    const providerName = process.env.PAYMENT_PROVIDER || 'vnpay'

    switch (providerName) {
      case 'vnpay':
        provider = new VNPayProvider()
        break
      // Add more providers here:
      // case 'momo':
      //   provider = new MoMoProvider()
      //   break
      // case 'zalopay':
      //   provider = new ZaloPayProvider()
      //   break
      default:
        throw new Error(`Unknown payment provider: ${providerName}`)
    }
  }

  return provider
}

/**
 * Reset provider (useful for testing).
 */
export function resetPaymentProvider() {
  provider = null
}
