/**
 * Activity Service
 *
 * API client for activity feed endpoints.
 */

import { apiClient } from "../api/client";

export type ActivityType =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_STATUS_CHANGED"
  | "TASK_COMPLETED"
  | "TASK_DELETED"
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "PROJECT_DELETED"
  | "MEMBER_ADDED"
  | "MEMBER_REMOVED"
  | "MEMBER_ROLE_CHANGED";

export interface Activity {
  id: string;
  workspace_id: string;
  user_id: string;
  activity_type: ActivityType;
  description: string;
  task_id?: string;
  project_id?: string;
  created_at: string;
}

export interface ActivityListResponse {
  activities: Activity[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export class ActivityService {
  /**
   * Get paginated activity feed for a workspace.
   */
  static async getWorkspaceActivities(
    workspaceId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<ActivityListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    return apiClient.get<ActivityListResponse>(
      `/api/workspaces/${workspaceId}/activities?${params}`
    );
  }

  /**
   * Load more activities (convenience method for infinite scroll).
   */
  static async loadMoreActivities(
    workspaceId: string,
    currentPage: number,
    pageSize: number = 50
  ): Promise<ActivityListResponse> {
    return ActivityService.getWorkspaceActivities(
      workspaceId,
      currentPage + 1,
      pageSize
    );
  }
}
