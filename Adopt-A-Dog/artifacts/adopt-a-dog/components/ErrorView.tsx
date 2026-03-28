import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorView({
  message = "Something went wrong",
  onRetry,
}: Props) {
  const colors = Colors.light;
  return (
    <View style={styles.container}>
      <Feather name="alert-circle" size={40} color={colors.error} />
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={[styles.btn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.btnText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  btn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
