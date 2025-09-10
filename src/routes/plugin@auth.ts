// src/routes/plugin@auth.ts
import { QwikAuth$ } from "@auth/qwik";
import Credentials from "@auth/qwik/providers/credentials";

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(() => ({
  secret: process.env.AUTH_SECRET!, 
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔍 Authorization attempt started");
        
        if (!credentials?.username || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        const inputUsername = String(credentials.username).trim();
        const inputPassword = String(credentials.password).trim();
        
        const expectedUsername = process.env.ADMIN_USERNAME?.trim();
        const expectedPassword = process.env.ADMIN_PASSWORD?.trim();

        // Debug logging
        console.log("Environment check:", {
          hasExpectedUsername: !!expectedUsername,
          hasExpectedPassword: !!expectedPassword,
          expectedUsernameLength: expectedUsername?.length || 0,
          expectedPasswordLength: expectedPassword?.length || 0,
          inputUsernameLength: inputUsername.length,
          inputPasswordLength: inputPassword.length,
          // Temporarily log values for debugging - REMOVE after it works
          inputUsername,
          expectedUsername,
          usernameMatch: inputUsername === expectedUsername,
          passwordMatch: inputPassword === expectedPassword,
        });

        if (!expectedUsername || !expectedPassword) {
          console.error("❌ Environment variables not loaded properly");
          return null;
        }

        if (inputUsername === expectedUsername && inputPassword === expectedPassword) {
          console.log("✅ Authentication successful with environment variables");
          return {
            id: "admin",
            name: "Admin",
            email: "admin@example.com",
          };
        }

        console.log("❌ Credentials don't match environment variables");
        return null;
      },
    }),
  ],
}));