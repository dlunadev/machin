import { Begin, Calendar, Clock } from '@/assets/svg';
import { Seller } from '@/sdk/domain/seller/seller.entity';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { WebhookShift } from '@/sdk/utils/type/webhook-shift';
import { useShift } from '@/src/features/home/hooks';
import { Button, HStack } from '@/src/shared/components';
import { formatDate, formatTime } from '@/src/shared/helpers/date-formatter';
import React from 'react';
import { View } from 'react-native';
import { InfoBlock, SummaryBlock } from '../../summary';
import { TurnHeader } from '../../turn';

export type ShiftFinishedProps = {
  state: ShiftStatus;
  onReset: () => void;
  finalize_shift: WebhookShift;
  user: Partial<Seller> | undefined | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ShiftFinished = ({ state, finalize_shift, onReset }: ShiftFinishedProps) => {
  const { shift } = useShift(finalize_shift.shift_id);

  return (
    <>
      <View className="flex flex-1 w-full gap-2">
        <TurnHeader zone_id={shift?.zone_id as string} title="Resumen del dia" state={state} shift={shift!} />
        <View className="flex-1">
          <View className="flex items-center justify-center mb-12">
            <Begin />
          </View>

          <HStack className="w-full justify-around">
            <SummaryBlock value={finalize_shift?.active_hours?.toString() || ''} label="Horas activas" />
            <SummaryBlock value={`${finalize_shift?.total_distance || 0}km`} label="Recorrido total" />
          </HStack>

          <HStack className="w-full justify-around mt-8">
            <View className="flex-col gap-6">
              <InfoBlock icon={Calendar} label="Fecha de inicio" value={formatDate(finalize_shift?.start_time, finalize_shift?.start_date)} />
              <InfoBlock icon={Calendar} label="Fecha de finalización" value={formatDate(finalize_shift?.end_time, finalize_shift?.end_date)} />
            </View>
            <View className="flex-col gap-6">
              <InfoBlock icon={Clock} label="Hora de inicio" value={formatTime(finalize_shift?.start_time || '', finalize_shift?.start_date)} />
              <InfoBlock icon={Clock} label="Hora de finalización" value={formatTime(finalize_shift?.end_time || '', finalize_shift?.end_date)} />
            </View>
          </HStack>
        </View>

        <Button onPress={onReset}>Ir al inicio</Button>
      </View>
    </>
  );
};
