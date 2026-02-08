/**
 * Task API methods.
 *
 * All task CRUD operations with workspace context.
 */

import { apiClient } from "./client";
import { Task, TaskCreateInput, TaskUpdateInput } from "../types/task";

export const taskApi = {
  /**
   * Get all tasks (personal tasks only - workspace disabled).
   *
   * GET /api/{user_id}/tasks
   */
  async list(workspaceId?: string): Promise<Task[]> {
    // Workspace disabled - always use personal tasks
    try {
      const userId = apiClient.getUserId();
      if (!userId) {
        console.warn("No user ID found, returning empty task list");
        return [];
      }
      return await apiClient.get<Task[]>(`/api/${userId}/tasks`);
    } catch (error) {
      console.error("Failed to fetch personal tasks:", error);
      return [];
    }
  },

  /**
   * Create a new task (personal task only - workspace disabled).
   *
   * POST /api/{user_id}/tasks
   */
  async create(data: TaskCreateInput, workspaceId?: string): Promise<Task> {
    // Workspace disabled - always create personal task
    const userId = apiClient.getUserId();
    if (!userId) throw new Error("User not authenticated");
    
    return apiClient.post<Task>(`/api/${userId}/tasks`, data);
  },

  /**
   * Get a single task by ID.
   *
   * GET /api/{user_id}/tasks/{task_id}
   */
  async get(taskId: string): Promise<Task> {
    const userId = apiClient.getUserId();
    if (!userId) throw new Error("User not authenticated");

    return apiClient.get<Task>(`/api/${userId}/tasks/${taskId}`);
  },

  /**
   * Update an existing task.
   *
   * PUT /api/{user_id}/tasks/{task_id}
   */
  async update(taskId: string, data: TaskUpdateInput): Promise<Task> {
    const userId = apiClient.getUserId();
    if (!userId) throw new Error("User not authenticated");

    return apiClient.put<Task>(`/api/${userId}/tasks/${taskId}`, data);
  },

  /**
   * Delete a task.
   *
   * DELETE /api/{user_id}/tasks/{task_id}
   */
  async delete(taskId: string): Promise<void> {
    const userId = apiClient.getUserId();
    if (!userId) throw new Error("User not authenticated");

    return apiClient.delete<void>(`/api/${userId}/tasks/${taskId}`);
  },

  /**
   * Toggle task completion status.
   *
   * PATCH /api/{user_id}/tasks/{task_id}/complete
   */
  async toggleComplete(taskId: string): Promise<Task> {
    const userId = apiClient.getUserId();
    if (!userId) throw new Error("User not authenticated");

    return apiClient.patch<Task>(`/api/${userId}/tasks/${taskId}/complete`);
  },

  /**
   * Update task status (for Kanban board).
   *
   * PATCH /api/workspaces/{workspace_id}/tasks/{task_id}/status
   */
  async updateStatus(workspaceId: string, taskId: string, status: string): Promise<Task> {
    return apiClient.patch<Task>(
      `/api/workspaces/${workspaceId}/tasks/${taskId}/status`,
      { status }
    );
  },
};
