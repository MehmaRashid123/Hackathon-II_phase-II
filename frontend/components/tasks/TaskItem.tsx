/**
 * TaskItem component - Individual task display with animations.
 *
 * Shows task with animated checkbox, status colors, and hover effects.
 * Different colors for: Complete (Green), In Progress (Blue), Pending (Gray)
 */

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Task, TaskStatus } from "@/lib/types/task";
import { CheckCircle2, Circle, Clock, Eye, CheckCheck, Edit3, Trash2, ChevronDown } from "lucide-react";
import { staggerItemVariants, checkboxVariants } from "@/lib/animations/variants";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: "TO_DO", label: "To Do", color: "text-gray-600" },
  { value: "IN_PROGRESS", label: "In Progress", color: "text-blue-600" },
  { value: "REVIEW", label: "Review", color: "text-purple-600" },
  { value: "DONE", label: "Done", color: "text-green-600" },
];

export function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskItemProps) {
  const reducedMotion = useReducedMotion();
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const itemVariants = reducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 }, exit: { opacity: 1 } }
    : staggerItemVariants;

  const checkVariants = reducedMotion
    ? { unchecked: {}, checked: {} }
    : checkboxVariants;

  // Status configuration with colors and icons
  const getStatusConfig = () => {
    const status = task.status || (task.is_completed ? "DONE" : "TO_DO");

    if (status === "DONE" || task.is_completed) {
      return {
        bgColor: "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600",
        textColor: "text-green-900 dark:text-green-200",
        badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        icon: CheckCheck,
        iconColor: "text-green-500",
        label: "Completed",
        stripeColor: "bg-gradient-to-r from-green-400 to-green-600"
      };
    }

    switch (status) {
      case "IN_PROGRESS":
        return {
          bgColor: "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600",
          textColor: "text-blue-900 dark:text-blue-200",
          badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
          icon: Clock,
          iconColor: "text-blue-500",
          label: "In Progress",
          stripeColor: "bg-gradient-to-r from-blue-400 to-blue-600"
        };
      case "REVIEW":
        return {
          bgColor: "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600",
          textColor: "text-purple-900 dark:text-purple-200",
          badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
          icon: Eye,
          iconColor: "text-purple-500",
          label: "Review",
          stripeColor: "bg-gradient-to-r from-purple-400 to-purple-600"
        };
      case "TO_DO":
      default:
        return {
          bgColor: "bg-gray-50 dark:bg-gray-800/60 border-gray-300 dark:border-gray-600",
          textColor: "text-gray-700 dark:text-gray-300",
          badgeColor: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
          icon: Circle,
          iconColor: "text-gray-400",
          label: "To Do",
          stripeColor: "bg-gradient-to-r from-gray-400 to-gray-500"
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
    setShowStatusMenu(false);
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden
        flex items-start gap-4 p-6
        bg-white/90 dark:bg-gray-800/90
        backdrop-blur-xl
        border-2 border-gray-200/50 dark:border-gray-700/50
        rounded-2xl
        shadow-lg hover:shadow-2xl
        transition-all duration-300
        group
      `}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={reducedMotion ? {} : { scale: 1.01, y: -4 }}
      layout
    >
      {/* Gradient Status Stripe */}
      <div className={`absolute top-0 left-0 w-full h-2 ${config.stripeColor} shadow-lg`} />
      
      {/* Decorative Corner Accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${config.stripeColor} opacity-10 rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-500`} />

      {/* Status Icon & Checkbox */}
      <div className="flex flex-col items-center gap-3 pt-1 z-10">
        <div className={`${config.iconColor} bg-white dark:bg-gray-700 p-3 rounded-xl shadow-md group-hover:shadow-lg transition-shadow`}>
          <StatusIcon size={24} strokeWidth={2.5} />
        </div>

        <motion.button
          onClick={() => onToggleComplete(task.id)}
          className="flex-shrink-0 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/50 rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          variants={checkVariants}
          animate={task.is_completed ? "checked" : "unchecked"}
          whileTap={reducedMotion ? {} : { scale: 0.9 }}
          title={task.is_completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.is_completed ? (
            <CheckCircle2 className="h-7 w-7 text-green-600 fill-green-100 drop-shadow-md" />
          ) : (
            <Circle className="h-7 w-7 text-gray-400 hover:text-gray-600 transition-colors" />
          )}
        </motion.button>
      </div>

      {/* Task Content */}
      <div className="flex-1 min-w-0 space-y-3 z-10">
        {/* Title with completion checkmark */}
        <div className="flex items-start gap-3">
          <h3
            className={`flex-1 text-xl font-bold ${config.textColor} ${
              task.is_completed ? "line-through opacity-60" : ""
            } transition-all`}
          >
            {task.title}
          </h3>

          {task.is_completed && (
            <CheckCircle2
              className="flex-shrink-0 text-green-500 animate-in zoom-in duration-300 drop-shadow-md"
              size={24}
              fill="currentColor"
            />
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p
            className={`text-sm leading-relaxed ${
              task.is_completed
                ? "text-gray-500 dark:text-gray-500 line-through opacity-50"
                : "text-gray-600 dark:text-gray-400"
            } transition-all`}
          >
            {task.description}
          </p>
        )}

        {/* Footer: Status badge, priority & date */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${config.badgeColor} shadow-sm hover:shadow-md transition-all`}
              >
                {config.label}
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Status Dropdown Menu */}
              {showStatusMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowStatusMenu(false)}
                  ></div>
                  <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-20">
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={`w-full text-left px-4 py-2 text-sm font-medium ${option.color} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          task.status === option.value ? "bg-gray-100 dark:bg-gray-700" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {task.priority && (
              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                task.priority === 'HIGH' || task.priority === 'URGENT'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : task.priority === 'MEDIUM'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {task.priority}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">
              {new Date(task.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-1 z-10">
        {onEdit && (
          <motion.button
            onClick={() => onEdit(task)}
            className="p-3 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all shadow-sm hover:shadow-md"
            whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
            title="Edit task"
          >
            <Edit3 size={18} strokeWidth={2.5} />
          </motion.button>
        )}
        <motion.button
          onClick={() => onDelete(task.id)}
          className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all shadow-sm hover:shadow-md"
          whileHover={reducedMotion ? {} : { scale: 1.1, rotate: -5 }}
          whileTap={reducedMotion ? {} : { scale: 0.95 }}
          title="Delete task"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
}
