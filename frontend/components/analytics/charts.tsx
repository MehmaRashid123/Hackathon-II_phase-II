"use client";

interface ChartProps {
  workspaceId: string;
}

export function StatusDistributionChart({ workspaceId }: ChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
      <p className="text-sm text-gray-500">Chart coming soon...</p>
    </div>
  );
}

export function PriorityBarChart({ workspaceId }: ChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
      <p className="text-sm text-gray-500">Chart coming soon...</p>
    </div>
  );
}

export function CompletionTrendChart({ workspaceId }: ChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">Completion Trend</h3>
      <p className="text-sm text-gray-500">Chart coming soon...</p>
    </div>
  );
}
