import { Movie, TVShow, MovieDetails, TVShowDetails, TMDBResponse, Credits, Episode, Genre } from '@/types';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TMDB_API_KEY}`,
};

async function fetchTMDB<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers,
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json();
}

// Movies
export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBResponse<Movie>>('/trending/movie/week');
  return data.results;
}

export async function getPopularMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(`/movie/popular?page=${page}`);
}

export async function getTopRatedMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(`/movie/top_rated?page=${page}`);
}

export async function getUpcomingMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(`/movie/upcoming?page=${page}`);
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return fetchTMDB<MovieDetails>(`/movie/${id}`);
}

export async function getMovieCredits(id: number): Promise<Credits> {
  return fetchTMDB<Credits>(`/movie/${id}/credits`);
}

export async function getMovieRecommendations(id: number): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBResponse<Movie>>(`/movie/${id}/recommendations`);
  return data.results;
}

export async function searchMovies(query: string, page = 1): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
}

export async function discoverMovies(params: {
  page?: number;
  genre?: string;
  sortBy?: string;
  year?: string;
}): Promise<TMDBResponse<Movie>> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.genre) queryParams.append('with_genres', params.genre);
  if (params.sortBy) queryParams.append('sort_by', params.sortBy);
  if (params.year) queryParams.append('primary_release_year', params.year);
  
  return fetchTMDB<TMDBResponse<Movie>>(`/discover/movie?${queryParams.toString()}`);
}

// TV Shows
export async function getTrendingTVShows(): Promise<TVShow[]> {
  const data = await fetchTMDB<TMDBResponse<TVShow>>('/trending/tv/week');
  return data.results;
}

export async function getPopularTVShows(page = 1): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB<TMDBResponse<TVShow>>(`/tv/popular?page=${page}`);
}

export async function getTopRatedTVShows(page = 1): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB<TMDBResponse<TVShow>>(`/tv/top_rated?page=${page}`);
}

export async function getTVShowDetails(id: number): Promise<TVShowDetails> {
  return fetchTMDB<TVShowDetails>(`/tv/${id}`);
}

export async function getTVShowCredits(id: number): Promise<Credits> {
  return fetchTMDB<Credits>(`/tv/${id}/credits`);
}

export async function getTVShowRecommendations(id: number): Promise<TVShow[]> {
  const data = await fetchTMDB<TMDBResponse<TVShow>>(`/tv/${id}/recommendations`);
  return data.results;
}

export async function getSeasonEpisodes(tvId: number, seasonNumber: number): Promise<{ episodes: Episode[] }> {
  return fetchTMDB<{ episodes: Episode[] }>(`/tv/${tvId}/season/${seasonNumber}`);
}

export async function searchTVShows(query: string, page = 1): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB<TMDBResponse<TVShow>>(`/search/tv?query=${encodeURIComponent(query)}&page=${page}`);
}

export async function discoverTVShows(params: {
  page?: number;
  genre?: string;
  sortBy?: string;
  year?: string;
}): Promise<TMDBResponse<TVShow>> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.genre) queryParams.append('with_genres', params.genre);
  if (params.sortBy) queryParams.append('sort_by', params.sortBy);
  if (params.year) queryParams.append('first_air_date_year', params.year);
  
  return fetchTMDB<TMDBResponse<TVShow>>(`/discover/tv?${queryParams.toString()}`);
}

// Genres
export async function getMovieGenres(): Promise<Genre[]> {
  const data = await fetchTMDB<{ genres: Genre[] }>('/genre/movie/list');
  return data.genres;
}

export async function getTVGenres(): Promise<Genre[]> {
  const data = await fetchTMDB<{ genres: Genre[] }>('/genre/tv/list');
  return data.genres;
}

// Image URL helper
export function getImageUrl(path: string | null, size: 'w300' | 'w500' | 'original' = 'w500'): string {
  if (!path) return '/placeholder.jpg';
  return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
