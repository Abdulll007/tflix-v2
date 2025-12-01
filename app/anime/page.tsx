'use client';

import { useState, useEffect, useCallback } from 'react';
import MovieCard from '@/components/MovieCard';
import { TVShow } from '@/types';
import { discoverTVShows } from '@/lib/tmdb';

export default function AnimePage() {
  const [animes, setAnimes] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadAnimes = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    try {
      // Genre ID 16 is Animation
      const result = await discoverTVShows({
        page: pageNum,
        genre: '16',
        sortBy: 'popularity.desc',
      });

      // Filter for anime (Japanese origin)
      const animeResults = result.results.filter(show => 
        show.origin_country.includes('JP')
      );

      setAnimes(prev => reset ? animeResults : [...prev, ...animeResults]);
      setHasMore(pageNum < result.total_pages);
    } catch (error) {
      console.error('Error loading anime:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnimes(1, true);
  }, [loadAnimes]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadAnimes(nextPage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Anime</h1>

      {/* Anime Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {animes.map((anime) => (
          <MovieCard key={anime.id} item={anime} type="tv" />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}

      {/* Load More */}
      {!loading && hasMore && animes.length > 0 && (
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
      {!loading && animes.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No anime found
        </div>
      )}
    </div>
  );
}
