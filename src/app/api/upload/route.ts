

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Định dạng file không hỗ trợ. Chỉ chấp nhận: JPG, PNG, WebP, GIF, SVG' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File quá lớn. Tối đa 5MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const storagePath = `${folder}/${timestamp}-${randomStr}.${ext}`

    // Upload to Supabase Storage using admin client
    const adminClient = await createAdminClient()
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await adminClient.storage
      .from('media')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Không thể tải lên: ' + uploadError.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: publicUrlData } = adminClient.storage
      .from('media')
      .getPublicUrl(storagePath)

    const publicUrl = publicUrlData.publicUrl

    // Save to media_assets table
    await adminClient.from('media_assets').insert({
      storage_path: storagePath,
      public_url: publicUrl,
      file_type: file.type,
      file_size: file.size,
      alt_text: file.name,
      uploaded_by: user.id,
    })

    return NextResponse.json({ url: publicUrl, path: storagePath })
  } catch (err: any) {
    console.error('Upload handler error:', err)
    return NextResponse.json(
      { error: 'Lỗi server: ' + (err.message || 'Unknown') },
      { status: 500 }
    )
  }
}
