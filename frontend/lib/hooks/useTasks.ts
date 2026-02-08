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

export function useTasks(workspaceId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoWorkspaceId, setAutoWorkspaceId] = useState<string | null>(null);

  // Auto-fetch workspace ID if not provided
  useEffect(() => {
    if (!workspaceId && typeof window !== 'undefined') {
      // First check localStorage
      const cachedWorkspaceId = localStorage.getItem('current_workspace_id');
      if (cachedWorkspaceId) {
        setAutoWorkspaceId(cachedWorkspaceId);
        return;
      }

      // If not in cache, fetch from API
      const fetchWorkspace = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setLoading(false);
            return;
          }

          const response = await fetch('http://localhost:8000/workspaces', {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (response.ok) {
            const workspaces = await response.json();
            if (workspaces.length > 0) {
              const wsId = workspaces[0].id;
              setAutoWorkspaceId(wsId);
              localStorage.setItem('current_workspace_id', wsId);
            } else {
              setError("No workspace found. Please create a workspace first.");
              setLoading(false);
            }
          } else {
            setError("Failed to load workspace");
            setLoading(false);
          }
        } catch (error) {
          console.error('Failed to fetch workspace:', error);
          setError("Failed to load workspace");
          setLoading(false);
        }
      };

      fetchWorkspace();
    }
  }, [workspaceId]);

  // Use provided workspace ID or auto-fetched one
  const effectiveWorkspaceId = workspaceId || autoWorkspaceId;

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
  const fetchTasks = useCallback(async (wsId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use provided workspace ID, effective workspace ID, or the one from hook parameter
      const targetWorkspaceId = wsId || effectiveWorkspaceId || undefined;
      
      const data = await taskApi.list(targetWorkspaceId);

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
  }, [effectiveWorkspaceId]);

  // Initial fetch - only if workspace ID is available
  useEffect(() => {
    if (effectiveWorkspaceId) {
      fetchTasks(effectiveWorkspaceId);
    } else {
      setLoading(false);
    }
  }, [effectiveWorkspaceId, fetchTasks]);

  // Create task with optimistic update
  const createTask = useCallback(async (data: TaskCreateInput) => {
    try {
      setError(null);

      // Get workspace ID - wait for it to be available
      const wsId = (effectiveWorkspaceId || (typeof window !== 'undefined' ? localStorage.getItem('current_workspace_id') : undefined)) as string | undefined;
      
      if (!wsId) {
        const errorMsg = "No workspace available. Please refresh the page or create a workspace first.";
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      console.log('Creating task with workspace ID:', wsId);

      // Optimistic update - add temporary task
      const tempId = `temp-${Date.now()}`;
      const optimisticTask: Task = {
        id: tempId,
        title: data.title,
        description: data.description || null,
        priority: data.priority || "MEDIUM",
        status: data.status || "TO_DO",
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        workspace_id: wsId,
        created_by: "",
        assigned_to: null,
        completed_at: null,
        project_id: null,
      };

      setTasks((prev) => [optimisticTask, ...prev]);

      // Make API call with workspace ID
      const newTask = await taskApi.create(data, wsId);
      
      console.log('Task created successfully:', newTask);

      // Replace optimistic task with real task
      setTasks((prev) =>
        prev.map((task) => (task.id === tempId ? newTask : task))
      );

      return newTask;
    } catch (err) {
      console.error('Failed to create task:', err);
      // Rollback optimistic update on error
      setTasks((prev) => prev.filter((task) => !task.id.startsWith("temp-")));
      const errorMessage = err instanceof Error ? err.message : "Failed to create task";
      setError(errorMessage);
      throw err;
    }
  }, [effectiveWorkspaceId]);

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
