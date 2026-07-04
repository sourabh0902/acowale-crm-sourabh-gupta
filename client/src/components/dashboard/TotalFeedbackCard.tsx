import { MessageSquare } from "lucide-react";

export default function TotalFeedbackCard({
  total,
  subline = "All-time submissions",
}: {
  total: number;
  subline?: string;
}) {
  return (
    <div className="relative rounded-lg border border-gray-200 bg-white p-6">
      <MessageSquare
        size={20}
        className="absolute right-6 top-6 text-gray-400"
      />
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Total Feedback
      </p>
      <p className="mt-2 text-4xl font-semibold text-gray-900">{total}</p>
      <p className="mt-1 text-sm text-gray-500">{subline}</p>
    </div>
  );
}
