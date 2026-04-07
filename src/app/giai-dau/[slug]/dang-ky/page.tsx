import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { RegistrationForm } from './RegistrationForm'

export default async function RegistrationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/dang-nhap?redirect=/giai-dau/${slug}/dang-ky`)
  }

  // Get tournament with categories
  const { data: tournament } = await supabase
    .from('tournaments')
    .select(`
      id, title, slug, status, start_date, end_date, location, city,
      registration_open_at, registration_close_at, max_participants, participant_count,
      categories:tournament_categories(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .order('sort_order', { referencedTable: 'tournament_categories' })
    .single()

  if (!tournament) notFound()

  // Get user profile for prefill
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Check registration window
  const now = new Date().toISOString()
  let registrationClosed = false
  let closedReason = ''

  if (tournament.registration_open_at && now < tournament.registration_open_at) {
    registrationClosed = true
    closedReason = 'Chưa đến thời gian đăng ký'
  }
  if (tournament.registration_close_at && now > tournament.registration_close_at) {
    registrationClosed = true
    closedReason = 'Đã hết hạn đăng ký'
  }
  if (tournament.max_participants && tournament.participant_count >= tournament.max_participants) {
    registrationClosed = true
    closedReason = 'Giải đấu đã đầy'
  }

  // Check if already registered
  const { data: existingRegs } = await supabase
    .from('registrations')
    .select('id, category_id, status, registration_code')
    .eq('user_id', user.id)
    .eq('tournament_id', tournament.id)
    .not('status', 'in', '("cancelled","rejected")')

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <RegistrationForm
        tournament={tournament}
        profile={profile}
        registrationClosed={registrationClosed}
        closedReason={closedReason}
        existingRegistrations={existingRegs || []}
      />
    </div>
  )
}
