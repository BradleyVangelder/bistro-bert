/**
 * Enhanced accessibility utilities for animations
 * Provides animation-specific accessibility checks and safe animation props
 */

import { Variants, MotionProps, TargetAndTransition, Transition } from 'framer-motion';
import { ANIMATION_DURATIONS, ANIMATION_CATEGORIES } from './constants';
import { prefersReducedMotion, prefersHighContrast } from '@/utils/accessibility';

// Animation accessibility configuration
export interface AccessibilityAnimationConfig {
  respectReducedMotion: boolean;
  respectHighContrast: boolean;
  respectTransparency: boolean;
  customDuration?: number;
  disableHover: boolean;
  disableComplexAnimations: boolean;
}

// Safe animation props interface
export interface SafeAnimationProps extends Omit<MotionProps, 'whileHover' | 'whileTap' | 'animate'> {
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  exit?: TargetAndTransition;
  transition?: Transition;
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
  whileFocus?: TargetAndTransition;
  whileInView?: TargetAndTransition;
  variants?: Variants;
}

// Accessibility animation adapter class
export class AccessibilityAnimationAdapter {
  // Adapt animation based on user preferences
  static adaptAnimation(
    baseAnimation: SafeAnimationProps,
    config?: Partial<AccessibilityAnimationConfig>,
    preferences?: { reducedMotion: boolean; highContrast: boolean }
  ): SafeAnimationProps {
    const userPreferences = preferences || {
      reducedMotion: prefersReducedMotion(),
      highContrast: prefersHighContrast(),
    };
    
    const finalConfig: AccessibilityAnimationConfig = {
      respectReducedMotion: true,
      respectHighContrast: true,
      respectTransparency: true,
      disableHover: false,
      disableComplexAnimations: false,
      ...config,
    };

    let adaptedAnimation = { ...baseAnimation };

    // Apply reduced motion adaptations
    if (finalConfig.respectReducedMotion && userPreferences.reducedMotion) {
      adaptedAnimation = this.createReducedMotionVariant(adaptedAnimation);
    }

    // Apply high contrast adaptations
    if (finalConfig.respectHighContrast && userPreferences.highContrast) {
      adaptedAnimation = this.createHighContrastVariant(adaptedAnimation);
    }

    // Apply hover disable for touch devices
    if (finalConfig.disableHover || this.isTouchDevice()) {
      adaptedAnimation = this.disableHoverInteractions(adaptedAnimation);
    }

    // Apply custom duration if specified
    if (finalConfig.customDuration) {
      adaptedAnimation = this.applyCustomDuration(adaptedAnimation, finalConfig.customDuration);
    }

    // Disable complex animations if needed
    if (finalConfig.disableComplexAnimations) {
      adaptedAnimation = this.simplifyAnimation(adaptedAnimation);
    }

    return adaptedAnimation;
  }

  // Create reduced motion variant
  private static createReducedMotionVariant(baseAnimation: SafeAnimationProps): SafeAnimationProps {
    const reducedAnimation = { ...baseAnimation };

    // Remove or simplify transitions
    if (reducedAnimation.transition) {
      reducedAnimation.transition = {
        ...reducedAnimation.transition,
        duration: 0.01,
        ease: 'linear',
      };
    }

    // Remove interactive animations
    reducedAnimation.whileHover = undefined;
    reducedAnimation.whileTap = undefined;
    reducedAnimation.whileFocus = undefined;

    // Simplify variants
    if (reducedAnimation.variants) {
      const simplifiedVariants: Variants = {};
      
      Object.keys(reducedAnimation.variants).forEach(key => {
        const variant = reducedAnimation.variants![key];
        if (typeof variant === 'object' && variant !== null) {
          simplifiedVariants[key] = {
            ...variant,
            transition: { duration: 0.01 },
          };
        } else {
          simplifiedVariants[key] = variant;
        }
      });
      
      reducedAnimation.variants = simplifiedVariants;
    }

    // Set animate to match initial for no motion
    if (reducedAnimation.initial && reducedAnimation.animate) {
      reducedAnimation.animate = reducedAnimation.initial;
    }

    return reducedAnimation;
  }

