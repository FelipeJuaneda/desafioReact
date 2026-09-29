// Temporary adapters that mount pre-redesign screens on the new routes.
// Each one is deleted when its redesigned screen lands (phase 3).
import TitlePage from "@/routes/title/TitlePage";

export const LegacyMovieTitle = () => <TitlePage type="movie" />;
export const LegacySeriesTitle = () => <TitlePage type="tv" />;
