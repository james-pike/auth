// src/routes/plugin@auth.ts
import { QwikAuth$ } from "@auth/qwik";
import Credentials from "@auth/qwik/providers/credentials";
import { z } from "zod";

// Define validation schema
const credentialsSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(() => ({
  secret: process.env.AUTH_SECRET!, // required
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials using Zod
          const validatedCredentials = credentialsSchema.parse(credentials);

          // Compare against env vars
          const adminUser = process.env.ADMIN_USERNAME;
          const adminPass = process.env.ADMIN_PASSWORD;

          if (
            validatedCredentials.username === adminUser &&
            validatedCredentials.password === adminPass
          ) {
            return {
              id: "admin",
              name: "Admin",
              email: "admin@example.com",
            };
          }

          return null; // invalid login
        } catch (error) {
          // Validation failed
          console.error("Credential validation failed:", error);
          return null;
        }
      },
    }),
  ],
}));