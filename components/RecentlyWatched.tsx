"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import useWatchHistory, { WatchHistoryRecord } from "@/hooks/useWatchHistory";
import { getImageUrl } from "@/lib/image";
import Link from "next/link";
import { BiTrash } from "react-icons/bi";

export default function RecentlyWatched() {
  const { getAll, remove } = useWatchHistory();
  const [items, setItems] = useState<WatchHistoryRecord[]>([]);

  useEffect(() => {
    setItems(getAll());
  }, [getAll]);

  const handleDelete = (rec: WatchHistoryRecord) => {
    remove(rec.type, rec.tmdbId);
    setItems(getAll());
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 'auto',
    containScroll: 'trimSnaps',
    dragFree: true,
  });
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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

  if (items.length === 0) return null;

  const arrowBase =
    'absolute top-1/2 -translate-y-1/2 z-10 text-white p-2 transition-all duration-200 ' +
    'bg-black/80 hover:bg-black/90 active:bg-black ' +
    'disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <section className="relative " ref={carouselRef}>
      <h2 className="text-2xl font-bold  px-4 mb-6">Recently Watched</h2>

      <div className="relative">
        {(canScrollPrev || canScrollNext) && (
          <button onClick={scrollPrev} disabled={!canScrollPrev} className={`${arrowBase} left-0 rounded-r-md`} aria-label="Previous">
            <FaAngleLeft className="w-6 h-6" />
          </button>
        )}

        <div className="overflow-hidden " ref={emblaRef}>
          <div className="flex gap-4 ">
            {items.map((rec) => (
              <div key={`${rec.type}-${rec.tmdbId}`} className="flex-none w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]">
                <div className="bg-gray-900 rounded overflow-hidden flex flex-col h-full">
                  <Link href={rec.type === "movie" ? `/movie/${rec.tmdbId}` : `/tv/${rec.tmdbId}` } className="block">
                    <div className="relative w-full aspect-[2/3] bg-gray-800">
                      <img
                        src={
                          rec.poster && String(rec.poster).startsWith("http")
                            ? String(rec.poster)
                            : getImageUrl(rec.poster ?? null, "w300")
                        }
                        alt={rec.title ?? rec.name ?? "recent"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 text-sm h-14 text-center">
                      <div className="font-semibold line-clamp-2 ">{rec.title ?? rec.name ?? "Untitled"}</div>
                      {rec.type === "tv" && rec.season && rec.episode && (
                        <div className="text-xs text-gray-400">S{rec.season} • E{rec.episode}</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-2 border-t border-gray-800 flex items-center justify-between h-8">
                    <div className="text-xs text-gray-400">{new Date(rec.updatedAt).toLocaleDateString()}</div>
                    <button
                      onClick={() => handleDelete(rec)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      <BiTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {(canScrollPrev || canScrollNext) && (
          <button onClick={scrollNext} disabled={!canScrollNext} className={`${arrowBase} right-0 rounded-l-md`} aria-label="Next">
            <FaAngleRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </section>
  );
}
