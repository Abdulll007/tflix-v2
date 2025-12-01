'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'movie' | 'tv';
  tmdbId: number;
  season?: number;
  episode?: number;
  children?: React.ReactNode;
}

export default function VideoPlayerModal({
  isOpen,
  onClose,
  type,
  tmdbId,
  season,
  episode,
  children,
}: VideoPlayerModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getEmbedUrl = () => {
    if (type === 'movie') {
      return `${process.env.NEXT_PUBLIC_MOVIE_URL}${tmdbId}`;
    } else {
      return `${process.env.NEXT_PUBLIC_TV_URL}${tmdbId}&season=${season || 1}&episode=${episode || 1}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="w-full h-full max-w-7xl flex flex-col lg:flex-row gap-4">
        {/* Video Player */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={getEmbedUrl()}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title="Video Player"
            />
          </div>
        </div>

        {/* Sidebar (for episodes list) */}
        {children && (
          <div className="lg:w-96 max-h-[calc(100vh-2rem)] overflow-y-auto bg-gray-900 rounded-lg">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
