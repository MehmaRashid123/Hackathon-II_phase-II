# Implementation Plan: UI Redesign

**Branch**: `001-ui-redesign` | **Date**: 2026-02-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ui-redesign/spec.md`

## Summary

Transform the existing task management application with a modern glassmorphism UI design. The redesign focuses on reusable components (GlassCard, GradientButton), animated backgrounds, enhanced authentication forms, a statistics-rich dashboard, and accessibility/performance optimizations. The implementation maintains existing authentication logic while significantly elevating the visual experience.

## Technical Context

**Language/Version**: TypeScript 5+, Python 3.11+
**Primary Dependencies**: Next.js 16+ (App Router), React, Framer Motion, Recharts, Tailwind CSS
**Storage**: Neon Serverless PostgreSQL (existing, unchanged)
**Testing**: Vitest (unit), Playwright (e2e), Lighthouse (performance)
**Target Platform**: Web (responsive: mobile/tablet/desktop)
**Project Type**: Web application (monorepo: frontend/ + backend/)
**Performance Goals**: Lighthouse 90+ score, FCP <1.5s, LCP <2.5s, 60fps animations
**Constraints**: WCAG AA accessibility compliance, glassmorphism fallback for unsupported browsers
**Scale/Scope**: Single-user to team-scale task management, 20 reusable UI components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | ✅ PASS | Spec created before implementation |
| II. Agentic Workflow | ✅ PASS | Will use `nextjs-ui-builder` agent for UI work |
| III. Security First | ✅ PASS | UI changes only; auth logic preserved |
| IV. Modern Stack with Strong Typing | ✅ PASS | TypeScript 5+, Next.js 16+, existing patterns |
| V. User Isolation | ✅ PASS | No changes to data access patterns |
| VI. Responsive Design | ✅ PASS | Mobile-first specified in requirements |
| VII. Data Persistence | ✅ PASS | No database changes needed |

**Gate Result**: ✅ **PASS** - All constitutional principles satisfied. UI redesign is a frontend-only change that preserves all existing security, isolation, and data patterns.

## Project Structure

### Documentation (this feature)

```text
specs/001-ui-redesign/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # [MODIFY] Add glassmorphism form
│   │   ├── signup/
│   │   │   └── page.tsx          # [MODIFY] Add glassmorphism form
│   │   └── layout.tsx            # [MODIFY] Add animated background
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # [MODIFY] Add stats, charts, recent tasks
│   │   └── layout.tsx            # [MODIFY] Add navigation with active states
│   ├── page.tsx                  # [MODIFY] Landing page with hero
│   ├── layout.tsx                # [MODIFY] Root layout with providers
│   └── globals.css               # [MODIFY] Add glassmorphism utilities
├── components/
│   ├── ui/
│   │   ├── GlassCard.tsx         # [NEW] Glassmorphism container
│   │   ├── GradientButton.tsx    # [NEW] Gradient button variants
│   │   ├── AnimatedBackground.tsx # [NEW] Animated gradient background
│   │   ├── FloatingLabel.tsx     # [NEW] Animated form labels
│   │   ├── ProgressRing.tsx      # [NEW] Circular progress SVG
│   │   └── StatsCard.tsx         # [NEW] Dashboard stat display
│   ├── landing/
│   │   ├── Hero.tsx              # [NEW] Landing hero section
│   │   ├── FeaturesSection.tsx   # [NEW] Feature cards grid
│   │   └── BenefitsSection.tsx   # [NEW] Stats/benefits display
│   ├── auth/
│   │   ├── AuthBackground.tsx    # [NEW] Animated auth background
│   │   └── AuthForm.tsx          # [NEW] Reusable auth form
│   ├── dashboard/
│   │   ├── RecentTasks.tsx       # [NEW] Recent tasks list
│   │   ├── QuickActions.tsx      # [NEW] Quick action buttons
│   │   └── TaskChart.tsx         # [NEW] Chart component
│   └── navigation/
│       ├── NavBar.tsx            # [NEW] Main navigation
│       ├── NavLink.tsx           # [NEW] Active link component
│       └── UserMenu.tsx          # [NEW] User dropdown menu
├── lib/
│   ├── utils.ts                  # [EXISTING] Utility functions
│   └── design-tokens.ts          # [NEW] Colors, spacing, animation values
├── hooks/
│   ├── useStats.ts               # [NEW] Task stats calculation
│   ├── useReducedMotion.ts       # [NEW] Accessibility hook
│   └── useLazyLoad.ts            # [NEW] Lazy loading hook
└── public/
    └── [assets as needed]

backend/
├── [NO CHANGES - UI only feature]
└── src/
    └── [existing structure preserved]
