import { hashPassword, comparePassword } from "../utils/passwords";
import { createUser, findUserByEmail } from "../repositories/user.repository";

type UserRole = "FREELANCER" | "CLIENT" | "ADMIN";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  console.log(`[AUTH_SERVICE] Registration process started for email: ${data.email}`);

  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    console.warn(`[AUTH_SERVICE] Registration failed: Email ${data.email} already exists`);
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

  console.log(`[AUTH_SERVICE] Hashing user password...`);
  const hashedPassword = await hashPassword(data.password);
  console.log(`[AUTH_SERVICE] Password hashed successfully.`);

  console.log(`[AUTH_SERVICE] Creating user in database...`);
  const user = await createUser({
    ...data,
    password: hashedPassword,
    isVerified: true,
  });
  console.log(`[AUTH_SERVICE] User created successfully with isVerified=true, ID: ${user.id}`);

  return user;
}

export async function authenticateUser(
  email: string,
  password?: string,
) {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  if (user.isDisabled) {
    throw new Error("This account has been disabled.");
  }

  if (!password) {
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

