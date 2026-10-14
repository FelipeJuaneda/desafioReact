import { queryOptions } from "@tanstack/react-query";
import { tmdbFetch } from "@/services/tmdb/client";
import { REGION, tmdbKeys } from "@/services/tmdb/queries";
import { SERVICES } from "./myServices";

export interface Service {
  id: number;
  name: string;
  logoPath: string | null;
}

/** The services the app offers, with TMDB's current names and logos. */
export const servicesQuery = () =>
  queryOptions({
    queryKey: [...tmdbKeys.all, "services", REGION],
    queryFn: async ({ signal }) => {
      const data = await tmdbFetch<{
        results: Array<{ provider_id: number; provider_name: string; logo_path: string | null }>;
      }>("watch/providers/movie", { watch_region: REGION }, signal);
      const byId = new Map(data.results.map((p) => [p.provider_id, p]));
      return SERVICES.flatMap((id): Service[] => {
        const provider = byId.get(id);
        return provider ? [{ id, name: provider.provider_name, logoPath: provider.logo_path }] : [];
      });
    },
    staleTime: Infinity,
  });

/** "Netflix y HBO Max", "Netflix, Disney Plus y 2 más". */
export const listServices = (ids: number[], services: Service[]) => {
  const names = ids
    .map((id) => services.find((s) => s.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  if (names.length <= 2) return names.join(" y ");
  return `${names.slice(0, 2).join(", ")} y ${names.length - 2} más`;
};
