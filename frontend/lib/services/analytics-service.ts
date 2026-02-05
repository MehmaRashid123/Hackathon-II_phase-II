/**
 * Analytics Service
 *
 * API client for analytics and data aggregation endpoints.
 */

import { apiClient } from "../api/client";

export interface AnalyticsSummary {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  completion_rate: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface PriorityBreakdown {
  priority: string;
  count: number;
  completed: number;
  pending: number;
}

export interface CompletionTrendDataPoint {
  date: string;
  completed: number;
  created: number;
}

export interface AnalyticsResponse {
  workspace_id: string;
  summary: AnalyticsSummary;
  status_distribution: StatusDistribution[];
  priority_breakdown: PriorityBreakdown[];
  completion_trend: CompletionTrendDataPoint[];
  generated_at: string;
}

export interface StatusDistributionResponse {
  workspace_id: string;
  status_distribution: StatusDistribution[];
}

export interface PriorityBreakdownResponse {
  workspace_id: string;
  priority_breakdown: PriorityBreakdown[];
}

export interface CompletionTrendResponse {
  workspace_id: string;
  completion_trend: CompletionTrendDataPoint[];
  start_date: string;
  end_date: string;
}

export class AnalyticsService {
  /**
   * Get comprehensive analytics for a workspace.
   */
  static async getWorkspaceAnalytics(workspaceId: string): Promise<AnalyticsResponse> {
    return apiClient.get<AnalyticsResponse>(
      `/api/workspaces/${workspaceId}/analytics`
    );
  }

  /**
   * Get status distribution data only.
   */
  static async getStatusDistribution(
    workspaceId: string
  ): Promise<StatusDistributionResponse> {
    return apiClient.get<StatusDistributionResponse>(
      `/api/workspaces/${workspaceId}/analytics/status`
    );
  }

  /**
   * Get priority breakdown data only.
   */
  static async getPriorityBreakdown(
    workspaceId: string
  ): Promise<PriorityBreakdownResponse> {
    return apiClient.get<PriorityBreakdownResponse>(
      `/api/workspaces/${workspaceId}/analytics/priority`
    );
  }

  /**
   * Get completion trend data only.
   */
  static async getCompletionTrend(
    workspaceId: string
  ): Promise<CompletionTrendResponse> {
    return apiClient.get<CompletionTrendResponse>(
      `/api/workspaces/${workspaceId}/analytics/completion-trend`
    );
  }
}
