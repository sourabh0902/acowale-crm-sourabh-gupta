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

export type DashboardData = {
  total: number;
  byCategory: { category: FeedbackCategory; count: number }[];
  recent: Feedback[]; // sorted newest first, all 10 entries
};

export const CATEGORY_COLORS: Record<FeedbackCategory, string> = {
  Product: "#3b82f6",
  Support: "#10b981",
  Billing: "#f59e0b",
  "Feature Request": "#8b5cf6",
  "UI/UX": "#ec4899",
  Other: "#6b7280",
};

const FEEDBACK_ENTRIES: Feedback[] = [
  {
    id: "feedback-01",
    name: "Ananya Sharma",
    email: "ananya.sharma@gmail.com",
    category: "Product",
    message:
      "The new dashboard layout is so much cleaner than before. Really happy with how quickly I can find what I need now.",
    createdAt: "2026-07-04T06:15:00.000Z",
  },
  {
    id: "feedback-02",
    name: "Marcus Chen",
    email: "marcus.chen@outlook.com",
    category: "Support",
    message:
      "Reached out twice this week and still no response from the support team. This is getting frustrating for a paid plan.",
    createdAt: "2026-07-03T18:40:00.000Z",
  },
  {
    id: "feedback-03",
    name: "Priya Patel",
    email: "priya.patel@yahoo.com",
    category: "Feature Request",
    message:
      "Would love to see a dark mode option added soon. My eyes would really thank you during late night work sessions.",
    createdAt: "2026-07-02T21:05:00.000Z",
  },
  {
    id: "feedback-04",
    name: "James O'Connor",
    email: "j.oconnor@protonmail.com",
    category: "Billing",
    message:
      "Got charged twice for the same invoice this month. Please look into this and issue a refund for the duplicate charge.",
    createdAt: "2026-07-02T09:22:00.000Z",
  },
  {
    id: "feedback-05",
    name: "Rohan Mehta",
    email: "rohan.mehta@rediffmail.com",
    category: "UI/UX",
    message:
      "The mobile navigation feels a bit cramped on smaller screens. A bigger tap target for the menu icon would help a lot.",
    createdAt: "2026-06-30T14:50:00.000Z",
  },
  {
    id: "feedback-06",
    name: "Sofia Rossi",
    email: "sofia.rossi@icloud.com",
    category: "Product",
    message:
      "Been using this for three months now and it has genuinely simplified how our team tracks customer requests. Great work.",
    createdAt: "2026-06-29T11:10:00.000Z",
  },
  {
    id: "feedback-07",
    name: "Karan Verma",
    email: "karan.verma@gmail.com",
    category: "Feature Request",
    message:
      "It would be great to export feedback data as a CSV for our internal reports. Right now we're manually copying rows.",
    createdAt: "2026-06-27T08:35:00.000Z",
  },
  {
    id: "feedback-08",
    name: "Emily Watson",
    email: "emily.watson@hotmail.com",
    category: "Support",
    message:
      "Support resolved my login issue within an hour and were very polite throughout. Appreciate the quick turnaround.",
    createdAt: "2026-06-25T16:00:00.000Z",
  },
  {
    id: "feedback-09",
    name: "Aditya Nair",
    email: "aditya.nair@gmail.com",
    category: "Product",
    message:
      "The recent update seems to have slowed down page loads noticeably on my end. Worth checking if this is a wider issue.",
    createdAt: "2026-06-23T12:45:00.000Z",
  },
  {
    id: "feedback-10",
    name: "Liam Anderson",
    email: "liam.anderson@yahoo.com",
    category: "Other",
    message:
      "Not really a complaint, just wanted to say the onboarding emails were genuinely helpful in getting started quickly.",
    createdAt: "2026-06-20T10:30:00.000Z",
  },
];

const CATEGORY_ORDER: FeedbackCategory[] = [
  "Product",
  "Support",
  "Billing",
  "Feature Request",
  "UI/UX",
  "Other",
];

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

export function getMockDashboardData(): DashboardData {
  const recent = [...FEEDBACK_ENTRIES].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const counts = new Map<FeedbackCategory, number>();
  for (const entry of recent) {
    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
  }

  const byCategory = CATEGORY_ORDER.filter((category) =>
    counts.has(category)
  ).map((category) => ({
    category,
    count: counts.get(category) as number,
  }));

  return {
    total: recent.length,
    byCategory,
    recent,
  };
}
