import { Colors } from '@/src/shared/constants/Colors';
import { View } from 'react-native';
import { Text } from '../text/text.component';

type BadgeVariant = 'solid' | 'outline' | 'subtle';
type BadgeAction = 'warning' | 'success' | 'info' | 'error';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  colorScheme?: BadgeAction;
  icon?: React.ReactNode;
  className?: string;
};

const color_scheme: Record<BadgeAction, string> = {
  success: Colors.LIGHT_GREEN,
  warning: Colors.LIGHT_YELLOW,
  info: Colors.LIGHT_BLUE,
  error: Colors.PRIMARY,
};

export function Badge({ label, colorScheme, icon, className }: BadgeProps) {
  return (
    <View
      className={`flex-row items-center gap-1 p-2 rounded-xl px-4 ${className ?? ''}`}
      style={{
        backgroundColor: color_scheme[colorScheme as BadgeAction],
      }}
    >
      {icon}
      <Text size={14} weight={400}>
        {label}
      </Text>
    </View>
  );
}
