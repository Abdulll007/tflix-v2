"use client";

import { useState, useEffect, use } from "react";
import {
  getTVShowDetails,
  getTVShowCredits,
  getTVShowRecommendations,
  getSeasonEpisodes,
  
} from "@/lib/tmdb-server";
import MovieCarousel from "@/components/MovieCarousel";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import { TVShowDetails, Credits, TVShow, Episode } from "@/types";
import { Play, Star, Calendar, Tv, Clock} from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/image";

interface TVPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ play?: string; season?: string; episode?: string }>;
}

export default function TVPage({ params, searchParams }: TVPageProps) {
  const { id } = use(params);
  const {
    play,
    season: seasonParam,
    episode: episodeParam,
  } = use(searchParams);

  const tvId = parseInt(id);
  const [tvShow, setTvShow] = useState<TVShowDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [recommendations, setRecommendations] = useState<TVShow[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [showData, creditsData, recsData] = await Promise.all([
          getTVShowDetails(tvId),
          getTVShowCredits(tvId),
          getTVShowRecommendations(tvId),
        ]);

        setTvShow(showData);
        setCredits(creditsData);
        setRecommendations(recsData);

        const initialSeason = seasonParam ? parseInt(seasonParam) : 1;
        const initialEpisode = episodeParam ? parseInt(episodeParam) : 1;
        setSelectedSeason(initialSeason);
        setSelectedEpisode(initialEpisode);

        const episodesData = await getSeasonEpisodes(tvId, initialSeason);
        setEpisodes(episodesData.episodes);

        if (play) {
          setIsPlayerOpen(true);
        }
      } catch (error) {
        console.error("Error loading TV show:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [tvId, seasonParam, episodeParam, play]);

  useEffect(() => {
    if (tvShow && selectedSeason) {
      getSeasonEpisodes(tvId, selectedSeason)
        .then((data) => setEpisodes(data.episodes))
        .catch(console.error);
    }
  }, [tvId, selectedSeason, tvShow]);

  const handleEpisodeClick = (episodeNum: number) => {
    setSelectedEpisode(episodeNum);
    setIsPlayerOpen(true);
  };

  if (loading || !tvShow || !credits) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const rating = Math.round(tvShow.vote_average * 10);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          {tvShow.backdrop_path ? (
            <Image
              src={getImageUrl(tvShow.backdrop_path, "original")}
              alt={tvShow.name}
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

        <div className="relative h-full container mx-auto px-4 flex items-end pb-12">
          <div className="flex gap-8 items-end">
            {tvShow.poster_path && (
              <div className="hidden md:block relative w-48 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={getImageUrl(tvShow.poster_path, "w500")}
                  alt={tvShow.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 0vw, 192px"
                />
              </div>
            )}

            <div>
              <h1 className="text-5xl font-bold mb-2">{tvShow.name}</h1>
              <p className="text-gray-400 mb-6">{tvShow.tagline}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>{tvShow.vote_average.toFixed(1)}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{tvShow.episode_run_time[0]} min</span>
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
                
                <span>{tvShow.number_of_seasons} Seasons</span>
                <span>{tvShow.genres.map((g) => g.name).join(", ")}</span>
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
          <p className="text-gray-300 text-lg mb-4">{tvShow.overview}</p>
          {tvShow.tagline && (
            <p className="text-gray-400 italic">"{tvShow.tagline}"</p>
          )}
        </section>

        {/* Seasons & Episodes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Seasons & Episodes</h2>

          {/* Season Selector */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {tvShow.seasons
              .filter((season) => season.season_number > 0)
              .map((season) => (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeason(season.season_number)}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    selectedSeason === season.season_number
                      ? "bg-red-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Season {season.season_number}
                </button>
              ))}
          </div>

          {/* Episodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((episode) => (
              <div
                key={episode.id}
                className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition cursor-pointer"
                onClick={() => handleEpisodeClick(episode.episode_number)}
              >
                <div className="relative w-full aspect-video bg-gray-800">
                  {episode.still_path ? (
                    <Image
                      src={getImageUrl(episode.still_path, "w300")}
                      alt={episode.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      No Image
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                    {episode.runtime} min
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold mb-2">
                    {episode.episode_number}. {episode.name}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {episode.overview}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cast */}
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
            items={recommendations.slice(0, 12)}
            type="tv"
          />
        )}
      </div>

      {/* Video Player Modal with Episodes Sidebar */}
      <VideoPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        type="tv"
        tmdbId={tvId}
        season={selectedSeason}
        episode={selectedEpisode}
      >
        <div className="p-4">
          <h3 className="text-xl font-bold mb-4">Season {selectedSeason}</h3>
          <div className="space-y-2">
            {episodes.map((ep) => (
              <button
                key={ep.id}
                onClick={() => setSelectedEpisode(ep.episode_number)}
                className={`w-full text-left p-3 rounded-lg transition ${
                  selectedEpisode === ep.episode_number
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <div className="font-semibold text-sm mb-1">
                  {ep.episode_number}. {ep.name}
                </div>
                <div className="text-xs opacity-80">{ep.runtime} min</div>
              </button>
            ))}
          </div>
        </div>
      </VideoPlayerModal>
    </div>
  );
}
