# Data Model: UI Redesign Component Props

**Feature**: UI Redesign
**Date**: 2026-02-07
**Scope**: Frontend component props and TypeScript interfaces

---

## UI Component Props

### GlassCardProps

Reusable glassmorphism container component.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | Yes | - | Content to render inside card |
| `blur` | `'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Backdrop blur intensity |
| `opacity` | `'low' \| 'medium' \| 'high'` | No | `'medium'` | Background opacity level |
| `border` | `boolean` | No | `true` | Show glass border |
| `borderColor` | `string` | No | `'white/20'` | Border color (Tailwind format) |
| `padding` | `'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Internal padding |
| `radius` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | No | `'lg'` | Border radius |
| `className` | `string` | No | - | Additional CSS classes |
| `as` | `keyof JSX.IntrinsicElements` | No | `'div'` | HTML element to render |

**Example**:
```tsx
<GlassCard blur="lg" opacity="high" padding="xl" radius="xl">
  <h2>Card Title</h2>
  <p>Card content</p>
</GlassCard>
```

---

### GradientButtonProps

Gradient-styled button with variants and loading states.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | Yes | - | Button content |
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | No | `'primary'` | Color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Button size |
| `loading` | `boolean` | No | `false` | Show loading spinner |
| `disabled` | `boolean` | No | `false` | Disable interaction |
| `fullWidth` | `boolean` | No | `false` | Expand to full width |
| `onClick` | `(e: React.MouseEvent) => void` | No | - | Click handler |
| `type` | `'button' \| 'submit' \| 'reset'` | No | `'button'` | HTML button type |
| `className` | `string` | No | - | Additional CSS classes |
| `ariaLabel` | `string` | No | - | Accessibility label |

**Example**:
```tsx
<GradientButton variant="primary" size="lg" loading={isSubmitting}>
  Sign In
</GradientButton>
```

---

### AnimatedBackgroundProps

Animated gradient background with optional particle effects.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `colors` | `string[]` | No | `['#8B5CF6', '#3B82F6', '#EC4899']` | Gradient colors |
| `speed` | `'slow' \| 'normal' \| 'fast'` | No | `'normal'` | Animation speed |
| `particles` | `boolean` | No | `false` | Enable particle effects |
| `particleCount` | `number` | No | `50` | Number of particles (if enabled) |
| `className` | `string` | No | - | Additional CSS classes |

**Example**:
```tsx
<AnimatedBackground colors={['#F97316', '#F59E0B']} speed="slow" />
```

---

### FloatingLabelProps

Animated floating label for form inputs.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | Label text |
| `inputId` | `string` | Yes | - | ID of associated input |
| `focused` | `boolean` | No | `false` | Input focus state |
| `hasValue` | `boolean` | No | `false` | Input has value |
| `error` | `boolean` | No | `false` | Input has error |
| `disabled` | `boolean` | No | `false` | Input is disabled |

**Example**:
```tsx
<FloatingLabel
  label="Email Address"
  inputId="email"
  focused={isFocused}
  hasValue={!!value}
  error={!!error}
/>
```

---

### ProgressRingProps

Circular SVG progress indicator.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `percentage` | `number` | Yes | - | Completion percentage (0-100) |
| `size` | `number` | No | `120` | Diameter in pixels |
| `strokeWidth` | `number` | No | `8` | Ring thickness |
| `color` | `string` | No | `'#8B5CF6'` | Progress color |
| `trackColor` | `string` | No | `'rgba(255,255,255,0.2)'` | Background ring color |
| `showPercentage` | `boolean` | No | `true` | Display percentage text |
| `className` | `string` | No | - | Additional CSS classes |

**Example**:
```tsx
<ProgressRing
  percentage={75}
  size={100}
  color="#F97316"
  showPercentage
/>
```

---

### StatsCardProps

Dashboard statistic display card.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | Statistic label |
| `value` | `string \| number` | Yes | - | Display value |
| `trend` | `'up' \| 'down' \| 'neutral'` | No | `'neutral'` | Trend direction |
| `trendValue` | `string` | No | - | Trend percentage/text |
| `icon` | `React.ComponentType` | No | - | Lucide icon component |
| `color` | `'purple' \| 'blue' \| 'orange' \| 'green' \| 'red'` | No | `'purple'` | Color theme |
| `loading` | `boolean` | No | `false` | Loading state |
| `onClick` | `() => void` | No | - | Click handler |
| `className` | `string` | No | - | Additional CSS classes |

**Example**:
```tsx
<StatsCard
  title="Completed Tasks"
  value={42}
  trend="up"
  trendValue="+12%"
  icon={CheckCircle}
  color="green"
/>
```

---

### AuthFormProps

Reusable authentication form (login/signup).

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `mode` | `'login' \| 'signup'` | Yes | - | Form mode |
| `onSubmit` | `(data: AuthFormData) => Promise<void>` | Yes | - | Submit handler |
| `loading` | `boolean` | No | `false` | Form loading state |
| `error` | `string` | No | - | Form-level error message |
| `onToggleMode` | `() => void` | No | - | Switch between login/signup |

