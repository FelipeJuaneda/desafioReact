import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { mockTmdb } from "./tmdb";

test.beforeEach(async ({ page }) => {
  await mockTmdb(page);
});

/** WCAG 2.2 A/AA rules only; posters are aborted on purpose, so image-alt noise is not ours. */
const expectNoA11yViolations = async (page: Page) => {
  // Entrances fade text in, and measuring contrast mid-fade reports false failures. Under
  // automation Motion jumps to final states (see MotionProvider) once its features have loaded:
  // wait for that, plus two frames for the final styles to be written.
  await page.locator("html[data-motion='ready']").waitFor({ state: "attached" });
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    violations.map(
      (v) =>
        `${v.id}: ${v.nodes.map((n) => `${n.target.join(" ")} (${n.failureSummary ?? ""})`).join(", ")}`,
    ),
  ).toEqual([]);
};

test("home shows the featured title and opens its page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "El club de la lucha", level: 2 })).toBeVisible();
  await expectNoA11yViolations(page);

  await page.getByRole("link", { name: "Ver ficha" }).click();
  await expect(page).toHaveURL(/\/pelicula\/550-el-club-de-la-lucha$/);
  await expect(page.getByRole("heading", { name: "El club de la lucha", level: 1 })).toBeVisible();
});

test("title page: canonical URL, cast, facts and trailer", async ({ page }) => {
  await page.goto("/pelicula/550");
  await expect(page).toHaveURL(/\/pelicula\/550-el-club-de-la-lucha$/);
  await expect(page).toHaveTitle("El club de la lucha (1999) · PelicuLed");
  await expect(page.getByRole("link", { name: /Brad Pitt/ })).toHaveAttribute(
    "href",
    "/persona/287-brad-pitt",
  );
  await expect(page.getByText("David Fincher")).toBeVisible();
  await expectNoA11yViolations(page);

  await page.getByRole("button", { name: "Ver tráiler" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.locator("iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/SUXWAEX2jlg/,
  );
  await dialog.getByRole("button", { name: "Cerrar" }).click();
  await expect(dialog).toBeHidden();
});

test("catalog sorts through the URL and keeps a valid heading outline", async ({ page }) => {
  await page.goto("/peliculas");
  await expect(page.getByRole("heading", { name: "Más populares", level: 2 })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Matrix", level: 3 })).toBeVisible();
  await expectNoA11yViolations(page);

  await page.getByLabel("Ordenar por").selectOption("puntuadas");
  await expect(page).toHaveURL(/\/peliculas\?orden=puntuadas$/);
});

test("search keeps the query in the URL", async ({ page }) => {
  await page.goto("/buscar");
  await page.getByRole("searchbox", { name: /Buscar películas, series y personas/ }).fill("matrix");
  await expect(page).toHaveURL(/\/buscar\?q=matrix$/);
  await expect(page.getByRole("link", { name: /Matrix/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Pulp Fiction/ })).toHaveCount(0);
  await expectNoA11yViolations(page);
});

test("a guest who saves a title is invited to sign in and comes back", async ({ page }) => {
  await page.goto("/pelicula/550-el-club-de-la-lucha");
  await page.getByRole("button", { name: "Guardar", exact: true }).click();
  await page.getByRole("button", { name: "Ingresar" }).click();
  await expect(page).toHaveURL(/\/ingresar\?volver=%2Fpelicula%2F550-el-club-de-la-lucha$/);
});

test("Mi lista asks guests to sign in first", async ({ page }) => {
  await page.goto("/mi-lista");
  await expect(page).toHaveURL(/\/ingresar\?volver=%2Fmi-lista$/);
});

test("sign in explains wrong credentials in Spanish", async ({ page }) => {
  // Firebase's REST answer for a wrong email or password; nothing leaves the machine.
  await page.route("https://identitytoolkit.googleapis.com/**", (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ error: { code: 400, message: "INVALID_LOGIN_CREDENTIALS" } }),
    }),
  );
  await page.goto("/ingresar");
  await expectNoA11yViolations(page);

  await page.getByRole("button", { name: "Ingresar", exact: true }).click();
  await expect(page.getByLabel("Email")).toBeFocused();
  await expect(page.getByText("Ingresá tu email.")).toBeVisible();

  await page.getByLabel("Email").fill("nadie@ejemplo.com");
  await page.getByLabel("Contraseña", { exact: true }).fill("incorrecta");
  await page.getByRole("button", { name: "Ingresar", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("El email o la contraseña no coinciden");
});

test("sharing a title copies its canonical link", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "Clipboard permissions are Chromium-only in Playwright");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/pelicula/550");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const share = page.getByRole("button", { name: "Compartir" });
  // Touch devices get the system share sheet instead of the menu.
  test.skip(
    await page.evaluate(() => matchMedia("(pointer: coarse)").matches),
    "Native share sheet on touch devices",
  );
  await share.click();
  await expect(page.getByRole("menuitem", { name: "WhatsApp" })).toHaveAttribute(
    "href",
    /^https:\/\/wa\.me\/\?text=.*%2Fpelicula%2F550-el-club-de-la-lucha$/,
  );
  await expectNoA11yViolations(page);

  await page.getByRole("menuitem", { name: "Copiar enlace" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
    /\/pelicula\/550-el-club-de-la-lucha$/,
  );
});

test("title page says where to watch it in Argentina", async ({ page }) => {
  await page.goto("/pelicula/550");
  const where = page.getByRole("region", { name: "Dónde verla" });
  await expect(where.getByText("Netflix")).toBeVisible();
  await expect(where.getByRole("link", { name: /Ver precios y enlaces/ })).toHaveAttribute(
    "href",
    /themoviedb\.org\/movie\/550\/watch/,
  );
});

test("series: seasons switch through the URL and list their episodes", async ({ page }) => {
  await page.goto("/serie/1399?temporada=2");
  await expect(page).toHaveURL(/\/serie\/1399-el-juego-de-tronos\?temporada=2$/);
  const seasons = page.getByRole("region", { name: "Temporadas" });
  await expect(seasons.getByRole("heading", { name: "Temporada 2", level: 3 })).toBeVisible();
  await expect(seasons.getByRole("heading", { name: "Capítulo 2.1" })).toBeVisible();
  await expectNoA11yViolations(page);

  await seasons.getByRole("button", { name: /^Temporada 1/ }).click();
  await expect(page).toHaveURL(/\/serie\/1399-el-juego-de-tronos$/);
  await expect(seasons.getByRole("heading", { name: "Capítulo 1.2" })).toBeVisible();
});

test("upcoming releases: a schedule by day with a calendar reminder", async ({ page }) => {
  await page.goto("/estrenos");
  await expect(page.getByRole("heading", { name: "Próximos estrenos", level: 1 })).toBeVisible();
  const days = page.getByRole("list", { name: "Estrenos por fecha" }).locator("> li");
  await expect(days).toHaveCount(2);
  await expect(days.first().getByText("En 3 días")).toBeVisible();
  await expectNoA11yViolations(page);

  await page.getByRole("button", { name: "Avisame cuando se estrene Estreno del jueves" }).click();
  await expect(page.getByRole("menuitem", { name: "Google Calendar" })).toHaveAttribute(
    "href",
    /calendar\.google\.com\/calendar\/render\?action=TEMPLATE/,
  );
  const download = page.waitForEvent("download");
  await page.getByRole("menuitem", { name: /\.ics/ }).click();
  expect((await download).suggestedFilename()).toBe("estreno-estreno-del-jueves.ics");
});

test("unknown URLs end the reel with a way back", async ({ page }) => {
  await page.goto("/esto-no-existe");
  await expect(
    page.getByRole("heading", { name: "Esta página no está en el rollo" }),
  ).toBeVisible();
  await expectNoA11yViolations(page);
  await page.getByRole("link", { name: "Volver al inicio" }).click();
  await expect(page).toHaveURL(/\/$/);
});
