'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import TotalFeedbackCard from '@/components/dashboard/TotalFeedbackCard';
import CategoryChart from '@/components/dashboard/CategoryChart';
import RecentFeedbackTable from '@/components/dashboard/RecentFeedbackTable';
import FilterBar from '@/components/dashboard/FilterBar';
import {
  FEEDBACK_CATEGORIES,
  RANGE_LABELS,
  type Feedback,
  type FeedbackCategory,
  type FeedbackRange,
} from '@/lib/feedback-helpers';

type RawFeedback = {
  _id: string;
  name: string;
  email?: string;
  category: FeedbackCategory;
  message: string;
  createdAt: string;
};

function mapFeedback(raw: RawFeedback[]): Feedback[] {
  return raw.map(({ _id, email, ...rest }) => ({
    ...rest,
    id: _id,
    email: email ?? '',
  }));
}

function computeCategoryDistribution(feedback: Feedback[]) {
  const counts = new Map<FeedbackCategory, number>();
  for (const entry of feedback) {
    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
  }
  return FEEDBACK_CATEGORIES.filter((cat) => counts.has(cat)).map((cat) => ({
    category: cat,
    count: counts.get(cat) as number,
  }));
}

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const range = searchParams.get('range');
  const search = searchParams.get('search');

  const [authed, setAuthed] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Auth gate — redirect before rendering anything if no token.
  // Resolving auth on mount is a synchronous setState (intentional: decide
  // immediately whether to render or redirect), which the react-hooks rule
  // flags as an error — this repo's Next lint config would fail the build.
  useEffect(() => {
    if (isLoggedIn()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthed(true);
    } else {
      setAuthed(false);
      router.replace('/login?reason=auth');
    }
  }, [router]);

  // Single fetch — all three params go to the backend together.
  // Response drives card + chart + table. One data path, no splits.
  const fetchFeedback = useCallback(async () => {
    setIsLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (range && range !== 'all') params.set('range', range);
    if (search && search.trim() !== '') params.set('search', search.trim());

    const query = params.toString();
    const path = query ? `/feedback?${query}` : '/feedback';

    const res = await api<RawFeedback[]>(path, { auth: true });

    if (!res.ok) {
      setError(res.error);
      setIsLoading(false);
      return;
    }

    setFeedback(mapFeedback(res.data));
    setIsLoading(false);
  }, [category, range, search]);

  useEffect(() => {
    if (!authed) return;
    // fetchFeedback flips isLoading synchronously; that eager loading state is
    // intentional (spinner on every fetch, including filter changes), so the
    // rule is disabled — otherwise this repo's Next lint config fails the build.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFeedback();
  }, [authed, fetchFeedback]);

  const byCategory = computeCategoryDistribution(feedback);

  const sublineParts: string[] = [];
  if (category && category !== 'all') sublineParts.push(category);
  sublineParts.push(RANGE_LABELS[range as FeedbackRange] ?? 'All time');
  const subline = sublineParts.join(' · ');

  if (!authed) return null;

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

      <RecentFeedbackTable feedback={feedback} />
    </div>
  );
}
