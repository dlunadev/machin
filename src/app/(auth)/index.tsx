import { Redirect, RelativePathString } from 'expo-router';
import React from 'react';
import { AuthRoutes } from '../../utils/enum/routes';

export default function index() {
  return <Redirect href={AuthRoutes.SIGN_IN as unknown as RelativePathString} />;
}
