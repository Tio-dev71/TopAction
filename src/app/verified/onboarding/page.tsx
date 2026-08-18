import { Suspense } from "react";
import { OnboardingClient } from "./OnboardingClient";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <OnboardingClient />
    </Suspense>
  );
}
