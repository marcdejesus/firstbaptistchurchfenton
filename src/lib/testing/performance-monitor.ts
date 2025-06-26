import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

interface PerformanceMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface BrowserInfo {
  name: string;
  version: string;
  userAgent: string;
  platform: string;
  isMobile: boolean;
  screenResolution: string;
  viewportSize: string;
  colorDepth: number;
  pixelRatio: number;
}

interface TestingReport {
  id: string;
  timestamp: number;
  url: string;
  browser: BrowserInfo;
  metrics: PerformanceMetric[];
  accessibility: {
    score: number;
    violations: any[];
    passed: number;
    failed: number;
  };
  userExperience: {
    navigationTiming: PerformanceTiming | null;
    resourceTiming: PerformanceResourceTiming[];
    memoryUsage?: any;
  };
}

class Phase6PerformanceMonitor {
  private static instance: Phase6PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private testingReports: TestingReport[] = [];
  private isMonitoring = false;

  static getInstance(): Phase6PerformanceMonitor {
    if (!Phase6PerformanceMonitor.instance) {
      Phase6PerformanceMonitor.instance = new Phase6PerformanceMonitor();
    }
    return Phase6PerformanceMonitor.instance;
  }

  /**
   * Initialize comprehensive performance monitoring for Phase 6 testing
   */
  startPhase6Testing(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🧪 Phase 6 Testing Started - Performance Monitoring Active');

    // Core Web Vitals monitoring
    this.monitorCoreWebVitals();
    
    // Browser compatibility detection
    this.detectBrowserInfo();
    
    // Performance observers
    this.setupPerformanceObservers();
    
    // Memory monitoring (if available)
    this.monitorMemoryUsage();
    
    // User interaction tracking
    this.trackUserInteractions();
  }

  /**
   * Monitor Core Web Vitals for Phase 6 optimization
   */
  private monitorCoreWebVitals(): void {
    const reportMetric = (metric: any) => {
      const performanceMetric: PerformanceMetric = {
        name: metric.name,
        value: metric.value,
        delta: metric.delta,
        id: metric.id,
        rating: metric.rating,
        timestamp: Date.now()
      };

      this.addMetric(metric.name, performanceMetric);
      this.logMetric(performanceMetric);
    };

    // Largest Contentful Paint
    onLCP(reportMetric);
    
    // Interaction to Next Paint (replaces FID)
    onINP(reportMetric);
    
    // Cumulative Layout Shift
    onCLS(reportMetric);
    
    // First Contentful Paint
    onFCP(reportMetric);
    
    // Time to First Byte
    onTTFB(reportMetric);
  }

  /**
   * Detect comprehensive browser information
   */
  private detectBrowserInfo(): BrowserInfo {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    const screen = window.screen;
    
    // Browser detection
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    
    if (ua.includes('Chrome') && !ua.includes('Chromium')) {
      browserName = 'Chrome';
      browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Firefox')) {
      browserName = 'Firefox';
      browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browserName = 'Safari';
      browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Edg')) {
      browserName = 'Edge';
      browserVersion = ua.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
    }

    const browserInfo: BrowserInfo = {
      name: browserName,
      version: browserVersion,
      userAgent: ua,
      platform: platform,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio
    };

    console.log('🌐 Browser Info Detected:', browserInfo);
    return browserInfo;
  }

