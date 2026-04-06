import React, { useCallback, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";

import Colors from "@/constants/colors";
import LoadingSpinner from "@/components/LoadingSpinner";
import PawBackground from "@/components/PawBackground";
import HoverPressable from "@/components/HoverPressable";
import { fetchRandomImage } from "@/services/dogApiService";
import {
  loadFavorites,
  removeFavorite,
  loadPhotoFavorites,
  removePhotoFavorite,
  type PhotoFavorite,
} from "@/services/prefsService";

interface BreedFavoriteItem {
  breed: string;
  imageUrl: string | null;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const colors = Colors.light;
  const insets = useSafeAreaInsets();

  const [breeds, setBreeds] = useState<BreedFavoriteItem[]>([]);
  const [photos, setPhotos] = useState<PhotoFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [breedNames, photoFavs] = await Promise.all([
      loadFavorites(),
      loadPhotoFavorites(),
    ]);
    const loadedBreeds = await Promise.all(
      breedNames.map(async (breed) => {
        try {
          return { breed, imageUrl: await fetchRandomImage(breed) };
        } catch {
          return { breed, imageUrl: null };
        }
      })
    );
    setBreeds(loadedBreeds);
    setPhotos(photoFavs);
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const handleRemoveBreed = async (breed: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await removeFavorite(breed);
    setBreeds((prev) => prev.filter((i) => i.breed !== breed));
  };

  const handleRemovePhoto = async (imageUrl: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await removePhotoFavorite(imageUrl);
    setPhotos((prev) => prev.filter((p) => p.imageUrl !== imageUrl));
  };

  const goToBreed = (breed: string) =>
    router.push({
      pathname: "/breed/[name]",
      params: { name: breed, subBreeds: JSON.stringify([]) },
    });

  const topPad = Platform.OS === "web" ? 67 : 0;
  const botPad = Platform.OS === "web" ? 34 : 0;

  if (loading) return <LoadingSpinner />;

  const isEmpty = breeds.length === 0 && photos.length === 0;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <PawBackground color="#8B5A2B" opacity={0.06} />

      {isEmpty ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="paw" size={64} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No favorites yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
            Use "Save Breed" or tap ♥ on any photo to save it here
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 + botPad }}
        >
          {/* ── Saved Breeds ──────────────────────────────────── */}
          {breeds.length > 0 && (
            <>
              <SectionHeader
                icon="paw"
                label={`Saved Breeds · ${breeds.length}`}
                color={colors}
              />
              <View style={styles.listSection}>
                {breeds.map((item) => (
                  <HoverPressable
                    key={item.breed}
                    style={({ pressed, hovered }) => [
                      styles.breedCard,
                      {
                        backgroundColor: hovered
                          ? "#EDD9C0"
                          : pressed
                          ? colors.parchment
                          : colors.card,
                      },
                    ]}
                    onPress={() => goToBreed(item.breed)}
                    liftAmount={3}
                  >
                    {item.imageUrl ? (
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.breedThumb}
                        contentFit="cover"
                        placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                        transition={200}
                      />
                    ) : (
                      <View style={[styles.breedThumb, styles.thumbPlaceholder]}>
                        <MaterialCommunityIcons name="paw" size={28} color={colors.border} />
                      </View>
                    )}
                    <View style={styles.cardBody}>
                      <View style={styles.cardNameRow}>
                        <MaterialCommunityIcons name="paw" size={13} color={colors.primaryLight} />
                        <Text style={[styles.breedName, { color: colors.text }]}>
                          {capitalize(item.breed)}
                        </Text>
                      </View>
                      <Text style={[styles.cardSub, { color: colors.subtext }]}>
                        Tap to explore
                      </Text>
                    </View>
                    <Pressable hitSlop={12} onPress={() => handleRemoveBreed(item.breed)} style={styles.deleteBtn}>
                      <Feather name="trash-2" size={18} color={colors.error} />
                    </Pressable>
                  </HoverPressable>
                ))}
              </View>
            </>
          )}

          {/* ── Saved Photos ──────────────────────────────────── */}
          {photos.length > 0 && (
            <>
              <SectionHeader
                icon="image-multiple"
                label={`Saved Photos · ${photos.length}`}
                color={colors}
              />
              <View style={styles.photoGrid}>
                {photos.map((item) => (
                  <HoverPressable
                    key={item.imageUrl}
                    style={({ pressed, hovered }) => [
                      styles.photoCard,
                      { opacity: pressed ? 0.87 : hovered ? 0.93 : 1 },
                    ]}
                    onPress={() => goToBreed(item.breed)}
                    liftAmount={4}
                  >
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.photoImage}
                      contentFit="cover"
                      transition={250}
                      placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                    />
                    {/* Breed label overlay */}
                    <View style={styles.photoOverlay}>
                      <Text style={styles.photoBreed} numberOfLines={1}>
                        {capitalize(item.breed)}
                      </Text>
                    </View>
                    {/* Remove button */}
                    <Pressable
                      hitSlop={8}
                      onPress={() => handleRemovePhoto(item.imageUrl)}
                      style={styles.photoRemoveBtn}
                    >
                      <MaterialCommunityIcons name="heart" size={16} color="#E74C3C" />
                    </Pressable>
                  </HoverPressable>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

function SectionHeader({
  icon,
  label,
  color,
}: {
  icon: string;
  label: string;
  color: (typeof Colors)["light"];
}) {
  return (
    <View style={styles.sectionHeader}>
      <MaterialCommunityIcons name={icon as any} size={15} color={color.primary} />
      <Text style={[styles.sectionLabel, { color: color.subtext }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const PHOTO_COL_WIDTH = (340 - 8 * 3) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF3E8",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  listSection: {
    paddingHorizontal: 16,
    gap: 10,
  },
  breedCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
    gap: 14,
    paddingRight: 16,
    shadowColor: "#8B5A2B",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 2,
  },
  breedThumb: {
    width: 84,
    height: 84,
  },
  thumbPlaceholder: {
    backgroundColor: "#F5E6D0",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  breedName: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  cardSub: {
    fontSize: 12,
  },
  deleteBtn: {
    padding: 8,
  },
  // Photo grid
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
  },
  photoCard: {
    width: "47.5%",
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E8D5BA",
    marginBottom: 2,
    shadowColor: "#8B5A2B",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "rgba(44,26,14,0.48)",
  },
  photoBreed: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  photoRemoveBtn: {
    position: "absolute",
    top: 7,
    right: 7,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 14,
    padding: 5,
  },
});
