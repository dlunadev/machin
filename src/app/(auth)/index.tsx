import { AuthRoutes } from '@/src/features/shared/utils/routes';
import { Redirect, RelativePathString } from 'expo-router';
import React from 'react';

export default function index() {
  return <Redirect href={AuthRoutes.SIGN_IN as unknown as RelativePathString} />;
}
