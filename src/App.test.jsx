import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { signInWithEmailAndPassword } from "firebase/auth";
import App from "./App";

vi.mock("./firebase/firebase", () => ({ app: {}, auth: {} }));

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

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );

describe("App routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends signed-out visitors from the home page to the login page", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { name: /bienvenido de nuevo a peliculed/i })
    ).toBeInTheDocument();
  });

  it("protects the favorites page behind login", () => {
    renderAt("/favoriteList");
    expect(
      screen.getByRole("heading", { name: /bienvenido de nuevo a peliculed/i })
    ).toBeInTheDocument();
  });

  it("shows the not-found page for unknown routes", () => {
    renderAt("/esta-ruta-no-existe");
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });
});

describe("Login", () => {
  it("translates a user-not-found error from Firebase", async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: "auth/user-not-found" });
    const user = userEvent.setup();
    renderAt("/login");

    await user.type(screen.getByPlaceholderText(/ingresa tu email/i), "nadie@ejemplo.com");
    await user.type(screen.getByPlaceholderText(/ingresa contraseña/i), "secreto");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(await screen.findByText("Usuario no encontrado")).toBeInTheDocument();
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, "nadie@ejemplo.com", "secreto");
  });
});
