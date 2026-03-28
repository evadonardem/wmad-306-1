import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_FAVORITES = "adopt_a_dog_favorites";
const KEY_SEARCH = "adopt_a_dog_last_search";
const KEY_PHOTO_FAVORITES = "adopt_a_dog_photo_favorites";

// ─── Breed Favorites ──────────────────────────────────────────────────────────

export async function saveFavorite(breedName: string): Promise<void> {
  const current = await loadFavorites();
  if (!current.includes(breedName)) {
    await AsyncStorage.setItem(KEY_FAVORITES, JSON.stringify([breedName, ...current]));
  }
}

export async function loadFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY_FAVORITES);
  if (!raw) return [];
  try { return JSON.parse(raw) as string[]; } catch { return []; }
}

export async function removeFavorite(breedName: string): Promise<void> {
  const current = await loadFavorites();
  await AsyncStorage.setItem(KEY_FAVORITES, JSON.stringify(current.filter((b) => b !== breedName)));
}

export async function clearFavorites(): Promise<void> {
  await AsyncStorage.removeItem(KEY_FAVORITES);
}

// ─── Photo Favorites ──────────────────────────────────────────────────────────

export interface PhotoFavorite {
  breed: string;
  imageUrl: string;
  addedAt: number;
}

export async function loadPhotoFavorites(): Promise<PhotoFavorite[]> {
  const raw = await AsyncStorage.getItem(KEY_PHOTO_FAVORITES);
  if (!raw) return [];
  try { return JSON.parse(raw) as PhotoFavorite[]; } catch { return []; }
}

export async function savePhotoFavorite(breed: string, imageUrl: string): Promise<void> {
  const current = await loadPhotoFavorites();
  if (current.some((p) => p.imageUrl === imageUrl)) return;
  const updated: PhotoFavorite[] = [
    { breed, imageUrl, addedAt: Date.now() },
    ...current,
  ];
  await AsyncStorage.setItem(KEY_PHOTO_FAVORITES, JSON.stringify(updated));
}

export async function removePhotoFavorite(imageUrl: string): Promise<void> {
  const current = await loadPhotoFavorites();
  await AsyncStorage.setItem(
    KEY_PHOTO_FAVORITES,
    JSON.stringify(current.filter((p) => p.imageUrl !== imageUrl))
  );
}

export async function isPhotoFavorite(imageUrl: string): Promise<boolean> {
  const current = await loadPhotoFavorites();
  return current.some((p) => p.imageUrl === imageUrl);
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function saveLastSearch(term: string): Promise<void> {
  await AsyncStorage.setItem(KEY_SEARCH, term);
}

export async function loadLastSearch(): Promise<string> {
  return (await AsyncStorage.getItem(KEY_SEARCH)) ?? "";
}
