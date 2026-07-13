import { hashPassword } from "../utils/passwords";
import { comparePassword } from "../utils/passwords";
import { createUser, findUserByEmail } from "../repositories/user.repository";

type UserRole = "FREELANCER" | "CLIENT" | "ADMIN";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Security: Prevent ADMIN role creation through public registration
  if (data.role === "ADMIN") {
    throw new Error(
      "Forbidden: Cannot create admin account through public registration",
    );
  }

  // Security: Validate role is either FREELANCER or CLIENT
  if (data.role !== "FREELANCER" && data.role !== "CLIENT") {
    throw new Error("Invalid role: Only FREELANCER and CLIENT are allowed");
  }

  const hashedPassword = await hashPassword(data.password);

  return createUser({
    ...data,
    password: hashedPassword,
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const validPassword = await comparePassword(password, user.password);

  if (!validPassword) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.avatar,
  };
}
