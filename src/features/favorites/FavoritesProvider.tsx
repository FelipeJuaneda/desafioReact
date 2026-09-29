import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useAuthContext } from "@/features/auth/useAuthContext";
import { favoriteId, type Favorite, type FavoriteInput } from "@/features/favorites/favorite";
import { clearLegacyFavorites, readLegacyFavorites } from "@/features/favorites/legacyFavorites";
import {
  FavoriteContext,
  type FavoriteContextValue,
  type FavoritesStatus,
} from "@/features/favorites/useFavoriteContext";
import type { MediaType } from "@/types/tmdb";

// Firestore is only needed once someone signs in: load it then, not on every first visit.
const loadRepository = () => import("@/features/favorites/favoritesRepository");

interface Snapshot {
  uid: string;
  favorites: Favorite[];
  error: Error | null;
}

/** Moves favorites saved on this device (pre-accounts) into the user's list, once. */
const importDeviceFavorites = async (uid: string, current: Favorite[]) => {
  const legacy = readLegacyFavorites();
  if (legacy.length === 0) return;
  const existing = new Set(current.map((f) => f.id));
  const pending = legacy.filter((f) => !existing.has(favoriteId(f.mediaType, f.tmdbId)));
  try {
    const repository = await loadRepository();
    await repository.importFavorites(uid, pending);
    clearLegacyFavorites();
    if (pending.length > 0) {
      toast.success(`Pasamos ${pending.length} títulos guardados en este dispositivo a tu lista.`);
    }
  } catch {
    // Keep the device copy so the import can be retried on the next sign-in.
    toast.error("No pudimos pasar tus favoritos de este dispositivo a tu cuenta.");
  }
};

const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    if (!user) return;
    let imported = false;
    let active = true;
    let unsubscribe: (() => void) | undefined;
    const fail = (error: Error) => setSnapshot({ uid: user.uid, favorites: [], error });
    loadRepository().then((repository) => {
      if (!active) return;
      unsubscribe = repository.subscribeToFavorites(
        user.uid,
        (favorites) => {
          setSnapshot({ uid: user.uid, favorites, error: null });
          if (!imported) {
            imported = true;
            void importDeviceFavorites(user.uid, favorites);
          }
        },
        fail,
      );
    }, fail);
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [user]);

  // Ignore a snapshot that belongs to a previous session.
  const current = user && snapshot?.uid === user.uid ? snapshot : null;
  const favorites = current?.favorites ?? [];
  const status: FavoritesStatus = !user
    ? "signed-out"
    : !current
      ? "loading"
      : current.error
        ? "error"
        : "ready";

  const requireUid = () => {
    if (!user) throw new Error("Sign in to save favorites");
    return user.uid;
  };

  const value: FavoriteContextValue = {
    favorites,
    status,
    isFavorite: (mediaType: MediaType, tmdbId: number) =>
      favorites.some((f) => f.id === favoriteId(mediaType, tmdbId)),
    addFavorite: async (input: FavoriteInput) =>
      (await loadRepository()).addFavorite(requireUid(), input),
    removeFavorite: async (mediaType: MediaType, tmdbId: number) =>
      (await loadRepository()).removeFavorite(requireUid(), mediaType, tmdbId),
  };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
};

export default FavoritesProvider;
