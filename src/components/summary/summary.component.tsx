import React from 'react';
import { Text } from '../text/text.component';
import { VStack } from '../ui/vstack';

export const SummaryBlock = ({ value, label }: { value: string; label: string }) => (
  <VStack className="gap-1 items-center">
    <Text>
      {value?.includes(':') 
        ? value?.split(':').map((part, index) => {
            const suffix = index === 0 ? 'h' : index === 1 ? 'm' : 's';
            return (
              <React.Fragment key={index}>
                <Text size={24} weight={600}>{part}</Text>
                <Text size={14} weight={600}>{suffix} </Text>
              </React.Fragment>
            );
          })
        : <Text size={24} weight={600}>{value}</Text>
      }
    </Text>
    <Text size={12}>{label}</Text>
  </VStack>
);
