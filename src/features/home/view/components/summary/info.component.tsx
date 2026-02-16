import { Text, VStack } from '@/src/shared/components';
import { FC } from 'react';
import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';

export const InfoBlock = ({ icon: Icon, label, value }: { icon: FC<SvgProps>; label: string; value: string }) => (
  <VStack className="gap-1">
    <View className="flex-row gap-1 items-center">
      {Icon && <Icon />}
      <Text size={12}>{label}</Text>
    </View>
    <Text size={16} weight={600}>
      {value}
    </Text>
  </VStack>
);
