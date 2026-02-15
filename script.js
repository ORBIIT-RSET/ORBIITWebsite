// Enhanced scroll animations for all sections
document.addEventListener('DOMContentLoaded', function () {
    // Check if device is mobile/tablet
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Create intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                // Handle staggered animations for child elements
                const staggeredElements = entry.target.querySelectorAll('.stagger-1, .stagger-2, .stagger-3, .stagger-4, .stagger-5');
                staggeredElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('in-view');
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Mobile-specific animations
    if (isMobile()) {
        // Create separate observer for mobile hover effects
        const mobileHoverObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all interactive cards for mobile
        const interactiveCards = document.querySelectorAll('.card-outlined-blur, .service-card, .facility-card, .startup-card, .process-step');
        interactiveCards.forEach(card => {
            mobileHoverObserver.observe(card);
        });

        // Add staggered delays for mobile
        interactiveCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    // Handle window resize
    window.addEventListener('resize', function () {
        if (!isMobile()) {
            // Remove mobile-specific in-view classes on desktop
            document.querySelectorAll('.service-card.in-view, .facility-card.in-view, .startup-card.in-view, .process-step.in-view').forEach(card => {
                if (!card.classList.contains('animate-on-scroll')) {
                    card.classList.remove('in-view');
                }
            });
        }
    });

    // Smooth scrolling for navigation links
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

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Form submission handler (Web3Forms API)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const form = this;
            const submitBtn = form.querySelector('button[type="submit"]');
            const feedback = form.querySelector('#contact-feedback');
            const formData = new FormData(form);

            // Get form values for validation
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const message = formData.get('message').trim();

            // Basic validation
            if (!name || !email || !message) {
                feedback.style.display = 'block';
                feedback.textContent = 'Please fill in all required fields.';
                feedback.style.color = '#ff4444';
                feedback.style.backgroundColor = '#ffebee';
                feedback.style.padding = '10px';
                feedback.style.borderRadius = '4px';
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                feedback.style.display = 'block';
                feedback.textContent = 'Please enter a valid email address.';
                feedback.style.color = '#ff4444';
                feedback.style.backgroundColor = '#ffebee';
                feedback.style.padding = '10px';
                feedback.style.borderRadius = '4px';
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            feedback.style.display = 'block';
            feedback.textContent = 'Sending your message...';
            feedback.style.color = '#333';
            feedback.style.backgroundColor = '#e3f2fd';
            feedback.style.padding = '10px';
            feedback.style.borderRadius = '4px';

            try {
                // Send to Web3Forms API
                console.log('Submitting form to Web3Forms...');
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                console.log('Web3Forms API Response:', data);
                console.log('Response Status:', response.status);
                console.log('Response OK:', response.ok);

                if (response.ok && data.success) {
                    // Success
                    feedback.textContent = '✓ Message sent successfully! We\'ll get back to you soon.';
                    feedback.style.color = '#2e7d32';
                    feedback.style.backgroundColor = '#e8f5e9';
                    form.reset();

                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        feedback.style.display = 'none';
                    }, 5000);
                } else {
                    // API returned error
                    throw new Error(data.message || 'Failed to send message');
                }

            } catch (error) {
                // Error handling
                console.error('Form submission error:', error);
                feedback.textContent = '✗ Network error. Please check your connection and try again, or email us directly at orbiit@rajagiritech.edu.in';
                feedback.style.color = '#c62828';
                feedback.style.backgroundColor = '#ffebee';
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }
});

// Add parallax effect for stars (existing functionality preserved)
document.addEventListener('mousemove', function (e) {
    // Only apply on desktop
    if (window.innerWidth > 768) {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;

        const orbiitContainer = document.querySelector('.orbiit-container');
        if (orbiitContainer) {
            orbiitContainer.style.transform = `translate(-50%, -50%) 
                translateX(${mouseX * 20}px) 
                translateY(${mouseY * 20}px)`;
        }

        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            const speed = (index + 1) * 0.5;
            star.style.transform += ` 
                translateX(${mouseX * speed}px) 
                translateY(${mouseY * speed}px)`;
        });
    }
});