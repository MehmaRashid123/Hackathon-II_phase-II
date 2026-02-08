"use client";

import { useEffect, useState } from "react";
import { activityApi } from "@/lib/api/activities";
import { Activity, ActivityType } from "@/lib/types/activity";
import { ActivityItem } from "./ActivityItem";
import { ActivityFilters } from "./ActivityFilters";
import { RefreshCw } from "lucide-react";

interface ActivityFeedProps {
  workspaceId: string;
}

export function ActivityFeed({ workspaceId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<ActivityType | "ALL">("ALL");

  const fetchActivities = async () => {
    try {
      setError(null);
      const data = await activityApi.list(workspaceId, { limit: 50 });
      setActivities(data);
      setFilteredActivities(data);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
      setError(err instanceof Error ? err.message : "Failed to load activities");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (workspaceId) {
      fetchActivities();
    }
  }, [workspaceId]);

  // Filter activities when type changes
  useEffect(() => {
    if (selectedType === "ALL") {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(
        activities.filter((activity) => activity.activity_type === selectedType)
      );
    }
  }, [selectedType, activities]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  const handleTypeChange = (type: ActivityType | "ALL") => {
    setSelectedType(type);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredActivities.length} {filteredActivities.length === 1 ? "activity" : "activities"}
            {selectedType !== "ALL" && " (filtered)"}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* Filters */}
      {activities.length > 0 && (
        <ActivityFilters selectedType={selectedType} onTypeChange={handleTypeChange} />
      )}

      {/* Activity List */}
      {activities.length === 0 ? (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Activity Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Start creating tasks, projects, and collaborating with your team to see activity here.
          </p>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No activities match the selected filter.
          </p>
          <button
            onClick={() => setSelectedType("ALL")}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}
