document.addEventListener('DOMContentLoaded', () => {
    const chapters = document.querySelectorAll('.chapter');
    const navLinks = document.querySelectorAll('.compass-point');

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

    function updateParallax() {
        chapters.forEach(chapter => {
            const bg = chapter.querySelector('.background-image');
            if (bg) {
                const speed = 0.15; // Slower for a heavier, more cinematic feel
                const rect = chapter.getBoundingClientRect();
                // Only animate if visible or close to viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (window.innerHeight - rect.top) * speed;
                    bg.style.transform = `translate3d(0, ${offset}px, 0)`;
                }
            }
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
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
