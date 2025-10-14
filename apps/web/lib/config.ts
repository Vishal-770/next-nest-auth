/**
 * Application Configuration
 * Centralized configuration using environment variables
 */

export const config = {
  // API Configuration
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
  },

  // Application Settings
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Auth App",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    env: process.env.NODE_ENV || "development",
  },

  // Session Configuration (Server-side only)
  session: {
    expiryDays: Number(process.env.SESSION_EXPIRY_DAYS) || 7,
    secretKey: process.env.SESSION_SECRET_KEY,
  },

  // Cookie Configuration (Server-side only)
  cookie: {
    secure:
      process.env.COOKIE_SECURE === "true" ||
      process.env.NODE_ENV === "production",
    sameSite:
      (process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none") || "lax",
    httpOnly: process.env.COOKIE_HTTP_ONLY !== "false",
  },

  // Feature Flags
  features: {
    enableSignup: process.env.NEXT_PUBLIC_ENABLE_SIGNUP !== "false",
    enableEmailVerification:
      process.env.NEXT_PUBLIC_ENABLE_EMAIL_VERIFICATION !== "false",
  },

  // UI Configuration
  ui: {
    redirectDelay: Number(process.env.NEXT_PUBLIC_REDIRECT_DELAY) || 1500,
    defaultTheme:
      (process.env.NEXT_PUBLIC_DEFAULT_THEME as "light" | "dark" | "system") ||
      "system",
  },
} as const;

// Type-safe environment variable validation
export function validateEnv() {
  const required = ["SESSION_SECRET_KEY"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Helper to check if running in production
export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";
export const isTest = process.env.NODE_ENV === "test";
