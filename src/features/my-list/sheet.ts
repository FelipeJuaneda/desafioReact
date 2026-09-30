import type { Favorite } from "@/features/favorites/favorite";
import type { MediaType } from "@/types/tmdb";

export type TypeFilter = "todo" | "peliculas" | "series";
export type SheetSort = "recientes" | "puntaje" | "anio" | "titulo";

export const TYPE_FILTERS: Array<{ value: TypeFilter; label: string; mediaType?: MediaType }> = [
  { value: "todo", label: "Todo" },
  { value: "peliculas", label: "Películas", mediaType: "movie" },
  { value: "series", label: "Series", mediaType: "tv" },
];

export const SHEET_SORTS: Array<{ value: SheetSort; label: string }> = [
  { value: "recientes", label: "Guardadas recientemente" },
  { value: "puntaje", label: "Mejor puntuadas" },
  { value: "anio", label: "Más nuevas" },
  { value: "titulo", label: "Título (A–Z)" },
];

export const parseFilter = (value: string | null): TypeFilter =>
  TYPE_FILTERS.some((f) => f.value === value) ? (value as TypeFilter) : "todo";

export const parseSort = (value: string | null): SheetSort =>
  SHEET_SORTS.some((s) => s.value === value) ? (value as SheetSort) : "recientes";

const byTitle = new Intl.Collator("es", { sensitivity: "base", numeric: true });
const time = (favorite: Favorite) => favorite.addedAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
const year = (favorite: Favorite) => Number(favorite.releaseDate?.slice(0, 4) ?? 0);

/**
 * Frame numbers, like the ones printed on a contact sheet: the order titles were saved in, oldest
 * first, so a title keeps its number whatever the filter or sort. Titles still waiting for their
 * server timestamp are the newest.
 */
export const frameNumbers = (favorites: Favorite[]) =>
  new Map(
    [...favorites]
      .sort((a, b) => time(a) - time(b))
      .map((favorite, index) => [favorite.id, index + 1] as const),
  );

export const applySheet = (favorites: Favorite[], filter: TypeFilter, sort: SheetSort) => {
  const mediaType = TYPE_FILTERS.find((f) => f.value === filter)?.mediaType;
  const shown = mediaType ? favorites.filter((f) => f.mediaType === mediaType) : [...favorites];
  const compare: Record<SheetSort, (a: Favorite, b: Favorite) => number> = {
    recientes: (a, b) => time(b) - time(a),
    puntaje: (a, b) => b.voteAverage - a.voteAverage,
    anio: (a, b) => year(b) - year(a),
    titulo: (a, b) => byTitle.compare(a.title, b.title),
  };
  return shown.sort((a, b) => compare[sort](a, b) || byTitle.compare(a.title, b.title));
};

/** The most recently saved title among those shown: the "próxima función". */
export const nextShowing = (favorites: Favorite[]) =>
  favorites.reduce<Favorite | undefined>(
    (latest, favorite) => (!latest || time(favorite) > time(latest) ? favorite : latest),
    undefined,
  );
