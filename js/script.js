// Variables
let isMenuOpen = false;
let isScrolled = false;
let isDropdownOpen = false;
let selectedProjectType = '';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeCursor();
    initializeScroll();
    initializeMagnetic();
    initializeFloatingMenuMagnetic();
});

// Custom Cursor Implementation
function initializeCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;

    const handleMouseMove = (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    };

    const handleMouseEnter = () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '0.5';
    };

    const handleMouseLeave = () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .magnetic-element, [onclick], input, textarea, select');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });
}

// Scroll handling - FIXED for mobile
function initializeScroll() {
    const nav = document.querySelector('.nav');
    const floatingMenu = document.querySelector('.floating-menu');

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const newIsScrolled = scrollY > 50;
        
        if (newIsScrolled !== isScrolled) {
            isScrolled = newIsScrolled;
            nav.classList.toggle('scrolled', isScrolled);
            
            // FIXED: Remove the condition so it works on mobile too
            floatingMenu.classList.toggle('show-on-scroll', isScrolled);
        }
    };

    window.addEventListener('scroll', handleScroll);
}

// Magnetic effect for elements
function initializeMagnetic() {
    const magneticElements = document.querySelectorAll('.magnetic-element');
    
    magneticElements.forEach(element => {
        const strength = parseFloat(element.dataset.strength) || 0.3;
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            const moveX = deltaX * strength;
            const moveY = deltaY * strength;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

// Menu functions
function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    const menuOverlay = document.querySelector('.menu-overlay');
    const floatingMenu = document.querySelector('.floating-menu');
    const hamburger = document.querySelector('.hamburger');
    
    menuOverlay.classList.toggle('active', isMenuOpen);
    floatingMenu.classList.toggle('active', isMenuOpen);
    if (hamburger) {
        hamburger.classList.toggle('active', isMenuOpen);
    }
}

function closeMenu() {
    isMenuOpen = false;
    const menuOverlay = document.querySelector('.menu-overlay');
    const floatingMenu = document.querySelector('.floating-menu');
    const hamburger = document.querySelector('.hamburger');
    
    menuOverlay.classList.remove('active');
    floatingMenu.classList.remove('active');
    if (hamburger) {
        hamburger.classList.remove('active');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
}

// Dropdown functions (for contact page)
function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
    const trigger = document.querySelector('.dropdown-trigger');
    const options = document.getElementById('dropdownOptions');
    
    if (trigger && options) {
        trigger.classList.toggle('active', isDropdownOpen);
        options.classList.toggle('active', isDropdownOpen);
    }
}

function selectProject(projectType) {
    selectedProjectType = projectType;
    const selectedElement = document.getElementById('selectedProject');
    if (selectedElement) {
        selectedElement.textContent = projectType;
    }
    toggleDropdown();
    clearError('projectError');
}

function clearError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Contact form handling
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => error.classList.remove('show'));
        document.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const message = formData.get('message').trim();
        
        let hasErrors = false;
        
        // Validate name
        if (!name) {
            showError('nameError', 'Please enter your name.');
            document.querySelector('input[name="name"]').classList.add('error');
            hasErrors = true;
        }
        
        // Validate email
        if (!email || !validateEmail(email)) {
            showError('emailError', 'Please enter a valid email address.');
            document.querySelector('input[name="email"]').classList.add('error');
            hasErrors = true;
        }
        
        // Validate project type
        if (!selectedProjectType || selectedProjectType === 'Select project type') {
            showError('projectError', 'Please select a project type.');
            document.querySelector('.dropdown-trigger').classList.add('error');
            hasErrors = true;
        }
        
        // Validate message
        if (!message) {
            showError('messageError', 'Please enter a message.');
            document.querySelector('textarea[name="message"]').classList.add('error');
            hasErrors = true;
        }
        
        if (hasErrors) {
            return;
        }
        
        // Simulate form submission
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        
        if (submitBtn && submitText) {
            submitBtn.disabled = true;
            submitText.textContent = 'Sending...';
            
            // Simulate API call
            setTimeout(() => {
                alert('Thank you for your message! I will get back to you within 24 hours.');
                
                // Reset form
                this.reset();
                selectedProjectType = '';
                const selectedElement = document.getElementById('selectedProject');
                if (selectedElement) {
                    selectedElement.textContent = 'Select project type';
                }
                
                submitBtn.disabled = false;
                submitText.textContent = 'Send Message';
            }, 2000);
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-dropdown') && isDropdownOpen) {
            toggleDropdown();
        }
    });

    // Clear errors when user starts typing
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorId = this.name + 'Error';
            clearError(errorId);
        });
    });
}

// Floating menu magnetic effect
function initializeFloatingMenuMagnetic() {
    const floatingButton = document.querySelector('.floating-menu-button');
    const floatingLines = document.querySelectorAll('.floating-line');
    
    if (!floatingButton || !floatingLines.length) return;
    
    floatingButton.addEventListener('mousemove', (e) => {
        // Don't apply effect if menu is active (when lines are rotated)
        const floatingMenu = document.querySelector('.floating-menu');
        if (floatingMenu && floatingMenu.classList.contains('active')) return;
        
        const rect = floatingButton.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        // Adjust strength - lower values = less movement
        const strength = 0.3;
        const moveX = deltaX * strength;
        const moveY = deltaY * strength;
        
        // Apply movement to both lines
        floatingLines.forEach(line => {
            line.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    floatingButton.addEventListener('mouseleave', () => {
        // Reset lines to center position when mouse leaves
        floatingLines.forEach(line => {
            line.style.transform = 'translate(0px, 0px)';
        });
    });
}

// Initialize contact form if on contact page
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
});
