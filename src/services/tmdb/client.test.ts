import { afterEach, describe, expect, it, vi } from "vitest";
import { tmdbFetch, TmdbError } from "./client";

const KEY = "/api/tmdb/trending/movie/week?language=es&page=1";

afterEach(() => {
  delete window.__early;
  vi.unstubAllGlobals();
});

describe("tmdbFetch", () => {
  it("reuses the request index.html started, only once", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ from: "network" })));
    vi.stubGlobal("fetch", fetchMock);
    window.__early = { [KEY]: Promise.resolve({ from: "html" }) };

    expect(await tmdbFetch("trending/movie/week", { page: 1 })).toEqual({ from: "html" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(await tmdbFetch("trending/movie/week", { page: 1 })).toEqual({ from: "network" });
  });

  it("falls back to the network when the early request failed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ ok: 1 }))),
    );
    window.__early = { [KEY]: Promise.resolve(null) };
    expect(await tmdbFetch("trending/movie/week", { page: 1 })).toEqual({ ok: 1 });
  });

  it("turns HTTP errors into TmdbError with the status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 404 })),
    );
    await expect(tmdbFetch("movie/1")).rejects.toMatchObject({
      name: "TmdbError",
      status: 404,
    } satisfies Partial<TmdbError>);
  });
});
