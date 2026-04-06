import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";

interface DogImageProps {
  url: string;
  height?: number;
}

export default function DogImage({ url, height = 340 }: DogImageProps) {
  const [error, setError] = useState(false);
  const colors = Colors.light;

  if (error) {
    return (
      <View style={[styles.errorBox, { height }]}>
        <Feather name="image" size={48} color={colors.border} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <Image
        source={{ uri: url }}
        style={styles.image}
        contentFit="cover"
        placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
        transition={300}
        onError={() => setError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F0EAE4",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  errorBox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
});
