// Vercel function for /api/tmdb (see vercel.json for the rewrite). The logic lives in server/,
// outside api/, because every file in api/ becomes a function (tests included).
// The .js extension is required: Vercel runs this as native ESM, file by file, unbundled.
export { GET } from "../server/tmdbProxy.js";
