import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { location_service } from '../../domain/services/home.services';
import { useLocation } from '../../hooks/location/useLocation';

export const useLocationViewModel = (shiftId: string | null, shift: any) => {
  const { location, modalShown, openSettings } = useLocation((coords) => {
    if (shiftId && shift?.status !== ShiftStatus.FINISHED) {
      location_service.create({
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
