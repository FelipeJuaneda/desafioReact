// Vercel function for link previews of /pelicula/:slug and /serie/:slug (bots only, see
// vercel.json). Logic in server/share; .js for native ESM.
export { GET } from "../server/share/titlePage.js";
