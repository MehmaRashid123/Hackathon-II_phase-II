export type ActivityType =
  | "WORKSPACE_CREATED"
  | "WORKSPACE_UPDATED"
  | "WORKSPACE_DELETED"
  | "MEMBER_ADDED"
  | "MEMBER_REMOVED"
  | "MEMBER_ROLE_CHANGED"
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "PROJECT_DELETED"
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_DELETED"
  | "TASK_STATUS_CHANGED"
  | "TASK_ASSIGNED"
  | "TASK_COMPLETED";

export interface Activity {
  id: string;
  workspace_id: string;
  user_id: string;
  task_id: string | null;
  project_id: string | null;
  activity_type: ActivityType;
  description: string;
  created_at: string;
  user_email?: string;
  task_title?: string;
  project_name?: string;
}

export interface ActivityListResponse {
  activities: Activity[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}
