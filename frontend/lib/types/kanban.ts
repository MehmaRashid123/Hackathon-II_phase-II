/**
 * Kanban Board Types
 *
 * Type definitions for Kanban board components and data structures.
 */

export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export interface KanbanTask {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  workspace_id?: string;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: KanbanTask[];
  color: string;
}

export const KANBAN_COLUMNS: Omit<KanbanColumn, "tasks">[] = [
  {
    id: "TO_DO",
    title: "To Do",
    color: "bg-gray-500",
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    color: "bg-blue-500",
  },
  {
    id: "REVIEW",
    title: "Review",
    color: "bg-purple-500",
  },
  {
    id: "DONE",
    title: "Done",
    color: "bg-green-500",
  },
];
