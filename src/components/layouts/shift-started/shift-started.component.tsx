import { PauseIcon, Shift as ShiftIcon, Square } from '@/assets/svg';
import { Seller } from '@/sdk/domain/seller/seller.entity';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { Colors } from '@/src/constants/Colors';
import { useShiftActive } from '@/src/hooks/services';
import { update } from '@/src/services/shift/shift.service';
import React from 'react';
import { View } from 'react-native';
import { TurnActions } from '../../turn/turn-actions/turn-actions.component';
import { TurnContent } from '../../turn/turn-content/turn-content.component';
import { TurnHeader } from '../../turn/turn-header/turn-header.component';

export type ShiftProps = {
  setState: React.Dispatch<React.SetStateAction<ShiftStatus>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: Seller | null | undefined;
};

export const ShiftStarted = (props: ShiftProps) => {
  const { user, setState, setIsOpen } = props;
  const { active_shift } = useShiftActive(user?.id);

  console.log('shift_started', active_shift);

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
          onPress: () => {
            setState(ShiftStatus.PAUSED);
            update(active_shift?.id as string, { status: ShiftStatus.PAUSED });
          },
          outlined: true,
          icon: <PauseIcon />,
        }}
        secondaryAction={{
          label: 'Finalizar',
          onPress: () => {
            setIsOpen(true);
          },
          icon: <Square />,
        }}
      />
    </View>
  );
};
