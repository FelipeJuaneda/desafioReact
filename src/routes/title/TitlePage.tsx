import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { paths } from "@/app/paths";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatePanel } from "@/components/ui/StatePanel";
import { CastRail } from "@/features/title/CastRail";
import { TitleFacts } from "@/features/title/TitleFacts";
import { TitleHero } from "@/features/title/TitleHero";
import { TrailerDialog } from "@/features/title/TrailerDialog";
import { pickTrailer, useTitle } from "@/features/title/useTitle";
import { VideoGallery } from "@/features/title/VideoGallery";
import { formatYear } from "@/lib/format";
import { idFromSlug } from "@/lib/slug";
import { getTitle, type MediaType, type Video } from "@/types/tmdb";

const TitleSkeleton = () => (
  <div
    aria-busy="true"
    aria-label="Cargando ficha"
    className="mx-auto grid max-w-(--container-reel) gap-7 px-(--spacing-gutter) pt-6 lg:pt-10"
  >
    <Skeleton className="aspect-video w-full rounded-aperture lg:aspect-[2.39/1]" />
    <div className="grid gap-3">
      <Skeleton className="h-14 w-2/3" />
      <Skeleton className="h-3.5 w-72" />
      <Skeleton className="h-4 w-full max-w-[65ch]" />
      <Skeleton className="h-4 w-5/6 max-w-[65ch]" />
    </div>
  </div>
);

const Missing = ({ mediaType }: { mediaType: MediaType }) => (
  <div className="mx-auto max-w-(--container-reel) px-(--spacing-gutter) pt-12">
    <title>Título no encontrado · PelicuLed</title>
    <StatePanel
      title="Este título no está en el rollo"
      action={
        <ButtonLink variant="secondary" to={paths.catalog(mediaType)}>
          {mediaType === "movie" ? "Explorar películas" : "Explorar series"}
        </ButtonLink>
      }
    >
      Puede que el enlace esté mal o que TMDB lo haya retirado.
    </StatePanel>
  </div>
);

const TitleView = ({ mediaType, id, slug }: { mediaType: MediaType; id: string; slug: string }) => {
  const { detail, credits, videos, notFound } = useTitle(mediaType, id);
  const [playing, setPlaying] = useState<Video | null>(null);
  const navigate = useNavigate();
  const title = detail.data;

  // Canonical URL: /pelicula/550 -> /pelicula/550-el-club-de-la-lucha, without a history entry.
  useEffect(() => {
    if (!title) return;
    const canonical = paths.title(mediaType, title.id, getTitle(title));
    if (!canonical.endsWith(`/${slug}`))
      navigate(canonical, { replace: true, preventScrollReset: true });
  }, [title, mediaType, slug, navigate]);

  if (detail.isPending) return <TitleSkeleton />;
  if (notFound) return <Missing mediaType={mediaType} />;
  if (detail.isError || !title) {
    return (
      <div className="mx-auto max-w-(--container-reel) px-(--spacing-gutter) pt-12">
        <StatePanel
          role="alert"
          title="Se cortó la proyección"
          action={<Button onClick={() => void detail.refetch()}>Reintentar</Button>}
        >
          No pudimos traer esta ficha. Revisá tu conexión y volvé a intentar.
        </StatePanel>
      </div>
    );
  }

  const name = getTitle(title);
  const year = formatYear("release_date" in title ? title.release_date : title.first_air_date);
  const trailer = pickTrailer(videos);

  return (
    <>
      <title>{`${name}${year ? ` (${year})` : ""} · PelicuLed`}</title>
      {title.overview && <meta name="description" content={title.overview.slice(0, 160)} />}
      <TitleHero
        mediaType={mediaType}
        title={title}
        onPlayTrailer={trailer ? () => setPlaying(trailer) : undefined}
      />
      <div className="mx-auto grid max-w-(--container-reel) gap-14 px-(--spacing-gutter) pt-14">
        <CastRail cast={credits?.cast ?? []} />
        <VideoGallery videos={videos} onPlay={setPlaying} />
        <TitleFacts title={title} credits={credits} />
      </div>
      <TrailerDialog video={playing} onClose={() => setPlaying(null)} />
    </>
  );
};

export const TitlePage = ({ mediaType }: { mediaType: MediaType }) => {
  const { slug = "" } = useParams();
  const id = idFromSlug(slug);
  if (!id) return <Missing mediaType={mediaType} />;
  // Keyed by id so moving between titles resets trailer state and scroll-driven UI.
  return <TitleView key={id} mediaType={mediaType} id={id} slug={slug} />;
};
