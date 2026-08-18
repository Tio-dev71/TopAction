# TOPPLAY SYSTEM AUDIT
## 1. Architecture
- **Framework:** Next.js 16.2.2 (App Router)
- **Database & Auth:** Supabase (SSR, Storage, RLS enabled)
- **Styling:** Tailwind CSS v4, PostCSS
- **UI Components:** shadcn/ui, Radix UI (via @base-ui/react), Framer Motion
- **State Management:** Zustand
- **Editor:** TipTap
- **Payment & Tracking:** Webhooks, Strava/Garmin API integrations

## 2. Routes (Current)
- `/(auth)`: Login/Register
- `/admin`: Dashboard, audit-logs, bài viết (posts), cài đặt (settings), đăng ký (registrations), giải đấu (tournaments), media, người dùng (users), ủng hộ (donations)
- `/ca-nhan`: User Profile
- `/giai-dau`: Tournament listing/detail
- `/thanh-toan`: Payment flows
- `/tin-tuc`: News & Posts
- `/api`: auth, upload, v1, webhooks

## 3. Roles
- **Current Roles:** `super_admin`, `admin`, `editor`, `finance`, `support`, `user`
- **Missing Roles (To be added for Pickleball):** `coach`, `club_admin`, `club_staff`, `tournament_organizer` (có thể dùng cờ hoặc role mở rộng).

## 4. Database Schema
- **Existing Tables:** `profiles`, `roles`, `user_roles`, `tournaments`, `tournament_categories`, `tournament_rules`, `organizers`, `registrations`, `registration_status_logs`, `donations`, `payment_transactions`, `webhook_events`, `posts`, `audit_logs`, `media_assets`.
- **Missing Tables (To implement for Pickleball):**
  - **Club System:** `clubs`, `club_members`, `club_memberships`
  - **Coach System:** `coach_profiles`, `coach_services`, `coach_schedules`, `coach_students`, `coach_reviews`
  - **Booking System:** `courts`, `court_bookings`
  - **Community System:** `community_groups`, `community_events`, `community_posts`
  - **Wallet/Ledger System:** `wallets`, `wallet_transactions` (for Clubs & Platform credits)
  - **Video Platform:** `videos`, `video_categories`
  - **Ranking System:** `player_rankings`, `matches`

## 5. APIs
- Tồn tại webhook xử lý thanh toán và strava/garmin sync.
- Cần mở rộng `/api/v1/` cho booking, coach schedule, wallet transactions và club management.

## 6. Existing Features
- Authentication & RLS Authorization.
- Tournament creation, registration, and donations (mostly geared towards running/cycling with `distance` tracking).
- News/Blog (Posts).
- Admin panel for managing users, tournaments, registrations, posts.
- Media upload to Supabase Storage.
- Payment integration stub / webhook processing.

## 7. Missing Features (Gap Analysis)
- **Player Dashboard:** Cần mở rộng profile thành dashboard tích hợp booking, lịch học coach, club membership, và ranking.
- **Coach Platform:** Thiếu toàn bộ luồng tạo dịch vụ, set lịch trống, quản lý học viên và doanh thu.
- **Club Management:** Thiếu hệ thống quản lý Club, membership tiers, thu chi nội bộ (Wallet).
- **Court Booking:** Thiếu tìm kiếm sân, check availability thời gian thực và flow thanh toán đặt sân.
- **Community:** Thiếu Feed, Groups, Events.
- **Videos:** Thiếu trang video hướng dẫn.

## 8. Technical Debt & Risks
- **Domain Coupling:** Cấu trúc hiện tại (ví dụ: `distance` trong `tournament_categories`, Strava sync) đang bị couple với môn chạy bộ/đạp xe. Cần refactor để tách biệt logic tính điểm/tracking cho Pickleball.
- **Data Integrity:** Cần đảm bảo hệ thống Wallet sắp tới tuân thủ nguyên tắc accounting (immutable transactions) và không ảnh hưởng luồng payment hiện tại.
- **Responsive:** Giao diện hiện tại (đặc biệt là Admin và các page giải đấu) cần được audit và redesign theo chuẩn premium mobile-first/desktop-optimized.

## 9. UI Components
- Hiện có: `avatar`, `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `select`, `tabs`, `textarea`, `carousel-scroll`.
- Thiếu / Cần chuẩn hóa (Design System): `DatePicker` (cho booking), `Calendar` (cho Coach/Court schedule), `DataTable` (cho Admin/Club), `Rating`, `Timeline`, `Progress`, `EmptyState`, `Skeleton`.

## 10. Recommended Implementation Order
*Đúng theo chỉ dẫn 12 Phase của TOPPLAY.VN:*
- **Phase 1:** Audit (Hoàn thành)
- **Phase 2:** Xây dựng/Chuẩn hóa Design System (Typography, Components)
- **Phase 3:** Global Shell (Header, Sidebar, Navigation, Mobile Layout)
- **Phase 4:** Player Dashboard & Profile
- **Phase 5:** Coach Dashboard & Flow
- **Phase 6:** Club Management & Wallet
- **Phase 7:** Community & Social Features
- **Phase 8:** Tournament Redesign (Pickleball adaptation)
- **Phase 9:** Content (News & Videos)
- **Phase 10:** Platform Admin Redesign
- **Phase 11 & 12:** Responsive Audit & Full QA
