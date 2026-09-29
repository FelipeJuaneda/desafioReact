import { describe, expect, it } from "vitest";
import { authErrorMessage } from "@/features/auth/authErrors";

describe("authErrorMessage", () => {
  it("does not reveal whether the email or the password was wrong", () => {
    const invalid = authErrorMessage({ code: "auth/invalid-credential" });
    expect(authErrorMessage({ code: "auth/user-not-found" })).toBe(invalid);
    expect(authErrorMessage({ code: "auth/wrong-password" })).toBe(invalid);
  });

  it("explains how to recover from common errors", () => {
    expect(authErrorMessage({ code: "auth/too-many-requests" })).toMatch(/Esperá unos minutos/);
    expect(authErrorMessage({ code: "auth/email-already-in-use" })).toMatch(/recuperá/);
  });

  it("never falls back to Firebase's raw English text", () => {
    const error = Object.assign(new Error("Firebase: Error (auth/some-new-code)."), {
      code: "auth/some-new-code",
    });
    expect(authErrorMessage(error)).toBe("Algo salió mal. Probá de nuevo en un momento.");
    expect(authErrorMessage("boom")).toBe("Algo salió mal. Probá de nuevo en un momento.");
  });
});
