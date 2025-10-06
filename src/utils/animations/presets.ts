/**
 * Animation presets for Bistro Bert
 * Pre-defined animation configurations for common patterns
 */

import { Variants, Transition, Variant } from 'framer-motion';
import {
  ANIMATION_DURATIONS,
  ANIMATION_DELAYS,
  EASING,
  ANIMATION_CATEGORIES,
  DIRECTIONS,
  SCALES,
} from './constants';

// Base transition configuration
const createTransition = (
  duration: number = ANIMATION_DURATIONS.normal,
  ease: string | number[] = [...EASING.luxury],
  delay: number = 0
): Transition => ({
  duration,
  ease: ease as any,
  delay,
  type: 'tween',
});

// Content reveal presets
export const revealPresets = {
  // Simple fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: createTransition() },
    exit: { opacity: 0, transition: createTransition() },
  } as Variants,

  // Slide up with fade
  slideUp: {
    initial: { opacity: 0, y: DIRECTIONS.up.y },
    animate: { opacity: 1, y: 0, transition: createTransition() },
    exit: { opacity: 0, y: DIRECTIONS.down.y, transition: createTransition() },
  } as Variants,

  // Slide down with fade
  slideDown: {
    initial: { opacity: 0, y: DIRECTIONS.down.y },
    animate: { opacity: 1, y: 0, transition: createTransition() },
    exit: { opacity: 0, y: DIRECTIONS.up.y, transition: createTransition() },
  } as Variants,

  // Slide left with fade
  slideLeft: {
    initial: { opacity: 0, x: DIRECTIONS.left.x },
    animate: { opacity: 1, x: 0, transition: createTransition() },
    exit: { opacity: 0, x: DIRECTIONS.right.x, transition: createTransition() },
  } as Variants,

  // Slide right with fade
  slideRight: {
    initial: { opacity: 0, x: DIRECTIONS.right.x },
    animate: { opacity: 1, x: 0, transition: createTransition() },
    exit: { opacity: 0, x: DIRECTIONS.left.x, transition: createTransition() },
  } as Variants,

  // Scale in with fade
  scaleIn: {
    initial: { opacity: 0, scale: SCALES.medium },
    animate: { opacity: 1, scale: 1, transition: createTransition() },
    exit: { opacity: 0, scale: SCALES.medium, transition: createTransition() },
  } as Variants,

  // Luxury reveal with multiple properties
  luxuryReveal: {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
      filter: 'blur(4px)'
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: createTransition(
        ANIMATION_DURATIONS.showcase,
        [...EASING.luxury]
      )
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      filter: 'blur(4px)',
      transition: createTransition(
        ANIMATION_DURATIONS.showcase,
        [...EASING.luxury]
      )
    },
  } as Variants,

  // Elegant unfold for complex content
  unfold: {
    initial: {
      opacity: 0,
      scaleY: 0.8,
      transformOrigin: 'top'
    },
    animate: {
      opacity: 1,
      scaleY: 1,
      transformOrigin: 'top',
      transition: createTransition(
        ANIMATION_DURATIONS.content,
        [...EASING.graceful]
      )
    },
    exit: {
      opacity: 0,
      scaleY: 0.8,
      transformOrigin: 'top',
      transition: createTransition(
        ANIMATION_DURATIONS.content,
        [...EASING.graceful]
      )
    },
  } as Variants,
};

// Micro-interaction presets
export const microInteractionPresets = {
  // Button hover with luxury feel
  buttonHover: {
    whileHover: { 
      scale: SCALES.grow, 
      y: -2,
      transition: createTransition(
        ANIMATION_DURATIONS.instant,
        [...EASING.refined]
      )
    },
    whileTap: { 
      scale: SCALES.shrink,
      transition: createTransition(
        ANIMATION_DURATIONS.instant,
        [...EASING.subtle]
      )
    },
  } as Variants,

  // Card hover with elevation
  cardHover: {
    whileHover: { 
      y: -8,
      scale: 1.02,
      transition: createTransition(
        ANIMATION_DURATIONS.fast,
        [...EASING.graceful]
      )
    },
  } as Variants,

  // Focus state with subtle glow
  focusGlow: {
    whileFocus: { 
      scale: 1.01,
      boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
      transition: createTransition(
        ANIMATION_DURATIONS.fast,
        [...EASING.responsive]
      )
    },
  } as Variants,

  // Input focus with border animation
  inputFocus: {
    whileFocus: { 
      scale: 1.01,
      borderColor: 'var(--burgundy)',
      transition: createTransition(
        ANIMATION_DURATIONS.instant,
        [...EASING.responsive]
      )
    },
  } as Variants,

  // Link hover with underline animation
  linkHover: {
    whileHover: { 
      textDecorationThickness: '2px',
      textUnderlineOffset: '4px',
      transition: createTransition(
        ANIMATION_DURATIONS.instant,
        [...EASING.subtle]
      )
    },
  } as Variants,

  // Success feedback animation
  successFeedback: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: createTransition(
        ANIMATION_DURATIONS.fast,
        [...EASING.responsive]
      )
    },
  } as Variants,

  // Error feedback with shake
  errorFeedback: {
    animate: {
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: ANIMATION_DURATIONS.fast,
        ease: [...EASING.subtle] as any,
      }
    }
  } as Variants,
};

