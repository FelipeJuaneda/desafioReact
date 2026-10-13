import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import type { MovieDetail } from "@/types/tmdb";
import { shareData, shareLink } from "./share";
import { ShareButton } from "./ShareButton";

vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { error: vi.fn() }) }));

const movie = {
  id: 550,
  title: "El Club de la Pelea",
  release_date: "1999-10-15",
} as MovieDetail;

const origin = window.location.origin;

describe("share links", () => {
  it("shares the title's canonical URL with its year", () => {
    const data = shareData("movie", movie, "https://peliculed.test");
    expect(data).toEqual({
      title: "El Club de la Pelea (1999) · PelicuLed",
      text: "El Club de la Pelea (1999) en PelicuLed",
      url: "https://peliculed.test/pelicula/550-el-club-de-la-pelea",
    });
    expect(shareLink("whatsapp", data)).toBe(
      "https://wa.me/?text=El%20Club%20de%20la%20Pelea%20(1999)%20en%20PelicuLed%20https%3A%2F%2Fpeliculed.test%2Fpelicula%2F550-el-club-de-la-pelea",
    );
    expect(shareLink("x", data)).toContain("&url=https%3A%2F%2Fpeliculed.test%2Fpelicula%2F550");
  });
});

describe("ShareButton", () => {
  afterEach(() => vi.restoreAllMocks());

  it("offers copying the link and each network on desktop", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    renderWithProviders(<ShareButton mediaType="movie" title={movie} name="El Club de la Pelea" />);

    await user.click(screen.getByRole("button", { name: "Compartir" }));
    expect(screen.getByRole("menuitem", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/?text="),
    );
    expect(screen.getByRole("menuitem", { name: "X" })).toHaveAttribute("target", "_blank");

    await user.click(screen.getByRole("menuitem", { name: "Copiar enlace" }));
    expect(writeText).toHaveBeenCalledWith(`${origin}/pelicula/550-el-club-de-la-pelea`);
    expect(toast).toHaveBeenCalledWith('Copiaste el enlace de "El Club de la Pelea"', {
      description: "Pegalo donde quieras.",
    });
  });
});
