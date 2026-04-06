import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";

interface Props {
  subBreeds: string[];
  selected: string | null;
  onSelect: (sub: string | null) => void;
}

export default function SubBreedChips({
  subBreeds,
  selected,
  onSelect,
}: Props) {
  if (subBreeds.length === 0) return null;
  const colors = Colors.light;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Pressable
        onPress={() => onSelect(null)}
        style={[
          styles.chip,
          { backgroundColor: selected === null ? colors.chipSelected : colors.chip },
        ]}
      >
        <Text
          style={[
            styles.chipText,
            { color: selected === null ? colors.chipTextSelected : colors.chipText },
          ]}
        >
          All
        </Text>
      </Pressable>
      {subBreeds.map((sub) => (
        <Pressable
          key={sub}
          onPress={() => onSelect(sub)}
          style={[
            styles.chip,
            {
              backgroundColor:
                selected === sub ? colors.chipSelected : colors.chip,
            },
          ]}
        >
          <Text
            style={[
              styles.chipText,
              {
                color:
                  selected === sub
                    ? colors.chipTextSelected
                    : colors.chipText,
              },
            ]}
          >
            {sub}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
