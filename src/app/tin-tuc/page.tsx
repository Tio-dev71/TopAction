import { Metadata } from "next";
import { TinTucClient } from "./TinTucClient";

export const metadata: Metadata = {
  title: "Tin Tức | TOPPLAY",
  description: "Cập nhật tin tức thể thao mới nhất",
};

export default function TinTucPage() {
  return <TinTucClient />;
}
