interface AnalyticsConfig {
  googleAnalyticsId?: string;
  googleSearchConsoleId?: string;
  facebookPixelId?: string;
  hotjarId?: string;
  enablePerformanceTracking: boolean;
  enableErrorTracking: boolean;
  enableUserTracking: boolean;
  environment: 'development' | 'staging' | 'production';
}

interface AnalyticsEvent {
  name: string;
  category: 'navigation' | 'engagement' | 'conversion' | 'error' | 'performance';
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  interactionToNextPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalBlockingTime: number;
}

interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'javascript' | 'network' | 'performance' | 'accessibility';
  userId?: string;
  sessionId: string;
  additionalData?: Record<string, any>;
}

class Phase7AnalyticsManager {
  private static instance: Phase7AnalyticsManager;
  private config: AnalyticsConfig;
  private events: AnalyticsEvent[] = [];
  private errors: ErrorReport[] = [];
  private sessionId: string;
  private initialized: boolean = false;

  static getInstance(): Phase7AnalyticsManager {
    if (!Phase7AnalyticsManager.instance) {
      Phase7AnalyticsManager.instance = new Phase7AnalyticsManager();
    }
    return Phase7AnalyticsManager.instance;
  }

  constructor() {
    this.sessionId = this.generateSessionId();
    this.config = {
      enablePerformanceTracking: true,
      enableErrorTracking: true,
      enableUserTracking: true,
      environment: 'production'
    };
  }

  /**
   * Initialize analytics tracking for production launch
   */
  async initialize(config: Partial<AnalyticsConfig> = {}): Promise<void> {
    this.config = { ...this.config, ...config };
    
    console.log('📊 Initializing Phase 7 Analytics Manager...');
    
    try {
      // Initialize Google Analytics 4
      if (this.config.googleAnalyticsId) {
        await this.initializeGoogleAnalytics();
      }

      // Initialize performance monitoring
      if (this.config.enablePerformanceTracking) {
        this.initializePerformanceTracking();
      }

      // Initialize error tracking
      if (this.config.enableErrorTracking) {
        this.initializeErrorTracking();
      }

      // Initialize user interaction tracking
      if (this.config.enableUserTracking) {
        this.initializeUserTracking();
      }

      // Track initial page load
      this.trackEvent({
        name: 'page_view',
        category: 'navigation',
        action: 'initial_load',
        label: typeof window !== 'undefined' ? window.location.pathname : '/',
        timestamp: Date.now()
      });

      this.initialized = true;
      console.log('✅ Analytics Manager initialized successfully');
      
    } catch (error) {
      console.error('❌ Analytics initialization failed:', error);
      this.reportError({
        message: 'Analytics initialization failed',
        stack: error instanceof Error ? error.stack : undefined,
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        timestamp: Date.now(),
        severity: 'high',
        category: 'javascript',
        sessionId: this.sessionId,
        additionalData: { config: this.config }
      });
    }
  }

  /**
   * Initialize Google Analytics 4
   */
  private async initializeGoogleAnalytics(): Promise<void> {
    if (!this.config.googleAnalyticsId || typeof window === 'undefined') return;

    try {
      // Load GA4 script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalyticsId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      const gtag = (...args: any[]) => {
        window.dataLayer.push(args);
      };

      gtag('js', new Date());
      gtag('config', this.config.googleAnalyticsId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true,
        anonymize_ip: true, // GDPR compliance
        cookie_flags: 'SameSite=Strict;Secure', // Enhanced privacy
      });

      // Track church-specific events
      gtag('config', this.config.googleAnalyticsId, {
        custom_map: {
          'custom_parameter_1': 'ministry_interest',
          'custom_parameter_2': 'service_attendance',
          'custom_parameter_3': 'event_participation'
        }
      });

