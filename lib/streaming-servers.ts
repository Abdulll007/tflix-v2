const MOVIE_SERVER_BASES = {
  Vidcore: process.env.NEXT_PUBLIC_VIDCORE_MOVIE_URL,
  Vidlove: process.env.NEXT_PUBLIC_VIDLOVE_MOVIE_URL ,
  Zxcstream: process.env.NEXT_PUBLIC_ZXCSTREAM_MOVIE_URL ,
  Peachify: process.env.NEXT_PUBLIC_PEACHIFY_MOVIE_URL ,
  MoviesAPI: process.env.NEXT_PUBLIC_MOVIESAPI_MOVIE_URL ,
};

const TV_SERVER_BASES = {
  Vidcore: process.env.NEXT_PUBLIC_VIDCORE_TV_URL ,
  Vidlove: process.env.NEXT_PUBLIC_VIDLOVE_TV_URL ,
  Zxcstream: process.env.NEXT_PUBLIC_ZXCSTREAM_TV_URL ,
  Peachify: process.env.NEXT_PUBLIC_PEACHIFY_TV_URL ,
  MoviesAPI: process.env.NEXT_PUBLIC_MOVIESAPI_TV_URL ,
};

export const movieServers = [
  {
    name: "Server 1",
    url: (id: number) => `${MOVIE_SERVER_BASES.Vidcore}${id}`,
  },
  {
    name: "Server 2",
    url: (id: number) => `${MOVIE_SERVER_BASES.Vidlove}${id}`,
  },
  {
    name: "Server 3",
    url: (id: number) => `${MOVIE_SERVER_BASES.Zxcstream}${id}`,
  },
  {
    name: "Server 4",
    url: (id: number) => `${MOVIE_SERVER_BASES.Peachify}${id}`,
  },
  {
    name: "Server 5",
    url: (id: number) => `${MOVIE_SERVER_BASES.MoviesAPI}${id}`,
  },
];

export const tvServers = [
  {
    name: "Server 1",
    url: (id: number, s: number, e: number) =>
      `${TV_SERVER_BASES.Vidcore}${id}/${s}/${e}`,
  },
  {
    name: "Server 2",
    url: (id: number, s: number, e: number) =>
      `${TV_SERVER_BASES.Vidlove}${id}/${s}/${e}`,
  },
  {
    name: "Server 3",
    url: (id: number, s: number, e: number) =>
      `${TV_SERVER_BASES.Zxcstream}${id}/${s}/${e}`,
  },
  {
    name: "Server 4",
    url: (id: number, s: number, e: number) =>
      `${TV_SERVER_BASES.Peachify}${id}/${s}/${e}`,
  },
  {
    name: "Server 5",
    url: (id: number, s: number, e: number) =>
      `${TV_SERVER_BASES.MoviesAPI}${id}/${s}/${e}`,
  },
];
