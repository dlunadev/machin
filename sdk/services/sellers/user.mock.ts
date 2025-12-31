// get_user.mock.ts

import { Seller } from "@/sdk/domain/seller/seller.entity";

type MockUser = {
  id: string;
  email: string;
};

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const get_seller_by_email_mocked = async (): Promise<Seller | null> => {
  // ⏱️ Simula auth.getUser()
  await delay(400);

  const user: MockUser | null = {
    id: "user-123",
    email: "mock@test.com",
  };

  // Para simular usuario no logueado
  // const user = null;

  if (!user) return null;

  // ⏱️ Simula query a "sellers"
  await delay(600);

  const seller: Partial<Seller> = {
    id: "seller-1",
    name: "Mock",
    lastname: "Seller",
    phone: "223674919",
    is_active: true,
  };

  return seller as Seller;
};
