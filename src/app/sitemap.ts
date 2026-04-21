import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = 'https://topplay.vn';

  // Lấy danh sách các giải đấu đang hoạt động hoặc đã đóng
  const { data: tournaments } = await supabase
    .from('tournaments')
    .select('slug, updated_at')
    .in('status', ['published', 'closed']);

  const tournamentUrls = (tournaments || []).map((t) => ({
    url: `${baseUrl}/giai-dau/${t.slug}`,
    lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    // Bạn có thể thêm các trang tĩnh khác ở đây, ví dụ: /gioi-thieu, /tin-tuc...
  ];

  return [...staticUrls, ...tournamentUrls];
}
