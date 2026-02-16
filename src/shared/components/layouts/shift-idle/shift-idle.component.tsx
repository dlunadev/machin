import { Begin, Play } from '@/assets/svg';
import { Zone } from '@/sdk/domain/zone/zone.entity';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { useMe, useZones } from '@/src/features/home/hooks';
import { Colors } from '@/src/shared/constants/Colors';
// import { useCustomToast } from '@/src/hooks/utils/useToast';
import { service_shift, service_shift_status } from '@/src/shared/services/shift/shift.service';
import React, { useState } from 'react';
import { Button } from '../../button/button.component';
import { Select } from '../../select/select.component';
import { Text } from '../../text/text.component';
import { VStack } from '../../ui/vstack';

export type ShiftIDLEProps = {
  setState: (status: ShiftStatus) => void;
  setShiftId: (id: string) => void;
  setZone: (zone: Zone | null) => void;
  zone: Zone | null;
};

export const ShiftIdle = (props: ShiftIDLEProps) => {
  const { zone, setZone, setShiftId, setState } = props;
  const [search, setSearch] = useState('');
  const [shiftLoader, setShiftLoader] = useState(false);
  const { user } = useMe();
  const { zones, isLoading, loadMore } = useZones(10, search);
  // const { showToast } = useCustomToast();

  const handleStart = async () => {
    try {
      setShiftLoader(true);
      if (!zone) return;

      const shift = await service_shift.create({
        seller_id: user?.id as string,
        zone_id: zone?.id as string,
        status: ShiftStatus.STARTED,
      });

      await service_shift_status.create({
        shift_id: shift.id as string,
        action: ShiftStatus.STARTED,
      });

      setShiftId(shift.id as string);
      setState(ShiftStatus.STARTED);
    } catch (error) {
      // showToast({
      //   title: 'Ha ocurrido un error',
      //   children: 'Ocurrió un error al iniciar el turno. Intente nuevamente en unos momentos.',
      // });
    } finally {
      setShiftLoader(false);
    }
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
