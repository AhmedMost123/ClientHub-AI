import { hashPassword, comparePassword } from "../utils/passwords";
import { createUser, findUserByEmail } from "../repositories/user.repository";
import { createVerification } from "./verification.service";
import { verifyOneTimeAuthToken } from "@/lib/security/auth-token";

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

  if (data.role === "ADMIN") {
    throw new Error(
      "Forbidden: Cannot create admin account through public registration",
    );
  }

  if (data.role !== "FREELANCER" && data.role !== "CLIENT") {
    throw new Error("Invalid role");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await createUser({
    ...data,
    password: hashedPassword,
  });

  await createVerification({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  return user;
}

export async function authenticateUser(
  email: string,
  password?: string,
  verificationToken?: string,
) {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  if (user.isDisabled) {
    throw new Error("This account has been disabled.");
  }

  if (verificationToken) {
    const isValidToken = verifyOneTimeAuthToken(
      user.id,
      user.email,
      verificationToken,
    );

    if (!isValidToken) {
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

  if (!password) {
    return null;
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email before signing in.");
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
