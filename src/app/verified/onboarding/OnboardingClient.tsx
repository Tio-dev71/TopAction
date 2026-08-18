"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronRight, Upload, Camera, CreditCard, ShieldCheck, CheckCircle2, ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MainContainer } from "@/components/layout/MainContainer";
import { Button } from "@/components/ui/button";

const STEPS = [
  { id: 1, title: "Loại tài khoản" },
  { id: 2, title: "Xác thực eKYC" },
  { id: 3, title: "Điều khoản" },
  { id: 4, title: "Thanh toán" },
];

export function OnboardingClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTier = searchParams.get("tier") || "personal";
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState(initialTier);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else setIsCompleted(true);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else router.push("/verified");
  };

  if (isCompleted) {
    return (
      <>
        <Navbar />
        <div className="bg-[#f8fafc] min-h-screen pt-20 pb-24 flex items-center justify-center">
          <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center border border-border/50">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-foreground mb-4">Hồ sơ đang được duyệt!</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">
              Cảm ơn bạn đã đăng ký TopPlay Verified. Đội ngũ kiểm duyệt sẽ phản hồi kết quả và cấp Tích xanh cho bạn trong vòng 24h làm việc.
            </p>
            <div className="bg-secondary/30 p-4 rounded-xl border border-border/50 text-left mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">Mã hồ sơ:</span>
                <span className="text-sm font-bold text-foreground">TPV-{Math.floor(Math.random() * 100000)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">Gói đăng ký:</span>
                <span className="text-sm font-bold text-foreground capitalize">{selectedTier}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Trạng thái:</span>
                <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Chờ duyệt</span>
              </div>
            </div>
            <Button onClick={() => router.push("/ca-nhan")} className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold">
              Về trang cá nhân
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-[#f8fafc] min-h-[calc(100vh-72px)] pt-8 pb-20">
        <MainContainer className="max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={handleBack} className="w-10 h-10 rounded-full bg-white border border-border/80 flex items-center justify-center hover:bg-secondary transition-colors">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">Đăng ký TopPlay Verified</h1>
              <p className="text-[14px] text-muted-foreground">Hoàn thành 4 bước để xác minh tài khoản của bạn</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-border/60 overflow-hidden">
            {/* Progress Bar */}
            <div className="flex border-b border-border/50">
              {STEPS.map((step) => (
                <div key={step.id} className="flex-1 relative">
                  <div className={`h-1.5 w-full transition-colors ${step.id <= currentStep ? "bg-primary" : "bg-secondary"}`} />
                  <div className="py-4 px-2 text-center">
                    <span className={`text-[12px] font-bold uppercase tracking-wider ${step.id <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
                      Bước {step.id}
                    </span>
                    <p className={`text-[13px] font-semibold mt-1 hidden sm:block ${step.id <= currentStep ? "text-foreground" : "text-muted-foreground/60"}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="p-6 sm:p-10">
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center max-w-md mx-auto mb-8">
                    <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Chọn cấp độ xác minh</h2>
                    <p className="text-[14px] text-muted-foreground">Quyền lợi và chi phí phụ thuộc vào mục đích sử dụng nền tảng của bạn.</p>
                  </div>
                  
                  <div className="grid gap-4">
                    {[
                      { id: "personal", title: "Tích Xanh Cá Nhân", desc: "Dành cho cá nhân tổ chức giải/nhóm nhỏ", price: "199.000đ/năm" },
                      { id: "club", title: "Câu Lạc Bộ Verified", desc: "Dành cho CLB có địa điểm hoạt động", price: "999.000đ/năm" },
                      { id: "organizer", title: "Organizer Verified", desc: "Dành cho Công ty tổ chức sự kiện chuyên nghiệp", price: "2.990.000đ/năm" },
                    ].map((tier) => (
                      <label 
                        key={tier.id}
                        className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedTier === tier.id ? "border-primary bg-primary/5" : "border-border/60 hover:border-border"
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="tier" 
                          value={tier.id} 
                          checked={selectedTier === tier.id} 
                          onChange={(e) => setSelectedTier(e.target.value)}
                          className="sr-only" 
                        />
                        <div className="flex-1">
                          <h3 className="text-[16px] font-bold text-foreground mb-1">{tier.title}</h3>
                          <p className="text-[13px] text-muted-foreground">{tier.desc}</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-[15px] font-extrabold text-primary">{tier.price}</span>
                          <span className="block text-[12px] text-muted-foreground">Chưa gồm ký quỹ</span>
                        </div>
                        {selectedTier === tier.id && (
                          <div className="absolute -top-3 -right-3 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-2">Xác thực CCCD / Passport</h2>
                    <p className="text-[14px] text-muted-foreground">Theo quy định phòng chống lừa đảo, chúng tôi cần xác minh danh tính thật của bạn.</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-border/80 rounded-2xl p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-[14px] font-semibold text-foreground mb-1">Mặt trước CCCD</p>
                      <p className="text-[12px] text-muted-foreground">Chụp rõ nét, không bị lóa</p>
                    </div>
                    
                    <div className="border-2 border-dashed border-border/80 rounded-2xl p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-[14px] font-semibold text-foreground mb-1">Mặt sau CCCD</p>
                      <p className="text-[12px] text-muted-foreground">Chụp rõ nét, không bị lóa</p>
                    </div>
                  </div>

                  <div className="mt-8 border border-border/60 rounded-2xl p-6 bg-secondary/20">
                    <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-muted-foreground" /> 
                      Xác thực khuôn mặt (eKYC)
                    </h3>
                    <div className="bg-black/5 rounded-xl h-48 flex items-center justify-center border border-border">
                      <Button variant="outline" className="bg-white">Mở Camera Xác Thực</Button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Cam kết Điều khoản & Ký quỹ</h2>
                    <p className="text-[14px] text-muted-foreground">Vui lòng đọc kỹ các quy định tổ chức trước khi tiến hành thanh toán.</p>
                  </div>
                  
                  <div className="bg-secondary/30 border border-border/60 rounded-2xl p-6 h-64 overflow-y-auto text-[13px] text-muted-foreground leading-relaxed space-y-4">
                    <h4 className="font-bold text-foreground text-[14px]">1. Trách nhiệm của Ban Tổ Chức (BTC)</h4>
                    <p>Ban Tổ Chức phải đảm bảo sự kiện diễn ra đúng kế hoạch đã đăng ký. Trong trường hợp hủy sự kiện, BTC phải thông báo trước tối thiểu 7 ngày và hoàn trả 100% phí đăng ký cho vận động viên.</p>
                    <h4 className="font-bold text-foreground text-[14px]">2. Quy định về Tiền Ký Quỹ</h4>
                    <p>Tiền ký quỹ sẽ bị giữ (Hold) trong tài khoản của bạn. TopPlay có quyền khấu trừ vào quỹ này nếu phát sinh khiếu nại lừa đảo hoặc vi phạm quy định nền tảng. Khi bạn muốn ngừng hoạt động, quỹ này sẽ được hoàn trả 100% (sau 30 ngày xác minh).</p>
                    <h4 className="font-bold text-foreground text-[14px]">3. Điểm Uy Tín (Trust Score)</h4>
                    <p>Hệ thống tự động chấm điểm uy tín cho tài khoản của bạn. Nếu điểm giảm xuống dưới 40/100, tài khoản sẽ bị tước quyền tổ chức giải và thu hồi Tích xanh.</p>
                  </div>

                  <label className="flex items-start gap-3 p-4 border border-primary/30 bg-primary/5 rounded-xl cursor-pointer mt-6">
                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-primary text-primary focus:ring-primary" />
                    <div>
                      <p className="text-[14px] font-bold text-primary mb-1">Tôi đã đọc và đồng ý</p>
                      <p className="text-[12px] text-primary/80">Với các Điều khoản sử dụng và Chính sách Ký quỹ của TopPlay</p>
                    </div>
                  </label>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Thanh toán Phí Xác Minh & Ký Quỹ</h2>
                    <p className="text-[14px] text-muted-foreground">Quét mã QR qua ứng dụng ngân hàng để hoàn tất.</p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Invoice Info */}
                    <div className="flex-1 bg-secondary/20 p-6 rounded-2xl border border-border/50">
                      <h3 className="text-[15px] font-bold mb-4 border-b pb-3">Chi tiết thanh toán</h3>
                      <div className="space-y-3 text-[14px] mb-6 border-b pb-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gói đăng ký:</span>
                          <span className="font-medium capitalize">{selectedTier} Verified</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phí duy trì (1 năm):</span>
                          <span className="font-medium">{selectedTier === "personal" ? "199.000đ" : selectedTier === "club" ? "999.000đ" : "2.990.000đ"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tiền Ký quỹ (Hoàn trả):</span>
                          <span className="font-medium">{selectedTier === "personal" ? "500.000đ" : selectedTier === "club" ? "1.000.000đ" : "3.000.000đ"}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-foreground">
                        <span className="font-bold">Tổng thanh toán:</span>
                        <span className="text-2xl font-extrabold text-primary">
                          {selectedTier === "personal" ? "699.000đ" : selectedTier === "club" ? "1.999.000đ" : "5.990.000đ"}
                        </span>
                      </div>
                    </div>

                    {/* QR Code Demo */}
                    <div className="w-full md:w-64 text-center shrink-0">
                      <div className="bg-white p-4 rounded-2xl border border-border/60 shadow-sm inline-block mx-auto mb-4">
                        <div className="w-48 h-48 bg-secondary rounded-xl flex items-center justify-center border border-dashed border-border mb-3">
                          <span className="text-muted-foreground text-[13px] font-medium">Mã QR VietQR</span>
                        </div>
                        <p className="text-[14px] font-bold">Vietcombank</p>
                        <p className="text-[12px] text-muted-foreground">Nội dung: TPV_0912345678</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-secondary/30 border-t border-border/50 flex items-center justify-end">
              <Button 
                onClick={handleNext} 
                className="h-12 px-8 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-[15px] flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                {currentStep === 4 ? "Hoàn tất xác minh" : "Tiếp tục"}
                {currentStep < 4 && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </MainContainer>
      </div>
      <Footer />
    </>
  );
}
