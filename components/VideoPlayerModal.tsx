"use client";

import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import useWatchHistory from "@/hooks/useWatchHistory";
import { movieServers, tvServers } from "@/lib/streaming-servers";

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
  const servers = type === "movie" ? movieServers : tvServers;
  const [selectedServer, setSelectedServer] = useState(0);
  const { save, get } = useWatchHistory();
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

  // Initialize selected server from history when opening
  useEffect(() => {
    if (!isOpen) return;
    try {
      const history = get(type, tmdbId);
      if (history?.server) {
        const idx = servers.findIndex((s) => s.name === history.server);
        if (idx >= 0) setSelectedServer(idx);
      }
    } catch (e) {
      console.error("Failed to load watch history", e);
    }
  }, [isOpen, get, type, tmdbId, servers]);

  // Persist last-watched info to localStorage when player details change
  useEffect(() => {
    if (!isOpen) return;
    try {
      const existing = get(type, tmdbId);
      save({
        type,
        tmdbId,
        server: servers[selectedServer]?.name,
        season: season ?? undefined,
        episode: episode ?? undefined,
        title: existing?.title,
        poster: existing?.poster,
      });
    } catch (e) {
      console.error("Failed to save watch history", e);
    }
  }, [isOpen, selectedServer, season, episode, tmdbId, type, save, servers, get]);

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
