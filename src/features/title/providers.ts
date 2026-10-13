import type { WatchOffer, WatchProvider } from "@/types/tmdb";

export interface OfferGroup {
  kind: "stream" | "rent" | "buy";
  label: string;
  providers: WatchProvider[];
}

const byPriority = (providers: WatchProvider[]) => {
  const seen = new Set<number>();
  return [...providers]
    .sort((a, b) => a.display_priority - b.display_priority)
    .filter((provider) => !seen.has(provider.provider_id) && seen.add(provider.provider_id));
};

/**
 * The offer as the viewer thinks about it: included in a subscription (or free), to rent, to
 * buy. A store that both rents and sells shows once, under "Alquiler o compra".
 */
export const groupOffer = (offer: WatchOffer | null | undefined): OfferGroup[] => {
  if (!offer) return [];
  const stream = byPriority([
    ...(offer.flatrate ?? []),
    ...(offer.free ?? []),
    ...(offer.ads ?? []),
  ]);
  const rent = byPriority(offer.rent ?? []);
  const renters = new Set(rent.map((provider) => provider.provider_id));
  const allBuy = byPriority(offer.buy ?? []);
  const buy = allBuy.filter((provider) => !renters.has(provider.provider_id));
  const rentLabel = allBuy.some((provider) => renters.has(provider.provider_id))
    ? "Alquiler o compra"
    : "Alquiler";
  const groups: OfferGroup[] = [
    { kind: "stream", label: "Incluida en", providers: stream },
    { kind: "rent", label: rentLabel, providers: rent },
    { kind: "buy", label: "Compra", providers: buy },
  ];
  return groups.filter((group) => group.providers.length > 0);
};
