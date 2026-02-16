import { User } from "../user/user.entity";

export interface Error {
  message: string;
  code: string | {};
  status?: number;
}

export type AuthResponse = {
  data: {
    user: User | null;
  };
  error: Error | null;
};

export interface AuthRepository {
  sign_up(email: string, password: string): Promise<AuthResponse>;
  sign_in(email: string, password: string): Promise<AuthResponse>;
  sign_out(): Promise<void>;
  recovery_password(email: string): Promise<{}>;
  update_password(password: string): Promise<{}>;
}
