import { Zone } from '@/sdk/domain/zone/zone.entity';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { WebhookShift } from '@/sdk/utils/type/webhook-shift';
import { AppState, AppStateStatus } from 'react-native';

export interface HomeState {
  shiftId: string | null;
  shiftStatus: ShiftStatus;
  zone: Zone | null;
  finalizeShift: WebhookShift | null;
  
  isModalOpen: boolean;
  isSheetOpen: boolean;
  isLoading: boolean;
  
  appState: AppStateStatus;
}

export const initialHomeState: HomeState = {
  shiftId: null,
  shiftStatus: ShiftStatus.IDLE,
  zone: null,
  finalizeShift: null,
  isModalOpen: false,
  isSheetOpen: false,
  isLoading: false,
  appState: AppState.currentState,
};