      console.log('📈 Google Analytics 4 initialized');
    } catch (error) {
      console.error('❌ Google Analytics initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize performance tracking with Web Vitals
   */
  private initializePerformanceTracking(): void {
    if (typeof window === 'undefined') return;

    try {
      // Track Core Web Vitals
      this.trackCoreWebVitals();

      // Track navigation timing
      this.trackNavigationTiming();

      // Track resource loading
      this.trackResourceTiming();

      // Monitor long tasks
      this.monitorLongTasks();

      console.log('⚡ Performance tracking initialized');
    } catch (error) {
      console.error('❌ Performance tracking initialization failed:', error);
    }
  }

  /**
   * Track Core Web Vitals metrics
   */
  private async trackCoreWebVitals(): Promise<void> {
    try {
      // Import web-vitals dynamically if available
      const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals');

      onCLS((metric) => {
        this.trackEvent({
          name: 'core_web_vital',
          category: 'performance',
          action: 'cls_measured',
          value: Math.round(metric.value * 1000), // Convert to milliseconds
          timestamp: Date.now(),
          metadata: { 
            id: metric.id,
            delta: metric.delta,
            entries: metric.entries.length
          }
        });
      });

      onFCP((metric) => {
        this.trackEvent({
          name: 'core_web_vital',
          category: 'performance',
          action: 'fcp_measured',
          value: Math.round(metric.value),
          timestamp: Date.now(),
          metadata: { 
            id: metric.id,
            delta: metric.delta
          }
        });
      });

      onINP((metric) => {
        this.trackEvent({
          name: 'core_web_vital',
          category: 'performance',
          action: 'inp_measured',
          value: Math.round(metric.value),
          timestamp: Date.now(),
          metadata: { 
            id: metric.id,
            delta: metric.delta
          }
        });
      });

      onLCP((metric) => {
        this.trackEvent({
          name: 'core_web_vital',
          category: 'performance',
          action: 'lcp_measured',
          value: Math.round(metric.value),
          timestamp: Date.now(),
          metadata: { 
            id: metric.id,
            delta: metric.delta
          }
        });
      });

      onTTFB((metric) => {
        this.trackEvent({
          name: 'core_web_vital',
          category: 'performance',
          action: 'ttfb_measured',
          value: Math.round(metric.value),
          timestamp: Date.now(),
          metadata: { 
            id: metric.id,
            delta: metric.delta
          }
        });
      });

    } catch (error) {
      console.warn('⚠️ Web Vitals library not available, using fallback performance tracking');
      this.trackBasicPerformanceMetrics();
    }
  }

  /**
   * Track basic performance metrics as fallback
   */
  private trackBasicPerformanceMetrics(): void {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.trackEvent({
        name: 'page_performance',
        category: 'performance',
        action: 'navigation_timing',
        value: Math.round(navigation.loadEventEnd - navigation.fetchStart),
        timestamp: Date.now(),
        metadata: {
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
          domInteractive: Math.round(navigation.domInteractive - navigation.fetchStart),
          firstByte: Math.round(navigation.responseStart - navigation.fetchStart)
        }
      });
    }
  }

  /**
   * Track navigation timing
   */
  private trackNavigationTiming(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics = {
            pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstByte: navigation.responseStart - navigation.fetchStart,
            domInteractive: navigation.domInteractive - navigation.fetchStart,
            resourcesLoaded: navigation.loadEventStart - navigation.domContentLoadedEventEnd
          };

          Object.entries(metrics).forEach(([name, value]) => {
            this.trackEvent({
              name: 'navigation_timing',
              category: 'performance',
              action: name,
              value: Math.round(value),
              timestamp: Date.now()
            });
          });
        }
      }, 1000); // Wait 1 second after load to ensure all metrics are available
    });
  }

  /**
   * Track resource loading performance
   */
  private trackResourceTiming(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 100) { // Only track slow resources
          this.trackEvent({
            name: 'resource_timing',
            category: 'performance',
            action: 'slow_resource',
            label: entry.name,
            value: Math.round(entry.duration),
            timestamp: Date.now(),
            metadata: {
              type: (entry as PerformanceResourceTiming).initiatorType,
              size: (entry as PerformanceResourceTiming).transferSize,
              cached: (entry as PerformanceResourceTiming).transferSize === 0
            }
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * Monitor long tasks that block the main thread
   */
  private monitorLongTasks(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.trackEvent({
            name: 'long_task',
            category: 'performance',
            action: 'main_thread_blocked',
            value: Math.round(entry.duration),
            timestamp: Date.now(),
            metadata: {
              startTime: entry.startTime,
              attribution: (entry as any).attribution?.[0]?.name
            }
          });
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.warn('⚠️ Long task monitoring not supported');
    }
  }

  /**
   * Initialize comprehensive error tracking
   */
  private initializeErrorTracking(): void {
    if (typeof window === 'undefined') return;

    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        severity: 'high',
        category: 'javascript',
        sessionId: this.sessionId,
        additionalData: {
          lineno: event.lineno,
          colno: event.colno,
          source: event.error?.name
        }
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: `Unhandled promise rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        severity: 'medium',
        category: 'javascript',
        sessionId: this.sessionId,
        additionalData: {
          type: 'unhandledrejection',
          reason: event.reason
        }
      });
    });

    // Network errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          this.reportError({
            message: `Network error: ${response.status} ${response.statusText}`,
            url: typeof args[0] === 'string' ? args[0] : (args[0] as Request).url,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            severity: response.status >= 500 ? 'high' : 'medium',
            category: 'network',
            sessionId: this.sessionId,
            additionalData: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries())
            }
          });
        }
        return response;
      } catch (error) {
        this.reportError({
          message: `Fetch error: ${error}`,
          stack: error instanceof Error ? error.stack : undefined,
          url: typeof args[0] === 'string' ? args[0] : (args[0] as Request).url,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          severity: 'high',
          category: 'network',
          sessionId: this.sessionId,
          additionalData: { error: error instanceof Error ? error.message : error }
        });
        throw error;
      }
    };

    console.log('🚨 Error tracking initialized');
  }

  /**
   * Initialize user interaction tracking
   */
  private initializeUserTracking(): void {
    if (typeof window === 'undefined') return;

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent({
        name: 'page_visibility',
        category: 'engagement',
        action: document.hidden ? 'hidden' : 'visible',
        timestamp: Date.now()
      });
    });

    // Track scroll depth
    let maxScrollPercentage = 0;
    const trackScrollDepth = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercentage > maxScrollPercentage) {
        maxScrollPercentage = scrollPercentage;
        
        // Track milestone percentages
        const milestones = [25, 50, 75, 90, 100];
        const milestone = milestones.find(m => scrollPercentage >= m && maxScrollPercentage < m);
        
        if (milestone) {
          this.trackEvent({
            name: 'scroll_depth',
            category: 'engagement',
            action: 'scroll_milestone',
            value: milestone,
            timestamp: Date.now()
          });
        }
      }
    };

    window.addEventListener('scroll', trackScrollDepth, { passive: true });

    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime;
      this.trackEvent({
        name: 'time_on_page',
        category: 'engagement',
        action: 'session_duration',
        value: Math.round(timeOnPage / 1000), // Convert to seconds
        timestamp: Date.now()
      });
    });

    // Track church-specific interactions
    this.trackChurchInteractions();

    console.log('👤 User interaction tracking initialized');
  }

  /**
   * Track church-specific user interactions
   */
  private trackChurchInteractions(): void {
    if (typeof document === 'undefined') return;

    // Prayer request submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      if (form.matches('[data-form="prayer-request"]')) {
        this.trackEvent({
          name: 'prayer_request_submitted',
          category: 'conversion',
          action: 'form_submission',
          label: 'prayer_request',
          timestamp: Date.now()
        });
      }
    });

    // Newsletter signups
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      if (form.matches('[data-form="newsletter"]')) {
        this.trackEvent({
          name: 'newsletter_signup',
          category: 'conversion',
          action: 'form_submission',
          label: 'newsletter',
          timestamp: Date.now()
        });
      }
    });

    // Event RSVP
    document.addEventListener('click', (event) => {
      const button = event.target as HTMLElement;
      if (button.matches('[data-action="rsvp"]')) {
        this.trackEvent({
          name: 'event_rsvp',
          category: 'engagement',
          action: 'rsvp_click',
          label: button.dataset.eventId || 'unknown',
          timestamp: Date.now()
        });
      }
    });

    // Sermon downloads/plays
    document.addEventListener('click', (event) => {
      const button = event.target as HTMLElement;
      if (button.matches('[data-action="play-sermon"]')) {
        this.trackEvent({
          name: 'sermon_played',
          category: 'engagement',
          action: 'media_interaction',
          label: button.dataset.sermonId || 'unknown',
          timestamp: Date.now()
        });
      }
    });

    // Donation button clicks
    document.addEventListener('click', (event) => {
      const button = event.target as HTMLElement;
      if (button.matches('[data-action="donate"]')) {
        this.trackEvent({
          name: 'donation_intent',
          category: 'conversion',
          action: 'donate_button_click',
          timestamp: Date.now()
        });
      }
    });

    // Ministry interest tracking
    document.addEventListener('click', (event) => {
      const link = event.target as HTMLElement;
      if (link.matches('[data-ministry]')) {
        this.trackEvent({
          name: 'ministry_interest',
          category: 'engagement',
          action: 'ministry_page_visit',
          label: link.dataset.ministry || 'unknown',
          timestamp: Date.now()
        });
      }
    });
  }

  /**
   * Track custom events
   */
  trackEvent(event: Omit<AnalyticsEvent, 'timestamp'> & { timestamp?: number }): void {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: event.timestamp || Date.now()
    };

    this.events.push(fullEvent);

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', fullEvent.action, {
        event_category: fullEvent.category,
        event_label: fullEvent.label,
        value: fullEvent.value,
        custom_parameter_1: fullEvent.metadata?.ministry_interest,
        custom_parameter_2: fullEvent.metadata?.service_attendance,
        custom_parameter_3: fullEvent.metadata?.event_participation
      });
    }

    // Log in development
    if (this.config.environment === 'development') {
      console.log('📊 Event tracked:', fullEvent);
    }
  }

  /**
   * Report errors
   */
  reportError(error: Omit<ErrorReport, 'id'>): void {
    const fullError: ErrorReport = {
      id: this.generateErrorId(),
      ...error
    };

    this.errors.push(fullError);

    // Send to Google Analytics as exception
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'exception', {
        description: fullError.message,
        fatal: fullError.severity === 'critical'
      });
    }

    // Log critical errors immediately
    if (fullError.severity === 'critical') {
      console.error('🚨 CRITICAL ERROR:', fullError);
    }

    // In production, you might want to send to a dedicated error tracking service
    if (this.config.environment === 'production') {
      this.sendErrorToService(fullError);
    }
  }

  /**
   * Send error to external service (placeholder)
   */
  private async sendErrorToService(error: ErrorReport): Promise<void> {
    try {
      // This would integrate with services like Sentry, LogRocket, etc.
      console.log('📡 Sending error to monitoring service:', error.id);
    } catch (sendError) {
      console.error('❌ Failed to send error to monitoring service:', sendError);
    }
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): {
    eventsTracked: number;
    errorsReported: number;
    sessionDuration: number;
    topEvents: Array<{ name: string; count: number }>;
    errorsByCategory: Record<string, number>;
    performanceScore: number;
  } {
    const now = Date.now();
    const sessionStart = now - (this.events[0]?.timestamp || now);

    // Count events by name
    const eventCounts: Record<string, number> = {};
    this.events.forEach(event => {
      eventCounts[event.name] = (eventCounts[event.name] || 0) + 1;
    });

    const topEvents = Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Count errors by category
    const errorsByCategory: Record<string, number> = {};
    this.errors.forEach(error => {
      errorsByCategory[error.category] = (errorsByCategory[error.category] || 0) + 1;
    });

    // Calculate basic performance score
    const performanceEvents = this.events.filter(e => e.category === 'performance');
    const avgPerformance = performanceEvents.length > 0 
      ? performanceEvents.reduce((sum, e) => sum + (e.value || 0), 0) / performanceEvents.length
      : 0;
    const performanceScore = Math.max(0, 100 - (avgPerformance / 10)); // Simple scoring

    return {
      eventsTracked: this.events.length,
      errorsReported: this.errors.length,
      sessionDuration: Math.round(sessionStart / 1000),
      topEvents,
      errorsByCategory,
      performanceScore: Math.round(performanceScore)
    };
  }

  /**
   * Export analytics data
   */
  exportAnalyticsData(): {
    events: AnalyticsEvent[];
    errors: ErrorReport[];
    config: AnalyticsConfig;
    sessionId: string;
    summary: ReturnType<typeof this.getAnalyticsSummary>;
  } {
    return {
      events: this.events,
      errors: this.errors,
      config: this.config,
      sessionId: this.sessionId,
      summary: this.getAnalyticsSummary()
    };
  }

  /**
   * Utility functions
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if analytics is properly initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Cleanup and prepare for page unload
   */
  cleanup(): void {
    // Send any remaining events
    if (this.events.length > 0) {
      console.log(`📊 Cleaning up: ${this.events.length} events, ${this.errors.length} errors tracked`);
    }
  }
}

// Global type declarations
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export default Phase7AnalyticsManager;
export type { AnalyticsConfig, AnalyticsEvent, ErrorReport, PerformanceMetrics }; 