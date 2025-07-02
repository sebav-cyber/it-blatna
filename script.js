/*
 * IT Blatná - Main JavaScript File
 * Enhanced interactions, form handling, and mobile menu
 */

// ==============================
// DOM Content Loaded Event
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeFormHandling();
    initializeServiceTracking();
    initializeCTATracking();
    initializePhoneTracking();
    initializeKeyboardNavigation();
    initializePerformanceMonitoring();
    initializeLazyLoading();
    
    console.log('IT Blatná website initialized successfully');
});

// ==============================
// Mobile Menu Functionality
// ==============================
function initializeMobileMenu() {
    createMobileMenuToggle();
    handleWindowResize();
    
    window.addEventListener('resize', handleWindowResize);
}

function createMobileMenuToggle() {
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-toggle')) {
        const header = document.querySelector('.header');
        const nav = document.querySelector('.nav');
        
        if (!header || !nav) return;
        
        const hamburger = document.createElement('button');
        hamburger.className = 'mobile-menu-toggle';
        hamburger.innerHTML = '☰';
        hamburger.setAttribute('aria-label', 'Otevřít mobilní menu');
        hamburger.setAttribute('aria-expanded', 'false');
        
        // Styles for hamburger button
        Object.assign(hamburger.style, {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '5px',
            transition: 'background-color 0.3s ease'
        });

        hamburger.addEventListener('click', function() {
            toggleMobileMenu(nav, hamburger);
        });

        header.appendChild(hamburger);
    }
}

function toggleMobileMenu(nav, hamburger) {
    const isOpen = nav.style.display === 'flex';
    
    if (isOpen) {
        closeMobileMenu(nav, hamburger);
    } else {
        openMobileMenu(nav, hamburger);
    }
}

function openMobileMenu(nav, hamburger) {
    nav.style.display = 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '100%';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.background = 'rgba(15, 23, 42, 0.98)';
    nav.style.padding = '20px';
    nav.style.zIndex = '1000';
    nav.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
    
    hamburger.innerHTML = '✕';
    hamburger.setAttribute('aria-label', 'Zavřít mobilní menu');
    hamburger.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu(nav, hamburger) {
    nav.style.display = 'none';
    hamburger.innerHTML = '☰';
    hamburger.setAttribute('aria-label', 'Otevřít mobilní menu');
    hamburger.setAttribute('aria-expanded', 'false');
}

function handleWindowResize() {
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.mobile-menu-toggle');
    
    if (window.innerWidth > 768) {
        if (nav) {
            nav.style.display = 'flex';
            nav.style.position = 'static';
            nav.style.flexDirection = 'row';
            nav.style.background = 'none';
            nav.style.padding = '0';
            nav.style.borderTop = 'none';
        }
        if (hamburger) {
            hamburger.style.display = 'none';
        }
    } else {
        if (hamburger) {
            hamburger.style.display = 'block';
        }
        if (nav && !hamburger) {
            createMobileMenuToggle();
        }
    }
}

// ==============================
// Smooth Scrolling
// ==============================
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Close mobile menu if open
                const nav = document.querySelector('.nav');
                const hamburger = document.querySelector('.mobile-menu-toggle');
                if (nav && hamburger && nav.style.display === 'flex') {
                    closeMobileMenu(nav, hamburger);
                }
                
                // Smooth scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update focus for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus();
                
                // Remove tabindex after focus to not interfere with normal tab order
                setTimeout(() => {
                    target.removeAttribute('tabindex');
                }, 1000);
            }
        });
    });
}

// ==============================
// Form Handling and Validation
// ==============================
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Get form values
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const phone = form.querySelector('input[type="tel"]').value.trim();
    const company = form.querySelectorAll('input[type="text"]')[1].value.trim();
    const message = form.querySelector('textarea').value.trim();
    
    // Validation
    if (!validateForm(name, email, message)) {
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Odesílání...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Success message
        showNotification('Děkujeme za vaši poptávku! Ozveme se vám do 24 hodin na ' + email, 'success');
        
        // Track form submission
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'form_name': 'contact_form',
                'user_email': email,
                'user_name': name
            });
        }
        
        // Reset form
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
    }, 2000);
}

function validateForm(name, email, message) {
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors();
    
    // Name validation
    if (!name) {
        showFieldError('input[type="text"]', 'Jméno je povinné');
        isValid = false;
    }
    
    // Email validation
    if (!email) {
        showFieldError('input[type="email"]', 'E-mail je povinný');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('input[type="email"]', 'Zadejte platnou e-mailovou adresu');
        isValid = false;
    }
    
    // Message validation
    if (!message) {
        showFieldError('textarea', 'Zpráva je povinná');
        isValid = false;
    } else if (message.length < 10) {
        showFieldError('textarea', 'Zpráva musí obsahovat alespoň 10 znaků');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    clearFieldError(e);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Toto pole je povinné');
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Zadejte platnou e-mailovou adresu');
    }
}

