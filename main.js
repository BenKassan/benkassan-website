// Ben Kassan Personal Website - JavaScript

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        nav.style.background = 'rgba(10, 10, 11, 0.95)';
    } else {
        nav.style.background = 'rgba(10, 10, 11, 0.8)';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for reveal animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, observerOptions);

// Add reveal class and observe elements
document.querySelectorAll('.section-inner, .timeline-item, .project-card, .leadership-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// Add revealed styles
const style = document.createElement('style');
style.textContent = `
    .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Stagger animation for timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
});

// Stagger animation for project cards
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Typing effect for code window (optional enhancement)
const codeContent = document.querySelector('.code-content code');
if (codeContent) {
    const originalHTML = codeContent.innerHTML;

    // Only run typing effect on first load
    if (!sessionStorage.getItem('codeTyped')) {
        codeContent.innerHTML = '';
        let charIndex = 0;
        const plainText = originalHTML.replace(/<[^>]*>/g, '');

        // Skip typing animation for now - just show content
        codeContent.innerHTML = originalHTML;
        sessionStorage.setItem('codeTyped', 'true');
    }
}

// Parallax effect for gradient orbs
window.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add active state to nav links based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = '#3b82f6';
        }
    });
});

// Console easter egg
console.log(`
%c Ben Kassan %c
%c AI Builder | Penn '27 | Strategy & Automation %c

Interested in working together?
Email: bkassan@sas.upenn.edu

Built with Claude Code
`,
'background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 20px; padding: 10px 20px; border-radius: 5px;',
'',
'color: #a1a1aa; font-size: 12px;',
''
);
