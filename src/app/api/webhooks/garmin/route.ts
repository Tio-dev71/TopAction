import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use admin client for webhook handler (no user context)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Garmin Health API Push Notification Handler
 * 
 * Garmin pushes activity data to this endpoint whenever a user
 * syncs their device. The payload format varies by endpoint type:
 * - /activities: New activities
 * - /activityDetails: Detailed activity metrics
 * 
 * Garmin sends an array of activities (called "summaries") per push.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json()
    console.log('[GARMIN WEBHOOK] Received:', JSON.stringify(payload).substring(0, 500))

    // Garmin sends different types of data.
    // For activities, the payload has an array under various keys.
    // The main one for us is "activities" or the root array.
    const activities = payload.activities || payload.activityDetails || payload || []
    
    // Garmin can send a single object or an array
    const activityList = Array.isArray(activities) ? activities : [activities]

    let processedCount = 0

    for (const activity of activityList) {
      // Skip if no user token reference
      const userAccessToken = activity.userAccessToken || activity.oauth_token || ''
      
      if (!userAccessToken) {
        console.log('[GARMIN] Activity without userAccessToken, skipping')
        continue
      }

      // Find user by their Garmin access token (stored as provider_athlete_id)
      const { data: connection } = await supabase
        .from('user_connections')
        .select('user_id')
        .eq('provider', 'garmin')
        .eq('access_token', userAccessToken)
        .single()

      if (!connection) {
        console.log('[GARMIN] User not found for token:', userAccessToken.substring(0, 10) + '...')
        continue
      }

      // Map Garmin activity fields to our schema
      // Garmin uses different field names than Strava
      const activityId = activity.activityId || activity.summaryId || Date.now().toString()
      const activityType = mapGarminActivityType(activity.activityType || activity.sportType || '')
      const distanceMeters = activity.distanceInMeters || activity.distance || 0
      const durationSeconds = activity.durationInSeconds || activity.duration || 0
      const startTime = activity.startTimeInSeconds
        ? new Date(activity.startTimeInSeconds * 1000).toISOString()
        : activity.startTimeLocal || new Date().toISOString()
      const avgSpeed = distanceMeters && durationSeconds
        ? distanceMeters / durationSeconds
        : null

      const dbActivity = {
        user_id: connection.user_id,
        provider: 'garmin',
        external_id: activityId.toString(),
        name: activity.activityName || `Garmin ${activityType}`,
        activity_type: activityType,
        distance: distanceMeters,
        moving_time: durationSeconds,
        elapsed_time: activity.elapsedDurationInSeconds || durationSeconds,
        start_date: startTime,
        average_speed: avgSpeed,
        average_heartrate: activity.averageHeartRateInBeatsPerMinute || null,
        polyline: null, // Garmin doesn't send polyline in push notifications
        is_valid: true,
      }

      // Upsert to prevent duplicates
      const { error } = await supabase
        .from('activities')
        .upsert(dbActivity, { onConflict: 'provider, external_id' })

      if (error) {
        console.error('[GARMIN] Insert activity error:', error)
      } else {
        processedCount++
      }
    }

    console.log(`[GARMIN WEBHOOK] Processed ${processedCount} activities`)
    return NextResponse.json({ success: true, processed: processedCount })
  } catch (error) {
    console.error('[GARMIN WEBHOOK ERROR]', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * Map Garmin activity type strings to our standardized types
 */
function mapGarminActivityType(garminType: string): string {
  const typeMap: Record<string, string> = {
    RUNNING: 'Run',
    TRAIL_RUNNING: 'Run',
    TREADMILL_RUNNING: 'Run',
    WALKING: 'Walk',
    HIKING: 'Walk',
    CYCLING: 'Ride',
    MOUNTAIN_BIKING: 'Ride',
    ROAD_BIKING: 'Ride',
    SWIMMING: 'Swim',
    OPEN_WATER_SWIMMING: 'Swim',
    LAP_SWIMMING: 'Swim',
    // Default fallback
    OTHER: 'Other',
  }

  return typeMap[garminType.toUpperCase()] || garminType || 'Other'
}
