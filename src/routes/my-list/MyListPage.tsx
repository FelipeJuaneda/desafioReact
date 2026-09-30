import { RiArrowDownSLine } from "@remixicon/react";
import { AnimatePresence, m } from "motion/react";
import { useRef } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { paths } from "@/app/paths";
import { Button, ButtonLink } from "@/components/ui/Button";
import { StatePanel } from "@/components/ui/StatePanel";
import type { Favorite } from "@/features/favorites/favorite";
import { useFavoriteContext } from "@/features/favorites/useFavoriteContext";
import { ContactSheet, ContactSheetSkeleton } from "@/features/my-list/ContactSheet";
import { NextShowing, NextShowingSkeleton } from "@/features/my-list/NextShowing";
import {
  applySheet,
  frameNumbers,
  nextShowing,
  parseFilter,
  parseSort,
  SHEET_SORTS,
  TYPE_FILTERS,
  type SheetSort,
  type TypeFilter,
} from "@/features/my-list/sheet";
import { DURATION, EASE_OUT } from "@/lib/motion";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const summary = (movies: number, series: number) => {
  const parts = [
    movies > 0 && plural(movies, "película", "películas"),
    series > 0 && plural(series, "serie", "series"),
  ].filter(Boolean);
  return `${parts.join(" y ")} esperando función.`;
};

/** Three unexposed frames: the contact sheet before anything has been shot. */
const EmptySheet = () => (
  <div className="grid gap-8 border-t border-frameline pt-10 md:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] md:items-center md:gap-14">
    <div aria-hidden className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((n) => (
        <div key={n} className="grid gap-2">
          <span className="font-code text-code text-edge [font-stretch:75%]">0{n}</span>
          <div className="aspect-2/3 rounded-aperture border border-dashed border-control-line bg-acetate" />
        </div>
      ))}
    </div>
    <div className="grid justify-items-start gap-4">
      <h2 className="font-display text-display-lg font-extrabold text-balance uppercase">
        Todavía no hay nada en cartel
      </h2>
      <p className="max-w-[46ch] text-body-lg text-emulsion-muted">
        Tocá “Guardar” en cualquier película o serie: la última que guardes queda como tu próxima
        función y el resto arma tu selección.
      </p>
      <div className="flex flex-wrap gap-3 pt-1">
        <ButtonLink to={paths.movies}>Explorar películas</ButtonLink>
        <ButtonLink variant="secondary" to={paths.series}>
          Explorar series
        </ButtonLink>
      </div>
    </div>
  </div>
);

const MyListPage = () => {
  const { favorites, status, addFavorite, removeFavorite } = useFavoriteContext();
  const [params, setParams] = useSearchParams();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const filter = parseFilter(params.get("tipo"));
  const sort = parseSort(params.get("orden"));
  const frames = frameNumbers(favorites);
  const movies = favorites.filter((f) => f.mediaType === "movie").length;
  const series = favorites.length - movies;
  const counts: Record<TypeFilter, number> = { todo: favorites.length, peliculas: movies, series };

  const shown = applySheet(favorites, filter, sort);
  const featured = nextShowing(shown);
  const rest = shown.filter((favorite) => favorite !== featured);

  const setParam = (name: "tipo" | "orden", value: TypeFilter | SheetSort, fallback: string) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value === fallback) next.delete(name);
        else next.set(name, value);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );

  const remove = async (favorite: Favorite) => {
    const { mediaType, tmdbId, title, posterPath, releaseDate, voteAverage } = favorite;
    const input = { mediaType, tmdbId, title, posterPath, releaseDate, voteAverage };
    try {
      await removeFavorite(input.mediaType, input.tmdbId);
      // The frame (and its button) is gone: keep keyboard users anchored on the page, without
      // scrolling everyone back to the top (they would miss the strike and lose their place).
      headingRef.current?.focus({ preventScroll: true });
      toast(`Tachaste "${input.title}" de tu lista`, {
        action: { label: "Deshacer", onClick: () => void addFavorite(input) },
      });
    } catch {
      toast.error("No pudimos actualizar tu lista. Probá de nuevo en un momento.");
    }
  };

  const ready = status === "ready" && favorites.length > 0;

  return (
    <div className="mx-auto max-w-(--container-reel) px-(--spacing-gutter) pt-8 pb-16 lg:pt-12">
      <title>Mi lista · PelicuLed</title>

      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className="grid gap-3">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-display-xl font-extrabold uppercase outline-none"
          >
            Mi lista
          </h1>
          <p className="text-body-lg text-emulsion-muted">
            {ready
              ? summary(movies, series)
              : "Lo que guardás queda en tu cuenta, en cualquier dispositivo."}
          </p>
        </div>

        {ready && (
          <div className="flex flex-wrap items-end gap-3">
            <div role="group" aria-label="Filtrar por tipo" className="flex gap-2">
              {TYPE_FILTERS.map((option) => (
                <Button
                  key={option.value}
                  variant="secondary"
                  size="sm"
                  aria-pressed={option.value === filter}
                  onClick={() => setParam("tipo", option.value, "todo")}
                >
                  {option.label}
                  <span className="font-code text-code tabular-nums opacity-75">
                    {counts[option.value]}
                  </span>
                </Button>
              ))}
            </div>
            <label className="grid gap-1.5 text-small font-semibold text-emulsion-muted">
              Ordenar por
              <span className="relative grid">
                <select
                  value={sort}
                  onChange={(event) =>
                    setParam("orden", event.target.value as SheetSort, "recientes")
                  }
                  className="min-h-11 appearance-none rounded-aperture border border-control-line bg-acetate py-2 pr-10 pl-3 text-body font-normal text-emulsion hover:border-emulsion-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
                >
                  {SHEET_SORTS.map((option) => (
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
        )}
      </header>

      <div className="mt-10 grid gap-16 lg:mt-12">
        {status === "loading" && (
          <div aria-busy="true" aria-label="Cargando tu lista" className="grid gap-16">
            <NextShowingSkeleton />
            <ContactSheetSkeleton />
          </div>
        )}

        {status === "error" && (
          <StatePanel
            role="alert"
            title="No pudimos traer tu lista"
            action={<Button onClick={() => window.location.reload()}>Recargar</Button>}
          >
            Revisá tu conexión. Lo que guardaste sigue en tu cuenta.
          </StatePanel>
        )}

        {status === "ready" && favorites.length === 0 && <EmptySheet />}

        {ready && shown.length === 0 && (
          <StatePanel
            title={
              filter === "series" ? "Todavía no guardaste series" : "Todavía no guardaste películas"
            }
            action={
              <ButtonLink
                variant="secondary"
                to={filter === "series" ? paths.series : paths.movies}
              >
                {filter === "series" ? "Explorar series" : "Explorar películas"}
              </ButtonLink>
            }
          />
        )}

        {featured && (
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={featured.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: DURATION.base } }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT }}
            >
              <NextShowing
                favorite={featured}
                frame={frames.get(featured.id) ?? 1}
                onRemove={() => void remove(featured)}
              />
            </m.div>
          </AnimatePresence>
        )}

        {rest.length > 0 && (
          <section aria-labelledby="selection" className="grid gap-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-frameline pb-3">
              <h2 id="selection" className="font-display text-display-lg font-extrabold uppercase">
                Tu selección
              </h2>
              <p className="font-code text-code font-medium text-emulsion-subtle uppercase [font-stretch:75%]">
                {plural(rest.length, "cuadro", "cuadros")} · numerados en el orden en que los
                guardaste
              </p>
            </div>
            <ContactSheet
              favorites={rest}
              frames={frames}
              onRemove={(favorite) => void remove(favorite)}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
