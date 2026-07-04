import Link from "next/link";
import { Inbox } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <Inbox size={40} className="text-gray-300" />
      <p className="mt-3 text-base font-medium text-gray-900">
        No feedback matches your filters
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your search or clearing filters.
      </p>
      <Link
        href="/dashboard"
        className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Clear filters
      </Link>
    </div>
  );
}
