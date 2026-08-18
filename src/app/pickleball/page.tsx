import { Metadata } from "next";
import { PickleballClient } from "./PickleballClient";

export const metadata: Metadata = {
  title: "Pickleball | TOPPLAY",
  description: "Cộng đồng, giải đấu và sân tập Pickleball",
};

export default function PickleballPage() {
  return <PickleballClient />;
}
