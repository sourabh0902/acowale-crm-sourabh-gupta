import { Suspense } from "react";
import { getAllMockFeedback } from "@/lib/mock-data";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default function DashboardPage() {
  const feedback = getAllMockFeedback();
  return (
    <Suspense fallback={null}>
      <DashboardClient feedback={feedback} />
    </Suspense>
  );
}
