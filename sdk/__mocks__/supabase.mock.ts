export const mockSupabaseAuth = {
  signUp: jest.fn(),
  signInWithPassword: jest.fn(),
  signOut: jest.fn(),
  resetPasswordForEmail: jest.fn(),
  updateUser: jest.fn(),
  onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
  getUser: jest.fn(),
};

const mockFrom = {
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  neq: jest.fn().mockReturnThis(),
  ilike: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
};

export const mockSupabaseClient = {
  auth: mockSupabaseAuth,
  from: jest.fn(() => mockFrom),
  _mockFrom: mockFrom,
};

export function resetSupabaseMocks() {
  Object.values(mockSupabaseAuth).forEach((fn) => fn.mockReset());
  Object.values(mockFrom).forEach((fn) => {
    fn.mockReset();
    if (fn !== mockFrom.single) {
      fn.mockReturnThis();
    }
  });
  mockSupabaseClient.from.mockReset();
  mockSupabaseClient.from.mockReturnValue(mockFrom);
}
