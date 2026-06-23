'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import MovieCard from './MovieCard';
import { Movie, TVShow } from '@/types';

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
    dragFree: true,
  });

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Track scroll position so we can disable arrows at the edges.
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Keyboard navigation (when the carousel is hovered or focused).
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const el = carouselRef.current;
      if (!el?.contains(document.activeElement) && !el?.matches(':hover')) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollPrev, scrollNext]); // FIX: include deps so it isn't stale before emblaApi loads

  if (items.length === 0) return null;

  const isScrollable = canScrollPrev || canScrollNext;

  // Shared button styling — ALWAYS visible (no hover gating, works on TVs).
  const arrowBase =
    'absolute top-1/2 -translate-y-1/2 z-10 text-white p-2 transition-all duration-200 ' +
    'bg-black/80 hover:bg-black/90 active:bg-black ' +
    'disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <section className="relative" ref={carouselRef}>
      <h2 className="text-2xl font-bold mb-6 px-4">{title}</h2>

      <div className="relative">
        {/* Previous Button — only rendered when the row can actually scroll */}
        {isScrollable && (
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`${arrowBase} left-0 rounded-r-md`}
            aria-label="Previous"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {items.map((item) => (
              <div
                key={`${type}-${item.id}`} // FIX: stable key (no random UUID remounts)
                className="flex-[0_0_auto] w-35 sm:w-45 md:w-50 lg:w-55"
              >
                <MovieCard item={item} type={type} />
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        {isScrollable && (
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`${arrowBase} right-0 rounded-l-md`}
            aria-label="Next"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </section>
  );
}