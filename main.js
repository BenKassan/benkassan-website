// Ben Kassan — Personal Site interactions

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Smooth scroll for anchors ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const id = anchor.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
        // close mobile menu after navigating
        document.getElementById('nav').classList.remove('open');
    });
});

/* ---------- Nav: scrolled state + scroll progress ---------- */
const nav = document.getElementById('nav');
const progress = document.getElementById('scrollProgress');

function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 30);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = docHeight > 0 ? `${(y / docHeight) * 100}%` : '0%';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu toggle ---------- */
const navToggle = document.getElementById('navToggle');
if (navToggle) {
    navToggle.addEventListener('click', () => nav.classList.toggle('open'));
}

/* ---------- Active nav link via IntersectionObserver ---------- */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id], header[id]');

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => navObserver.observe(s));

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll(
    '.section-inner > *, .timeline-item, .project-card, .radar-points li, .hero-content > *, .hero-visual'
);
revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min((i % 6) * 0.06, 0.4)}s`;
});

const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Animated count-up for stats ---------- */
function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        const val = target * eased;
        el.textContent = val.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }) + suffix;
    }
    requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (prefersReduced) {
                const el = entry.target;
                const decimals = parseInt(el.dataset.decimals || '0', 10);
                el.textContent = parseFloat(el.dataset.count).toLocaleString('en-US', {
                    minimumFractionDigits: decimals, maximumFractionDigits: decimals
                }) + (el.dataset.suffix || '');
            } else {
                animateCount(entry.target);
            }
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-value[data-count]').forEach(el => statObserver.observe(el));

/* ---------- Cursor glow + card spotlight (desktop, fine pointer) ---------- */
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (canHover && !prefersReduced) {
    const glow = document.getElementById('cursorGlow');
    let raf = null;
    window.addEventListener('mousemove', e => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
            glow.style.opacity = '1';
            raf = null;
        });
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

    // Parallax orbs
    const orbs = document.querySelectorAll('.gradient-orb');
    window.addEventListener('mousemove', e => {
        const mx = e.clientX / window.innerWidth - 0.5;
        const my = e.clientY / window.innerHeight - 0.5;
        orbs.forEach((orb, i) => {
            const s = (i + 1) * 18;
            orb.style.translate = `${mx * s}px ${my * s}px`;
        });
    });

    // Card spotlight
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });
}

/* ---------- Console easter egg ---------- */
console.log(
    `%c Ben Kassan %c\n%c Building Radar Autonomy · AI Builder · Penn '27 \n\nLike what you see? Let's talk → bkassan@sas.upenn.edu`,
    'background: linear-gradient(135deg,#6366f1,#22d3ee); color:#fff; font-size:20px; padding:10px 18px; border-radius:8px; font-weight:700;',
    '',
    'color:#a4a8b6; font-size:12px;'
);
