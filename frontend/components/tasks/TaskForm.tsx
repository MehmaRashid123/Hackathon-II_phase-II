"use client";

import { useState, FormEvent } from "react";
import { Task, TaskCreateInput, TaskPriority, TaskStatus } from "@/lib/types/task";
import { Calendar, Flag, ListChecks, AlignLeft, Type } from "lucide-react";

interface TaskFormProps {
  onSubmit: (data: TaskCreateInput) => Promise<void>;
  initialData?: Task;
  submitLabel?: string;
  onCancel?: () => void;
}

export function TaskForm({
  onSubmit,
  initialData,
  submitLabel = "Add Task",
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initialData?.priority || "MEDIUM"
  );
  const [status, setStatus] = useState<TaskStatus>(
    initialData?.status || "TO_DO"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (title.length > 500) {
      setError("Title must be less than 500 characters");
      return;
    }

    if (description.length > 5000) {
      setError("Description must be less than 5000 characters");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
      });

      // Clear form on success (only for create mode)
      if (!initialData) {
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setStatus("TO_DO");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: "LOW", label: "Low", color: "text-gray-600", bgColor: "bg-gray-100 hover:bg-gray-200", icon: "🔵" },
    { value: "MEDIUM", label: "Medium", color: "text-yellow-600", bgColor: "bg-yellow-100 hover:bg-yellow-200", icon: "🟡" },
    { value: "HIGH", label: "High", color: "text-orange-600", bgColor: "bg-orange-100 hover:bg-orange-200", icon: "🟠" },
    { value: "URGENT", label: "Urgent", color: "text-red-600", bgColor: "bg-red-100 hover:bg-red-200", icon: "🔴" },
  ];

  const statusOptions = [
    { value: "TO_DO", label: "To Do", color: "text-gray-600", bgColor: "bg-gray-100 hover:bg-gray-200", icon: "📋" },
    { value: "IN_PROGRESS", label: "In Progress", color: "text-blue-600", bgColor: "bg-blue-100 hover:bg-blue-200", icon: "⚡" },
    { value: "REVIEW", label: "Review", color: "text-purple-600", bgColor: "bg-purple-100 hover:bg-purple-200", icon: "👀" },
    { value: "DONE", label: "Done", color: "text-green-600", bgColor: "bg-green-100 hover:bg-green-200", icon: "✅" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div>
        <label
          htmlFor="title"
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Type className="w-4 h-4 text-white" />
          </div>
          Task Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a clear and concise task title"
            maxLength={500}
            className="w-full px-4 py-3.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-base"
            required
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
            {title.length}/500
          </div>
        </div>
      </div>

      {/* Priority and Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Flag className="w-4 h-4 text-white" />
            </div>
            Priority
          </label>
          <div className="grid grid-cols-2 gap-2">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPriority(option.value as TaskPriority)}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                  priority === option.value
                    ? `${option.bgColor} border-current ${option.color} shadow-md scale-105`
                    : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <ListChecks className="w-4 h-4 text-white" />
            </div>
            Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value as TaskStatus)}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                  status === option.value
                    ? `${option.bgColor} border-current ${option.color} shadow-md scale-105`
                    : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Description Input */}
      <div>
        <label
          htmlFor="description"
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <AlignLeft className="w-4 h-4 text-white" />
          </div>
          Description <span className="text-gray-400 text-xs font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about this task..."
            maxLength={5000}
            rows={4}
            className="w-full px-4 py-3.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none shadow-sm text-base"
          />
          <div className="absolute right-3 bottom-3 text-xs font-medium text-gray-400">
            {description.length}/5000
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-sm text-base"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