function clearFieldError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.style.borderColor = '';
}

function clearAllErrors() {
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(field => {
        field.style.borderColor = '';
    });
}

function showFieldError(selector, message) {
    const field = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!field) return;
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 14px;
        margin-top: 5px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add error styling to field
    field.style.borderColor = '#ef4444';
    
    // Insert error message
    field.parentNode.appendChild(errorElement);
    
    // Focus field
    field.focus();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// ==============================
// Analytics and Tracking
// ==============================
function initializeServiceTracking() {
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h3').textContent;
            
            // Google Analytics event tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'service_click', {
                    'service_name': serviceName,
                    'service_position': index + 1
                });
            }
            
            // Show service detail modal (placeholder)
            showServiceDetail(serviceName);
        });
    });
}

function initializeCTATracking() {
    document.querySelectorAll('.cta-button, .btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            const section = this.closest('section');
            
            // Google Analytics event tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'button_text': buttonText,
                    'button_location': section?.id || 'header'
                });
            }
        });
    });
}

function initializePhoneTracking() {
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'phone_number': phoneNumber
                });
            }
        });
    });
}

// ==============================
// Keyboard Navigation
// ==============================
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            const nav = document.querySelector('.nav');
            const hamburger = document.querySelector('.mobile-menu-toggle');
            
            if (nav && hamburger && nav.style.display === 'flex') {
                closeMobileMenu(nav, hamburger);
                hamburger.focus();
            }
        }
        
        // Enter or Space on service cards
        if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.service-card')) {
            e.preventDefault();
            e.target.closest('.service-card').click();
        }
    });

    // Tab trap for mobile menu
    document.addEventListener('keydown', function(e) {
        const nav = document.querySelector('.nav');
        const hamburger = document.querySelector('.mobile-menu-toggle');
        
        if (e.key === 'Tab' && nav && nav.style.display === 'flex') {
            const focusableElements = nav.querySelectorAll('a');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// ==============================
// Performance Monitoring
// ==============================
function initializePerformanceMonitoring() {
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            // Send to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    'load_time': loadTime,
                    'page_url': window.location.href
                });
            }
            
            // Log performance data
            console.log(`Page load time: ${loadTime}ms`);
            
            // Warn if load time is slow
            if (loadTime > 3000) {
                console.warn('Page load time is over 3 seconds. Consider optimization.');
            }
        }
    });

    // Monitor largest contentful paint
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'lcp', {
                        'value': Math.round(lastEntry.startTime)
                    });
                }
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('Performance monitoring not supported');
        }
    }
}

// ==============================
// Lazy Loading Implementation
// ==============================
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        
                        // Remove observer after loading
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// ==============================
// Service Detail Modal
// ==============================
function showServiceDetail(serviceName) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    modal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        animation: slideUp 0.3s ease;
    `;
    
    // Modal content
    modal.innerHTML = `
        <button class="modal-close" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #64748b;">&times;</button>
        <h3 style="margin-bottom: 20px; color: #0f172a; font-size: 28px;">${serviceName}</h3>
        <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">
            Více informací o této službě najdete v naší detailní dokumentaci nebo nás kontaktujte pro osobní konzultaci.
        </p>
        <div style="margin-top: 30px;">
            <a href="#contact" class="btn-primary" style="margin-right: 15px;">Získat nabídku</a>
            <a href="tel:+420601087528" class="btn-secondary">Zavolat</a>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeModal();
    });
    
    // ESC key to close
    document.addEventListener('keydown', function handleEsc(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    });
    
    function closeModal() {
        overlay.style.animation = 'fadeOut 0.3s ease';
        modal.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }
    
    // Focus management
    closeBtn.focus();
}

// ==============================
// Utility Functions
// ==============================
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==============================
// Scroll-based Animations
// ==============================
function initializeScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for animation
        document.querySelectorAll('.service-card, .feature-item, .contact-option').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(el);
        });
    }
}

// ==============================
// Dark Mode Toggle (Optional)
// ==============================
function initializeDarkModeToggle() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
    }
    
    // Create toggle button (uncomment if needed)
    /*
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '🌙';
    toggleButton.className = 'dark-mode-toggle';
    toggleButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        backdrop-filter: blur(10px);
    `;
    
    toggleButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.innerHTML = isDark ? '☀️' : '🌙';
    });
    
    document.body.appendChild(toggleButton);
    */
}

