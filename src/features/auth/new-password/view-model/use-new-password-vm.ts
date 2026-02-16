import { toastService } from '@/src/shared/services';
import { AppError } from '@/src/shared/types/app-error';
import { AuthRoutes } from '@/src/shared/utils/enum/routes';
import { RelativePathString, useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard } from 'react-native';
import { mapAuthError } from '../../domain/mappers/auth-error.mapper';
import { service } from '../../domain/services/auth.services';
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
      const response = await service.update_password(password) as { error: AppError };
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
