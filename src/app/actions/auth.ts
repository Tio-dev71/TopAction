'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(state: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const target = formData.get('target') as string || '/'

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Email hoặc mật khẩu không chính xác.' }
  }

  // Use absolute URL or relative path properly
  let redirectUrl = target;
  try {
     new URL(target);
  } catch (e) {
      redirectUrl = target.startsWith('/') ? target : `/${target}`;
  }

  return { success: true, redirect: redirectUrl }
}

export async function signup(state: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  
  if (!email || !password || !fullName) {
      return { error: 'Vui lòng điền đầy đủ thông tin.' }
  }

  if (password.length < 6) {
      return { error: 'Mật khẩu phải có ít nhất 6 ký tự.' }
  }

  const supabase = await createClient()

  // Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, redirect: '/' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
