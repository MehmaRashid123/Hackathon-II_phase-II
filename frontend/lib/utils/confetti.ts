/**
 * Confetti Utility
 *
 * Celebration effect for task completion using canvas-confetti.
 * Respects prefers-reduced-motion for accessibility.
 */

import confetti from "canvas-confetti";

/**
 * Trigger confetti celebration effect.
 *
 * Automatically respects user's reduced motion preferences.
 */
export function triggerConfetti() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    // Skip animation if user prefers reduced motion
    return;
  }

  // Trigger confetti effect
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"],
  });
}

/**
 * Trigger a burst of confetti from a specific element.
 *
 * @param element - DOM element to use as the origin point
 */
export function triggerConfettiFromElement(element: HTMLElement) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 50,
    spread: 60,
    origin: { x, y },
    colors: ["#10b981", "#3b82f6", "#8b5cf6"],
  });
}

/**
 * Trigger a subtle celebration effect for task completion.
 */
export function celebrateTaskCompletion() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  // Two bursts from left and right
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ["#10b981", "#3b82f6"],
    });

    confetti({
      particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ["#10b981", "#3b82f6"],
    });
  }, 250);
}
