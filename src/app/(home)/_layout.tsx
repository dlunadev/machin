import { Header } from "@/src/components";
import { Colors } from "@/src/constants/Colors";
import { Stack } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header />,
          contentStyle: {
            backgroundColor: Colors.LIGHT_GRAY
          }
        }}
      />
    </Stack>
  );
}
