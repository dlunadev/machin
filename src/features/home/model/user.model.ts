export interface User {
  id: string;
  name: string;
  lastname: string;
  phone: string;
  is_active: boolean;
}

export function toUserViewModel(user: User) {
  return {
    id: user.id,
    name: `${user.name} ${user.lastname}`,
    phone: user.phone,
    is_active: user.is_active,
  };
}
