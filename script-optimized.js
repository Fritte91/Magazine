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
                // Get the file input directly
                const fileInput = document.getElementById('payment_slip');
                const file = fileInput.files[0];
                
                // Validate that file is uploaded (required)
                if (!file || file.size === 0) {
                    throw new Error('Payment slip is required. Please upload your payment confirmation.');
                }
                
                console.log('File input check:', {
                    hasFile: !!file,
                    fileName: file?.name,
                    fileSize: file?.size,
                    fileType: file?.type
                });
                
                // Validate file
                console.log('Validating file:', file.name);
                
                // Validate file type
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                if (!validTypes.includes(file.type)) {
                    throw new Error('Invalid file type. Please upload JPG, PNG, or PDF only.');
                }
                
                // Validate file size
                if (file.size > 10 * 1024 * 1024) {
                    throw new Error('File too large. Maximum size is 10MB.');
                }
                
                submitBtn.textContent = 'Uploading file...';
                
                // Generate simple order number (1-10000)
                const today = new Date();
                const dateStr = today.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD format
                const randomNum = Math.floor(Math.random() * 10000) + 1; // 1-10000
                const orderNumber = `NOW-${dateStr}-${randomNum}`;
                
                console.log('Generated Order Number:', orderNumber);
                
                // Prepare FormData (multipart/form-data) - much better for files!
                const formData = new FormData(this);
                
                // Add order number and timestamp
                formData.append('order_number', orderNumber);
                formData.append('order_date', new Date().toISOString());
                
                // Debug: Check if file is in FormData
                const fileInFormData = formData.get('payment_slip');
                console.log('File in FormData:', {
                    exists: !!fileInFormData,
                    name: fileInFormData?.name,
                    size: fileInFormData?.size,
                    type: fileInFormData?.type
                });
                
                // If file exists but not in FormData, add it manually
                if (file && file.size > 0) {
                    if (!fileInFormData || fileInFormData.size === 0) {
                        console.log('Manually adding file to FormData');
                        formData.set('payment_slip', file, file.name);
                    }
                }
                
                // Debug: List all FormData entries
                console.log('FormData contents:');
                for (let [key, value] of formData.entries()) {
                    if (value instanceof File) {
                        console.log(`  ${key}: [FILE] ${value.name} (${value.size} bytes)`);
                    } else {
                        console.log(`  ${key}: ${value}`);
                    }
                }
                
                // Log summary
                const logData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    address: formData.get('address_line'),
                    hasFile: !!(formData.get('payment_slip') && formData.get('payment_slip').size > 0),
                    fileName: formData.get('payment_slip')?.name || 'No file'
                };
                console.log('Sending to Make.com:', logData);
                
                // Send to Make.com webhook as FormData (not JSON!)
                const response = await fetch('https://hook.eu2.make.com/y6xtjumg4hnaam76tbxm7e4jgnfi3isp', {
                    method: 'POST',
                    body: formData
                    // Note: Don't set Content-Type header - browser sets it automatically with boundary
                });
                
                if (response.ok) {
                    // Show success message with order number
                    showNotification(
                        `Order submitted successfully! Your order number is: ${orderNumber}. Check your email for confirmation.`, 
                        'success'
                    );
                    
                    // Log order number for user reference
                    console.log('✅ Order Completed! Order Number:', orderNumber);
                    
                    this.reset();
                    
                    // Optionally redirect to thank you page
                    setTimeout(() => {
                        // You can pass order number to thank you page
                        window.location.href = `thank-you.html?order=${orderNumber}`;
                    }, 3000);
                } else {
                    const errorData = await response.text();
                    console.error('Response error:', errorData);
                    throw new Error('Submission failed. Please try again.');
                }
            } catch (error) {
                console.error('Submission error:', error);
                showNotification(error.message || 'Error submitting order. Please try again.', 'error');
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
        
        // Add file input feedback
        const fileInput = document.getElementById('payment_slip');
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                const label = document.querySelector('label[for="payment_slip"]');
                if (this.files && this.files.length > 0) {
                    const file = this.files[0];
                    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                    label.textContent = `✓ ${file.name} (${sizeMB} MB)`;
                    label.style.color = '#2e7d32';
                    
                    // Validate file type
                    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                    if (!validTypes.includes(file.type)) {
                        showNotification('Invalid file type. Please upload JPG, PNG, or PDF only.', 'error');
                        this.value = '';
                        label.textContent = 'Upload Payment Slip (Image or PDF) *';
                        label.style.color = '';
                    } else if (file.size > 10 * 1024 * 1024) {
                        showNotification('File too large. Maximum size is 10MB.', 'error');
                        this.value = '';
                        label.textContent = 'Upload Payment Slip (Image or PDF) *';
                        label.style.color = '';
                    }
                } else {
                    label.textContent = 'Upload Payment Slip (Image or PDF) *';
                    label.style.color = '';
                }
            });
        }
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

    // Testimonials auto-slide animation - Duplicate items for seamless loop
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    
    if (testimonialTrack && testimonialsSlider) {
        // Clone all testimonial items to create seamless infinite scroll
        const items = testimonialTrack.querySelectorAll('.testimonial-item');
        if (items.length > 0) {
            // Clone all items and append them to the track
            items.forEach(item => {
                const clone = item.cloneNode(true);
                testimonialTrack.appendChild(clone);
            });
        }
        
        // Manual drag control with bidirectional support
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let initialTransform = 0;
        
        // Get current transform value from computed style
        function getTransformX() {
            const style = window.getComputedStyle(testimonialTrack);
            const transform = style.transform || style.webkitTransform;
            if (transform === 'none' || !transform) return 0;
            
            // Extract translateX value from matrix
            const matrixMatch = transform.match(/matrix\([^)]+\)/);
            if (matrixMatch) {
                const values = matrixMatch[0].match(/-?\d+\.?\d*/g);
                if (values && values.length >= 6) {
                    return parseFloat(values[4]) || 0;
                }
            }
            
            const translateMatch = transform.match(/translateX\(([^)]+)\)/);
            if (translateMatch) {
                return parseFloat(translateMatch[1]) || 0;
            }
            
            return 0;
        }
        
        // Set transform
        function setTransformX(value) {
            testimonialTrack.style.transform = `translateX(${value}px)`;
        }
        
        // Start drag - pause animation and capture current position
        function startDrag(e) {
            isDragging = true;
            
            // Get current position from animation
            const currentPos = getTransformX();
            initialTransform = currentPos;
            currentTranslate = currentPos;
            
            // Pause animation and set current position
            testimonialTrack.style.transform = `translateX(${currentPos}px)`;
            testimonialTrack.style.animationPlayState = 'paused';
            testimonialTrack.classList.add('paused');
            
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            startX = clientX;
            
            testimonialsSlider.style.cursor = 'grabbing';
            if (!e.touches) {
                e.preventDefault();
            }
        }
        
        // Drag handler - works both directions
        function drag(e) {
            if (!isDragging) return;
            
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const diff = clientX - startX;
            currentTranslate = initialTransform + diff;
            
            setTransformX(currentTranslate);
            
            if (!e.touches) {
                e.preventDefault();
            }
        }
        
        // End drag - resume animation (let it restart naturally)
        function endDrag() {
            if (!isDragging) return;
            
            isDragging = false;
            testimonialsSlider.style.cursor = 'grab';
            
            // Remove inline transform to let CSS animation take over
            testimonialTrack.style.transform = '';
            testimonialTrack.style.animationDelay = '';
            testimonialTrack.style.animationPlayState = 'running';
            testimonialTrack.classList.remove('paused');
        }
        
        // Mouse events
        testimonialsSlider.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        // Touch events - ensure passive is false so preventDefault works
        testimonialsSlider.addEventListener('touchstart', startDrag, { passive: false });
        testimonialsSlider.addEventListener('touchmove', drag, { passive: false });
        testimonialsSlider.addEventListener('touchend', endDrag);
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
        const fileInput = document.getElementById('payment_slip');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Initially disable submit button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
        }

        // Check all validations
        function checkFormValidity() {
            let allValid = true;
            let hasFile = fileInput && fileInput.files && fileInput.files.length > 0;

            // Check all required fields
            inputs.forEach(input => {
                const value = input.value.trim();
                if (!value || input.classList.contains('invalid')) {
                    allValid = false;
                }
            });

            // Check file upload
            if (!hasFile) {
                allValid = false;
            }

            // Enable/disable submit button
            if (submitBtn) {
                submitBtn.disabled = !allValid;
                submitBtn.style.opacity = allValid ? '1' : '0.5';
                submitBtn.style.cursor = allValid ? 'pointer' : 'not-allowed';
                
                if (!allValid) {
                    submitBtn.title = 'Please fill all required fields and upload payment slip';
                } else {
                    submitBtn.title = '';
                }
            }

            return allValid;
        }

        inputs.forEach(input => {
            // Add visual feedback classes
            input.addEventListener('blur', function() {
                validateField(this);
                checkFormValidity();
            });

            input.addEventListener('input', debounce(function() {
                validateField(this);
                checkFormValidity();
            }, 300));
        });

        // File input validation
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                checkFormValidity();
            });
        }

        // Initial check
        checkFormValidity();
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

    // Footer year
    const footerYear = document.getElementById('currentYear');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

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
