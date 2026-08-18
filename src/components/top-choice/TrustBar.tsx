import { ShieldCheck, CheckCircle2, Clock, Users } from "lucide-react";

export function TrustBar() {
  const trusts = [
    { icon: ShieldCheck, title: "Đánh giá minh bạch", desc: "Dữ liệu thật 100%" },
    { icon: CheckCircle2, title: "Kiểm duyệt nghiêm ngặt", desc: "Đảm bảo chất lượng" },
    { icon: Clock, title: "Cập nhật định kỳ", desc: "Đánh giá liên tục" },
    { icon: Users, title: "Cộng đồng tin cậy", desc: "Hơn 50.000 người chơi" },
  ];

  return (
    <div className="w-full bg-[#0A1A3B] py-12 mt-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trusts.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-yellow-400 mb-4 shadow-sm">
                 <item.icon className="w-6 h-6" />
               </div>
               <h4 className="text-[15px] font-bold text-white mb-1">{item.title}</h4>
               <p className="text-[13px] text-white/60 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
