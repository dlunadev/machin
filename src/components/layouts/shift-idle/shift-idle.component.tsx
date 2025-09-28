import { Begin, Play } from '@/assets/svg';
import { Zone } from '@/sdk/domain/zone/zone.entity';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { Colors } from '@/src/constants/Colors';
import { useMe, useZones } from '@/src/hooks/services';
import { create, create_status } from '@/src/services/shift/shift.service';
import React, { useState } from 'react';
import { Button } from '../../button/button.component';
import { Select } from '../../select/select.component';
import { Text } from '../../text/text.component';
import { VStack } from '../../ui/vstack';

export type ShiftIDLEProps = {
  setState: React.Dispatch<React.SetStateAction<ShiftStatus>>;
  setShiftId: React.Dispatch<React.SetStateAction<string | null>>;
  setZone: React.Dispatch<React.SetStateAction<Zone | null>>;
  zone: Zone | null;
};

export const ShiftIdle = (props: ShiftIDLEProps) => {
  const { zone, setZone, setShiftId, setState } = props;
  const [search, setSearch] = useState('');
  const [shiftLoader, setShiftLoader] = useState(false);
  const { user } = useMe();
  const { zones, isLoading, loadMore } = useZones(10, search);

  const handleStart = async () => {
    setShiftLoader(true);
    if (!zone) return;

    const shift = await create({
      seller_id: user?.id as string,
      zone_id: zone?.id as string,
    });

    await create_status({
      shift_id: shift.id as string,
      action: ShiftStatus.STARTED,
    });

    setShiftId(shift.id as string);
    setState(ShiftStatus.STARTED);
    setShiftLoader(false);
  };

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
      <Button onPress={handleStart} icon={<Play width={16} color={Colors.WHITE} />} left_icon disabled={!Boolean(zone) || shiftLoader} loading={shiftLoader}>
        Iniciar
      </Button>
    </>
  );
};
