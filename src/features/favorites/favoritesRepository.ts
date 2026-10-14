// Firestore access for users/{uid}/favorites. See firestore.rules for the enforced schema.
import {
  collection,
  deleteDoc,
  doc,
  initializeFirestore,
  onSnapshot,
  persistentLocalCache,
  persistentMultipleTabManager,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";
import { favoriteId, type Favorite, type FavoriteInput } from "@/features/favorites/favorite";
import { app } from "@/services/firebase/app";
import type { MediaType } from "@/types/tmdb";

// Loaded on demand (only once someone signs in), so Firestore stays out of the initial bundle.
// The list is cached in IndexedDB: offline (the installed app on a train) it still opens, and
// saves or removals made offline sync when the connection comes back. Shared across tabs.
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

const favoritesCollection = (uid: string) => collection(db, "users", uid, "favorites");

const favoriteDoc = (uid: string, mediaType: MediaType, tmdbId: number) =>
  doc(favoritesCollection(uid), favoriteId(mediaType, tmdbId));

export const subscribeToFavorites = (
  uid: string,
  onNext: (favorites: Favorite[]) => void,
  onError: (error: Error) => void,
) =>
  onSnapshot(
    query(favoritesCollection(uid), orderBy("addedAt", "desc")),
    (snapshot) =>
      onNext(
        snapshot.docs.map((snap) => {
          // Local writes carry an estimated timestamp until the server confirms them.
          const data = snap.data({ serverTimestamps: "estimate" });
          return {
            id: snap.id,
            tmdbId: data.tmdbId as number,
            mediaType: data.mediaType as MediaType,
            title: data.title as string,
            posterPath: (data.posterPath as string | null) ?? null,
            releaseDate: (data.releaseDate as string | null) ?? null,
            voteAverage: (data.voteAverage as number) ?? 0,
            addedAt: (data.addedAt as Timestamp | null)?.toDate() ?? null,
          };
        }),
      ),
    onError,
  );

export const addFavorite = (uid: string, input: FavoriteInput) =>
  setDoc(favoriteDoc(uid, input.mediaType, input.tmdbId), {
    ...input,
    addedAt: serverTimestamp(),
  });

export const removeFavorite = (uid: string, mediaType: MediaType, tmdbId: number) =>
  deleteDoc(favoriteDoc(uid, mediaType, tmdbId));

/** Creates several favorites in one atomic write (used to import device favorites). */
export const importFavorites = async (uid: string, inputs: FavoriteInput[]) => {
  if (inputs.length === 0) return;
  const batch = writeBatch(db);
  for (const input of inputs) {
    batch.set(favoriteDoc(uid, input.mediaType, input.tmdbId), {
      ...input,
      addedAt: serverTimestamp(),
    });
  }
  await batch.commit();
};
