import { sendEmail } from './service'

function baseTemplate(content: string) {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #3b40c8 0%, #5865f2 100%); padding: 32px 24px; text-align: center; }
    .header h1 { color: #fff; font-size: 24px; margin: 0; }
    .header p { color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 8px; }
    .body { padding: 32px 24px; }
    .body h2 { font-size: 20px; margin: 0 0 16px; color: #18181b; }
    .body p { font-size: 15px; color: #52525b; line-height: 1.6; margin: 8px 0; }
    .info-box { background: #f4f4f5; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
    .info-label { color: #71717a; }
    .info-value { color: #18181b; font-weight: 600; }
    .btn { display: inline-block; background: #3b40c8; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 15px; margin-top: 16px; }
    .footer { text-align: center; padding: 24px; border-top: 1px solid #e4e4e7; }
    .footer p { font-size: 12px; color: #a1a1aa; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p>© 2026 TOPPLAY — Nền tảng giải đấu thể thao trực tuyến</p>
      <p>Email này được gửi tự động, vui lòng không trả lời.</p>
    </div>
  </div>
</body>
</html>`
}

// ============ Registration Success ============

export async function sendRegistrationSuccessEmail(data: {
  email: string
  fullName: string
  tournamentTitle: string
  categoryName: string
  registrationCode: string
  amountDue: number
  isPaid: boolean
}) {
  const content = `
    <div class="header">
      <h1>🎉 Đăng ký thành công!</h1>
      <p>Chúc mừng bạn đã đăng ký tham gia giải đấu</p>
    </div>
    <div class="body">
      <h2>Xin chào ${data.fullName},</h2>
      <p>Đơn đăng ký của bạn đã được ghi nhận thành công.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Giải đấu:</span><span class="info-value">${data.tournamentTitle}</span></div>
        <div class="info-row"><span class="info-label">Hạng mục:</span><span class="info-value">${data.categoryName}</span></div>
        <div class="info-row"><span class="info-label">Mã đăng ký:</span><span class="info-value">${data.registrationCode}</span></div>
        ${data.amountDue > 0 ? `<div class="info-row"><span class="info-label">Phí tham gia:</span><span class="info-value">${data.amountDue.toLocaleString('vi-VN')} ₫</span></div>` : ''}
        <div class="info-row"><span class="info-label">Trạng thái:</span><span class="info-value">${data.isPaid ? '✅ Đã thanh toán' : '⏳ Chờ thanh toán'}</span></div>
      </div>
      ${!data.isPaid && data.amountDue > 0 ? '<p>Vui lòng hoàn tất thanh toán để xác nhận đăng ký.</p>' : '<p>Chúc bạn thi đấu thành công!</p>'}
    </div>`

  return sendEmail({
    to: data.email,
    subject: `[TOPPLAY] Đăng ký thành công — ${data.tournamentTitle}`,
    html: baseTemplate(content),
    text: `Xin chào ${data.fullName}, đăng ký giải đấu ${data.tournamentTitle} thành công. Mã: ${data.registrationCode}`,
  })
}

// ============ Payment Success ============

export async function sendPaymentSuccessEmail(data: {
  email: string
  fullName: string
  tournamentTitle: string
  amount: number
  transactionType: 'registration' | 'donation'
  referenceCode: string
}) {
  const typeLabel = data.transactionType === 'registration' ? 'phí đăng ký' : 'ủng hộ'

  const content = `
    <div class="header">
      <h1>✅ Thanh toán thành công!</h1>
      <p>Giao dịch của bạn đã được xác nhận</p>
    </div>
    <div class="body">
      <h2>Xin chào ${data.fullName},</h2>
      <p>Thanh toán ${typeLabel} cho giải đấu <strong>${data.tournamentTitle}</strong> đã thành công.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Giải đấu:</span><span class="info-value">${data.tournamentTitle}</span></div>
        <div class="info-row"><span class="info-label">Loại:</span><span class="info-value">${data.transactionType === 'registration' ? 'Phí đăng ký' : 'Ủng hộ'}</span></div>
        <div class="info-row"><span class="info-label">Số tiền:</span><span class="info-value">${data.amount.toLocaleString('vi-VN')} ₫</span></div>
        <div class="info-row"><span class="info-label">Mã tham chiếu:</span><span class="info-value">${data.referenceCode}</span></div>
      </div>
      <p>Cảm ơn bạn đã tham gia! 🙏</p>
    </div>`

  return sendEmail({
    to: data.email,
    subject: `[TOPPLAY] Thanh toán ${typeLabel} thành công — ${data.tournamentTitle}`,
    html: baseTemplate(content),
    text: `Thanh toán ${typeLabel} ${data.amount.toLocaleString('vi-VN')}đ cho ${data.tournamentTitle} thành công. Mã: ${data.referenceCode}`,
  })
}

// ============ Donation Thank You ============

export async function sendDonationThankYouEmail(data: {
  email: string
  donorName: string
  tournamentTitle: string
  amount: number
  donationCode: string
}) {
  const content = `
    <div class="header">
      <h1>💝 Cảm ơn sự ủng hộ!</h1>
      <p>Tấm lòng của bạn thật đáng trân trọng</p>
    </div>
    <div class="body">
      <h2>Xin chào ${data.donorName},</h2>
      <p>Cảm ơn bạn đã ủng hộ giải đấu <strong>${data.tournamentTitle}</strong>.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Giải đấu:</span><span class="info-value">${data.tournamentTitle}</span></div>
        <div class="info-row"><span class="info-label">Số tiền:</span><span class="info-value">${data.amount.toLocaleString('vi-VN')} ₫</span></div>
        <div class="info-row"><span class="info-label">Mã ủng hộ:</span><span class="info-value">${data.donationCode}</span></div>
      </div>
      <p>Sự ủng hộ của bạn góp phần tạo nên một giải đấu thành công và ý nghĩa!</p>
    </div>`

  return sendEmail({
    to: data.email,
    subject: `[TOPPLAY] Cảm ơn ủng hộ — ${data.tournamentTitle}`,
    html: baseTemplate(content),
    text: `Cảm ơn ${data.donorName} đã ủng hộ ${data.amount.toLocaleString('vi-VN')}đ cho ${data.tournamentTitle}. Mã: ${data.donationCode}`,
  })
}
