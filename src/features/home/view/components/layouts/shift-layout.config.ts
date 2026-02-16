import { Zone } from '@/sdk/domain/zone/zone.entity';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { WebhookShift } from '@/sdk/utils/type/webhook-shift';
import { Colors } from '@/src/shared/constants/Colors';
import { ReactNode } from 'react';
import { Shift } from '../../../model';

export interface ShiftLayoutAction {
  label: string;
  onPress: () => void;
  outlined?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  left_icon?: boolean;
}

export interface ShiftLayoutConfig {
  showHeader: boolean;
  headerTitle?: string;
  
  icon: ReactNode;
  badgeLabel?: string;
  badgeColor?: 'success' | 'warning' | 'info' | 'error';
  badgeDotColor?: string;
  description?: string;
  
  primaryAction?: ShiftLayoutAction;
  secondaryAction?: ShiftLayoutAction;
  
  customContent?: ReactNode;
}

export const getShiftLayoutConfig = (
  status: ShiftStatus,
  {
    zone,
    onStartShift,
    onPauseShift,
    onResumeShift,
    onFinishShift,
    onResetShift,
    isStarting,
  }: {
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
): ShiftLayoutConfig | null => {
  
  switch (status) {
    case ShiftStatus.IDLE:
      return {
        showHeader: false,
        icon: null as any,
        customContent: 'IDLE',
        primaryAction: {
          label: 'Iniciar',
          onPress: onStartShift,
          disabled: !zone || isStarting,
          loading: isStarting,
          left_icon: true,
        },
      };
    
    case ShiftStatus.STARTED:
      return {
        showHeader: true,
        icon: null as any,
        badgeLabel: 'Turno Iniciado',
        badgeColor: 'success',
        badgeDotColor: Colors.GREEN,
        description: 'Tu turno ha comenzado, puedes pausar o finalizar cuando lo necesites.',
        primaryAction: {
          label: 'Pausar',
          onPress: onPauseShift,
          outlined: true,
        },
        secondaryAction: {
          label: 'Finalizar',
          onPress: onFinishShift,
        },
      };
    
    case ShiftStatus.PAUSED:
      return {
        showHeader: true,
        icon: null as any,
        badgeLabel: 'Turno Pausado',
        badgeColor: 'warning',
        badgeDotColor: Colors.YELLOW,
        description: 'Tu turno está en pausa, puedes reanudar en cualquier momento o finalizar si has terminado.',
        primaryAction: {
          label: 'Reanudar',
          onPress: onResumeShift,
          outlined: true,
        },
        secondaryAction: {
          label: 'Finalizar',
          onPress: onFinishShift,
        },
      };
    
    case ShiftStatus.RESUMED:
      return {
        showHeader: true,
        icon: null as any,
        badgeLabel: 'Turno Reanudado',
        badgeColor: 'info',
        badgeDotColor: Colors.BLUE,
        description: 'Tu turno se ha reanudado, puedes pausar o finalizar cuando quieras.',
        primaryAction: {
          label: 'Pausar',
          onPress: onPauseShift,
          outlined: true,
        },
        secondaryAction: {
          label: 'Finalizar',
          onPress: onFinishShift,
        },
      };
    
    case ShiftStatus.FINISHED:
      return {
        showHeader: true,
        headerTitle: 'Resumen del dia',
        icon: null as any,
        customContent: 'FINISHED',
        primaryAction: {
          label: 'Ir al inicio',
          onPress: onResetShift,
        },
      };
    
    default:
      return null;
  }
};
