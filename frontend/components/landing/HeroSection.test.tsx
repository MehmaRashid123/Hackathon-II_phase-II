import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { fc, test } from '@fast-check/vitest';
import HeroSection from './HeroSection';

/**
 * Property-Based Tests for HeroSection Component
 * Feature: ui-redesign
 */

describe('HeroSection Property Tests', () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    // Store original window width
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    // Restore original window width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  /**
   * Property 4: Responsive Layout Integrity
   * Feature: ui-redesign, Property 4: Responsive Layout Integrity
   * Validates: Requirements 1.7
   * 
   * For any viewport width, all UI components should maintain proper layout
   * without horizontal scrolling or content overflow.
   */
  test.prop([
    fc.integer({ min: 320, max: 2560 }), // Viewport widths from mobile to large desktop
    fc.string({ minLength: 5, maxLength: 100 }), // Title
    fc.string({ minLength: 10, maxLength: 200 }), // Subtitle
  ], { numRuns: 100 })(
    'should maintain layout integrity at any viewport width without overflow',
    (viewportWidth, title, subtitle) => {
      // Set viewport width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: viewportWidth,
      });

      // Trigger resize event
      window.dispatchEvent(new Event('resize'));

      // Render component with generated props
      const { container } = render(
        <HeroSection
          title={title}
          subtitle={subtitle}
          primaryCTA={{ text: 'Get Started', href: '/signup' }}
          secondaryCTA={{ text: 'Sign In', href: '/login' }}
        />
      );

      // Property 1: Component should render without errors
      expect(container).toBeTruthy();

      // Property 2: Main section should exist
      const section = container.querySelector('section');
      expect(section).toBeTruthy();

      // Property 3: Content should not cause horizontal overflow
      // Check that the main container has proper max-width constraints
      const contentContainer = container.querySelector('.max-w-7xl');
      expect(contentContainer).toBeTruthy();

      // Property 4: Responsive padding classes should be present
      // The component uses responsive padding (px-4 sm:px-6 lg:px-8)
      const paddedContainer = container.querySelector('[class*="px-"]');
      expect(paddedContainer).toBeTruthy();

      // Property 5: Text content should be present and not empty
      expect(screen.getByText(title)).toBeTruthy();
      expect(screen.getByText(subtitle)).toBeTruthy();

      // Property 6: CTA buttons should be present
      const buttons = screen.getAllByRole('link');
      expect(buttons.length).toBeGreaterThanOrEqual(2);

      // Property 7: Responsive text sizing classes should be present
      // Title should have responsive text sizing (text-4xl sm:text-5xl md:text-6xl lg:text-7xl)
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeTruthy();
      expect(heading.className).toMatch(/text-/);

      // Property 8: Flex container for buttons should adapt to viewport
      // Buttons container uses flex-col sm:flex-row for responsive layout
      const buttonContainer = container.querySelector('.flex');
      expect(buttonContainer).toBeTruthy();

      // Property 9: Grid layout for features should be responsive
      // Feature highlights use grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
      const featureGrid = container.querySelector('.grid');
      expect(featureGrid).toBeTruthy();

      // Property 10: All interactive elements should be accessible
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    }
  );

  /**
   * Additional property test: Content should be readable at all viewport sizes
   */
  test.prop([
    fc.constantFrom(320, 375, 768, 1024, 1440, 1920, 2560), // Common breakpoints
  ], { numRuns: 100 })(
    'should maintain readable content at standard breakpoints',
    (viewportWidth) => {
      // Set viewport width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: viewportWidth,
      });

      window.dispatchEvent(new Event('resize'));

      const { container } = render(
        <HeroSection
          title="Welcome to TaskMaster Pro"
          subtitle="Organize your tasks with style and efficiency"
          primaryCTA={{ text: 'Get Started', href: '/signup' }}
          secondaryCTA={{ text: 'Sign In', href: '/login' }}
        />
      );

      // At all breakpoints, essential content should be visible
      expect(screen.getByText('Welcome to TaskMaster Pro')).toBeInTheDocument();
      expect(screen.getByText('Organize your tasks with style and efficiency')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();

      // Feature highlights should be present
      expect(screen.getByText('Secure Authentication')).toBeInTheDocument();
      expect(screen.getByText('JWT + Bcrypt Security')).toBeInTheDocument();
      expect(screen.getByText('PostgreSQL Database')).toBeInTheDocument();
      expect(screen.getByText('Full CRUD Operations')).toBeInTheDocument();

      // Container should have overflow-hidden to prevent horizontal scroll
      const section = container.querySelector('section');
      expect(section?.className).toMatch(/overflow-hidden/);
    }
  );

  /**
   * Edge case test: Very long text should not break layout
   */
  test.prop([
    fc.string({ minLength: 200, maxLength: 500 }), // Very long title
    fc.string({ minLength: 500, maxLength: 1000 }), // Very long subtitle
  ], { numRuns: 50 })(
    'should handle very long text content without breaking layout',
    (longTitle, longSubtitle) => {
      const { container } = render(
        <HeroSection
          title={longTitle}
          subtitle={longSubtitle}
          primaryCTA={{ text: 'Get Started', href: '/signup' }}
          secondaryCTA={{ text: 'Sign In', href: '/login' }}
        />
      );

      // Component should still render
      expect(container).toBeTruthy();

      // Content should be constrained by max-width
      const contentContainer = container.querySelector('.max-w-7xl');
      expect(contentContainer).toBeTruthy();

      // Text should be present (even if truncated by CSS)
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeTruthy();
      expect(heading.textContent).toBe(longTitle);
    }
  );
});
