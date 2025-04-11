document.addEventListener('DOMContentLoaded', function() {
    // Character slider functionality
    const cards = document.querySelectorAll('.character-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (cards.length && prevBtn && nextBtn) {
        let currentIndex = 0;

        function showCard(index) {
            cards.forEach(card => card.classList.remove('active'));
            cards[index].classList.add('active');
        }

        function nextCard() {
            currentIndex = (currentIndex + 1) % cards.length;
            showCard(currentIndex);
        }

        function prevCard() {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            showCard(currentIndex);
        }

        nextBtn.addEventListener('click', nextCard);
        prevBtn.addEventListener('click', prevCard);

        // Optional: Auto-slide every 5 seconds
        setInterval(nextCard, 5000);
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
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
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

function validateForm(formData) {
    const errors = [];
    
    // Thai phone number validation (starts with 0, followed by 9 digits)
    const phone = formData.get('phone');
    const thaiPhoneRegex = /^0\d{9}$/;  // Updated to exactly 10 digits (0 + 9 digits)
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
        if (!formData.get(field)) {
            errors.push(`Please enter your ${field.replace('_', ' ')}`);
        }
    });
    
    return errors;
}

// Replace the real-time validation code at the bottom of script.js with this:
document.querySelectorAll('#orderForm input').forEach(input => {
    input.addEventListener('blur', function() {
        // Only validate the specific field that was changed
        if (this.name === 'phone') {
            const phone = this.value;
            const thaiPhoneRegex = /^0\d{9}$/;
            if (!phone || !thaiPhoneRegex.test(phone)) {
                showNotification('Please enter a valid Thai phone number (10 digits starting with 0)', 'warning');
            }
        }
        else if (this.name === 'postal_code') {
            const postalCode = this.value;
            const postalRegex = /^[0-9]{5}$/;
            if (!postalCode || !postalRegex.test(postalCode)) {
                showNotification('Please enter a valid Thai postal code (5 digits)', 'warning');
            }
        }
        else if (this.name === 'email') {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'warning');
            }
        }
        else if (this.name === 'name' && this.value.trim().length < 2) {
            showNotification('Please enter your full name (at least 2 characters)', 'warning');
        }
    });
});

function addCookieConsent() {
  if (!localStorage.getItem('cookieConsent')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `