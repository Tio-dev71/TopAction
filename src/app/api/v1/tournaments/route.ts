import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch published tournaments
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        id, 
        title, 
        display_title, 
        slug, 
        home_cover_image, 
        short_description, 
        start_date, 
        end_date, 
        donation_goal,
        status,
        is_featured
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API] Error fetching tournaments:', error);
      return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err: any) {
    console.error('[API] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
