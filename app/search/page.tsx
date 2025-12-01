'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import { Movie, TVShow } from '@/types';
import { searchMovies, searchTVShows } from '@/lib/tmdb';
import { Search } from 'lucide-react';

type FilterType = 'all' | 'movies' | 'tv';

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(queryParam);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(false);
  const [moviesPage, setMoviesPage] = useState(1);
  const [tvPage, setTvPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [hasMoreTV, setHasMoreTV] = useState(true);

  const performSearch = useCallback(async (searchQuery: string, reset = false) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setTvShows([]);
      return;
    }

    setLoading(true);
    try {
      const moviePage = reset ? 1 : moviesPage;
      const tvShowPage = reset ? 1 : tvPage;

      if (activeFilter === 'all' || activeFilter === 'movies') {
        const movieResults = await searchMovies(searchQuery, moviePage);
        setMovies(prev => reset ? movieResults.results : [...prev, ...movieResults.results]);
        setHasMoreMovies(moviePage < movieResults.total_pages);
        if (reset) setMoviesPage(1);
      }

      if (activeFilter === 'all' || activeFilter === 'tv') {
        const tvResults = await searchTVShows(searchQuery, tvShowPage);
        setTvShows(prev => reset ? tvResults.results : [...prev, ...tvResults.results]);
        setHasMoreTV(tvShowPage < tvResults.total_pages);
        if (reset) setTvPage(1);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, moviesPage, tvPage]);

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      performSearch(queryParam, true);
    }
  }, [queryParam, activeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query, true);
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setMovies([]);
    setTvShows([]);
    setMoviesPage(1);
    setTvPage(1);
    if (query.trim()) {
      performSearch(query, true);
    }
  };

  const loadMoreMovies = () => {
    const nextPage = moviesPage + 1;
    setMoviesPage(nextPage);
    performSearch(query, false);
  };

  const loadMoreTV = () => {
    const nextPage = tvPage + 1;
    setTvPage(nextPage);
    performSearch(query, false);
  };

  const showMovies = activeFilter === 'all' || activeFilter === 'movies';
  const showTV = activeFilter === 'all' || activeFilter === 'tv';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Search</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search for movies, TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-900 text-white px-6 py-4 pr-14 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
            <Search className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-800">
        <button
          onClick={() => handleFilterChange('all')}
          className={`pb-4 px-4 font-semibold transition border-b-2 ${
            activeFilter === 'all'
              ? 'border-red-600 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange('movies')}
          className={`pb-4 px-4 font-semibold transition border-b-2 ${
            activeFilter === 'movies'
              ? 'border-red-600 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Movies
        </button>
        <button
          onClick={() => handleFilterChange('tv')}
          className={`pb-4 px-4 font-semibold transition border-b-2 ${
            activeFilter === 'tv'
              ? 'border-red-600 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          TV Shows
        </button>
      </div>

      {/* Loading State */}
      {loading && movies.length === 0 && tvShows.length === 0 && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}

      {/* Results */}
      {!loading && query && movies.length === 0 && tvShows.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No results found for "{query}"
        </div>
      )}

      {/* Movies Section */}
      {showMovies && movies.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Movies {activeFilter === 'all' && `(${movies.length})`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} item={movie} type="movie" />
            ))}
          </div>
          
          {hasMoreMovies && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreMovies}
                disabled={loading}
                className="bg-red-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More Movies'}
              </button>
            </div>
          )}
        </section>
      )}

      {/* TV Shows Section */}
      {showTV && tvShows.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">
            TV Shows {activeFilter === 'all' && `(${tvShows.length})`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {tvShows.map((show) => (
              <MovieCard key={show.id} item={show} type="tv" />
            ))}
          </div>
          
          {hasMoreTV && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreTV}
                disabled={loading}
                className="bg-red-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More TV Shows'}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
