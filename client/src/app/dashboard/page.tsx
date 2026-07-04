import { getMockDashboardData } from "@/lib/mock-data";
import TotalFeedbackCard from "@/components/dashboard/TotalFeedbackCard";
import CategoryChart from "@/components/dashboard/CategoryChart";
import RecentFeedbackTable from "@/components/dashboard/RecentFeedbackTable";

export default function DashboardPage() {
  const data = getMockDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Summary of customer feedback received.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TotalFeedbackCard total={data.total} />
        <div className="lg:col-span-2">
          <CategoryChart data={data.byCategory} />
        </div>
      </div>

      <RecentFeedbackTable feedback={data.recent} />
    </div>
  );
}
