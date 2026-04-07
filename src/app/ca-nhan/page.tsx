import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { ProfileForm } from './ProfileForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hồ sơ cá nhân | ATUAN',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/dang-nhap?redirect=/ca-nhan')
  }

  // load profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const safeProfile = profile || {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
    avatar_url: user.user_metadata?.avatar_url || '',
    phone: '',
    city: '',
    club_name: ''
  }

  return (
    <main className="min-h-screen bg-secondary/30 flex flex-col">
        <Navbar />
        <div className="flex-1 w-full relative">
           <ProfileForm profile={safeProfile} />
        </div>
    </main>
  )
}
