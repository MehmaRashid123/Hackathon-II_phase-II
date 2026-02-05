/**
 * useTasks custom hook for task state management.
 *
 * Handles all task CRUD operations with optimistic UI updates.
 * Syncs with Kanban board via localStorage.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { taskApi } from "../api/tasks";
import { Task, TaskCreateInput, TaskUpdateInput } from "../types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to load saved statuses from localStorage
  function loadSavedStatuses(): Record<string, any> {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem('kanban-task-statuses');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  // Helper to update localStorage
  function updateLocalStorageStatus(taskId: string, status: string) {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('kanban-task-statuses');
      const statuses = saved ? JSON.parse(saved) : {};
      statuses[taskId] = status;
      localStorage.setItem('kanban-task-statuses', JSON.stringify(statuses));
    } catch (err) {
      console.error('Failed to save status to localStorage:', err);
    }
  }

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskApi.list();

      // Load saved statuses from localStorage (for Kanban sync)
      const savedStatuses = loadSavedStatuses();

      // Merge with saved statuses
      const tasksWithStatus = data.map(task => ({
        ...task,
        status: savedStatuses[task.id] || task.status || (task.is_completed ? "DONE" : "TO_DO")
      }));

      setTasks(tasksWithStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create task with optimistic update
  const createTask = useCallback(async (data: TaskCreateInput) => {
    try {
      setError(null);

      // Optimistic update - add temporary task
      const tempId = `temp-${Date.now()}`;
      const optimisticTask: Task = {
        id: tempId,
        title: data.title,
        description: data.description || null,
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "", // Will be set by backend
      };

      setTasks((prev) => [optimisticTask, ...prev]);

      // Make API call
      const newTask = await taskApi.create(data);

      // Replace optimistic task with real task
      setTasks((prev) =>
        prev.map((task) => (task.id === tempId ? newTask : task))
      );

      return newTask;
    } catch (err) {
      // Rollback optimistic update on error
      setTasks((prev) => prev.filter((task) => !task.id.startsWith("temp-")));
      setError(err instanceof Error ? err.message : "Failed to create task");
      throw err;
    }
  }, []);

  // Toggle task completion with optimistic update
  const toggleComplete = useCallback(async (taskId: string) => {
    try {
      setError(null);

      // Get current task
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newCompletionStatus = !task.is_completed;
      const newStatus = newCompletionStatus ? "DONE" : "TO_DO";

      // Optimistic update - toggle immediately
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, is_completed: newCompletionStatus, status: newStatus }
            : task
        )
      );

      // Update localStorage for Kanban sync
      updateLocalStorageStatus(taskId, newStatus);

      // Make API call
      const updatedTask = await taskApi.toggleComplete(taskId);

      // Update with server response
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...updatedTask, status: newStatus } : task))
      );

      return updatedTask;
    } catch (err) {
      // Rollback optimistic update on error
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, is_completed: !task.is_completed, status: task.is_completed ? "TO_DO" : "DONE" }
            : task
        )
      );
      setError(err instanceof Error ? err.message : "Failed to update task");
      throw err;
    }
  }, [tasks]);

  // Update task with optimistic update
  const updateTask = useCallback(
    async (taskId: string, data: TaskUpdateInput) => {
      try {
        setError(null);

        // Store original task for rollback
        const originalTask = tasks.find((t) => t.id === taskId);
        if (!originalTask) throw new Error("Task not found");

        // Optimistic update
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, ...data } : task
          )
        );

        // Make API call
        const updatedTask = await taskApi.update(taskId, data);

        // Update with server response
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );

        return updatedTask;
      } catch (err) {
        // Rollback on error
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? tasks.find((t) => t.id === taskId)!
              : task
          )
        );
        setError(err instanceof Error ? err.message : "Failed to update task");
        throw err;
      }
    },
    [tasks]
  );

  // Delete task with optimistic update
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setError(null);

      // Store original tasks for rollback
      const originalTasks = [...tasks];

      // Optimistic update - remove immediately
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      // Make API call
      await taskApi.delete(taskId);
    } catch (err) {
      // Rollback on error
      setTasks(tasks);
      setError(err instanceof Error ? err.message : "Failed to delete task");
      throw err;
    }
  }, [tasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    toggleComplete,
    updateTask,
    deleteTask,
  };
}
