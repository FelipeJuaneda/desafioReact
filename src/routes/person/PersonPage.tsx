import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { paths } from "@/app/paths";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EdgeCode } from "@/components/ui/EdgeCode";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatePanel } from "@/components/ui/StatePanel";
import { TitleGrid } from "@/features/catalog/TitleGrid";
import { departmentLabel, knownFor, personQuery } from "@/features/people/person";
import { formatDate, formatYear } from "@/lib/format";
import { idFromSlug } from "@/lib/slug";
import { TmdbError } from "@/services/tmdb/client";
import { tmdbImage } from "@/services/tmdb/images";

const BIO_PREVIEW = 600;

const PersonView = ({ id, slug }: { id: string; slug: string }) => {
  const { data: person, isPending, error, refetch } = useQuery(personQuery(id));
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  // Canonical URL: /persona/287 -> /persona/287-brad-pitt, without a history entry.
  useEffect(() => {
    if (!person) return;
    const canonical = paths.person(person.id, person.name);
    if (!canonical.endsWith(`/${slug}`))
      navigate(canonical, { replace: true, preventScrollReset: true });
  }, [person, slug, navigate]);

  if (isPending) {
    return (
      <div
        aria-busy="true"
        aria-label="Cargando persona"
        className="grid gap-6 md:grid-cols-[15rem_1fr]"
      >
        <Skeleton className="aspect-2/3 w-48 rounded-aperture md:w-full" />
        <div className="grid content-start gap-3">
          <Skeleton className="h-14 w-2/3" />
          <Skeleton className="h-3.5 w-64" />
          <Skeleton className="h-4 w-full max-w-[65ch]" />
        </div>
      </div>
    );
  }

  if (error instanceof TmdbError && error.status === 404) {
    return (
      <StatePanel
        title="No encontramos a esta persona"
        action={
          <ButtonLink variant="secondary" to={paths.search()}>
            Buscar a alguien
          </ButtonLink>
        }
      >
        Puede que el enlace esté mal. Probá buscarla por nombre.
      </StatePanel>
    );
  }

  if (!person) {
    return (
      <StatePanel
        role="alert"
        title="Se cortó la proyección"
        action={<Button onClick={() => void refetch()}>Reintentar</Button>}
      >
        No pudimos traer esta página. Revisá tu conexión y volvé a intentar.
      </StatePanel>
    );
  }

  const bio = person.biography.trim();
  const longBio = bio.length > BIO_PREVIEW;
  const titles = knownFor(person);
  const born = formatDate(person.birthday);

  return (
    <>
      <title>{`${person.name} · PelicuLed`}</title>
      {bio && <meta name="description" content={bio.slice(0, 160)} />}
      <div className="grid gap-x-10 gap-y-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
        <div className="aspect-2/3 w-48 overflow-hidden rounded-aperture bg-acetate-raised outline -outline-offset-1 outline-frameline md:w-full">
          {person.profile_path && (
            <img
              src={tmdbImage(person.profile_path, 342)}
              srcSet={`${tmdbImage(person.profile_path, 185)} 185w, https://image.tmdb.org/t/p/h632${person.profile_path} 421w`}
              sizes="(min-width: 768px) 240px, 192px"
              alt={`Retrato de ${person.name}`}
              className="size-full object-cover"
            />
          )}
        </div>
        <div className="grid content-start gap-4">
          <h1 className="font-display text-display-xl font-extrabold text-balance uppercase">
            {person.name}
          </h1>
          <EdgeCode
            items={[
              { label: departmentLabel(person.known_for_department), emphasis: true },
              born && { label: `Nació el ${born}` },
              person.place_of_birth && { label: person.place_of_birth },
              person.deathday && { label: `Murió en ${formatYear(person.deathday)}` },
            ]}
          />
          {bio ? (
            <div className="max-w-[65ch] text-body-lg text-emulsion-muted">
              <p id="person-bio" className="whitespace-pre-line">
                {expanded || !longBio ? bio : `${bio.slice(0, BIO_PREVIEW).trimEnd()}…`}
              </p>
              {longBio && (
                <Button
                  variant="ghost"
                  size="sm"
                  aria-expanded={expanded}
                  aria-controls="person-bio"
                  onClick={() => setExpanded((value) => !value)}
                  className="mt-2 -ml-4"
                >
                  {expanded ? "Leer menos" : "Leer biografía completa"}
                </Button>
              )}
            </div>
          ) : (
            <p className="text-body text-emulsion-muted">
              TMDB todavía no tiene su biografía en español.
            </p>
          )}
        </div>
      </div>

      {titles.length > 0 && (
        <section aria-labelledby="known-for" className="pt-14">
          <h2 id="known-for" className="mb-6 font-display text-display-lg font-extrabold uppercase">
            Filmografía destacada
          </h2>
          <TitleGrid
            mediaType={(item) => titles.find((t) => t.item === item)?.mediaType ?? "movie"}
            items={titles.map((t) => t.item)}
          />
        </section>
      )}
    </>
  );
};

const PersonPage = () => {
  const { slug = "" } = useParams();
  const id = idFromSlug(slug);
  return (
    <div className="mx-auto max-w-(--container-reel) px-(--spacing-gutter) pt-8 lg:pt-12">
      {id ? (
        <PersonView key={id} id={id} slug={slug} />
      ) : (
        <StatePanel title="No encontramos a esta persona">Revisá el enlace.</StatePanel>
      )}
    </div>
  );
};

export default PersonPage;
