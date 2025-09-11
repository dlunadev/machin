import { AuthRoutesKey } from '@/src/utils/enum/routes';
import { Stack } from 'expo-router';
import React from 'react';

export default function _layout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name={AuthRoutesKey.SIGN_IN} options={{ headerShown: false }} />
        <Stack.Screen name={AuthRoutesKey.RECOVERY_PASSWORD} options={{ headerShown: false }} />
        <Stack.Screen name={AuthRoutesKey.SEND_EMAIL} options={{ headerShown: false }} />
        <Stack.Screen name={AuthRoutesKey.CONFIRMATION} options={{ headerShown: false }} />
        <Stack.Screen name={AuthRoutesKey.NEW_PASSWORD} options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
