import { describe, expect, it } from "vitest";
import { safeReturnTo, withReturnTo } from "./returnTo";

describe("safeReturnTo", () => {
  it.each([
    ["/mi-lista", "/mi-lista"],
    ["/pelicula/550?x=1", "/pelicula/550?x=1"],
    [null, "/"],
    ["", "/"],
    ["//evil.com", "/"],
    ["/\\evil.com", "/"],
    ["https://evil.com", "/"],
    ["javascript:alert(1)", "/"],
  ])("%s -> %s", (input, expected) => {
    expect(safeReturnTo(input)).toBe(expected);
  });
});

describe("withReturnTo", () => {
  it("only adds the parameter when there is somewhere to go back to", () => {
    expect(withReturnTo("/registro", "/")).toBe("/registro");
    expect(withReturnTo("/registro", "/mi-lista")).toBe("/registro?volver=%2Fmi-lista");
  });
});
