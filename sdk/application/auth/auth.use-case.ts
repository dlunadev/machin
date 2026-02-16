import { AuthRepository, AuthResponse } from "@/sdk/domain/auth/auth.repository";

export class AuthUseCase implements AuthRepository {
  constructor(
    private readonly repository: AuthRepository
  ) { }

  sign_up(email: string, password: string): Promise<AuthResponse> {
    return this.repository.sign_up(email, password);
  }
  sign_in(email: string, password: string): Promise<AuthResponse> {
    return this.repository.sign_in(email, password);
  }
  sign_out(): Promise<void> {
    return this.repository.sign_out();
  }
  recovery_password(email: string): Promise<{}> {
    return this.repository.recovery_password(email);
  }
  update_password(password: string): Promise<AuthResponse | {}> {
    return this.repository.update_password(password);
  }

}