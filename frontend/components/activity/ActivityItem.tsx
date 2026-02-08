"use client";

import { Activity, ActivityType } from "@/lib/types/activity";
import {
  CheckCircle2,
  XCircle,
  Edit,
  Plus,
  Trash2,
  UserPlus,
  UserMinus,
  Shield,
  FolderPlus,
  FolderEdit,
  FolderX,
  ListPlus,
  ListChecks,
  UserCheck,
  Activity as ActivityIcon,
} from "lucide-react";

interface ActivityItemProps {
  activity: Activity;
}

const ACTIVITY_ICONS: Record<ActivityType, any> = {
  WORKSPACE_CREATED: Plus,
  WORKSPACE_UPDATED: Edit,
  WORKSPACE_DELETED: Trash2,
  MEMBER_ADDED: UserPlus,
  MEMBER_REMOVED: UserMinus,
  MEMBER_ROLE_CHANGED: Shield,
  PROJECT_CREATED: FolderPlus,
  PROJECT_UPDATED: FolderEdit,
  PROJECT_DELETED: FolderX,
  TASK_CREATED: ListPlus,
  TASK_UPDATED: Edit,
  TASK_DELETED: Trash2,
  TASK_STATUS_CHANGED: ListChecks,
  TASK_ASSIGNED: UserCheck,
  TASK_COMPLETED: CheckCircle2,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  WORKSPACE_CREATED: "from-blue-500 to-blue-600",
  WORKSPACE_UPDATED: "from-indigo-500 to-indigo-600",
  WORKSPACE_DELETED: "from-red-500 to-red-600",
  MEMBER_ADDED: "from-green-500 to-green-600",
  MEMBER_REMOVED: "from-orange-500 to-orange-600",
  MEMBER_ROLE_CHANGED: "from-purple-500 to-purple-600",
  PROJECT_CREATED: "from-cyan-500 to-cyan-600",
  PROJECT_UPDATED: "from-teal-500 to-teal-600",
  PROJECT_DELETED: "from-red-500 to-red-600",
  TASK_CREATED: "from-blue-500 to-blue-600",
  TASK_UPDATED: "from-yellow-500 to-yellow-600",
  TASK_DELETED: "from-red-500 to-red-600",
  TASK_STATUS_CHANGED: "from-purple-500 to-purple-600",
  TASK_ASSIGNED: "from-green-500 to-green-600",
  TASK_COMPLETED: "from-emerald-500 to-emerald-600",
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const Icon = ACTIVITY_ICONS[activity.activity_type] || ActivityIcon;
  const colorGradient = ACTIVITY_COLORS[activity.activity_type] || "from-gray-500 to-gray-600";

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${colorGradient} rounded-lg flex items-center justify-center shadow-md`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.description}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                {activity.user_email && (
                  <span className="font-medium">{activity.user_email}</span>
                )}
                {activity.task_title && (
                  <>
                    <span>•</span>
                    <span className="truncate">{activity.task_title}</span>
                  </>
                )}
                {activity.project_name && (
                  <>
                    <span>•</span>
                    <span className="truncate">{activity.project_name}</span>
                  </>
                )}
              </div>
            </div>
            <time className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
              {formatTime(activity.created_at)}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
}
