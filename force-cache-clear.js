// Force Cache Clear Script
// This script forces all users to get the fresh version of your site

(function() {
    'use strict';
    
    // Force cache clear for all users
    const CACHE_VERSION = '2024-10-24-v4';
    const FORCE_RELOAD = true;
    
    // Check if this is a fresh load or cached version
    const currentVersion = localStorage.getItem('site-version');
    const urlParams = new URLSearchParams(window.location.search);
    const forceReload = urlParams.get('force_reload') === '1';
    
    if (currentVersion !== CACHE_VERSION || forceReload) {
        console.log('🔄 Forcing cache clear for all users...');
        
        // Clear all possible caches
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                    console.log('✅ Cleared cache:', name);
                });
            });
        }
        
        // Clear localStorage and sessionStorage
        try {
            localStorage.clear();
            sessionStorage.clear();
            console.log('✅ Cleared local storage');
        } catch (e) {
            console.log('Could not clear storage:', e);
        }
        
        // Set new version
        localStorage.setItem('site-version', CACHE_VERSION);
        
        // Force reload if needed
        if (currentVersion && currentVersion !== CACHE_VERSION) {
            console.log('🔄 Reloading with fresh content...');
            window.location.reload(true);
            return;
        }
        
        // Add cache-busting to all images
        const images = document.querySelectorAll('img[src]');
        images.forEach(img => {
            const src = img.src;
            if (src && !src.includes('?v=') && !src.includes('?cb=')) {
                const separator = src.includes('?') ? '&' : '?';
                img.src = src + separator + 'cb=' + Date.now();
            }
        });
        
        // Add cache-busting to CSS and JS
        const links = document.querySelectorAll('link[href], script[src]');
        links.forEach(link => {
            const href = link.href || link.src;
            if (href && !href.includes('?v=') && !href.includes('?cb=')) {
                const separator = href.includes('?') ? '&' : '?';
                const newHref = href + separator + 'cb=' + Date.now();
                if (link.tagName === 'LINK') {
                    link.href = newHref;
                } else {
                    link.src = newHref;
                }
            }
        });
        
        console.log('✅ Cache clear complete!');
    } else {
        console.log('✅ Using fresh version:', CACHE_VERSION);
    }
    
    // Add a banner for users to force refresh if needed
    if (forceReload) {
        const banner = document.createElement('div');
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #2e7d32;
            color: white;
            padding: 10px;
            text-align: center;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        banner.innerHTML = '🔄 Cache cleared! You are now viewing the latest version.';
        document.body.insertBefore(banner, document.body.firstChild);
        
        // Remove banner after 3 seconds
        setTimeout(() => {
            banner.remove();
        }, 3000);
    }
    
})();
