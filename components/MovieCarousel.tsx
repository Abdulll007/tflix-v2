'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback } from 'react';
import MovieCard from './MovieCard';
import { Movie, TVShow } from '@/types';
import { generateShortUUID } from "@/lib/uuid-generator";
interface MovieCarouselProps {
  title: string;
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
}

export default function MovieCarousel({ title, items, type }: MovieCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 'auto',
    containScroll: 'trimSnaps',
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (items.length === 0) return null;

  return (
    <section className="relative group">
      <h2 className="text-2xl font-bold mb-6 px-4">{title}</h2>
      
      <div className="relative">
        {/* Previous Button */}
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-white p-2 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Previous"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 px-4">
            {items.map((item) => (
              <div key={`${item.id}${generateShortUUID()}`} className="flex-[0_0_auto] w-[150px] sm:w-[180px] md:w-[200px] lg:w-[220px] ">
                <MovieCard item={item} type={type} />
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-white p-2 rounded-l-md opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Next"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
}
