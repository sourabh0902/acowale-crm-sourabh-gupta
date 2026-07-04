"use client";

import { useSearchParams } from "next/navigation";
import TotalFeedbackCard from "@/components/dashboard/TotalFeedbackCard";
import CategoryChart from "@/components/dashboard/CategoryChart";
import RecentFeedbackTable from "@/components/dashboard/RecentFeedbackTable";
import FilterBar from "@/components/dashboard/FilterBar";
import type { Feedback, FeedbackCategory } from "@/lib/mock-data";

const CATEGORY_ORDER: FeedbackCategory[] = [
  "Product",
  "Support",
  "Billing",
  "Feature Request",
  "UI/UX",
  "Other",
];

const RANGE_LABELS: Record<string, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  all: "All time",
};

function matchesDateRange(createdAt: string, range: string | null): boolean {
  if (!range || range === "all") return true;
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const days = range === "7d" ? 7 : range === "30d" ? 30 : Infinity;
  return now - created <= days * 24 * 60 * 60 * 1000;
}

function computeCategoryDistribution(feedback: Feedback[]) {
  const counts = new Map<FeedbackCategory, number>();
  for (const entry of feedback) {
    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
  }
  return CATEGORY_ORDER.filter((category) => counts.has(category)).map(
    (category) => ({
      category,
      count: counts.get(category) as number,
    })
  );
}

export default function DashboardClient({
  feedback,
}: {
  feedback: Feedback[];
}) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const range = searchParams.get("range");
  const search = searchParams.get("search");

  const filteredByScope = feedback.filter((f) => {
    const categoryMatch = !category || category === "all" || f.category === category;
    const dateMatch = matchesDateRange(f.createdAt, range);
    return categoryMatch && dateMatch;
  });

  const searchedForTable = filteredByScope.filter((f) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.email.toLowerCase().includes(q) ||
      f.message.toLowerCase().includes(q)
    );
  });

  const byCategory = computeCategoryDistribution(filteredByScope);

  const sublineParts: string[] = [];
  if (category && category !== "all") sublineParts.push(category);
  sublineParts.push(RANGE_LABELS[range ?? "all"] ?? "All time");
  const subline = sublineParts.join(" · ");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Summary of customer feedback received.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TotalFeedbackCard total={filteredByScope.length} subline={subline} />
        <div className="lg:col-span-2">
          <CategoryChart data={byCategory} />
        </div>
      </div>

      <FilterBar />

      <RecentFeedbackTable feedback={searchedForTable} />
    </div>
  );
}
