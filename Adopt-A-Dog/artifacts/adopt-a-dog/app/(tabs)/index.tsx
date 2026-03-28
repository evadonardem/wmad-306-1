import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";

import Colors from "@/constants/colors";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorView from "@/components/ErrorView";
import PawBackground from "@/components/PawBackground";
import BreedThumbnail from "@/components/BreedThumbnail";
import HoverPressable from "@/components/HoverPressable";
import {
  fetchBreeds,
  fetchRandomBreedAndImage,
  type Breed,
} from "@/services/dogApiService";
import { loadLastSearch, saveLastSearch } from "@/services/prefsService";

export default function BreedListScreen() {
  const router = useRouter();
  const colors = Colors.light;
  const insets = useSafeAreaInsets();

  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [heroBreed, setHeroBreed] = useState<string>("");
  const [heroUrl, setHeroUrl] = useState<string>("");
  const [heroLoading, setHeroLoading] = useState(true);

  const loadBreeds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, hero] = await Promise.all([
        fetchBreeds(),
        fetchRandomBreedAndImage(),
      ]);
      setBreeds(data);
      setHeroBreed(hero.breed);
      setHeroUrl(hero.imageUrl);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load breeds");
    } finally {
      setLoading(false);
      setHeroLoading(false);
    }
  }, []);

  const refreshHero = useCallback(async () => {
    setHeroLoading(true);
    try {
      const hero = await fetchRandomBreedAndImage();
      setHeroBreed(hero.breed);
      setHeroUrl(hero.imageUrl);
    } catch {}
    setHeroLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshHero();
    setRefreshing(false);
  }, [refreshHero]);

  useEffect(() => {
    loadBreeds();
    loadLastSearch().then((saved) => {
      if (saved) setSearch(saved);
    });
  }, [loadBreeds]);

  const handleSearchChange = (text: string) => {
    setSearch(text);
    saveLastSearch(text);
  };

  const filteredBreeds =
    search.trim().length === 0
      ? breeds
      : breeds.filter((b) =>
          b.name.toLowerCase().includes(search.toLowerCase().trim())
        );

  const handleBreedTap = (breed: Breed) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/breed/[name]",
      params: {
        name: breed.name,
        subBreeds: JSON.stringify(breed.subBreeds),
      },
    });
  };

  const topPad = Platform.OS === "web" ? 67 : 0;
  const botPad = Platform.OS === "web" ? 34 : 0;

  const HeroCard = () => (
    <Pressable
      style={styles.hero}
      onPress={() => {
        if (heroBreed) {
          const found = breeds.find((b) => b.name === heroBreed);
          handleBreedTap(found ?? { name: heroBreed, subBreeds: [] });
        }
      }}
    >
      {heroUrl ? (
        <Image
          source={{ uri: heroUrl }}
          style={styles.heroImage}
          contentFit="cover"
          transition={600}
        />
      ) : (
        <View style={[styles.heroImage, styles.heroPlaceholder]} />
      )}
      <View style={styles.heroOverlay}>
        <View style={styles.heroBadge}>
          <MaterialCommunityIcons name="paw" size={11} color="#fff" />
          <Text style={styles.heroLabel}>DOG OF THE DAY</Text>
        </View>
        <Text style={styles.heroBreed}>
          {heroBreed
            ? heroBreed.charAt(0).toUpperCase() + heroBreed.slice(1)
            : "Loading…"}
        </Text>
        <View style={styles.heroRow}>
          <Feather name="arrow-right" size={13} color="rgba(255,255,255,0.85)" />
          <Text style={styles.heroTap}>Tap to explore</Text>
        </View>
      </View>
      <Pressable style={styles.heroRefresh} onPress={refreshHero} hitSlop={10}>
        <Feather name="refresh-cw" size={16} color="#fff" />
      </Pressable>
    </Pressable>
  );

  const SearchBar = () => (
    <View style={[styles.searchBar, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <MaterialCommunityIcons name="magnify" size={18} color={colors.subtext} />
      <TextInput
        style={[styles.searchInput, { color: colors.text }]}
        placeholder={`Search ${breeds.length} breeds…`}
        placeholderTextColor={colors.subtext}
        value={search}
        onChangeText={handleSearchChange}
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {search.length > 0 && Platform.OS !== "ios" && (
        <Pressable onPress={() => handleSearchChange("")}>
          <Feather name="x" size={15} color={colors.subtext} />
        </Pressable>
      )}
    </View>
  );

  if (loading) return <View style={[styles.container, { paddingTop: topPad }]}><LoadingSpinner /></View>;
  if (error) return <ErrorView message={error} onRetry={loadBreeds} />;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Paw print wallpaper behind everything */}
      <PawBackground color="#8B5A2B" opacity={0.07} />

      <FlatList
        data={filteredBreeds}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={
          <>
            {search.trim().length === 0 && <HeroCard />}
            <SearchBar />
            {filteredBreeds.length > 0 && (
              <Text style={[styles.sectionLabel, { color: colors.subtext }]}>
                {search.trim()
                  ? `${filteredBreeds.length} results`
                  : "ALL BREEDS"}
              </Text>
            )}
          </>
        }
        renderItem={({ item }) => (
          <HoverPressable
            style={({ pressed, hovered }) => [
              styles.breedItem,
              {
                backgroundColor: hovered
                  ? "#EDD9C0"
                  : pressed
                  ? colors.parchment
                  : "rgba(255,250,244,0.95)",
              },
            ]}
            onPress={() => handleBreedTap(item)}
            liftAmount={2}
          >
            <BreedThumbnail breed={item.name} size={48} />

            <View style={styles.breedInfo}>
              <Text style={[styles.breedName, { color: colors.text }]}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Text>
              {item.subBreeds.length > 0 && (
                <Text style={[styles.subBreedCount, { color: colors.subtext }]}>
                  {item.subBreeds.length} sub-breed
                  {item.subBreeds.length > 1 ? "s" : ""}
                </Text>
              )}
            </View>
            <Feather name="chevron-right" size={18} color={colors.border} />
          </HoverPressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="paw-off" size={44} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              No breeds found for "{search}"
            </Text>
          </View>
        }
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 80 + botPad },
        ]}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF3E8",
  },
  hero: {
    margin: 16,
    borderRadius: 22,
    overflow: "hidden",
    height: 220,
    shadowColor: "#8B5A2B",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E8D5BA",
  },
  heroPlaceholder: {
    backgroundColor: "#E8D5BA",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 20,
    backgroundColor: "rgba(44,26,14,0.5)",
    gap: 3,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 2,
  },
  heroLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 1.5,
  },
  heroBreed: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    textTransform: "capitalize",
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  heroTap: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  heroRefresh: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(44,26,14,0.4)",
    borderRadius: 20,
    padding: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    shadowColor: "#8B5A2B",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  breedItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 14,
  },
  pawBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  breedInfo: { flex: 1 },
  breedName: {
    fontSize: 16,
    fontWeight: "600",
  },
  subBreedCount: {
    fontSize: 12,
    marginTop: 2,
  },
  separator: {
    height: 1,
    marginLeft: 74,
  },
  list: { paddingTop: 4 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 40,
    marginTop: 30,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
  },
});
