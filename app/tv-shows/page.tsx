"use client";

import { Suspense, useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import { TVShow, Genre } from "@/types";
import { discoverTVShows, getTVGenres, searchTVShows } from "@/lib/tmdb-server";
import { FaSearch } from "react-icons/fa";
import { useListParams } from "@/hooks/useListParams";

function TVShowsContent() {
  const { params, setParams, goToPage } = useListParams();
  const { page, genre, sortBy, year, query } = params;

  const [shows, setShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    getTVGenres().then(setGenres).catch(console.error);
  }, []);

  useEffect(() => {
    
    setSearchInput(query);
  }, [query]);

  // Single fetch effect driven entirely by the URL params.
  useEffect(() => {
   
    let active = true;
    setLoading(true);

    (async () => {
      try {
        const result = query.trim()
          ? await searchTVShows(query, page)
          : await discoverTVShows({ page, genre, sortBy, year });
        if (!active) return;
   
        setShows(result.results);
        setTotalPages(Math.min(result.total_pages ?? 1, 500));
      } catch (err) {
        if (active) console.error("Error loading TV shows:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [page, genre, sortBy, year, query]);

  useEffect(() => {

    console.log(query)
    if (searchInput === query) return;
    const id = setTimeout(() => setParams({ query: searchInput }), 1500);
    return () => clearTimeout(id);
  }, [searchInput, query, setParams]);



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">TV Shows</h1>

      <div className="sticky top-16 mb-6 z-10 bg-black/80 backdrop-blur-sm py-4">
        <form onSubmit={(e) => e.preventDefault()} className="mb-6">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Search TV shows..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-3 pr-12 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </form>

        <Filters
          genres={genres}
          value={{ genre, sortBy, year }}
          onFilterChange={(f) =>
            setParams({ genre: f.genre, sortBy: f.sortBy, year: f.year })
          }
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {shows.map((show) => (
          <MovieCard key={show.id} item={show} type="tv" />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600" />
        </div>
      )}

      {!loading && shows.length === 0 && (
        <div className="text-center py-12 text-gray-400">No TV shows found</div>
      )}

      {!loading && shows.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
      )}
    </div>
  );
}

export default function TVShowsPage() {
  return (
    <Suspense fallback={null}>
      <TVShowsContent />
    </Suspense>
  );
}