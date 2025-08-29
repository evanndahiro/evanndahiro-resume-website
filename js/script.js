// ===== MAIN APPLICATION SCRIPT =====

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFormValidation();
    initializeSmoothScrolling();
});

/**
 * ===== NAVIGATION FUNCTIONALITY =====
 * Handles mobile menu toggle and responsive navigation
 */
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu on hamburger click
    hamburger.addEventListener('click', function() {
        toggleMobileMenu(hamburger, navMenu);
    });

    // Close mobile menu when nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu(hamburger, navMenu);
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            closeMobileMenu(hamburger, navMenu);
        }
    });

    // Handle escape key to close mobile menu
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu(hamburger, navMenu);
            hamburger.focus(); // Return focus to hamburger button
        }
    });
}

/**
 * Toggle mobile navigation menu
 * @param {Element} hamburger - Hamburger button element
 * @param {Element} navMenu - Navigation menu element
 */
function toggleMobileMenu(hamburger, navMenu) {
    const isActive = navMenu.classList.contains('active');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Update ARIA attributes for accessibility
    hamburger.setAttribute('aria-expanded', !isActive);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isActive ? 'hidden' : '';
}

/**
 * Close mobile navigation menu
 * @param {Element} hamburger - Hamburger button element
 * @param {Element} navMenu - Navigation menu element
 */
function closeMobileMenu(hamburger, navMenu) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

/**
 * ===== SMOOTH SCROLLING =====
 * Adds smooth scrolling behavior to navigation links
 */
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset to account for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * ===== FORM VALIDATION =====
 * Handles client-side form validation with real-time feedback
 */
function initializeFormValidation() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Add real-time validation on input blur
    nameInput.addEventListener('blur', () => validateName(nameInput));
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
    messageInput.addEventListener('blur', () => validateMessage(messageInput));

    // Add input event listeners to clear errors when user starts typing
    nameInput.addEventListener('input', () => clearError(nameInput));
    emailInput.addEventListener('input', () => clearError(emailInput));
    messageInput.addEventListener('input', () => clearError(messageInput));

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const isNameValid = validateName(nameInput);
        const isEmailValid = validateEmail(emailInput);
        const isMessageValid = validateMessage(messageInput);
        
        if (isNameValid && isEmailValid && isMessageValid) {
            handleFormSubmission(form);
        }
    });
}

/**
 * Validate name field
 * @param {Element} input - Name input element
 * @returns {boolean} - Validation result
 */
function validateName(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('name-error');
    
    if (value === '') {
        showError(input, errorElement, 'Name is required');
        return false;
    } else if (value.length < 2) {
        showError(input, errorElement, 'Name must be at least 2 characters');
        return false;
    }
    
    clearError(input);
    return true;
}

/**
 * Validate email field
 * @param {Element} input - Email input element
 * @returns {boolean} - Validation result
 */
function validateEmail(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('email-error');
    
    // Email regex pattern for basic validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (value === '') {
        showError(input, errorElement, 'Email is required');
        return false;
    } else if (!emailPattern.test(value)) {
        showError(input, errorElement, 'Please enter a valid email address');
        return false;
    }
    
    clearError(input);
    return true;
}

/**
 * Validate message field
 * @param {Element} input - Message input element
 * @returns {boolean} - Validation result
 */
function validateMessage(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('message-error');
    
    if (value === '') {
        showError(input, errorElement, 'Message is required');
        return false;
    } else if (value.length < 10) {
        showError(input, errorElement, 'Message must be at least 10 characters');
        return false;
    }
    
    clearError(input);
    return true;
}

/**
 * Display validation error
 * @param {Element} input - Input element
 * @param {Element} errorElement - Error message element
 * @param {string} message - Error message
 */
function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.setAttribute('aria-live', 'polite');
}

/**
 * Clear validation error
 * @param {Element} input - Input element
 */
function clearError(input) {
    const errorElement = document.getElementById(input.name + '-error');
    input.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.removeAttribute('aria-live');
    }
}

/**
 * Handle successful form submission
 * @param {Element} form - Form element
 */
function handleFormSubmission(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Provide user feedback
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form processing (replace with actual form handling)
    setTimeout(() => {
        alert('Thank you for your message! I\'ll get back to you soon.');
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1000);
}

/**
 * ===== SCROLL EFFECTS =====
 * Add header background on scroll
 */
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.borderBottomColor = 'rgba(229, 231, 235, 1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.borderBottomColor = 'rgba(229, 231, 235, 0.8)';
    }
});

/**
 * ===== IMAGE ERROR HANDLING =====
 * Graceful handling of missing images
 */
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // For profile image, add a fallback background
            if (this.classList.contains('profile-img')) {
                this.style.background = 'linear-gradient(135deg, #14b8a6, #0891b2)';
                this.style.display = 'block';
            }
        });
    });
});

/**
 * ===== PERFORMANCE OPTIMIZATION =====
 * Debounced scroll handler for better performance
 */
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

// Apply debounced scroll handler
const debouncedScrollHandler = debounce(function() {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.borderBottomColor = 'rgba(229, 231, 235, 1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.borderBottomColor = 'rgba(229, 231, 235, 0.8)';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);