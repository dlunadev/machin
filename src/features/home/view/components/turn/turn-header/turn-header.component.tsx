import { Calendar, Clock, Pin } from '@/assets/svg';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { useZone } from '@/src/features/home/hooks';
import { HStack, Text, VStack } from '@/src/shared/components';
import { Colors } from '@/src/shared/constants/Colors';
import dayjs from 'dayjs';
import { View } from 'react-native';
import { TurnHeaderProps } from './turn-header.type';

export const TurnHeader = (props: TurnHeaderProps) => {
  const { zone_id, title = 'Mi Turno', state, shift } = props;
  const { zone } = useZone(zone_id as string);

  return (
    <VStack className="mb-8 gap-2">
      <Text size={20} weight={600} color={Colors.PRIMARY} className="mb-3">
        {title}
      </Text>
      <View className="flex flex-row gap-2 w-full">
        <HStack className="gap-2">
          {state !== ShiftStatus.FINISHED && (
            <>
              <View className="flex flex-row gap-1 items-center">
                <Calendar />
                <Text size={14} weight={400}>
                  {dayjs(shift?.created_at || new Date()).format('DD/MM/YYYY')}
                </Text>
              </View>
              <View className="flex flex-row gap-1 items-center">
                <Clock />
                <Text size={14} weight={400}>
                  {dayjs(shift?.created_at || new Date()).format('HH:mm')}
                </Text>
              </View>
            </>
          )}
        </HStack>
        <View className="flex flex-row gap-1 items-center">
          <Pin />
          <Text size={14} weight={400} maxLength={state !== ShiftStatus.FINISHED ? 20 : undefined}>
            {zone?.name ?? 'Sin dirección'}
          </Text>
        </View>
      </View>
    </VStack>
  );
};
