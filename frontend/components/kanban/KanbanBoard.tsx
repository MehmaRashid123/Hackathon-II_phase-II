"use client";

import { useEffect, useState } from "react";
import { useTasks } from "@/lib/hooks/useTasks";
import { Task, TaskPriority } from "@/lib/types/task";
import { KanbanColumn } from "./KanbanColumn";
import { taskApi } from "@/lib/api/tasks";
import { Plus, Grid3x3, List } from "lucide-react";
import { TaskForm } from "@/components/tasks/TaskForm";
import Link from "next/link";

interface KanbanBoardProps {
  workspaceId: string;
}

type TaskStatus = "TO_DO" | "IN_PROGRESS" | "REVIEW" | "DONE";

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: "TO_DO", title: "To Do", color: "from-gray-500 to-gray-600" },
  { id: "IN_PROGRESS", title: "In Progress", color: "from-blue-500 to-blue-600" },
  { id: "REVIEW", title: "Review", color: "from-yellow-500 to-yellow-600" },
  { id: "DONE", title: "Done", color: "from-green-500 to-green-600" },
];

export function KanbanBoard({ workspaceId }: KanbanBoardProps) {
  const { tasks, loading, createTask, fetchTasks } = useTasks(workspaceId);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Sync tasks with local state
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Refresh tasks on mount
  useEffect(() => {
    if (workspaceId) {
      fetchTasks(workspaceId);
    }
  }, [workspaceId, fetchTasks]);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = async (status: TaskStatus) => {
    if (!draggedTask || draggedTask.status === status) {
      setDraggedTask(null);
      return;
    }

    const oldStatus = draggedTask.status;
    const taskId = draggedTask.id;

    // Optimistic update
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );

    try {
      // Update via API
      await taskApi.updateStatus(workspaceId, taskId, status);
    } catch (error) {
      console.error("Failed to update task status:", error);
      // Rollback on error
      setLocalTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: oldStatus } : task
        )
      );
    }

    setDraggedTask(null);
  };

  // Handle create task
  const handleCreateTask = async (data: { title: string; description?: string; priority?: TaskPriority; status?: TaskStatus }) => {
    try {
      await createTask(data);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return localTasks.filter((task) => task.status === status);
  };

  if (loading && localTasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Grid3x3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Kanban Board
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drag and drop tasks to update their status
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Stats */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total</div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{localTasks.length}</div>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1.5 shadow-inner">
                <Link
                  href="/dashboard/tasks"
                  className="px-4 py-2.5 rounded-lg hover:bg-white/80 dark:hover:bg-gray-600/50 text-gray-600 dark:text-gray-300 transition-all"
                  title="Switch to List View"
                >
                  <List size={18} />
                </Link>
                <button
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg text-white font-medium transition-all"
                  title="Kanban View (Active)"
                >
                  <Grid3x3 size={18} />
                </button>
              </div>

              {/* New Task Button */}
              <button
                onClick={() => setShowForm(!showForm)}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2 font-semibold"
              >
                <Plus size={20} strokeWidth={2.5} />
                <span className="hidden sm:inline">New Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Creation Form */}
      {showForm && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Create New Task
              </h3>
            </div>
            <TaskForm
              onSubmit={handleCreateTask}
              submitLabel="Create Task"
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Kanban Columns */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              status={column.id}
              color={column.color}
              tasks={getTasksByStatus(column.id)}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              isDragging={draggedTask !== null}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
