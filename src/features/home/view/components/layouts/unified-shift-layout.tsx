import { Begin, Calendar, Clock, Pause, PauseIcon, Play, Resumed, Shift as ShiftIcon, Square } from '@/assets/svg';
import { Zone } from '@/sdk/domain/zone/zone.entity';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { WebhookShift } from '@/sdk/utils/type/webhook-shift';
import { useZones } from '@/src/features/home/hooks';
import { Button } from '@/src/shared/components/button/button.component';
import { Select } from '@/src/shared/components/select/select.component';
import { InfoBlock } from '@/src/shared/components/summary/info.component';
import { SummaryBlock } from '@/src/shared/components/summary/summary.component';
import { Text } from '@/src/shared/components/text/text.component';
import { TurnActions } from '@/src/shared/components/turn/turn-actions/turn-actions.component';
import { TurnContent } from '@/src/shared/components/turn/turn-content/turn-content.component';
import { TurnHeader } from '@/src/shared/components/turn/turn-header/turn-header.component';
import { HStack } from '@/src/shared/components/ui/hstack';
import { VStack } from '@/src/shared/components/ui/vstack';
import { Colors } from '@/src/shared/constants/Colors';
import { formatDate, formatTime } from '@/src/shared/helpers/date-formatter';
import { useState } from 'react';
import { View } from 'react-native';
import { Shift, User } from '../../../model';
import { getShiftLayoutConfig } from './shift-layout.config';

interface UnifiedShiftLayoutProps {
  status: ShiftStatus;
  user: User | null;
  zone: Zone | null;
  shift: Shift | null;
  finalizeShift: WebhookShift | null;

  onSelectZone: (zone: Zone | null) => void;
  onStartShift: () => void;
  onPauseShift: () => void;
  onResumeShift: () => void;
  onFinishShift: () => void;
  onResetShift: () => void;

  isStarting: boolean;
}

export const UnifiedShiftLayout = ({
  status,
  user,
  zone,
  shift,
  finalizeShift,
  onSelectZone,
  onStartShift,
  onPauseShift,
  onResumeShift,
  onFinishShift,
  onResetShift,
  isStarting,
}: UnifiedShiftLayoutProps) => {
  const [search, setSearch] = useState('');
  const { zones, isLoading, loadMore } = useZones(10, search);

  const config = getShiftLayoutConfig(status, {
    zone,
    shift,
    finalizeShift,
    onSelectZone,
    onStartShift,
    onPauseShift,
    onResumeShift,
    onFinishShift,
    onResetShift,
    isStarting,
  });

  if (!config) return null;

  if (config.customContent === 'IDLE') {
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
            onChange={(val) => onSelectZone(val)}
            loading={isLoading}
            loadMore={loadMore}
            pageSize={10}
            search={search}
            setSearch={setSearch}
          />
        </VStack>
        {config.primaryAction && (
          <Button
            onPress={config.primaryAction.onPress}
            icon={<Play width={16} color={Colors.WHITE} />}
            left_icon={config.primaryAction.left_icon}
            disabled={config.primaryAction.disabled}
            loading={config.primaryAction.loading}
          >
            {config.primaryAction.label}
          </Button>
        )}
      </>
    );
  }

  // Renderizar FINISHED
  if (config.customContent === 'FINISHED' && finalizeShift) {
    return (
      <View className="flex flex-1 w-full gap-2">
        <TurnHeader zone_id={shift?.zone_id as string} title={config.headerTitle} state={status} shift={shift!} />
        <View className="flex-1">
          <View className="flex items-center justify-center mb-12">
            <Begin />
          </View>

          <HStack className="w-full justify-around">
            <SummaryBlock value={finalizeShift?.active_hours?.toString() || ''} label="Horas activas" />
            <SummaryBlock value={`${finalizeShift?.total_distance || 0}km`} label="Recorrido total" />
          </HStack>

          <HStack className="w-full justify-around mt-8">
            <View className="flex-col gap-6">
              <InfoBlock icon={Calendar} label="Fecha de inicio" value={formatDate(finalizeShift?.start_time, finalizeShift?.start_date)} />
              <InfoBlock icon={Calendar} label="Fecha de finalización" value={formatDate(finalizeShift?.end_time, finalizeShift?.end_date)} />
            </View>
            <View className="flex-col gap-6">
              <InfoBlock icon={Clock} label="Hora de inicio" value={formatTime(finalizeShift?.start_time || '', finalizeShift?.start_date)} />
              <InfoBlock icon={Clock} label="Hora de finalización" value={formatTime(finalizeShift?.end_time || '', finalizeShift?.end_date)} />
            </View>
          </HStack>
        </View>

        {config.primaryAction && <Button onPress={config.primaryAction.onPress}>{config.primaryAction.label}</Button>}
      </View>
    );
  }

  const getIcon = () => {
    switch (status) {
      case ShiftStatus.STARTED:
        return <ShiftIcon />;
      case ShiftStatus.PAUSED:
        return <Pause />;
      case ShiftStatus.RESUMED:
        return <Resumed />;
      default:
        return null;
    }
  };

  const getPrimaryIcon = () => {
    switch (status) {
      case ShiftStatus.STARTED:
      case ShiftStatus.RESUMED:
        return <PauseIcon />;
      case ShiftStatus.PAUSED:
        return <Play color={Colors.BLACK} />;
      default:
        return undefined;
    }
  };

  return (
    <View className="flex flex-1 w-full gap-2">
      {config.showHeader && <TurnHeader zone_id={shift?.zone_id as string} shift={shift!} title={config.headerTitle} />}

      <TurnContent Icon={getIcon()} badgeLabel={config.badgeLabel} badgeColor={config.badgeColor} badgeDotColor={config.badgeDotColor} description={config.description} />

      <TurnActions
        primaryAction={
          config.primaryAction
            ? {
                ...config.primaryAction,
                icon: config.primaryAction.icon || getPrimaryIcon(),
              }
            : {
                label: '',
                onPress: () => {},
                icon: <></>,
              }
        }
        secondaryAction={
          config.secondaryAction
            ? {
                ...config.secondaryAction,
                icon: config.secondaryAction.icon || <Square />,
              }
            : {
                label: '',
                onPress: () => {},
                icon: <></>,
              }
        }
      />
    </View>
  );
};
