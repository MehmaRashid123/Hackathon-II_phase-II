/**
 * Kanban Service
 *
 * API client for Kanban board operations (task status updates).
 */

import { apiClient } from "../api/client";
import { KanbanTask, TaskStatus } from "../types/kanban";

export class KanbanService {
  /**
   * Update task status (Kanban drag-and-drop).
   *
   * Optimized for < 1 second response time to support optimistic UI updates.
   */
  static async updateTaskStatus(
    workspaceId: string,
    taskId: string,
    newStatus: TaskStatus
  ): Promise<KanbanTask> {
    return apiClient.patch<KanbanTask>(
      `/api/workspaces/${workspaceId}/tasks/${taskId}/status`,
      { status: newStatus }
    );
  }

  /**
   * Get all tasks for workspace (grouped by status for Kanban).
   */
  static async getWorkspaceTasks(workspaceId: string): Promise<KanbanTask[]> {
    return apiClient.get<KanbanTask[]>(`/api/workspaces/${workspaceId}/tasks`);
  }

  /**
   * Group tasks by status for Kanban columns.
   * Handles both workspace tasks (with status) and regular tasks (without status).
   */
  static groupTasksByStatus(tasks: KanbanTask[]): Record<TaskStatus, KanbanTask[]> {
    const grouped: Record<TaskStatus, KanbanTask[]> = {
      TO_DO: [],
      IN_PROGRESS: [],
      REVIEW: [],
      DONE: [],
    };

    tasks.forEach((task) => {
      // Determine status: use task.status if available, otherwise infer from is_completed
      const status = task.status || (task.is_completed ? "DONE" : "TO_DO");

      if (grouped[status]) {
        grouped[status].push(task);
      } else {
        // Fallback to TO_DO if status is invalid
        grouped["TO_DO"].push(task);
      }
    });

    return grouped;
  }
}
