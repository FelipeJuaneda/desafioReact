import { RiCloseLine } from "@remixicon/react";
import { useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { paths } from "@/app/paths";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EdgeCode } from "@/components/ui/EdgeCode";
import { Poster } from "@/components/ui/Poster";
import { StatePanel } from "@/components/ui/StatePanel";
import type { Favorite } from "@/features/favorites/favorite";
import { useFavoriteContext } from "@/features/favorites/useFavoriteContext";
import { formatRating, formatYear } from "@/lib/format";
import type { MediaType } from "@/types/tmdb";

type Filter = "todo" | "peliculas" | "series";

const FILTERS: Array<{ value: Filter; label: string; mediaType?: MediaType }> = [
  { value: "todo", label: "Todo" },
  { value: "peliculas", label: "Películas", mediaType: "movie" },
  { value: "series", label: "Series", mediaType: "tv" },
];

const savedOn = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long" });

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const summary = (movies: number, series: number) => {
  const parts = [
    movies > 0 && plural(movies, "película", "películas"),
    series > 0 && plural(series, "serie", "series"),
  ].filter(Boolean);
  return `En tu cuenta: ${parts.join(" y ")}, a mano en cualquier dispositivo.`;
};

const Strip = ({ favorite, onRemove }: { favorite: Favorite; onRemove: () => void }) => {
  const href = paths.title(favorite.mediaType, favorite.tmdbId, favorite.title);
  return (
    <article className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-x-3 rounded-aperture bg-lt-surface p-3 shadow-strip sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:gap-x-5">
      <Link to={href} tabIndex={-1} aria-hidden className="block">
        <Poster path={favorite.posterPath} title={favorite.title} sizes="88px" />
      </Link>
      <div className="grid min-w-0 gap-2">
        <h2 className="font-display text-display-md font-extrabold text-balance uppercase">
          <Link
            to={href}
            className="rounded-perf hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lt-ink"
          >
            {favorite.title}
          </Link>
        </h2>
        <EdgeCode
          tone="lighttable"
          items={[
            { label: favorite.mediaType === "movie" ? "Película" : "Serie", emphasis: true },
            { label: formatYear(favorite.releaseDate) },
            { label: formatRating(favorite.voteAverage), emphasis: true },
          ]}
        />
        {favorite.addedAt && (
          <p className="text-small text-lt-muted">Guardada el {savedOn.format(favorite.addedAt)}</p>
        )}
      </div>
      <Button
        variant="secondary"
        size="sm"
        tone="lighttable"
        onClick={onRemove}
        aria-label={`Quitar "${favorite.title}" de Mi lista`}
        className="self-start max-sm:w-11 max-sm:px-0 sm:self-center"
      >
        <RiCloseLine aria-hidden />
        <span className="max-sm:hidden">Quitar</span>
      </Button>
    </article>
  );
};

const StripSkeleton = () => (
  <div
    aria-hidden
    className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-4 rounded-aperture bg-lt-surface p-3 shadow-strip sm:grid-cols-[5.5rem_minmax(0,1fr)]"
  >
    <div className="aspect-2/3 rounded-aperture bg-lt-line motion-safe:animate-expose-light" />
    <div className="grid gap-2.5">
      <div className="h-6 w-3/4 rounded-perf bg-lt-line motion-safe:animate-expose-light" />
      <div className="h-3 w-40 rounded-perf bg-lt-line motion-safe:animate-expose-light" />
    </div>
  </div>
);

