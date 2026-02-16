import { Zone } from '@/sdk/domain/zone/zone.entity';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { toastService } from '@/src/shared/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { shift_service, shift_status_service } from '../../domain/services/home.services';
import { HomeState } from '../../model';

const API_URL = Constants?.expoConfig?.extra?.API_URL;

export const useShiftViewModel = (
  shiftId: string | null,
  shift: any,
  mutate: () => void,
  setState: Dispatch<SetStateAction<HomeState>>,
  userId?: string
) => {
  const [loading, setLoading] = useState(false);
  const [startingShift, setStartingShift] = useState(false);

  const startShift = async (zone: Zone | null) => {
    if (!zone) {
      toastService.warning('Selecciona una zona', 'Zona requerida');
      return;
    }

    if (!userId) {
      toastService.error('Usuario no encontrado', 'Error');
      return;
    }

    setStartingShift(true);

    try {
      const newShift = await shift_service.create({
        seller_id: userId,
        zone_id: zone.id,
        status: ShiftStatus.STARTED,
      });

      await shift_status_service.create({
        shift_id: newShift.id as string,
        action: ShiftStatus.STARTED,
      });

      setState(prev => ({
        ...prev,
        shiftId: newShift.id as string,
        shiftStatus: ShiftStatus.STARTED,
      }));
    } catch (error: any) {
      toastService.error(
        error.message || 'Ocurrió un error al iniciar el turno. Intente nuevamente.',
        'Error al iniciar turno'
      );
    } finally {
      setStartingShift(false);
    }
  };

  const changeStatus = async (newStatus: ShiftStatus) => {
    if (!shiftId) return;

    try {
      await Promise.all([
        shift_service.update(shiftId, {
          status: newStatus,
        }),
        shift_status_service.update(shiftId, {
          action: newStatus,
        })
      ]);

      setState(prev => ({ ...prev, shiftStatus: newStatus }));
      mutate();
    } catch (error: any) {
      toastService.error(
        error.message || 'No se pudo actualizar el estado',
        'Error'
      );
    }
  };

  const resetToIdle = () => {
    setState(prev => ({
      ...prev,
      shiftId: null,
      shiftStatus: ShiftStatus.IDLE,
      zone: null,
      finalizeShift: null,
    }));
  };

  const finishShift = async () => {
    setLoading(true);
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const res = await fetch(`${API_URL}/shift/${shift?.id}`, { method: 'POST' });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const contentLength = res.headers.get('content-length');
      if (res.status === 204 || contentLength === '0') {
        console.warn('La API no devolvió contenido');
        toastService.warning('No se recibió respuesta del servidor', 'Advertencia');
        setLoading(false);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const data = await res.json();

      setState(prev => ({
        ...prev,
        finalizeShift: data.data,
        isSheetOpen: false,
        isLoading: false,
      }));

      mutate();
      await AsyncStorage.removeItem('shift_id');

    } catch (error: any) {
      console.error('Error finalizando turno:', error);
      toastService.error(
        error.message || 'No se pudo finalizar el turno',
        'Error al finalizar turno'
      );
      setState(prev => ({ ...prev, isLoading: false }));
    } finally {
      setLoading(false);
    }
  };

  const setShiftId = (id: string) => {
    setState(prev => ({ ...prev, shiftId: id }));
  };

  const setZone = (zone: Zone | null) => {
    setState(prev => ({ ...prev, zone }));
  };

  useEffect(() => {
    if (shift?.active_hours) {
      setLoading(false);
      setState(prev => ({ ...prev, shiftStatus: ShiftStatus.FINISHED }));
    }
  }, [shift?.active_hours]);

  return {
    loading,
    startingShift,
    startShift,
    changeStatus,
    resetToIdle,
    finishShift,
    setShiftId,
    setZone,
  };
};
