# Activity Feed Components

Real-time activity tracking and audit trail for workspace actions.

## Components

### ActivityFeed
Main component that displays the activity feed with filtering and refresh capabilities.

**Props:**
- `workspaceId`: Workspace ID to fetch activities for

**Features:**
- Real-time activity updates
- Filter by activity type
- Refresh button
- Empty state handling
- Error handling with retry

### ActivityItem
Individual activity card with icon, description, and timestamp.

**Props:**
- `activity`: Activity object

**Features:**
- Color-coded icons by activity type
- Relative timestamps (e.g., "2h ago", "Just now")
- User email display
- Task/Project name display
- Hover effects

### ActivityFilters
Filter buttons for activity types.

**Props:**
- `selectedType`: Currently selected filter
- `onTypeChange`: Callback when filter changes

**Filter Options:**
- All Activities
- Tasks Created
- Tasks Completed
- Status Changes
- Task Assignments
- Projects Created
- Members Added

## Activity Types

The system tracks 16 different activity types:

**Workspace Activities:**
- `WORKSPACE_CREATED` - New workspace created
- `WORKSPACE_UPDATED` - Workspace settings changed
- `WORKSPACE_DELETED` - Workspace removed

**Member Activities:**
- `MEMBER_ADDED` - New member joined
- `MEMBER_REMOVED` - Member left/removed
- `MEMBER_ROLE_CHANGED` - Member role updated

**Project Activities:**
- `PROJECT_CREATED` - New project created
- `PROJECT_UPDATED` - Project details changed
- `PROJECT_DELETED` - Project removed

**Task Activities:**
- `TASK_CREATED` - New task created
- `TASK_UPDATED` - Task details changed
- `TASK_DELETED` - Task removed
- `TASK_STATUS_CHANGED` - Task moved between columns
- `TASK_ASSIGNED` - Task assigned to member
- `TASK_COMPLETED` - Task marked as done

## API Integration

Uses the `/workspaces/{workspace_id}/activities` endpoint with:
- Pagination support (limit: 50)
- Filtering by activity type
- Filtering by user
- Filtering by task

## Usage Example

```tsx
import { ActivityFeed } from "@/components/activity/ActivityFeed";

<ActivityFeed workspaceId="workspace-uuid" />
```

## Styling

- Glassmorphism design with backdrop blur
- Gradient backgrounds
- Color-coded activity types
- Smooth animations
- Responsive layout
- Dark mode support