const MyListPage = () => {
  const { favorites, status, addFavorite, removeFavorite } = useFavoriteContext();
  const [params, setParams] = useSearchParams();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const filter = FILTERS.find((f) => f.value === params.get("tipo")) ?? FILTERS[0]!;
  const movies = favorites.filter((f) => f.mediaType === "movie").length;
  const series = favorites.length - movies;
  const counts: Record<Filter, number> = { todo: favorites.length, peliculas: movies, series };
  const visible = filter.mediaType
    ? favorites.filter((f) => f.mediaType === filter.mediaType)
    : favorites;

  const remove = async (favorite: Favorite) => {
    const { mediaType, tmdbId, title, posterPath, releaseDate, voteAverage } = favorite;
    const input = { mediaType, tmdbId, title, posterPath, releaseDate, voteAverage };
    try {
      await removeFavorite(input.mediaType, input.tmdbId);
      // The strip (and its button) is gone: keep keyboard users anchored on the list.
      headingRef.current?.focus();
      toast(`Quitaste "${input.title}" de tu lista`, {
        action: { label: "Deshacer", onClick: () => void addFavorite(input) },
      });
    } catch {
      toast.error("No pudimos actualizar tu lista. Probá de nuevo en un momento.");
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-lt-ground text-lt-ink [color-scheme:light] selection:bg-lt-ink selection:text-lt-ground">
      <title>Mi lista · PelicuLed</title>
      <div className="mx-auto max-w-(--container-reel) px-(--spacing-gutter) pt-8 pb-16 lg:pt-12">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-display-xl font-extrabold uppercase outline-none"
        >
          Mi lista
        </h1>
        <p className="mt-2 max-w-[60ch] text-body-lg text-lt-muted">
          {status === "ready" && favorites.length > 0
            ? summary(movies, series)
            : "La mesa de luz: los títulos que guardás quedan en tu cuenta."}
        </p>

        {status === "loading" && (
          <div
            aria-busy="true"
            aria-label="Cargando tu lista"
            className="mt-8 grid gap-4 lg:grid-cols-2"
          >
            <StripSkeleton />
            <StripSkeleton />
            <StripSkeleton />
          </div>
        )}

        {status === "error" && (
          <StatePanel
            role="alert"
            tone="lighttable"
            title="No pudimos traer tu lista"
            className="mt-8"
            action={
              <Button tone="lighttable" onClick={() => window.location.reload()}>
                Recargar
              </Button>
            }
          >
            Revisá tu conexión. Lo que guardaste sigue en tu cuenta.
          </StatePanel>
        )}

        {status === "ready" && favorites.length === 0 && (
          <StatePanel
            tone="lighttable"
            title="Tu mesa de luz está vacía"
            className="mt-8"
            action={
              <ButtonLink tone="lighttable" to={paths.movies}>
                Explorar películas
              </ButtonLink>
            }
          >
            Tocá “Guardar” en cualquier película o serie y va a aparecer acá.
          </StatePanel>
        )}

        {status === "ready" && favorites.length > 0 && (
          <>
            <div role="group" aria-label="Filtrar por tipo" className="mt-7 flex flex-wrap gap-2">
              {FILTERS.map((option) => {
                const active = option.value === filter.value;
                return (
                  <Button
                    key={option.value}
                    variant="secondary"
                    size="sm"
                    tone="lighttable"
                    aria-pressed={active}
                    onClick={() =>
                      setParams(option.value === "todo" ? {} : { tipo: option.value }, {
                        replace: true,
                        preventScrollReset: true,
                      })
                    }
                  >
                    {option.label}
                    <span className="font-code text-code tabular-nums opacity-75">
                      {counts[option.value]}
                    </span>
                  </Button>
                );
              })}
            </div>

            {visible.length === 0 ? (
              <StatePanel
                tone="lighttable"
                title={
                  filter.mediaType === "tv"
                    ? "Todavía no guardaste series"
                    : "Todavía no guardaste películas"
                }
                className="mt-6"
                action={
                  <ButtonLink
                    tone="lighttable"
                    variant="secondary"
                    to={paths.catalog(filter.mediaType ?? "movie")}
                  >
                    {filter.mediaType === "tv" ? "Explorar series" : "Explorar películas"}
                  </ButtonLink>
                }
              />
            ) : (
              <ul className="mt-6 grid gap-4 lg:grid-cols-2">
                {visible.map((favorite) => (
                  <li key={favorite.id}>
                    <Strip favorite={favorite} onRemove={() => void remove(favorite)} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