  // Create high contrast variant
  private static createHighContrastVariant(baseAnimation: SafeAnimationProps): SafeAnimationProps {
    const highContrastAnimation = { ...baseAnimation };

    // Add high contrast styles
    const highContrastStyles = {
      border: '2px solid currentColor',
      filter: 'contrast(1.2)',
    };

    // Apply to all variants
    if (highContrastAnimation.variants) {
      const enhancedVariants: Variants = {};
      
      Object.keys(highContrastAnimation.variants).forEach(key => {
        const variant = highContrastAnimation.variants![key];
        if (typeof variant === 'object' && variant !== null) {
          enhancedVariants[key] = {
            ...variant,
            ...highContrastStyles,
          };
        } else {
          enhancedVariants[key] = variant;
        }
      });
      
      highContrastAnimation.variants = enhancedVariants;
    }

    // Apply to direct animation props
    if (highContrastAnimation.animate && typeof highContrastAnimation.animate === 'object') {
      highContrastAnimation.animate = {
        ...highContrastAnimation.animate,
        ...highContrastStyles,
      };
    }

    return highContrastAnimation;
  }

  // Disable hover interactions
  private static disableHoverInteractions(baseAnimation: SafeAnimationProps): SafeAnimationProps {
    const noHoverAnimation = { ...baseAnimation };
    noHoverAnimation.whileHover = undefined;
    noHoverAnimation.whileTap = undefined;
    return noHoverAnimation;
  }

  // Apply custom duration
  private static applyCustomDuration(
    baseAnimation: SafeAnimationProps,
    duration: number
  ): SafeAnimationProps {
    const customDurationAnimation = { ...baseAnimation };

    if (customDurationAnimation.transition) {
      customDurationAnimation.transition = {
        ...customDurationAnimation.transition,
        duration,
      };
    }

    // Apply to variants
    if (customDurationAnimation.variants) {
      const durationVariants: Variants = {};
      
      Object.keys(customDurationAnimation.variants).forEach(key => {
        const variant = customDurationAnimation.variants![key];
        if (typeof variant === 'object' && variant !== null && variant.transition) {
          durationVariants[key] = {
            ...variant,
            transition: {
              ...variant.transition,
              duration,
            },
          };
        } else {
          durationVariants[key] = variant;
        }
      });
      
      customDurationAnimation.variants = durationVariants;
    }

    return customDurationAnimation;
  }

  // Simplify complex animations
  private static simplifyAnimation(baseAnimation: SafeAnimationProps): SafeAnimationProps {
    const simplifiedAnimation = { ...baseAnimation };

    // Remove complex properties
    if (simplifiedAnimation.variants) {
      const simpleVariants: Variants = {};
      
      Object.keys(simplifiedAnimation.variants).forEach(key => {
        const variant = simplifiedAnimation.variants![key];
        if (typeof variant === 'object' && variant !== null) {
          // Keep only opacity and transform properties
          const simpleVariant: TargetAndTransition = {};
          
          if (variant.opacity !== undefined) simpleVariant.opacity = variant.opacity;
          if (variant.x !== undefined) simpleVariant.x = variant.x;
          if (variant.y !== undefined) simpleVariant.y = variant.y;
          if (variant.scale !== undefined) simpleVariant.scale = variant.scale;
          if (variant.transition !== undefined) simpleVariant.transition = variant.transition;
          
          simpleVariants[key] = simpleVariant;
        } else {
          simpleVariants[key] = variant;
        }
      });
      
      simplifiedAnimation.variants = simpleVariants;
    }

    return simplifiedAnimation;
  }