```

**Structure Decision**: Monorepo structure maintained per constitution. Changes are additive (new components) and modifications (existing pages). No backend changes required as this is a pure UI redesign feature.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitutional principles are satisfied by this design.

---

## Phase 0: Research & Technical Decisions

*See [research.md](./research.md) for detailed findings*

### Key Decisions (Summary)

1. **Glassmorphism Strategy**: Use Tailwind's `backdrop-blur` with CSS fallbacks for Firefox/Safari
2. **Animation Library**: Framer Motion for declarative animations (already installed)
3. **Chart Library**: Recharts for dashboard charts (already installed)
4. **Testing Strategy**: Vitest for component unit tests, axe-core for accessibility
5. **Color Strategy**: CSS custom properties for dynamic theming (warm dashboard vs cool landing)
6. **Lazy Loading**: React.lazy + Suspense for heavy components (TaskChart, particles)
7. **Form Validation**: Zod schemas with React Hook Form for auth forms

### Research Areas

- Glassmorphism browser support and fallbacks
- Framer Motion performance optimization patterns
- Accessible animation patterns (prefers-reduced-motion)
- Dashboard layout patterns for responsive design
- Form validation accessibility best practices

## Phase 1: Design & Contracts

### Data Model

*See [data-model.md](./data-model.md) for entity definitions*

**UI-Layer Entities** (new):
- `GlassCardProps`: blur, opacity, border, padding, radius
- `GradientButtonProps`: variant, loading, disabled, onClick
- `StatsCardProps`: title, value, trend, icon, color
- `ProgressRingProps`: percentage, size, stroke, color

**Existing Entities** (unchanged):
- User, Task, Section, Project (backend models preserved)

### API Contracts

*See [contracts/](./contracts/) for schemas*

**UI Changes Only - No API Changes**

The UI redesign preserves all existing API contracts. Dashboard stats are computed client-side from existing `/api/{user_id}/tasks` endpoint data.

### Quick Start

*See [quickstart.md](./quickstart.md) for setup instructions*

Key additions:
1. Install required packages (if any missing)
2. Add glassmorphism Tailwind utilities
3. Configure design tokens
4. Run component tests
5. Start dev server and verify pages

---

## Implementation Approach

### Component-First Strategy

Per the user's requirements, we follow a component-first approach:

1. **Phase A: Design System** (Foundation)
   - GlassCard component with tests
   - GradientButton component with tests
   - Design tokens (colors, spacing, animation)
   - Tailwind config updates

2. **Phase B: Landing Page**
   - AnimatedBackground component
   - Hero section with headline/CTA
   - Features grid with hover effects
   - Responsive layout tests

3. **Phase C: Authentication Pages**
   - AuthBackground component
   - AuthForm with floating labels
   - Login/Signup page integration
   - Form validation tests

4. **Phase D: Dashboard**
   - StatsCard + ProgressRing
   - RecentTasks list
   - QuickActions buttons
   - TaskChart component
   - Dashboard page integration

5. **Phase E: Navigation & Polish**
   - NavBar with active states
   - Page transitions
   - Accessibility audit
   - Performance optimization
   - Final integration tests

### Technology-Specific Notes

**Framer Motion**:
- Use `motion.div` for component animations
- Implement `AnimatePresence` for page transitions
- Add `layout` prop for smooth layout changes
- Use `useReducedMotion()` hook for accessibility

**Tailwind CSS**:
- Custom utilities: `glass`, `glass-dark`, `gradient-primary`, `gradient-warm`
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Hover states: `hover:scale-105`, `hover:shadow-lg`

**Glassmorphism**:
- Base style: `backdrop-blur-md bg-white/10 border border-white/20`
- Fallback: Solid background color for unsupported browsers
- Contrast: Ensure text has 4.5:1 contrast ratio against background

**Accessibility**:
- All interactive elements: `aria-label` or `aria-labelledby`
- Focus indicators: `focus-visible:ring-2 focus-visible:ring-offset-2`
- Keyboard navigation: `tabIndex`, `onKeyDown` handlers
- Reduced motion: `@media (prefers-reduced-motion: reduce)`

---

## Success Metrics Alignment

| Spec Criteria | Implementation Verification |
|---------------|----------------------------|
| SC-001: Auth flow <2 min | Form UX testing with real users |
| SC-002: Lighthouse 90+ | Automated Lighthouse CI check |
| SC-003: Stats 100% accurate | Unit tests for useStats hook |
| SC-004: WCAG AA contrast | axe-core automated audit |
| SC-005: Responsive 320-2560px | Visual regression testing |
| SC-006: Keyboard navigation | Manual + automated a11y tests |
| SC-007: 300ms transitions | Performance profiling |
| SC-008: Lazy loading works | Network tab verification |

---

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Glassmorphism breaks on older Safari | Medium | Low | Fallback solid colors |
| Animation performance on low-end devices | Medium | Medium | prefers-reduced-motion + lazy loading |
| Color contrast issues with glass effect | Low | High | Automated contrast testing |
| Accessibility violations in custom components | Medium | High | axe-core + manual testing |

---

## Next Steps

1. ✅ **Spec Created** (current state)
2. ✅ **Plan Created** (current state)
3. ⏳ **Research**: Fill in [research.md](./research.md) with detailed technical decisions
4. ⏳ **Data Model**: Document UI component props in [data-model.md](./data-model.md)
5. ⏳ **Contracts**: Verify no API changes needed in [contracts/](./contracts/)
6. ⏳ **Quickstart**: Document setup steps in [quickstart.md](./quickstart.md)
7. ⏳ **Tasks**: Run `/sp.tasks` to generate actionable task breakdown
8. ⏳ **Implement**: Delegate to `nextjs-ui-builder` agent

---

## 📋 Architectural Decision Detected: Glassmorphism Implementation Strategy

**Decision**: Use CSS `backdrop-filter: blur()` with Tailwind utilities and solid-color fallbacks.

**Alternatives Considered**:
- Canvas-based effects (overkill, complex)
- SVG filters (poor performance, browser quirks)
- Image-based backgrounds (not dynamic, large assets)

**Rationale**: CSS backdrop-filter provides native browser optimization, hardware acceleration, and clean React integration. Fallbacks ensure accessibility on all browsers.

Document reasoning and tradeoffs? Run `/sp.adr glassmorphism-implementation`
