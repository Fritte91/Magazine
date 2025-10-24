// Netlify-specific cache busting solution
// This script forces complete cache invalidation for Netlify CDN

(function() {
    'use strict';
    
    // Generate a unique cache buster based on timestamp
    const CACHE_BUSTER = Date.now();
    const VERSION = '3.0'; // Increment this for major updates
    
    // Function to add cache busting to all assets
    function bustCache() {
        console.log('🚀 Netlify Cache Buster v' + VERSION + ' - Busting cache...');
        
        // Update all images
        const images = document.querySelectorAll('img[src]');
        images.forEach(img => {
            const src = img.src;
            if (src && !src.includes('?v=') && !src.includes('?cb=')) {
                const separator = src.includes('?') ? '&' : '?';
                img.src = src + separator + 'cb=' + CACHE_BUSTER + '&v=' + VERSION;
            }
        });
        
        // Update all CSS links
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
            const href = link.href;
            if (href && !href.includes('?v=') && !href.includes('?cb=')) {
                const separator = href.includes('?') ? '&' : '?';
                link.href = href + separator + 'cb=' + CACHE_BUSTER + '&v=' + VERSION;
            }
        });
        
        // Update all script sources
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const src = script.src;
            if (src && !src.includes('?v=') && !src.includes('?cb=')) {
                const separator = src.includes('?') ? '&' : '?';
                script.src = src + separator + 'cb=' + CACHE_BUSTER + '&v=' + VERSION;
            }
        });
        
        // Update background images
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const backgroundImage = style.backgroundImage;
            if (backgroundImage && backgroundImage !== 'none' && backgroundImage.includes('url(')) {
                const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (urlMatch) {
                    const url = urlMatch[1];
                    if (!url.includes('?v=') && !url.includes('?cb=')) {
                        const separator = url.includes('?') ? '&' : '?';
                        const newUrl = url + separator + 'cb=' + CACHE_BUSTER + '&v=' + VERSION;
                        element.style.backgroundImage = `url('${newUrl}')`;
                    }
                }
            }
        });
        
        console.log('✅ Cache busting complete for ' + (images.length + cssLinks.length + scripts.length) + ' assets');
    }
    
    // Function to force reload with cache busting
    function forceReload() {
        if (window.location.search.includes('force_reload')) {
            console.log('🔄 Force reload detected, clearing all caches...');
            
            // Clear all possible caches
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => {
                        caches.delete(name);
                    });
                });
            }
            
            // Clear localStorage and sessionStorage
            try {
                localStorage.clear();
                sessionStorage.clear();
            } catch (e) {
                console.log('Could not clear storage:', e);
            }
        }
    }
    
    // Function to add cache busting to forms and links
    function bustFormAndLinkCache() {
        // Update all forms
        const forms = document.querySelectorAll('form[action]');
        forms.forEach(form => {
            const action = form.action;
            if (action && !action.includes('?v=') && !action.includes('?cb=')) {
                const separator = action.includes('?') ? '&' : '?';
                form.action = action + separator + 'cb=' + CACHE_BUSTER + '&v=' + VERSION;
            }
        });
        
        // Update all internal links
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.href;
            if (href && href.includes(window.location.hostname) && !href.includes('?v=') && !href.includes('?cb=')) {
                const separator = href.includes('?') ? '&' : '?';
                link.href = href + separator + 'cb=' + CACHE_BUSTER + '&v=' + VERSION;
            }
        });
    }
    
    // Initialize cache busting
    function init() {
        forceReload();
        bustCache();
        bustFormAndLinkCache();
        
        // Re-run on dynamic content changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    bustCache();
                    bustFormAndLinkCache();
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Run immediately and on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also run on window load for any missed assets
    window.addEventListener('load', function() {
        setTimeout(bustCache, 100);
    });
    
    // Export for manual use
    window.netlifyCacheBuster = {
        bust: bustCache,
        version: VERSION,
        timestamp: CACHE_BUSTER
    };
    
})();
