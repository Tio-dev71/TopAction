"use client";

import { useState } from "react";
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { PostWithAuthor, toggleLikePost } from "./actions";
import { toast } from "sonner";

export default function PostItem({ post }: { post: PostWithAuthor }) {
  const [likes, setLikes] = useState(post.likes_count);
  const [hasLiked, setHasLiked] = useState(post.has_liked || false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    // Optimistic UI update
    setHasLiked(!hasLiked);
    setLikes(hasLiked ? likes - 1 : likes + 1);

    const res = await toggleLikePost(post.id, hasLiked);
    
    if (res.error) {
      // Revert if error
      setHasLiked(hasLiked);
      setLikes(likes);
      toast.error(res.error);
    }
    
    setIsLiking(false);
  };

  const formattedTime = new Intl.DateTimeFormat("vi-VN", {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric"
  }).format(new Date(post.created_at));

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-border/40 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={post.author.avatar_url || "https://i.pravatar.cc/150?u=" + post.author.id} 
            alt={post.author.full_name} 
            className="w-10 h-10 rounded-full border border-border/50 object-cover" 
          />
          <div>
            <h4 className="font-bold text-[15px] text-foreground leading-none">{post.author.full_name}</h4>
            <div className="flex items-center gap-1.5 mt-1 text-[12px] text-muted-foreground">
              <span>{formattedTime}</span>
              <span>•</span>
              <span>Thành viên</span>
            </div>
          </div>
        </div>
        
        {post.content && (
          <p className="text-[15px] text-foreground leading-relaxed whitespace-pre-wrap mb-3">
            {post.content}
          </p>
        )}
      </div>
      
      {post.images && post.images.length > 0 && (
        <div className={`w-full grid ${post.images.length > 1 ? 'grid-cols-2 gap-1' : 'grid-cols-1'}`}>
          {post.images.map((img, i) => (
            <img 
              key={i} 
              src={img} 
              alt="Post media" 
              className={`w-full object-cover ${post.images.length === 1 ? 'max-h-[500px]' : 'h-[250px]'}`} 
            />
          ))}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between text-[13px] text-muted-foreground mb-3 pb-3 border-b border-border/40">
          <span>{likes} lượt thích</span>
          <span>{post.comments_count} bình luận</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg font-semibold text-[14px] transition-colors ${hasLiked ? 'text-[#1d4ed8] bg-[#1d4ed8]/10' : 'text-muted-foreground hover:bg-secondary'}`}
          >
            <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
            Thích
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary font-semibold text-[14px] transition-colors">
            <MessageSquare className="h-4 w-4" />
            Bình luận
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary font-semibold text-[14px] transition-colors">
            <Share2 className="h-4 w-4" />
            Chia sẻ
          </button>
        </div>
      </div>
    </div>
  );
}
