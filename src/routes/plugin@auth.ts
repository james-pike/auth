// src/routes/plugin@auth.ts
import { QwikAuth$ } from "@auth/qwik";
import Credentials from "@auth/qwik/providers/credentials";

// Try to access environment variables in different ways
const getEnvVar = (name: string) => {
  // Try multiple access patterns
  return process.env[name] || 
         (globalThis as any).process?.env?.[name] ||
         (typeof window !== 'undefined' ? null : process.env[name]);
};

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(() => {
  console.log("🔍 AUTH MODULE LOADING");
  console.log("Runtime environment:", typeof process, typeof globalThis);
  
  // Try different ways to access env vars
  const adminUsername = getEnvVar('VERCEL_ADMIN_USERNAME');
  const adminPassword = getEnvVar('VERCEL_ADMIN_PASSWORD'); 
  const authSecret = getEnvVar('AUTH_SECRET');
  
  console.log("Environment variable check:");
  console.log("- VERCEL_ADMIN_USERNAME:", adminUsername);
  console.log("- VERCEL_ADMIN_PASSWORD exists:", !!adminPassword);
  console.log("- AUTH_SECRET exists:", !!authSecret);
  console.log("- process.env keys count:", Object.keys(process.env || {}).length);

  // For debugging: log some known Vercel environment variables
  console.log("Known Vercel vars:");
  console.log("- VERCEL:", process.env.VERCEL);
  console.log("- VERCEL_ENV:", process.env.VERCEL_ENV);
  console.log("- VERCEL_URL:", process.env.VERCEL_URL);

  return {
    secret: authSecret || "temporary-fallback-secret", 
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

          if (!credentials?.username || !credentials?.password) {
            console.log("❌ Missing credentials");
            return null;
          }

          const inputUsername = String(credentials.username).trim();
          const inputPassword = String(credentials.password).trim();
          
          console.log("Input:", { username: inputUsername, passwordLength: inputPassword.length });
          
          // Try hardcoded credentials (working)
          if (inputUsername === "admin" && inputPassword === "test123") {
            console.log("✅ Hardcoded credentials worked");
            return {
              id: "admin",
              name: "Admin",
              email: "admin@example.com",
            };
          }

          // Try environment credentials
          if (adminUsername && adminPassword) {
            console.log("Environment credentials available, testing...");
            if (inputUsername === adminUsername && inputPassword === adminPassword) {
              console.log("✅ Environment credentials worked");
              return {
                id: "admin", 
                name: "Admin",
                email: "admin@example.com",
              };
            }
          } else {
            console.log("❌ Environment credentials not available");
          }

          console.log("❌ No match found");
          return null;
        },
      }),
    ],
  };
});