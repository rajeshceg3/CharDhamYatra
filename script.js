document.addEventListener('DOMContentLoaded', () => {
    const chapters = document.querySelectorAll('.chapter');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Optional: remove class to re-trigger animation on scroll up
                // entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    chapters.forEach(chapter => {
        observer.observe(chapter);
    });

    // Parallax Effect
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        chapters.forEach(chapter => {
            const bg = chapter.querySelector('.background-image');
            if (bg) {
                const speed = 0.2;
                const rect = chapter.getBoundingClientRect();
                // Only animate if visible or close to viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (window.innerHeight - rect.top) * speed;
                    bg.style.transform = `translateY(${offset}px)`;
                }
            }
        });
    });
});
