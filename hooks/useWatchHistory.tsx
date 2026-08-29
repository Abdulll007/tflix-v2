"use client";

import { useCallback } from "react";

export type WatchHistoryRecord = {
  type: "movie" | "tv";
  name?:string;
  tmdbId: number;
  server?: string;
  season?: number;
  episode?: number;
  title?: string;
  poster?: string;
  updatedAt: number;

};

const STORAGE_KEY = "tflix_watch_history";

function readAll(): Record<string, WatchHistoryRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, WatchHistoryRecord>;
  } catch (e) {
    console.error("Failed to read watch history", e);
    return {};
  }
}

function writeAll(data: Record<string, WatchHistoryRecord>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to write watch history", e);
  }
}

function keyFor(type: "movie" | "tv", tmdbId: number) {
  return `${type}_${tmdbId}`;
}

export function saveWatchHistory(record: Omit<WatchHistoryRecord, "updatedAt">) {
  if (typeof window === "undefined") return;
  const all = readAll();
  const k = keyFor(record.type, record.tmdbId);
  all[k] = { ...record, updatedAt: Date.now() };
  writeAll(all);
}

export function getWatchHistory(type: "movie" | "tv", tmdbId: number): WatchHistoryRecord | null {
  if (typeof window === "undefined") return null;
  const all = readAll();
  const k = keyFor(type, tmdbId);
  return all[k] ?? null;
}

export function deleteWatchHistory(type: "movie" | "tv", tmdbId: number) {
  if (typeof window === "undefined") return;
  const all = readAll();
  const k = keyFor(type, tmdbId);
  if (all[k]) {
    delete all[k];
    writeAll(all);
  }
}

export function getAllWatchHistory(): WatchHistoryRecord[] {
  if (typeof window === "undefined") return [];
  const all = readAll();
  return Object.values(all).sort((a, b) => b.updatedAt - a.updatedAt);
}

export default function useWatchHistory() {
  const save = useCallback((rec: Omit<WatchHistoryRecord, "updatedAt">) => {
    try {
      saveWatchHistory(rec);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const get = useCallback((type: "movie" | "tv", tmdbId: number) => {
    try {
      return getWatchHistory(type, tmdbId);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  const remove = useCallback((type: "movie" | "tv", tmdbId: number) => {
    try {
      deleteWatchHistory(type, tmdbId);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getAll = useCallback(() => {
    try {
      return getAllWatchHistory();
    } catch (e) {
      console.error(e);
      return [] as WatchHistoryRecord[];
    }
  }, []);

  return { save, get, remove, getAll };
}
