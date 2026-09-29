import { Link } from "react-router";
import { paths } from "@/app/paths";
import { Rail } from "@/components/ui/Rail";
import { tmdbImage } from "@/services/tmdb/images";
import type { CastMember } from "@/types/tmdb";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

const PersonFrame = ({ person }: { person: CastMember }) => (
  <Link
    to={paths.person(person.id, person.name)}
    className="group grid gap-2 rounded-aperture focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-edge"
  >
    <div className="relative aspect-2/3 overflow-hidden rounded-aperture bg-acetate-raised outline -outline-offset-1 outline-frameline">
      {person.profile_path ? (
        <img
          src={tmdbImage(person.profile_path, 185)}
          srcSet={`${tmdbImage(person.profile_path, 185)} 185w, https://image.tmdb.org/t/p/h632${person.profile_path} 421w`}
          sizes="(min-width: 1440px) 160px, (min-width: 1280px) 12vw, (min-width: 1024px) 14vw, (min-width: 768px) 16vw, (min-width: 640px) 24vw, 31vw"
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="absolute inset-0 grid place-items-center font-display text-4xl font-extrabold text-emulsion-subtle"
        >
          {initials(person.name)}
        </span>
      )}
    </div>
    <span className="text-body leading-tight font-semibold text-emulsion decoration-edge decoration-2 underline-offset-4 group-hover:underline">
      {person.name}
    </span>
    {person.character && (
      <span className="text-small leading-snug text-emulsion-muted">{person.character}</span>
    )}
  </Link>
);

export const CastRail = ({ cast }: { cast: CastMember[] }) =>
  cast.length > 0 ? (
    <Rail
      title="Reparto"
      density="people"
      items={cast.slice(0, 20)}
      getKey={(person) => person.id}
      renderItem={(person) => <PersonFrame person={person} />}
    />
  ) : null;
