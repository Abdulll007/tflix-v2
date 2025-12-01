# TFLIX - Movie & TV Show Streaming Platform

A Next.js application that replicates a streaming platform with TMDB API integration.

## Features

- 🎬 Browse trending movies and TV shows
- 🔍 Search and filter content by genre, year, and rating
- 📺 Detailed movie and TV show pages with:
  - Cast and crew information
  - Seasons and episodes listings (TV shows)
  - Recommendations
  - Integrated video player
- 🎭 Anime section with Japanese content filtering
- 📱 Responsive design with dark theme
- ⚡ Fast performance with Next.js 15 and React 19

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: TMDB (The Movie Database)
- **Video Player**: VidSrc embedding

## Setup Instructions

### 1. Get TMDB API Key

1. Go to [TMDB](https://www.themoviedb.org/)
2. Create an account
3. Go to Settings > API
4. Request an API key (choose "Developer")
5. Copy your API key (Bearer Token)

### 2. Configure Environment Variables

Edit `.env.local` file and add your TMDB API Bearer Token:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_bearer_token_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Video Player URLs

The application uses VidSrc for video playback:

- **Movies**: `https://vidsrc.pm/embed/movie?tmdb={id}`
- **TV Shows**: `https://vidsrc.xyz/embed/tv?tmdb={id}&season={season}&episode={episode}`

## Project Structure

```
tflix-clone/
├── app/
│   ├── movie/[id]/     # Movie detail pages
│   ├── tv/[id]/        # TV show detail pages
│   ├── movies/         # Movies listing page
│   ├── tv-shows/       # TV shows listing page
│   ├── anime/          # Anime page
│   ├── layout.tsx      # Root layout with header
│   └── page.tsx        # Home page
├── components/
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero banner component
│   ├── MovieCard.tsx   # Movie/TV card component
│   ├── VideoPlayer.tsx # Video player component
│   └── Filters.tsx     # Filter controls
├── lib/
│   └── tmdb.ts         # TMDB API service
└── types/
    └── index.ts        # TypeScript types
```

## Pages

- `/` - Home page with trending content
- `/movies` - Movies listing with filters and search
- `/tv-shows` - TV shows listing with filters and search
- `/anime` - Anime content (Japanese animation)
- `/movie/[id]` - Movie detail page with player
- `/tv/[id]` - TV show detail page with seasons/episodes

## Features in Detail

### Search & Filters
- Genre filtering
- Sort by popularity, rating, release date
- Year filtering
- Real-time search

### Movie/TV Detail Pages
- High-quality backdrop and poster images
- Rating display
- Overview and tagline
- Cast with photos and character names
- Crew information (director, etc.)
- Recommendations
- Integrated video player

### TV Show Specific Features
- Season selector
- Episode listings with thumbnails
- Episode descriptions and runtime
- Direct episode playback

## Build for Production

```bash
npm run build
npm start
```

## License

This project is for educational purposes only. All movie data and images are provided by TMDB.
