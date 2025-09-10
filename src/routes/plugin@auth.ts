// src/routes/plugin@auth.ts
import { QwikAuth$ } from "@auth/qwik";
import Credentials from "@auth/qwik/providers/credentials";

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(() => {
  // Simple debug at module load
  console.log("🔍 AUTH MODULE LOADING");
  console.log("ADMIN_USERNAME:", process.env.ADMIN_USERNAME);
  console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD);
  console.log("AUTH_SECRET exists:", !!process.env.AUTH_SECRET);

  return {
    secret: process.env.AUTH_SECRET || "fallback-secret", 
    trustHost: true,
    providers: [
      Credentials({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          console.log("🔍 AUTHORIZE called");
          console.log("Input username:", credentials?.username);
          console.log("Input password:", credentials?.password);
          console.log("Expected username:", process.env.ADMIN_USERNAME);
          console.log("Expected password:", process.env.ADMIN_PASSWORD);

          if (!credentials?.username || !credentials?.password) {
            console.log("❌ Missing credentials");
            return null;
          }

          const inputUsername = String(credentials.username).trim();
          const inputPassword = String(credentials.password).trim();
          
          // Try hardcoded first to confirm it works
          if (inputUsername === "admin" && inputPassword === "test123") {
            console.log("✅ Hardcoded credentials worked");
            return {
              id: "admin",
              name: "Admin",
              email: "admin@example.com",
            };
          }

          // Then try environment variables
          if (inputUsername === process.env.ADMIN_USERNAME && inputPassword === process.env.ADMIN_PASSWORD) {
            console.log("✅ Environment credentials worked");
            return {
              id: "admin",
              name: "Admin",
              email: "admin@example.com",
            };
          }

          console.log("❌ No match");
          return null;
        },
      }),
    ],
  };
});