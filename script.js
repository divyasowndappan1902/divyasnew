// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile Mobile Menu Toggle
// (Logic moved to DOMContentLoaded event below to prevent duplicate toggling)

// Intersection Observer for Reveal-on-Scroll with staggered delay
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }, index * 100); // Stagger
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .fade-in, .section-title, .stat-card').forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
    observer.observe(el);
});

// Particle Background Generator
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const container = document.createElement('div');
    container.className = 'particle-container';
    container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:hidden;';
    hero.appendChild(container);

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--accent-color);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5};
            box-shadow: 0 0 10px var(--accent-color);
            animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
        `;
        container.appendChild(particle);
    }
}

// Add particle keyframes dynamic injection or update styles.css
// Initialize application state
document.addEventListener('DOMContentLoaded', () => {
    // Detect and save the current theme flow for logout context
    const isLightTheme = document.body.classList.contains('light-theme') || document.documentElement.classList.contains('light-theme');
    localStorage.setItem('last_site_theme', isLightTheme ? 'light' : 'dark');

    // Load initial authentication state
    checkGlobalAuth();
    handlePreloader();

    createParticles();

    // Stats count up trigged by observer
    const statsContainer = document.querySelector('.stat-grid');
    if (statsContainer) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                document.querySelectorAll('.stat-card h2').forEach(stat => {
                    const targetText = stat.innerText;
                    const target = parseFloat(targetText);
                    const isPercentage = targetText.includes('%');
                    const isK = targetText.includes('k');

                    let count = 0;
                    const updateCount = () => {
                        const increment = target / 30;
                        if (count < target) {
                            count += increment;
                            stat.innerText = (count.toFixed(isPercentage ? 1 : 0)) + (isK ? 'k' : '') + (isPercentage ? '%' : '');
                            setTimeout(updateCount, 30);
                        } else {
                            stat.innerText = targetText;
                        }
                    };
                    updateCount();
                });
                statsObserver.unobserve(statsContainer);
            }
        });
        statsObserver.observe(statsContainer);
    }
});

// Removed global button redirect to prevent unintended navigation on pagination buttons.
// Individual buttons can have explicit navigation logic as needed.

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            // After transition finishes, remove from DOM so it doesn't block clicks
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000); // 1 second display
    }
});

// Mobile Nav Logic Enhancements
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Simple burger animate
            const spans = mobileToggle.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
                spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
                spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(5px, -6px)' : 'none';
            }

            // Assign index variables for animation delay
            const links = navLinks.querySelectorAll('a, .dropdown');
            links.forEach((link, idx) => {
                link.style.setProperty('--i', idx + 1);
            });
        });
    }
});

// --- Toast Notification ---
function showAuthToast(message) {
    const toast = document.getElementById('auth-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(80px)';
    }, 3000);
}

// --- 404 Dummy Interactions ---
function handleDummyDiagnostic(btn) {
    const logText = document.getElementById('error-log-text');
    if (!logText || btn.disabled) return;

    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Scanning...';

    const steps = [
        '[SCANNING] Checking sector 7G...',
        '[SCANNING] verifying neural-link protocols...',
        '[FAIL] Integrity check failed: Path permanently offline.',
        '[ADVISORY] Re-establishing hub connection recommended.'
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < steps.length) {
            logText.innerHTML += `<br>[${new Date().toLocaleTimeString().split(' ')[0]}] ${steps[i]}`;
            i++;
        } else {
            clearInterval(interval);
            btn.textContent = 'Diagnostic Complete';
            btn.style.borderColor = '#ff3e3e';
            btn.style.color = '#ff3e3e';
            showAuthToast('❌ Diagnostic: Node Unrecoverable.');

            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = originalText;
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 3000);
        }
    }, 800);
}

// --- Expanded 404 Dummy Actions ---
function handleNavigationWithDummy(event, target) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    showAuthToast(`📡 Resonating with ${target}... Attempting Re-sync.`);

    // Visual feedback for navigation
    event.currentTarget.style.opacity = '0.5';
    event.currentTarget.style.pointerEvents = 'none';

    setTimeout(() => {
        window.location.href = href;
    }, 600);
}

function handleDummyAction(btn, type) {
    const logText = document.getElementById('error-log-text');
    if (!logText || btn.disabled) return;

    btn.disabled = true;
    const oldText = btn.textContent;
    btn.textContent = 'EXECUTING...';

    let result = '';
    let toastMsg = '';

    const timeStr = new Date().toLocaleTimeString().split(' ')[0];

    switch (type) {
        case 'FORCE_SYNC':
            result = `[${timeStr}] [WARN] Timing variance detected. Hub reject.`;
            toastMsg = '⚠️ Hub synchronization failed.';
            break;
        case 'BYPASS_FW':
            result = `[${timeStr}] [CRITICAL] Firewall Layer-7 active. Access denied.`;
            toastMsg = '❌ Security Override Failed.';
            break;
        case 'DECRYPT_PATH':
            result = `[${timeStr}] [INFO] Node encrypted with Quantum-Key. Decryption impossible.`;
            toastMsg = '🔑 Decryption Key Required.';
            break;
    }

    setTimeout(() => {
        logText.innerHTML += `<br>${result}`;
        btn.textContent = oldText;
        btn.disabled = false;
        showAuthToast(toastMsg);
    }, 1200);
}

// Global hook for 404 nav dead-ends
window.addEventListener('DOMContentLoaded', () => {
    // 1. Specific logic for 404 page nav and "Return to Hub" (Re-syncing navigation)
    document.querySelectorAll('.nav-links a, .logo, .btn-home, a[href="index.html"]').forEach(link => {
        const linkText = link.textContent.trim().toLowerCase();
        const isReturnToHub = linkText === 'return to hub' || linkText.includes('return to hub');
        
        if (isReturnToHub || (window.location.href.includes('404.html') && linkText !== 'sign in' && !link.hasAttribute('onclick'))) {
            link.addEventListener('click', (e) => {
                handleNavigationWithDummy(e, linkText.includes('return to hub') ? 'Hub' : linkText);
            });
        }
    });

    // 2. Global "Dummy Link" Interceptor for the entire site
    // This catches links that point to "#" or "index.html" but are NOT the primary logo or home navigation
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        // Skip auth buttons and "Return to Hub" to avoid interfering with navigation
        const linkText = link.textContent.trim().toLowerCase();
        if (linkText === 'sign in' || linkText === 'log out' || 
            linkText === 'return to hub' || linkText.includes('← return to hub') ||
            link.classList.contains('premium-logout-btn') || 
            link.classList.contains('auth-state-active') ||
            link.classList.contains('premium-user-btn')) {
            return;
        }

        const href = link.getAttribute('href');
        const isPlaceholder = href === '#' || href === 'javascript:void(0)';

        // Target content links that just reload index.html (placeholders)
        // But exclude the LOGO and the HOME link in the header to allow basic navigation
        const isNavHome = link.closest('nav') || link.closest('footer');
        const isDummyHome = (href === 'index.html' || href === 'index2.html') && !link.classList.contains('logo') && !isNavHome;

        if (isPlaceholder || isDummyHome) {
            e.preventDefault();
            window.location.href = "404.html";
            // Just let the link act naturally or do nothing if it's #
            // e.preventDefault();
            // window.location.href = '404.html';
        }
    });
});
