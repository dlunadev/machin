import { Routes } from '../../utils/enum/routes';
import { Redirect, RelativePathString } from 'expo-router';
import React from 'react';

export default function index() {
  return <Redirect href={Routes.SIGN_IN as unknown as RelativePathString} />;
}
