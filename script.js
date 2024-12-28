// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive features
    initializeNavigation();
    initializeProjects();
    initializeFormValidation();
    initializeLightbox();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('nav ul');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', 
                navToggle.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
            );
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu after clicking
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

// Projects filtering and lightbox
function initializeProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (filterButtons.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                filterProjects(category);
            });
        });
    }
}

function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach(project => {
        const projectCategory = project.dataset.category;
        if (category === 'all' || projectCategory === category) {
            project.style.display = 'block';
            // Add fade-in animation
            project.style.animation = 'fadeIn 0.5s ease-in';
        } else {
            project.style.display = 'none';
        }
    });
}

// Lightbox functionality
function initializeLightbox() {
    const projectImages = document.querySelectorAll('.project-card img');
    
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
            <img src="" alt="">
        </div>
    `;
    document.body.appendChild(lightbox);

    // Add click handlers to project images
    projectImages.forEach(image => {
        image.addEventListener('click', () => {
            const lightboxImg = lightbox.querySelector('img');
            lightboxImg.src = image.src;
            lightboxImg.alt = image.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    const closeButton = lightbox.querySelector('.lightbox-close');
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Keyboard accessibility
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Form validation
function initializeFormValidation() {
    const form = document.querySelector('#contact form');
    const inputs = form.querySelectorAll('input, textarea');

    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });

        input.addEventListener('input', () => {
            // Remove error states while typing
            const errorElement = input.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
            input.classList.remove('error');
        });
    });

    // Form submission
    form.addEventListener('submit', e => {
        e.preventDefault();
        let isValid = true;

        // Validate all inputs
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Message sent successfully!';
            form.appendChild(successMessage);

            // Reset form
            form.reset();

            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        }
    });
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Validation rules
    switch (input.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
        case 'text':
            if (value.length < 2) {
                errorMessage = 'Please enter at least 2 characters';
                isValid = false;
            }
            break;
        case 'textarea':
            if (value.length < 10) {
                errorMessage = 'Please enter at least 10 characters';
                isValid = false;
            }
            break;
    }

    if (!value) {
        errorMessage = 'This field is required';
        isValid = false;
    }

    // Show error message if validation failed
    if (!isValid) {
        input.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        input.parentElement.appendChild(errorElement);
    } else {
        input.classList.remove('error');
    }

    return isValid;
}

// Debug helper function
function debug(message, data = null) {
    const debugMode = false; // Set to true to enable debugging
    if (debugMode) {
        console.log(`Debug: ${message}`, data || '');
    }
}