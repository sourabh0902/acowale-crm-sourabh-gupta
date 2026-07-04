"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import TotalFeedbackCard from "@/components/dashboard/TotalFeedbackCard";
import CategoryChart from "@/components/dashboard/CategoryChart";
import RecentFeedbackTable from "@/components/dashboard/RecentFeedbackTable";
import FilterBar from "@/components/dashboard/FilterBar";
import type { Feedback, FeedbackCategory } from "@/lib/feedback-helpers";

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

function computeCategoryDistribution(feedback: Feedback[]) {
  const counts = new Map<FeedbackCategory, number>();
  for (const entry of feedback) {
    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
  }
  return CATEGORY_ORDER.filter((cat) => counts.has(cat)).map((cat) => ({
    category: cat,
    count: counts.get(cat) as number,
  }));
}

// The raw feedback shape as it comes back from the backend (MongoDB).
type RawFeedback = {
  _id: string;
  name: string;
  email?: string; // optional — the backend omits it when no email was given
  category: FeedbackCategory;
  message: string;
  createdAt: string;
};

// Only two fields actually differ from the frontend Feedback type: _id -> id,
// and a missing email becomes "". Everything else passes straight through.
function mapFeedback(raw: RawFeedback[]): Feedback[] {
  return raw.map(({ _id, email, ...rest }) => ({
    ...rest,
    id: _id,
    email: email ?? "",
  }));
}

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const range = searchParams.get("range");
  const search = searchParams.get("search");

  // Auth gate: null = not yet checked (localStorage is client-only, so we can't
  // know on the server render), false = no token (redirecting), true = allowed.
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Check for a token on mount before rendering anything or hitting the API.
  // This avoids the flash-of-dashboard-then-401-redirect for logged-out users.
  useEffect(() => {
    // Resolving auth on mount is a synchronous setState, which the react-hooks
    // rule flags; that's the intended behavior here (decide immediately whether
    // to render or redirect), so the rule is disabled for this effect.
    if (isLoggedIn()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthed(true);
    } else {
      setAuthed(false);
      // reason=auth lets the login page explain why the user was redirected.
      router.replace("/login?reason=auth");
    }
  }, [router]);

  // Fetch feedback whenever category or range changes.
  // Search is still client-side (filters the already-fetched array).
  const fetchFeedback = useCallback(async () => {
    setIsLoading(true);
    setError("");

    // Build query params that the backend understands
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    if (range && range !== "all") params.set("range", range);

    const query = params.toString();
    const path = query ? `/feedback?${query}` : "/feedback";

    const res = await api<RawFeedback[]>(path, { auth: true });

    if (!res.ok) {
      setError(res.error);
      setIsLoading(false);
      return;
    }

    setFeedback(mapFeedback(res.data));
    setIsLoading(false);
  }, [category, range]);

  useEffect(() => {
    // Only fetch once we've confirmed a token exists.
    if (!authed) return;
    // fetchFeedback flips isLoading synchronously, which the react-hooks rule
    // flags; that eager loading state is intentional here (spinner on every
    // fetch, including filter changes), so the rule is disabled for this call.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFeedback();
  }, [authed, fetchFeedback]);

  // Search is client-side only — filters the already-fetched feedback
  const searchedForTable = feedback.filter((f) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.email.toLowerCase().includes(q) ||
      f.message.toLowerCase().includes(q)
    );
  });

  const byCategory = computeCategoryDistribution(feedback);

  const sublineParts: string[] = [];
  if (category && category !== "all") sublineParts.push(category);
  sublineParts.push(RANGE_LABELS[range ?? "all"] ?? "All time");
  const subline = sublineParts.join(" · ");

  // Not authenticated (still checking, or redirecting to /login) — render
  // nothing so the dashboard never flashes for a logged-out user.
  if (!authed) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <svg
            className="mx-auto h-8 w-8 animate-spin text-blue-600"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="mt-3 text-sm text-gray-500">Loading feedback...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">{error}</p>
        <button
          onClick={fetchFeedback}
          className="mt-3 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Summary of customer feedback received.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TotalFeedbackCard total={feedback.length} subline={subline} />
        <div className="lg:col-span-2">
          <CategoryChart data={byCategory} />
        </div>
      </div>

      <FilterBar />

      <RecentFeedbackTable feedback={searchedForTable} />
    </div>
  );
}
