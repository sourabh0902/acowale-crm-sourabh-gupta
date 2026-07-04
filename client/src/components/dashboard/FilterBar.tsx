"use client";

import { useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { debounce } from "@/lib/debounce";
import { FEEDBACK_CATEGORIES } from "@/lib/feedback-helpers";

const SEARCH_DEBOUNCE_MS = 300;

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "all";
  const range = searchParams.get("range") ?? "all";
  const urlSearch = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(urlSearch);

  function updateParam(key: string, value: string, base: URLSearchParams) {
    const params = new URLSearchParams(base.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  // debounce() is created once; it always receives the current
  // searchParams as an argument at call time, so it never reads stale state.
  const debouncedSearchUpdate = useRef(
    debounce((value: string, currentParams: URLSearchParams) => {
      updateParam("search", value, currentParams);
    }, SEARCH_DEBOUNCE_MS)
  ).current;

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearchUpdate(value, searchParams);
  }

  const hasActiveFilters = useMemo(
    () => category !== "all" || range !== "all" || urlSearch !== "",
    [category, range, urlSearch]
  );

  function handleClear() {
    setSearchInput("");
    router.replace(pathname);
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative flex-1 md:max-w-96">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search name, email, or message…"
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={category}
          onChange={(e) => updateParam("category", e.target.value, searchParams)}
          className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        >
          <option value="all">All categories</option>
          {FEEDBACK_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={range}
          onChange={(e) => updateParam("range", e.target.value, searchParams)}
          className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        >
          <option value="all">All time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
