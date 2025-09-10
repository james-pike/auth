// src/routes/plugin@auth.ts
import { QwikAuth$ } from "@auth/qwik";
import Credentials from "@auth/qwik/providers/credentials";

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(() => {
  // Enhanced debug at module load
  console.log("🔍 AUTH MODULE LOADING");
  console.log("🌍 Environment:", process.env.NODE_ENV);
  console.log("🚀 Vercel Environment:", process.env.VERCEL_ENV);
  
  // Log ALL environment variables that might be relevant
  console.log("📋 All ENV keys containing 'ADMIN':", 
    Object.keys(process.env).filter(key => key.includes('ADMIN'))
  );
  console.log("📋 All ENV keys containing 'AUTH':", 
    Object.keys(process.env).filter(key => key.includes('AUTH'))
  );
  
  // Specific checks
  console.log("🔑 ADMIN_USERNAME:", process.env.ADMIN_USERNAME);
  console.log("🔑 ADMIN_USERNAME type:", typeof process.env.ADMIN_USERNAME);
  console.log("🔑 ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD ? '[REDACTED]' : 'undefined');
  console.log("🔑 ADMIN_PASSWORD type:", typeof process.env.ADMIN_PASSWORD);
  console.log("🔒 AUTH_SECRET exists:", !!process.env.AUTH_SECRET);

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
          console.log("📥 Input username:", credentials?.username);
          console.log("📥 Input password exists:", !!credentials?.password);
          console.log("🎯 Expected username:", process.env.ADMIN_USERNAME);
          console.log("🎯 Expected password exists:", !!process.env.ADMIN_PASSWORD);

          if (!credentials?.username || !credentials?.password) {
            console.log("❌ Missing credentials");
            return null;
          }

          const inputUsername = String(credentials.username).trim();
          const inputPassword = String(credentials.password).trim();
          
          console.log("🔍 Trimmed input username:", inputUsername);
          console.log("🔍 Input username length:", inputUsername.length);
          console.log("🔍 Expected username length:", process.env.ADMIN_USERNAME?.length || 0);
          
          // Try hardcoded first to confirm it works
          if (inputUsername === "admin" && inputPassword === "test123") {
            console.log("✅ Hardcoded credentials worked");
            return {
              id: "admin",
              name: "Admin",
              email: "admin@example.com",
            };
          }

          // Then try environment variables with detailed logging
          const envUsername = process.env.ADMIN_USERNAME;
          const envPassword = process.env.ADMIN_PASSWORD;
          
          if (envUsername && envPassword) {
            console.log("🔍 Environment variables exist, checking match...");
            console.log("🔍 Username match:", inputUsername === envUsername);
            console.log("🔍 Password match:", inputPassword === envPassword);
            
            if (inputUsername === envUsername && inputPassword === envPassword) {
              console.log("✅ Environment credentials worked");
              return {
                id: "admin",
                name: "Admin", 
                email: "admin@example.com",
              };
            }
          } else {
            console.log("❌ Environment variables not found");
            console.log("   - envUsername exists:", !!envUsername);
            console.log("   - envPassword exists:", !!envPassword);
          }

          console.log("❌ No credential match - returning null (this will cause CredentialsSignin error)");
          return null;
        },
      }),
    ],
  };
});