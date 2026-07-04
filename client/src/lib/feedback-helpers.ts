export type FeedbackCategory =
  | "Product"
  | "Support"
  | "Billing"
  | "Feature Request"
  | "UI/UX"
  | "Other";

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
