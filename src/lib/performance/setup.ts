import { logBundleSize, monitorMemoryUsage } from './monitor';
import { preloadResource } from './utils';

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

// Add resource hints to improve performance
export function addResourceHints() {
  if (typeof document === 'undefined') return;

  // Preload critical resources
  preloadResource('/fonts/lora.woff2', 'font', 'font/woff2');
  preloadResource('/images/logo.svg', 'image');
  
  // Add DNS prefetch for external domains
  const dnsHints = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google.com',
  ];

  dnsHints.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
}

// Initialize all performance monitoring
export function initializePerformanceMonitoring() {
  logBundleSize();
  addResourceHints();
  registerServiceWorker();
  
  // Log memory usage in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      const memory = monitorMemoryUsage();
      if (memory) {
        console.log('Memory Usage:', memory);
      }
    }, 30000); // Every 30 seconds
  }
} 