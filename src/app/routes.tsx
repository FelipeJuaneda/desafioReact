import type { ComponentType } from "react";
import { Navigate, type RouteObject } from "react-router";
import { paths } from "@/app/paths";
import { RedirectWithId } from "@/app/redirects";
import RequireAuth from "@/features/auth/RequireAuth";
import { AppLayout } from "@/layouts/AppLayout";

/** Route-level code splitting: each screen is its own chunk. */
const page =
  <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) =>
  async () => ({ Component: (await load())[name] });

const defaultPage = (load: () => Promise<{ default: ComponentType }>) => page(load, "default");

const MyListPage = defaultPage(() => import("@/routes/my-list/FavoritesPage"));

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    // Shown while the first lazy screen loads: same ground as the app, no white flash.
    hydrateFallbackElement: <div className="min-h-dvh bg-leader" />,
    children: [
      { index: true, lazy: defaultPage(() => import("@/routes/home/HomePage")) },
      { path: "peliculas", lazy: defaultPage(() => import("@/routes/catalog/MoviesPage")) },
      { path: "series", lazy: defaultPage(() => import("@/routes/catalog/SeriesPage")) },
      { path: "pelicula/:slug", lazy: defaultPage(() => import("@/routes/title/MovieTitlePage")) },
      { path: "serie/:slug", lazy: defaultPage(() => import("@/routes/title/SeriesTitlePage")) },
      { path: "buscar", lazy: defaultPage(() => import("@/routes/search/SearchPage")) },
      {
        path: "mi-lista",
        lazy: async () => {
          const { Component } = await MyListPage();
          return {
            Component: () => (
              <RequireAuth>
                <Component />
              </RequireAuth>
            ),
          };
        },
      },
      { path: "ingresar", lazy: defaultPage(() => import("@/routes/auth/LoginPage")) },
      { path: "registro", lazy: defaultPage(() => import("@/routes/auth/RegisterPage")) },
      { path: "recuperar", lazy: defaultPage(() => import("@/routes/auth/RecoverPasswordPage")) },

      // Old English URLs, kept alive for shared links and bookmarks.
      { path: "popularFilms", element: <Navigate to={paths.movies} replace /> },
      { path: "popularTv", element: <Navigate to={paths.series} replace /> },
      { path: "popularPeople", element: <Navigate to={paths.home} replace /> },
      { path: "favoriteList", element: <Navigate to={paths.myList} replace /> },
      { path: "login", element: <Navigate to={paths.signIn} replace /> },
      { path: "register", element: <Navigate to={paths.signUp} replace /> },
      { path: "recoverPassword", element: <Navigate to={paths.recover} replace /> },
      { path: "film/:id", element: <RedirectWithId to={(id) => `/pelicula/${id}`} /> },
      { path: "tvShow/:id", element: <RedirectWithId to={(id) => `/serie/${id}`} /> },
      {
        path: "genre/:id",
        element: <RedirectWithId to={(id) => `${paths.movies}?genero=${id}`} />,
      },

      { path: "*", lazy: defaultPage(() => import("@/routes/not-found/NotFoundPage")) },
    ],
  },
];
