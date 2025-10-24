// Cache Busting Script for Now Or Never Magazine
// This script automatically adds version parameters to all static assets

const CACHE_VERSION = '2.3'; // Update this when you make changes
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

// Function to add cache busting to image sources
function addCacheBustingToImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.src;
        if (src && !src.includes('?v=')) {
            const separator = src.includes('?') ? '&' : '?';
            img.src = src + separator + 'v=' + CACHE_VERSION;
        }
    });
}

// Function to add cache busting to background images
function addCacheBustingToBackgrounds() {
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
        const style = window.getComputedStyle(element);
        const backgroundImage = style.backgroundImage;
        if (backgroundImage && backgroundImage !== 'none') {
            const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (urlMatch) {
                const url = urlMatch[1];
                if (!url.includes('?v=')) {
                    const separator = url.includes('?') ? '&' : '?';
                    const newUrl = url + separator + 'v=' + CACHE_VERSION;
                    element.style.backgroundImage = `url('${newUrl}')`;
                }
            }
        }
    });
}

// Function to add cache busting to CSS and JS files
function addCacheBustingToAssets() {
    const links = document.querySelectorAll('link[href], script[src]');
    links.forEach(link => {
        const href = link.href || link.src;
        if (href && !href.includes('?v=')) {
            const separator = href.includes('?') ? '&' : '?';
            const newHref = href + separator + 'v=' + CACHE_VERSION;
            if (link.tagName === 'LINK') {
                link.href = newHref;
            } else {
                link.src = newHref;
            }
        }
    });
}

// Initialize cache busting when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addCacheBustingToImages();
    addCacheBustingToBackgrounds();
    addCacheBustingToAssets();
});

// Also run on window load to catch any dynamically loaded content
window.addEventListener('load', function() {
    addCacheBustingToImages();
    addCacheBustingToBackgrounds();
});

// Export for use in other scripts
window.CACHE_VERSION = CACHE_VERSION;
window.addCacheBustingToImages = addCacheBustingToImages;
window.addCacheBustingToBackgrounds = addCacheBustingToBackgrounds;
window.addCacheBustingToAssets = addCacheBustingToAssets;
