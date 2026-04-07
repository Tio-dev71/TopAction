'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { type UserRole } from '@/lib/types/database'

/**
 * Require authentication. Throws redirect to login if not authenticated.
 * Returns the authenticated user.
 */
export async function requireAuth(redirectPath?: string) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    const loginUrl = `/dang-nhap${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`
    redirect(loginUrl)
  }

  return user
}

/**
 * Get the list of role codes for a user.
 */
export async function getUserRoles(userId: string): Promise<UserRole[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_roles')
    .select('role:roles(code)')
    .eq('user_id', userId)

  if (error || !data) return ['user']

  const roles = data
    .map((ur: any) => ur.role?.code as UserRole)
    .filter(Boolean)

  return roles.length > 0 ? roles : ['user']
}

/**
 * Check if the current user has at least one of the required roles.
 * Redirects to 403 if not authorized.
 */
export async function requireRole(requiredRoles: UserRole[], redirectPath?: string) {
  const user = await requireAuth(redirectPath)
  const userRoles = await getUserRoles(user.id)

  const hasRequired = requiredRoles.some(role => userRoles.includes(role))
  
  if (!hasRequired) {
    redirect('/403')
  }

  return { user, roles: userRoles }
}

/**
 * Check if user is admin (admin or super_admin).
 */
export async function requireAdmin(redirectPath?: string) {
  return requireRole(['admin', 'super_admin'], redirectPath)
}

/**
 * Check if user is staff (any elevated role).
 */
export async function requireStaff(redirectPath?: string) {
  return requireRole(['super_admin', 'admin', 'editor', 'finance', 'support'], redirectPath)
}

/**
 * Check if a specific user is admin. Non-throwing version.
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const roles = await getUserRoles(userId)
  return roles.includes('admin') || roles.includes('super_admin')
}

/**
 * Check if a specific user is staff. Non-throwing version.
 */
export async function isUserStaff(userId: string): Promise<boolean> {
  const roles = await getUserRoles(userId)
  const staffRoles: UserRole[] = ['super_admin', 'admin', 'editor', 'finance', 'support']
  return roles.some(r => staffRoles.includes(r))
}

/**
 * Get user profile with roles for display.
 */
export async function getAuthUserWithRoles() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const roles = await getUserRoles(user.id)
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile, roles }
}
