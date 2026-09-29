// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./tmdbProxy";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("TMDB_READ_TOKEN", "test-token");
  fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  fetchMock.mockReset();
});

const call = (path: string) => GET(new Request(`https://peliculed.test/api/tmdb/${path}`));

describe("TMDB proxy", () => {
  it("forwards catalog requests with the server-side token and query params", async () => {
    const response = await call("discover/movie?page=2&language=es");

    expect(response.status).toBe(200);
    const [upstream, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(upstream.toString()).toBe(
      "https://api.themoviedb.org/3/discover/movie?page=2&language=es",
    );
    expect(init.headers).toMatchObject({ Authorization: "Bearer test-token" });
    expect(response.headers.get("cache-control")).toContain("s-maxage");
  });

  it("accepts the rewritten form Vercel sends (?path=…) without forwarding `path`", async () => {
    const response = await GET(
      new Request("https://peliculed.test/api/tmdb?path=trending/movie/week&language=es&page=1"),
    );
    expect(response.status).toBe(200);
    const [upstream] = fetchMock.mock.calls[0] as [URL];
    expect(upstream.toString()).toBe(
      "https://api.themoviedb.org/3/trending/movie/week?language=es&page=1",
    );
  });

  it("rejects traversal in the rewritten form too", async () => {
    const response = await GET(
      new Request("https://peliculed.test/api/tmdb?path=movie/../account"),
    );
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("drops an api_key sent by the client", async () => {
    await call("movie/550?api_key=leaked");
    const [upstream] = fetchMock.mock.calls[0] as [URL];
    expect(upstream.searchParams.has("api_key")).toBe(false);
  });

  it("rejects endpoints outside the catalog allowlist", async () => {
    const response = await call("account/123/favorite");
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects path traversal attempts", async () => {
    const response = await call("movie/..%2F..%2Faccount");
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails clearly when the token is missing", async () => {
    vi.stubEnv("TMDB_READ_TOKEN", "");
    const response = await call("movie/550");
    expect(response.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not cache upstream errors", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 404 }));
    const response = await call("movie/0");
    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
