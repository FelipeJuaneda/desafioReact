import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { RouteError } from "./RouteError";

const renderFailing = (error: unknown) => {
  const Broken = () => {
    throw error;
  };
  const router = createMemoryRouter([
    { path: "/", Component: Broken, errorElement: <RouteError /> },
  ]);
  render(<RouterProvider router={router} />);
};

describe("RouteError", () => {
  it("keeps a way out when a screen crashes", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    renderFailing(new Error("boom"));
    expect(screen.getByRole("heading", { name: "Se cortó la proyección" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Recargar" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
  });

  it("asks to reload when a deploy left the tab with stale chunks", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    renderFailing(new TypeError("Failed to fetch dynamically imported module: /assets/x.js"));
    expect(screen.getByRole("heading", { name: "Hay una versión nueva" })).toBeInTheDocument();
  });
});
