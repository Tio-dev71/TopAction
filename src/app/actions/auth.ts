'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(state: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const target = formData.get('target') as string || '/ca-nhan'

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      return { error: 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email của bạn.' }
    }
    return { error: 'Email hoặc mật khẩu không chính xác.' }
  }

  if (data.user) {
    // Attempt to create profile if it doesn't exist.
    // By using upsert, we ensure it exists. We use coalescing in SQL usually,
    // but here we just ensure the record is there.
    await supabase.from('profiles').upsert(
      {
        id: data.user.id,
        email: data.user.email as string,
        full_name: data.user.user_metadata?.full_name || email.split('@')[0],
      }, 
      { onConflict: 'id', ignoreDuplicates: true }
    )
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

  // If user is created and they have session (auto log in), sync profile
  if (data.user && data.session) {
      // Create profile since they have active session
      await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          email: data.user.email as string,
          full_name: fullName,
        },
        { onConflict: 'id' }
      )
      return { success: true, redirect: '/ca-nhan' }
  } 

  // If no session, email confirmation is required.
  return { success: true, redirect: '', requireConfirmation: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
