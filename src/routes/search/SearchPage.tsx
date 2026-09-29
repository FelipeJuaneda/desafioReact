import { RiSearchLine } from "@remixicon/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { paths } from "@/app/paths";
import { Button, ButtonLink } from "@/components/ui/Button";
import { StatePanel } from "@/components/ui/StatePanel";
import { CatalogRail } from "@/features/catalog/CatalogRail";
import { TitleGrid, TitleGridSkeleton } from "@/features/catalog/TitleGrid";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { formatCount } from "@/lib/format";
import { searchQuery, trendingQuery } from "@/services/tmdb/queries";
import type { MovieSummary, MultiSearchResult, TvSummary } from "@/types/tmdb";

type TitleResult = Extract<MultiSearchResult, { media_type: "movie" | "tv" }>;
type PersonResult = Extract<MultiSearchResult, { media_type: "person" }>;

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const urlQuery = params.get("q") ?? "";
  const [text, setText] = useState(urlQuery);
  const query = useDebouncedValue(text.trim(), 300);

  // Keep the URL in sync (shareable, back button works) without a history entry per keystroke.
  useEffect(() => {
    if (query === urlQuery) return;
    setParams(query ? { q: query } : {}, { replace: true, preventScrollReset: true });
  }, [query, urlQuery, setParams]);

  const search = useInfiniteQuery(searchQuery(query));
  const results = search.data?.pages.flatMap((page) => page.results) ?? [];
  const titles = results.filter(
    (r): r is TitleResult => r.media_type === "movie" || r.media_type === "tv",
  );
  const people = results.filter((r): r is PersonResult => r.media_type === "person");
  const total = search.data?.pages[0]?.total_results ?? 0;

  return (
    <div className="mx-auto max-w-(--container-reel) px-(--spacing-gutter) pt-8 lg:pt-12">
      <title>{query ? `“${query}” · Buscar · PelicuLed` : "Buscar · PelicuLed"}</title>

      <h1 className="font-display text-display-xl font-extrabold uppercase">Buscar</h1>
      <form role="search" className="relative mt-5 max-w-3xl" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="search-page-input" className="sr-only">
          Buscar películas, series y personas
        </label>
        <RiSearchLine
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-6 -translate-y-1/2 text-emulsion-muted"
        />
        <input
          id="search-page-input"
          type="search"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Una película, una serie, una persona…"
          autoComplete="off"
          enterKeyHint="search"
          className="min-h-14 w-full rounded-aperture border border-control-line bg-acetate py-3 pr-4 pl-13 text-body-lg text-emulsion placeholder:text-emulsion-subtle hover:border-emulsion-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
        />
      </form>

      <div className="pt-10">
        {!query ? (
          <CatalogRail<MovieSummary>
            title="Lo más visto esta semana"
            mediaType="movie"
            query={trendingQuery<MovieSummary>("movie")}
          />
        ) : search.isPending ? (
          <TitleGridSkeleton />
        ) : search.isError ? (
          <StatePanel
            role="alert"
            title="Se cortó la proyección"
            action={<Button onClick={() => void search.refetch()}>Reintentar</Button>}
          >
            No pudimos buscar en este momento. Revisá tu conexión y volvé a intentar.
          </StatePanel>
        ) : results.length === 0 ? (
          <StatePanel
            role="status"
            title={`Nada para “${query}”`}
            action={
              <div className="flex flex-wrap gap-3">
                <ButtonLink variant="secondary" to={paths.movies}>
                  Explorar películas
                </ButtonLink>
                <ButtonLink variant="secondary" to={paths.series}>
                  Explorar series
                </ButtonLink>
              </div>
            }
          >
            Revisá cómo está escrito o probá con el título original. También podés explorar por
            género.
          </StatePanel>
        ) : (
          <div className="grid gap-12">
            <p role="status" className="text-small text-emulsion-muted">
              {formatCount(total)} resultados para “{query}”
            </p>
            {people.length > 0 && (
              <section aria-labelledby="search-people">
                <h2
                  id="search-people"
                  className="font-display text-display-md font-extrabold uppercase"
                >
                  Personas
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {people.map((person) => (
                    <li key={person.id}>
                      <Link
                        to={paths.person(person.id, person.name)}
                        className="inline-flex min-h-11 items-center gap-2 rounded-perf border border-frameline bg-acetate px-3.5 text-small font-semibold text-emulsion hover:border-control-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
                      >
                        {person.name}
                        {person.known_for_department === "Directing" && (
                          <span className="text-emulsion-muted">· Dirección</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {titles.length > 0 && (
              <section aria-labelledby="search-titles">
                <h2 id="search-titles" className="sr-only">
                  Películas y series
                </h2>
                <TitleGrid
                  mediaType={(item) => (item as TitleResult).media_type}
                  items={titles as Array<MovieSummary | TvSummary>}
                />
              </section>
            )}
            {search.hasNextPage && (
              <div className="grid justify-items-center">
                <Button
                  variant="secondary"
                  disabled={search.isFetchingNextPage}
                  onClick={() => void search.fetchNextPage()}
                >
                  {search.isFetchingNextPage ? "Cargando…" : "Cargar más resultados"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