// Staggered animation presets
export const staggerPresets = {
  // Staggered fade in for lists
  staggeredFadeIn: {
    container: {
      initial: { opacity: 0 },
      animate: { 
        opacity: 1,
        transition: {
          staggerChildren: ANIMATION_DELAYS.sequential / 1000,
          delayChildren: ANIMATION_DELAYS.short / 1000,
        }
      },
    },
    item: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: createTransition(
        ANIMATION_DURATIONS.fast,
        [...EASING.luxury]
      ),
    }
  },

  // Staggered slide up for menus
  staggeredSlideUp: {
    container: {
      initial: { opacity: 0 },
      animate: { 
        opacity: 1,
        transition: {
          staggerChildren: ANIMATION_DELAYS.sequential / 1000,
          delayChildren: ANIMATION_DELAYS.medium / 1000,
        }
      },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: createTransition(
        ANIMATION_DURATIONS.normal,
        [...EASING.graceful]
      ),
    }
  },

  // Staggered scale in for grids
  staggeredScaleIn: {
    container: {
      initial: { opacity: 0 },
      animate: { 
        opacity: 1,
        transition: {
          staggerChildren: ANIMATION_DELAYS.short / 1000,
          delayChildren: ANIMATION_DELAYS.short / 1000,
        }
      },
    },
    item: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: createTransition(
        ANIMATION_DURATIONS.fast,
        [...EASING.luxury]
      ),
    }
  },
};

// Special effect presets
export const effectPresets = {
  // Gold shimmer effect
  goldShimmer: {
    initial: { opacity: 0, x: -100 },
    animate: {
      opacity: 1,
      x: 100,
      transition: createTransition(
        ANIMATION_DURATIONS.showcase,
        [...EASING.shimmer]
      )
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: createTransition(
        ANIMATION_DURATIONS.showcase,
        [...EASING.shimmer]
      )
    },
  } as Variants,

  // Floating animation for ambient elements
  floating: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: ANIMATION_DURATIONS.breathing,
        ease: [...EASING.float] as any,
        repeat: Infinity,
        repeatType: 'reverse',
      }
    }
  } as Variants,

  // Pulse animation for attention
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: ANIMATION_DURATIONS.ambient,
        ease: [...EASING.natural] as any,
        repeat: Infinity,
        repeatType: 'reverse',
      }
    }
  } as Variants,

  // Breathing animation for ambient effects
  breathing: {
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: ANIMATION_DURATIONS.breathing,
        ease: [...EASING.float] as any,
        repeat: Infinity,
        repeatType: 'reverse',
      }
    }
  } as Variants,

  // Glow effect for highlights
  glow: {
    animate: {
      boxShadow: [
        '0 0 5px rgba(212, 175, 55, 0.2)',
        '0 0 20px rgba(212, 175, 55, 0.4)',
        '0 0 5px rgba(212, 175, 55, 0.2)',
      ],
      transition: {
        duration: ANIMATION_DURATIONS.ambient,
        ease: [...EASING.natural] as any,
        repeat: Infinity,
        repeatType: 'reverse',
      }
    }
  } as Variants,
};

// Page transition presets
export const pageTransitionPresets = {
  // Fade transition between pages
  fadeTransition: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: createTransition(
        ANIMATION_DURATIONS.page,
        [...EASING.luxury]
      )
    },
    exit: {
      opacity: 0,
      transition: createTransition(
        ANIMATION_DURATIONS.page,
        [...EASING.luxury]
      )
    },
  } as Variants,

  // Slide transition between pages
  slideTransition: {
    initial: { opacity: 0, x: 100 },
    animate: {
      opacity: 1,
      x: 0,
      transition: createTransition(
        ANIMATION_DURATIONS.page,
        [...EASING.graceful]
      )
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: createTransition(
        ANIMATION_DURATIONS.page,
        [...EASING.graceful]
      )
    },
  } as Variants,

  // Immersive transition for hero sections
  immersiveTransition: {
    initial: {
      opacity: 0,
      scale: 1.1,
      filter: 'blur(10px)'
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: createTransition(
        ANIMATION_DURATIONS.immersive,
        [...EASING.luxury]
      )
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      filter: 'blur(10px)',
      transition: createTransition(
        ANIMATION_DURATIONS.immersive,
        [...EASING.luxury]
      )
    },
  } as Variants,
};

// Loading state presets
export const loadingPresets = {
  // Skeleton loading animation
  skeleton: {
    animate: {
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: ANIMATION_DURATIONS.ambient,
        ease: EASING.linear,
        repeat: Infinity,
      }
    }
  } as Variants,

  // Elegant spinner
  spinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: ANIMATION_DURATIONS.content,
        ease: EASING.linear,
        repeat: Infinity,
      }
    }
  } as Variants,

  // Progress bar animation
  progress: {
    initial: { width: '0%' },
    animate: {
      width: '100%',
      transition: createTransition(
        ANIMATION_DURATIONS.showcase,
        [...EASING.natural]
      )
    },
  } as Variants,
};

// Export all presets
export const ANIMATION_PRESETS = {
  reveal: revealPresets,
  microInteraction: microInteractionPresets,
  stagger: staggerPresets,
  effect: effectPresets,
  pageTransition: pageTransitionPresets,
  loading: loadingPresets,
} as const;