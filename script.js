window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.remove();
        }, 1500); // Remove after transition finishes
    }
});

class SoundEngine {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0; // Starts muted
        this.isPlaying = false;

        // Procedural generators
        this.noiseGenerator = null;
        this.noiseFilter = null;
        this.droneOscillators = [];
        this.droneGain = this.ctx.createGain();
        this.droneGain.connect(this.masterGain);
        this.droneGain.gain.value = 0;

        this.noiseGain = this.ctx.createGain();
        this.noiseGain.connect(this.masterGain);
        this.noiseGain.gain.value = 0;

        this.initProceduralAudio();
    }

    initProceduralAudio() {
        // 1. Noise Generator for Wind/Water
        const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        this.noiseGenerator = this.ctx.createBufferSource();
        this.noiseGenerator.buffer = noiseBuffer;
        this.noiseGenerator.loop = true;

        this.noiseFilter = this.ctx.createBiquadFilter();
        this.noiseFilter.type = 'lowpass';
        this.noiseFilter.frequency.value = 400; // Start with low, rumbling frequency

        this.noiseGenerator.connect(this.noiseFilter);
        this.noiseFilter.connect(this.noiseGain);

        this.noiseGenerator.start();

        // 2. Drone Generators (Mystical hum)
        const freqs = [108, 111, 216]; // Ohm-related frequencies roughly
        freqs.forEach(freq => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;

            const panner = this.ctx.createStereoPanner();
            panner.pan.value = (Math.random() * 2 - 1) * 0.5; // Spread slightly

            const oscGain = this.ctx.createGain();
            oscGain.gain.value = 0.1 / freqs.length; // Balance volume

            osc.connect(panner);
            panner.connect(oscGain);
            oscGain.connect(this.droneGain);

            osc.start();
            this.droneOscillators.push(osc);
        });
    }

    toggle() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        this.isPlaying = !this.isPlaying;

        // Fade in/out
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        if (this.isPlaying) {
            this.masterGain.gain.linearRampToValueAtTime(1, now + 1); // 1 sec fade in
        } else {
            this.masterGain.gain.linearRampToValueAtTime(0, now + 1); // 1 sec fade out
        }
        return this.isPlaying;
    }

    setChapterAudio(chapterId) {
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        this.noiseFilter.frequency.cancelScheduledValues(now);
        this.noiseFilter.Q.cancelScheduledValues(now);
        this.droneGain.gain.cancelScheduledValues(now);
        this.noiseGain.gain.cancelScheduledValues(now);

        const fadeTime = 2; // Crossfade duration

        switch (chapterId) {
            case 'hero':
            case 'arrival':
            case 'footer':
                // Focus on mystical drone, very subtle wind
                this.droneGain.gain.linearRampToValueAtTime(0.5, now + fadeTime);
                this.noiseGain.gain.linearRampToValueAtTime(0.1, now + fadeTime);
                this.noiseFilter.frequency.linearRampToValueAtTime(200, now + fadeTime); // Low rumble
                break;
            case 'yamunotri':
            case 'kedarnath':
                // High altitude: High, biting wind
                this.droneGain.gain.linearRampToValueAtTime(0.1, now + fadeTime);
                this.noiseGain.gain.linearRampToValueAtTime(0.6, now + fadeTime);
                this.noiseFilter.type = 'bandpass';
                this.noiseFilter.frequency.linearRampToValueAtTime(800, now + fadeTime);
                this.noiseFilter.Q.linearRampToValueAtTime(1.5, now + fadeTime);
                break;
            case 'gangotri':
            case 'badrinath':
                // River/Water: Deeper, roaring white noise
                this.droneGain.gain.linearRampToValueAtTime(0.2, now + fadeTime);
                this.noiseGain.gain.linearRampToValueAtTime(0.7, now + fadeTime);
                this.noiseFilter.type = 'lowpass';
                this.noiseFilter.frequency.linearRampToValueAtTime(600, now + fadeTime);
                this.noiseFilter.Q.linearRampToValueAtTime(0.5, now + fadeTime);
                break;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic (Only for non-touch devices)
    const customCursor = document.getElementById('custom-cursor');
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    if (customCursor && !isTouchDevice) {
        let cursorX = window.innerWidth / 2;
        let cursorY = window.innerHeight / 2;
        let targetX = cursorX;
        let targetY = cursorY;

        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        function updateCursor() {
            // Smooth interpolation
            cursorX += (targetX - cursorX) * 0.2;
            cursorY += (targetY - cursorY) * 0.2;

            // Check if we have hover class, only translate to not override scale via JS
            const isHover = customCursor.classList.contains('hover');

            // Remove transform from CSS transitions and apply directly here
            if (isHover) {
                customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(2.5) translate(-20%, -20%)`;
            } else {
                customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            }
            requestAnimationFrame(updateCursor);
        }
        requestAnimationFrame(updateCursor);
    } else if (customCursor && isTouchDevice) {
        customCursor.style.display = 'none';
    }

    // Sound Engine Initialization
    let soundEngine = null;
    const soundToggle = document.getElementById('sound-toggle');
    const soundIconOn = soundToggle?.querySelector('.sound-icon-on');
    const soundIconOff = soundToggle?.querySelector('.sound-icon-off');

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            if (!soundEngine) {
                soundEngine = new SoundEngine();
            }

            const isPlaying = soundEngine.toggle();
            soundToggle.setAttribute('aria-pressed', isPlaying);

            if (isPlaying) {
                if (soundIconOn) soundIconOn.style.display = 'block';
                if (soundIconOff) soundIconOff.style.display = 'none';

                // Trigger current chapter audio immediately
                const activeNav = document.querySelector('.compass-point.active');
                if (activeNav) {
                    const id = activeNav.getAttribute('href').substring(1);
                    soundEngine.setChapterAudio(id);
                } else {
                    soundEngine.setChapterAudio('hero');
                }
            } else {
                if (soundIconOn) soundIconOn.style.display = 'none';
                if (soundIconOff) soundIconOff.style.display = 'block';
            }
        });
    }

    // Add hover states to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .compass-point, .legend-toggle');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (customCursor) customCursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            if (customCursor) customCursor.classList.remove('hover');
        });
    });

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

                    // Update ambient audio if playing
                    if (soundEngine && soundEngine.isPlaying) {
                        soundEngine.setChapterAudio(id);
                    }
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
