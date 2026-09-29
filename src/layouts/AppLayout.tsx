import { m } from "motion/react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { SiteHeader } from "@/layouts/SiteHeader";
import { TabBar } from "@/layouts/TabBar";
import { RISE } from "@/lib/motion";

// "/pelicula/550" and "/pelicula/550-el-club-de-la-lucha" are the same screen: the canonical
// redirect must not replay the entrance.
const screenKey = (pathname: string) =>
  pathname.replace(/^(\/(?:pelicula|serie|persona)\/\d+).*$/, "$1");

/**
 * Each new screen settles in with a short rise. Only for navigations inside the app: the first
 * load paints immediately (no delay on LCP), and the poster-to-backdrop morph, which already
 * animates through the View Transitions API, is left alone.
 */
const ScreenTransition = () => {
  const location = useLocation();
  // React Router gives the entry the app loaded on the key "default"; navigations get new keys.
  const navigated = location.key !== "default";
  const animate = navigated && !(location.state as { morph?: boolean } | null)?.morph;

  return (
    <m.div key={screenKey(location.pathname)} {...RISE} initial={animate ? RISE.initial : false}>
      <Outlet />
    </m.div>
  );
};

const SiteFooter = () => (
  <footer className="mx-auto mt-16 grid max-w-(--container-reel) gap-4 border-t border-frameline px-(--spacing-gutter) pt-6 pb-8 text-small text-emulsion-subtle md:grid-cols-[auto_1fr] md:items-baseline md:gap-x-10">
    <p className="font-code text-code font-medium text-emulsion-muted uppercase [font-stretch:75%]">
      Hecho por{" "}
      <a
        href="https://github.com/FelipeJuaneda"
        rel="noreferrer"
        target="_blank"
        className="rounded-perf text-edge underline decoration-edge/40 underline-offset-4 hover:decoration-edge focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
      >
        Felipe Juaneda
      </a>
    </p>
    <p className="md:text-right">
      Datos e imágenes de{" "}
      <a
        href="https://www.themoviedb.org/"
        className="underline underline-offset-2 hover:text-emulsion"
        rel="noreferrer"
        target="_blank"
      >
        TMDB
      </a>
      . Este producto usa la API de TMDB pero no está avalado ni certificado por TMDB.
    </p>
  </footer>
);

/** Projection ground: every browsing screen lives here. */
export const AppLayout = () => (
  <div className="min-h-dvh bg-leader pb-[calc(3.5rem+env(safe-area-inset-bottom))] font-body text-emulsion md:pb-0">
    <a
      href="#contenido"
      className="sr-only z-(--z-toast) rounded-aperture bg-edge px-4 py-3 font-bold text-on-edge focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
    >
      Saltar al contenido
    </a>
    <SiteHeader />
    <main id="contenido" tabIndex={-1} className="outline-none">
      <ScreenTransition />
    </main>
    <SiteFooter />
    <TabBar />
    <ScrollRestoration />
  </div>
);
