'use client';

interface VideoPlayerProps {
  type: 'movie' | 'tv';
  tmdbId: number;
  season?: number;
  episode?: number;
}

export default function VideoPlayer({ type, tmdbId, season, episode }: VideoPlayerProps) {
  const getEmbedUrl = () => {
    if (type === 'movie') {
      return `${process.env.NEXT_PUBLIC_MOVIE_URL}${tmdbId}`;
    } else {
      return `${process.env.NEXT_PUBLIC_TV_URL}${tmdbId}&season=${season || 1}&episode=${episode || 1}`;
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        src={getEmbedUrl()}
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="Video Player"
      />
    </div>
  );
}
