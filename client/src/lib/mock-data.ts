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

const FEEDBACK_ENTRIES: Feedback[] = [
  // Last 7 days
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
    createdAt: "2026-06-28T08:35:00.000Z",
  },
  {
    id: "feedback-08",
    name: "Emily Watson",
    email: "emily.watson@hotmail.com",
    category: "Support",
    message:
      "Support resolved my login issue within an hour and were very polite throughout. Appreciate the quick turnaround.",
    createdAt: "2026-06-28T02:00:00.000Z",
  },

  // 7-30 days ago
  {
    id: "feedback-09",
    name: "Aditya Nair",
    email: "aditya.nair@gmail.com",
    category: "Product",
    message:
      "The recent update seems to have slowed down page loads noticeably on my end. Worth checking if this is a wider issue.",
    createdAt: "2026-06-25T12:45:00.000Z",
  },
  {
    id: "feedback-10",
    name: "Liam Anderson",
    email: "liam.anderson@yahoo.com",
    category: "Other",
    message:
      "Not really a complaint, just wanted to say the onboarding emails were genuinely helpful in getting started quickly.",
    createdAt: "2026-06-23T10:30:00.000Z",
  },
  {
    id: "feedback-11",
    name: "Neha Joshi",
    email: "neha.joshi@gmail.com",
    category: "UI/UX",
    message:
      "The color contrast on the settings page text is quite low and hard to read in bright light. Please consider darkening it.",
    createdAt: "2026-06-21T15:20:00.000Z",
  },
  {
    id: "feedback-12",
    name: "David Kim",
    email: "david.kim@gmail.com",
    category: "Billing",
    message:
      "Billing history only shows the last three invoices. It would help to have access to a full downloadable history.",
    createdAt: "2026-06-20T09:00:00.000Z",
  },
  {
    id: "feedback-13",
    name: "Ishaan Kapoor",
    email: "ishaan.kapoor@outlook.com",
    category: "Product",
    message:
      "Overall a solid product. The search feature especially has saved our team a lot of time compared to our old tool.",
    createdAt: "2026-06-19T13:10:00.000Z",
  },
  {
    id: "feedback-14",
    name: "Grace Miller",
    email: "grace.miller@icloud.com",
    category: "Feature Request",
    message:
      "Could you add Slack integration for new feedback notifications? Would remove the need to check the dashboard constantly.",
    createdAt: "2026-06-18T07:50:00.000Z",
  },
  {
    id: "feedback-15",
    name: "Vikram Singh",
    email: "vikram.singh@rediffmail.com",
    category: "Support",
    message:
      "The live chat widget disappeared after the last update on our end. Had to email support instead which took longer.",
    createdAt: "2026-06-17T19:35:00.000Z",
  },
  {
    id: "feedback-16",
    name: "Chloe Dubois",
    email: "chloe.dubois@gmail.com",
    category: "Product",
    message:
      "Really impressed with how stable everything has been lately. No crashes or weird bugs in the past few weeks at all.",
    createdAt: "2026-06-16T06:25:00.000Z",
  },
  {
    id: "feedback-17",
    name: "Arjun Reddy",
    email: "arjun.reddy@gmail.com",
    category: "UI/UX",
    message:
      "The category dropdown is a little too small to tap accurately on my phone. Increasing the height slightly would help.",
    createdAt: "2026-06-15T11:00:00.000Z",
  },
  {
    id: "feedback-18",
    name: "Olivia Bennett",
    email: "olivia.bennett@yahoo.com",
    category: "Other",
    message:
      "Just wanted to say thanks for such a responsive team. Every question I've had has been answered same day.",
    createdAt: "2026-06-14T14:15:00.000Z",
  },
  {
    id: "feedback-19",
    name: "Rahul Iyer",
    email: "rahul.iyer@gmail.com",
    category: "Feature Request",
    message:
      "A bulk delete option for old feedback entries would be really useful once the dataset starts growing large.",
    createdAt: "2026-06-13T09:45:00.000Z",
  },
  {
    id: "feedback-20",
    name: "Hannah Schmidt",
    email: "hannah.schmidt@gmail.com",
    category: "Product",
    message:
      "The analytics view answers most of what we need, but a way to compare two time periods side by side would be great.",
    createdAt: "2026-06-12T17:30:00.000Z",
  },
  {
    id: "feedback-21",
    name: "Sanjay Gupta",
    email: "sanjay.gupta@outlook.com",
    category: "Billing",
    message:
      "The upgrade flow was confusing — I ended up on a higher tier than intended and had to contact support to downgrade.",
    createdAt: "2026-06-11T08:10:00.000Z",
  },

  // 30-60 days ago
  {
    id: "feedback-22",
    name: "Isabella Romano",
    email: "isabella.romano@icloud.com",
    category: "Support",
    message:
      "Support was helpful but it took nearly two days to get a first reply. Hoping response times improve going forward.",
    createdAt: "2026-06-05T12:00:00.000Z",
  },
  {
    id: "feedback-23",
    name: "Aman Bhatt",
    email: "aman.bhatt@gmail.com",
    category: "Product",
    message:
      "Loving the recent redesign. It feels a lot more modern and the icons are much easier to understand at a glance.",
    createdAt: "2026-06-03T10:40:00.000Z",
  },
  {
    id: "feedback-24",
    name: "Ethan Walker",
    email: "ethan.walker@gmail.com",
    category: "UI/UX",
    message:
      "The font size in the table felt slightly too small on my laptop. A minor tweak would make it easier on the eyes.",
    createdAt: "2026-06-01T16:20:00.000Z",
  },
  {
    id: "feedback-25",
    name: "Divya Krishnan",
    email: "divya.krishnan@gmail.com",
    category: "Feature Request",
    message:
      "Would be great to tag feedback entries with priority levels so the team can triage the most urgent ones first.",
    createdAt: "2026-05-29T09:05:00.000Z",
  },
  {
    id: "feedback-26",
    name: "Noah Fischer",
    email: "noah.fischer@outlook.com",
    category: "Other",
    message:
      "No real issues to report, just exploring the product for a potential company-wide rollout next quarter.",
    createdAt: "2026-05-27T13:50:00.000Z",
  },
  {
    id: "feedback-27",
    name: "Meera Pillai",
    email: "meera.pillai@yahoo.com",
    category: "Product",
    message:
      "The notification settings reset after every login. Would be nice if my preferences actually stayed saved.",
    createdAt: "2026-05-24T07:15:00.000Z",
  },
  {
    id: "feedback-28",
    name: "Lucas Silva",
    email: "lucas.silva@gmail.com",
    category: "Billing",
    message:
      "Really appreciate the transparent pricing page. No hidden fees like some competitors we evaluated before this.",
    createdAt: "2026-05-21T15:30:00.000Z",
  },
  {
    id: "feedback-29",
    name: "Tanvi Deshpande",
    email: "tanvi.deshpande@gmail.com",
    category: "Support",
    message:
      "Had a great experience with support this week — they walked me through the whole setup process patiently.",
    createdAt: "2026-05-18T11:45:00.000Z",
  },
  {
    id: "feedback-30",
    name: "Benjamin Clarke",
    email: "benjamin.clarke@icloud.com",
    category: "Feature Request",
    message:
      "An API for programmatically submitting feedback from our own app would be a huge unlock for our workflow.",
    createdAt: "2026-05-15T08:25:00.000Z",
  },
  {
    id: "feedback-31",
    name: "Fatima Ali",
    email: "fatima.ali@outlook.com",
    category: "Product",
    message:
      "The product has held up really well under heavier usage than we initially expected. Solid performance overall.",
    createdAt: "2026-05-12T18:00:00.000Z",
  },
  {
    id: "feedback-32",
    name: "Oscar Nilsson",
    email: "oscar.nilsson@gmail.com",
    category: "UI/UX",
    message:
      "The empty states across the app feel a bit bare. Some illustrations or clearer next steps would improve onboarding.",
    createdAt: "2026-05-10T10:15:00.000Z",
  },
  {
    id: "feedback-33",
    name: "Kavya Menon",
    email: "kavya.menon@gmail.com",
    category: "Other",
    message:
      "Curious if there are any plans for a native mobile app rather than just the responsive web version currently offered.",
    createdAt: "2026-05-08T14:40:00.000Z",
  },
  {
    id: "feedback-34",
    name: "William Turner",
    email: "william.turner@yahoo.com",
    category: "Support",
    message:
      "Support pointed me to documentation that was outdated and didn't match the current UI. Might be worth a refresh.",
    createdAt: "2026-05-06T09:20:00.000Z",
  },
  {
    id: "feedback-35",
    name: "Simran Kaur",
    email: "simran.kaur@gmail.com",
    category: "Product",
    message:
      "Been a daily user for two months now and it has become an essential part of our team's weekly review process.",
    createdAt: "2026-05-05T12:55:00.000Z",
  },
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

export function getAllMockFeedback(): Feedback[] {
  return [...FEEDBACK_ENTRIES].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
