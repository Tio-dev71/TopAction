import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStravaActivity } from '@/lib/strava/client'

// Use admin client for webhook handler (no user info)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Strava URL challenge verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.STRAVA_WEBHOOK_VERIFY_TOKEN) {
    return NextResponse.json({ 'hub.challenge': challenge })
  } else {
    return new NextResponse('Forbidden', { status: 403 })
  }
}

// Receive push events
export async function POST(request: Request) {
  try {
    const payload = await request.json()
    console.log('Strava Webhook received:', payload)

    // Aspect type: create | update | delete
    // Object type: activity | athlete
    const { object_type, aspect_type, object_id, owner_id } = payload

    // We only care about new activities
    if (object_type !== 'activity') {
      return new NextResponse('ignored', { status: 200 })
    }

    if (aspect_type === 'delete') {
      // Handle activity deletion
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('provider', 'strava')
        .eq('external_id', object_id.toString())
        
      if (error) console.error('Strava webhook delete error:', error)
      // Note: Triggers in DB or a cron job should recalculate tournament_results, 
      // or we can calculate it dynamically directly in the DB later.
      return new NextResponse('deleted', { status: 200 })
    }

    if (aspect_type !== 'create') {
      return new NextResponse('ignored', { status: 200 })
    }

    // Step 1: Find user in our db who owns this Strava athlete ID
    const { data: connection } = await supabase
      .from('user_connections')
      .select('user_id, access_token')
      .eq('provider', 'strava')
      .eq('provider_athlete_id', owner_id.toString())
      .single()

    if (!connection) {
      console.log('Webhook: Strava user not found in our DB', owner_id)
      return new NextResponse('ignored_user_not_found', { status: 200 })
    }

    // Since this is a serverless function, to avoid Vercel timeout (10s on hobby), 
    // ideally we should throw this to a message queue. 
    // But for this platform, we can just await it since we don't expect extreme scale yet.
    
    // Step 2: Fetch activity details from Strava API
    try {
      const activityData = await getStravaActivity(object_id.toString(), connection.access_token)
      
      console.log('Activity fetched:', activityData.name)

      // Step 3: Insert to activities table
      // Note: We don't dynamically calculate the tournament right here.
      // We just store the activity. A later process or trigger handles tournament ranking.
      // E.g., we query valid activities to display leaderboards.
      const dbActivity = {
        user_id: connection.user_id,
        provider: 'strava',
        external_id: activityData.id.toString(),
        name: activityData.name,
        activity_type: activityData.type,
        distance: activityData.distance, // float meters
        moving_time: activityData.moving_time,
        elapsed_time: activityData.elapsed_time,
        start_date: activityData.start_date, // ISO
        average_speed: activityData.average_speed || null,
        average_heartrate: activityData.average_heartrate || null,
        polyline: activityData.map?.summary_polyline || null,
        is_valid: true // Can be false if pace is bad, checked later
      }

      await supabase.from('activities').insert(dbActivity).select('id')
      
      // Optionally we could recalculate tournament_results right here. 
      // For simplicity and immediate consistency, we could call an RPC or update logic.

    } catch (e: any) {
      console.error('Error fetching activity details:', e.message)
      // If token expired, we would need to refresh it. In a robust setup we check `expires_at` and refresh first.
    }

    return new NextResponse('ok', { status: 200 })
  } catch (error) {
    console.error('Strava webhook error:', error)
    return new NextResponse('Bad Request', { status: 400 })
  }
}
