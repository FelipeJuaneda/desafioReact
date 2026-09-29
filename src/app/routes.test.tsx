import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderApp } from "@/test/render";

vi.mock("@/services/firebase/app", () => ({ app: {}, auth: {}, db: {} }));
// Signed-in cases would open a Firestore listener; the list itself is tested elsewhere.
vi.mock("@/features/favorites/favoritesRepository", () => ({
  subscribeToFavorites: () => () => {},
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback(null);
    return () => {};
  }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  // Routing tests never hit TMDB: requests stay pending.
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise(() => {})),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const location = (router: ReturnType<typeof renderApp>["router"]) =>
  router.state.location.pathname + router.state.location.search;

describe("routing", () => {
  it("sends guests from Mi lista to sign in, remembering where to come back", async () => {
    const { router } = renderApp("/mi-lista");
    await waitFor(() => expect(location(router)).toBe("/ingresar?volver=%2Fmi-lista"));
  });

  it("waits for Firebase to restore the session before redirecting", async () => {
    vi.mocked(onAuthStateChanged).mockImplementationOnce(() => () => {});
    const { router } = renderApp("/mi-lista");
    expect(await screen.findByLabelText(/verificando tu sesión/i)).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(location(router)).toBe("/mi-lista");
  });

  it.each([
    ["/popularFilms", "/peliculas"],
    ["/popularTv", "/series"],
    ["/film/550", "/pelicula/550"],
    ["/tvShow/1399", "/serie/1399"],
    ["/genre/28", "/peliculas?genero=28"],
    ["/login", "/ingresar"],
  ])("redirects the old URL %s to %s", async (from, to) => {
    const { router } = renderApp(from);
    await waitFor(() => expect(location(router)).toBe(to));
  });

  it("shows the not-found page for unknown routes", async () => {
    renderApp("/esta-ruta-no-existe");
    expect(await screen.findByRole("heading", { name: "404" })).toBeInTheDocument();
  });
});

describe("sign in", () => {
  it("shows a clear Spanish message for Firebase credential errors", async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce({
      code: "auth/invalid-credential",
    });
    const user = userEvent.setup();
    renderApp("/ingresar");

    await user.type(await screen.findByLabelText("Email"), "nadie@ejemplo.com");
    await user.type(screen.getByLabelText("Contraseña"), "secreto");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /El email o la contraseña no coinciden/,
    );
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, "nadie@ejemplo.com", "secreto");
  });

  it("validates in Spanish before calling Firebase and focuses the first problem", async () => {
    const user = userEvent.setup();
    renderApp("/ingresar");

    await user.type(await screen.findByLabelText("Email"), "nadie");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByLabelText("Email")).toHaveFocus();
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription(/no parece válido/);
    expect(screen.getByLabelText("Contraseña")).toHaveAccessibleDescription(
      "Ingresá tu contraseña.",
    );
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it("sends a signed-in visitor back to where they were going", async () => {
    vi.mocked(onAuthStateChanged).mockImplementationOnce((_auth, callback) => {
      (callback as (user: unknown) => void)({ uid: "u1" });
      return () => {};
    });
    const { router } = renderApp("/ingresar?volver=%2Fbuscar");
    await waitFor(() => expect(location(router)).toBe("/buscar"));
  });

  it("ignores return paths that leave the site", async () => {
    vi.mocked(onAuthStateChanged).mockImplementationOnce((_auth, callback) => {
      (callback as (user: unknown) => void)({ uid: "u1" });
      return () => {};
    });
    const { router } = renderApp("/ingresar?volver=%2F%2Fevil.com");
    await waitFor(() => expect(location(router)).toBe("/"));
  });
});
