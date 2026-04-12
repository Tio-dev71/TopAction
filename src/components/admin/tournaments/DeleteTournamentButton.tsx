"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface DeleteTournamentButtonProps {
  id: string;
  title: string;
}

export function DeleteTournamentButton({ id, title }: DeleteTournamentButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa giải đấu "${title}" không?\n\nHành động này sẽ xóa toàn bộ danh sách đăng ký và không thể hoàn tác!`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("tournaments")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error(`Lỗi khi xóa giải đấu: ${error.message}`);
        console.error("Delete error:", error);
      } else {
        toast.success("Đã xóa giải đấu thành công.");
        router.refresh();
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi không xác định.");
      console.error("Unexpected error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
      title="Xóa giải đấu"
    >
      <Trash2 className={`h-4 w-4 ${isDeleting ? "animate-pulse" : ""}`} />
    </Button>
  );
}
