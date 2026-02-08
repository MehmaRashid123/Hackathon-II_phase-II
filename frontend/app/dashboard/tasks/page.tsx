/**
 * Tasks Page - List view of all tasks.
 *
 * Protected route - requires authentication.
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/api/auth";
import { useTasks } from "@/lib/hooks/useTasks";
import { useToast } from "@/lib/hooks/useToast";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskPriority, TaskStatus } from "@/lib/types/task";
import { PageTransition } from "@/components/ui/PageTransition";
import { AnimatedProgress } from "@/components/ui/AnimatedProgress";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Plus, Grid3x3, List } from "lucide-react";
import Link from "next/link";

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    tasks,
    loading,
    error: tasksError,
    createTask,
    toggleComplete,
    deleteTask,
    updateTask,
  } = useTasks();

  const { toasts, showToast, removeToast } = useToast();

  // Calculate progress with debouncing (derived state)
  const { percentage, completedCount } = useMemo(() => {
    const completedCount = tasks.filter((t) => t.is_completed).length;
    const percentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
    return { percentage, completedCount };
  }, [tasks]);

  // Route protection - redirect if not authenticated
  useEffect(() => {
    const currentUser = auth.getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
  }, [router]);

  // Show toast for task errors
  useEffect(() => {
    if (tasksError) {
      showToast(tasksError, "error");
    }
  }, [tasksError, showToast]);

  // Handle create task
  const handleCreateTask = async (data: { title: string; description?: string; priority?: TaskPriority; status?: TaskStatus }) => {
    try {
      await createTask(data);
      setShowForm(false);
      showToast("Task created successfully!", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to create task", "error");
    }
  };

  // Handle toggle completion
  const handleToggleComplete = async (taskId: string) => {
    try {
      await toggleComplete(taskId);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update task", "error");
    }
  };

  // Handle delete task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(taskId);
      showToast("Task deleted successfully!", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete task", "error");
    }
  };

  // Handle status change
  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTask(taskId, { status: status as any });
      showToast("Task status updated!", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update status", "error");
    }
  };

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Header */}
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <List className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Tasks
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Organize and track your work efficiently
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Stats Cards */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{tasks.length}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 px-4 py-2 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">Done</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">{completedCount}</div>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1.5 shadow-inner">
                  <button
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg text-white font-medium transition-all"
                    title="List View (Active)"
                  >
                    <List size={18} />
                  </button>
                  <Link
                    href="/dashboard/kanban"
                    className="px-4 py-2.5 rounded-lg hover:bg-white/80 dark:hover:bg-gray-600/50 text-gray-600 dark:text-gray-300 transition-all"
                    title="Switch to Kanban View"
                  >
                    <Grid3x3 size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Bar */}
          {tasks.length > 0 && (
            <div className="mb-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress Overview</h3>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {Math.round(percentage)}% Complete
                  </span>
                </div>
                <AnimatedProgress
                  percentage={percentage}
                  total={tasks.length}
                  completed={completedCount}
                />
              </div>
            </div>
          )}

          {/* Create Task Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {tasks.length === 0 ? "No tasks yet" : `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"} in your list`}
                </p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2 font-semibold overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                <span className="relative flex items-center gap-2">
                  {showForm ? (
                    "Cancel"
                  ) : (
                    <>
                      <Plus size={20} strokeWidth={2.5} />
                      New Task
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Task Creation Form */}
            {showForm && (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8 animate-in slide-in-from-top duration-300">
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
            )}
          </div>

          {/* Task List */}
          {loading && tasks.length === 0 ? (
            <div className="grid grid-cols-1 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <List className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No tasks yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Get started by creating your first task. Stay organized and boost your productivity!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                <Plus size={20} />
                Create Your First Task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <TaskList
                tasks={tasks}
                loading={loading}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}
        </main>

        {/* Toast Notifications */}
        <div className="fixed bottom-6 right-6 space-y-3 z-50">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-6 py-4 rounded-xl shadow-2xl text-white flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-right duration-300 ${
                toast.type === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : toast.type === "error"
                  ? "bg-gradient-to-r from-red-500 to-rose-600"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
              }`}
            >
              <span className="font-medium">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/80 hover:text-white transition-colors ml-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
