import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderApp } from "@/test/render";

vi.mock("@/services/firebase/app", () => ({ app: {}, auth: {}, db: {} }));
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback(null);
    return () => {};
  }),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

const page = (results: unknown[]) =>
  new Response(JSON.stringify({ page: 1, results, total_pages: 1, total_results: results.length }));

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: URL) => {
      const url = new URL(input);
      if (url.pathname.endsWith("search/multi")) {
        if (url.searchParams.get("query") === "zzzz") return page([]);
        return page([
          {
            media_type: "movie",
            id: 603,
            title: "Matrix",
            release_date: "1999-03-31",
            poster_path: null,
            backdrop_path: null,
            vote_average: 8.2,
            overview: "",
          },
          {
            media_type: "tv",
            id: 1,
            name: "Matrix: la serie",
            first_air_date: "2003-01-01",
            poster_path: null,
            backdrop_path: null,
            vote_average: 6,
            overview: "",
          },
          { media_type: "person", id: 6384, name: "Keanu Reeves", profile_path: null },
        ]);
      }
      return page([]);
    }),
  );
});

afterEach(() => vi.unstubAllGlobals());

describe("search", () => {
  it("searches as you type and keeps the query in the URL", async () => {
    const user = userEvent.setup();
    const { router } = renderApp("/buscar");

    await user.type(await screen.findByLabelText(/buscar películas, series y personas/i), "matrix");

    expect(await screen.findByRole("heading", { name: "Matrix" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Matrix: la serie" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Keanu Reeves" })).toHaveAttribute(
      "href",
      "/persona/6384-keanu-reeves",
    );
    await waitFor(() => expect(router.state.location.search).toBe("?q=matrix"));
  });

  it("offers a way out when nothing matches", async () => {
    renderApp("/buscar?q=zzzz");
    expect(await screen.findByText(/Nada para “zzzz”/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explorar películas" })).toBeInTheDocument();
  });
});
