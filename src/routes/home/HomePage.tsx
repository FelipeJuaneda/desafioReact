import { Link } from "react-router";
import { paths } from "@/app/paths";
import { CatalogRail } from "@/features/catalog/CatalogRail";
import { FeaturedTitle } from "@/features/catalog/FeaturedTitle";
import { nowPlayingQuery, topRatedQuery, trendingQuery } from "@/services/tmdb/queries";
import type { MovieSummary, TvSummary } from "@/types/tmdb";

const SeeAll = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="rounded-perf text-small font-semibold text-emulsion-muted underline decoration-frameline underline-offset-4 hover:text-emulsion hover:decoration-edge focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
  >
    {label}
  </Link>
);

const HomePage = () => (
  <>
    <title>PelicuLed · Qué ver esta semana</title>
    <meta
      name="description"
      content="Películas y series en cartel, lo más visto de la semana y las mejor puntuadas, con fichas completas y tu propia lista."
    />
    <h1 className="sr-only">Qué ver esta semana</h1>
    <FeaturedTitle />
    <div className="mx-auto grid max-w-(--container-reel) gap-14 px-(--spacing-gutter) pt-12">
      <CatalogRail<MovieSummary>
        title="En cartel"
        mediaType="movie"
        query={nowPlayingQuery()}
        action={<SeeAll to={paths.movies} label="Ver películas" />}
        eager
      />
      <CatalogRail<TvSummary>
        title="Series de la semana"
        mediaType="tv"
        query={trendingQuery<TvSummary>("tv")}
        action={<SeeAll to={paths.series} label="Ver series" />}
      />
      <CatalogRail<MovieSummary>
        title="Mejor puntuadas"
        mediaType="movie"
        query={topRatedQuery<MovieSummary>("movie")}
      />
    </div>
  </>
);

export default HomePage;
