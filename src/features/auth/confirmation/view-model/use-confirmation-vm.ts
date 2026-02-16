import { AuthRoutes } from '@/src/features/shared/utils/routes';
import { RelativePathString, useRouter } from 'expo-router';
import { useState } from 'react';
import { ConfirmationState } from '../model';

export const useConfirmationViewModel = () => {
  const router = useRouter();

  const [state, setState] = useState<ConfirmationState>({});

  const submit = () => {
    router.push(AuthRoutes.SIGN_IN as unknown as RelativePathString);
  };

  return {
    submit,
  };
};
