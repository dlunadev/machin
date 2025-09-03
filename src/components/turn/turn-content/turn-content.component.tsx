import { StyleSheet, View } from 'react-native';
import { Badge } from '../../badge/badge.component';
import { Text } from '../../text/text.component';
import { VStack } from '../../ui/vstack';
import { TurnContentProps } from './turn-content.type';

export const TurnContent = (props: TurnContentProps) => {
  const { Icon, badgeLabel, badgeColor, badgeDotColor, description } = props;
  return (
    <VStack className="flex-1 items-center gap-8">
      {Icon}
      <Badge label={badgeLabel} variant="solid" colorScheme={badgeColor} icon={<View style={[styles.badge, { backgroundColor: badgeDotColor }]} />} />
      <Text weight={300} size={12} align="center" className="w-[80%]">
        {description}
      </Text>
    </VStack>
  );
};

const styles = StyleSheet.create({
  badge: {
    width: 12,
    height: 12,
    borderRadius: 100,
  },
});
