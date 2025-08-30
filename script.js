document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--x', e.clientX + 'px');
        document.documentElement.style.setProperty('--y', e.clientY + 'px');
    });

    setupCustomCursor(); // New custom cursor
    initializeAnimations();
    setupScrollEffects(); 
    init3DBackground();
    setupProjectModal();
    setupFormAnimations();
    setupTypingEffect();
});

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// --- New Custom Cursor Logic ---
function setupCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .project-card, .skill-item, .social-link, #back-to-top, .modal-close').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

function setupTypingEffect() {
    const typingTextElement = document.getElementById('typing-text');
    const phrases = ["Creative Developer", "Lifelong Learner", "UI/UX Designer", "Coder"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        let displayText = '';

        if (isDeleting) {
            displayText = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            displayText = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        if(typingTextElement) typingTextElement.textContent = displayText;
        
        let typeSpeed = isDeleting ? 75 : 150;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    if(typingTextElement) type();
}

function init3DBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.3, 100, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0x4ecdc4, wireframe: true, metalness: 0.8, roughness: 0.4 });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x8a2be2, 1.5);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);
    
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const clock = new THREE.Clock();
    const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        torusKnot.rotation.y = .2 * elapsedTime + mouseX * 0.5;
        torusKnot.rotation.x = .1 * elapsedTime - mouseY * 0.5;
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    };
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}

function setupScrollEffects() {
    const scrollProgress = document.getElementById('scrollProgress');
    const hero = document.getElementById('hero');
    const mainHeader = document.getElementById('mainHeader');
    const backToTopButton = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / docHeight) * 100;
        if(scrollProgress) scrollProgress.style.width = progress + '%';
        if (scrolled > 100) {
            mainHeader.classList.add('scrolled');
            hero.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
            hero.classList.remove('scrolled');
        }

        if (window.pageYOffset > 300) {
            if(backToTopButton) backToTopButton.classList.add('show');
        } else {
            if(backToTopButton) backToTopButton.classList.remove('show');
        }
    });
}

function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.project-card, .skill-item, .section-header, .social-link, .form-group, .submit-btn, .about-container, .timeline-item, .service-card').forEach(el => observer.observe(el));
}

function setupProjectModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.dataset.title;
            const description = card.dataset.description;
            const link = card.dataset.link;
            const imageUrl = card.dataset.image;
            
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-description').textContent = description;
            document.getElementById('modal-link').href = link;
            document.getElementById('modal-image').style.backgroundImage = `url('${imageUrl}')`;
            
            if (modal) modal.classList.add('active');
        });
    });

    function closeModal() {
        if (modal) modal.classList.remove('active');
    }

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function setupFormAnimations() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '🚀 Sending...';
            setTimeout(() => {
                submitBtn.innerHTML = '✓ Sent!';
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    e.target.reset();
                }, 2000);
            }, 1500);
        });
    }
}
