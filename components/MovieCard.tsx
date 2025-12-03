import Link from 'next/link';
import Image from 'next/image';
import { Movie, TVShow } from '@/types';
import { getImageUrl } from "@/lib/image";

interface MovieCardProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
}

export default function MovieCard({ item, type }: MovieCardProps) {
  const title = 'title' in item ? item.title : item.name;
  const date = 'release_date' in item ? item.release_date : item.first_air_date;
  const rating = Math.round(item.vote_average * 10);

  return (
    <Link href={`/${type}/${item.id}`} className="group">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-900">
        {item.poster_path ? (
          <Image
            src={getImageUrl(item.poster_path, 'w300')}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md">
          <span className={`text-xs font-semibold ${rating >= 70 ? 'text-green-500' : rating >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
            {rating}%
          </span>
        </div>
      </div>
      
      <div className="mt-2">
        <h3 className="text-white font-medium line-clamp-1 group-hover:text-red-600 transition">
          {title}
        </h3>
        {date && (
          <p className="text-gray-400 text-sm">
            {new Date(date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        )}
      </div>
    </Link>
  );
}
