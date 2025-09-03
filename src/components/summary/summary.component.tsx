import { Text } from "../text/text.component";
import { VStack } from "../ui/vstack";

export const SummaryBlock = ({ value, label }: { value: string; label: string }) => (
  <VStack className="gap-1 items-center">
    <Text>
      {value.split(/(\d+)/).map((part, index) =>
        /\d+/.test(part) ? (
          <Text key={index} size={24} weight={600}>
            {part}
          </Text>
        ) : (
          <Text key={index} size={14} weight={600}>
            {part}
          </Text>
        )
      )}
    </Text>
    <Text size={12}>{label}</Text>
  </VStack>
);