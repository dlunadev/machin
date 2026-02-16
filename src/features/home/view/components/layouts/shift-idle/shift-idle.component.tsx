import { Begin, Play } from '@/assets/svg';
import { Zone } from '@/sdk/domain/zone/zone.entity';
import { Colors } from '@/src/shared/constants/Colors';
import { useZones } from '@/src/shared/hooks/services';
import React, { useState } from 'react';
import { Button } from '@/src/shared/components/button/button.component';
import { Select } from '@/src/shared/components/select/select.component';
import { Text } from '@/src/shared/components/text/text.component';
import { VStack } from '@/src/shared/components/ui/vstack';

export type ShiftIDLEProps = {
  zone: Zone | null;
  setZone: (zone: Zone | null) => void;
  onStartShift: () => void;
  isStarting: boolean;
};

export const ShiftIdle = ({ zone, setZone, onStartShift, isStarting }: ShiftIDLEProps) => {
  const [search, setSearch] = useState('');
  const { zones, isLoading, loadMore } = useZones(10, search);

  return (
    <>
      <VStack className="flex-1 items-center gap-8">
        <Begin />
        <Text size={20} weight={600} color={Colors.PRIMARY} align="center">
          Tu turno está por comenzar
        </Text>
        <Text size={14} weight={300} align="center">
          Selecciona tu zona de trabajo y presiona iniciar cuando estés listo.
        </Text>
        <Select
          placeholder="Seleccionar zona"
          data={zones}
          onChange={(val) => setZone(val)}
          loading={isLoading}
          loadMore={loadMore}
          pageSize={10}
          search={search}
          setSearch={setSearch}
        />
      </VStack>
      <Button 
        onPress={onStartShift} 
        icon={<Play width={16} color={Colors.WHITE} />} 
        left_icon 
        disabled={!Boolean(zone) || isStarting} 
        loading={isStarting}
      >
        Iniciar
      </Button>
    </>
  );
};
