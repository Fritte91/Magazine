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
    let currentPage = 0;

    openFlipbook.addEventListener('click', () => {
        flipbookModal.classList.add('active');
    });

    closeFlipbook.addEventListener('click', () => {
        flipbookModal.classList.remove('active');
    });

    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        // Add your newsletter subscription logic here
        alert('Thank you for subscribing! You will receive updates about our limited editions.');
    });
}); 