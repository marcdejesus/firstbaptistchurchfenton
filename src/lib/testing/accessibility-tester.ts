interface AccessibilityViolation {
  id: string;
  description: string;
  help: string;
  helpUrl: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  nodes: {
    target: string[];
    html: string;
    failureSummary: string;
  }[];
}

interface AccessibilityTestResult {
  passed: number;
  failed: number;
  score: number;
  violations: AccessibilityViolation[];
  timestamp: number;
  url: string;
}

interface KeyboardNavTest {
  element: string;
  passed: boolean;
  issues: string[];
}

interface ColorContrastTest {
  element: string;
  foreground: string;
  background: string;
  ratio: number;
  passed: boolean;
  level: 'AA' | 'AAA';
}

class Phase6AccessibilityTester {
  private static instance: Phase6AccessibilityTester;
  private testResults: AccessibilityTestResult[] = [];

  static getInstance(): Phase6AccessibilityTester {
    if (!Phase6AccessibilityTester.instance) {
      Phase6AccessibilityTester.instance = new Phase6AccessibilityTester();
    }
    return Phase6AccessibilityTester.instance;
  }

  /**
   * Run comprehensive accessibility tests for Phase 6
   */
  async runAccessibilityTests(): Promise<AccessibilityTestResult> {
    console.log('♿ Starting Phase 6 Accessibility Testing...');
    
    const result: AccessibilityTestResult = {
      passed: 0,
      failed: 0,
      score: 0,
      violations: [],
      timestamp: Date.now(),
      url: window.location.href
    };

    // Manual accessibility checks since we don't have axe-core
    const manualTests = [
      this.testHeadingStructure(),
      this.testImageAltText(),
      this.testFormLabels(),
      this.testKeyboardNavigation(),
      this.testColorContrast(),
      this.testFocusManagement(),
      this.testAriaLabels(),
      this.testSkipLinks()
    ];

    const testResults = await Promise.all(manualTests);
    
    // Compile results
    testResults.forEach(test => {
      if (test.passed) {
        result.passed++;
      } else {
        result.failed++;
        result.violations.push({
          id: test.id,
          description: test.description,
          help: test.help,
          helpUrl: test.helpUrl,
          impact: test.impact,
          nodes: test.nodes
        });
      }
    });

    // Calculate score
    const total = result.passed + result.failed;
    result.score = total > 0 ? Math.round((result.passed / total) * 100) : 100;

    this.testResults.push(result);
    this.logAccessibilityResults(result);
    
    return result;
  }

  /**
   * Test heading structure (H1 -> H6 hierarchy)
   */
  private async testHeadingStructure(): Promise<any> {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const issues: string[] = [];
    let hasH1 = false;
    let previousLevel = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level === 1) {
        if (hasH1) {
          issues.push(`Multiple H1 elements found - should only have one per page`);
        }
        hasH1 = true;
      }

      if (index > 0 && level > previousLevel + 1) {
        issues.push(`Heading level skipped: ${heading.tagName} follows H${previousLevel}`);
      }

      if (!heading.textContent?.trim()) {
        issues.push(`Empty heading found: ${heading.tagName}`);
      }

