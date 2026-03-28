import React, { useCallback, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";

import Colors from "@/constants/colors";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorView from "@/components/ErrorView";
import PawBackground from "@/components/PawBackground";
import HoverPressable from "@/components/HoverPressable";
import { fetchBreeds, type Breed } from "@/services/dogApiService";

interface DogCard {
  breed: string;
  imageUrl: string;
}

const FEATURED = ["labrador", "golden", "poodle", "bulldog", "husky", "beagle"];

export default function ExploreScreen() {
  const router = useRouter();
  const colors = Colors.light;
  const insets = useSafeAreaInsets();

  const [cards, setCards] = useState<DogCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breeds, setBreeds] = useState<Breed[]>([]);

  const loadExplore = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allBreeds = await fetchBreeds();
      setBreeds(allBreeds);

      const available = allBreeds.map((b) => b.name);
      const featured = FEATURED.filter((f) => available.includes(f));
      const picks: string[] = [...featured.slice(0, 3)];
      while (picks.length < 8) {
        const r = available[Math.floor(Math.random() * available.length)];
        if (!picks.includes(r)) picks.push(r);
      }

      const results = await Promise.all(
        picks.map(async (breed) => {
          try {
            const res = await fetch(
              `https://dog.ceo/api/breed/${breed}/images/random`
            );
            const data = await res.json();
            return { breed, imageUrl: data.message as string };
          } catch {
            return null;
          }
        })
      );
      setCards(results.filter(Boolean) as DogCard[]);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (cards.length === 0) loadExplore();
    }, [cards.length, loadExplore])
  );

  const handleTap = (card: DogCard) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const found = breeds.find((b) => b.name === card.breed);
    router.push({
      pathname: "/breed/[name]",
      params: {
        name: card.breed,
        subBreeds: JSON.stringify(found?.subBreeds ?? []),
      },
    });
  };

  const topPad = Platform.OS === "web" ? 67 : 0;
  const botPad = Platform.OS === "web" ? 34 : 0;

  if (loading) return <View style={styles.container}><LoadingSpinner /></View>;
  if (error) return <ErrorView message={error} onRetry={loadExplore} />;

  const left = cards.filter((_, i) => i % 2 === 0);
  const right = cards.filter((_, i) => i % 2 === 1);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 + botPad }}
    >
      <PawBackground color="#8B5A2B" opacity={0.06} />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="paw" size={22} color={Colors.light.primary} />
          <Text style={[styles.heading, { color: Colors.light.text }]}>Discover</Text>
        </View>
        <HoverPressable
          onPress={() => {
            setCards([]);
            loadExplore();
          }}
          style={({ pressed, hovered }) => [
            styles.shuffleBtn,
            {
              backgroundColor: hovered
                ? Colors.light.parchment
                : pressed
                ? "#DCC8AE"
                : Colors.light.chip,
            },
          ]}
          liftAmount={3}
        >
          <Feather name="shuffle" size={14} color={Colors.light.primary} />
          <Text style={[styles.shuffleText, { color: Colors.light.primary }]}>
            Shuffle
          </Text>
        </HoverPressable>
      </View>

      <View style={styles.grid}>
        <View style={styles.col}>
          {left.map((card, i) => (
            <GridCard key={`${card.breed}-${i}`} card={card} tall={i % 3 === 0} onPress={handleTap} />
          ))}
        </View>
        <View style={styles.col}>
          {right.map((card, i) => (
            <GridCard key={`${card.breed}-${i}`} card={card} tall={i % 3 === 1} onPress={handleTap} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function GridCard({
  card,
  tall,
  onPress,
}: {
  card: DogCard;
  tall: boolean;
  onPress: (c: DogCard) => void;
}) {
  return (
    <HoverPressable
      style={({ pressed, hovered }) => [
        styles.card,
        { height: tall ? 200 : 140, opacity: pressed ? 0.88 : hovered ? 0.94 : 1 },
      ]}
      onPress={() => onPress(card)}
      liftAmount={4}
    >
      <Image
        source={{ uri: card.imageUrl }}
        style={styles.cardImage}
        contentFit="cover"
        transition={300}
        placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
      />
      <View style={styles.cardOverlay}>
        <View style={styles.cardLabelRow}>
          <MaterialCommunityIcons name="paw" size={11} color="rgba(255,255,255,0.9)" />
          <Text style={styles.cardLabel}>
            {card.breed.charAt(0).toUpperCase() + card.breed.slice(1)}
          </Text>
        </View>
      </View>
    </HoverPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF3E8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
  },
  shuffleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shuffleText: {
    fontSize: 13,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 8,
  },
  col: {
    flex: 1,
    gap: 8,
  },
  card: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#E8D5BA",
    shadowColor: "#8B5A2B",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(44,26,14,0.45)",
  },
  cardLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  cardLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
