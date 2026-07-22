import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { LoginSchema } from "@/lib/validations/auth";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const validated = LoginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;

        // Secure server-side validation & database lookup
        const { authenticateUser } = await import(
          "@/lib/services/auth.service"
        );
        return authenticateUser(email, password);
      },
    }),
  ],
});
