'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

type PostgresEvent = 'INSERT' | 'UPDATE' | 'DELETE'

interface UseRealtimeTableOptions {
  table: string
  schema?: string
  event?: PostgresEvent | '*'
  filter?: string // e.g. "tournament_id=eq.xxx"
  onInsert?: (payload: RealtimePostgresChangesPayload<any>) => void
  onUpdate?: (payload: RealtimePostgresChangesPayload<any>) => void
  onDelete?: (payload: RealtimePostgresChangesPayload<any>) => void
  onChange?: (payload: RealtimePostgresChangesPayload<any>) => void
  enabled?: boolean
}

/**
 * Subscribe to Supabase Realtime postgres_changes for a given table.
 * Automatically handles cleanup on unmount.
 */
export function useRealtimeTable({
  table,
  schema = 'public',
  event = '*',
  filter,
  onInsert,
  onUpdate,
  onDelete,
  onChange,
  enabled = true,
}: UseRealtimeTableOptions) {
  // Use refs for callbacks so we don't re-subscribe on every render
  const callbacksRef = useRef({ onInsert, onUpdate, onDelete, onChange })
  callbacksRef.current = { onInsert, onUpdate, onDelete, onChange }

  useEffect(() => {
    if (!enabled) return

    const supabase = createClient()
    const channelName = `realtime-${table}-${filter || 'all'}-${Date.now()}`

    const channelConfig: any = {
      event,
      schema,
      table,
    }
    if (filter) {
      channelConfig.filter = filter
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as any,
        channelConfig,
        (payload: RealtimePostgresChangesPayload<any>) => {
          const cbs = callbacksRef.current

          // Fire type-specific callbacks
          if (payload.eventType === 'INSERT' && cbs.onInsert) {
            cbs.onInsert(payload)
          }
          if (payload.eventType === 'UPDATE' && cbs.onUpdate) {
            cbs.onUpdate(payload)
          }
          if (payload.eventType === 'DELETE' && cbs.onDelete) {
            cbs.onDelete(payload)
          }

          // Fire generic onChange
          if (cbs.onChange) {
            cbs.onChange(payload)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, schema, event, filter, enabled])
}
