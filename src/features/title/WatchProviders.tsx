import { RiExternalLinkLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/Skeleton";
import { tmdbImage } from "@/services/tmdb/images";
import { watchProvidersQuery } from "@/services/tmdb/queries";
import type { MediaType } from "@/types/tmdb";
import { groupOffer } from "./providers";

const codeClasses =
  "font-code text-code font-medium text-emulsion-muted uppercase [font-stretch:75%]";

interface WatchProvidersProps {
  mediaType: MediaType;
  id: number;
  /** Shown instead of "not on streaming" while the film is still to open in cinemas. */
  upcomingNote?: string;
}

/**
 * "Dónde verla": the Argentine offer, grouped the way people decide (already paying for it,
 * rent, buy). TMDB has no per-service deep links, so one link goes to the full list.
 */
export const WatchProviders = ({ mediaType, id, upcomingNote }: WatchProvidersProps) => {
  const { data: offer, isPending, isError } = useQuery(watchProvidersQuery(mediaType, String(id)));
  const groups = groupOffer(offer);

  return (
    <section aria-labelledby="where-to-watch" className="grid gap-3 border-t border-frameline pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id="where-to-watch" className="text-title font-bold text-emulsion">
          Dónde verla
        </h2>
        <p className={codeClasses}>En Argentina · Datos de JustWatch</p>
      </div>

      {isPending ? (
        <div aria-busy="true" aria-label="Cargando dónde verla" className="flex gap-2">
          <Skeleton className="h-9 w-32 rounded-aperture" />
          <Skeleton className="h-9 w-28 rounded-aperture" />
        </div>
      ) : isError ? (
        <p className="text-small text-emulsion-muted">
          No pudimos traer las plataformas. Probá de nuevo en un rato.
        </p>
      ) : groups.length === 0 ? (
        <p className="text-body text-emulsion-muted">
          {upcomingNote ?? "Por ahora no está en plataformas de Argentina."}
        </p>
      ) : (
        <>
          <dl className="grid gap-3">
            {groups.map((group) => (
              <div
                key={group.kind}
                className="grid gap-2 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center"
              >
                <dt className={codeClasses}>{group.label}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-x-6 gap-y-3">
                    {group.providers.map((provider) => (
                      <li
                        key={provider.provider_id}
                        className="flex items-center gap-2.5 text-small font-semibold text-emulsion"
                      >
                        {provider.logo_path ? (
                          <img
                            src={tmdbImage(provider.logo_path, 92)}
                            alt=""
                            width={36}
                            height={36}
                            loading="lazy"
                            className="size-9 rounded-aperture outline outline-1 -outline-offset-1 outline-frameline"
                          />
                        ) : (
                          <span aria-hidden className="size-9 rounded-aperture bg-acetate-raised" />
                        )}
                        {provider.provider_name}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
          {offer?.link && (
            <a
              href={offer.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 justify-self-start rounded-perf text-small font-semibold text-emulsion underline decoration-frameline underline-offset-4 hover:decoration-edge focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge [&_svg]:size-4"
            >
              Ver precios y enlaces
              <RiExternalLinkLine aria-hidden />
              <span className="sr-only">(se abre en TMDB, en otra pestaña)</span>
            </a>
          )}
        </>
      )}
    </section>
  );
};