  /**
   * Setup performance observers for detailed monitoring
   */
  private setupPerformanceObservers(): void {
    // Navigation timing
    if ('PerformanceObserver' in window) {
      try {
        // Navigation entries
        const navObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              console.log('📊 Navigation Timing:', entry);
            }
          });
        });
        navObserver.observe({ entryTypes: ['navigation'] });

        // Resource timing
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource') {
              this.analyzeResourceTiming(entry as PerformanceResourceTiming);
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });

        // Paint timing
        const paintObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.log(`🎨 ${entry.name}:`, entry.startTime);
          });
        });
        paintObserver.observe({ entryTypes: ['paint'] });

      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }
  }

  /**
   * Analyze resource timing for optimization opportunities
   */
  private analyzeResourceTiming(entry: PerformanceResourceTiming): void {
    const duration = entry.responseEnd - entry.startTime;
    const transferSize = entry.transferSize || 0;
    
    // Flag slow resources
    if (duration > 1000) {
      console.warn(`⚠️ Slow Resource (${duration.toFixed(2)}ms):`, entry.name);
    }
    
    // Flag large resources
    if (transferSize > 500000) { // 500KB
      console.warn(`⚠️ Large Resource (${(transferSize / 1024).toFixed(2)}KB):`, entry.name);
    }
    
    // Check for design system resources
    if (entry.name.includes('design-system') || entry.name.includes('css')) {
      console.log(`🎨 Design System Resource (${duration.toFixed(2)}ms, ${(transferSize / 1024).toFixed(2)}KB):`, entry.name);
    }
  }

  /**
   * Monitor memory usage if available
   */
  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('💾 Memory Usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      });
    }
  }

  /**
   * Track user interactions for usability testing
   */
  private trackUserInteractions(): void {
    let interactionCount = 0;
    
    const trackInteraction = (event: Event) => {
      interactionCount++;
      console.log(`👆 User Interaction #${interactionCount}:`, event.type, event.target);
    };

    ['click', 'scroll', 'keydown', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, trackInteraction, { passive: true });
    });
  }

  /**
   * Generate comprehensive testing report
   */
  generateTestingReport(): TestingReport {
    const report: TestingReport = {
      id: `test-${Date.now()}`,
      timestamp: Date.now(),
      url: window.location.href,
      browser: this.detectBrowserInfo(),
      metrics: Array.from(this.metrics.values()).flat(),
      accessibility: {
        score: 0, // Will be populated by accessibility tests
        violations: [],
        passed: 0,
        failed: 0
      },
      userExperience: {
        navigationTiming: performance.timing,
        resourceTiming: performance.getEntriesByType('resource') as PerformanceResourceTiming[],
        memoryUsage: (performance as any).memory || null
      }
    };

    this.testingReports.push(report);
    return report;
  }

  /**
   * Get performance recommendations
   */
  getOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    
    // Check Core Web Vitals
    const latestMetrics = this.getLatestMetrics();
    
    latestMetrics.forEach(metric => {
      switch (metric.name) {
        case 'LCP':
          if (metric.rating === 'poor') {
            recommendations.push('🚨 Optimize Largest Contentful Paint: Consider image optimization, server response times, and render-blocking resources');
          }
          break;
        case 'FID':
          if (metric.rating === 'poor') {
            recommendations.push('🚨 Improve First Input Delay: Reduce JavaScript execution time and break up long tasks');
          }
          break;
        case 'CLS':
          if (metric.rating === 'poor') {
            recommendations.push('🚨 Fix Cumulative Layout Shift: Ensure images have dimensions, avoid inserting content above existing content');
          }
          break;
      }
    });

    return recommendations;
  }

  /**
   * Cross-browser compatibility check
   */
  checkBrowserCompatibility(): { supported: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check for modern features used in design system
    if (!('IntersectionObserver' in window)) {
      issues.push('IntersectionObserver not supported - animations may not work');
    }
    
    if (!('ResizeObserver' in window)) {
      issues.push('ResizeObserver not supported - responsive components may have issues');
    }
    
    if (!CSS.supports('display', 'grid')) {
      issues.push('CSS Grid not supported - layout may be broken');
    }
    
    if (!CSS.supports('display', 'flex')) {
      issues.push('Flexbox not supported - layout will be broken');
    }

    return {
      supported: issues.length === 0,
      issues
    };
  }

  // Helper methods
  private addMetric(name: string, metric: PerformanceMetric): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(metric);
  }

  private logMetric(metric: PerformanceMetric): void {
    const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '🚨';
    console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
  }

  private getLatestMetrics(): PerformanceMetric[] {
    const latest: PerformanceMetric[] = [];
    
    this.metrics.forEach((metrics, name) => {
      if (metrics.length > 0) {
        latest.push(metrics[metrics.length - 1]);
      }
    });
    
    return latest;
  }

  /**
   * Export all collected data for analysis
   */
  exportTestingData(): {
    metrics: Map<string, PerformanceMetric[]>;
    reports: TestingReport[];
    recommendations: string[];
    compatibility: { supported: boolean; issues: string[] };
  } {
    return {
      metrics: this.metrics,
      reports: this.testingReports,
      recommendations: this.getOptimizationRecommendations(),
      compatibility: this.checkBrowserCompatibility()
    };
  }
}

export default Phase6PerformanceMonitor;
export type { PerformanceMetric, BrowserInfo, TestingReport }; 