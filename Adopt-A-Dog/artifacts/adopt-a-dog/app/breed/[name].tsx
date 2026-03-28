import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorView from "@/components/ErrorView";
import SubBreedChips from "@/components/SubBreedChips";
import HoverPressable from "@/components/HoverPressable";
import { fetchRandomImage, fetchMultipleImages } from "@/services/dogApiService";
import {
  saveFavorite,
  loadFavorites,
  removeFavorite,
  savePhotoFavorite,
  removePhotoFavorite,
  loadPhotoFavorites,
} from "@/services/prefsService";

const { width: SCREEN_W } = Dimensions.get("window");

function HeartButton({
  active,
  onPress,
  small,
}: {
  active: boolean;
  onPress: () => void;
  small?: boolean;
}) {
  const size = small ? 16 : 20;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={[
        styles.heartBtn,
        small && styles.heartBtnSmall,
        { backgroundColor: active ? "#E74C3C" : "rgba(0,0,0,0.38)" },
      ]}
    >
      <MaterialCommunityIcons
        name={active ? "heart" : "heart-outline"}
        size={size}
        color="#fff"
      />
    </Pressable>
  );
}

export default function BreedDetailScreen() {
  const { name, subBreeds: subBreedsRaw } = useLocalSearchParams<{
    name: string;
    subBreeds: string;
  }>();
  const colors = Colors.light;
  const insets = useSafeAreaInsets();

  const subBreeds: string[] = (() => {
    try { return JSON.parse(subBreedsRaw ?? "[]"); } catch { return []; }
  })();

  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [mainUrl, setMainUrl] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Breed favorite
  const [isFavorited, setIsFavorited] = useState(false);
  // Photo favorites — set of imageUrls saved as photos
  const [photoFavs, setPhotoFavs] = useState<Set<string>>(new Set());

  const currentPath = useRef(name);

  const loadImages = useCallback(async (path: string) => {
    currentPath.current = path;
    setLoading(true);
    setError(null);
    setGalleryUrls([]);
    try {
      const url = await fetchRandomImage(path);
      setMainUrl(url);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load image");
    } finally {
      setLoading(false);
    }
    setGalleryLoading(true);
    try {
      const gallery = await fetchMultipleImages(path, 4);
      setGalleryUrls(gallery);
    } catch {}
    setGalleryLoading(false);
  }, []);

  useEffect(() => {
    loadImages(name);
    loadFavorites().then((favs) => setIsFavorited(favs.includes(name)));
    loadPhotoFavorites().then((photos) =>
      setPhotoFavs(new Set(photos.map((p) => p.imageUrl)))
    );
  }, [name, loadImages]);

  const handleRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const path = selectedSub ? `${name}/${selectedSub}` : name;
    loadImages(path);
  };

  const handleSubBreedSelect = (sub: string | null) => {
    setSelectedSub(sub);
    loadImages(sub ? `${name}/${sub}` : name);
  };

  const handleFavorite = async () => {
    if (isFavorited) {
      await removeFavorite(name);
      setIsFavorited(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      await saveFavorite(name);
      setIsFavorited(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handlePhotoFav = async (imageUrl: string) => {
    const isActive = photoFavs.has(imageUrl);
    if (isActive) {
      await removePhotoFavorite(imageUrl);
      setPhotoFavs((prev) => {
        const next = new Set(prev);
        next.delete(imageUrl);
        return next;
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      await savePhotoFavorite(name, imageUrl);
      setPhotoFavs((prev) => new Set(prev).add(imageUrl));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const botPad = Platform.OS === "web" ? 34 : 0;
  const displayName = name ? name.charAt(0).toUpperCase() + name.slice(1) : "";

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 + botPad }}
      >
        {subBreeds.length > 0 && (
          <SubBreedChips
            subBreeds={subBreeds}
            selected={selectedSub}
            onSelect={handleSubBreedSelect}
          />
        )}

        {/* Main photo */}
        <View style={styles.mainImageContainer}>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorView
              message={error}
              onRetry={() =>
                loadImages(selectedSub ? `${name}/${selectedSub}` : name)
              }
            />
          ) : mainUrl ? (
            <>
              <Image
                source={{ uri: mainUrl }}
                style={styles.mainImage}
                contentFit="cover"
                placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                transition={400}
              />
              {/* Heart button — save this specific photo */}
              <HeartButton
                active={photoFavs.has(mainUrl)}
                onPress={() => handlePhotoFav(mainUrl)}
              />
            </>
          ) : null}
        </View>

        {/* Info card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <View style={styles.infoRow}>
            <View style={[styles.badge, { backgroundColor: colors.chip }]}>
              <Feather name="layers" size={13} color={colors.primary} />
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {subBreeds.length > 0
                  ? `${subBreeds.length} sub-breed${subBreeds.length > 1 ? "s" : ""}`
                  : "No sub-breeds"}
              </Text>
            </View>
            {selectedSub && (
              <View style={[styles.badge, { backgroundColor: "#FFF3E0" }]}>
                <Feather name="filter" size={13} color={colors.primaryDark} />
                <Text style={[styles.badgeText, { color: colors.primaryDark }]}>
                  {selectedSub}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.breedTitle, { color: colors.text }]}>
            {displayName}
          </Text>
          {subBreeds.length > 0 && (
            <Text style={[styles.subBreedList, { color: colors.subtext }]}>
              Varieties: {subBreeds.join(" · ")}
            </Text>
          )}
        </View>

        {/* Photo gallery */}
        {(galleryLoading || galleryUrls.length > 0) && (
          <View style={styles.gallerySection}>
            <Text style={[styles.galleryTitle, { color: colors.subtext }]}>
              MORE PHOTOS · TAP ♥ TO SAVE
            </Text>
            {galleryLoading ? (
              <View style={styles.galleryLoader}>
                <LoadingSpinner size="small" flex={false} />
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryRow}
              >
                {galleryUrls.map((url, i) => (
                  <View key={i} style={styles.galleryThumb}>
                    <Image
                      source={{ uri: url }}
                      style={styles.galleryImage}
                      contentFit="cover"
                      transition={300}
                      placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                    />
                    {/* Heart button on each gallery tile */}
                    <HeartButton
                      active={photoFavs.has(url)}
                      onPress={() => handlePhotoFav(url)}
                      small
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </ScrollView>

      {/* Action buttons */}
      <View
        style={[
          styles.actions,
          {
            paddingBottom: insets.bottom + 12 + botPad,
            borderColor: colors.border,
          },
        ]}
      >
        <HoverPressable
          style={({ pressed, hovered }) => [
            styles.actionBtn,
            {
              backgroundColor: hovered
                ? "#D4C0A4"
                : pressed
                ? "#E8D5BA"
                : colors.chip,
              opacity: loading ? 0.6 : 1,
            },
          ]}
          onPress={handleRefresh}
          disabled={loading}
          liftAmount={3}
        >
          <Feather name="refresh-cw" size={18} color={colors.text} />
          <Text style={[styles.actionBtnText, { color: colors.text }]}>
            New Photo
          </Text>
        </HoverPressable>

        <HoverPressable
          style={({ pressed, hovered }) => [
            styles.actionBtn,
            {
              backgroundColor: isFavorited
                ? hovered
                  ? "#A93226"
                  : pressed
                  ? "#C0392B"
                  : "#E74C3C"
                : hovered
                ? "#E8CEBF"
                : pressed
                ? "#F0E0D6"
                : "#FDF0EB",
              flex: 1.3,
            },
          ]}
          onPress={handleFavorite}
          liftAmount={3}
        >
          <MaterialCommunityIcons
            name={isFavorited ? "paw" : "paw-off"}
            size={18}
            color={isFavorited ? "#fff" : colors.primary}
          />
          <Text
            style={[
              styles.actionBtnText,
              { color: isFavorited ? "#fff" : colors.primary },
            ]}
          >
            {isFavorited ? "Saved Breed ✓" : "Save Breed"}
          </Text>
        </HoverPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF3E8",
  },
  mainImageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#E8D5BA",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  heartBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    borderRadius: 22,
    padding: 9,
  },
  heartBtnSmall: {
    top: 7,
    right: 7,
    padding: 6,
    borderRadius: 16,
  },
  infoCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: "#8B5A2B",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  breedTitle: {
    fontSize: 26,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  subBreedList: {
    fontSize: 13,
    lineHeight: 20,
    textTransform: "capitalize",
  },
  gallerySection: {
    marginBottom: 16,
  },
  galleryTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  galleryLoader: {
    padding: 20,
    alignItems: "center",
  },
  galleryRow: {
    paddingHorizontal: 16,
    gap: 10,
  },
  galleryThumb: {
    width: 130,
    height: 130,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#E8D5BA",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  actions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    padding: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    backgroundColor: "#FDF6ED",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
