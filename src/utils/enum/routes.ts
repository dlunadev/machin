export enum AuthRoutes {
  'SIGN_IN' = '/(auth)/sign-in',
  'RECOVERY_PASSWORD' = '/(auth)/password/recovery-password',
  'SEND_EMAIL' = '/(auth)/password/send-email',
  'CONFIRMATION' = '/(auth)/password/confirmation',
  'NEW_PASSWORD' = '/(auth)/password/new-password'
}

export enum HomeRoutes {
  HOME = '/(home)'
}

export enum AuthRoutesKey {
  SIGN_IN = "index",
  RECOVERY_PASSWORD = "password/recovery-password/index",
  SEND_EMAIL = "password/send-email/index",
  CONFIRMATION = "password/confirmation/index",
  NEW_PASSWORD = "password/new-password/index",
}
