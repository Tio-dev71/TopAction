import { Metadata } from "next";
import { CauLacBoClient } from "./CauLacBoClient";

export const metadata: Metadata = {
  title: "Câu lạc bộ | TOPPLAY",
  description: "Khám phá các câu lạc bộ và hội nhóm thể thao",
};

export default function ClubsPage() {
  return <CauLacBoClient />;
}
