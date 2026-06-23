"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const DOTS = "...";
const range = (start: number, end: number) =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i);

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const pages = useMemo<(number | string)[]>(() => {
    const total = siblingCount * 2 + 5;
    if (total >= totalPages) return range(1, totalPages);

    const left = Math.max(page - siblingCount, 1);
    const right = Math.min(page + siblingCount, totalPages);
    const showLeftDots = left > 2;
    const showRightDots = right < totalPages - 1;

    if (!showLeftDots && showRightDots)
      return [...range(1, 3 + 2 * siblingCount), DOTS, totalPages];
    if (showLeftDots && !showRightDots)
      return [1, DOTS, ...range(totalPages - (2 + 2 * siblingCount), totalPages)];
    return [1, DOTS, ...range(left, right), DOTS, totalPages];
  }, [page, totalPages, siblingCount]);

  if (totalPages <= 1) return null;

  const btn =
    "min-w-[40px] px-3 py-2 rounded-md font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={`${btn} bg-gray-900 text-white hover:bg-gray-800 flex items-center`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, idx) =>
        p === DOTS ? (
          <span key={`dots-${idx}`} className="px-3 py-2 text-gray-500 select-none">
            {DOTS}
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            aria-current={p === page ? "page" : undefined}
            className={`${btn} ${
              p === page
                ? "bg-red-600 text-white"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={`${btn} bg-gray-900 text-white hover:bg-gray-800 flex items-center`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}