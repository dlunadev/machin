import { User } from '@/sdk/domain/user/user.entity';

describe('User.fromDTO', () => {
  it('should map a complete DTO to a User entity', () => {
    const dto = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: { email_verified: true },
      role: 'admin',
      last_sign_in_at: '2025-01-15T10:30:00Z',
    };

    const user = User.fromDTO(dto);

    expect(user.id).toBe('user-123');
    expect(user.email).toBe('test@example.com');
    expect(user.emailVerified).toBe(true);
    expect(user.role).toBe('admin');
    expect(user.lastSignInAt).toEqual(new Date('2025-01-15T10:30:00Z'));
  });

  it('should default emailVerified to false when user_metadata is missing', () => {
    const dto = {
      id: 'user-456',
      email: 'test@example.com',
      role: 'user',
      last_sign_in_at: null,
    };

    const user = User.fromDTO(dto);

    expect(user.emailVerified).toBe(false);
    expect(user.lastSignInAt).toBeNull();
  });

  it('should default role to "user" when not provided', () => {
    const dto = {
      id: 'user-789',
      email: 'test@example.com',
    };

    const user = User.fromDTO(dto);

    expect(user.role).toBe('user');
  });

  it('should handle null last_sign_in_at', () => {
    const dto = {
      id: 'user-000',
      email: 'test@example.com',
      last_sign_in_at: null,
    };

    const user = User.fromDTO(dto);

    expect(user.lastSignInAt).toBeNull();
  });
});
