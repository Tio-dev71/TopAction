export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  birth_date: string | null
  gender: string | null
  avatar_url: string | null
  city: string | null
  club_name: string | null
  emergency_contact: string | null
  created_at: string
  updated_at: string
}

export interface Tournament {
  id: string
  slug: string
  title: string
  category: string | null
  short_description: string | null
  description: string | null
  cover_image: string | null
  start_date: string | null
  end_date: string | null
  registration_deadline: string | null
  location: string | null
  distances: string[] | null
  participant_count: number
  donation_total: number
  is_active: boolean
  created_at: string
}

export interface TournamentRule {
  id: string
  tournament_id: string
  rule_type: string | null
  title: string | null
  content: string | null
  icon: string | null
  sort_order: number
}

export interface Organizer {
  id: string
  tournament_id: string
  name: string | null
  logo_url: string | null
  description: string | null
  type: string | null
  sort_order: number
}

export interface Registration {
  id: string
  tournament_id: string
  user_id: string
  full_name: string | null
  email: string | null
  phone: string | null
  gender: string | null
  birth_date: string | null
  city: string | null
  club_name: string | null
  team_name: string | null
  distance_category: string | null
  agree_terms: boolean
  status: string
  created_at: string
  tournament?: Tournament
}

export interface Donation {
  id: string
  tournament_id: string
  user_id: string | null
  donor_name: string | null
  amount: number
  message: string | null
  payment_method: string
  status: string
  created_at: string
  tournament?: Tournament
}

export interface LeaderboardEntry {
  id: string
  tournament_id: string
  user_id: string | null
  participant_name: string | null
  gender: string | null
  team_name: string | null
  category_type: string
  distance_category: string | null
  total_distance: number
  total_time: number
  avg_pace: string | null
  score: number
  rank_no: number | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}
