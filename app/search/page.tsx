"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import { Movie, TVShow } from "@/types";
import { searchMulti } from "@/lib/tmdb-server";
import { Search } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const performSearch = useCallback(
    async (query: string, pageNum: number, reset = false) => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const result = await searchMulti(query, pageNum);
        setResults((prev) =>
          reset ? result.results : [...prev, ...result.results]
        );
        setHasMore(pageNum < result.total_pages);
        setTotalResults(result.total_results);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    performSearch(searchQuery, 1, true);
  }, [searchQuery, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch(searchQuery, nextPage);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold mb-8">Search</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search movies, TV shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 text-white px-4 py-3 pr-12 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </form>

      {searchQuery && (
        <div className="mb-6">
          <p className="text-gray-400">
            Found {totalResults} results for "{searchQuery}"
          </p>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {results.map((item) => {
          const type = "name" in item ? "tv" : "movie";
          return (
            <MovieCard key={`${type}-${item.id}`} item={item} type={type} />
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}

      {/* Load More */}
      {!loading && hasMore && results.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="bg-red-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-red-700 transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* No Results */}
      {!loading && results.length === 0 && searchQuery && (
        <div className="text-center py-12 text-gray-400">
          No results found for "{searchQuery}"
        </div>
      )}

      {!searchQuery && (
        <div className="text-center py-12 text-gray-400">
          Enter a search query to get started
        </div>
      )}
    </div>
  );
}
