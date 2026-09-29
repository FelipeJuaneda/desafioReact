import { slugify } from "@/lib/slug";
import type { MediaType } from "@/types/tmdb";

/** Every URL the app links to, in one place. */
export const paths = {
  home: "/",
  movies: "/peliculas",
  series: "/series",
  catalog: (type: MediaType) => (type === "movie" ? "/peliculas" : "/series"),
  search: (query?: string) => (query ? `/buscar?q=${encodeURIComponent(query)}` : "/buscar"),
  title: (type: MediaType, id: number, title?: string) =>
    `/${type === "movie" ? "pelicula" : "serie"}/${id}${title ? `-${slugify(title)}` : ""}`,
  person: (id: number, name?: string) => `/persona/${id}${name ? `-${slugify(name)}` : ""}`,
  genre: (type: MediaType, genreId: number) =>
    `${type === "movie" ? "/peliculas" : "/series"}?genero=${genreId}`,
  myList: "/mi-lista",
  signIn: "/ingresar",
  signUp: "/registro",
  recover: "/recuperar",
} as const;
