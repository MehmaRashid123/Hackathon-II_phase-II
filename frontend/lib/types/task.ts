/**
 * Task entity type definitions.
 *
 * Matches backend Task model with status field for Kanban board.
 */

export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  status?: TaskStatus; // Optional for backward compatibility
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
  user_id: string;
  workspace_id?: string; // Optional for workspace-scoped tasks
}

export interface TaskCreateInput {
  title: string;
  description?: string;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
}
