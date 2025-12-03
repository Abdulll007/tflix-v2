'use server';

import type { Movie, TVShow, Genre, Credits, Cast, Crew, TVShowDetails, MovieDetails, TMDBResponse,Episode } from '@/types';

const BEARER_TOKEN = process.env.TMDB_API;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!BEARER_TOKEN) {
  throw new Error(
    'TMDB Bearer token is not defined. Set TMDB_BEARER_TOKEN in your .env.local'
  );
}

async function fetchFromTMDB<T>(endpoint: string, params?: Record<string, string | number>) {
  const url = new URL(`${BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('TMDB Error Response:', errorData);
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText} - ${errorData.status_message || ''}`
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error('TMDB Fetch Error:', error);
    throw error;
  }
}



export async function getPopularMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB<TMDBResponse<Movie>>(`/movie/popular?page=${page}`);
}



export async function getMovieGenres(): Promise<Genre[]> {
  const data = await fetchFromTMDB<{ genres: Genre[] }>('/genre/movie/list');
  return data.genres;
}

export async function getTVGenres(): Promise<Genre[]> {
  const data = await fetchFromTMDB<{ genres: Genre[] }>('/genre/tv/list');
  return data.genres;
}

export async function discoverMovies(options: {
  page?: number;
  genre?: string;
  sortBy?: string;
  year?: string;
}): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB<TMDBResponse<Movie>>('/discover/movie', {
    page: options.page || 1,
    sort_by: options.sortBy || 'popularity.desc',
    with_genres: options.genre || '',
    primary_release_year: options.year || '',
  });
}

export async function discoverTVShows(options: {
  page?: number;
  genre?: string;
  sortBy?: string;
  year?: string;
}): Promise<TMDBResponse<TVShow>> {
  return fetchFromTMDB<TMDBResponse<TVShow>>('/discover/tv', {
    page: options.page || 1,
    sort_by: options.sortBy || 'popularity.desc',
    with_genres: options.genre || '',
    first_air_date_year: options.year || '',
  });
}

export async function searchMovies(query: string, page: number = 1): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB<TMDBResponse<Movie>>('/search/movie', {
    query,
    page,
  });
}

export async function searchTVShows(query: string, page: number = 1): Promise<TMDBResponse<TVShow>> {
  return fetchFromTMDB<TMDBResponse<TVShow>>('/search/tv', {
    query,
    page,
  });
}

export async function searchMulti(query: string, page: number = 1): Promise<TMDBResponse<Movie | TVShow>> {
  return fetchFromTMDB<TMDBResponse<Movie | TVShow>>('/search/multi', {
    query,
    page,
  });
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  return fetchFromTMDB<MovieDetails>(`/movie/${movieId}`);
}

export async function getTVShowDetails(showId: number): Promise<TVShowDetails> {
  return fetchFromTMDB<TVShowDetails>(`/tv/${showId}`);
}

export async function getMovieCredits(movieId: number): Promise<Credits> {
  return fetchFromTMDB<Credits>(`/movie/${movieId}/credits`);
}

export async function getMovieRecommendations(id: number): Promise<Movie[]> {
  const data = await fetchFromTMDB<TMDBResponse<Movie>>(`/movie/${id}/recommendations`);
  return data.results;
}

export async function getTVShowCredits(showId: number): Promise<Credits> {
  return fetchFromTMDB<Credits>(`/tv/${showId}/credits`);
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB<TMDBResponse<Movie>>(`/trending/movie/${timeWindow}`, { page });
}

export async function getTrendingTVShows(timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<TMDBResponse<TVShow>> {
  return fetchFromTMDB<TMDBResponse<TVShow>>(`/trending/tv/${timeWindow}`, { page });

  
}

export async function getTVShowRecommendations(id: number): Promise<TVShow[]> {
  const data = await fetchFromTMDB<TMDBResponse<TVShow>>(`/tv/${id}/recommendations`);
  return data.results;
}

export async function getSeasonEpisodes(tvId: number, seasonNumber: number): Promise<{ episodes: Episode[] }> {
  return fetchFromTMDB<{ episodes: Episode[] }>(`/tv/${tvId}/season/${seasonNumber}`);
}


export async function getUpcomingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB<TMDBResponse<Movie>>('/movie/upcoming', { page });
}

export async function getTopRatedMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB<TMDBResponse<Movie>>('/movie/top_rated', { page });
}

export async function getTopRatedTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
  return fetchFromTMDB<TMDBResponse<TVShow>>('/tv/top_rated', { page });
}

