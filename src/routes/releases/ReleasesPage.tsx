import { useQuery } from "@tanstack/react-query";
import { m } from "motion/react";
import { paths } from "@/app/paths";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EdgeCode } from "@/components/ui/EdgeCode";
import { Skeleton, TitleCardSkeleton } from "@/components/ui/Skeleton";
import { StatePanel } from "@/components/ui/StatePanel";
import { TitleCard } from "@/features/catalog/TitleCard";
import { GRID_POSTER_SIZES } from "@/features/catalog/TitleGrid";
import { ReminderButton } from "@/features/releases/ReminderButton";
import { groupByReleaseDay, type ReleaseDay } from "@/features/releases/schedule";
import { cn } from "@/lib/cn";
import { dateStamp, daysUntil, formatCountdown } from "@/lib/dates";
import { formatDate } from "@/lib/format";
import { RISE } from "@/lib/motion";
import { genresQuery, upcomingReleasesQuery } from "@/services/tmdb/queries";
import type { MovieSummary } from "@/types/tmdb";

const DAY_GRID =
  "grid gap-x-8 gap-y-5 md:grid-cols-[8.5rem_minmax(0,1fr)] lg:grid-cols-[10rem_minmax(0,1fr)]";
const FILM_GRID =
  "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

/**
 * The day stamp, printed like the date on a release sheet: weekday and month in edge code, the
 * day in can-label figures. Sticky, so a long day keeps its date in view; on phones it is one
 * band, flush under the header.
 */
const DayStamp = ({ date }: { date: string }) => {
  const { weekday, day, month } = dateStamp(date);
  const days = daysUntil(date) ?? 0;
  return (
    <div className="sticky top-(--header-height) z-(--z-raised) -mx-(--spacing-gutter) flex items-baseline gap-3 self-start border-b border-frameline bg-leader px-(--spacing-gutter) py-2 md:top-[calc(var(--header-height)+1.5rem)] md:mx-0 md:grid md:justify-items-start md:gap-1 md:border-0 md:p-0">
      <h2 className="flex items-baseline gap-2 md:grid md:gap-0">
        <span className="sr-only">{formatDate(date)}</span>
        <span
          aria-hidden
          className="font-code text-code font-medium text-emulsion-muted uppercase [font-stretch:75%]"
        >
          {weekday}
        </span>
        <span
          aria-hidden
          className="font-display text-4xl leading-none font-extrabold text-emulsion tabular-nums md:text-7xl"
        >
          {day}
        </span>
        <span
          aria-hidden
          className="font-code text-code font-medium text-emulsion-muted uppercase [font-stretch:75%]"
        >
          {month}
        </span>
      </h2>
      <p
        className={cn(
          "ml-auto font-code text-code font-medium uppercase [font-stretch:75%] md:ml-0 md:pt-2",
          days <= 7 ? "text-edge" : "text-emulsion-muted",
        )}
      >
        {formatCountdown(days)}
      </p>
    </div>
  );
};

const ReleaseDayRow = ({
  day,
  genreNames,
  first,
}: {
  day: ReleaseDay;
  genreNames: Map<number, string>;
  first: boolean;
}) => (
  <m.li
    className={DAY_GRID}
    initial={first ? false : RISE.initial}
    whileInView={RISE.animate}
    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    transition={RISE.transition}
  >
    <DayStamp date={day.date} />
    <ul className={FILM_GRID}>
      {day.movies.map((movie: MovieSummary, index) => (
        <li key={movie.id} className="grid content-start gap-3">
          <TitleCard
            mediaType="movie"
            item={movie}
            sizes={GRID_POSTER_SIZES}
            priority={first && index < 4}
            edge={(movie.genre_ids ?? [])
              .slice(0, 2)
              .map((id) => genreNames.get(id))
              .filter(Boolean)
              .map((label) => ({ label }))}
          />
          <ReminderButton
            size="sm"
            className="w-full"
            event={{
              id: movie.id,
              title: movie.title,
              date: movie.release_date,
              url: `${window.location.origin}${paths.title("movie", movie.id, movie.title)}`,
            }}
          />
        </li>
      ))}
    </ul>
  </m.li>
);

const ScheduleSkeleton = () => (
  <div aria-busy="true" aria-label="Cargando estrenos" className="grid gap-14">
    {[4, 3].map((count, i) => (
      <div key={i} className={DAY_GRID}>
        <div className="grid content-start gap-1.5">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-10 w-16 md:h-16" />
          <Skeleton className="h-3 w-10" />
        </div>
        <div className={FILM_GRID}>
          {Array.from({ length: count }, (_, j) => (
            <div key={j} className="grid content-start gap-3">
              <TitleCardSkeleton />
              <Skeleton className="h-11 w-full rounded-aperture" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const ReleasesPage = () => {
  const { data, isPending, isError, refetch } = useQuery(upcomingReleasesQuery());
  const genres = useQuery(genresQuery("movie"));
  const genreNames = new Map((genres.data ?? []).map((g) => [g.id, g.name]));
  const days = data ? groupByReleaseDay(data) : [];
  const films = days.reduce((sum, day) => sum + day.movies.length, 0);

  return (
    <div className="mx-auto grid max-w-(--container-reel) gap-10 px-(--spacing-gutter) pt-8 pb-6 lg:pt-12">
      <title>Próximos estrenos en cines · PelicuLed</title>
      <meta
        name="description"
        content="Las películas que llegan a los cines de Argentina en los próximos meses, día por día, con aviso en tu calendario."
      />
      <header className="grid gap-3">
        <h1 className="font-display text-display-xl font-extrabold text-balance text-emulsion uppercase">
          Próximos estrenos
        </h1>
        <p className="max-w-[60ch] text-body-lg text-emulsion-muted">
          Lo que llega a los cines de Argentina, día por día. Tocá «Avisame» y el estreno queda en
          tu calendario.
        </p>
        {days.length > 0 && (
          <EdgeCode
            items={[
              { label: `${films} películas`, emphasis: true },
              { label: `${days.length} fechas` },
              { label: "Próximos 4 meses" },
            ]}
          />
        )}
      </header>

      {isPending ? (
        <ScheduleSkeleton />
      ) : isError ? (
        <StatePanel
          role="alert"
          title="Se cortó la proyección"
          action={<Button onClick={() => void refetch()}>Reintentar</Button>}
        >
          No pudimos traer los estrenos. Revisá tu conexión y volvé a intentar.
        </StatePanel>
      ) : days.length === 0 ? (
        <StatePanel
          title="Todavía no hay estrenos anunciados"
          action={
            <ButtonLink variant="secondary" to={paths.movies}>
              Explorar películas
            </ButtonLink>
          }
        >
          Cuando se confirmen fechas en Argentina, van a aparecer acá.
        </StatePanel>
      ) : (
        <ol aria-label="Estrenos por fecha" className="grid gap-14">
          {days.map((day, index) => (
            <ReleaseDayRow key={day.date} day={day} genreNames={genreNames} first={index === 0} />
          ))}
        </ol>
      )}
    </div>
  );
};

export default ReleasesPage;
