# Analytics Components

This folder contains analytics-related components for the dashboard.

## Components

### StatsCard
Reusable card component for displaying statistics with icons and gradients.

**Props:**
- `title`: Card title
- `value`: Main value to display (number or string)
- `description`: Description text below the value
- `icon`: Lucide icon component
- `gradient`: Tailwind gradient classes (e.g., "from-blue-500 to-blue-600")

**Usage:**
```tsx
import { StatsCard } from "@/components/analytics/StatsCard";
import { Target } from "lucide-react";

<StatsCard
  title="Total"
  value={42}
  description="All tasks"
  icon={Target}
  gradient="from-blue-500 to-blue-600"
/>
```

## Analytics Page Features

The analytics page (`/dashboard/analytics`) provides:

1. **Overview Stats Cards**
   - Total tasks count
   - Completed tasks with completion rate
   - In-progress tasks
   - High priority tasks count

2. **Status Distribution Chart**
   - Pie chart showing task distribution across statuses
   - To Do, In Progress, Review, Done

3. **Priority Distribution Chart**
   - Bar chart showing tasks by priority level
   - Low, Medium, High, Urgent

4. **Completion Trend Chart**
   - Line chart showing completed tasks over last 7 days
   - Helps track productivity trends

## Data Source

All analytics data is calculated in real-time from the tasks fetched via `useTasks` hook.
No separate API calls are needed - everything is computed client-side for instant updates.

## Charts Library

Uses **Recharts** for all visualizations:
- Responsive charts that adapt to screen size
- Interactive tooltips
- Customizable colors and styling
- Smooth animations
