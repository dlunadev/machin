import { AuthRepository, AuthResponse } from "@/sdk/domain/auth/auth.repository";
import { User } from "@/sdk/domain/user/user.entity";

/**
 * Mock Auth Adapter - Simula requests con delays y errores aleatorios
 * Credenciales válidas: user@email.com / abc*123
 */
export class AuthMockAdapter implements AuthRepository {
  private readonly VALID_EMAIL = "user@email.com";
  private readonly VALID_PASSWORD = "abc*123";
  private readonly ERROR_RATE = 0.15; // 15% de probabilidad de error
  private readonly MIN_DELAY = 800; // ms
  private readonly MAX_DELAY = 2500; // ms

  /**
   * Simula un delay aleatorio de red
   */
  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * (this.MAX_DELAY - this.MIN_DELAY) + this.MIN_DELAY;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Simula errores aleatorios de red/servidor
   */
  private shouldSimulateError(): boolean {
    return Math.random() < this.ERROR_RATE;
  }

  /**
   * Genera un mock de User
   */
  private createMockUser(email: string): User {
    const mockDTO = {
      id: `mock-user-${Date.now()}`,
      email: email,
      user_metadata: {
        email_verified: true
      },
      role: 'seller',
      last_sign_in_at: new Date().toISOString()
    };

    return User.fromDTO(mockDTO);
  }

  /**
   * Sign Up - Registro de usuario
   */
  sign_up = async (email: string, password: string): Promise<AuthResponse> => {
    await this.simulateNetworkDelay();

    // Simular error de red aleatorio
    if (this.shouldSimulateError()) {
      throw {
        status: 500,
        code: 'network_error',
        message: 'Error de conexión. Por favor, intentá de nuevo.'
      };
    }

    // Validar email duplicado
    if (email === this.VALID_EMAIL) {
      return {
        data: { user: null },
        error: {
          status: 400,
          code: 'user_already_exists',
          message: 'Este email ya está registrado'
        }
      };
    }

    // Validar formato de password
    if (password.length < 6) {
      return {
        data: { user: null },
        error: {
          status: 400,
          code: 'weak_password',
          message: 'La contraseña debe tener al menos 6 caracteres'
        }
      };
    }

    // Registro exitoso
    const user = this.createMockUser(email);
    return {
      data: { user },
      error: null
    };
  };

  /**
   * Sign In - Inicio de sesión
   */
  sign_in = async (email: string, password: string): Promise<AuthResponse> => {
    await this.simulateNetworkDelay();

    // Simular error de red aleatorio
    if (this.shouldSimulateError()) {
      throw {
        status: 503,
        code: 'service_unavailable',
        message: 'Servicio temporalmente no disponible. Reintentá en unos segundos.'
      };
    }

    // Validar credenciales
    if (email !== this.VALID_EMAIL || password !== this.VALID_PASSWORD) {
      return {
        data: { user: null },
        error: {
          status: 401,
          code: 'invalid_credentials',
          message: 'Email o contraseña incorrectos'
        }
      };
    }

    // Login exitoso
    const user = this.createMockUser(email);
    return {
      data: { user },
      error: null
    };
  };

  /**
   * Sign Out - Cerrar sesión
   */
  sign_out = async (): Promise<void> => {
    await this.simulateNetworkDelay();

    // Simular error ocasional
    if (this.shouldSimulateError()) {
      throw {
        status: 500,
        code: 'signout_error',
        message: 'Error al cerrar sesión'
      };
    }

    // Logout exitoso (no retorna nada)
  };

  /**
   * Recovery Password - Recuperar contraseña
   */
  recovery_password = async (email: string): Promise<{}> => {
    await this.simulateNetworkDelay();

    // Simular error de red
    if (this.shouldSimulateError()) {
      throw {
        status: 500,
        code: 'email_send_error',
        message: 'Error al enviar el email de recuperación'
      };
    }

    // Validar que el email existe
    if (email !== this.VALID_EMAIL) {
      throw {
        status: 404,
        code: 'user_not_found',
        message: 'No existe una cuenta con este email'
      };
    }

    // Retornar éxito (mock)
    return {
      success: true,
      message: 'Email de recuperación enviado'
    };
  };

  /**
   * Update Password - Actualizar contraseña
   */
  update_password = async (password: string): Promise<{}> => {
    await this.simulateNetworkDelay();

    // Simular error aleatorio
    if (this.shouldSimulateError()) {
      throw {
        status: 500,
        code: 'update_error',
        message: 'Error al actualizar la contraseña'
      };
    }

    // Validar formato de password
    if (password.length < 6) {
      throw {
        status: 400,
        code: 'weak_password',
        message: 'La contraseña debe tener al menos 6 caracteres'
      };
    }

    // Retornar éxito
    return {
      success: true,
      message: 'Contraseña actualizada correctamente'
    };
  };
}
