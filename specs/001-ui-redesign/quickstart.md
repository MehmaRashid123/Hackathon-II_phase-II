# Quick Start: UI Redesign Implementation

**Feature**: UI Redesign
**Date**: 2026-02-07
**Prerequisites**: Node.js 18+, Python 3.11+ (backend unchanged)

---

## Environment Setup

### 1. Verify Dependencies

Ensure all required packages are installed:

```bash
# Navigate to frontend
cd frontend

# Check if Framer Motion and Recharts are installed
npm list framer-motion recharts

# If missing, install them
npm install framer-motion recharts

# Install testing dependencies
npm install -D @axe-core/react vitest @testing-library/react
```

### 2. Verify Tailwind Configuration

Ensure `tailwind.config.js` includes custom glassmorphism utilities:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
};
```

### 3. Add Global CSS Utilities

Add to `app/globals.css`:

```css
/* Glassmorphism utilities */
@layer utilities {
  .glass {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .glass-dark {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .gradient-primary {
    background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
  }

  .gradient-warm {
    background: linear-gradient(135deg, #F97316 0%, #F59E0B 100%);
  }

  .text-gradient {
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Fallback for browsers without backdrop-filter */
  @supports not (backdrop-filter: blur(12px)) {
    .glass, .glass-dark {
      background: rgba(255, 255, 255, 0.95);
    }
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Implementation Order

### Phase A: Design System Components (Foundation)

#### Step 1: Create Design Tokens

```bash
# Create design tokens file
touch frontend/lib/design-tokens.ts
```

Content: See `data-model.md` for full token structure.

#### Step 2: Create GlassCard Component

```bash
# Create component
touch frontend/components/ui/GlassCard.tsx
touch frontend/components/ui/GlassCard.test.tsx
```

**Verification**:
```bash
# Run component test
npm test -- GlassCard
```

#### Step 3: Create GradientButton Component

```bash
touch frontend/components/ui/GradientButton.tsx
touch frontend/components/ui/GradientButton.test.tsx
```

**Verification**:
```bash
npm test -- GradientButton
```

#### Step 4: Update Tailwind Config

Verify custom utilities work:

```bash
# Start dev server
npm run dev

# Check browser console for Tailwind errors
```

---

### Phase B: Landing Page

#### Step 1: Create AnimatedBackground

```bash
touch frontend/components/ui/AnimatedBackground.tsx
```

#### Step 2: Create Hero Section

```bash
touch frontend/components/landing/Hero.tsx
touch frontend/components/landing/FeaturesSection.tsx
```

#### Step 3: Update Landing Page

Modify `frontend/app/page.tsx` to integrate new components.

**Verification**:
```bash
# Run dev server
npm run dev

# Visit http://localhost:3000
# Check: Animated background, hero text, CTA buttons
```

---

### Phase C: Authentication Pages

#### Step 1: Create Auth Components

```bash
touch frontend/components/auth/AuthBackground.tsx
touch frontend/components/auth/AuthForm.tsx
touch frontend/components/ui/FloatingLabel.tsx
```

#### Step 2: Update Auth Pages

Modify:
- `frontend/app/(auth)/login/page.tsx`
- `frontend/app/(auth)/signup/page.tsx`
- `frontend/app/(auth)/layout.tsx`

**Verification**:
```bash
# Test form validation
npm test -- AuthForm

# Test accessibility
npm run test:a11y
```

---

### Phase D: Dashboard

#### Step 1: Create Dashboard Components

```bash
# Stats components
touch frontend/components/ui/StatsCard.tsx
touch frontend/components/ui/ProgressRing.tsx
touch frontend/hooks/useStats.ts

# Dashboard sections
touch frontend/components/dashboard/RecentTasks.tsx
touch frontend/components/dashboard/QuickActions.tsx
touch frontend/components/dashboard/TaskChart.tsx
```

#### Step 2: Create Custom Hooks

```bash
touch frontend/hooks/useReducedMotion.ts
touch frontend/hooks/useLazyLoad.ts
```

#### Step 3: Update Dashboard Page

Modify `frontend/app/(dashboard)/dashboard/page.tsx`.

**Verification**:
```bash
# Test stats calculation
npm test -- useStats

# Test component rendering
npm test -- StatsCard
npm test -- ProgressRing
```

---

### Phase E: Navigation & Polish

#### Step 1: Create Navigation Components

```bash
touch frontend/components/navigation/NavBar.tsx
touch frontend/components/navigation/NavLink.tsx
touch frontend/components/navigation/UserMenu.tsx
```

#### Step 2: Update Dashboard Layout

Modify `frontend/app/(dashboard)/layout.tsx`.

#### Step 3: Add Page Transitions

Update root layout with Framer Motion AnimatePresence.

---

## Testing Checklist

### Unit Tests

```bash
# Run all component tests
npm test

# Individual component tests
npm test -- GlassCard
npm test -- GradientButton
npm test -- StatsCard
npm test -- ProgressRing
npm test -- useStats
```

### Accessibility Tests

```bash
# Run axe-core accessibility audit
npm run test:a11y

# Or manually with browser extension
# Install: axe DevTools Chrome extension
```

### Performance Tests

```bash
# Build for production
npm run build

# Run Lighthouse CI
npm run lighthouse

# Or manually in Chrome DevTools:
# 1. Open DevTools > Lighthouse
# 2. Select: Performance, Accessibility, Best Practices, SEO
# 3. Check: Mobile and Desktop
# 4. Run audit
```

### Visual Regression Tests

```bash
# Run Storybook (if configured)
npm run storybook

# Or manual visual verification:
# 1. Check at 320px (mobile)
# 2. Check at 768px (tablet)
# 3. Check at 1440px (desktop)
# 4. Check at 2560px (ultrawide)
```

---

## Development Commands

```bash
# Start development server
npm run dev

# Run tests (watch mode)
npm test

# Run tests (single run)
npm run test:ci

# Type checking
npm run type-check

# Linting
npm run lint

# Build production
npm run build

# Start production build
npm start
```

---

## Common Issues & Solutions

### Issue: Glassmorphism not working in Safari

**Solution**: Ensure `-webkit-backdrop-filter` is included:

```css
.glass {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px); /* Required for Safari */
}
```

### Issue: Animations too fast/slow on different devices

**Solution**: Use CSS custom properties for consistent timing:

```css
:root {
  --animation-duration: 300ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --animation-duration: 0ms;
  }
}
```

### Issue: Framer Motion layout animations janky

**Solution**: Only use `layout` prop when necessary, add `layoutId`:

```tsx
<motion.div
  layout
  layoutId="unique-id" // Helps Framer track element
  transition={{ duration: 0.3, ease: "easeInOut" }}
/>
```

### Issue: Charts not loading (lazy loading)

**Solution**: Ensure Suspense boundary is in place:

```tsx
<Suspense fallback={<ChartSkeleton />}>
  <TaskChart data={data} />
</Suspense>
```

---

## Performance Targets

Verify these metrics after implementation:

| Metric | Target | How to Check |
|--------|--------|--------------|
| FCP | < 1.5s | Lighthouse |
| LCP | < 2.5s | Lighthouse |
| TTI | < 3.5s | Lighthouse |
| Animation FPS | 60fps | Chrome DevTools > Performance |
| Bundle Size | < 200KB | `npm run analyze` |

---

## Next Steps

After completing all phases:

1. ✅ Run full test suite: `npm test`
2. ✅ Run accessibility audit: `npm run test:a11y`
3. ✅ Run Lighthouse audit: `npm run lighthouse`
4. ✅ Verify responsive design at all breakpoints
5. ⏳ Create PR with `/sp.git.commit_pr`
6. ⏳ Create PHR documenting implementation
