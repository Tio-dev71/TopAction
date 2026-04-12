// Full TypeScript types matching the production database schema

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'finance' | 'support' | 'user'

export type TournamentStatus = 'draft' | 'published' | 'closed' | 'archived'

export type RegistrationStatus = 'draft' | 'pending_payment' | 'registered' | 'confirmed' | 'cancelled' | 'rejected'

export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded'

export type DonationStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded'

export type TransactionStatus = 'created' | 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded'

export type TransactionType = 'registration' | 'donation'

export type PostStatus = 'draft' | 'published' | 'archived'

export type OrganizerType = 'organizer' | 'partner' | 'sponsor'

export type Gender = 'male' | 'female' | 'other'

// ============ Database Row Types ============

export interface DbProfile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  birth_date: string | null
  gender: Gender | null
  avatar_url: string | null
  city: string | null
  club_name: string | null
  emergency_contact: string | null
  is_blocked: boolean
  created_at: string
  updated_at: string
}

export interface DbRole {
  id: string
  code: UserRole
  name: string
  description: string | null
  created_at: string
}

export interface DbUserRole {
  id: string
  user_id: string
  role_id: string
  created_at: string
}

export interface DbTournament {
  id: string
  slug: string
  title: string
  short_description: string | null
  description: string | null
  cover_image: string | null
  banner_image: string | null
  category: string | null
  start_date: string | null
  end_date: string | null
  registration_open_at: string | null
  registration_close_at: string | null
  location: string | null
  city: string | null
  status: TournamentStatus
  is_featured: boolean
  max_participants: number | null
  participant_count: number
  donation_total: number
  created_by: string | null
  created_at: string
  updated_at: string
  valid_activity_types: string[]
  min_pace: number
  max_pace: number
  rewards_title: string | null
  rewards_description: string | null
}

export interface DbTournamentCategory {
  id: string
  tournament_id: string
  name: string
  distance: string | null
  price: number
  capacity: number | null
  registered_count: number
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface DbTournamentRule {
  id: string
  tournament_id: string
  rule_type: string | null
  title: string | null
  content: string | null
  icon: string | null
  sort_order: number
  created_at: string
}

export interface DbTournamentSection {
  id: string
  tournament_id: string
  section_key: string | null
  title: string | null
  content: string | null
  sort_order: number
  is_visible: boolean
  created_at: string
}

export interface DbOrganizer {
  id: string
  tournament_id: string
  name: string
  logo_url: string | null
  description: string | null
  type: OrganizerType
  sort_order: number
  created_at: string
}

export interface DbRegistration {
  id: string
  tournament_id: string
  user_id: string
  category_id: string | null
  full_name: string
  email: string
  phone: string | null
  gender: string | null
  birth_date: string | null
  city: string | null
  club_name: string | null
  team_name: string | null
  emergency_contact: string | null
  note: string | null
  status: RegistrationStatus
  payment_status: PaymentStatus
  payment_required: boolean
  amount_due: number
  amount_paid: number
  registration_code: string
  created_at: string
  updated_at: string
}

export interface DbRegistrationStatusLog {
  id: string
  registration_id: string
  old_status: string | null
  new_status: string
  changed_by: string | null
  note: string | null
  created_at: string
}

export interface DbDonation {
  id: string
  tournament_id: string
  user_id: string | null
  donor_name: string
  email: string | null
  phone: string | null
  amount: number
  message: string | null
  is_anonymous: boolean
  status: DonationStatus
  payment_status: string
  donation_code: string
  provider: string | null
  provider_transaction_id: string | null
  created_at: string
  updated_at: string
}

export interface DbPaymentTransaction {
  id: string
  transaction_type: TransactionType
  registration_id: string | null
  donation_id: string | null
  user_id: string | null
  provider: string
  provider_order_id: string | null
  provider_transaction_id: string | null
  amount: number
  currency: string
  status: TransactionStatus
  raw_request: Record<string, unknown> | null
  raw_response: Record<string, unknown> | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface DbWebhookEvent {
  id: string
  provider: string
  event_type: string | null
  external_event_id: string | null
  payload: Record<string, unknown>
  processed: boolean
  processed_at: string | null
  error_message: string | null
  created_at: string
}

export interface DbPost {
  id: string
  tournament_id: string | null
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  status: PostStatus
  published_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface DbAuditLog {
  id: string
  actor_user_id: string | null
  actor_role: string | null
  action: string
  target_table: string | null
  target_id: string | null
  metadata: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface DbMediaAsset {
  id: string
  storage_path: string
  public_url: string
  file_type: string | null
  file_size: number | null
  alt_text: string | null
  uploaded_by: string | null
  is_deleted: boolean
  created_at: string
}

export interface DbUserConnection {
  id: string
  user_id: string
  provider: string
  provider_athlete_id: string
  access_token: string
  refresh_token: string
  expires_at: string
  created_at: string
  updated_at: string
}

export interface DbActivity {
  id: string
  user_id: string
  provider: string
  external_id: string
  name: string
  activity_type: string
  distance: number
  moving_time: number
  elapsed_time: number
  start_date: string
  average_speed: number | null
  average_heartrate: number | null
  polyline: string | null
  is_valid: boolean
  invalid_reason: string | null
  created_at: string
}

export interface DbTournamentResult {
  id: string
  tournament_id: string
  category_id: string | null
  user_id: string
  total_distance: number
  total_moving_time: number
  activity_count: number
  last_activity_at: string | null
  rank: number | null
  updated_at: string
}

// ============ Extended types with joins ============

export interface TournamentWithDetails extends DbTournament {
  categories?: DbTournamentCategory[]
  rules?: DbTournamentRule[]
  sections?: DbTournamentSection[]
  organizers?: DbOrganizer[]
}

export interface RegistrationWithTournament extends DbRegistration {
  tournament?: DbTournament
  category?: DbTournamentCategory
  status_logs?: DbRegistrationStatusLog[]
}

export interface DonationWithTournament extends DbDonation {
  tournament?: DbTournament
}

export interface ProfileWithRoles extends DbProfile {
  user_roles?: (DbUserRole & { role?: DbRole })[]
}
