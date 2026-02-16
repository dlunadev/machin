import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { useMe, useShift, useShiftActive } from '@/src/features/home/hooks';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { HomeState, initialHomeState } from '../model';
import { useClientViewModel, useLocationViewModel, useShiftViewModel } from './sub-vm';

export const useHomeViewModel = () => {
  const [state, setState] = useState<HomeState>(initialHomeState);

  const { user } = useMe();
  const { shift, mutate } = useShift(state.shiftId as string);
  const { active_shift } = useShiftActive(user?.id as string);

  const shiftVM = useShiftViewModel(state.shiftId, shift, mutate, setState, user?.id);
  const clientVM = useClientViewModel(shift?.zone_id);
  const locationVM = useLocationViewModel(state.shiftId, shift);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (state.appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App vuelve al foreground', locationVM.location);
      }
      setState(prev => ({ ...prev, appState: nextAppState }));
    });

    return () => subscription.remove();
  }, [state.appState, locationVM.location]);

  useEffect(() => {
    if (active_shift?.id) {
      setState(prev => ({
        ...prev,
        shiftStatus: active_shift.status as ShiftStatus,
        shiftId: active_shift.id as string,
      }));
    }
  }, [active_shift]);

  const openModal = () => setState(prev => ({ ...prev, isModalOpen: true }));
  const closeModal = () => setState(prev => ({ ...prev, isModalOpen: false }));
  const openSheet = () => setState(prev => ({ ...prev, isSheetOpen: true }));
  const closeSheet = () => {
    setState(prev => ({ ...prev, isSheetOpen: false }));
    clientVM.clearSelection();
  };

  return {
    state,
    user,
    shift,

    shiftVM,
    clientVM,
    locationVM,

    openModal,
    closeModal,
    openSheet,
    closeSheet,
  };
};
