import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Stack } from 'expo-router';

export default function _layout() {
  return (
    <>
      <StatusBar translucent style="dark" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in/index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
