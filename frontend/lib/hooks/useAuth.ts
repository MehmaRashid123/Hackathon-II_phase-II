/**
 * useAuth custom hook for authentication state.
 */

"use client";

import { useState, useEffect } from "react";
import { auth } from "../api/auth";

export function useAuth() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const logout = () => {
    auth.clearAuth();
    setUser(null);
    window.location.href = "/login";
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  };
}
