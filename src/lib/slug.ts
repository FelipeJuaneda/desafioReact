/** "El club de la lucha" -> "el-club-de-la-lucha" (accents removed, URL-safe). */
export const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** "550-el-club-de-la-lucha" or "550" -> "550". Anything else -> null. */
export const idFromSlug = (param: string | undefined) => {
  const match = /^(\d+)(?:-|$)/.exec(param ?? "");
  return match ? match[1]! : null;
};
