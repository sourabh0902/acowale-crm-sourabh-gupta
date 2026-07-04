import Link from "next/link";
import {
  CATEGORY_COLORS,
  getRelativeTime,
  type Feedback,
} from "@/lib/mock-data";
import { truncate } from "@/lib/utils/Truncate";

export default function RecentFeedbackTable({
  feedback,
}: {
  feedback: Feedback[];
}) {
  const now = new Date();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Recent Feedback</p>
        {/* <Link
          href="/dashboard/feedback"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all feedback →
        </Link> */}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-180 text-left">
          <thead>
            <tr>
              <th className="border-b border-gray-200 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                Name
              </th>
              <th className="hidden border-b border-gray-200 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500 md:table-cell">
                Email
              </th>
              <th className="w-36 border-b border-gray-200 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                Category
              </th>
              <th className="border-b border-gray-200 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                Message
              </th>
              <th className="w-24 border-b border-gray-200 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((entry, index) => (
              <tr
                key={entry.id}
                className={`hover:bg-gray-50 ${
                  index !== feedback.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <td className="px-3 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
                  {entry.name}
                </td>
                <td className="hidden px-3 py-3 text-sm text-gray-500 md:table-cell">
                  {entry.email}
                </td>
                <td className="px-3 py-3">
                  <span
                    className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[entry.category]}1a`,
                      color: CATEGORY_COLORS[entry.category],
                    }}
                  >
                    {entry.category}
                  </span>
                </td>
                <td
                  className="px-3 py-3 text-sm whitespace-nowrap text-gray-900"
                  title={entry.message}
                >
                  {truncate(entry.message, 60)}
                </td>
                <td className="px-3 py-3 text-sm whitespace-nowrap text-gray-500">
                  {getRelativeTime(entry.createdAt, now)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
