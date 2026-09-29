import "@fontsource-variable/sofia-sans";
import "@fontsource-variable/sofia-sans-extra-condensed";
import "@fontsource-variable/martian-mono/wdth.css";
import "@/styles/index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Toaster } from "sonner";
import { MotionProvider } from "@/app/MotionProvider";
import { queryClient } from "@/app/queryClient";
import { routes } from "@/app/routes";
import AuthProvider from "@/features/auth/AuthProvider";
import FavoritesProvider from "@/features/favorites/FavoritesProvider";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root element in index.html");

const router = createBrowserRouter(routes);

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <MotionProvider>
            <Toaster theme="dark" position="bottom-center" closeButton />
            <RouterProvider router={router} />
          </MotionProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
