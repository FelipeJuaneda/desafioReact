// Vercel function for /api/tmdb (see vercel.json for the rewrite). The logic lives in server/,
// outside api/, because every file in api/ becomes a function (tests included).
export { GET } from "../server/tmdbProxy";
