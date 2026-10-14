import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { iosBrowserHasTopShare, useInstallMethod } from "./installState";

const IPHONE_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

const userAgent = (value: string) =>
  Object.defineProperty(navigator, "userAgent", { value, configurable: true });

/** jsdom has no matchMedia: answer only the standalone display-mode query. */
const standalone = (matches: boolean) =>
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: matches && query.includes("standalone"),
  }));

describe("install", () => {
  afterEach(() => {
    // Back to jsdom's own user agent (a getter on the prototype).
    delete (navigator as { userAgent?: string }).userAgent;
    vi.unstubAllGlobals();
  });

  it("guides iPhones through Share > Agregar a inicio", () => {
    userAgent(IPHONE_SAFARI);
    standalone(false);
    expect(renderHook(() => useInstallMethod()).result.current).toBe("ios");
    expect(iosBrowserHasTopShare()).toBe(false);
    userAgent(IPHONE_SAFARI.replace("Version/18.0", "CriOS/130.0"));
    expect(iosBrowserHasTopShare()).toBe(true);
  });

  it("offers nothing inside the installed app or where installing isn't possible", () => {
    userAgent(IPHONE_SAFARI);
    standalone(true);
    expect(renderHook(() => useInstallMethod()).result.current).toBeNull();
    userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/130.0");
    standalone(false);
    expect(renderHook(() => useInstallMethod()).result.current).toBeNull();
  });
});
