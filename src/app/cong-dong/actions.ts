"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Định nghĩa Type trả về
export type PostWithAuthor = {
  id: string;
  content: string;
  images: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  author: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  has_liked?: boolean;
};

export async function getPosts(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  
  // Kiểm tra user hiện tại để đánh dấu bài nào đã like
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  // Lấy danh sách posts kèm thông tin author
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      images,
      likes_count,
      comments_count,
      created_at,
      author:author_id (id, full_name, avatar_url)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  // Nếu user đã đăng nhập, lấy danh sách các post mà user đã like
  let likedPostIds = new Set<string>();
  if (userId && posts && posts.length > 0) {
    const postIds = posts.map(p => p.id);
    const { data: likes } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", userId)
      .in("post_id", postIds);

    if (likes) {
      likes.forEach(like => likedPostIds.add(like.post_id));
    }
  }

  // Map lại dữ liệu
  return (posts as any[]).map((post) => ({
    ...post,
    author: post.author || { id: "", full_name: "Ẩn danh", avatar_url: "" },
    has_liked: likedPostIds.has(post.id),
  }));
}

export async function createPost(content: string, imageUrls: string[] = []) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Bạn cần đăng nhập để đăng bài." };
  }

  if (!content.trim() && imageUrls.length === 0) {
    return { error: "Bài viết không được để trống." };
  }

  const { error } = await supabase.from("posts").insert({
    author_id: userId,
    content: content.trim(),
    images: imageUrls,
  });

  if (error) {
    console.error("Create post error:", error);
    return { error: "Không thể đăng bài viết lúc này." };
  }

  revalidatePath("/cong-dong");
  return { success: true };
}

export async function toggleLikePost(postId: string, currentLikedState: boolean) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Bạn cần đăng nhập để thích bài viết." };
  }

  if (currentLikedState) {
    // Bỏ like
    await supabase.from("post_likes").delete().match({ post_id: postId, user_id: userId });
  } else {
    // Thích
    await supabase.from("post_likes").insert({ post_id: postId, user_id: userId });
  }

  revalidatePath("/cong-dong");
  return { success: true };
}
