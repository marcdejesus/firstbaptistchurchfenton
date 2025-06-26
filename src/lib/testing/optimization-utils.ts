interface OptimizationRecommendation {
  id: string;
  category: 'performance' | 'accessibility' | 'seo' | 'user-experience';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  implementation: string;
  estimatedTimeToFix: string;
  resources: string[];
}

interface ImageOptimizationResult {
  element: HTMLImageElement;
  currentSize: number;
  suggestedFormats: string[];
  lazySrcset: boolean;
  hasAltText: boolean;
  recommendations: string[];
}

interface FontOptimizationResult {
  fontFamily: string;
  loadingStrategy: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  isWebFont: boolean;
  hasPreload: boolean;
  recommendations: string[];
}

interface CoreWebVitalsOptimization {
  metric: 'LCP' | 'INP' | 'CLS';
  currentValue: number;
  targetValue: number;
  optimizations: OptimizationRecommendation[];
}

class Phase6OptimizationUtils {
  private static instance: Phase6OptimizationUtils;

  static getInstance(): Phase6OptimizationUtils {
    if (!Phase6OptimizationUtils.instance) {
      Phase6OptimizationUtils.instance = new Phase6OptimizationUtils();
    }
    return Phase6OptimizationUtils.instance;
  }

  /**
   * Analyze and optimize images on the page
   */
  analyzeImageOptimization(): ImageOptimizationResult[] {
    const images = document.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    const results: ImageOptimizationResult[] = [];

    images.forEach(img => {
      const result: ImageOptimizationResult = {
        element: img,
        currentSize: 0,
        suggestedFormats: [],
        lazySrcset: false,
        hasAltText: !!img.alt,
        recommendations: []
      };

      // Check if image has loading="lazy"
      if (img.loading !== 'lazy' && !this.isAboveFold(img)) {
        result.recommendations.push('Add loading="lazy" for images below the fold');
      }

      // Check for srcset
      if (!img.srcset) {
        result.recommendations.push('Add srcset for responsive images');
        result.lazySrcset = false;
      } else {
        result.lazySrcset = true;
      }

      // Check alt text
      if (!result.hasAltText) {
        result.recommendations.push('Add meaningful alt text for accessibility');
      }

      // Suggest modern formats
      const src = img.src;
      if (src.includes('.jpg') || src.includes('.png')) {
        result.suggestedFormats.push('WebP', 'AVIF');
        result.recommendations.push('Consider using WebP or AVIF formats for better compression');
      }

      // Check image dimensions
      if (img.naturalWidth > img.width * 2) {
        result.recommendations.push('Image is larger than needed - consider resizing');
      }

      results.push(result);
    });

    return results;
  }

  /**
   * Check if element is above the fold
   */
  private isAboveFold(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < viewportHeight;
  }

