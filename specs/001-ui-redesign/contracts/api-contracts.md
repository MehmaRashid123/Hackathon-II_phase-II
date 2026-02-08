# API Contracts: UI Redesign

**Feature**: UI Redesign
**Date**: 2026-02-07
**Status**: No API Changes Required

---

## Overview

The UI Redesign is a **frontend-only feature**. All existing API contracts remain unchanged.

Dashboard statistics are computed **client-side** from the existing `/api/{user_id}/tasks` endpoint.

---

## Existing API Contracts (Preserved)

### Task Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/{user_id}/tasks` | List all tasks for user | JWT Bearer |
| POST | `/api/{user_id}/tasks` | Create new task | JWT Bearer |
| GET | `/api/{user_id}/tasks/{id}` | Get task details | JWT Bearer |
| PUT | `/api/{user_id}/tasks/{id}` | Update task | JWT Bearer |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task | JWT Bearer |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion | JWT Bearer |

### Response Schemas

**Task Schema**:
```json
{
  "id": "string (uuid)",
  "title": "string",
  "description": "string | null",
  "completed": "boolean",
  "user_id": "string (uuid)",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)"
}
```

**List Tasks Response**:
```json
{
  "tasks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Complete UI redesign",
      "description": "Update all pages with glassmorphism design",
      "completed": false,
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "created_at": "2026-02-07T10:00:00Z",
      "updated_at": "2026-02-07T12:00:00Z"
    }
  ],
  "total": 1
}
```

---

## Client-Side Data Transformation

### Dashboard Stats Calculation

The dashboard stats are computed client-side using the `useStats` hook:

```typescript
// Input: Task[] from GET /api/{user_id}/tasks
const tasks = await fetchTasks();

// Calculated stats
const stats = {
  total: tasks.length,
  completed: tasks.filter(t => t.completed).length,
  pending: tasks.filter(t => !t.completed).length,
  completionRate: Math.round(
    (tasks.filter(t => t.completed).length / tasks.length) * 100
  ) || 0
};
```

### Chart Data Transformation

Task completion data is aggregated client-side for charts:

```typescript
// Transform tasks to chart data points
const chartData = tasks.reduce((acc, task) => {
  const date = task.createdAt.split('T')[0]; // Group by day
  if (!acc[date]) {
    acc[date] = { date, completed: 0, created: 0 };
  }
  acc[date].created++;
  if (task.completed) {
    acc[date].completed++;
  }
  return acc;
}, {});
```

---

## No New Endpoints Required

The UI redesign does not introduce any new API endpoints because:

1. **Stats are computed client-side**: No need for `/api/stats` endpoint
2. **Recent tasks use existing endpoint**: `GET /api/{user_id}/tasks?limit=5&sort=updated_at`
3. **Charts use existing endpoint**: Client-side aggregation of task data
4. **Authentication unchanged**: Better Auth endpoints remain the same

---

## Backend Compatibility

The UI redesign is fully compatible with the existing backend:

- ✅ No database schema changes
- ✅ No API route changes
- ✅ No authentication changes
- ✅ No response format changes
- ✅ Existing middleware preserved

---

## Frontend Data Fetching

### useTasks Hook (Existing)

```typescript
// hooks/useTasks.ts
export const useTasks = (userId: string) => {
  const { data, error, isLoading } = useSWR(
    userId ? `/api/${userId}/tasks` : null,
    fetcher
  );

  return {
    tasks: data?.tasks || [],
    isLoading,
    error
  };
};
```

### useStats Hook (New)

```typescript
// hooks/useStats.ts
export const useStats = (tasks: Task[]) => {
  return useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    completionRate: tasks.length
      ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
      : 0
  }), [tasks]);
};
```

---

## Summary

| Aspect | Status |
|--------|--------|
| New API Endpoints | None required |
| Modified API Endpoints | None |
| Backend Changes | None |
| Client-Side Computation | Stats, Charts |
| Data Source | Existing `/api/{user_id}/tasks` |

**Conclusion**: The UI redesign can be implemented entirely within the frontend codebase without any backend modifications.
