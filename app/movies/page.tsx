"use client";

import { Suspense, useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import { Movie, Genre } from "@/types";
import { discoverMovies, getMovieGenres, searchMovies } from "@/lib/tmdb-server";
import { Search } from "lucide-react";
import { useListParams } from "@/hooks/useListParams";

function MoviesContent() {
  const { params, setParams, goToPage } = useListParams();
  const { page, genre, sortBy, year, query } = params;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  // Genres: load once.
  useEffect(() => {
    getMovieGenres().then(setGenres).catch(console.error);
  }, []);

  // Keep the input in sync when the URL changes (back/forward, shared link).
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // THE ONLY FETCH EFFECT. Source of truth = URL params. Fetches exactly the
  // page in the URL and REPLACES the grid. No appending, no setPage(1) here.
  useEffect(() => {
    let active = true;
    setLoading(true);

    (async () => {
      try {
        const result = query.trim()
          ? await searchMovies(query, page)
          : await discoverMovies({ page, genre, sortBy, year });
        if (!active) return;
        setMovies(result.results);
        // TMDB caps pagination at 500.
        setTotalPages(Math.min(result.total_pages ?? 1, 500));
      } catch (err) {
        if (active) console.error("Error loading movies:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [page, genre, sortBy, year, query]);

  // Debounced search -> writes to URL (resets to page 1 only on real change).
  useEffect(() => {
    if (searchInput === query) return;
    const id = setTimeout(() => setParams({ query: searchInput }), 400);
    return () => clearTimeout(id);
  }, [searchInput, query, setParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Movies</h1>

      <div className="sticky top-16 mb-6 z-10 bg-black/80 backdrop-blur-sm py-4">
        <form onSubmit={(e) => e.preventDefault()} className="mb-6">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Search Movies..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-3 pr-12 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
        {movies.map((movie) => (
          <MovieCard key={movie.id} item={movie} type="movie" />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600" />
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="text-center py-12 text-gray-400">No movies found</div>
      )}

      {!loading && movies.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
      )}
    </div>
  );
}

export default function MoviesPage() {
  // useSearchParams requires a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <MoviesContent />
    </Suspense>
  );
}