import { toastService } from '@/src/shared/services';
import { useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { service } from '../../domain/services/auth.services';
import { useTimer } from '../hooks/use-timer';
import { SendEmailState } from '../model';

export const useSendEmailViewModel = () => {
  const params = useRoute().params as { email?: string };

  const { formattedTime, start, reset } = useTimer(120);

  const [state, setState] = useState<SendEmailState>({
    timerActive: false,
    email: params.email || '',
  });

  const resendEmail = async () => {
    try {
      await service.recovery_password(state.email);

      toastService.success('Revisa tu bandeja de entrada', 'Correo enviado');

      reset();
      setState(prev => ({ ...prev, timerActive: true }));
      start();

    } catch {
      toastService.error('No se pudo enviar el correo', 'Error');
    }
  };

  return {
    email: state.email,
    timerActive: state.timerActive,
    formattedTime,
    resendEmail,
  };
};
