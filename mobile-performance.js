// Mobile Performance Optimization for Now Or Never Magazine
// Safe mobile optimizations without breaking functionality

(function() {
    'use strict';
    
    // Mobile performance optimizations
    function initMobileOptimizations() {
        try {
            // Detect mobile devices
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            
            if (isMobile || isTouchDevice) {
                // Mobile-specific optimizations
                optimizeForMobile();
            }
            
        } catch (error) {
            console.warn('Mobile optimization failed:', error);
        }
    }
    
    function optimizeForMobile() {
        try {
            // Reduce image quality on mobile for faster loading
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                // Add mobile-specific attributes
                img.setAttribute('loading', 'lazy');
                img.setAttribute('decoding', 'async');
                
                // Add mobile-specific classes
                img.classList.add('mobile-optimized');
            });
            
            // Optimize touch interactions
            optimizeTouchInteractions();
            
            // Reduce animations on mobile
            reduceAnimationsOnMobile();
            
            // Optimize scrolling
            optimizeScrolling();
            
        } catch (error) {
            console.warn('Mobile optimization failed:', error);
        }
    }
    
    function optimizeTouchInteractions() {
        try {
            // Add touch-friendly classes
            const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary, .btn-outline');
            buttons.forEach(button => {
                button.classList.add('touch-friendly');
            });
            
            // Optimize form inputs for mobile
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                // Prevent zoom on focus (iOS)
                if (input.type === 'text' || input.type === 'email' || input.type === 'tel') {
                    input.style.fontSize = '16px';
                }
            });
            
        } catch (error) {
            console.warn('Touch optimization failed:', error);
        }
    }
    
    function reduceAnimationsOnMobile() {
        try {
            // Add reduced motion class for mobile
            document.body.classList.add('mobile-reduced-motion');
            
            // Disable heavy animations on mobile
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    .mobile-reduced-motion * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `;
            document.head.appendChild(style);
            
        } catch (error) {
            console.warn('Animation reduction failed:', error);
        }
    }
    
    function optimizeScrolling() {
        try {
            // Smooth scrolling optimization for mobile
            let isScrolling = false;
            let scrollTimeout;
            
            window.addEventListener('scroll', function() {
                if (!isScrolling) {
                    isScrolling = true;
                    document.body.classList.add('is-scrolling');
                }
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    isScrolling = false;
                    document.body.classList.remove('is-scrolling');
                }, 150);
            }, { passive: true });
            
            // Optimize scroll performance
            let ticking = false;
            function updateScrollProgress() {
                const scrollProgress = document.getElementById('scrollProgress');
                if (scrollProgress) {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = (scrollTop / scrollHeight) * 100;
                    scrollProgress.style.width = progress + '%';
                }
                ticking = false;
            }
            
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    requestAnimationFrame(updateScrollProgress);
                    ticking = true;
                }
            }, { passive: true });
            
        } catch (error) {
            console.warn('Scroll optimization failed:', error);
        }
    }
    
    // Initialize mobile optimizations
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileOptimizations);
    } else {
        initMobileOptimizations();
    }
    
})();
