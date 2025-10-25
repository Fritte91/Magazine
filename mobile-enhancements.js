// Mobile Enhancements for Now Or Never Magazine
// Advanced mobile optimizations and touch interactions

(function() {
    'use strict';
    
    // Mobile detection and optimization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // Mobile-specific optimizations
    function initMobileOptimizations() {
        try {
            // Add mobile class to body
            if (isMobile || isTouchDevice) {
                document.body.classList.add('mobile-device');
            }
            
            // iOS specific optimizations
            if (isIOS) {
                document.body.classList.add('ios-device');
                optimizeForIOS();
            }
            
            // Android specific optimizations
            if (isAndroid) {
                document.body.classList.add('android-device');
                optimizeForAndroid();
            }
            
            // Touch device optimizations
            if (isTouchDevice) {
                document.body.classList.add('touch-device');
                optimizeForTouch();
            }
            
            // Initialize mobile-specific features
            initMobileNavigation();
            initMobileForms();
            initMobileScrolling();
            initMobileGestures();
            initMobilePerformance();
            
        } catch (error) {
            console.warn('Mobile optimization failed:', error);
        }
    }
    
    // iOS specific optimizations
    function optimizeForIOS() {
        try {
            // Prevent zoom on double tap
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function(event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
            
            // Fix iOS viewport height issues
            function setViewportHeight() {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            }
            
            setViewportHeight();
            window.addEventListener('resize', setViewportHeight);
            window.addEventListener('orientationchange', setViewportHeight);
            
            // Fix iOS scroll bounce
            document.body.style.webkitOverflowScrolling = 'touch';
            
        } catch (error) {
            console.warn('iOS optimization failed:', error);
        }
    }
    
    // Android specific optimizations
    function optimizeForAndroid() {
        try {
            // Optimize for Android Chrome
            if (navigator.userAgent.includes('Chrome')) {
                document.body.classList.add('android-chrome');
            }
            
            // Fix Android keyboard issues
            window.addEventListener('resize', function() {
                if (window.innerHeight < window.outerHeight * 0.75) {
                    document.body.classList.add('keyboard-open');
                } else {
                    document.body.classList.remove('keyboard-open');
                }
            });
            
        } catch (error) {
            console.warn('Android optimization failed:', error);
        }
    }
    
    // Touch device optimizations
    function optimizeForTouch() {
        try {
            // Add touch feedback to buttons
            const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary, .btn-outline');
            buttons.forEach(button => {
                button.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                });
                
                button.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.classList.remove('touch-active');
                    }, 150);
                });
            });
            
            // Optimize touch scrolling
            document.body.style.webkitOverflowScrolling = 'touch';
            
        } catch (error) {
            console.warn('Touch optimization failed:', error);
        }
    }
    
    // Mobile navigation enhancements
    function initMobileNavigation() {
        try {
            const navToggle = document.querySelector('.nav-toggle');
            const navLinks = document.querySelector('.nav-links');
            
            if (navToggle && navLinks) {
                navToggle.addEventListener('click', function() {
                    this.classList.toggle('active');
                    navLinks.classList.toggle('active');
                    document.body.classList.toggle('nav-open');
                });
                
                // Close navigation when clicking outside
                document.addEventListener('click', function(event) {
                    if (!navToggle.contains(event.target) && !navLinks.contains(event.target)) {
                        navToggle.classList.remove('active');
                        navLinks.classList.remove('active');
                        document.body.classList.remove('nav-open');
                    }
                });
                
                // Close navigation when clicking on links
                const navLinksItems = navLinks.querySelectorAll('a');
                navLinksItems.forEach(link => {
                    link.addEventListener('click', function() {
                        navToggle.classList.remove('active');
                        navLinks.classList.remove('active');
                        document.body.classList.remove('nav-open');
                    });
                });
            }
            
        } catch (error) {
            console.warn('Mobile navigation failed:', error);
        }
    }
    
    // Mobile form optimizations
    function initMobileForms() {
        try {
            // Prevent zoom on form inputs (iOS)
            const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
            inputs.forEach(input => {
                if (isIOS) {
                    input.style.fontSize = '16px';
                }
                
                // Add mobile-specific classes
                input.classList.add('mobile-input');
                
                // Enhanced focus management
                input.addEventListener('focus', function() {
                    this.classList.add('mobile-focused');
                    // Scroll to input on mobile
                    setTimeout(() => {
                        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                });
                
                input.addEventListener('blur', function() {
                    this.classList.remove('mobile-focused');
                });
            });
            
            // File upload optimization for mobile
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => {
                input.addEventListener('change', function() {
                    if (this.files.length > 0) {
                        this.classList.add('file-selected');
                        // Show file name on mobile
                        const fileName = this.files[0].name;
                        const label = this.nextElementSibling;
                        if (label && label.tagName === 'LABEL') {
                            label.textContent = `Selected: ${fileName}`;
                        }
                    }
                });
            });
            
        } catch (error) {
            console.warn('Mobile forms failed:', error);
        }
    }
    
    // Mobile scrolling optimizations
    function initMobileScrolling() {
        try {
            // Smooth scrolling for mobile
            const links = document.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
            
            // Mobile scroll progress
            let ticking = false;
            function updateScrollProgress() {
                const scrollProgress = document.getElementById('scrollProgress');
                if (scrollProgress) {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = (scrollTop / scrollHeight) * 100;
                    scrollProgress.style.width = Math.min(progress, 100) + '%';
                }
                ticking = false;
            }
            
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    requestAnimationFrame(updateScrollProgress);
                    ticking = true;
                }
            }, { passive: true });
            
            // Mobile scroll snap
            const scrollSnapElements = document.querySelectorAll('.character-slider, .testimonials-slider');
            scrollSnapElements.forEach(element => {
                element.style.scrollSnapType = 'x mandatory';
                element.style.webkitOverflowScrolling = 'touch';
            });
            
        } catch (error) {
            console.warn('Mobile scrolling failed:', error);
        }
    }
    
    // Mobile gesture support
    function initMobileGestures() {
        try {
            // Swipe gestures for character slider
            const characterSlider = document.querySelector('.character-slider');
            if (characterSlider && isTouchDevice) {
                let startX = 0;
                let currentX = 0;
                let isDragging = false;
                
                characterSlider.addEventListener('touchstart', function(e) {
                    startX = e.touches[0].clientX;
                    isDragging = true;
                });
                
                characterSlider.addEventListener('touchmove', function(e) {
                    if (!isDragging) return;
                    currentX = e.touches[0].clientX;
                    const diffX = startX - currentX;
                    
                    if (Math.abs(diffX) > 50) {
                        if (diffX > 0) {
                            // Swipe left - next character
                            const nextBtn = document.querySelector('.next-btn');
                            if (nextBtn) nextBtn.click();
                        } else {
                            // Swipe right - previous character
                            const prevBtn = document.querySelector('.prev-btn');
                            if (prevBtn) prevBtn.click();
                        }
                        isDragging = false;
                    }
                });
                
                characterSlider.addEventListener('touchend', function() {
                    isDragging = false;
                });
            }
            
            // Pull to refresh (if needed)
            let startY = 0;
            let currentY = 0;
            let isPulling = false;
            
            document.addEventListener('touchstart', function(e) {
                if (window.scrollY === 0) {
                    startY = e.touches[0].clientY;
                    isPulling = true;
                }
            });
            
            document.addEventListener('touchmove', function(e) {
                if (!isPulling) return;
                currentY = e.touches[0].clientY;
                const diffY = currentY - startY;
                
                if (diffY > 100) {
                    // Pull to refresh gesture detected
                    document.body.classList.add('pull-to-refresh');
                }
            });
            
            document.addEventListener('touchend', function() {
                if (isPulling) {
                    document.body.classList.remove('pull-to-refresh');
                    isPulling = false;
                }
            });
            
        } catch (error) {
            console.warn('Mobile gestures failed:', error);
        }
    }
    
    // Mobile performance optimizations
    function initMobilePerformance() {
        try {
            // Lazy load images on mobile
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
            
            // Optimize animations for mobile
            if (isMobile) {
                // Reduce animation complexity on mobile
                document.body.classList.add('mobile-reduced-animations');
            }
            
            // Preload critical resources on mobile
            const criticalResources = [
                './image/MagazineCover.jpg?v=2.3',
                './image/brandLogo.webp?v=2.3'
            ];
            
            criticalResources.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
            
        } catch (error) {
            console.warn('Mobile performance failed:', error);
        }
    }
    
    // Initialize mobile optimizations
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileOptimizations);
    } else {
        initMobileOptimizations();
    }
    
    // Export for debugging
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.mobileOptimizations = {
            isMobile,
            isTouchDevice,
            isIOS,
            isAndroid
        };
    }
    
})();
