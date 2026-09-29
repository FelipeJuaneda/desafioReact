// Display formatting for catalog metadata (es-AR).

const rating = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const count = new Intl.NumberFormat("es-AR");

/** "1999-10-15" -> "1999". Empty or missing dates -> null. */
export const formatYear = (date: string | null | undefined) =>
  date && /^\d{4}/.test(date) ? date.slice(0, 4) : null;

/** 139 -> "2 h 19 min"; 45 -> "45 min"; unknown or 0 -> null. */
export const formatRuntime = (minutes: number | null | undefined) => {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
};

/** 8.438 -> "8,4". TMDB uses 0 for "no votes yet" -> null. */
export const formatRating = (value: number | null | undefined) =>
  value ? rating.format(value) : null;

/** 1 -> "1 temporada", 8 -> "8 temporadas". */
export const formatSeasons = (seasons: number | null | undefined) =>
  seasons ? `${seasons} ${seasons === 1 ? "temporada" : "temporadas"}` : null;

export const formatCount = (value: number) => count.format(value);

/** "2026-07-29" -> "29 de julio de 2026". */
export const formatDate = (date: string | null | undefined) => {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
};
