import { Metadata } from "next";
import { EventsClient } from "./EventsClient";

export const metadata: Metadata = {
  title: "Sự Kiện | TOPPLAY",
  description: "Khám phá các sự kiện thể thao nổi bật trên Topplay",
};

export default function EventsPage() {
  return <EventsClient />;
}
