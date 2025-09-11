export class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly emailVerified: boolean,
    public readonly role: string,
    public readonly lastSignInAt: Date | null
  ) { }

  public static fromDTO(dto: any): User {
    return new User(
      dto.id,
      dto.email,
      dto.user_metadata?.email_verified ?? false,
      dto.role ?? 'user',
      dto.last_sign_in_at ? new Date(dto.last_sign_in_at) : null
    );
  }
}

// class UserMapper {
//   static fromDTO(dto: { name: string, lastname: string }): User {
//     return new User({ name, lastname });
//   }
//   static fromDomain(user: User) {
//     return {
//       name: user.name,
//       lastname: user.lastname,
//     }
//   }
// }