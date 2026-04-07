import { z } from 'zod'

// ============ Profile ============

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  phone: z.string().max(20).optional().or(z.literal('')),
  birth_date: z.string().optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'other']).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  club_name: z.string().max(100).optional().or(z.literal('')),
  emergency_contact: z.string().max(200).optional().or(z.literal('')),
})

// ============ Tournament (Admin) ============

export const tournamentSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự').max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang'),
  short_description: z.string().max(500).optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  cover_image: z.string().optional().or(z.literal('')),
  banner_image: z.string().optional().or(z.literal('')),
  category: z.string().max(100).optional().or(z.literal('')),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  registration_open_at: z.string().optional().or(z.literal('')),
  registration_close_at: z.string().optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'closed', 'archived']).default('draft'),
  is_featured: z.boolean().default(false),
  max_participants: z.number().int().positive().optional().nullable(),
  valid_activity_types: z.array(z.string()).default(['Run']),
  min_pace: z.number().int().nonnegative().default(240),
  max_pace: z.number().int().nonnegative().default(900),
})

export const tournamentCategorySchema = z.object({
  name: z.string().min(1, 'Tên hạng mục không được trống').max(100),
  distance: z.string().max(50).optional().or(z.literal('')),
  price: z.number().int().min(0, 'Giá phải >= 0').default(0),
  capacity: z.number().int().positive().optional().nullable(),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
})

export const tournamentRuleSchema = z.object({
  rule_type: z.string().max(50).optional().or(z.literal('')),
  title: z.string().min(1).max(200),
  content: z.string().max(2000).optional().or(z.literal('')),
  icon: z.string().max(50).optional().or(z.literal('')),
  sort_order: z.number().int().default(0),
})

// ============ Registration ============

export const registrationSchema = z.object({
  tournament_id: z.string().uuid('ID giải đấu không hợp lệ'),
  category_id: z.string().min(1, 'Vui lòng chọn hạng mục thi đấu').uuid('Hạng mục không hợp lệ'),
  full_name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(8, 'Số điện thoại không hợp lệ').max(20),
  gender: z.string().optional(),
  birth_date: z.string().optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  club_name: z.string().max(100).optional().or(z.literal('')),
  team_name: z.string().max(100).optional().or(z.literal('')),
  emergency_contact: z.string().max(200).optional().or(z.literal('')),
  note: z.string().max(500).optional().or(z.literal('')),
})

// ============ Donation ============

export const donationSchema = z.object({
  tournament_id: z.string().uuid('ID giải đấu không hợp lệ'),
  donor_name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  amount: z.number().int().min(10000, 'Số tiền tối thiểu 10.000đ').max(1000000000),
  message: z.string().max(500).optional().or(z.literal('')),
  is_anonymous: z.boolean().default(false),
})

// ============ Post (Admin) ============

export const postSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự').max(300),
  slug: z.string().min(3).max(300).regex(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang'),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  content: z.string().optional().or(z.literal('')),
  cover_image: z.string().optional().or(z.literal('')),
  tournament_id: z.string().uuid().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})

// ============ Helpers ============

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 200)
}
