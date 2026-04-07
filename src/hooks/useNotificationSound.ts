'use client'

import { useCallback, useRef } from 'react'

/**
 * Generates a pleasant notification "ding" sound using Web Audio API.
 * No external sound files needed.
 */
export function useNotificationSound() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const play = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioCtxRef.current

      // Create a pleasant two-tone "ding"
      const now = ctx.currentTime

      // First tone
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(830, now) // A note
      gain1.gain.setValueAtTime(0.3, now)
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.4)

      // Second tone (higher, slightly delayed for a "ding-ding" feel)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(1046, now + 0.12) // C note
      gain2.gain.setValueAtTime(0, now)
      gain2.gain.setValueAtTime(0.25, now + 0.12)
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now + 0.12)
      osc2.stop(now + 0.6)
    } catch {
      // Silently fail if AudioContext is not available
    }
  }, [])

  return { play }
}
