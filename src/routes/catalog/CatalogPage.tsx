import { RiArrowDownSLine } from "@remixicon/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EdgeCode } from "@/components/ui/EdgeCode";
import { StatePanel } from "@/components/ui/StatePanel";
import { TitleGrid, TitleGridSkeleton } from "@/features/catalog/TitleGrid";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";
import { catalogQuery, genresQuery, type CatalogSort } from "@/services/tmdb/queries";
import type { MediaType, MovieSummary, TvSummary } from "@/types/tmdb";

const SORTS: Array<{ value: CatalogSort; label: string }> = [
  { value: "populares", label: "Más populares" },
  { value: "puntuadas", label: "Mejor puntuadas" },
  { value: "recientes", label: "Más recientes" },
];

const COPY: Record<MediaType, { title: string; noun: string; description: string }> = {
  movie: {
    title: "Películas",
    noun: "películas",
    description: "Explorá películas por género, popularidad, puntaje o estreno.",
  },
  tv: {
    title: "Series",
    noun: "series",
    description: "Explorá series por género, popularidad, puntaje o estreno.",
  },
};

const chipClasses = (active: boolean) =>
  cn(
    "inline-flex min-h-11 shrink-0 items-center rounded-perf border px-3.5 text-small font-semibold whitespace-nowrap",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge",
    active
      ? "border-edge bg-acetate-raised text-emulsion shadow-[inset_0_-2px_0_var(--color-edge)]"
      : "border-frameline bg-acetate text-emulsion-muted hover:border-control-line hover:text-emulsion",
  );

export const CatalogPage = ({ mediaType }: { mediaType: MediaType }) => {
  const [params, setParams] = useSearchParams();
  const genre = params.get("genero") ?? undefined;
  const sortParam = params.get("orden");
  const sort: CatalogSort = SORTS.some((s) => s.value === sortParam)
    ? (sortParam as CatalogSort)
    : "populares";
  const copy = COPY[mediaType];

  const { data: genres = [] } = useQuery(genresQuery(mediaType));
  const catalog = useInfiniteQuery(
    catalogQuery<MovieSummary | TvSummary>(mediaType, { genre, sort }),
  );

  const items = catalog.data?.pages.flatMap((page) => page.results) ?? [];
  // De-duplicate: TMDB popularity shifts between pages can repeat a title.
  const unique = [...new Map(items.map((item) => [item.id, item])).values()];
  const total = catalog.data?.pages[0]?.total_results ?? 0;
  const genreName = genres.find((g) => String(g.id) === genre)?.name;

  const withParam = (name: string, value?: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    return `?${next.toString()}`;
  };

  const heading = genreName ? `${copy.title} de ${genreName.toLowerCase()}` : copy.title;

  return (
    <div className="mx-auto max-w-(--container-reel) px-(--spacing-gutter) pt-8 lg:pt-12">
      <title>{`${heading} · PelicuLed`}</title>
      <meta name="description" content={copy.description} />

      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-frameline pb-6">
        <div>
          <h1 className="font-display text-display-xl font-extrabold text-balance uppercase">
            {heading}
          </h1>
          {total > 0 && (
            <EdgeCode
              className="mt-3"
              items={[{ label: `${formatCount(total)} ${copy.noun}`, emphasis: true }]}
            />
          )}
        </div>
        <label className="grid gap-1.5 text-small font-semibold text-emulsion-muted">
          Ordenar por
          <span className="relative grid">
            <select
              value={sort}
              onChange={(event) =>
                setParams(
                  (current) => {
                    const next = new URLSearchParams(current);
                    if (event.target.value === "populares") next.delete("orden");
                    else next.set("orden", event.target.value);
                    return next;
                  },
                  { preventScrollReset: true },
                )
              }
              className="min-h-11 appearance-none rounded-aperture border border-control-line bg-acetate py-2 pr-10 pl-3 text-body font-normal text-emulsion hover:border-emulsion-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <RiArrowDownSLine
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-2.5 size-5 -translate-y-1/2 text-emulsion-muted"
            />
          </span>
        </label>
      </div>

      {genres.length > 0 && (
        <nav aria-label="Géneros" className="-mx-(--spacing-gutter) mt-5 overflow-x-auto">
          <ul className="flex gap-2 px-(--spacing-gutter) pb-1">
            <li>
              <Link
                to={withParam("genero")}
                aria-current={!genre ? "true" : undefined}
                preventScrollReset
                className={chipClasses(!genre)}
              >
                Todos
              </Link>
            </li>
            {genres.map((g) => {
              const active = String(g.id) === genre;
              return (
                <li key={g.id}>
                  <Link
                    to={withParam("genero", String(g.id))}
                    aria-current={active ? "true" : undefined}
                    preventScrollReset
                    className={chipClasses(active)}
                  >
                    {g.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <div className="pt-8">
        {/* Names the grid for heading navigation (cards are h3) without repeating it on screen. */}
        <h2 className="sr-only">{SORTS.find((option) => option.value === sort)?.label}</h2>
        {catalog.isPending ? (
          <TitleGridSkeleton />
        ) : catalog.isError ? (
          <StatePanel
            role="alert"
            title="Se cortó la proyección"
            action={<Button onClick={() => void catalog.refetch()}>Reintentar</Button>}
          >
            No pudimos traer el catálogo. Revisá tu conexión y volvé a intentar.
          </StatePanel>
        ) : unique.length === 0 ? (
          <StatePanel
            title="Rollo vacío"
            action={
              <ButtonLink variant="secondary" to={withParam("genero")}>
                Ver todas
              </ButtonLink>
            }
          >
            No hay {copy.noun} para este filtro todavía.
          </StatePanel>
        ) : (
          <>
            <TitleGrid mediaType={mediaType} items={unique} />
            <div className="mt-10 grid justify-items-center gap-3">
              <p role="status" className="text-small text-emulsion-muted">
                Mostrando {formatCount(unique.length)} de {formatCount(total)}
              </p>
              {catalog.hasNextPage && (
                <Button
                  variant="secondary"
                  disabled={catalog.isFetchingNextPage}
                  onClick={() => void catalog.fetchNextPage()}
                >
                  {catalog.isFetchingNextPage ? "Cargando…" : `Cargar más ${copy.noun}`}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
