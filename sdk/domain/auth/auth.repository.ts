import { User } from "../user/user.entity";

type AuthError = {
  status: number,
  code: string | {},
  message: string,
}

export type AuthResponse = {
  data: {
    user: User | null;
  };
  error: AuthError | null;
};

export interface AuthRepository {
  sign_up(email: string, password: string): Promise<AuthResponse>;
  sign_in(email: string, password: string): Promise<AuthResponse>;
  sign_out(): Promise<void>;
  recovery_password(email: string): Promise<{}>;
  update_password(password: string): Promise<{}>;
}
