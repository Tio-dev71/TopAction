"use client";

import { useState, useRef } from "react";
import { ImageIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPost } from "./actions";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function CreatePostBox({ avatarUrl }: { avatarUrl?: string }) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke the old URL to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const handlePublish = async () => {
    if (!content.trim() && images.length === 0) return;
    
    setIsPublishing(true);
    let imageUrls: string[] = [];

    // Upload images if any
    if (images.length > 0) {
      for (const file of images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${Date.now()}_${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('community-media')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Không thể tải ảnh lên. Vui lòng thử lại.");
          setIsPublishing(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('community-media')
          .getPublicUrl(data.path);
          
        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    const res = await createPost(content, imageUrls);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Đăng bài thành công!");
      setContent("");
      setImages([]);
      setPreviews([]);
    }
    
    setIsPublishing(false);
  };

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-border/40 p-4">
      <div className="flex gap-3 mb-3">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-border/50 shrink-0 object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 border border-border/50 shrink-0 flex items-center justify-center overflow-hidden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Bạn đang nghĩ gì?"
          className="flex-1 bg-secondary rounded-xl p-3 text-[14px] text-foreground transition-colors min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
          disabled={isPublishing}
        />
      </div>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 pl-13">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                disabled={isPublishing}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-1">
          <input 
            type="file" 
            accept="image/*,video/*" 
            multiple 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            disabled={isPublishing}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground font-medium rounded-lg hover:bg-secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPublishing}
          >
            <ImageIcon className="h-4 w-4 mr-2 text-green-500" />
            Ảnh/Video
          </Button>
        </div>
        <Button 
          size="sm" 
          className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg px-6 font-bold"
          onClick={handlePublish}
          disabled={isPublishing || (!content.trim() && images.length === 0)}
        >
          {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Đăng"}
        </Button>
      </div>
    </div>
  );
}
