import { authService, toastService } from '@/src/shared/services';
import { AuthRoutes } from '@/src/shared/utils/enum/routes';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard } from 'react-native';
import { useRecoveryPasswordForm } from '../form/hook/use-recovery-password.form';
import { mapAuthError, RecoveryState } from '../model';

export const useRecoveryPasswordVM = () => {
  const router = useRouter();

  const [state, setState] = useState<RecoveryState>({
    isLoading: false,
  });

  const recovery_password = async (email: string): Promise<boolean> => {
    Keyboard.dismiss();
    setState({ isLoading: true });

    try {
      const data = await authService.recovery_password(email);
      console.log('recovery', data);
      router.push({
        pathname: AuthRoutes.SEND_EMAIL,
        params: { email: email },
      });

      return true;

    } catch (error: any) {
      const errorInfo = mapAuthError(error);

      toastService.error(errorInfo.message, errorInfo.title);

      return false;
    } finally {
      setState({
        isLoading: false
      })
    }
  };

  const form = useRecoveryPasswordForm(async (values) => {
    const success = await recovery_password(values.email);
    if (!success) return;

    form.resetForm();
  })

  return {
    isLoading: state.isLoading,
    form,
  };
};