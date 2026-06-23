"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface ListParams {
  page: number;
  genre: string;
  sortBy: string;
  year: string;
  query: string;
}

const DEFAULT_SORT = "popularity.desc";

export function useListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasPage = searchParams.has("page");

  const params: ListParams = {
    page: Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1),
    genre: searchParams.get("genre") ?? "",
    sortBy: searchParams.get("sortBy") ?? DEFAULT_SORT,
    year: searchParams.get("year") ?? "",
    query: searchParams.get("q") ?? "",
  };

  // Ensure ?page=1 is always present. `replace` + `scroll:false` means NO new
  // history entry, NO scroll jump, and crucially NO redirect loop — it only
  // runs while the param is genuinely missing.
  useEffect(() => {
    if (!hasPage) {
      const next = new URLSearchParams(searchParams.toString());
      next.set("page", "1");
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }
  }, [hasPage, pathname, router, searchParams]);

  // Update any subset of params in a SINGLE navigation. Changing a filter or the
  // search term resets to page 1; changing the page leaves filters intact.
  const setParams = useCallback(
    (updates: Partial<ListParams>) => {
      const next = new URLSearchParams(searchParams.toString());

      const changesQuery =
        ("genre" in updates && updates.genre !== params.genre) ||
        ("sortBy" in updates && updates.sortBy !== params.sortBy) ||
        ("year" in updates && updates.year !== params.year) ||
        ("query" in updates && updates.query !== params.query);

      const apply = (key: string, value?: string) => {
        if (value === undefined) return;
        if (value === "") next.delete(key);
        else next.set(key, value);
      };

      apply("genre", updates.genre);
      apply("sortBy", updates.sortBy);
      apply("year", updates.year);
      apply("q", updates.query);

      if (updates.page !== undefined) next.set("page", String(updates.page));
      else if (changesQuery) next.set("page", "1");
      if (!next.has("page")) next.set("page", "1");

      // Skip no-op navigations so identical filter emits don't refetch.
      if (next.toString() === searchParams.toString()) return;

      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router, searchParams]
  );

  const goToPage = useCallback((p: number) => setParams({ page: p }), [setParams]);

  return { params, setParams, goToPage };
}