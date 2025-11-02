/**
 * Configuration File for Now Or Never Magazine Shop
 * 
 * IMPORTANT: 
 * 1. Copy this file to 'config.js' 
 * 2. Fill in your actual values
 * 3. Add 'config.js' to .gitignore to keep secrets safe
 */

const CONFIG = {
    // Make.com Webhook URL
    // Get this from your Make.com scenario after setting up the webhook module
    MAKE_WEBHOOK_URL: 'https://hook.eu2.make.com/YOUR_WEBHOOK_ID_HERE',
    
    // Alternative: Use PHP handler (if you prefer server-side processing)
    USE_PHP_HANDLER: false,
    PHP_HANDLER_URL: 'submit-order-handler.php',
    
    // Email Configuration
    EMAIL: {
        // Zoho Mail address for order notifications
        INFO_EMAIL: 'info@nowornevermagazine.com',
        ORDERS_EMAIL: 'orders@nowornevermagazine.com', // Optional separate orders email
    },
    
    // Google Sheets Configuration
    GOOGLE_SHEETS: {
        SPREADSHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',
        SHEET_NAME: 'Orders',
        // Example: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
    },
    
    // Zoho Drive Configuration
    ZOHO_DRIVE: {
        FOLDER_ID: 'YOUR_ZOHO_DRIVE_FOLDER_ID',
        FOLDER_NAME: 'Magazine Orders',
    },
    
    // Product Configuration
    PRODUCT: {
        NAME: 'Now Or Never 420 Magazine',
        PRICE: 1420,
        CURRENCY: 'THB',
        CURRENCY_SYMBOL: '฿',
    },
    
    // File Upload Settings
    UPLOAD: {
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
        MIN_FILE_SIZE: 100, // 100 bytes
        ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
        ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf'],
    },
    
    // Security Settings
    SECURITY: {
        ENABLE_RATE_LIMITING: true,
        MAX_ATTEMPTS_PER_HOUR: 5,
        ENABLE_CAPTCHA: false, // Set to true if you want to add reCAPTCHA
        CAPTCHA_SITE_KEY: '', // Get from Google reCAPTCHA
    },
    
    // UI/UX Settings
    UI: {
        REDIRECT_DELAY: 2000, // milliseconds before redirecting to thank-you page
        SHOW_ORDER_ID: true, // Show order ID in success message
        ENABLE_NOTIFICATIONS: true, // Show toast notifications
    },
    
    // Development/Testing
    DEBUG: {
        ENABLE_CONSOLE_LOGS: false, // Set to true for debugging
        TEST_MODE: false, // Set to true to disable actual submissions
        TEST_WEBHOOK_URL: 'https://webhook.site/your-test-url', // For testing
    }
};

// Export for use in scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}


