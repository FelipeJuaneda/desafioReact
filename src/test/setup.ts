// Adds jest-dom matchers (toBeInTheDocument, toHaveTextContent...) to Vitest's expect.
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only auto-cleans when test globals are enabled; unmount explicitly instead.
afterEach(cleanup);

// jsdom has no ResizeObserver; Headless UI (floating-ui anchoring) uses it.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
