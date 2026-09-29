// Temporary adapters that mount pre-redesign screens on the new routes.
// Each one is deleted when its redesigned screen lands (phase 3).
import PopularPage from "@/routes/catalog/PopularPage";
import TitlePage from "@/routes/title/TitlePage";

export const LegacyMovies = () => (
  <PopularPage typeData="movie" typeName="Peliculas" title="Peliculas Populares" to="film" />
);

export const LegacySeries = () => (
  <PopularPage typeData="tv" typeName="Series" title="Series Populares" to="tvShow" />
);

export const LegacyMovieTitle = () => <TitlePage type="movie" />;
export const LegacySeriesTitle = () => <TitlePage type="tv" />;
