import { AppError } from "@/src/shared/types/app-error";

export type AuthErrorType =
  | 'invalid_credentials'
  | 'user_not_found'
  | 'network'
  | 'unknown';

export interface AuthErrorInfo {
  title: string;
  message: string;
  type: AuthErrorType;
}

export const mapAuthError = (error: AppError): AuthErrorInfo => {

  const errorMessage = error?.message?.toLowerCase() || '';

  if (
    errorMessage.includes('invalid') ||
    errorMessage.includes('incorrect') ||
    errorMessage.includes('wrong')
  ) {
    return {
      title: 'Error de inicio de sesión',
      message: 'Credenciales incorrectas. Verifica tu email y contraseña.',
      type: 'invalid_credentials',
    };
  }

  if (
    errorMessage.includes('not found') ||
    errorMessage.includes('user does not exist')
  ) {
    return {
      title: 'Usuario no encontrado',
      message: 'No existe una cuenta con este email.',
      type: 'user_not_found',
    };
  }

  if (
    errorMessage.includes('network') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('connection')
  ) {
    return {
      title: 'Error de conexión',
      message: 'No se pudo conectar al servidor. Verifica tu conexión.',
      type: 'network',
    };
  }

  return {
    title: 'Error inesperado',
    message: 'Ocurrió un error. Intenta de nuevo.',
    type: 'unknown',
  };
};