// OPTIMIZED SCRIPT.JS - Production Ready
// Removed console logs and optimized for performance

// Performance optimization: Use requestAnimationFrame for smooth animations
function smoothScroll(target, duration = 800) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // Language toggle functionality
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    
    // Initialize language
    function setLanguage(lang) {
        const elements = document.querySelectorAll('[data-en], [data-th]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                element.textContent = text;
            }
        });
        
        // Update button states
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        localStorage.setItem('preferredLanguage', lang);
    }

    // Set initial language
    setLanguage(currentLang);

    // Add click handlers
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            setLanguage(this.dataset.lang);
        });
    });

    // Character slider functionality
    const slider = document.querySelector('.character-slider');
    const cards = document.querySelectorAll('.character-card');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    let currentIndex = 0;

    if (slider && cards.length > 0) {
        // Initialize slider
        function showCard(index) {
            cards.forEach((card, i) => {
                card.classList.toggle('active', i === index);
            });
        }

        function nextCard() {
            currentIndex = (currentIndex + 1) % cards.length;
            showCard(currentIndex);
        }

        function prevCard() {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            showCard(currentIndex);
        }

        // Initialize first card
        showCard(0);

        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextCard();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevCard();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevCard();
            if (e.key === 'ArrowRight') nextCard();
        });
    }

    // Form submission with Make.com webhook
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(this);
                
                // Send to Make.com webhook
                const response = await fetch('https://hook.eu1.make.com/your-webhook-url', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    // Show success message
                    showNotification('Order submitted successfully!', 'success');
                    this.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                showNotification('Error submitting order. Please try again.', 'error');
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Flipbook functionality
    const openFlipbook = document.getElementById('openFlipbook');
    const closeFlipbook = document.getElementById('closeFlipbook');
    const flipbookModal = document.getElementById('flipbookModal');
    const flipbook = document.getElementById('flipbook');
    const pages = document.querySelectorAll('.page');
    let currentPage = 0;

    if (openFlipbook && flipbookModal) {
        openFlipbook.addEventListener('click', () => {
            flipbookModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        closeFlipbook.addEventListener('click', () => {
            flipbookModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Page navigation
        const prevPage = document.querySelector('.prev-page');
        const nextPage = document.querySelector('.next-page');
        const pageNumber = document.querySelector('.page-number');

        if (prevPage) {
            prevPage.addEventListener('click', () => {
                if (currentPage > 0) {
                    currentPage--;
                    updateFlipbookDisplay();
                }
            });
        }

        if (nextPage) {
            nextPage.addEventListener('click', () => {
                if (currentPage < pages.length - 1) {
                    currentPage++;
                    updateFlipbookDisplay();
                }
            });
        }

        function updateFlipbookDisplay() {
            pages.forEach((page, index) => {
                page.style.display = index === currentPage ? 'block' : 'none';
            });
            if (pageNumber) {
                pageNumber.textContent = `${currentPage + 1} / ${pages.length}`;
            }
        }

        // Initialize
        updateFlipbookDisplay();
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            showNotification('Thank you for subscribing!', 'success');
            this.reset();
        });
    }

    // Mobile navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu when clicking on links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScroll(target);
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Scroll progress indicator
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }

    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Cookie consent
    function addCookieConsent() {
        if (!localStorage.getItem('cookieConsent')) {
            const notification = document.createElement('div');
            notification.className = 'cookie-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                    <button onclick="acceptCookies()">Accept</button>
                </div>
            `;
            document.body.appendChild(notification);

            // Add close functionality
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.remove();
            });
        }
    }

    // Testimonials drag functionality
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (testimonialsSlider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        testimonialsSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            testimonialsSlider.classList.add('active');
            startX = e.pageX - testimonialsSlider.offsetLeft;
            scrollLeft = testimonialsSlider.scrollLeft;
        });

        testimonialsSlider.addEventListener('mouseleave', () => {
            isDown = false;
            testimonialsSlider.classList.remove('active');
        });

        testimonialsSlider.addEventListener('mouseup', () => {
            isDown = false;
            testimonialsSlider.classList.remove('active');
        });

        testimonialsSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialsSlider.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialsSlider.scrollLeft = scrollLeft - walk;
        });

        // Touch events for mobile
        testimonialsSlider.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - testimonialsSlider.offsetLeft;
            scrollLeft = testimonialsSlider.scrollLeft;
        });

        testimonialsSlider.addEventListener('touchend', () => {
            isDown = false;
        });

        testimonialsSlider.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - testimonialsSlider.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialsSlider.scrollLeft = scrollLeft - walk;
        });

        // Prevent context menu
        testimonialsSlider.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Auto-scroll
        let autoScroll = true;
        const scrollSpeed = 1;

        setInterval(() => {
            if (autoScroll) {
                testimonialsSlider.scrollLeft += scrollSpeed;
            }
        }, 50);

        // Pause auto-scroll on hover
        testimonialsSlider.addEventListener('mouseenter', () => {
            autoScroll = false;
        });

        testimonialsSlider.addEventListener('mouseleave', () => {
            autoScroll = true;
        });

        // Reset scroll position when reaching end
        testimonialsSlider.addEventListener('scroll', () => {
            if (testimonialsSlider.scrollLeft >= testimonialsSlider.scrollWidth - testimonialsSlider.clientWidth) {
                setTimeout(() => {
                    testimonialsSlider.scrollLeft = 0;
                }, 1000);
            }
        });
    }

    // QR Code toggle functionality
    const qrToggleBtn = document.getElementById('qrToggleBtn');
    const qrCodeContainer = document.getElementById('qrCodeContainer');

    if (qrToggleBtn && qrCodeContainer) {
        qrToggleBtn.addEventListener('click', function() {
            const isVisible = qrCodeContainer.style.display !== 'none';
            qrCodeContainer.style.display = isVisible ? 'none' : 'block';
            
            const btnText = this.querySelector('.qr-btn-text');
            const btnIcon = this.querySelector('.qr-btn-icon');
            
            if (isVisible) {
                btnText.textContent = 'Show QR Code';
                btnIcon.textContent = '↓';
            } else {
                btnText.textContent = 'Hide QR Code';
                btnIcon.textContent = '↑';
            }
        });
    }

    // Real-time validation with visual feedback
    function setupFormValidation() {
        const form = document.getElementById('orderForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            // Add visual feedback classes
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', debounce(function() {
                validateField(this);
            }, 300));
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;

        // Remove existing validation classes
        field.classList.remove('valid', 'invalid');

        // Skip validation if field is empty (let blur handle required validation)
        if (!value) return;

        let isValid = true;

        switch (fieldName) {
            case 'phone':
                const thaiPhoneRegex = /^0\d{9}$/;
                isValid = thaiPhoneRegex.test(value);
                break;
            case 'postal_code':
                const postalRegex = /^[0-9]{5}$/;
                isValid = postalRegex.test(value);
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                break;
            case 'name':
                isValid = value.length >= 2;
                break;
            default:
                isValid = value.length > 0;
        }

        // Add appropriate class
        field.classList.add(isValid ? 'valid' : 'invalid');

        // Show/hide error message
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }

        if (!isValid) {
            errorElement.textContent = getErrorMessage(fieldName);
            errorElement.style.display = 'block';
        } else {
            errorElement.style.display = 'none';
        }
    }

    function getErrorMessage(fieldName) {
        const messages = {
            phone: 'Please enter a valid Thai phone number (10 digits starting with 0)',
            postal_code: 'Please enter a valid Thai postal code (5 digits)',
            email: 'Please enter a valid email address',
            name: 'Please enter your full name (at least 2 characters)',
            address_line: 'Please enter your address',
            district: 'Please enter your district',
            province: 'Please enter your province'
        };
        return messages[fieldName] || 'This field is required';
    }

    // Initialize form validation
    setupFormValidation();

    // Performance tracking
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            // Performance data available but not logged in production
        }
    });

    // Initialize cookie consent
    addCookieConsent();
});

// Global functions
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    document.querySelector('.cookie-notification')?.remove();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}
