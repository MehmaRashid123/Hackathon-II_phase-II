/**
 * Task API methods.
 *
 * All task CRUD operations with workspace context.
 */

import { apiClient } from "./client";
import { Task, TaskCreateInput, TaskUpdateInput } from "../types/task";

export const taskApi = {
  /**
   * Get all tasks for current workspace.
   *
   * GET /api/workspaces/{workspace_id}/tasks
   */
  async list(workspaceId?: string): Promise<Task[]> {
    if (!workspaceId) {
      // Try to get from localStorage
      if (typeof window !== "undefined") {
        workspaceId = localStorage.getItem("current_workspace_id") || undefined;
      }
    }
    
    if (!workspaceId) {
      // Return empty array if no workspace selected
      console.warn("No workspace selected, returning empty task list");
      return [];
    }

    try {
      return await apiClient.get<Task[]>(`/api/workspaces/${workspaceId}/tasks`);
    } catch (error) {
      // If workspace not found or invalid, return empty array
      console.error("Failed to fetch tasks:", error);
      return [];
    }
  },

  /**
   * Create a new task in workspace.
   *
   * POST /api/{user_id}/tasks (old endpoint for backward compatibility)
   */
  async create(data: TaskCreateInput, workspaceId?: string): Promise<Task> {
    // Get workspace ID
    if (!workspaceId && typeof window !== "undefined") {
      workspaceId = localStorage.getItem("current_workspace_id") || undefined;
    }
    
    if (!workspaceId) {
      throw new Error("No workspace selected. Please select a workspace first.");
    }

    // Use workspace-based endpoint
    return apiClient.post<Task>(`/api/workspaces/${workspaceId}/tasks`, data);
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
