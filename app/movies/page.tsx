"use client";

import { useState, useEffect, useCallback } from "react";
import MovieCard from "@/components/MovieCard";
import Filters from "@/components/Filters";
import { Movie, Genre } from "@/types";
import { discoverMovies, getMovieGenres, searchMovies } from "@/lib/tmdb-server";
import { Search } from "lucide-react";
import { generateShortUUID } from "@/lib/uuid-generator";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    genre: "",
    sortBy: "popularity.desc",
    year: "",
  });

  useEffect(() => {
    const loadGenres = async () => {
      const data = await getMovieGenres();
      setGenres(data);
    };
    loadGenres();
  }, []);

  const loadMovies = useCallback(
    async (pageNum: number, reset = false) => {
      setLoading(true);
      try {
        let result;

        if (searchQuery.trim()) {
          result = await searchMovies(searchQuery, pageNum);
        } else {
          result = await discoverMovies({
            page: pageNum,
            genre: filters.genre,
            sortBy: filters.sortBy,
            year: filters.year,
          });
        }

        setMovies((prev) =>
          reset ? result.results : [...prev, ...result.results]
        );
        setHasMore(pageNum < result.total_pages);
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters, searchQuery]
  );

  useEffect(() => {
    setPage(1);
    loadMovies(1, true);
  }, [filters, searchQuery, loadMovies]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadMovies(nextPage);
  };

  return (
    <div className=" container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Movies</h1>

      <div className=" sticky top-16 mb-6 z-10 bg-black/80 backdrop-blur-sm py-4">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Search Movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-3 pr-12 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </form>

        {/* Filters */}
        <Filters genres={genres} onFilterChange={setFilters} />
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={`${movie.id}${generateShortUUID()}`} item={movie} type="movie" />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}

      {/* Load More */}
      {!loading && hasMore && movies.length > 0 && (
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
      {!loading && movies.length === 0 && (
        <div className="text-center py-12 text-gray-400">No movies found</div>
      )}
    </div>
  );
}
