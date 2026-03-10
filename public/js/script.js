// ===== DOM Elements =====
const hamburger = document.getElementById('hamburgerMenu');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const body = document.body;
const navbar = document.querySelector('.navbar');
const contactForm = document.getElementById('contactForm');

// ===== Mobile Menu Toggle =====
function toggleMenu() {
    if (!mobileMenu || !menuOverlay) return;

    mobileMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';

    if (hamburger) {
        const hamburgerIcon = hamburger.querySelector('i');
        if (hamburgerIcon) {
            hamburgerIcon.classList.toggle('fa-bars');
            hamburgerIcon.classList.toggle('fa-times');
        }
    }
}

if (hamburger) hamburger.addEventListener('click', toggleMenu);
if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

// Close menu when clicking link
document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu?.classList.contains('active')) toggleMenu();
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && mobileMenu?.classList.contains('active')) {
        toggleMenu();
    }
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Contact Form Handling =====
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
            contactForm.reset();
        } catch {
            showNotification('Something went wrong. Please try again or call us directly.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== Notification System =====
function showNotification(message, type = 'success') {

    document.querySelector('.notification')?.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);

    const timeout = setTimeout(() => hideNotification(notification), 5000);

    notification.querySelector('.notification-close')
        .addEventListener('click', () => {
            clearTimeout(timeout);
            hideNotification(notification);
        });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
}

// ===== Sticky Navigation =====
let lastScroll = 0;

window.addEventListener('scroll', () => {

    if (!navbar) return;

    const currentScroll = window.pageYOffset;

    navbar.style.boxShadow = currentScroll > 50
        ? '0 2px 20px rgba(0,0,0,0.1)'
        : '0 2px 10px rgba(0,0,0,0.1)';

    if (window.innerWidth <= 768) {
        navbar.style.transform =
            (currentScroll > lastScroll && currentScroll > 200)
                ? 'translateY(-100%)'
                : 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// ===== Active Navigation Highlight =====
function setActiveNavLink() {

    const currentPath = window.location.pathname;

    document.querySelectorAll('.nav-links a, .mobile-nav-links a')
        .forEach(link => {

            const href = link.getAttribute('href');

            if (
                href === currentPath ||
                (currentPath === '/' && href === '/')
            ) {
                link.classList.add('active');
            }
            else if (currentPath.includes(href) && href !== '/') {
                link.classList.add('active');
            }
            else {
                link.classList.remove('active');
            }
        });
}

setActiveNavLink();

// ===== Counter Animation =====
function animateCounter(el, start, end, duration) {

    let startTime = null;

    function step(timestamp) {

        if (!startTime) startTime = timestamp;

        const progress = Math.min((timestamp - startTime) / duration, 1);

        el.textContent = Math.floor(progress * (end - start) + start);

        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

// ===== Counter Animation =====
function animateCounter(el, start, end, duration, suffix = '') {
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        
        // Add the suffix back
        el.textContent = currentValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            // Ensure final value is exactly the target with suffix
            el.textContent = end + suffix;
        }
    }

    requestAnimationFrame(step);
}

// ===== Stats Observer =====
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.querySelectorAll('.stat-number, .tech-number')
            .forEach(stat => {
                const originalText = stat.textContent;
                
                // Check what suffix the number has
                let suffix = '';
                let num = 0;
                
                if (originalText.includes('K+')) {
                    suffix = 'K+';
                    num = parseInt(originalText.replace('K+', ''));
                } else if (originalText.includes('+')) {
                    suffix = '+';
                    num = parseInt(originalText.replace('+', ''));
                } else {
                    num = parseInt(originalText);
                }
                
                if (!isNaN(num) && num > 0) {
                    // Set to 0 with suffix for starting point
                    stat.textContent = '0' + suffix;
                    animateCounter(stat, 0, num, 2000, suffix);
                }
            });

        statsObserver.unobserve(entry.target);
    });
}, { threshold: 0.5 });

// Observe stats sections
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hero-stats, .technician-stats')
        .forEach(section => {
            if (section) statsObserver.observe(section);
        });
});

// ===== Back to Top Button =====
function createBackToTopButton() {

    const button = document.createElement('button');

    button.className = 'back-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        button.classList.toggle('show', window.pageYOffset > 300);
    });

    button.addEventListener('click', () =>
        window.scrollTo({ top: 0, behavior: 'smooth' })
    );
}

if (document.body.scrollHeight > window.innerHeight * 2)
    createBackToTopButton();

// ===== Phone Number Formatting =====
const phoneInput = document.getElementById('phone');

if (phoneInput) {
    phoneInput.addEventListener('input', e => {

        let v = e.target.value.replace(/\D/g, '');

        if (v.length > 6)
            v = `${v.slice(0,3)} ${v.slice(3,6)} ${v.slice(6,10)}`;
        else if (v.length > 3)
            v = `${v.slice(0,3)} ${v.slice(3)}`;

        e.target.value = v;
    });
}

// ===== WhatsApp Click Tracking =====
document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]')
    .forEach(link => {
        link.addEventListener('click', () =>
            console.log('WhatsApp link clicked')
        );
    });

// ===== Page Animations =====
document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('section').forEach((section, i) => {
        section.style.animation = `fadeInUp 0.6s ease forwards ${i * 0.1}s`;
    });

    // ===== Business Hours Indicator =====
    const today = new Date().getDay();
    const hoursRow = document.querySelector(".location-content h3");

    if (hoursRow) {

        const status = today === 6
            ? "<span style='color:red;'>(Closed Today)</span>"
            : "<span style='color:green;'>(Open Today)</span>";

        hoursRow.insertAdjacentHTML("beforeend", ` ${status}`);
    }
});

// ===== Error Handling =====
window.addEventListener('error', e =>
    console.error('Page error:', e.error)
);

// ===== Performance Monitoring =====
window.addEventListener('load', () => {

    if (!('performance' in window)) return;

    const timing = performance.getEntriesByType('navigation')[0];

    console.log(
        'Page load time:',
        timing.loadEventEnd - timing.loadEventStart,
        'ms'
    );
});

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thanks! Your message has been sent. 📬');
    this.reset();
});