// ==============================
// Error Handling
// ==============================
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'javascript_error', {
            'error_message': e.message,
            'error_filename': e.filename,
            'error_lineno': e.lineno
        });
    }
});

// ==============================
// Service Worker Registration (PWA)
// ==============================
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed');
                });
        });
    }
}

// ==============================
// Add CSS animations
// ==============================
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(30px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideDown {
            from { 
                opacity: 1;
                transform: translateY(0);
            }
            to { 
                opacity: 0;
                transform: translateY(30px);
            }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-10px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(300px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(300px);
            }
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Lazy loading styles */
        img.lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        img.loaded {
            opacity: 1;
        }
    `;
    
    document.head.appendChild(style);
}

// ==============================
// Initialize everything
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    addAnimationStyles();
    initializeScrollAnimations();
    // initializeDarkModeToggle(); // Uncomment if needed
    // initializeServiceWorker(); // Uncomment for PWA features
});

// ==============================
// Export functions for global access
// ==============================
window.ITBlatna = {
    showNotification,
    showServiceDetail,
    toggleMobileMenu: function() {
        const nav = document.querySelector('.nav');
        const hamburger = document.querySelector('.mobile-menu-toggle');
        if (nav && hamburger) {
            toggleMobileMenu(nav, hamburger);
        }
    }
};

/*
 * IT Blatná - Cookie Banner Management
 * GDPR Compliant Cookie Consent Manager
 */

// Cookie Banner JavaScript Class
class CookieManager {
    constructor() {
        this.cookieName = 'itblatna_cookie_consent';
        this.consentDuration = 365; // days
        this.categories = {
            necessary: true, // always true
            analytics: false,
            marketing: false
        };
        
        this.init();
    }

    init() {
        // Check if consent already exists
        const existingConsent = this.getConsent();
        
        if (existingConsent) {
            this.categories = { ...this.categories, ...existingConsent };
            this.updateUI();
            this.applyCookieSettings();
        } else {
            // Show banner after short delay
            setTimeout(() => {
                this.showBanner();
            }, 1000);
        }
    }

    showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('show');
        }
    }

    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
        }
    }

    showModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.add('show');
            this.updateModalToggles();
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.remove('show');
            
            // Restore body scroll
            document.body.style.overflow = 'auto';
        }
    }

    updateModalToggles() {
        // Update analytics toggle
        const analyticsToggle = document.getElementById('analytics-toggle');
        const analyticsLabel = document.getElementById('analytics-label');
        
        if (analyticsToggle && analyticsLabel) {
            if (this.categories.analytics) {
                analyticsToggle.classList.add('active');
                analyticsLabel.textContent = 'Aktivní';
            } else {
                analyticsToggle.classList.remove('active');
                analyticsLabel.textContent = 'Neaktivní';
            }
        }

        // Update marketing toggle
        const marketingToggle = document.getElementById('marketing-toggle');
        const marketingLabel = document.getElementById('marketing-label');
        
        if (marketingToggle && marketingLabel) {
            if (this.categories.marketing) {
                marketingToggle.classList.add('active');
                marketingLabel.textContent = 'Aktivní';
            } else {
                marketingToggle.classList.remove('active');
                marketingLabel.textContent = 'Neaktivní';
            }
        }
    }

    toggleCategory(category) {
        if (category === 'necessary') return; // Cannot toggle necessary cookies
        
        this.categories[category] = !this.categories[category];
        this.updateModalToggles();
    }

    acceptAll() {
        this.categories = {
            necessary: true,
            analytics: true,
            marketing: true
        };
        
        this.saveConsent();
        this.hideBanner();
        this.hideModal();
        this.applyCookieSettings();
        
        this.showNotification('Všechny cookies byly přijaty', 'success');
    }

    rejectAll() {
        this.categories = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        
        this.saveConsent();
        this.hideBanner();
        this.hideModal();
        this.applyCookieSettings();
        
        this.showNotification('Pouze nezbytné cookies jsou aktivní', 'info');
    }

    saveSelected() {
        this.saveConsent();
        this.hideBanner();
        this.hideModal();
        this.applyCookieSettings();
        
        this.showNotification('Nastavení cookies bylo uloženo', 'success');
    }

    saveConsent() {
        const consent = {
            ...this.categories,
            timestamp: Date.now(),
            version: '1.0'
        };
        
        // Save to localStorage
        try {
            localStorage.setItem(this.cookieName, JSON.stringify(consent));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
        
        // Also save as cookie for server-side access
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (this.consentDuration * 24 * 60 * 60 * 1000));
        
        try {
            document.cookie = `${this.cookieName}=${JSON.stringify(consent)}; expires=${expiryDate.toUTCString()}; path=/; secure; samesite=strict`;
        } catch (e) {
            console.warn('Could not save cookie:', e);
        }
    }

    getConsent() {
        try {
            const stored = localStorage.getItem(this.cookieName);
            if (stored) {
                const consent = JSON.parse(stored);
                
                // Check if consent is still valid (not older than consent duration)
                const consentAge = Date.now() - consent.timestamp;
                const maxAge = this.consentDuration * 24 * 60 * 60 * 1000;
                
                if (consentAge < maxAge) {
                    return consent;
                }
            }
        } catch (e) {
            console.warn('Could not parse cookie consent:', e);
        }
        return null;
    }

    clearConsent() {
        try {
            localStorage.removeItem(this.cookieName);
        } catch (e) {
            console.warn('Could not clear localStorage:', e);
        }
        
        try {
            document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        } catch (e) {
            console.warn('Could not clear cookie:', e);
        }
        
        // Reset categories
        this.categories = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        
        this.updateUI();
        this.applyCookieSettings();
        
        // Show banner again
        setTimeout(() => {
            this.showBanner();
        }, 500);
    }

    applyCookieSettings() {
        // Google Analytics
        if (this.categories.analytics) {
            this.enableGoogleAnalytics();
        } else {
            this.disableGoogleAnalytics();
        }

        // Marketing cookies
        if (this.categories.marketing) {
            this.enableMarketingCookies();
        } else {
            this.disableMarketingCookies();
        }

        // Update Google Consent Mode if available
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                analytics_storage: this.categories.analytics ? 'granted' : 'denied',
                ad_storage: this.categories.marketing ? 'granted' : 'denied'
            });
        }
    }

    enableGoogleAnalytics() {
        // This is where you would initialize Google Analytics
        console.log('✅ Google Analytics enabled');
        
        // Example GA4 initialization - UNCOMMENT AND REPLACE 'GA_MEASUREMENT_ID' WHEN READY
        
        if (!window.gtag) {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
            document.head.appendChild(script);
            
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID', {
                anonymize_ip: true,
                cookie_flags: 'secure;samesite=strict'
            });
        }
        
    }

    disableGoogleAnalytics() {
        console.log('❌ Google Analytics disabled');
        
        // Disable GA tracking
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                analytics_storage: 'denied'
            });
        }
    }

    enableMarketingCookies() {
        console.log('✅ Marketing cookies enabled');
        // Initialize marketing tools (Facebook Pixel, etc.)
    }

    disableMarketingCookies() {
        console.log('❌ Marketing cookies disabled');
        // Disable marketing tools
    }

    updateUI() {
        // Update any UI elements based on consent
        this.updateModalToggles();
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.cookie-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `cookie-notification cookie-notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10002;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}



<!-- Google Analytics placeholder dořešit při napojeni -->

    
// Initialize Cookie Manager
let cookieManager;

// Initialize when DOM is loaded
function initializeCookieManager() {
    if (!cookieManager) {
        cookieManager = new CookieManager();
    }
}

// Global functions for buttons
function showCookieBanner() {
    if (cookieManager) {
        cookieManager.showBanner();
    }
}

function showCookieModal() {
    if (cookieManager) {
        cookieManager.showModal();
    }
}

function hideCookieModal() {
    if (cookieManager) {
        cookieManager.hideModal();
    }
}

function acceptAllCookies() {
    if (cookieManager) {
        cookieManager.acceptAll();
    }
}

function rejectAllCookies() {
    if (cookieManager) {
        cookieManager.rejectAll();
    }
}

function saveSelectedCookies() {
    if (cookieManager) {
        cookieManager.saveSelected();
    }
}

function toggleCookieCategory(category) {
    if (cookieManager) {
        cookieManager.toggleCategory(category);
    }
}

function clearCookiePreferences() {
    if (cookieManager) {
        cookieManager.clearConsent();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeCookieManager();
});

// Close modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('cookie-modal');
    if (e.target === modal) {
        hideCookieModal();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideCookieModal();
    }
});

// Add to existing ITBlatna global object if it exists
if (typeof window.ITBlatna !== 'undefined') {
    window.ITBlatna.cookieManager = cookieManager;
    window.ITBlatna.showCookieModal = showCookieModal;
    window.ITBlatna.clearCookiePreferences = clearCookiePreferences;
}
