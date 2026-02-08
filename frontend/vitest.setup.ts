import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock window.matchMedia for ParticleBackground component
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock framer-motion to avoid animation issues in tests
// vi.mock('framer-motion', () => ({
//   motion: {
//     div: (props: any) => <div {...props}>{props.children}</div>,
//     h1: (props: any) => <h1 {...props}>{props.children}</h1>,
//     p: (props: any) => <p {...props}>{props.children}</p>,
//     section: (props: any) => <section {...props}>{props.children}</section>,
//   },
//   AnimatePresence: ({ children }: any) => children,
// }));
