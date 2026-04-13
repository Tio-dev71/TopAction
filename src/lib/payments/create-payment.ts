import { type PaymentProvider } from './types'
import { VNPayProvider } from './providers/vnpay'
import { SePayProvider } from './providers/sepay'

let provider: PaymentProvider | null = null

/**
 * Get the configured payment provider.
 * Currently supports: vnpay, sepay
 * Add more providers here as needed.
 */
export function getPaymentProvider(): PaymentProvider {
  if (!provider) {
    const providerName = process.env.PAYMENT_PROVIDER || 'sepay' // Defaults to sepay for manual bank transfers

    switch (providerName) {
      case 'vnpay':
        provider = new VNPayProvider()
        break
      case 'sepay':
        provider = new SePayProvider()
        break
      case 'vietqr':
        // Reuse SePayProvider logic since it's just a manual bank transfer abstraction for now
        provider = new SePayProvider()
        provider.name = 'vietqr'
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
