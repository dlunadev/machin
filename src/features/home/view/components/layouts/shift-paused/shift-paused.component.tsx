import { Pause, Play, Square } from '@/assets/svg';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { User } from '@/src/features/home/model';
import { Colors } from '@/src/shared/constants/Colors';
import { useShiftActive } from '@/src/shared/hooks/services';
import { View } from 'react-native';
import { TurnActions } from '../../turn/turn-actions/turn-actions.component';
import { TurnContent } from '../../turn/turn-content/turn-content.component';
import { TurnHeader } from '../../turn/turn-header/turn-header.component';

export type ShiftPausedProps = {
  setState: (status: ShiftStatus) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
};

export const ShiftPaused = ({ user, setState, setIsOpen }: ShiftPausedProps) => {
  const { active_shift: shift } = useShiftActive(user?.id);

  return (
    <View className="flex flex-1 w-full gap-2">
      <TurnHeader zone_id={shift?.zone_id as string} shift={shift} />
      <TurnContent
        Icon={<Pause />}
        badgeLabel="Turno Pausado"
        badgeColor="warning"
        badgeDotColor={Colors.YELLOW}
        description="Tu turno está en pausa, puedes reanudar en cualquier momento o finalizar si has terminado."
      />
      <TurnActions
        primaryAction={{
          label: 'Reanudar',
          onPress: () => setState(ShiftStatus.RESUMED),
          outlined: true,
          icon: <Play color={Colors.BLACK} />,
        }}
        secondaryAction={{
          label: 'Finalizar',
          onPress: () => setIsOpen(true),
          icon: <Square />,
        }}
      />
    </View>
  );
};
