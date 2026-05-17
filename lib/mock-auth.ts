export type MockUser = {
  email: string;
  name: string;
};

type MockAuthUser = MockUser & {
  password: string;
};

export const mockAuthUsers: MockAuthUser[] = [
  {
    email: 'omar@gmail.com',
    password: 'omar123',
    name: 'Omar',
  },
];

export function authenticateMockUser(email: string, password: string): MockUser | null {
  const normalizedEmail = email.trim().toLowerCase();

  const user = mockAuthUsers.find(
    (mockUser) => mockUser.email.toLowerCase() === normalizedEmail && mockUser.password === password
  );

  if (!user) {
    return null;
  }

  return {
    email: user.email,
    name: user.name,
  };
}
