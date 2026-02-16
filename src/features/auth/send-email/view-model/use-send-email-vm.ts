import { AuthSupabaseAdapter } from '@/sdk/infraestructure';
import { toastService } from '@/src/shared/services';
import { useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { useTimer } from '../hooks/use-timer';
import { SendEmailState } from '../model';

const { recovery_password } = new AuthSupabaseAdapter();

export const useSendEmailViewModel = () => {
  const params = useRoute().params as { email?: string };

  const { formattedTime, start, reset } = useTimer(120);

  const [state, setState] = useState<SendEmailState>({
    timerActive: false,
    email: params.email || '',
  });

  const resendEmail = async () => {
    try {
      await recovery_password(state.email);

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
