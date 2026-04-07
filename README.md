# ATUAN - Nền Tảng Giải Đấu Thể Thao

ATUAN là nền tảng quản lý các giải chạy bộ, đạp xe trực tuyến cho cộng đồng thể thao Việt Nam, được xây dựng với Next.js App Router và Supabase. 

## Tính Năng Nổi Bật
- **Quản lý giải đấu**: Đăng ký tham gia, theo dõi bảng xếp hạng (Leaderboard) theo thời gian thực.
- **Ủng hộ (Donation)**: Tích hợp module khuyên góp ủng hộ vận động viên / giải đấu với tracking realtime.
- **Chứng nhận & Huy chương**: Hệ thống số hoá chứng nhận thành tích.
- **Authentication Toàn Diện**: Triển khai Supabase SSR cho bảo mật tối đa (Server-side Session) và Google OAuth. 

## Hướng Dẫn Cài Đặt (Local Environment)

### Yêu Cầu
- Node.js `18.17+` hoặc mới hơn
- Tài khoản Supabase đang hoạt động

### Cài Đặt

1. **Clone repository:**
```bash
git clone <url>
cd atuan
npm install
```

2. **Cấu hình môi trường:**
Tạo file `.env.local` ở thư mục gốc (hoặc copy từ `.env.example`):
```bash
cp .env.example .env.local
```

Nội dung `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Thường lấy biến môi trường trong **Supabase Dashboard** -> **Project Settings** -> **API**.

3. **Cấu Hình Google OAuth trên Supabase:**
- Truy cập Google Cloud Console, tạo Web Application Client.
- Lấy `Client ID` và `Client Secret`.
- Cấu hình redirect URI bên Google Console cho URL Callback của Supabase: `https://<reference_id>.supabase.co/auth/v1/callback`
- Truy cập **Supabase Dashboard** -> **Authentication** -> **Providers**.
- Enable **Google** và nhập `Client ID` / `Client Secret`. Bật option [Skip nonce check] đối với môi trường nhất định nếu có lỗi.
- Đảm bảo trong **Supabase Authentication -> URL Configuration**, phần **Site URL** đang trỏ tới `http://localhost:3000` (ở local). Mặc định hệ thống auth của ATUAN được cấu hình hook về `/auth/callback`.

4. **Khởi chạy ứng dụng:**
```bash
npm run dev
```

Mở `http://localhost:3000` với trình duyệt.

## Hướng Dẫn Triển Khai (Production / Vercel)

1. Mở **Vercel Dashboard**.
2. Thêm Project mới (Import từ Github/Gitlab).
3. Đảm bảo Framework Preset là **Next.js**.
4. Cấu hình các biến môi trường Production trong **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Nhấn Deploy.
6. **[Rất quan trọng] Cập nhật lại Supabase URL Configuration**:
   - Sau khi Vercel có tên miền chính (ví dụ `https://atuan.vercel.app`), hãy truy cập **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
   - Cập nhật **Site URL** bằng domain production mới nhất.
   - Thêm các Alias Domains phụ vào mục **Redirect URLs** nếu cần.
