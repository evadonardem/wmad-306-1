export interface Breed {
  name: string;
  subBreeds: string[];
}

const BASE = "https://dog.ceo/api";

export async function fetchBreeds(): Promise<Breed[]> {
  const res = await fetch(`${BASE}/breeds/list/all`);
  if (!res.ok) throw new Error("Failed to load breeds");
  const data = await res.json();
  const message: Record<string, string[]> = data.message;
  return Object.entries(message)
    .map(([name, subBreeds]) => ({ name, subBreeds }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchRandomImage(breedPath: string): Promise<string> {
  const res = await fetch(`${BASE}/breed/${breedPath}/images/random`);
  if (!res.ok) throw new Error("Failed to load image");
  const data = await res.json();
  return data.message as string;
}

export async function fetchMultipleImages(
  breedPath: string,
  count: number = 4
): Promise<string[]> {
  const res = await fetch(`${BASE}/breed/${breedPath}/images/random/${count}`);
  if (!res.ok) throw new Error("Failed to load images");
  const data = await res.json();
  return data.message as string[];
}

export async function fetchRandomBreedAndImage(): Promise<{
  breed: string;
  imageUrl: string;
}> {
  const breeds = await fetchBreeds();
  const random = breeds[Math.floor(Math.random() * breeds.length)];
  const imageUrl = await fetchRandomImage(random.name);
  return { breed: random.name, imageUrl };
}
