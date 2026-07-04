"use client";

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  type PieSectorDataItem,
} from "recharts";
import { CATEGORY_COLORS, type FeedbackCategory } from "@/lib/feedback-helpers";

type CategoryChartProps = {
  data: { category: FeedbackCategory; count: number }[];
};

type TooltipPayload = {
  payload: { category: FeedbackCategory; count: number };
};

function ChartTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  total: number;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const { category, count } = payload[0].payload;
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm">
      <p className="font-medium text-gray-900">{category}</p>
      <p className="text-gray-500">
        {count} ({percentage}%)
      </p>
    </div>
  );
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const isEmpty = data.length === 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm font-medium text-gray-700">
        Category Distribution
      </p>

      {isEmpty ? (
        <div className="mt-4 flex h-60 items-center justify-center">
          <p className="text-sm text-gray-400">No data for this filter</p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-6 md:flex-row">
          <div className="h-60 w-full md:flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  shape={(props: PieSectorDataItem) => {
                    const category = (
                      props.payload as { category: FeedbackCategory }
                    ).category;
                    return (
                      <Sector {...props} fill={CATEGORY_COLORS[category]} />
                    );
                  }}
                />
                <Tooltip content={<ChartTooltip total={total} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex w-full flex-col gap-2 md:w-48">
            {data.map((item) => (
              <div key={item.category} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                />
                <span className="text-sm text-gray-600">
                  {item.category} — {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
