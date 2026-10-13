// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./titlePage";
import { clip, injectHead, parseId, parseKind, titleHead, titlePath, toShareTitle } from "./title";

const fightClub = {
  id: 550,
  title: "El Club de la Pelea",
  release_date: "1999-10-15",
  runtime: 139,
  vote_average: 8.438,
  genres: [{ name: "Drama" }],
  tagline: "Travesuras. Caos. Jabón.",
  overview: 'Un empleado de oficina insomne y un "vendedor de jabón" forman un club.',
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
};

const shell = `<!doctype html><html><head>
    <!-- share:start -->
    <title>PelicuLed</title>
    <meta property="og:title" content="PelicuLed · Qué ver esta semana" />
    <!-- share:end -->
  </head><body><div id="root"></div></body></html>`;

describe("share metadata", () => {
  it("reads the app's URL segments and slugs", () => {
    expect(parseKind("pelicula")).toBe("movie");
    expect(parseKind("serie")).toBe("tv");
    expect(parseKind("persona")).toBeNull();
    expect(parseId("550-el-club-de-la-pelea")).toBe(550);
    expect(parseId("el-club")).toBeNull();
    expect(titlePath("movie", 550, "El Club de la Pelea")).toBe(
      "/pelicula/550-el-club-de-la-pelea",
    );
  });

  it("formats the title like the app does", () => {
    const title = toShareTitle("movie", fightClub);
    expect(title).toMatchObject({
      name: "El Club de la Pelea",
      year: "1999",
      length: "2 h 19 min",
    });
    expect(title.rating).toBe("8,4");
  });

  it("clips long synopses at a word boundary", () => {
    const text = "Una historia muy larga que no entra entera en la vista previa del enlace";
    const clipped = clip(text, 40);
    expect(clipped.length).toBeLessThanOrEqual(40);
    expect(clipped).toMatch(/\p{L}…$/u);
    expect(clip("Corta", 40)).toBe("Corta");
  });

  it("builds escaped tags with the card and the canonical URL", () => {
    const head = titleHead(toShareTitle("movie", fightClub), "https://peliculed.test");
    expect(head).toContain("<title>El Club de la Pelea (1999) · PelicuLed</title>");
    expect(head).toContain('content="https://peliculed.test/pelicula/550-el-club-de-la-pelea"');
    expect(head).toContain('content="https://peliculed.test/api/og?type=movie&amp;id=550&amp;v=');
    expect(head).toContain("&quot;vendedor de jabón&quot;");
    expect(head).toContain('<meta property="og:type" content="video.movie" />');
  });

  it("swaps only the site-wide block of the shell", () => {
    const html = injectHead(shell, "<title>Nuevo</title>");
    expect(html).toContain("<title>Nuevo</title>");
    expect(html).not.toContain("Qué ver esta semana");
    expect(html).toContain('<div id="root"></div>');
  });
});

describe("GET /api/title-page", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  const stubFetch = (tmdb: Response) => {
    const fetchMock = vi.fn(async (input: string | URL | Request) =>
      String(input).endsWith("/index.html") ? new Response(shell) : tmdb.clone(),
    );
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  };

  const request = (query: string) =>
    new Request(`https://peliculed.test/api/title-page?${query}`, {
      headers: { "x-forwarded-host": "peliculed.test" },
    });

  it("serves the app shell with the title's own preview", async () => {
    vi.stubEnv("TMDB_READ_TOKEN", "token");
    const fetchMock = stubFetch(Response.json(fightClub));

    const response = await GET(request("kind=pelicula&slug=550-el-club-de-la-pelea"));
    const html = await response.text();

    expect(response.headers.get("content-type")).toContain("text/html");
    expect(html).toContain('<meta property="og:title" content="El Club de la Pelea (1999)" />');
    expect(html).toContain('<div id="root"></div>');
    expect(String(fetchMock.mock.calls[1]![0])).toBe(
      "https://api.themoviedb.org/3/movie/550?language=es-MX",
    );
  });

  it("keeps the site-wide preview when TMDB doesn't know the title", async () => {
    vi.stubEnv("TMDB_READ_TOKEN", "token");
    stubFetch(new Response("{}", { status: 404 }));

    const response = await GET(request("kind=serie&slug=999999"));

    expect(await response.text()).toBe(shell);
    expect(response.headers.get("cache-control")).toBe("public, s-maxage=300");
  });
});
