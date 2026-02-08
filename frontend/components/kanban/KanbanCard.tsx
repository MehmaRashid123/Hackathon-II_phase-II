"use client";

import { Task } from "@/lib/types/task";
import { Calendar, AlertCircle, CheckCircle2 } from "lucide-react";

interface KanbanCardProps {
  task: Task;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
}

const PRIORITY_COLORS = {
  LOW: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const PRIORITY_ICONS = {
  LOW: CheckCircle2,
  MEDIUM: AlertCircle,
  HIGH: AlertCircle,
};

export function KanbanCard({ task, onDragStart, onDragEnd }: KanbanCardProps) {
  const PriorityIcon = PRIORITY_ICONS[task.priority as keyof typeof PRIORITY_ICONS] || AlertCircle;

  const handleDragStart = (e: React.DragEvent) => {
    e.currentTarget.classList.add("opacity-50");
    onDragStart(task);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
    onDragEnd();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="group bg-white dark:bg-gray-700 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-200 cursor-move border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
    >
      {/* Task Title */}
      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        {/* Priority Badge */}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
            PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.MEDIUM
          }`}
        >
          <PriorityIcon size={12} />
          <span>{task.priority}</span>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Calendar size={12} />
          <span>{formatDate(task.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
