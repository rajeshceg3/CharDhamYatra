window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.remove();
        }, 1500); // Remove after transition finishes
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const chapters = document.querySelectorAll('.chapter');
    const navLinks = document.querySelectorAll('.compass-point');

    // Refined Typography Animations
    const titlesAndLocations = document.querySelectorAll('.title, .location');
    titlesAndLocations.forEach(el => {
        const text = el.textContent;
        el.textContent = ''; // Clear existing
        const words = text.split(' ');
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + (index < words.length - 1 ? ' ' : '');
            // Limit delay class to 20 to avoid missing CSS classes
            const delayClass = `delay-${Math.min(index + 1, 20)}`;
            span.className = `split-word ${delayClass}`;
            el.appendChild(span);
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Keep observing to allow re-trigger? No, CSS handles it.
                // If we want it to run once:
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    chapters.forEach(chapter => {
        observer.observe(chapter);
    });

    if ('IntersectionObserver' in window) {
        // FIX (M-001): IntersectionObserver logic hardened for more precise activation.
        // This makes the active state change when a section's center crosses the viewport's center.
        const navObserverOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');

                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, navObserverOptions);

        chapters.forEach(chapter => {
            navObserver.observe(chapter);
        });
    }

    // Parallax Effect
    let ticking = false;
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        // Normalize mouse coordinates from -1 to 1
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    function updateParallax() {
        chapters.forEach(chapter => {
            const wrapper = chapter.querySelector('.parallax-wrapper');
            if (wrapper) {
                const speed = 0.15; // Slower for a heavier, more cinematic feel
                const rect = chapter.getBoundingClientRect();
                // Only animate if visible or close to viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (window.innerHeight - rect.top) * speed;
                    const mouseOffsetX = mouseX * 15;
                    const mouseOffsetY = mouseY * 15;
                    wrapper.style.transform = `translate3d(${mouseOffsetX}px, ${offset + mouseOffsetY}px, 0)`;
                }
            }
        });
        ticking = false;
    }

    const ambientScrollIndicator = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        if (ambientScrollIndicator) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            ambientScrollIndicator.style.width = `${scrollPercent}%`;
        }

        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    // Legend Toggle
    const legendToggles = document.querySelectorAll('.legend-toggle');
    legendToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

            toggle.setAttribute('aria-expanded', !isExpanded);
            content.classList.toggle('expanded');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Tour Logic
    const tourSteps = ['hero', 'arrival', 'yamunotri', 'gangotri', 'kedarnath', 'badrinath', 'footer'];
    let currentStep = 0;

    const startBtn = document.getElementById('start-tour-btn');
    const nextBtn = document.getElementById('tour-next-btn');
    const exitBtn = document.getElementById('tour-exit-btn');
    const tourControls = document.querySelector('.tour-controls');
    const tourProgress = document.querySelector('.tour-progress');

    function updateTourUI() {
        if (!tourProgress || !nextBtn) return;

        // Use +1 for 1-based index for display
        tourProgress.textContent = `Step ${currentStep + 1} of ${tourSteps.length}`;

        if (currentStep >= tourSteps.length - 1) {
            nextBtn.textContent = 'Finish Journey';
        } else {
            // Get the name of the next section for better context
            const nextId = tourSteps[currentStep + 1];
            // Simple mapping or just "Next: [Name]"
            const nameMap = {
                'hero': 'Start',
                'arrival': 'Arrival',
                'yamunotri': 'Yamunotri',
                'gangotri': 'Gangotri',
                'kedarnath': 'Kedarnath',
                'badrinath': 'Badrinath',
                'footer': 'Conclusion'
            };
            const nextName = nameMap[nextId] || 'Next Step';
            nextBtn.textContent = `Proceed to ${nextName}`;
        }
    }

    function startTour() {
        document.body.classList.add('tour-active');
        tourControls.classList.add('visible');
        currentStep = 0;
        // Immediately move to the first actual content section (Arrival)
        nextStep();
    }

    function nextStep() {
        currentStep++;

        if (currentStep >= tourSteps.length) {
            endTour();
            return;
        }

        const targetId = tourSteps[currentStep];
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        updateTourUI();
    }

    function endTour() {
        document.body.classList.remove('tour-active');
        tourControls.classList.remove('visible');
        currentStep = 0;
    }

    if (startBtn) {
        startBtn.addEventListener('click', startTour);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextStep);
    }

    if (exitBtn) {
        exitBtn.addEventListener('click', endTour);
    }
});
