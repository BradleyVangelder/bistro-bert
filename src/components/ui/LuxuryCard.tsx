/**
 * Premium luxury card component with sophisticated animations
 * Features staggered entrance animations, hover effects, and content reveals
 */

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionProps } from 'framer-motion';
import { 
  ANIMATION_DURATIONS, 
  ANIMATION_DELAYS, 
  EASING, 
  SCALES 
} from '@/utils/animations/constants';
import { 
  createSafeAnimationProps,
  AccessibilityAnimationConfig 
} from '@/utils/animations/accessibility';
import { performanceMonitor } from '@/utils/animations/performance';

// Luxury card variants
export type LuxuryCardVariant = 
  | 'elegant'
  | 'premium'
  | 'exclusive'
  | 'minimalist'
  | 'showcase';

// Luxury card props
export interface LuxuryCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: LuxuryCardVariant;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  price?: string;
  features?: string[];
  index?: number;
  staggerDelay?: number;
  enableHover?: boolean;
  enableParallax?: boolean;
  enableGlow?: boolean;
  onAnimationComplete?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onClick?: () => void;
  accessibilityConfig?: Partial<AccessibilityAnimationConfig>;
  enablePerformanceMonitoring?: boolean;
}

// Card element props for staggered animations
interface CardElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  duration?: number;
}

