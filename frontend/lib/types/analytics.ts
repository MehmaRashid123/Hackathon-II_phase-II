// frontend/lib/types/analytics.ts
import { TaskStatus, TaskPriority } from './task';

export interface StatusDistributionItem {
  status: TaskStatus;
  count: number;
}

export interface PriorityBreakdownItem {
  priority: TaskPriority;
  count: number;
}

export interface CompletionTrendItem {
  date: string; // YYYY-MM-DD format
  tasks_created: number;
  tasks_completed: number;
}

export interface WorkspaceAnalytics {
  status_distribution: StatusDistributionItem[];
  priority_breakdown: PriorityBreakdownItem[];
  completion_trend: CompletionTrendItem[];
}
