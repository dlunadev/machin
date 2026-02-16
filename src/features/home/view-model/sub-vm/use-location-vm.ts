import { useLocation } from '@/src/shared/hooks/utils/useLocation';
import { create_location } from '@/src/shared/services/location/location.service';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';

export const useLocationViewModel = (shiftId: string | null, shift: any) => {
  const { location, modalShown, openSettings } = useLocation((coords) => {
    if (shiftId && shift?.status !== ShiftStatus.FINISHED) {
      create_location({
        shift_id: shiftId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
      });
    }
  });
  
  return {
    location,
    modalShown,
    openSettings,
  };
};
