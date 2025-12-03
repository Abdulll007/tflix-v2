"use client";

import { useState, useEffect, use } from "react";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieRecommendations,
} from "@/lib/tmdb-server";
import MovieCarousel from "@/components/MovieCarousel";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import { MovieDetails, Credits, Movie } from "@/types";
import Image from "next/image";
import { Play, Star, Calendar, Clock } from "lucide-react";
import { getImageUrl } from "@/lib/image";

interface MoviePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ play?: string }>;
}

export default function MoviePage({ params, searchParams }: MoviePageProps) {
  const { id } = use(params);
  const { play } = use(searchParams);
  const movieId = parseInt(id);

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [movieData, creditsData, recsData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
          getMovieRecommendations(movieId),
        ]);

        setMovie(movieData);
        setCredits(creditsData);
        setRecommendations(recsData);

        if (play) {
          setIsPlayerOpen(true);
        }
      } catch (error) {
        console.error("Error loading movie:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [movieId, play]);

  if (loading || !movie || !credits) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const rating = Math.round(movie.vote_average * 10);
  const director = credits.crew.find((person) => person.job === "Director");

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          {movie.backdrop_path ? (
            <Image
              src={getImageUrl(movie.backdrop_path, "original")}
              alt={movie.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Details */}
        <div className="relative h-full container mx-auto px-4 flex items-end pb-12">
          <div className="flex gap-8 items-end">
            {movie.poster_path && (
              <div className="hidden md:block relative w-48 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={getImageUrl(movie.poster_path, "w500")}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 0vw, 192px"
                />
              </div>
            )}

            <div>
              <h1 className="text-5xl font-bold mb-2">{movie.title}</h1>
              <p className="text-gray-400 mb-6">{movie.tagline}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{movie.runtime} min</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-300 mb-6">
                <span
                  className={`px-3 py-1 rounded-md text-sm font-semibold ${
                    rating >= 70
                      ? "bg-green-600"
                      : rating >= 50
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }`}
                >
                  {rating}%
                </span>
                <span>{movie.runtime} min</span>
                <span>{movie.genres.map((g) => g.name).join(", ")}</span>
              </div>

              <button
                onClick={() => setIsPlayerOpen(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition"
              >
                <Play className="w-5 h-5" />
                Play Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-300 text-lg mb-4">{movie.overview}</p>
          {movie.tagline && (
            <p className="text-gray-400 italic">"{movie.tagline}"</p>
          )}
        </section>

        {credits.cast.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {credits.cast.slice(0, 12).map((person) => (
                <div key={person.id} className="text-center">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 mb-2">
                    {person.profile_path ? (
                      <Image
                        src={getImageUrl(person.profile_path, "w300")}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-sm">{person.name}</p>
                  <p className="text-gray-400 text-xs">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <MovieCarousel
            title="You May Also Like"
            items={recommendations}
            type="movie"
          />
        )}
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        type="movie"
        tmdbId={movieId}
      />
    </div>
  );
}
