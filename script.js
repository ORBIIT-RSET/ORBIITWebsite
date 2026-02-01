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

    // Form submission handler (wired to Formspree)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const form = this;
            const submitBtn = form.querySelector('button[type="submit"]');
            const feedback = form.querySelector('#contact-feedback');
            const name = form.querySelector('#name').value.trim();
            const email = form.querySelector('#email').value.trim();
            const subject = form.querySelector('#subject').value.trim();
            const message = form.querySelector('#message').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                feedback.style.display = 'block';
                feedback.textContent = 'Please fill in all required fields.';
                feedback.style.color = 'var(--danger-color, #c00)';
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                feedback.style.display = 'block';
                feedback.textContent = 'Please enter a valid email address.';
                feedback.style.color = 'var(--danger-color, #c00)';
                return;
            }

            // Redirect to Gmail via mailto
            const receiver = "orbiit@rajagiritech.edu.in";
            const mailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            const mailtoLink = `mailto:${receiver}?subject=${encodeURIComponent(subject || 'New Message from Website')}&body=${encodeURIComponent(mailBody)}`;

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Redirecting...';
                feedback.style.display = 'block';
                feedback.textContent = 'Opening your email client...';
                feedback.style.color = '#333';

                // Open the mail client
                window.location.href = mailtoLink;

                // Reset form after a delay
                setTimeout(() => {
                    form.reset();
                    feedback.textContent = 'Message details redirected to email client.';
                    feedback.style.color = 'var(--success-color, #0a0)';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }, 2000);

            } catch (err) {
                feedback.textContent = 'Error redirecting to email client.';
                feedback.style.color = 'var(--danger-color, #c00)';
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