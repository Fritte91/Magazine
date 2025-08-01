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
    // Character slider functionality with improved debugging
    const cards = document.querySelectorAll('.character-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    console.log('Character slider initialization:', {
        cardsFound: cards.length,
        prevBtnFound: !!prevBtn,
        nextBtnFound: !!nextBtn
    });

    if (cards.length && prevBtn && nextBtn) {
        let currentIndex = 0;

        function showCard(index) {
            console.log('Showing card:', index);
            cards.forEach((card, i) => {
                if (i === index) {
                    card.classList.add('active');
                    card.style.display = 'grid';
                    // Update ARIA attributes for accessibility
                    card.setAttribute('aria-hidden', 'false');
                } else {
                    card.classList.remove('active');
                    card.style.display = 'none';
                    card.setAttribute('aria-hidden', 'true');
                }
            });
            
            // Update button states
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === cards.length - 1;
        }

        function nextCard() {
            currentIndex = (currentIndex + 1) % cards.length;
            showCard(currentIndex);
        }

        function prevCard() {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            showCard(currentIndex);
        }

        // Add event listeners with error handling
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next button clicked');
            nextCard();
        });

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Prev button clicked');
            prevCard();
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevCard();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextCard();
            }
        });

        // Initialize first card
        showCard(0);
    } else {
        console.error('Character slider elements not found:', {
            cards: cards.length,
            prevBtn: !!prevBtn,
            nextBtn: !!nextBtn
        });
    }

    // Form submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const errors = validateForm(formData);
            
            if (errors.length > 0) {
                errors.forEach(error => showNotification(error, 'error'));
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('.submit-order');
            submitButton.innerHTML = '<span class="loading-spinner"></span> Processing...';
            submitButton.disabled = true;
            
            try {
                // Create a new FormData without the file
                const formDataWithoutFile = new FormData();
                
                // Add all form fields except the file
                formDataWithoutFile.append('name', formData.get('name'));
                formDataWithoutFile.append('email', formData.get('email'));
                formDataWithoutFile.append('phone', formData.get('phone'));
                formDataWithoutFile.append('address_line', formData.get('address_line'));
                formDataWithoutFile.append('building', formData.get('building'));
                formDataWithoutFile.append('street', formData.get('street'));
                formDataWithoutFile.append('subdistrict', formData.get('subdistrict'));
                formDataWithoutFile.append('district', formData.get('district'));
                formDataWithoutFile.append('province', formData.get('province'));
                formDataWithoutFile.append('postal_code', formData.get('postal_code'));
                formDataWithoutFile.append('country', formData.get('country'));
                formDataWithoutFile.append('payment_confirmation', 'Customer will send payment confirmation via email');

                const response = await fetch('https://formspree.io/f/mblgrpzb', {
                    method: 'POST',
                    body: formDataWithoutFile,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Show success message
                    showNotification('Order submitted successfully! Please send your payment confirmation to our email.', 'success');
                    // Redirect to thank you page
                    window.location.href = 'thank-you.html';
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('There was an error submitting your order. Please try again.', 'error');
            } finally {
                submitButton.innerHTML = 'Complete Order';
                submitButton.disabled = false;
            }
        });
    }

    // Flipbook functionality
    const openFlipbook = document.getElementById('openFlipbook');
    const closeFlipbook = document.getElementById('closeFlipbook');
    const flipbookModal = document.getElementById('flipbookModal');
    const flipbook = document.getElementById('flipbook');
    const prevPage = document.querySelector('.prev-page');
    const nextPage = document.querySelector('.next-page');
    const pageNumber = document.querySelector('.page-number');
    const pages = document.querySelectorAll('.page');

    if (openFlipbook && closeFlipbook && flipbookModal && pages.length) {
        let currentPage = 0;

        openFlipbook.addEventListener('click', () => {
            flipbookModal.classList.add('active');
        });

        closeFlipbook.addEventListener('click', () => {
            flipbookModal.classList.remove('active');
        });

        function updatePage(index) {
            pages.forEach((page, i) => {
                if (i === index) {
                    page.style.transform = 'rotateY(0deg)';
                    page.style.zIndex = '1';
                } else {
                    page.style.transform = i < index ? 'rotateY(-180deg)' : 'rotateY(0deg)';
                    page.style.zIndex = '0';
                }
            });
            if (pageNumber) {
                pageNumber.textContent = `${index + 1} / ${pages.length}`;
            }
        }

        if (prevPage) {
            prevPage.addEventListener('click', () => {
                if (currentPage > 0) {
                    currentPage--;
                    updatePage(currentPage);
                }
            });
        }

        if (nextPage) {
            nextPage.addEventListener('click', () => {
                if (currentPage < pages.length - 1) {
                    currentPage++;
                    updatePage(currentPage);
                }
            });
        }

        // Initialize first page
        updatePage(0);
    }

    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value;
            alert('Thank you for subscribing! You will receive updates about our limited editions.');
        });
    }

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Add smooth scrolling for Buy Magazine buttons
    document.querySelectorAll('.btn-primary, .btn-outline').forEach(button => {
        button.addEventListener('click', () => {
            const shopSection = document.querySelector('#shop');
            if (shopSection) {
                shopSection.scrollIntoView({ 
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smooth scrolling for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const navToggle = document.querySelector('.nav-toggle');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to elements you want to animate
    document.querySelectorAll('.hero-content, .journey-content, .character-card, .topic-card, .journal-entry').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Handle journal article links
    document.querySelectorAll('.read-more').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if the href is not set or is #
            if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
                e.preventDefault();
                // Show a message that the article is coming soon
                showNotification('This article will be available soon!', 'info');
            }
            // If href is set, let the link work normally
        });
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const storiesPage = document.querySelector('.stories-page');

    if (themeToggle && storiesPage) { // Only run this code if elements exist
        // Check if there's a saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            storiesPage.classList.add('dark-mode');
            themeToggle.textContent = 'Switch to Light Theme';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            storiesPage.classList.toggle('dark-mode');
            
            // Update button text
            const isDark = body.classList.contains('dark-mode');
            themeToggle.textContent = isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme';
            
            // Save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Initialize form validation
    setupFormValidation();
    
    // Initialize performance tracking
    trackPerformance();
    
    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
    
    // Initialize lazy loading
    setupLazyLoading();
    
    // Initialize scroll progress and back to top
    setupScrollProgress();
    setupBackToTop();
    
    // Enhanced error handling and loading states
    function showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    function hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // Enhanced form submission with better UX
    function handleFormSubmission(form, endpoint) {
        return new Promise(async (resolve, reject) => {
            try {
                showLoading();
                
                const formData = new FormData(form);
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    resolve(result);
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                console.error('Form submission error:', error);
                reject(error);
            } finally {
                hideLoading();
            }
        });
    }

    // Enhanced image loading with lazy loading
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Enhanced performance monitoring
    function trackPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart);
                console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
            });
        }
    }
    
    // Scroll progress indicator
    function setupScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        if (!progressBar) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }
    
    // Back to top functionality
    function setupBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
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
});

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);

    // Handle close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Enhanced form validation with better user experience
