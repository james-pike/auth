// src/routes/plugin@auth.ts
import { QwikAuth$ } from "@auth/qwik";
import Credentials from "@auth/qwik/providers/credentials";

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(() => ({
  secret: process.env.AUTH_SECRET || "fallback-secret-for-testing-only-change-me", 
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const inputUsername = String(credentials.username).trim();
        const inputPassword = String(credentials.password).trim();
        
        // TEMPORARY: Test with hardcoded values first
        // Remove this after confirming it works
        if (inputUsername === "admin" && inputPassword === "test123") {
          console.log("✅ Hardcoded test credentials worked");
          return {
            id: "admin",
            name: "Admin",
            email: "admin@example.com",
          };
        }

        // Then try environment variables
        const expectedUsername = process.env.ADMIN_USERNAME?.trim();
        const expectedPassword = process.env.ADMIN_PASSWORD?.trim();

        if (expectedUsername && expectedPassword && 
            inputUsername === expectedUsername && inputPassword === expectedPassword) {
          console.log("✅ Environment credentials worked");
          return {
            id: "admin",
            name: "Admin", 
            email: "admin@example.com",
          };
        }

        console.log("❌ No credentials matched");
        return null;
      },
    }),
  ],
}));