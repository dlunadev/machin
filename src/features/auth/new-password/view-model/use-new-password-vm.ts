import { authService, toastService } from '@/src/shared/services';
import { AuthRoutes } from '@/src/shared/utils/enum/routes';
import { RelativePathString, useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard } from 'react-native';
import { mapAuthError } from '../../domain/mappers/auth-error.mapper';
import { useNewPasswordForm } from '../form/hook/use-new-password.form';
import { NewPasswordFormValues } from '../form/schema/new-password.schema';
import { NewPasswordState } from '../model';

export const useNewPasswordViewModel = () => {
  const router = useRouter();

  const [state, setState] = useState<NewPasswordState>({
    isLoading: false,
  });

  const updatePassword = async (password: string): Promise<boolean> => {
    Keyboard.dismiss();
    setState({ isLoading: true });

    try {
      const response = await authService.update_password(password);
      if (response.error) {
        const errorInfo = mapAuthError(response.error);
        toastService.error(errorInfo.message, errorInfo.title);
        return false;
      }

      toastService.success('Contraseña actualizada correctamente', 'Éxito');

      router.replace(AuthRoutes.SIGN_IN as unknown as RelativePathString);

      return true;

    } catch (error: any) {
      const errorInfo = mapAuthError(error);

      toastService.error(errorInfo.message, errorInfo.title);

      return false;
    } finally {
      setState({ isLoading: false });
    }
  };

  const form = useNewPasswordForm(async (values: NewPasswordFormValues) => {
    const success = await updatePassword(values.password);
    if (!success) return;

    form.resetForm();
  })

  return {
    isLoading: state.isLoading,
    form,
  };
};