  /**
   * Analyze font loading optimization
   */
  analyzeFontOptimization(): FontOptimizationResult[] {
    const results: FontOptimizationResult[] = [];
    const usedFonts = new Set<string>();

    // Check all elements for font-family usage
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const fontFamily = computedStyle.fontFamily;
      usedFonts.add(fontFamily);
    });

    // Check preload links for fonts
    const preloadLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
    const preloadedFonts = Array.from(preloadLinks).map(link => 
      link.getAttribute('href') || ''
    );

    usedFonts.forEach(fontFamily => {
      const result: FontOptimizationResult = {
        fontFamily,
        loadingStrategy: 'auto',
        isWebFont: this.isWebFont(fontFamily),
        hasPreload: preloadedFonts.some(href => href.includes(fontFamily.replace(/['"]/g, ''))),
        recommendations: []
      };

      if (result.isWebFont && !result.hasPreload) {
        result.recommendations.push('Add preload link for critical web fonts');
      }

      if (result.isWebFont) {
        result.recommendations.push('Consider using font-display: swap for better performance');
      }

      // Check for system font fallbacks
      if (!fontFamily.includes('sans-serif') && !fontFamily.includes('serif')) {
        result.recommendations.push('Add system font fallbacks');
      }

      results.push(result);
    });

    return results;
  }

  /**
   * Check if font is a web font
   */
  private isWebFont(fontFamily: string): boolean {
    const webFonts = ['Cardo', 'Proza Libre', 'Inter', 'Roboto', 'Open Sans', 'Lato'];
    return webFonts.some(webFont => fontFamily.includes(webFont));
  }

  /**
   * Generate Core Web Vitals optimization recommendations
   */
  generateCoreWebVitalsOptimizations(): CoreWebVitalsOptimization[] {
    return [
      {
        metric: 'LCP',
        currentValue: 2.5, // This would come from actual measurements
        targetValue: 2.5,
        optimizations: [
          {
            id: 'lcp-image-optimization',
            category: 'performance',
            priority: 'high',
            title: 'Optimize LCP Image',
            description: 'The largest contentful paint element is likely an image that can be optimized',
            impact: 'Can improve LCP by 0.5-1.0 seconds',
            implementation: 'Use WebP format, add responsive images with srcset, preload critical images',
            estimatedTimeToFix: '2-4 hours',
            resources: ['https://web.dev/optimize-lcp/', 'https://web.dev/responsive-images/']
          },
          {
            id: 'lcp-server-response',
            category: 'performance',
            priority: 'medium',
            title: 'Improve Server Response Time',
            description: 'Server response time affects when the browser can start rendering content',
            impact: 'Can improve LCP by 0.2-0.5 seconds',
            implementation: 'Optimize database queries, use CDN, implement caching',
            estimatedTimeToFix: '4-8 hours',
            resources: ['https://web.dev/time-to-first-byte/', 'https://web.dev/render-blocking-resources/']
          }
        ]
      },
      {
        metric: 'INP',
        currentValue: 200, // milliseconds
        targetValue: 200,
        optimizations: [
          {
            id: 'inp-javascript-optimization',
            category: 'performance',
            priority: 'medium',
            title: 'Optimize JavaScript Execution',
            description: 'Long-running JavaScript tasks can delay input responses',
            impact: 'Can improve INP by 50-100ms',
            implementation: 'Break up long tasks, defer non-critical JavaScript, use web workers',
            estimatedTimeToFix: '3-6 hours',
            resources: ['https://web.dev/optimize-inp/', 'https://web.dev/long-tasks-devtools/']
          }
        ]
      },
      {
        metric: 'CLS',
        currentValue: 0.1,
        targetValue: 0.1,
        optimizations: [
          {
            id: 'cls-image-dimensions',
            category: 'performance',
            priority: 'high',
            title: 'Set Image Dimensions',
            description: 'Images without dimensions can cause layout shifts',
            impact: 'Can reduce CLS by 0.05-0.15',
            implementation: 'Add width and height attributes to all images',
            estimatedTimeToFix: '1-2 hours',
            resources: ['https://web.dev/optimize-cls/', 'https://web.dev/setting-height-width-on-images/']
          },
          {
            id: 'cls-dynamic-content',
            category: 'performance',
            priority: 'medium',
            title: 'Reserve Space for Dynamic Content',
            description: 'Dynamic content insertion can cause unexpected layout shifts',
            impact: 'Can reduce CLS by 0.02-0.10',
            implementation: 'Use skeleton screens, reserve space for ads and embeds',
            estimatedTimeToFix: '2-4 hours',
            resources: ['https://web.dev/cls/', 'https://web.dev/content-layout-shift/']
          }
        ]
      }
    ];
  }

  /**
   * Generate accessibility optimization recommendations
   */
  generateAccessibilityOptimizations(): OptimizationRecommendation[] {
    return [
      {
        id: 'accessibility-focus-indicators',
        category: 'accessibility',
        priority: 'high',
        title: 'Enhance Focus Indicators',
        description: 'Ensure all interactive elements have visible focus indicators',
        impact: 'Improves keyboard navigation for users with disabilities',
        implementation: 'Add custom focus styles with sufficient contrast and visibility',
        estimatedTimeToFix: '2-3 hours',
        resources: ['https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html']
      },
      {
        id: 'accessibility-color-contrast',
        category: 'accessibility',
        priority: 'high',
        title: 'Improve Color Contrast',
        description: 'Ensure all text meets WCAG AA contrast requirements',
        impact: 'Makes content readable for users with visual impairments',
        implementation: 'Adjust color values to meet 4.5:1 contrast ratio minimum',
        estimatedTimeToFix: '1-2 hours',
        resources: ['https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html']
      },
      {
        id: 'accessibility-skip-links',
        category: 'accessibility',
        priority: 'medium',
        title: 'Add Skip Navigation Links',
        description: 'Provide skip links for keyboard users to bypass navigation',
        impact: 'Improves navigation efficiency for keyboard and screen reader users',
        implementation: 'Add visually hidden skip link at the beginning of the page',
        estimatedTimeToFix: '1 hour',
        resources: ['https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html']
      }
    ];
  }

  /**
   * Generate SEO optimization recommendations
   */
  generateSEOOptimizations(): OptimizationRecommendation[] {
    return [
      {
        id: 'seo-meta-descriptions',
        category: 'seo',
        priority: 'medium',
        title: 'Optimize Meta Descriptions',
        description: 'Add compelling meta descriptions to all pages',
        impact: 'Improves click-through rates from search results',
        implementation: 'Write unique, descriptive meta descriptions under 160 characters',
        estimatedTimeToFix: '2-3 hours',
        resources: ['https://developers.google.com/search/docs/appearance/snippet']
      },
      {
        id: 'seo-structured-data',
        category: 'seo',
        priority: 'medium',
        title: 'Implement Structured Data',
        description: 'Add JSON-LD structured data for church organization and events',
        impact: 'Enhances search result appearance and provides rich snippets',
        implementation: 'Add Organization and Event schema markup',
        estimatedTimeToFix: '3-4 hours',
        resources: ['https://schema.org/Organization', 'https://schema.org/Event']
      }
    ];
  }

  /**
   * Generate user experience optimization recommendations
   */
  generateUXOptimizations(): OptimizationRecommendation[] {
    return [
      {
        id: 'ux-mobile-touch-targets',
        category: 'user-experience',
        priority: 'high',
        title: 'Optimize Touch Targets',
        description: 'Ensure all touch targets are at least 44px on mobile devices',
        impact: 'Improves mobile usability and reduces user frustration',
        implementation: 'Increase padding and minimum dimensions for buttons and links',
        estimatedTimeToFix: '2-3 hours',
        resources: ['https://www.w3.org/WAI/WCAG21/Understanding/target-size.html']
      },
      {
        id: 'ux-loading-states',
        category: 'user-experience',
        priority: 'medium',
        title: 'Add Loading States',
        description: 'Provide visual feedback during content loading',
        impact: 'Reduces perceived loading time and improves user satisfaction',
        implementation: 'Add skeleton screens and loading indicators',
        estimatedTimeToFix: '3-4 hours',
        resources: ['https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a']
      }
    ];
  }

  /**
   * Generate comprehensive optimization report
   */
  generateOptimizationReport(): {
    images: ImageOptimizationResult[];
    fonts: FontOptimizationResult[];
    coreWebVitals: CoreWebVitalsOptimization[];
    accessibility: OptimizationRecommendation[];
    seo: OptimizationRecommendation[];
    userExperience: OptimizationRecommendation[];
    summary: {
      totalRecommendations: number;
      criticalIssues: number;
      estimatedEffort: string;
    };
  } {
    const images = this.analyzeImageOptimization();
    const fonts = this.analyzeFontOptimization();
    const coreWebVitals = this.generateCoreWebVitalsOptimizations();
    const accessibility = this.generateAccessibilityOptimizations();
    const seo = this.generateSEOOptimizations();
    const userExperience = this.generateUXOptimizations();

    const allRecommendations = [
      ...coreWebVitals.flatMap(cwv => cwv.optimizations),
      ...accessibility,
      ...seo,
      ...userExperience
    ];

    const criticalIssues = allRecommendations.filter(rec => rec.priority === 'critical').length;
    const totalRecommendations = allRecommendations.length;

    return {
      images,
      fonts,
      coreWebVitals,
      accessibility,
      seo,
      userExperience,
      summary: {
        totalRecommendations,
        criticalIssues,
        estimatedEffort: this.calculateEstimatedEffort(allRecommendations)
      }
    };
  }

  /**
   * Calculate estimated effort for all recommendations
   */
  private calculateEstimatedEffort(recommendations: OptimizationRecommendation[]): string {
    let totalHours = 0;

    recommendations.forEach(rec => {
      const timeStr = rec.estimatedTimeToFix;
      const matches = timeStr.match(/(\d+)-?(\d+)?/);
      if (matches) {
        const min = parseInt(matches[1]);
        const max = matches[2] ? parseInt(matches[2]) : min;
        totalHours += (min + max) / 2;
      }
    });

    if (totalHours < 8) {
      return `${Math.round(totalHours)} hours`;
    } else {
      const days = Math.round(totalHours / 8 * 10) / 10;
      return `${days} days`;
    }
  }

  /**
   * Check for render-blocking resources
   */
  analyzeRenderBlockingResources(): {
    css: string[];
    javascript: string[];
    recommendations: string[];
  } {
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    const scriptTags = document.querySelectorAll('script:not([async]):not([defer])');
    
    const renderBlockingCSS = Array.from(cssLinks).map(link => 
      link.getAttribute('href') || ''
    ).filter(href => href);

    const renderBlockingJS = Array.from(scriptTags).map(script => 
      script.getAttribute('src') || 'inline'
    ).filter(src => src);

    const recommendations: string[] = [];
    
    if (renderBlockingCSS.length > 3) {
      recommendations.push('Consider combining CSS files to reduce render-blocking resources');
    }
    
    if (renderBlockingJS.length > 0) {
      recommendations.push('Add async or defer attributes to non-critical JavaScript');
    }

    return {
      css: renderBlockingCSS,
      javascript: renderBlockingJS,
      recommendations
    };
  }
}

export default Phase6OptimizationUtils;
export type { 
  OptimizationRecommendation, 
  ImageOptimizationResult, 
  FontOptimizationResult, 
  CoreWebVitalsOptimization 
}; 