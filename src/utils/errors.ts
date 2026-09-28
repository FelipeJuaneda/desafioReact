// Firebase rejects with FirebaseError ({ code, message }); anything thrown is typed as unknown.
export const getErrorCode = (error: unknown): string | undefined =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  typeof error.code === "string"
    ? error.code
    : undefined;

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);