  // Check if device is touch-enabled
  private static isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error - for older browsers
      (navigator as unknown as { msMaxTouchPoints?: number }).msMaxTouchPoints > 0
    );
  }

  // Check if animation is safe for accessibility
  static isAnimationSafe(
    animation: SafeAnimationProps,
    preferences?: { reducedMotion: boolean; highContrast: boolean }
  ): {
    isSafe: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    const userPreferences = preferences || {
      reducedMotion: prefersReducedMotion(),
      highContrast: prefersHighContrast(),
    };

    // Check for reduced motion concerns
    if (userPreferences.reducedMotion) {
      if (animation.whileHover || animation.whileTap) {
        issues.push('Interactive animations detected with reduced motion preference');
        recommendations.push('Consider disabling hover/tap animations for reduced motion users');
      }

      if (animation.transition && 'duration' in animation.transition && animation.transition.duration && animation.transition.duration > 0.1) {
        issues.push('Animation duration may be too long for reduced motion preference');
        recommendations.push('Reduce animation duration to under 0.1s or disable animations');
      }
    }

    // Check for high contrast concerns
    if (userPreferences.highContrast) {
      if (animation.variants) {
        const hasColorChanges = Object.values(animation.variants).some(variant => {
          if (typeof variant === 'object' && variant !== null) {
            return variant.color !== undefined || variant.backgroundColor !== undefined;
          }
          return false;
        });

        if (hasColorChanges) {
          issues.push('Color changes detected with high contrast preference');
          recommendations.push('Ensure sufficient contrast or use border indicators instead');
        }
      }
    }

    // Check for complex animations
    if (animation.variants) {
      const hasComplexProperties = Object.values(animation.variants).some(variant => {
        if (typeof variant === 'object' && variant !== null) {
          const complexProps = ['filter', 'backdropFilter', 'clipPath', 'mask'];
          return complexProps.some(prop => (variant as Record<string, unknown>)[prop] !== undefined);
        }
        return false;
      });

      if (hasComplexProperties) {
        issues.push('Complex animation properties detected');
        recommendations.push('Consider simplifying animations for better accessibility');
      }
    }

    return {
      isSafe: issues.length === 0,
      issues,
      recommendations,
    };
  }
}

// Safe animation props generator
export function createSafeAnimationProps(
  baseProps: SafeAnimationProps,
  config?: Partial<AccessibilityAnimationConfig>
): SafeAnimationProps {
  return AccessibilityAnimationAdapter.adaptAnimation(baseProps, config);
}

// Hook for accessible animations
export function useAccessibleAnimation(
  baseAnimation: SafeAnimationProps,
  config?: Partial<AccessibilityAnimationConfig>,
  preferences?: { reducedMotion: boolean; highContrast: boolean }
): SafeAnimationProps {
  return AccessibilityAnimationAdapter.adaptAnimation(baseAnimation, config, preferences);
}

// Animation accessibility checker
export function checkAnimationAccessibility(
  animation: SafeAnimationProps,
  preferences?: { reducedMotion: boolean; highContrast: boolean }
): {
  isSafe: boolean;
  issues: string[];
  recommendations: string[];
} {
  return AccessibilityAnimationAdapter.isAnimationSafe(animation, preferences);
}

// Create accessible variants
export function createAccessibleVariants(
  baseVariants: Variants,
  reducedVariants?: Variants,
  preferences?: { reducedMotion: boolean }
): Variants {
  const userPreferences = preferences || {
    reducedMotion: prefersReducedMotion(),
  };
  
  if (userPreferences.reducedMotion && reducedVariants) {
    return reducedVariants;
  }
  
  return baseVariants;
}

// Get safe animation duration
export function getSafeAnimationDuration(
  baseDuration: number,
  respectReducedMotion: boolean = true
): number {
  if (respectReducedMotion && typeof window !== 'undefined') {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      return Math.min(baseDuration, ANIMATION_DURATIONS.instant);
    }
  }
  
  return baseDuration;
}

// Create accessible transition
export function createAccessibleTransition(
  baseTransition: Transition,
  respectReducedMotion: boolean = true
): Transition {
  const safeDuration = getSafeAnimationDuration(
    baseTransition.duration || ANIMATION_DURATIONS.normal,
    respectReducedMotion
  );
  
  return {
    ...baseTransition,
    duration: safeDuration,
    ease: respectReducedMotion && typeof window !== 'undefined' &&
           window.matchMedia('(prefers-reduced-motion: reduce)').matches
           ? 'linear'
           : baseTransition.ease,
  };
}

// Export default adapter
export default AccessibilityAnimationAdapter;