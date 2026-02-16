import { PauseIcon, Resumed, Square } from '@/assets/svg';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { User } from '@/src/features/home/model';
import { Colors } from '@/src/shared/constants/Colors';
import { useShiftActive } from '@/src/shared/hooks/services';
import React from 'react';
import { View } from 'react-native';
import { TurnActions } from '../../turn/turn-actions/turn-actions.component';
import { TurnContent } from '../../turn/turn-content/turn-content.component';
import { TurnHeader } from '../../turn/turn-header/turn-header.component';

export type ShiftResumedProps = {
  setState: (status: ShiftStatus) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
};

export const ShiftResumed = ({ user, setState, setIsOpen }: ShiftResumedProps) => {
  const { active_shift: shift } = useShiftActive(user?.id);

  return (
    <View className="flex flex-1 w-full gap-2">
      <TurnHeader zone_id={shift?.zone_id as string} shift={shift} />
      <TurnContent
        Icon={<Resumed />}
        badgeLabel="Turno Reanudado"
        badgeColor="info"
        badgeDotColor={Colors.BLUE}
        description="Tu turno se ha reanudado, puedes pausar o finalizar cuando quieras."
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
