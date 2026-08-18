import { Metadata } from "next";
import { SanTheThaoClient } from "./SanTheThaoClient";

export const metadata: Metadata = {
  title: "Sân Thể Thao | TOPPLAY",
  description: "Tìm kiếm và đặt sân thể thao nhanh chóng",
};

export default function SanTheThaoPage() {
  return <SanTheThaoClient />;
}
