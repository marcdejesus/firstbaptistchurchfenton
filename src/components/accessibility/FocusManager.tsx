"use client";

import React, { useEffect, useRef } from 'react';

// Skip link component for keyboard navigation
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-accent text-accent-foreground px-4 py-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent-600"
    >
      Skip to main content
    </a>
  );
}

// Focus trap for modals and dialogs
interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  restoreFocus?: boolean;
}

export function FocusTrap({ children, active, restoreFocus = true }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    // Store the previously focused element
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    // Get all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus the first element
    if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      
      // Restore focus to the previously focused element
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, restoreFocus]);

  return (
    <div ref={containerRef} className="focus-trap">
      {children}
    </div>
  );
}

// Screen reader announcements
interface AnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
  id?: string;
}

export function ScreenReaderAnnouncement({ message, priority = 'polite', id }: AnnouncementProps) {
  return (
    <div
      id={id}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Live region for dynamic content updates
export function LiveRegion({ children, priority = 'polite' }: { 
  children: React.ReactNode; 
  priority?: 'polite' | 'assertive' 
}) {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

// Focus management hook
export function useFocusManagement() {
  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  };

  const focusFirstError = () => {
    const firstError = document.querySelector('[aria-invalid="true"]') as HTMLElement;
    if (firstError) {
      firstError.focus();
    }
  };

  const focusHeading = () => {
    const heading = document.querySelector('h1, h2') as HTMLElement;
    if (heading) {
      heading.focus();
    }
  };

  return {
    focusElement,
    focusFirstError,
    focusHeading,
  };
}

// Visually hidden component for screen readers
export function VisuallyHidden({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className="sr-only"
      {...props}
    >
      {children}
    </span>
  );
}

// Accessible button with proper ARIA attributes
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

export function AccessibleButton({ 
  children, 
  loading = false, 
  loadingText = 'Loading...', 
  disabled,
  ...props 
}: AccessibleButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-describedby={loading ? 'loading-description' : undefined}
    >
      {loading ? (
        <>
          <VisuallyHidden id="loading-description">
            {loadingText}
          </VisuallyHidden>
          <span aria-hidden="true">{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Accessible form field with proper labeling
interface AccessibleFieldProps {
  label: string;
  id: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: React.ReactElement;
}

export function AccessibleField({ 
  label, 
  id, 
  error, 
  description, 
  required = false, 
  children 
}: AccessibleFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;
  const describedBy = [errorId, descriptionId].filter(Boolean).join(' ');

  return (
    <div className="space-y-2">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {React.cloneElement(children, {
        id,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': error ? 'true' : 'false',
        'aria-required': required,
      })}
      
      {error && (
        <p 
          id={errorId} 
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Keyboard navigation helper
export function useKeyboardNavigation() {
  const handleKeyDown = (event: React.KeyboardEvent, actions: Record<string, () => void>) => {
    const action = actions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };

  const handleArrowNavigation = (
    event: React.KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onNavigate: (index: number) => void
  ) => {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    onNavigate(newIndex);
    items[newIndex]?.focus();
  };

  return {
    handleKeyDown,
    handleArrowNavigation,
  };
} 