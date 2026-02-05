/**
 * Better Auth integration helpers.
 *
 * Handles token storage and retrieval.
 */

import { TokenResponse } from "../types/api";

export const auth = {
  /**
   * Save JWT token to localStorage after sign-in.
   */
  saveToken(tokenResponse: TokenResponse): void {
    localStorage.setItem("access_token", tokenResponse.access_token);
    localStorage.setItem("user", JSON.stringify(tokenResponse.user));
  },

  /**
   * Get current token from localStorage.
   */
  getToken(): string | null {
    return localStorage.getItem("access_token");
  },

  /**
   * Get current user from localStorage.
   */
  getUser(): { id: string; email: string; created_at: string } | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Clear token and user from localStorage (logout).
   */
  clearAuth(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  /**
   * Check if user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
