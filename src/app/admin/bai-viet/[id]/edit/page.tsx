import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PostEditForm } from './PostEditForm'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single()
  if (!post) notFound()

  return <PostEditForm post={post} />
}
