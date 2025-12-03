export function getImageUrl(path: string | null, size: 'w300' | 'w500' | 'original' = 'w500'): string {
  if (!path) return '/placeholder.jpg';
  // NEXT_PUBLIC_* env var is safe for client usage
  return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/${size}${path}`;
}