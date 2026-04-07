// Email service abstraction — designed for easy provider swapping

export interface EmailMessage {
  to: string
  subject: string
  html: string
  text?: string
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<{ success: boolean; error?: string }>
}

/**
 * Console-based email provider for development.
 * Replace with Resend, SendGrid, SES, etc. in production.
 */
class ConsoleEmailProvider implements EmailProvider {
  async send(message: EmailMessage) {
    console.log('══════════════════════════════════════')
    console.log('📧 EMAIL SENT (console provider)')
    console.log(`   To: ${message.to}`)
    console.log(`   Subject: ${message.subject}`)
    console.log(`   Body: ${message.text || '(HTML only)'}`)
    console.log('══════════════════════════════════════')
    return { success: true }
  }
}

/**
 * Resend-based email provider (uncomment and install @resend/node when ready)
 */
// class ResendEmailProvider implements EmailProvider {
//   private resend: any
//   constructor() {
//     const { Resend } = require('resend')
//     this.resend = new Resend(process.env.RESEND_API_KEY)
//   }
//   async send(message: EmailMessage) {
//     try {
//       await this.resend.emails.send({
//         from: process.env.EMAIL_FROM || 'topaction <noreply@topaction.vn>',
//         to: message.to,
//         subject: message.subject,
//         html: message.html,
//       })
//       return { success: true }
//     } catch (error: any) {
//       return { success: false, error: error.message }
//     }
//   }
// }

let emailProvider: EmailProvider | null = null

function getEmailProvider(): EmailProvider {
  if (!emailProvider) {
    // Switch to ResendEmailProvider when ready:
    // emailProvider = new ResendEmailProvider()
    emailProvider = new ConsoleEmailProvider()
  }
  return emailProvider
}

export async function sendEmail(message: EmailMessage) {
  const provider = getEmailProvider()
  return provider.send(message)
}
