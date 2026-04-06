import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Colors from "@/constants/colors";

interface Props {
  size?: "small" | "large";
  flex?: boolean;
}

export default function LoadingSpinner({ size = "large", flex = true }: Props) {
  return (
    <View style={[styles.container, flex && styles.flex]}>
      <ActivityIndicator size={size} color={Colors.light.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  flex: {
    flex: 1,
  },
});
