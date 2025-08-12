// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // FAQ toggle functionality (fallback for non-HTMX)
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = this.querySelector('.faq-icon');
            
            // Toggle answer visibility
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                icon.textContent = '+';
            } else {
                // Close all other FAQs
                faqQuestions.forEach(otherQuestion => {
                    const otherFaqItem = otherQuestion.parentElement;
                    const otherAnswer = otherFaqItem.querySelector('.faq-answer');
                    const otherIcon = otherQuestion.querySelector('.faq-icon');
                    
                    otherAnswer.style.display = 'none';
                    otherIcon.textContent = '+';
                });
                
                // Open clicked FAQ
                answer.style.display = 'block';
                icon.textContent = '−';
            }
        });
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('.submit-btn');
            const responseDiv = this.querySelector('#form-response');
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // This will be handled by HTMX, but we can add fallback behavior
            setTimeout(() => {
                submitBtn.textContent = 'Send Inquiry';
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    // Add scroll effect to header
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#1a1a1a';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add animation on scroll for cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for animation
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// HTMX event listeners
document.addEventListener('htmx:afterRequest', function(event) {
    if (event.detail.target.id.includes('form-response')) {
        const responseDiv = event.detail.target;
        
        if (event.detail.xhr.status === 200) {
            responseDiv.innerHTML = '<div class="form-response success">Thank you! Your inquiry has been sent successfully. We\'ll get back to you within 24 hours.</div>';
            
            // Reset form
            const form = responseDiv.closest('form');
            if (form) {
                form.reset();
            }
        } else {
            responseDiv.innerHTML = '<div class="form-response error">Sorry, there was an error sending your message. Please try again or contact us directly.</div>';
        }
        
        // Reset submit button
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Send Inquiry';
            submitBtn.disabled = false;
        }
    }
});

// FAQ HTMX responses
document.addEventListener('htmx:afterRequest', function(event) {
    if (event.detail.target.id.includes('faq-') && event.detail.target.id.includes('-answer')) {
        const faqItem = event.detail.target.closest('.faq-item');
        const icon = faqItem.querySelector('.faq-icon');
        
        if (event.detail.target.innerHTML.trim()) {
            icon.textContent = '−';
            event.detail.target.style.display = 'block';
        } else {
            icon.textContent = '+';
            event.detail.target.style.display = 'none';
        }
    }
});