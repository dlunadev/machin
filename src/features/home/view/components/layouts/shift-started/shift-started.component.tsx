import { PauseIcon, Shift as ShiftIcon, Square } from '@/assets/svg';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { useShiftActive } from '@/src/features/home/hooks';
import { User } from '@/src/features/home/model';
import { Colors } from '@/src/shared/constants/Colors';
import React from 'react';
import { View } from 'react-native';
import { TurnActions } from '../../turn/turn-actions/turn-actions.component';
import { TurnContent } from '../../turn/turn-content/turn-content.component';
import { TurnHeader } from '../../turn/turn-header/turn-header.component';

export type ShiftStartedProps = {
  setState: (status: ShiftStatus) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
};

export const ShiftStarted = ({ user, setState, setIsOpen }: ShiftStartedProps) => {
  const { active_shift } = useShiftActive(user?.id);

  return (
    <View className="flex flex-1 w-full gap-2">
      <TurnHeader zone_id={active_shift?.zone_id as string} shift={active_shift} />
      <TurnContent
        Icon={<ShiftIcon />}
        badgeLabel="Turno Iniciado"
        badgeColor="success"
        badgeDotColor={Colors.GREEN}
        description="Tu turno ha comenzado, puedes pausar o finalizar cuando lo necesites."
      />
      <TurnActions
        primaryAction={{
          label: 'Pausar',
          onPress: () => setState(ShiftStatus.PAUSED),
          outlined: true,
          icon: <PauseIcon />,
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
