import { Header } from '@/src/shared/components';
import { Colors } from '@/src/shared/constants/Colors';
import { Stack } from 'expo-router';
import React from 'react';

export default function _layout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header />,
          contentStyle: {
            backgroundColor: Colors.LIGHT_GRAY,
          },
        }}
      />
    </Stack>
  );
}