**AuthFormData Interface**:
```typescript
interface AuthFormData {
  email: string;
  password: string;
  name?: string; // Only for signup
}
```

**Example**:
```tsx
<AuthForm
  mode="login"
  onSubmit={handleLogin}
  loading={isLoading}
  error={authError}
  onToggleMode={() => router.push('/signup')}
/>
```

---

### NavBarProps

Main navigation bar with active state highlighting.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `items` | `NavItem[]` | Yes | - | Navigation items |
| `user` | `User` | No | - | Current user (for user menu) |
| `onLogout` | `() => void` | No | - | Logout handler |
| `className` | `string` | No | - | Additional CSS classes |

**NavItem Interface**:
```typescript
interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  active?: boolean;
}
```

**Example**:
```tsx
<NavBar
  items={[
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  ]}
  user={currentUser}
  onLogout={handleLogout}
/>
```

---

### RecentTasksProps

List of recent tasks with status indicators.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `tasks` | `Task[]` | Yes | - | Task data |
| `maxTasks` | `number` | No | `5` | Maximum tasks to display |
| `onTaskClick` | `(taskId: string) => void` | No | - | Task click handler |
| `loading` | `boolean` | No | `false` | Loading state |
| `emptyMessage` | `string` | No | `'No recent tasks'` | Empty state message |

**Task Interface** (existing, preserved):
```typescript
interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Example**:
```tsx
<RecentTasks
  tasks={recentTasks}
  maxTasks={5}
  onTaskClick={(id) => router.push(`/tasks/${id}`)}
/>
```

---

### TaskChartProps

Task statistics chart (lazy-loaded).

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `data` | `ChartDataPoint[]` | Yes | - | Chart data |
| `type` | `'line' \| 'bar'` | No | `'line'` | Chart type |
| `title` | `string` | No | - | Chart title |
| `height` | `number` | No | `300` | Chart height in pixels |
| `color` | `string` | No | `'#F97316'` | Primary color |

**ChartDataPoint Interface**:
```typescript
interface ChartDataPoint {
  date: string;
  completed: number;
  created: number;
}
```

---

## Custom Hooks

### useStats

Calculates task statistics from task array.

**Input**: `Task[]`

**Output**:
```typescript
interface StatsResult {
  total: number;
  completed: number;
  pending: number;
  completionRate: number; // 0-100
  trend: 'up' | 'down' | 'neutral';
}
```

**Example**:
```tsx
const { total, completed, completionRate } = useStats(tasks);
```

---

### useReducedMotion

Detects user's motion preference for accessibility.

**Output**: `boolean` - true if user prefers reduced motion

**Example**:
```tsx
const shouldReduceMotion = useReducedMotion();

<motion.div
  animate={shouldReduceMotion ? {} : { scale: 1.1 }}
/>
```

---

## Design Tokens

### Color Tokens

```typescript
const colors = {
  // Primary gradient (Purple to Blue)
  primary: {
    start: '#8B5CF6',
    end: '#3B82F6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
  },

  // Secondary gradient (Pink to Rose)
  secondary: {
    start: '#EC4899',
    end: '#F43F5E',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
  },

  // Warm dashboard (Orange to Amber)
  warm: {
    start: '#F97316',
    end: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)',
  },

  // Glassmorphism
  glass: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
    backgroundHigh: 'rgba(255, 255, 255, 0.2)',
    backgroundLow: 'rgba(255, 255, 255, 0.05)',
  },

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;
```

### Spacing Tokens

```typescript
const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;
```

### Animation Tokens

```typescript
const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
  stagger: {
    fast: '50ms',
    normal: '100ms',
    slow: '150ms',
  },
} as const;
```

---

## Component Hierarchy

```
app/
├── page.tsx
│   └── LandingPage
│       ├── AnimatedBackground
│       ├── Hero
│       │   └── GradientButton
│       ├── FeaturesSection
│       │   └── GlassCard (x3)
│       └── BenefitsSection
│           └── StatsCard (x3)
│
├── (auth)/
│   ├── login/page.tsx
│   │   └── AuthBackground
│   │       └── AuthForm
│   │           ├── FloatingLabel
│   │           └── GradientButton
│   └── signup/page.tsx
│       └── [same structure]
│
└── (dashboard)/
    ├── layout.tsx
    │   └── NavBar
    │       ├── NavLink
    │       └── UserMenu
    └── dashboard/page.tsx
        ├── StatsCard (x4)
        ├── ProgressRing
        ├── RecentTasks
        ├── QuickActions
        │   └── GradientButton
        └── TaskChart (lazy-loaded)
```

---

## TypeScript Exports

All types should be exported from a central types file:

```typescript
// lib/types.ts
export type {
  GlassCardProps,
  GradientButtonProps,
  AnimatedBackgroundProps,
  FloatingLabelProps,
  ProgressRingProps,
  StatsCardProps,
  AuthFormProps,
  AuthFormData,
  NavBarProps,
  NavItem,
  RecentTasksProps,
  TaskChartProps,
  ChartDataPoint,
  StatsResult,
} from '@/components';
```
