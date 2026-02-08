"use client";

import { Task } from "@/lib/types/task";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  title: string;
  status: string;
  color: string;
  tasks: Task[];
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onDrop: (status: any) => void | Promise<void>;
  isDragging: boolean;
}

export function KanbanColumn({
  title,
  status,
  color,
  tasks,
  onDragStart,
  onDragEnd,
  onDrop,
  isDragging,
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("ring-2", "ring-blue-400", "ring-offset-2");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("ring-2", "ring-blue-400", "ring-offset-2");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("ring-2", "ring-blue-400", "ring-offset-2");
    onDrop(status);
  };

  return (
    <div
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 flex flex-col transition-all duration-200 ${
        isDragging ? "ring-1 ring-gray-300 dark:ring-gray-600" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${color}`}></div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex-1 space-y-3 overflow-y-auto min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No tasks
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
}
