/**
 * Activity API methods.
 */

import { apiClient } from "./client";
import { Activity } from "../types/activity";

export const activityApi = {
  /**
   * Get activities for a workspace.
   *
   * GET /workspaces/{workspace_id}/activities
   */
  async list(
    workspaceId: string,
    options?: {
      offset?: number;
      limit?: number;
      activity_type?: string;
      user_id?: string;
      task_id?: string;
    }
  ): Promise<Activity[]> {
    const params = new URLSearchParams();
    if (options?.offset) params.append("offset", options.offset.toString());
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.activity_type) params.append("activity_type", options.activity_type);
    if (options?.user_id) params.append("user_id", options.user_id);
    if (options?.task_id) params.append("task_id", options.task_id);

    const queryString = params.toString();
    const url = `/workspaces/${workspaceId}/activities${queryString ? `?${queryString}` : ""}`;

    return apiClient.get<Activity[]>(url);
  },
};
