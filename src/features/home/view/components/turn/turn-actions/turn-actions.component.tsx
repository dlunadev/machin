import { Button, HStack } from '@/src/shared/components';
import { TurnActionsProps } from './turn-actions.type';

export const TurnActions = ({ primaryAction, secondaryAction }: TurnActionsProps) => {
  return (
    <HStack className="gap-2">
      <Button onPress={secondaryAction.onPress} icon={secondaryAction.icon} left_icon stretch>
        {secondaryAction.label}
      </Button>
      <Button onPress={primaryAction.onPress} outlined={primaryAction.outlined} icon={primaryAction.icon} left_icon stretch>
        {primaryAction.label}
      </Button>
    </HStack>
  );
};
