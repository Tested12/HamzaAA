// ===== Intersection Observer for Scroll Animations =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            
            const children = entry.target.querySelectorAll('.audience-card, .plan-card, .service-card, .feature-card, .stat-card, .market-card, .badge');
            children.forEach((child, index) => {
                child.style.animationDelay = `${index * 0.1}s`;
                child.classList.add('animate-visible');
            });
        }
    });
};

const scrollObserver = new IntersectionObserver(animateOnScroll, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        scrollObserver.observe(section);
    });

    const animatedElements = document.querySelectorAll('.audience-card, .plan-card, .service-card, .feature-card, .stat-card, .market-card, .badge');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
    });

    animateStats();
});

// ===== Animate Statistics Numbers =====
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                
                const match = text.match(/([+]?)(\d+(?:,\d+)?(?:\.\d+)?)(.*)/);
                if (match) {
                    const prefix = match[1];
                    const numberStr = match[2].replace(',', '');
                    const suffix = match[3];
                    const targetNumber = parseFloat(numberStr);
                    
                    animateNumber(target, targetNumber, prefix, suffix, numberStr.includes('.'));
                }
                
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
}

function animateNumber(element, target, prefix, suffix, hasDecimal) {
    const duration = 2500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = easeOutQuart * target;

        let displayValue;
        if (hasDecimal) {
            displayValue = current.toFixed(1);
        } else if (target >= 1000) {
            displayValue = Math.floor(current).toLocaleString('en-US');
        } else {
            displayValue = Math.floor(current);
        }

        element.textContent = `${prefix}${displayValue}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===== Add CSS for Animations =====
const style = document.createElement('style');
style.textContent = `
    .animate-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Staggered animation delays */
    .audience-card:nth-child(1), .service-card:nth-child(1), .stat-card:nth-child(1) { transition-delay: 0.1s; }
    .audience-card:nth-child(2), .service-card:nth-child(2), .stat-card:nth-child(2) { transition-delay: 0.2s; }
    .audience-card:nth-child(3), .service-card:nth-child(3), .stat-card:nth-child(3) { transition-delay: 0.3s; }
    .service-card:nth-child(4) { transition-delay: 0.4s; }
    
    .plan-card:nth-child(1), .feature-card:nth-child(1), .market-card:nth-child(1) { transition-delay: 0.1s; }
    .plan-card:nth-child(2), .feature-card:nth-child(2), .market-card:nth-child(2) { transition-delay: 0.2s; }
    .plan-card:nth-child(3), .feature-card:nth-child(3) { transition-delay: 0.3s; }
    .plan-card:nth-child(4), .feature-card:nth-child(4) { transition-delay: 0.4s; }
    
    .badge:nth-child(1) { transition-delay: 0.1s; }
    .badge:nth-child(2) { transition-delay: 0.2s; }
    .badge:nth-child(3) { transition-delay: 0.3s; }
    
    /* Card shine effect */
    .audience-card,
    .plan-card,
    .feature-card,
    .stat-card,
    .service-card {
        position: relative;
        overflow: hidden;
    }
    
    .audience-card::after,
    .plan-card::after,
    .feature-card::after,
    .stat-card::after,
    .service-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.7s ease;
        pointer-events: none;
    }
    
    .audience-card:hover::after,
    .plan-card:hover::after,
    .feature-card:hover::after,
    .stat-card:hover::after,
    .service-card:hover::after {
        left: 100%;
    }
    
    /* Smooth cursor */
    * {
        cursor: default;
    }
    
    a, button, .btn, .badge, .nav-links a {
        cursor: pointer;
    }
    
    /* Focus styles */
    .btn:focus-visible,
    input:focus-visible,
    select:focus-visible {
        outline: 2px solid #059669;
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);

// ===== Modal Functions =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function switchModal(fromModalId, toModalId) {
    closeModal(fromModalId);
    setTimeout(() => {
        openModal(toModalId);
    }, 350);
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// ===== Toggle Password Visibility =====
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.parentElement.querySelector('.toggle-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ===== Form Handlers =====
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Demo login - accept test@yahoo.com / test or any credentials
    if ((email === 'test@yahoo.com' && password === 'test') || (email && password)) {
        // Store user in session
        const user = {
            email: email,
            name: email.split('@')[0],
            loggedIn: true
        };
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        showNotification('تم تسجيل الدخول بنجاح! جاري التحويل... 👋', 'success');
        closeModal('loginModal');
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showNotification('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
    }
    
    event.target.reset();
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.getElementById('userType').value;
    
    // Store user in session
    const user = {
        name: name,
        email: email,
        phone: phone,
        userType: userType,
        loggedIn: true
    };
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    
    showNotification('تم إنشاء حسابك بنجاح! جاري التحويل... 🎉', 'success');
    closeModal('registerModal');
    
    // Redirect to dashboard after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
    
    event.target.reset();
}

// ===== Notification System =====
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    const bgColor = type === 'success' 
        ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
        : 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)';
    const shadowColor = type === 'success' 
        ? 'rgba(5, 150, 105, 0.35)' 
        : 'rgba(220, 38, 38, 0.35)';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: ${bgColor};
        color: white;
        padding: 18px 32px;
        border-radius: 100px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: 'Cairo', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        box-shadow: 0 20px 50px ${shadowColor};
        z-index: 3000;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 4000);
}

// ===== Mobile Menu =====
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    
    navLinks.classList.toggle('active');
    
    if (navLinks.classList.contains('active')) {
        menuBtn.classList.remove('fa-bars');
        menuBtn.classList.add('fa-times');
    } else {
        menuBtn.classList.remove('fa-times');
        menuBtn.classList.add('fa-bars');
    }
}

// Close mobile menu when clicking a link
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navLinksContainer = document.querySelector('.nav-links');
            const menuBtn = document.querySelector('.mobile-menu-btn i');
            
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                menuBtn.classList.remove('fa-times');
                menuBtn.classList.add('fa-bars');
            }
        });
    });
});

// ===== Header Scroll Effect =====
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// ===== Smooth Parallax on Cards =====
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.audience-card, .plan-card, .service-card, .feature-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});

// ===== Console Welcome Message =====
console.log('%c🏠 حمزة العقاري', 'color: #059669; font-size: 28px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);');
console.log('%c منصة العقارات الأولى في الأردن ✨', 'color: #6B7280; font-size: 14px; font-weight: 600;');
