'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { headers } from 'next/headers'

interface AuditLogEntry {
  action: string
  target_table?: string
  target_id?: string
  metadata?: Record<string, unknown>
}

/**
 * Create an audit log entry. Call from server actions/route handlers.
 */
export async function createAuditLog(entry: AuditLogEntry) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Use admin client for the actual logging to bypass RLS
    const adminSupabase = await createAdminClient()
    
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null
    const ua = headersList.get('user-agent') || null

    // Get user's primary role for logging
    let actorRole = 'user'
    if (user) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role:roles(code)')
        .eq('user_id', user.id)
        .limit(1)
      
      if (roles && roles.length > 0) {
        actorRole = (roles[0] as any).role?.code || 'user'
      }
    }

    await adminSupabase.from('audit_logs').insert({
      actor_user_id: user?.id || null,
      actor_role: actorRole,
      action: entry.action,
      target_table: entry.target_table || null,
      target_id: entry.target_id || null,
      metadata: entry.metadata || {},
      ip_address: ip,
      user_agent: ua,
    })
  } catch (error) {
    // Audit logging should never break the main flow
    console.error('[AUDIT LOG ERROR]', error)
  }
}
