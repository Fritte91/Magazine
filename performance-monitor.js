// Performance Monitoring for Now Or Never Magazine
// Safe performance tracking without breaking functionality

(function() {
    'use strict';
    
    // Performance metrics collection
    const performanceMetrics = {
        pageLoadTime: 0,
        domContentLoaded: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0
    };
    
    // Safe performance monitoring
    function initPerformanceMonitoring() {
        try {
            // Page load time
            window.addEventListener('load', function() {
                const loadTime = performance.now();
                performanceMetrics.pageLoadTime = Math.round(loadTime);
                
                // Log performance (only in development)
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log('🚀 Performance Metrics:', performanceMetrics);
                }
            });
            
            // DOM Content Loaded
            document.addEventListener('DOMContentLoaded', function() {
                performanceMetrics.domContentLoaded = Math.round(performance.now());
            });
            
            // Web Vitals monitoring (if supported)
            if ('PerformanceObserver' in window) {
                // First Contentful Paint
                try {
                    const fcpObserver = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            if (entry.name === 'first-contentful-paint') {
                                performanceMetrics.firstContentfulPaint = Math.round(entry.startTime);
                            }
                        }
                    });
                    fcpObserver.observe({ entryTypes: ['paint'] });
                } catch (e) {
                    // Silently fail if not supported
                }
                
                // Largest Contentful Paint
                try {
                    const lcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        performanceMetrics.largestContentfulPaint = Math.round(lastEntry.startTime);
                    });
                    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                } catch (e) {
                    // Silently fail if not supported
                }
                
                // Cumulative Layout Shift
                try {
                    const clsObserver = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            if (!entry.hadRecentInput) {
                                performanceMetrics.cumulativeLayoutShift += entry.value;
                            }
                        }
                    });
                    clsObserver.observe({ entryTypes: ['layout-shift'] });
                } catch (e) {
                    // Silently fail if not supported
                }
            }
            
            // First Input Delay
            if ('PerformanceObserver' in window) {
                try {
                    const fidObserver = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            performanceMetrics.firstInputDelay = Math.round(entry.processingStart - entry.startTime);
                        }
                    });
                    fidObserver.observe({ entryTypes: ['first-input'] });
                } catch (e) {
                    // Silently fail if not supported
                }
            }
            
        } catch (error) {
            // Silently fail - don't break the site
            console.warn('Performance monitoring failed:', error);
        }
    }
    
    // Resource loading optimization
    function optimizeResourceLoading() {
        try {
            // Preload critical images
            const criticalImages = [
                './image/MagazineCover.jpg?v=2.3',
                './image/brandLogo.webp?v=2.3',
                './image/hero-background.webp?v=2.3'
            ];
            
            criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
            
            // Lazy load non-critical images
            if ('IntersectionObserver' in window) {
                const lazyImages = document.querySelectorAll('img[data-src]');
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    });
                });
                
                lazyImages.forEach(img => imageObserver.observe(img));
            }
            
        } catch (error) {
            // Silently fail - don't break the site
            console.warn('Resource optimization failed:', error);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initPerformanceMonitoring();
            optimizeResourceLoading();
        });
    } else {
        initPerformanceMonitoring();
        optimizeResourceLoading();
    }
    
    // Export for debugging (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.performanceMetrics = performanceMetrics;
    }
    
})();
