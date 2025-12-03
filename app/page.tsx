import Hero from '@/components/Hero';
import MovieCarousel from '@/components/MovieCarousel';
import {
  getTrendingMovies,
  getTrendingTVShows,
  getUpcomingMovies,
  getTopRatedMovies,
  getPopularMovies,
} from '@/lib/tmdb-server';
import { randomInt } from 'crypto';

export default async function HomePage() {
  const [trendingMovies, trendingTV, upcoming, topRated, popular] = await Promise.all([
    getTrendingMovies().then(res=> res.results),
    getTrendingTVShows().then(res => res.results),
    getUpcomingMovies().then(res => res.results),
    getTopRatedMovies().then(res => res.results),
    getPopularMovies().then(res => res.results),
  ]);

  


  const heroItem = trendingMovies[randomInt(0, trendingMovies.length)];

  return (
    <div>
      {heroItem && <Hero item={heroItem} type="movie" />}

      <div className="container mx-auto space-y-12 py-12">
        <MovieCarousel title="Trending Movies" items={trendingMovies} type="movie" />
        <MovieCarousel title="Trending TV Shows" items={trendingTV} type="tv" />
        <MovieCarousel title="Upcoming Releases" items={upcoming} type="movie" />
        <MovieCarousel title="Top Rated" items={topRated} type="movie" />
        <MovieCarousel title="Most Popular" items={popular} type="movie" />
      </div>
    </div>
  );
}
