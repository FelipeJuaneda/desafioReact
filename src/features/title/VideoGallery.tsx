import { RiPlayFill } from "@remixicon/react";
import { EdgeCode } from "@/components/ui/EdgeCode";
import { AUDIO_LABELS, audioVersion } from "@/features/title/videos";
import type { Video } from "@/types/tmdb";

const LABELS: Record<string, string> = {
  Trailer: "Tráiler",
  Teaser: "Avance",
  Clip: "Escena",
  Featurette: "Detrás de escena",
  "Behind the Scenes": "Detrás de escena",
};

/** Video thumbnails; the player opens in a dialog so the page does not load YouTube upfront. */
export const VideoGallery = ({
  videos,
  onPlay,
}: {
  videos: Video[];
  onPlay: (video: Video) => void;
}) =>
  videos.length > 0 ? (
    <section aria-labelledby="title-videos">
      <h2 id="title-videos" className="font-display text-display-lg font-extrabold uppercase">
        Tráileres y videos
      </h2>
      <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.slice(0, 6).map((video) => (
          <li key={video.id}>
            <button
              type="button"
              onClick={() => onPlay(video)}
              className="group grid w-full gap-2.5 rounded-aperture text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-edge"
            >
              <span className="relative block aspect-video overflow-hidden rounded-aperture bg-acetate-raised">
                <img
                  src={`https://i.ytimg.com/vi/${video.key}/mqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover opacity-85 transition-opacity duration-(--duration-fast) group-hover:opacity-100"
                />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-14 place-items-center rounded-full bg-edge text-on-edge">
                    <RiPlayFill aria-hidden className="size-7" />
                  </span>
                </span>
              </span>
              {/* Type and audio version, so it is clear before playing: "Tráiler · Latino". */}
              <EdgeCode
                items={[
                  { label: LABELS[video.type] ?? video.type, emphasis: true },
                  { label: AUDIO_LABELS[audioVersion(video)] },
                ]}
              />
              <span className="text-body leading-tight font-semibold text-emulsion">
                {video.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  ) : null;
