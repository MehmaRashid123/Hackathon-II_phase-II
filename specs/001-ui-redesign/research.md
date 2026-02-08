# Research: UI Redesign Technical Decisions

**Feature**: UI Redesign
**Date**: 2026-02-07
**Research Areas**: Glassmorphism, Animation Performance, Accessibility Patterns

---

## Decision 1: Glassmorphism Implementation Strategy

**Decision**: Use CSS `backdrop-filter: blur()` with Tailwind utilities and solid-color fallbacks.

**Rationale**:
- Native browser optimization with hardware acceleration
- Clean integration with React and Tailwind CSS
- Minimal bundle size impact (CSS-only)
- Wide browser support (95%+ for backdrop-filter)

**Browser Support**:
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support (enabled by default since 2021)
- Safari: ✅ Full support with `-webkit-` prefix
- IE11: ❌ Not supported (fallback required)

**Implementation Approach**:
```css
/* Primary glassmorphism style */
.glass {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Fallback for unsupported browsers */
@supports not (backdrop-filter: blur(12px)) {
  .glass {
    background: rgba(255, 255, 255, 0.95);
  }
}
```

**Alternatives Considered**:
| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| Canvas-based | Full control, complex effects | High complexity, performance cost | ❌ Rejected - overkill |
| SVG filters | Vector-based, scalable | Poor performance, browser quirks | ❌ Rejected - inconsistent |
| Image backgrounds | Simple to implement | Large assets, not dynamic | ❌ Rejected - static only |
| CSS backdrop-filter | Native, fast, clean | Limited effects | ✅ Selected |

---

## Decision 2: Animation Library Strategy

**Decision**: Use Framer Motion for all animations (declarative React animations).

**Rationale**:
- Already installed in project (from spec assumptions)
- Declarative API fits React paradigm
- Built-in `AnimatePresence` for mount/unmount animations
- Automatic `prefers-reduced-motion` support
- Hardware-accelerated transforms

**Performance Optimizations**:
1. Use `transform` and `opacity` only (composite-only properties)
2. Apply `will-change` sparingly to elements about to animate
3. Use `layout` prop cautiously (has performance cost)
4. Implement `useReducedMotion()` hook for accessibility

**Code Pattern**:
```tsx
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const MyComponent = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier
      }}
    />
  );
};
```

**Alternatives Considered**:
| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| CSS animations | No JS, performant | Limited dynamic control | ❌ Rejected - need dynamic |
| GSAP | Powerful, timeline control | Large bundle, licensing | ❌ Rejected - too heavy |
| React Spring | Physics-based | Learning curve | ❌ Rejected - Framer already installed |
| Framer Motion | Declarative, React-native | Slightly larger than CSS | ✅ Selected |

---

## Decision 3: Dashboard Chart Library

**Decision**: Use Recharts for dashboard charts (already installed).

**Rationale**:
- Already installed in project
- React-native, declarative API
- Responsive by default
- Customizable styling to match design system

**Styling Approach**:
- Use Tailwind colors via CSS custom properties
- Implement warm color scheme for dashboard (orange/amber)
- Lazy-load chart components to avoid blocking initial render

**Lazy Loading Pattern**:
```tsx
import { lazy, Suspense } from 'react';

const TaskChart = lazy(() => import('./TaskChart'));

const Dashboard = () => (
  <Suspense fallback={<ChartSkeleton />}>
    <TaskChart data={taskData} />
  </Suspense>
);
```

**Alternatives Considered**:
| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| D3.js | Full control, powerful | Steep learning curve, verbose | ❌ Rejected - too complex |
| Chart.js | Simple, popular | Imperative API | ❌ Rejected - not React-native |
| Victory | React-native | Larger bundle | ❌ Rejected - Recharts already installed |
| Recharts | React-native, simple | Less flexible than D3 | ✅ Selected |

---

## Decision 4: Form Validation Strategy

**Decision**: Use Zod schemas with React Hook Form for auth forms.

**Rationale**:
- TypeScript-first schema validation
- Excellent error message customization
- Small bundle size
- Works seamlessly with React Hook Form

**Implementation Pattern**:
```tsx
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const AuthForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  // ...
};
```

**Alternatives Considered**:
| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| Yup | Popular, well-documented | Larger bundle, not TS-first | ❌ Rejected |
| Joi | Powerful | Large bundle, verbose | ❌ Rejected |
| Valibot | Tree-shakeable | Newer, less ecosystem | ❌ Rejected |
| Zod | TS-first, small, popular | - | ✅ Selected |

