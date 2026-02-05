/**
 * Better Auth Configuration
 *
 * This module configures Better Auth for JWT-based authentication
 * with the FastAPI backend.
 */

import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // Database configuration (Better Auth can store sessions)
  // For now, we're using JWT-only (stateless)

  // Email/Password provider
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false, // Set to true in production
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24, // 24 hours (matches backend JWT expiration)
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },

  // JWT configuration (must match backend BETTER_AUTH_SECRET)
  secret: process.env.BETTER_AUTH_SECRET || "temporary-development-secret-replace-with-secure-32-char-minimum",

  // Base URL configuration
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",

  // Advanced options
  advanced: {
    // Use cookies for session storage
    // cookieName: "better-auth.session_token",
    // cookieOptions: {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   path: "/",
    // },
  },
});

/**
 * Auth client for use in client components
 */
export const authClient = auth;

/**
 * Helper function to get current user from session
 */
export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession();
    return session?.user || null;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

/**
 * Helper function to sign out
 */
export async function signOut() {
  try {
    await auth.api.signOut();
    window.location.href = "/login";
  } catch (error) {
    console.error("Failed to sign out:", error);
  }
}
