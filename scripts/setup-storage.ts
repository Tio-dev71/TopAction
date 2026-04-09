/**
 * Script to set up the Supabase Storage bucket for media uploads.
 * 
 * Run once: npx tsx scripts/setup-storage.ts
 * 
 * This creates a public 'media' bucket if it doesn't already exist.
 */
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Check if bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.error('❌ Cannot list buckets:', listError.message)
    process.exit(1)
  }

  const exists = buckets?.some((b) => b.name === 'media')

  if (exists) {
    console.log('✅ Bucket "media" already exists.')
  } else {
    const { error: createError } = await supabase.storage.createBucket('media', {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    })

    if (createError) {
      console.error('❌ Cannot create bucket:', createError.message)
      process.exit(1)
    }

    console.log('✅ Created public bucket "media" successfully!')
  }

  console.log('🎉 Storage setup complete.')
}

main()
