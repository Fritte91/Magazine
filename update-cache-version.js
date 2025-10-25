// Cache Version Management for Now Or Never Magazine
// Safe cache busting without breaking functionality

(function() {
    'use strict';
    
    // Current cache version
    const CACHE_VERSION = '2024-10-24-v5';
    
    // Safe cache version update
    function updateCacheVersion() {
        try {
            // Update cache version in HTML meta tag
            const cacheBustMeta = document.querySelector('meta[name="cache-bust"]');
            if (cacheBustMeta) {
                cacheBustMeta.setAttribute('content', CACHE_VERSION);
            }
            
            // Update version parameters in critical resources
            const criticalResources = [
                'styles.css',
                'styles-minimal-optimized.css',
                'script-optimized.js',
                'force-cache-clear.js'
            ];
            
            criticalResources.forEach(resource => {
                const elements = document.querySelectorAll(`link[href*="${resource}"], script[src*="${resource}"]`);
                elements.forEach(element => {
                    const href = element.href || element.src;
                    if (href) {
                        const url = new URL(href);
                        url.searchParams.set('v', CACHE_VERSION.split('-')[2]); // Extract version number
                        if (element.tagName === 'LINK') {
                            element.href = url.toString();
                        } else {
                            element.src = url.toString();
                        }
                    }
                });
            });
            
            // Update image versions
            const images = document.querySelectorAll('img[src*=".jpg"], img[src*=".jpeg"], img[src*=".webp"], img[src*=".png"]');
            images.forEach(img => {
                const src = img.src;
                if (src && !src.includes('v=')) {
                    const url = new URL(src);
                    url.searchParams.set('v', CACHE_VERSION.split('-')[2]);
                    img.src = url.toString();
                }
            });
            
            console.log('✅ Cache version updated to:', CACHE_VERSION);
            
        } catch (error) {
            console.warn('Cache version update failed:', error);
        }
    }
    
    // Initialize cache version update
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateCacheVersion);
    } else {
        updateCacheVersion();
    }
    
})();