---

## Decision 5: Color and Theming Strategy

**Decision**: Use CSS custom properties (variables) for dynamic theming.

**Rationale**:
- Runtime theme switching without JS
- Works with Tailwind arbitrary values
- Can be scoped to specific sections (landing vs dashboard)
- Native browser support (no polyfills)

**Token Structure**:
```css
/* Base tokens */
:root {
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
  --gradient-secondary: linear-gradient(135deg, #EC4899 0%, #F43F5E 100%);
  --gradient-warm: linear-gradient(135deg, #F97316 0%, #F59E0B 100%);

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-blur: 12px;

  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dashboard-specific warm theme */
[data-theme="dashboard"] {
  --color-primary: #F97316;
  --color-secondary: #F59E0B;
  --gradient-primary: var(--gradient-warm);
}
```

**Alternatives Considered**:
| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| Tailwind config only | Simple | No runtime switching | ❌ Rejected |
| CSS-in-JS (styled-components) | Full JS control | Runtime overhead, larger bundle | ❌ Rejected |
| CSS custom properties | Native, fast, runtime | Limited IE support (not relevant) | ✅ Selected |

---

## Decision 6: Testing Strategy

**Decision**: Three-tier testing approach.

**Rationale**: Comprehensive coverage with appropriate tools for each layer.

**Strategy**:
1. **Unit Tests (Vitest)**:
   - Component rendering
   - Hook behavior (useStats, useReducedMotion)
   - Utility functions

2. **Accessibility Tests (axe-core)**:
   - Automated WCAG AA compliance
   - Color contrast verification
   - ARIA label validation

3. **Performance Tests (Lighthouse CI)**:
   - FCP, LCP, TTI metrics
   - Animation frame rate (Chrome DevTools)
   - Bundle size analysis

**Test File Structure**:
```
components/
├── ui/
│   ├── GlassCard.tsx
│   ├── GlassCard.test.tsx          # Unit test
│   └── GlassCard.a11y.test.tsx     # Accessibility test
```

---

## Decision 7: Lazy Loading Strategy

**Decision**: Use React.lazy + Suspense for heavy components.

**Components to Lazy Load**:
- TaskChart (Recharts bundle ~50KB)
- AnimatedBackground with particles (complex canvas/SVG)
- Heavy dashboard widgets

**Preloading Strategy**:
```tsx
// Preload on hover/touchstart for faster subsequent navigation
const TaskChart = lazy(() => import('./TaskChart'));

// Preload after initial render
useEffect(() => {
  const preload = () => import('./TaskChart');
  const timer = setTimeout(preload, 2000); // Preload after 2s
  return () => clearTimeout(timer);
}, []);
```

---

## Summary of All Decisions

| Area | Decision | Key Rationale |
|------|----------|---------------|
| Glassmorphism | CSS backdrop-filter | Native, fast, clean fallbacks |
| Animation | Framer Motion | Already installed, declarative |
| Charts | Recharts | Already installed, React-native |
| Form Validation | Zod + React Hook Form | TS-first, small bundle |
| Theming | CSS custom properties | Runtime switching, native |
| Testing | Vitest + axe-core + Lighthouse | Comprehensive coverage |
| Lazy Loading | React.lazy + Suspense | Native React pattern |

---

## Browser Compatibility Notes

**Target Browsers** (per constitution):
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 15+)
- Chrome Android (latest)

**Feature Detection**:
```tsx
// useGlassmorphismSupport hook
export const useGlassmorphismSupport = () => {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const test = document.createElement('div');
    test.style.backdropFilter = 'blur(10px)';
    setSupported(test.style.backdropFilter !== '');
  }, []);

  return supported;
};
```

---

## Performance Budgets

| Metric | Target | Maximum |
|--------|--------|---------|
| First Contentful Paint (FCP) | < 1.0s | 1.5s |
| Largest Contentful Paint (LCP) | < 2.0s | 2.5s |
| Time to Interactive (TTI) | < 3.0s | 3.5s |
| Animation frame rate | 60fps | 30fps (min) |
| Total bundle size | < 200KB | 300KB |

---

## Open Questions (Resolved)

1. **Q**: Should we use a UI component library (Chakra, MUI)?
   **A**: No - custom glassmorphism design requires custom components.

2. **Q**: How to handle dark mode?
   **A**: Out of scope for this redesign. Design uses colored backgrounds (gradients) not pure dark/light.

3. **Q**: Should we use Storybook for component development?
   **A**: Not required - Vitest tests + direct page integration sufficient for this scope.