// Staggered card element component
const CardElement: React.FC<CardElementProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = ANIMATION_DURATIONS.normal,
}) => {
  const getVariants = () => {
    const transition = {
      duration: duration / 1000,
      delay: delay / 1000,
      ease: EASING.luxury as unknown as any,
    };

    switch (direction) {
      case 'up':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0, transition },
        };
      case 'down':
        return {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0, transition },
        };
      case 'left':
        return {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0, transition },
        };
      case 'right':
        return {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0, transition },
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1, transition },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition },
        };
    }
  };

  return (
    <motion.div
      className={className}
      variants={getVariants()}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

// Main Luxury Card Component
export const LuxuryCard: React.FC<LuxuryCardProps> = ({
  children,
  className = '',
  variant = 'elegant',
  title,
  subtitle,
  description,
  image,
  imageAlt,
  badge,
  price,
  features,
  index = 0,
  staggerDelay = ANIMATION_DELAYS.sequential,
  enableHover = true,
  enableParallax = false,
  enableGlow = false,
  onAnimationComplete,
  onHoverStart,
  onHoverEnd,
  onClick,
  accessibilityConfig,
  enablePerformanceMonitoring = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const animationName = `luxury-card-${variant}-${index}-${Date.now()}`;

  // Parallax effect values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [5, -5]));
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-5, 5]));

  // Handle mouse move for parallax
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableParallax || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (enableParallax) {
      mouseX.set(0);
      mouseY.set(0);
    }
    setIsHovered(false);
    onHoverEnd?.();
  };

  // Performance monitoring
  React.useEffect(() => {
    if (enablePerformanceMonitoring) {
      performanceMonitor.startMonitoring(animationName, 'important');
      
      return () => {
        performanceMonitor.stopMonitoring(animationName);
      };
    }
  }, [enablePerformanceMonitoring, animationName]);

  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: isHovered 
            ? '0 25px 50px rgba(212, 175, 55, 0.2), 0 0 30px rgba(212, 175, 55, 0.1)' 
            : '0 10px 30px rgba(0, 0, 0, 0.3)',
        };
      case 'exclusive':
        return {
          background: 'linear-gradient(135deg, #2d1b1b 0%, #4a2c2c 100%)',
          border: '1px solid rgba(212, 175, 55, 0.5)',
          boxShadow: isHovered 
            ? '0 30px 60px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.15)' 
            : '0 15px 40px rgba(0, 0, 0, 0.4)',
        };
      case 'minimalist':
        return {
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: isHovered 
            ? '0 20px 40px rgba(0, 0, 0, 0.1)' 
            : '0 5px 20px rgba(0, 0, 0, 0.05)',
        };
      case 'showcase':
        return {
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          boxShadow: isHovered 
            ? '0 35px 70px rgba(212, 175, 55, 0.25), 0 0 50px rgba(212, 175, 55, 0.2)' 
            : '0 20px 45px rgba(0, 0, 0, 0.5)',
        };
      case 'elegant':
      default:
        return {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          boxShadow: isHovered 
            ? '0 20px 40px rgba(212, 175, 55, 0.15), 0 0 25px rgba(212, 175, 55, 0.1)' 
            : '0 10px 30px rgba(0, 0, 0, 0.3)',
        };
    }
  };

  // Card animation variants
  const cardVariants = {
    initial: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      filter: 'blur(2px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: ANIMATION_DURATIONS.showcase / 1000,
        ease: EASING.luxury as unknown as any,
        delay: (index * staggerDelay) / 1000,
      },
    },
    hover: enableHover ? {
      y: -10,
      scale: 1.02,
      transition: {
        duration: ANIMATION_DURATIONS.fast / 1000,
        ease: EASING.graceful as unknown as any,
      },
    } : {},
  };

  return (
    <motion.div
      ref={cardRef}
      className={`luxury-card ${className}`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={enableHover ? "hover" : undefined}
      onAnimationComplete={onAnimationComplete}
      style={{
        ...getVariantStyles(),
        transform: enableParallax ? `perspective(1000px) rotateX(${rotateX.get()}deg) rotateY(${rotateY.get()}deg)` : undefined,
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHoverStart?.();
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className="luxury-card-content">
        {/* Badge */}
        {badge && (
          <CardElement
            className="luxury-card-badge"
            delay={index * staggerDelay + 100}
            direction="scale"
            duration={ANIMATION_DURATIONS.fast}
          >
            <span className="badge-text">{badge}</span>
          </CardElement>
        )}

        {/* Image */}
        {image && (
          <CardElement
            className="luxury-card-image"
            delay={index * staggerDelay + 200}
            direction="up"
            duration={ANIMATION_DURATIONS.normal}
          >
            <img 
              src={image} 
              alt={imageAlt || title || 'Luxury card image'}
              className="card-image"
            />
            {enableGlow && isHovered && (
              <motion.div
                className="image-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </CardElement>
        )}

        {/* Content */}
        <div className="luxury-card-body">
          {/* Title */}
          {title && (
            <CardElement
              className="luxury-card-title"
              delay={index * staggerDelay + 300}
              direction="left"
              duration={ANIMATION_DURATIONS.normal}
            >
              <h3 className="title-text">{title}</h3>
            </CardElement>
          )}

          {/* Subtitle */}
          {subtitle && (
            <CardElement
              className="luxury-card-subtitle"
              delay={index * staggerDelay + 400}
              direction="left"
              duration={ANIMATION_DURATIONS.normal}
            >
              <p className="subtitle-text">{subtitle}</p>
            </CardElement>
          )}

          {/* Description */}
          {description && (
            <CardElement
              className="luxury-card-description"
              delay={index * staggerDelay + 500}
              direction="up"
              duration={ANIMATION_DURATIONS.normal}
            >
              <p className="description-text">{description}</p>
            </CardElement>
          )}

          {/* Features */}
          {features && features.length > 0 && (
            <CardElement
              className="luxury-card-features"
              delay={index * staggerDelay + 600}
              direction="up"
              duration={ANIMATION_DURATIONS.normal}
            >
              <ul className="features-list">
                {features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: (index * staggerDelay + 600 + featureIndex * 50) / 1000,
                      duration: ANIMATION_DURATIONS.fast / 1000,
                    }}
                  >
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </CardElement>
          )}

          {/* Price */}
          {price && (
            <CardElement
              className="luxury-card-price"
              delay={index * staggerDelay + 700}
              direction="scale"
              duration={ANIMATION_DURATIONS.fast}
            >
              <span className="price-text">{price}</span>
            </CardElement>
          )}

          {/* Custom children */}
          {children && (
            <CardElement
              className="luxury-card-custom"
              delay={index * staggerDelay + 800}
              direction="fade"
              duration={ANIMATION_DURATIONS.normal}
            >
              {children}
            </CardElement>
          )}
        </div>
      </div>

      {/* Hover overlay for premium variants */}
      {isHovered && (variant === 'premium' || variant === 'exclusive' || variant === 'showcase') && (
        <motion.div
          className="luxury-card-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

// Luxury Card Grid Component
export interface LuxuryCardGridProps {
  cards: LuxuryCardProps[];
  className?: string;
  columns?: number;
  gap?: string;
  staggerDelay?: number;
  enablePerformanceMonitoring?: boolean;
}

export const LuxuryCardGrid: React.FC<LuxuryCardGridProps> = ({
  cards,
  className = '',
  columns = 3,
  gap = '2rem',
  staggerDelay = ANIMATION_DELAYS.sequential,
  enablePerformanceMonitoring = true,
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
  };

  return (
    <div 
      className={`luxury-card-grid ${className}`}
      style={gridStyle}
    >
      {cards.map((cardProps, index) => (
        <LuxuryCard
          key={index}
          {...cardProps}
          index={index}
          staggerDelay={staggerDelay}
          enablePerformanceMonitoring={enablePerformanceMonitoring}
        />
      ))}
    </div>
  );
};

export default LuxuryCard;