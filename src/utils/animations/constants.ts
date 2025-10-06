/**
 * Animation constants for Bistro Bert
 * Defines timing, easing, and animation categories for a luxury dining experience
 */

// Animation durations in milliseconds
export const ANIMATION_DURATIONS = {
  // Micro-interactions
  instant: 150,      // Button hover, quick feedback
  fast: 250,         // Simple transitions
  normal: 400,       // Standard UI transitions
  
  // Content animations
  content: 600,      // Text reveals, simple content
  showcase: 800,     // Image reveals, featured content
  
  // Page transitions
  page: 1000,        // Full page transitions
  immersive: 1200,   // Hero section, major experiences
  
  // Ambient animations
  ambient: 3000,     // Background effects, floating elements
  breathing: 4000,   // Subtle ambient cycles
} as const;

// Animation delays in milliseconds
export const ANIMATION_DELAYS = {
  none: 0,
  short: 100,        // Brief pause before animation
  medium: 250,       // Standard delay
  long: 500,         // Extended delay
  sequential: 150,   // For staggered animations
} as const;

// Luxury-themed easing curves
export const EASING = {
  // Subtle and refined
  luxury: [0.22, 1, 0.36, 1] as number[],      // Smooth, elegant entrance
  refined: [0.25, 0.46, 0.45, 0.94] as number[], // Gentle, sophisticated
  
  // Natural movement
  natural: [0.4, 0, 0.2, 1] as number[],       // Organic feel
  graceful: [0.23, 1, 0.32, 1] as number[],    // Flowing, elegant
  
  // Interactive elements
  responsive: [0.175, 0.885, 0.32, 1.275] as number[], // Slight overshoot for feedback
  subtle: [0.215, 0.61, 0.355, 1] as number[],      // Gentle response
  
  // Special effects
  shimmer: [0.11, 0, 0.5, 0] as number[],        // Gold accent animations
  float: [0.45, 0.05, 0.55, 0.95] as number[],    // Floating elements
  
  // Standard easing for compatibility
  linear: "linear" as const,
  easeIn: "easeIn" as const,
  easeOut: "easeOut" as const,
  easeInOut: "easeInOut" as const,
} as const;

// Animation categories with their properties
export const ANIMATION_CATEGORIES = {
  // Entrance animations
  entrance: {
    defaultDuration: ANIMATION_DURATIONS.content,
    defaultEasing: EASING.luxury,
    properties: ['opacity', 'transform'],
  },
  
  // Exit animations
  exit: {
    defaultDuration: ANIMATION_DURATIONS.fast,
    defaultEasing: EASING.refined,
    properties: ['opacity', 'transform'],
  },
  
  // Micro-interactions
  microInteraction: {
    defaultDuration: ANIMATION_DURATIONS.instant,
    defaultEasing: EASING.subtle,
    properties: ['transform', 'opacity'],
  },
  
  // State changes
  stateChange: {
    defaultDuration: ANIMATION_DURATIONS.normal,
    defaultEasing: EASING.natural,
    properties: ['transform', 'opacity'],
  },
  
  // Ambient animations
  ambient: {
    defaultDuration: ANIMATION_DURATIONS.breathing,
    defaultEasing: EASING.float,
    properties: ['transform', 'opacity'],
    loop: true,
  },
} as const;

// Breakpoint-specific animation settings
export const RESPONSIVE_ANIMATION_SETTINGS = {
  mobile: {
    durationMultiplier: 0.8, // Faster animations on mobile
    reducedComplexity: true,
    disableAmbient: true,
  },
  tablet: {
    durationMultiplier: 0.9,
    reducedComplexity: false,
    disableAmbient: false,
  },
  desktop: {
    durationMultiplier: 1.0, // Full animations on desktop
    reducedComplexity: false,
    disableAmbient: false,
  },
} as const;

// Performance settings
export const PERFORMANCE_SETTINGS = {
  targetFPS: 60,
  minimumFPS: 30,
  frameTimeThreshold: 16.67, // ms for 60fps
  complexAnimationThreshold: 500, // ms
  enableHardwareAcceleration: true,
  useWillChange: true,
} as const;

// Animation priorities for performance optimization
export const ANIMATION_PRIORITIES = {
  critical: 1,    // User interactions, essential feedback
  important: 2,   // Content reveals, page transitions
  normal: 3,      // Standard UI animations
  ambient: 4,     // Background effects, decorative
} as const;

// Animation states
export const ANIMATION_STATES = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  whileHover: 'whileHover',
  whileTap: 'whileTap',
  whileFocus: 'whileFocus',
  whileInView: 'whileInView',
} as const;

// Direction constants for directional animations
export const DIRECTIONS = {
  up: { y: -30 },
  down: { y: 30 },
  left: { x: -30 },
  right: { x: 30 },
  upLeft: { y: -30, x: -30 },
  upRight: { y: -30, x: 30 },
  downLeft: { y: 30, x: -30 },
  downRight: { y: 30, x: 30 },
} as const;

// Scale constants for scale animations
export const SCALES = {
  small: 0.95,
  medium: 0.9,
  large: 0.8,
  grow: 1.05,
  shrink: 0.95,
} as const;

// Rotation constants for rotation animations
export const ROTATIONS = {
  slight: 5,
  medium: 15,
  full: 360,
  half: 180,
  quarter: 90,
} as const;

// Type definitions
export type AnimationDuration = keyof typeof ANIMATION_DURATIONS;
export type AnimationDelay = keyof typeof ANIMATION_DELAYS;
export type EasingFunction = keyof typeof EASING;
export type AnimationCategory = keyof typeof ANIMATION_CATEGORIES;
export type ResponsiveBreakpoint = keyof typeof RESPONSIVE_ANIMATION_SETTINGS;
export type AnimationPriority = keyof typeof ANIMATION_PRIORITIES;
export type AnimationState = keyof typeof ANIMATION_STATES;
export type Direction = keyof typeof DIRECTIONS;
export type Scale = keyof typeof SCALES;
export type Rotation = keyof typeof ROTATIONS;