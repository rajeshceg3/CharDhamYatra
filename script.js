document.addEventListener('DOMContentLoaded', () => {
    // Phase 1: Graceful loader fade-out
    const loader = document.querySelector('.loader');
    // The loader is hidden by CSS/noscript if JS is off.
    // If JS is on, we proceed with the fade-out for a smooth entry.
    window.setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
        }
        document.body.classList.add('loaded');
    }, 500); // Reduced timeout for faster perceived load

    // Phase 2: Navigation and section animation observer
    const sections = document.querySelectorAll('.dham-section, .hero');
    const navLinks = document.querySelectorAll('.compass-point');

    if ('IntersectionObserver' in window) {
        // FIX (M-001): IntersectionObserver logic hardened for more precise activation.
        // This makes the active state change when a section's center crosses the viewport's center.
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const targetId = entry.target.id;

                // Animate section into view
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                
                    // Update active state of compass nav
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${targetId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    } else {
        // Fallback for very old browsers: just show everything.
        sections.forEach(section => {
            section.classList.add('visible');
        });
    }
});
