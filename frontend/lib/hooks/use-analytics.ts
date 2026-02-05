/**
 * useAnalytics Hook
 *
 * Fetches and manages analytics data for the current workspace.
 */

"use client";

import { useState, useEffect } from "react";
import {
  AnalyticsService,
  AnalyticsResponse,
} from "../services/analytics-service";

interface UseAnalyticsResult {
  analytics: AnalyticsResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAnalytics(workspaceId: string | null): UseAnalyticsResult {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAnalytics() {
    if (!workspaceId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsService.getWorkspaceAnalytics(workspaceId);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  // Load analytics when workspace changes
  useEffect(() => {
    loadAnalytics();
  }, [workspaceId]);

  async function refresh() {
    await loadAnalytics();
  }

  return {
    analytics,
    loading,
    error,
    refresh,
  };
}
