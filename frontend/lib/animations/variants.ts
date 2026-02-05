import { Variants } from 'framer-motion';

// Page transition variants (fade-in, slide-up)
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

// Stagger container for list animations
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 50ms between items
      delayChildren: 0.1,
    },
  },
};

// Stagger item for individual list elements
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.2 },
  },
};

// Hover animation for cards and buttons
export const hoverVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } },
};

// Checkbox spring animation
export const checkboxVariants: Variants = {
  unchecked: { scale: 1, rotate: 0 },
  checked: {
    scale: [1, 1.2, 1], // Overshoot and settle
    rotate: [0, 10, 0],
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 15,
    },
  },
};

// Slide panel from right
export const slidePanelVariants: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

// Backdrop overlay
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// Progress bar fill animation
export const progressBarVariants = {
  initial: { width: '0%' },
  animate: (percentage: number) => ({
    width: `${percentage}%`,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

// Button press animation
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  tap: { scale: 0.95 },
  hover: { scale: 1.05 },
};
