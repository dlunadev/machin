import { toastService } from '@/src/shared/services';
import { HomeRoutes } from '@/src/shared/utils/enum/routes';
import { RelativePathString, useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard } from 'react-native';
import { mapAuthError } from '../../domain/mappers/auth-error.mapper';
import { service } from '../../domain/services/auth.services';
import { useSignInForm } from '../form/hook/use-sign-in.form';
import { SignInFormValues } from '../form/schema/sign-in.schema';
import { SignInState } from '../model';

export const useSignInViewModel = () => {
  const router = useRouter();

  const [state, setState] = useState<SignInState>({
    isLoading: false,
  });

  const signIn = async (email: string, password: string): Promise<boolean> => {
    Keyboard.dismiss();
    setState({ isLoading: true });

    try {
      const response = await service.sign_in(email, password);
      if (response.error) {
        const errorInfo = mapAuthError(response.error);

        toastService.error(errorInfo.message, errorInfo.title);

        return false;
      }

      setState({ isLoading: false });

      router.replace(HomeRoutes.HOME as unknown as RelativePathString);

      return true;

    } catch (error: any) {
      const errorInfo = mapAuthError(error);

      toastService.error(errorInfo.message, errorInfo.title);

      return false;
    } finally {
      setState({ isLoading: false })
    }
  };

  const form = useSignInForm(async (values: SignInFormValues) => {
    const success = await signIn(values.email, values.password);
    if (!success) return;

    form.resetForm();
  })

  return {
    isLoading: state.isLoading,
    form,
  };
};