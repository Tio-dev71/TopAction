"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, UploadCloud, Info, ShieldCheck, MapPin, Calendar, 
  CheckCircle2, Megaphone, HelpCircle, ChevronRight, Check
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function CreateClubPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground mb-6">
          <span>Trang chủ</span>
          <ChevronRight className="w-3 h-3" />
          <span>CLB Pickleball</span>
          <ChevronRight className="w-3 h-3" />
          <span className="font-semibold text-foreground">Đăng ký CLB</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN: FORM */}
          <div className="flex-1 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">Đăng ký CLB Pickleball</h1>
                <p className="text-[14px] text-muted-foreground mt-1">
                  Tạo CLB của bạn để kết nối cộng đồng, tổ chức sự kiện, giải đấu và phát triển phong trào Pickleball.
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-2xl p-8 border border-border/60 shadow-sm">
              <h2 className="text-lg font-bold border-b pb-4 mb-6">Thông tin cơ bản</h2>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-2">Tên CLB <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Nhập tên CLB" className="w-full bg-white border border-border/80 rounded-xl px-4 py-3 text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                  <p className="text-[12px] text-muted-foreground mt-1.5">Tên CLB sẽ hiển thị công khai trên TopPlay</p>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-2">Tên viết tắt (nếu có)</label>
                  <input type="text" placeholder="VD: TPC, HPP..." className="w-full bg-white border border-border/80 rounded-xl px-4 py-3 text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                  <p className="text-[12px] text-muted-foreground mt-1.5">Tối đa 10 ký tự</p>
                </div>
              </div>

              {/* Uploads */}
              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                <div className="sm:col-span-1">
                  <label className="block text-[13px] font-bold text-foreground mb-2">Logo CLB <span className="text-red-500">*</span></label>
                  <div className="border-2 border-dashed border-border rounded-xl h-32 flex flex-col items-center justify-center text-center p-4 hover:bg-secondary/50 transition-colors cursor-pointer group">
                    <UploadCloud className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-[13px] font-semibold text-[#1d4ed8]">Tải lên logo</p>
                    <p className="text-[11px] text-muted-foreground mt-1">PNG, JPG (Tối đa 2MB)</p>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[13px] font-bold text-foreground mb-2">Ảnh bìa <span className="text-red-500">*</span></label>
                  <div className="border-2 border-dashed border-border rounded-xl h-32 flex flex-col items-center justify-center text-center p-4 hover:bg-secondary/50 transition-colors cursor-pointer group">
                    <UploadCloud className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-[13px] font-semibold text-[#1d4ed8]">Tải lên ảnh bìa</p>
                    <p className="text-[11px] text-muted-foreground mt-1">JPG, PNG (Kích thước đề xuất 1200x400px, tối đa 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-[13px] font-bold text-foreground mb-2">Mô tả CLB <span className="text-red-500">*</span></label>
                <textarea 
                  rows={4} 
                  placeholder="Giới thiệu ngắn gọn về CLB, mục tiêu, hoạt động..." 
                  className="w-full bg-white border border-border/80 rounded-xl px-4 py-3 text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                />
                <div className="flex justify-between items-center mt-1.5">
                  <p className="text-[12px] text-muted-foreground">Tối đa 500 ký tự</p>
                  <p className="text-[12px] text-muted-foreground">0/500</p>
                </div>
              </div>

              {/* Location & Details Grid */}
              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-2">Địa điểm chính <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" placeholder="Chọn địa điểm" className="w-full bg-white border border-border/80 rounded-xl px-4 py-3 pr-10 text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors cursor-pointer" readOnly />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-2">Khu vực <span className="text-red-500">*</span></label>
                  <select className="w-full bg-white border border-border/80 rounded-xl px-4 py-3 text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none cursor-pointer">
                    <option>Chọn khu vực</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-2">Quận / Huyện <span className="text-red-500">*</span></label>
                  <select className="w-full bg-white border border-border/80 rounded-xl px-4 py-3 text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none cursor-pointer">
                    <option>Chọn quận / huyện</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-2">Ngày thành lập (dự kiến)</label>
                  <div className="relative">
                    <input type="date" className="w-full bg-white border border-border/80 rounded-xl px-4 py-3 text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-2">Số lượng thành viên dự kiến</label>
                  <select className="w-full bg-white border border-border/80 rounded-xl px-4 py-3 text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none cursor-pointer">
                    <option>Chọn số lượng</option>
                    <option>Dưới 20</option>
                    <option>20 - 50</option>
                    <option>50 - 100</option>
                    <option>Trên 100</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-2">Trình độ thành viên chủ yếu</label>
                  <select className="w-full bg-white border border-border/80 rounded-xl px-4 py-3 text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none cursor-pointer">
                    <option>Chọn trình độ</option>
                    <option>Mới chơi (Beginner)</option>
                    <option>Trung bình (Intermediate)</option>
                    <option>Khá giỏi (Advanced)</option>
                  </select>
                </div>
              </div>

              <h2 className="text-lg font-bold border-b pb-4 mb-6">Thông tin liên hệ</h2>
              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-2">Người đại diện <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Nhập họ tên người đại diện" className="w-full bg-white border border-border/80 rounded-xl px-4 py-3 text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                  <input type="tel" placeholder="Nhập số điện thoại" className="w-full bg-white border border-border/80 rounded-xl px-4 py-3 text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-2">Email <span className="text-red-500">*</span></label>
                  <input type="email" placeholder="Nhập email" className="w-full bg-white border border-border/80 rounded-xl px-4 py-3 text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                </div>
              </div>

              <div className="flex items-start gap-3 mb-8">
                <input 
                  type="checkbox" 
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary" 
                />
                <label htmlFor="agree" className="text-[14px] text-foreground cursor-pointer select-none">
                  Tôi cam kết các thông tin trên là chính xác và tuân thủ <a href="#" className="font-semibold text-[#1d4ed8] hover:underline">Quy định cộng đồng TopPlay</a>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 border-t border-border/50 pt-6">
                <Button variant="outline" className="px-8 h-11 rounded-xl font-bold" onClick={() => router.back()}>
                  Hủy
                </Button>
                <Button 
                  className={`px-8 h-11 rounded-xl font-bold ${agreed ? 'bg-[#1d4ed8] hover:bg-[#1e40af] text-white shadow-md shadow-blue-500/20' : 'bg-muted text-muted-foreground'}`}
                  disabled={!agreed}
                >
                  Tiếp tục
                </Button>
              </div>
            </div>

            {/* Bottom Trust Badges */}
            <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-2xl border border-border/60 shadow-sm mt-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#1d4ed8]" />
                <div>
                  <p className="text-[13px] font-bold">Xác minh danh tính</p>
                  <p className="text-[11px] text-muted-foreground">Bảo mật & an toàn</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1d4ed8]" />
                <div>
                  <p className="text-[13px] font-bold">Duyệt thủ công</p>
                  <p className="text-[11px] text-muted-foreground">Kiểm duyệt kỹ lưỡng</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#1d4ed8]" />
                <div>
                  <p className="text-[13px] font-bold">Bảo vệ cộng đồng</p>
                  <p className="text-[11px] text-muted-foreground">Ngăn chặn spam & gian lận</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#1d4ed8]" />
                <div>
                  <p className="text-[13px] font-bold">Hỗ trợ 24/7</p>
                  <p className="text-[11px] text-muted-foreground">Mọi lúc, mọi nơi</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INFO & PROCESS */}
          <div className="w-full lg:w-[380px] shrink-0 space-y-6">
            
            {/* Verified Status Card */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-[#1d4ed8] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[14px] text-foreground">Chỉ tài khoản tích xanh mới được tạo CLB</h3>
                  <p className="text-[13px] text-muted-foreground mt-1">
                    Để đảm bảo chất lượng cộng đồng và hạn chế spam, chỉ tài khoản đã xác minh (Tích xanh TopPlay) mới có thể đăng ký CLB.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-emerald-500/30 flex flex-col items-center text-center shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600 font-bold mb-1">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                  <span>Tài khoản của bạn đã được xác minh</span>
                  <div className="w-4 h-4 bg-[#1d4ed8] text-white rounded-full flex items-center justify-center border border-white">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                </div>
                <p className="text-[12px] text-muted-foreground mb-3">Xác minh ngày 12/05/2024</p>
                <a href="/ca-nhan" className="text-[13px] font-bold text-[#1d4ed8] hover:underline self-end">Quản lý tài khoản</a>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-[15px] mb-5">Lợi ích khi tạo CLB trên TopPlay</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1d4ed8] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold">Xây dựng cộng đồng riêng</h4>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Kết nối các thành viên có chung đam mê</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1d4ed8] flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold">Tổ chức sự kiện, giải đấu</h4>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Dễ dàng tạo và quản lý các sự kiện</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1d4ed8] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold">Quản lý thành viên</h4>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Theo dõi, phân quyền và tương tác dễ dàng</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1d4ed8] flex items-center justify-center shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold">Quảng bá CLB</h4>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Tăng độ nhận diện và thu hút thành viên</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Process */}
            <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-[15px] mb-5">Quy trình tạo CLB</h3>
              <div className="relative pl-3">
                <div className="absolute left-6 top-2 bottom-6 w-0.5 bg-border/80"></div>
                
                <div className="flex gap-4 relative z-10 mb-6">
                  <div className="w-7 h-7 rounded-full bg-[#1d4ed8] text-white text-[12px] font-bold flex items-center justify-center shrink-0 shadow-sm border-[3px] border-white">1</div>
                  <div className="pt-0.5">
                    <h4 className="text-[14px] font-bold text-foreground">Điền thông tin đăng ký</h4>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Cung cấp thông tin cơ bản về CLB</p>
                  </div>
                </div>
                
                <div className="flex gap-4 relative z-10 mb-6">
                  <div className="w-7 h-7 rounded-full bg-secondary text-muted-foreground text-[12px] font-bold flex items-center justify-center shrink-0 border-[3px] border-white">2</div>
                  <div className="pt-0.5">
                    <h4 className="text-[14px] font-bold text-muted-foreground">Chờ duyệt thông tin</h4>
                    <p className="text-[12px] text-muted-foreground mt-0.5">TopPlay sẽ kiểm duyệt trong 1-2 ngày làm việc</p>
                  </div>
                </div>

                <div className="flex gap-4 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-secondary text-muted-foreground text-[12px] font-bold flex items-center justify-center shrink-0 border-[3px] border-white">3</div>
                  <div className="pt-0.5">
                    <h4 className="text-[14px] font-bold text-muted-foreground">CLB được kích hoạt</h4>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Bắt đầu xây dựng cộng đồng của bạn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <HelpCircle className="w-6 h-6 text-[#1d4ed8] shrink-0" />
              <div>
                <h4 className="text-[14px] font-bold text-[#1d4ed8]">Cần hỗ trợ?</h4>
                <p className="text-[12px] text-[#1d4ed8]/80 mt-1 mb-2">Liên hệ đội ngũ TopPlay để được hỗ trợ nhanh chóng.</p>
                <a href="#" className="text-[13px] font-bold text-[#1d4ed8] hover:underline flex items-center gap-1">
                  Liên hệ ngay <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
