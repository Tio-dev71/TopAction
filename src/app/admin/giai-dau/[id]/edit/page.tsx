import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { TournamentEditForm } from './EditForm'

export default async function EditTournamentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: tournament } = await supabase
    .from('tournaments')
    .select(`
      *,
      categories:tournament_categories(*),
      rules:tournament_rules(*),
      sections:tournament_sections(*),
      organizers:organizers(*)
    `)
    .eq('id', id)
    .order('sort_order', { referencedTable: 'tournament_categories' })
    .order('sort_order', { referencedTable: 'tournament_rules' })
    .order('sort_order', { referencedTable: 'organizers' })
    .single()

  if (!tournament) notFound()

  return <TournamentEditForm tournament={tournament} />
}
