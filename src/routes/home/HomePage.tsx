import { lazy, Suspense } from "react";
import { Link } from "react-router";
import { paths } from "@/app/paths";
import { ButtonLink } from "@/components/ui/Button";
import { CatalogRail } from "@/features/catalog/CatalogRail";
import { FeaturedTitle } from "@/features/catalog/FeaturedTitle";
import { useFavoriteContext } from "@/features/favorites/useFavoriteContext";
import { daysUntil, formatCountdown, formatShortDate } from "@/lib/dates";
import {
  comingSoonQuery,
  nowPlayingQuery,
  topRatedQuery,
  trendingQuery,
} from "@/services/tmdb/queries";
import type { MovieSummary, TvSummary } from "@/types/tmdb";

const SeeAll = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="rounded-perf text-small font-semibold text-emulsion-muted underline decoration-frameline underline-offset-4 hover:text-emulsion hover:decoration-edge focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
  >
    {label}
  </Link>
);

// Only people with saved titles get "Para vos": guests never download it.
const ForYouRail = lazy(() => import("@/features/for-you/ForYouRail"));

const ForYou = () => {
  const { favorites } = useFavoriteContext();
  if (favorites.length === 0) return null;
  return (
    <Suspense fallback={null}>
      <ForYouRail />
    </Suspense>
  );
};

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
      <section
        aria-labelledby="what-to-watch"
        className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 border-b border-frameline pb-10"
      >
        <div className="grid max-w-[46rem] gap-2">
          <h2
            id="what-to-watch"
            className="font-display text-display-lg font-extrabold text-balance text-emulsion uppercase"
          >
            ¿No sabés qué ver?
          </h2>
          <p className="text-body-lg text-emulsion-muted">
            Contestá seis preguntas (con quién, cuánto tiempo, qué ganas, dónde) y te armamos la
            función: diez títulos ordenados para vos, con el porqué de cada uno.
          </p>
        </div>
        <ButtonLink to={paths.recommender}>Armar mi función</ButtonLink>
      </section>
      <CatalogRail
        title="En cartel"
        mediaType="movie"
        query={nowPlayingQuery()}
        action={<SeeAll to={paths.movies} label="Ver películas" />}
        eager
      />
      <ForYou />
      <CatalogRail
        title="Próximamente"
        mediaType="movie"
        query={comingSoonQuery()}
        action={<SeeAll to={paths.releases} label="Ver estrenos" />}
        edge={(movie) => [
          { label: formatShortDate(movie.release_date), emphasis: true },
          { label: formatCountdown(daysUntil(movie.release_date) ?? 0) },
        ]}
      />
      <CatalogRail
        title="Series de la semana"
        mediaType="tv"
        query={trendingQuery<TvSummary>("tv")}
        action={<SeeAll to={paths.series} label="Ver series" />}
      />
      <CatalogRail
        title="Mejor puntuadas"
        mediaType="movie"
        query={topRatedQuery<MovieSummary>("movie")}
      />
    </div>
  </>
);

export default HomePage;
