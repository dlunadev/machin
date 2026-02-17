import { AuthUseCase } from '@/sdk/application/auth/auth.use-case';
import { AuthSupabaseAdapter } from '@/sdk/infraestructure/auth/auth.supabase';
import { mockSupabaseAuth, resetSupabaseMocks } from '@/sdk/__mocks__/supabase.mock';

jest.mock('@/sdk/supabase/config', () => {
  const { mockSupabaseAuth: auth } = jest.requireActual('@/sdk/__mocks__/supabase.mock');
  return {
    supabase: {
      auth: {
        signUp: (...args: unknown[]) => auth.signUp(...args),
        signInWithPassword: (...args: unknown[]) => auth.signInWithPassword(...args),
        signOut: (...args: unknown[]) => auth.signOut(...args),
        resetPasswordForEmail: (...args: unknown[]) => auth.resetPasswordForEmail(...args),
        updateUser: (...args: unknown[]) => auth.updateUser(...args),
        onAuthStateChange: (...args: unknown[]) => auth.onAuthStateChange(...args),
      },
    },
  };
});

jest.mock('@/sdk/utils/shared/session_storage', () => ({
  saveToken: jest.fn(),
  deleteToken: jest.fn(),
}));

describe('AuthUseCase + AuthSupabaseAdapter', () => {
  let useCase: AuthUseCase;

  const mockUserDTO = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { email_verified: true },
    role: 'authenticated',
    last_sign_in_at: '2025-01-15T10:30:00Z',
  };

  beforeEach(() => {
    resetSupabaseMocks();
    const adapter = new AuthSupabaseAdapter();
    useCase = new AuthUseCase(adapter);
  });

  describe('sign_up', () => {
    it('should sign up and return mapped User entity', async () => {
      mockSupabaseAuth.signUp.mockResolvedValue({
        data: { user: mockUserDTO, session: {} },
        error: null,
      });

      const result = await useCase.sign_up('test@example.com', 'password123');

      expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.data.user!.id).toBe('user-123');
      expect(result.data.user!.email).toBe('test@example.com');
      expect(result.data.user!.emailVerified).toBe(true);
    });

    it('should propagate sign up errors', async () => {
      mockSupabaseAuth.signUp.mockResolvedValue({
        data: null,
        error: new Error('Email already registered'),
      });

      await expect(useCase.sign_up('test@example.com', 'password123'))
        .rejects.toThrow('Email already registered');
    });
  });

  describe('sign_in', () => {
    it('should sign in and return mapped User entity', async () => {
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { user: mockUserDTO, session: {} },
        error: null,
      });

      const result = await useCase.sign_in('test@example.com', 'password123');

      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.data.user!.id).toBe('user-123');
      expect(result.data.user!.role).toBe('authenticated');
    });

    it('should propagate invalid credential errors', async () => {
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: null,
        error: new Error('Invalid login credentials'),
      });

      await expect(useCase.sign_in('test@example.com', 'wrong'))
        .rejects.toThrow('Invalid login credentials');
    });
  });

  describe('sign_out', () => {
    it('should sign out successfully', async () => {
      mockSupabaseAuth.signOut.mockResolvedValue({ error: null });

      await expect(useCase.sign_out()).resolves.toBeUndefined();
      expect(mockSupabaseAuth.signOut).toHaveBeenCalled();
    });

    it('should propagate sign out errors', async () => {
      mockSupabaseAuth.signOut.mockResolvedValue({
        error: new Error('Session not found'),
      });

      await expect(useCase.sign_out()).rejects.toThrow('Session not found');
    });
  });

  describe('recovery_password', () => {
    it('should request password recovery with redirect URL', async () => {
      mockSupabaseAuth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      await useCase.recovery_password('test@example.com');

      expect(mockSupabaseAuth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        { redirectTo: 'machin://password/new-password' }
      );
    });

    it('should propagate recovery errors', async () => {
      mockSupabaseAuth.resetPasswordForEmail.mockResolvedValue({
        data: null,
        error: new Error('Rate limit exceeded'),
      });

      await expect(useCase.recovery_password('test@example.com'))
        .rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('update_password', () => {
    it('should update password through adapter', async () => {
      mockSupabaseAuth.updateUser.mockResolvedValue({
        data: { user: mockUserDTO },
        error: null,
      });

      await useCase.update_password('newPassword123');

      expect(mockSupabaseAuth.updateUser).toHaveBeenCalledWith({
        password: 'newPassword123',
      });
    });

    it('should propagate password update errors', async () => {
      mockSupabaseAuth.updateUser.mockResolvedValue({
        data: null,
        error: new Error('Password too weak'),
      });

      await expect(useCase.update_password('123'))
        .rejects.toThrow('Password too weak');
    });
  });
});
