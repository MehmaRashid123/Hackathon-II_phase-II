"use client";

import { ActivityType } from "@/lib/types/activity";
import { Filter } from "lucide-react";

interface ActivityFiltersProps {
  selectedType: ActivityType | "ALL";
  onTypeChange: (type: ActivityType | "ALL") => void;
}

const FILTER_OPTIONS: { value: ActivityType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Activities" },
  { value: "TASK_CREATED", label: "Tasks Created" },
  { value: "TASK_COMPLETED", label: "Tasks Completed" },
  { value: "TASK_STATUS_CHANGED", label: "Status Changes" },
  { value: "TASK_ASSIGNED", label: "Task Assignments" },
  { value: "PROJECT_CREATED", label: "Projects Created" },
  { value: "MEMBER_ADDED", label: "Members Added" },
];

export function ActivityFilters({ selectedType, onTypeChange }: ActivityFiltersProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Filter Activities
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onTypeChange(option.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedType === option.value
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
