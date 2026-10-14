import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { listServices } from "./catalog";
import { setMyServices, useMyServices } from "./myServices";

describe("Mis plataformas", () => {
  afterEach(() => localStorage.clear());

  it("remembers the choice, drops unknown services and updates every reader", () => {
    const { result } = renderHook(() => useMyServices());
    expect(result.current).toEqual([]);
    act(() => setMyServices([8, 1899, 8, 424242]));
    expect(result.current).toEqual([8, 1899]);
    expect(JSON.parse(localStorage.getItem("peliculed:services")!)).toEqual([8, 1899]);
  });

  it("ignores a corrupted value instead of breaking the app", () => {
    localStorage.setItem("peliculed:services", "{nope");
    const { result } = renderHook(() => useMyServices());
    expect(result.current).toEqual([]);
  });

  it("names them briefly", () => {
    const services = [
      { id: 8, name: "Netflix", logoPath: null },
      { id: 1899, name: "HBO Max", logoPath: null },
      { id: 337, name: "Disney Plus", logoPath: null },
      { id: 119, name: "Amazon Prime Video", logoPath: null },
    ];
    expect(listServices([8, 1899], services)).toBe("Netflix y HBO Max");
    expect(listServices([8, 1899, 337, 119], services)).toBe("Netflix, HBO Max y 2 más");
  });
});
