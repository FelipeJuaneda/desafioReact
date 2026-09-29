import { describe, expect, it } from "vitest";
import { paths } from "./paths";

describe("paths", () => {
  it("adds a readable slug after the id", () => {
    expect(paths.title("movie", 550, "El club de la lucha")).toBe(
      "/pelicula/550-el-club-de-la-lucha",
    );
    expect(paths.person(287, "Brad Pitt")).toBe("/persona/287-brad-pitt");
  });

  it("leaves no dangling dash when the name has no Latin letters", () => {
    expect(paths.title("tv", 324502, "テムパル～アイテムの力～")).toBe("/serie/324502");
    expect(paths.title("movie", 1)).toBe("/pelicula/1");
  });
});
