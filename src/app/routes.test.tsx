import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderApp } from "@/test/render";

vi.mock("@/services/firebase/app", () => ({ app: {}, auth: {}, db: {} }));

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
  FacebookAuthProvider: vi.fn(),
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
    expect(await screen.findByAltText(/cargando/i)).toBeInTheDocument();
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

    await user.type(await screen.findByPlaceholderText(/ingresa tu email/i), "nadie@ejemplo.com");
    await user.type(screen.getByPlaceholderText(/ingresa contraseña/i), "secreto");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(await screen.findByText(/El email o la contraseña no coinciden/)).toBeInTheDocument();
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, "nadie@ejemplo.com", "secreto");
  });
});
