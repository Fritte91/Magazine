document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.character-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
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

    // Handle file upload preview
    const fileInput = document.getElementById('paymentSlip');
    const filePreview = document.getElementById('filePreview');

    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                filePreview.innerHTML = `<img src="${e.target.result}" alt="Payment Slip Preview">`;
            }
            reader.readAsDataURL(file);
        }
    });

    // Form submission
    const orderForm = document.getElementById('orderForm');
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your form submission logic here
        // You might want to use fetch API to send the data to your server
        alert('Thank you for your order! We will process it shortly.');
    });

    // Flipbook functionality
    const openFlipbook = document.getElementById('openFlipbook');
    const closeFlipbook = document.getElementById('closeFlipbook');
    const flipbookModal = document.getElementById('flipbookModal');
    const flipbook = document.getElementById('flipbook');
    const prevPage = document.querySelector('.prev-page');
    const nextPage = document.querySelector('.next-page');
    const pageNumber = document.querySelector('.page-number');
    const pages = document.querySelectorAll('.page');
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
        pageNumber.textContent = `${index + 1} / ${pages.length}`;
    }

    prevPage.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updatePage(currentPage);
        }
    });

    nextPage.addEventListener('click', () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updatePage(currentPage);
        }
    });

    // Initialize first page
    updatePage(0);

    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        // Add your newsletter subscription logic here
        alert('Thank you for subscribing! You will receive updates about our limited editions.');
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
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

    // Add smooth scrolling for Buy Magazine buttons
    document.querySelectorAll('.btn-primary, .btn-outline').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('#shop').scrollIntoView({ 
                behavior: 'smooth'
            });
        });
    });

    // Lazy Loading Implementation
    function lazyLoad() {
        const lazyImages = document.querySelectorAll('img.lazy');
        
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

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Initialize lazy loading
    lazyLoad();

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
            }
        });
    });

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    
    function animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / 200;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 1);
        } else {
            counter.innerText = target;
        }
    }

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => counterObserver.observe(counter));
}); 