function validateForm(formData) {
    const errors = [];
    
    // Thai phone number validation (starts with 0, followed by 9 digits)
    const phone = formData.get('phone');
    const thaiPhoneRegex = /^0\d{9}$/;
    if (!phone || !thaiPhoneRegex.test(phone)) {
        errors.push('Please enter a valid Thai phone number (10 digits starting with 0)');
    }
    
    // Thai postal code (5 digits)
    const postalCode = formData.get('postal_code');
    const postalRegex = /^[0-9]{5}$/;
    if (!postalCode || !postalRegex.test(postalCode)) {
        errors.push('Please enter a valid Thai postal code (5 digits)');
    }
    
    // Name validation (at least 2 characters)
    const name = formData.get('name');
    if (!name || name.trim().length < 2) {
        errors.push('Please enter your full name (at least 2 characters)');
    }
    
    // Email validation
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Required address fields
    const requiredFields = ['address_line', 'district', 'province'];
    requiredFields.forEach(field => {
        if (!formData.get(field) || formData.get(field).trim().length === 0) {
            errors.push(`Please enter your ${field.replace('_', ' ')}`);
        }
    });
    
    return errors;
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

function addCookieConsent() {
    if (!localStorage.getItem('cookieConsent')) {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <p>We use cookies to enhance your experience.</p>
            <button onclick="acceptCookies()">Accept</button>
        `;
        document.body.appendChild(banner);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    const banner = document.querySelector('.cookie-banner');
    if (banner) {
        banner.remove();
    }
}

// Initialize cookie consent
document.addEventListener('DOMContentLoaded', addCookieConsent);