      previousLevel = level;
    });

    if (!hasH1) {
      issues.push('No H1 element found on page');
    }

    return {
      id: 'heading-structure',
      description: 'Heading structure and hierarchy',
      help: 'Headings should follow a logical hierarchy (H1 -> H2 -> H3)',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
      impact: 'serious' as const,
      passed: issues.length === 0,
      nodes: issues.map(issue => ({
        target: ['document'],
        html: '',
        failureSummary: issue
      }))
    };
  }

  /**
   * Test image alt text
   */
  private async testImageAltText(): Promise<any> {
    const images = document.querySelectorAll('img');
    const issues: any[] = [];

    images.forEach(img => {
      const alt = img.getAttribute('alt');
      const src = img.src;

      if (alt === null) {
        issues.push({
          target: [this.getSelector(img)],
          html: img.outerHTML,
          failureSummary: 'Image missing alt attribute'
        });
      } else if (alt === '' && !img.hasAttribute('role') && img.getAttribute('role') !== 'presentation') {
        // Empty alt is okay for decorative images, but should be intentional
        console.log('ℹ️ Empty alt text found (may be decorative):', src);
      }
    });

    return {
      id: 'image-alt',
      description: 'Images must have alternate text',
      help: 'All images should have meaningful alt text or be marked as decorative',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
      impact: 'critical' as const,
      passed: issues.length === 0,
      nodes: issues
    };
  }

  /**
   * Test form labels
   */
  private async testFormLabels(): Promise<any> {
    const formElements = document.querySelectorAll('input, select, textarea');
    const issues: any[] = [];

    formElements.forEach(element => {
      const id = element.id;
      const ariaLabel = element.getAttribute('aria-label');
      const ariaLabelledBy = element.getAttribute('aria-labelledby');
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      const type = element.getAttribute('type');

      // Skip hidden inputs
      if (type === 'hidden') return;

      if (!label && !ariaLabel && !ariaLabelledBy) {
        issues.push({
          target: [this.getSelector(element)],
          html: element.outerHTML,
          failureSummary: 'Form element missing label'
        });
      }
    });

    return {
      id: 'form-labels',
      description: 'Form elements must have labels',
      help: 'All form controls should have accessible labels',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html',
      impact: 'critical' as const,
      passed: issues.length === 0,
      nodes: issues
    };
  }

  /**
   * Test keyboard navigation
   */
  private async testKeyboardNavigation(): Promise<any> {
    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex], [role="button"], [role="link"]'
    );
    const issues: any[] = [];

    interactiveElements.forEach(element => {
      const tabIndex = element.getAttribute('tabindex');
      const style = window.getComputedStyle(element);
      
      // Check for positive tabindex (anti-pattern)
      if (tabIndex && parseInt(tabIndex) > 0) {
        issues.push({
          target: [this.getSelector(element)],
          html: element.outerHTML,
          failureSummary: 'Positive tabindex found - use 0 or -1 instead'
        });
      }

      // Check if focusable elements are visible
      if (style.display === 'none' || style.visibility === 'hidden') {
        if (tabIndex !== '-1') {
          issues.push({
            target: [this.getSelector(element)],
            html: element.outerHTML,
            failureSummary: 'Hidden focusable element should have tabindex="-1"'
          });
        }
      }
    });

    return {
      id: 'keyboard-navigation',
      description: 'Keyboard navigation must be logical and complete',
      help: 'All interactive elements should be keyboard accessible',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html',
      impact: 'serious' as const,
      passed: issues.length === 0,
      nodes: issues
    };
  }

  /**
   * Test color contrast (simplified version)
   */
  private async testColorContrast(): Promise<any> {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, span, div');
    const issues: any[] = [];

    // This is a simplified test - in production you'd use a proper color contrast library
    textElements.forEach(element => {
      const style = window.getComputedStyle(element);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      // Check for transparent backgrounds or insufficient contrast indicators
      if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
        // Element might inherit background - this is a limitation of manual testing
        return;
      }

      // Basic check for obviously problematic combinations
      if (color === backgroundColor) {
        issues.push({
          target: [this.getSelector(element)],
          html: element.outerHTML,
          failureSummary: 'Text color matches background color'
        });
      }
    });

    return {
      id: 'color-contrast',
      description: 'Text must have sufficient color contrast',
      help: 'Text should have at least 4.5:1 contrast ratio (3:1 for large text)',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
      impact: 'serious' as const,
      passed: issues.length === 0,
      nodes: issues
    };
  }

  /**
   * Test focus management
   */
  private async testFocusManagement(): Promise<any> {
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex="0"]'
    );
    const issues: any[] = [];

    focusableElements.forEach(element => {
      // Check if element has visible focus indicator
      const computedStyle = window.getComputedStyle(element, ':focus');
      const outline = computedStyle.outline;
      const outlineWidth = computedStyle.outlineWidth;
      
      // This is a basic check - proper focus testing requires interaction
      if (outline === 'none' && outlineWidth === '0px') {
        // Check if there's a custom focus style
        const boxShadow = computedStyle.boxShadow;
        const border = computedStyle.border;
        
        if (!boxShadow.includes('inset') && !border.includes('solid')) {
          issues.push({
            target: [this.getSelector(element)],
            html: element.outerHTML,
            failureSummary: 'Element may lack visible focus indicator'
          });
        }
      }
    });

    return {
      id: 'focus-management',
      description: 'Interactive elements must have visible focus indicators',
      help: 'Users should be able to see which element has keyboard focus',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html',
      impact: 'serious' as const,
      passed: issues.length === 0,
      nodes: issues
    };
  }

  /**
   * Test ARIA labels and roles
   */
  private async testAriaLabels(): Promise<any> {
    const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [role]');
    const issues: any[] = [];

    ariaElements.forEach(element => {
      const ariaLabel = element.getAttribute('aria-label');
      const ariaLabelledBy = element.getAttribute('aria-labelledby');
      const role = element.getAttribute('role');

      // Check for empty aria-label
      if (ariaLabel !== null && ariaLabel.trim() === '') {
        issues.push({
          target: [this.getSelector(element)],
          html: element.outerHTML,
          failureSummary: 'Empty aria-label attribute'
        });
      }

      // Check for aria-labelledby pointing to non-existent elements
      if (ariaLabelledBy) {
        const labelElement = document.getElementById(ariaLabelledBy);
        if (!labelElement) {
          issues.push({
            target: [this.getSelector(element)],
            html: element.outerHTML,
            failureSummary: `aria-labelledby points to non-existent element: ${ariaLabelledBy}`
          });
        }
      }

      // Check for invalid roles (basic validation)
      if (role) {
        const validRoles = ['button', 'link', 'heading', 'banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search', 'tabpanel', 'tab', 'tablist'];
        if (!validRoles.includes(role) && !role.startsWith('presentation')) {
          console.warn(`⚠️ Potentially invalid ARIA role: ${role}`);
        }
      }
    });

    return {
      id: 'aria-labels',
      description: 'ARIA labels and roles must be valid and meaningful',
      help: 'ARIA attributes should enhance accessibility when used correctly',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
      impact: 'moderate' as const,
      passed: issues.length === 0,
      nodes: issues
    };
  }

  /**
   * Test skip links
   */
  private async testSkipLinks(): Promise<any> {
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    const issues: any[] = [];
    let hasMainSkipLink = false;

    skipLinks.forEach(link => {
      const href = link.getAttribute('href');
      const target = href ? document.querySelector(href) : null;
      
      if (href === '#main' || href === '#content' || href === '#main-content') {
        hasMainSkipLink = true;
        if (!target) {
          issues.push({
            target: [this.getSelector(link)],
            html: link.outerHTML,
            failureSummary: `Skip link target not found: ${href}`
          });
        }
      }
    });

    // Check if page has a skip link
    if (!hasMainSkipLink && document.body.children.length > 10) {
      issues.push({
        target: ['body'],
        html: '',
        failureSummary: 'No skip to main content link found'
      });
    }

    return {
      id: 'skip-links',
      description: 'Skip links should be provided for keyboard navigation',
      help: 'Pages should have skip links to main content areas',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html',
      impact: 'moderate' as const,
      passed: issues.length === 0,
      nodes: issues
    };
  }

  /**
   * Generate CSS selector for an element
   */
  private getSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        return `${element.tagName.toLowerCase()}.${classes[0]}`;
      }
    }
    return element.tagName.toLowerCase();
  }

  /**
   * Log accessibility test results
   */
  private logAccessibilityResults(result: AccessibilityTestResult): void {
    console.log(`♿ Accessibility Test Results:`);
    console.log(`   Score: ${result.score}%`);
    console.log(`   Passed: ${result.passed} tests`);
    console.log(`   Failed: ${result.failed} tests`);
    
    if (result.violations.length > 0) {
      console.log(`   Violations:`);
      result.violations.forEach(violation => {
        console.log(`   - ${violation.description} (${violation.impact})`);
        violation.nodes.forEach(node => {
          console.log(`     ${node.failureSummary}`);
        });
      });
    }
  }

  /**
   * Get accessibility recommendations
   */
  getAccessibilityRecommendations(): string[] {
    const recommendations: string[] = [];
    const latestResult = this.testResults[this.testResults.length - 1];
    
    if (!latestResult) return recommendations;

    latestResult.violations.forEach(violation => {
      switch (violation.impact) {
        case 'critical':
          recommendations.push(`🚨 CRITICAL: ${violation.description} - ${violation.help}`);
          break;
        case 'serious':
          recommendations.push(`⚠️ SERIOUS: ${violation.description} - ${violation.help}`);
          break;
        case 'moderate':
          recommendations.push(`📝 MODERATE: ${violation.description} - ${violation.help}`);
          break;
        case 'minor':
          recommendations.push(`ℹ️ MINOR: ${violation.description} - ${violation.help}`);
          break;
      }
    });

    return recommendations;
  }

  /**
   * Export accessibility test data
   */
  exportAccessibilityData(): {
    results: AccessibilityTestResult[];
    recommendations: string[];
    summary: {
      averageScore: number;
      totalTests: number;
      totalViolations: number;
    };
  } {
    const totalTests = this.testResults.length;
    const averageScore = totalTests > 0 
      ? this.testResults.reduce((sum, result) => sum + result.score, 0) / totalTests 
      : 0;
    const totalViolations = this.testResults.reduce((sum, result) => sum + result.violations.length, 0);

    return {
      results: this.testResults,
      recommendations: this.getAccessibilityRecommendations(),
      summary: {
        averageScore,
        totalTests,
        totalViolations
      }
    };
  }
}

export default Phase6AccessibilityTester;
export type { AccessibilityViolation, AccessibilityTestResult, KeyboardNavTest, ColorContrastTest }; 