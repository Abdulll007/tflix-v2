"use client";

import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "movie" | "tv";
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
  const movieServers = [

    { name: "Server-1", url: (id: number) => `${process.env.NEXT_PUBLIC_MOVIE_URL} ${id}?primaryColor=e7000b&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=true&autoplay=false&nextbutton=true` },
    {
      name: "Server-2",
      url: (id: number) => `${process.env.NEXT_PUBLIC_MOVIE_URL2}${id}&tmdb=1`,
    },
    {
      name: "Server-3",
      url: (id: number) =>
        `${process.env.NEXT_PUBLIC_MOVIE_URL3}${id}&ds_lang=en`,
    },
  
    {
      name: "Server-4",
      url: (id: number) => `${process.env.NEXT_PUBLIC_MOVIE_URL4}${id}`,
    },
  ];

  const tvServers = [
    {
      name: "Server-1",
      url: (id: number, s: number, e: number) =>
        `${process.env.NEXT_PUBLIC_TV_URL}${id}/${s}/${e}?primaryColor=e7000b&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=true&autoplay=false&nextbutton=true`,
    },
    
    {
      name: "Server-2",
      url: (id: number, s: number, e: number) =>
        `${process.env.NEXT_PUBLIC_TV_URL2}${id}&tmdb=1&s=${s}&e=${e}`,
    },
    {
      name: "Server-3",
      url: (id: number, s: number, e: number) =>
        `${process.env.NEXT_PUBLIC_TV_URL3}${id}&season=${s}&episode=${e}&ds_lang=en`,
    },
    {
      name: "Server-4",
      url: (id: number, s: number, e: number) =>
        `${process.env.NEXT_PUBLIC_TV_URL}${id}&season=${s}&episode=${e}`,
    },
    
  ];

  const servers = type === "movie" ? movieServers : tvServers;
  const [selectedServer, setSelectedServer] = useState(0);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getEmbedUrl = () => {
    return servers[selectedServer].url(tmdbId, season || 1, episode || 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
        aria-label="Close"
      >
        <IoClose className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="w-full h-full max-w-7xl flex flex-col lg:flex-row gap-4">
        {/* Video Player */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Server Selector */}
          <div className="mb-4 w-full max-w-md">
            <label className="text-white mr-2 block mb-2">Select Server:</label>
            <select
              value={selectedServer}
              onChange={(e) => setSelectedServer(Number(e.target.value))}
              className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {servers.map((server, index) => (
                <option key={index} value={index}>
                  {server.name}
                </option>
              ))}
            </select>
          </div>
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
          <div className="lg:w-96 max-h-[calc(100vh-2rem)] overflow-y-auto bg-gray-00 rounded-lg">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
