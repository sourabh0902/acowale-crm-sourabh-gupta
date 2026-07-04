// The single source of truth for feedback categories. Order matters — it's the
// display order in the filter dropdowns, the submit form, and the chart legend.
// The FeedbackCategory type is derived from this array so the two can never
// drift apart (mirrors the backend's FEEDBACK_CATEGORIES in server/src/models/Feedback.ts).
export const FEEDBACK_CATEGORIES = [
  "Product",
  "Support",
  "Billing",
  "Feature Request",
  "UI/UX",
  "Other",
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

// Date-range filter values (the `range` query param) and their display labels.
export type FeedbackRange = "7d" | "30d" | "all";

export const RANGE_LABELS: Record<FeedbackRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  all: "All time",
};

export type Feedback = {
  id: string;
  name: string;
  email: string;
  category: FeedbackCategory;
  message: string;
  createdAt: string; // ISO string
};

export const CATEGORY_COLORS: Record<FeedbackCategory, string> = {
  Product: "#3b82f6",
  Support: "#10b981",
  Billing: "#f59e0b",
  "Feature Request": "#8b5cf6",
  "UI/UX": "#ec4899",
  Other: "#6b7280",
};

export function getRelativeTime(isoDate: string, now: Date): string {
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays <= 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
