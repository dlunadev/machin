import { Text } from '@/src/components/text/text.component';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

function TabTwoScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }}>
      <Text color={Colors.PRIMARY}>asd</Text>
    </View>
  );
}

export default TabTwoScreen;