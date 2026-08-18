"use client";

import { X, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface VerifyInterceptorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  requiredTier?: "personal" | "club" | "organizer";
}

export function VerifyInterceptorModal({
  isOpen,
  onClose,
  title = "Yêu cầu xác minh tài khoản",
  description = "Để đảm bảo chất lượng cộng đồng và hạn chế tài khoản giả mạo, chỉ các tài khoản đã xác minh (TopPlay Verified) mới có thể sử dụng tính năng này.",
  requiredTier = "personal",
}: VerifyInterceptorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-primary mx-auto rounded-full flex items-center justify-center mb-6 ring-8 ring-blue-50/50">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
          
          <p className="text-[14px] text-muted-foreground leading-relaxed mb-8">
            {description}
          </p>

          <div className="space-y-3">
            <Link href={`/verified?tier=${requiredTier}`} onClick={onClose} className="block">
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-[14px] shadow-lg shadow-primary/20">
                Tìm hiểu & Xác minh ngay
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full h-12 border-border hover:bg-secondary rounded-xl font-bold text-[14px] text-muted-foreground"
            >
              Để sau
            </Button>
          </div>
        </div>
        
        <div className="bg-secondary/30 p-4 border-t border-border/50 text-center">
          <p className="text-[12px] text-muted-foreground">
            TopPlay Verified giúp bảo vệ cộng đồng khỏi spam và gian lận.
          </p>
        </div>
      </div>
    </div>
  );
}
