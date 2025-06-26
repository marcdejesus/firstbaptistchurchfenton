"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

// Mobile-optimized touch target sizes
export const TOUCH_TARGET_SIZE = {
  minimum: '44px', // WCAG AA requirement
  recommended: '48px', // Better UX
  large: '56px', // For primary actions
};

// Mobile viewport utilities
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    function updateViewport() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    }

    updateViewport();
    window.addEventListener('resize', updateViewport);
    
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return viewport;
}

// Touch-friendly button component
interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function TouchButton({ children, size = 'md', className = '', ...props }: TouchButtonProps) {
  const sizeClasses = {
    sm: 'min-h-[44px] px-4 py-2 text-sm',
    md: 'min-h-[48px] px-6 py-3 text-base',
    lg: 'min-h-[56px] px-8 py-4 text-lg',
  };

  return (
    <Button
      className={`${sizeClasses[size]} touch-manipulation ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}

// Scroll to top button for mobile
export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 bg-accent hover:bg-accent-600 text-accent-foreground rounded-full p-3 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:ring-offset-2"
      style={{ minHeight: TOUCH_TARGET_SIZE.minimum, minWidth: TOUCH_TARGET_SIZE.minimum }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
}

// Mobile-optimized image component
interface MobileImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function MobileImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false, 
  className = '' 
}: MobileImageProps) {
  const viewport = useViewport();
  
  // Adjust image size based on viewport
  const getResponsiveSize = () => {
    if (viewport.isMobile) {
      return {
        width: Math.min(width || 400, viewport.width - 32),
        height: height ? Math.round((height * (viewport.width - 32)) / (width || 400)) : undefined,
      };
    }
    return { width, height };
  };

  const { width: responsiveWidth, height: responsiveHeight } = getResponsiveSize();

  return (
    <img
      src={src}
      alt={alt}
      width={responsiveWidth}
      height={responsiveHeight}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`max-w-full h-auto ${className}`}
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    />
  );
}

// Mobile-optimized form field
interface MobileFieldProps {
  label: string;
  type: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MobileField({
  label,
  type,
  id,
  placeholder,
  required = false,
  error,
  value,
  onChange,
}: MobileFieldProps) {
  return (
    <div className="space-y-2">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 text-base border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent
          ${error ? 'border-destructive' : 'border-input'}
          ${TOUCH_TARGET_SIZE.minimum}
        `}
        style={{ minHeight: TOUCH_TARGET_SIZE.minimum }}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      
      {error && (
        <p 
          id={`${id}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Mobile navigation hook
export function useMobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const viewport = useViewport();

  // Close mobile menu when viewport changes to desktop
  useEffect(() => {
    if (viewport.isDesktop && isOpen) {
      setIsOpen(false);
    }
  }, [viewport.isDesktop, isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen && viewport.isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, viewport.isMobile]);

  return {
    isOpen,
    setIsOpen,
    isMobile: viewport.isMobile,
    toggle: () => setIsOpen(!isOpen),
    close: () => setIsOpen(false),
  };
}

// Mobile-optimized card component
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
}

export function MobileCard({ 
  children, 
  className = '', 
  clickable = false, 
  onClick 
}: MobileCardProps) {
  const baseClasses = 'bg-card text-card-foreground rounded-lg border shadow-sm';
  const clickableClasses = clickable 
    ? 'cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent-600 focus:ring-offset-2' 
    : '';

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      className={`${baseClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      style={clickable ? { minHeight: TOUCH_TARGET_SIZE.minimum } : undefined}
    >
      {children}
    </Component>
  );
}

// Safe area utilities for mobile devices
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    function updateSafeArea() {
      const computedStyle = getComputedStyle(document.documentElement);
      
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
      });
    }

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    
    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  return safeArea;
}

// Mobile performance optimization
export function MobilePerformanceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Reduce motion for users who prefer it
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQuery.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }

    // Optimize touch events
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
    
    // Prevent zoom on double tap for form inputs
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

  }, []);

  return <>{children}</>;
} 