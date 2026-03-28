import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

// Module-level cache so we never refetch the same breed URL during a session
const urlCache = new Map<string, string>();

async function getBreedImageUrl(breed: string): Promise<string> {
  if (urlCache.has(breed)) return urlCache.get(breed)!;
  const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
  const data = await res.json();
  const url: string = data.message;
  urlCache.set(breed, url);
  return url;
}

interface Props {
  breed: string;
  size?: number;
}

export default function BreedThumbnail({ breed, size = 48 }: Props) {
  const [url, setUrl] = useState<string | null>(urlCache.get(breed) ?? null);
  const colors = Colors.light;
  const radius = size / 2;

  useEffect(() => {
    if (url) return;
    getBreedImageUrl(breed)
      .then(setUrl)
      .catch(() => {});
  }, [breed]);

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: colors.chip,
        },
      ]}
    >
      {url ? (
        <Image
          source={{ uri: url }}
          style={{ width: size, height: size, borderRadius: radius }}
          contentFit="cover"
          transition={300}
          cachePolicy="memory-disk"
        />
      ) : (
        <MaterialCommunityIcons name="paw" size={size * 0.45} color={colors.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
