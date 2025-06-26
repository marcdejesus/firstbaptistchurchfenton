// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Mark the start of a performance measurement
  mark(name: string): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-start`);
    }
  }

  // Mark the end and measure the duration
  measure(name: string): number {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      const duration = measure?.duration || 0;
      
      this.metrics.set(name, duration);
      
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    }
    return 0;
  }

  // Get all metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Clear all metrics
  clear(): void {
    this.metrics.clear();
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}

// Web Vitals monitoring
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // In production, you might want to send to analytics
    console.log(metric);
  } else {
    // Development logging
    console.log(`Web Vital: ${metric.name}`, metric);
  }
}

// Image optimization utilities
export function getOptimizedImageProps(src: string, alt: string, width?: number, height?: number) {
  return {
    src,
    alt,
    width,
    height,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    style: {
      maxWidth: '100%',
      height: 'auto',
    },
  };
}

// Lazy loading utilities
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Resource preloading
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  
  document.head.appendChild(link);
}

// Critical CSS inlining check
export function isCriticalCSS(): boolean {
  return typeof window !== 'undefined' && window.innerWidth <= 1024;
}

// Bundle size monitoring
export function logBundleSize() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const domContentLoadedTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        
        console.log('Performance Metrics:', {
          loadTime: `${loadTime.toFixed(2)}ms`,
          domContentLoadedTime: `${domContentLoadedTime.toFixed(2)}ms`,
          transferSize: navigation.transferSize ? `${(navigation.transferSize / 1024).toFixed(2)}KB` : 'N/A',
        });
      }
    });
  }
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
    const memory = (performance as any).memory;
    
    return {
      usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
      totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
      jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`,
    };
  }
  
  return null;
}

// Service Worker registration
export function registerServiceWorker() {
  if (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    process.env.NODE_ENV === 'production'
  ) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// Critical resource hints
export function addResourceHints() {
  if (typeof document === 'undefined') return;

  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    Object.assign(link, hint);
    document.head.appendChild(link);
  });
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  if (typeof window !== 'undefined') {
    // Add resource hints
    addResourceHints();
    
    // Log bundle size
    logBundleSize();
    
    // Register service worker
    registerServiceWorker();
    
    // Monitor memory usage periodically in development
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => {
        const memoryUsage = monitorMemoryUsage();
        if (memoryUsage) {
          console.log('Memory Usage:', memoryUsage);
        }
      }, 30000); // Every 30 seconds
    }
  }
} 