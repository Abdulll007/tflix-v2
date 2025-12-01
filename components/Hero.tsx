import Image from 'next/image';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { Movie, TVShow } from '@/types';
import { getImageUrl } from '@/lib/tmdb';

interface HeroProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
}

export default function Hero({ item, type }: HeroProps) {
  const title = 'title' in item ? item.title : item.name;
  const date = 'release_date' in item ? item.release_date : item.first_air_date;
  const rating = Math.round(item.vote_average * 10);

  return (
    <div className="relative h-[80vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        {item.backdrop_path ? (
          <Image
            src={getImageUrl(item.backdrop_path, 'original')}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            {title}
          </h1>

          <div className="flex items-center space-x-4 mb-4">
            <span className={`px-3 py-1 rounded-md text-sm font-semibold ${
              rating >= 70 ? 'bg-green-600' : rating >= 50 ? 'bg-yellow-600' : 'bg-red-600'
            }`}>
              {rating}% Match
            </span>
            {date && (
              <span className="text-gray-300">
                {new Date(date).getFullYear()}
              </span>
            )}
          </div>

          <p className="text-gray-300 text-lg mb-6 line-clamp-3">
            {item.overview}
          </p>

          <div className="flex space-x-4">
            <Link
              href={`/${type}/${item.id}?play=true`}
              className="flex items-center space-x-2 bg-red-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition"
            >
              <Play className="w-5 h-5" />
              <span>Play</span>
            </Link>
            
            <Link
              href={`/${type}/${item.id}`}
              className="flex items-center space-x-2 bg-gray-600/80 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-600 transition"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
