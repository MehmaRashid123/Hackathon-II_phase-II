/**
 * Task API methods.
 *
 * All task CRUD operations with automatic user ID injection.
 */

import { apiClient } from "./client";
import { Task, TaskCreateInput, TaskUpdateInput } from "../types/task";

export const taskApi = {
  /**
   * Get all tasks for current user.
   *
   * GET /api/{user_id}/tasks
   */
  async list(): Promise<Task[]> {
    const userId = apiClient.getUserId();
    if (!userId) throw new Error("User not authenticated");

    return apiClient.get<Task[]>(`/api/${userId}/tasks`);
  },

  /**
   * Create a new task for current user.
   *
   * POST /api/{user_id}/tasks
   */
  async create(data: TaskCreateInput): Promise<Task> {
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
};
