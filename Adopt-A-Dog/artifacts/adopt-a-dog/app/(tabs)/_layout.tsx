import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";

import Colors from "@/constants/colors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "pawprint", selected: "pawprint.fill" }} />
        <Label>Breeds</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <Icon sf={{ default: "binoculars", selected: "binoculars.fill" }} />
        <Label>Explore</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <Icon sf={{ default: "heart", selected: "heart.fill" }} />
        <Label>Favorites</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        headerStyle: { backgroundColor: "#FBF3E8" },
        headerTintColor: Colors.light.text,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : isDark ? "#1A0E06" : "#FDF6ED",
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: isDark ? "#333" : Colors.light.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: isDark ? "#1A0E06" : "#FDF6ED" },
              ]}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Adopt-a-Dog",
          tabBarLabel: "Breeds",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="pawprint.fill" tintColor={color} size={24} />
            ) : (
              <MaterialCommunityIcons name="paw" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Discover",
          tabBarLabel: "Explore",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="binoculars.fill" tintColor={color} size={24} />
            ) : (
              <Feather name="compass" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "My Favorites",
          tabBarLabel: "Favorites",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="heart.fill" tintColor={color} size={24} />
            ) : (
              <Feather name="heart" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
