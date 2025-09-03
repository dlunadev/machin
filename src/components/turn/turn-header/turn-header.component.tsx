import { Calendar, Clock, Pin } from "@/assets/svg";
import { Colors } from "@/src/constants/Colors";
import { ShiftState } from "@/src/utils/enum/shift";
import { View } from "react-native";
import { Text } from "../../text/text.component";
import { HStack } from "../../ui/hstack";
import { VStack } from "../../ui/vstack";

export const TurnHeader = ({ zone, title = 'Mi Turno', state }: { zone: string | null; title?: string; state?: ShiftState }) => {
  return (
    <VStack className="mb-8">
      <Text size={20} weight={600} color={Colors.PRIMARY} className="mb-5">
        {title}
      </Text>
      <HStack className="w-full justify-between">
        {state !== 'completed' && (
          <>
            <View className="flex flex-row gap-1 items-center">
              <Calendar />
              <Text size={14} weight={400}>
                01/08/2025
              </Text>
            </View>
            <View className="flex flex-row gap-1 items-center">
              <Clock />
              <Text size={14} weight={400}>
                13:59
              </Text>
            </View>
          </>
        )}
        <View className="flex flex-row gap-1 items-center">
          <Pin />
          <Text size={14} weight={400}>
            {zone}
          </Text>
        </View>
      </HStack>
    </VStack>
  );
};
