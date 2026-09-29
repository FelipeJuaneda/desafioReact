import { Outlet, ScrollRestoration } from "react-router";
import { SiteHeader } from "@/layouts/SiteHeader";
import { TabBar } from "@/layouts/TabBar";

const SiteFooter = () => (
  <footer className="mx-auto mt-16 flex max-w-(--container-reel) flex-wrap justify-between gap-x-6 gap-y-2 border-t border-frameline px-(--spacing-gutter) pt-6 pb-8 text-small text-emulsion-subtle">
    <p>PelicuLed · catálogo de películas y series para decidir qué ver.</p>
    <p>
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
      <Outlet />
    </main>
    <SiteFooter />
    <TabBar />
    <ScrollRestoration />
  </div>
);
