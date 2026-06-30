/* ============================================
   WIARM MEDIA PRODUCTION — PREMIUM JS
   ============================================ */

'use strict';

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    document.body.style.overflow = '';
    initCounters();
  }, 2000);
});

document.body.style.overflow = 'hidden';

/* ---- LANGUAGE SYSTEM ---- */
let currentLang = 'ar';

function switchLang(lang) {
  currentLang = lang;
  const body = document.body;

  if (lang === 'en') {
    body.classList.add('lang-en');
    body.classList.remove('lang-ar');
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
    document.getElementById('lang-toggle').textContent = 'AR';
  } else {
    body.classList.add('lang-ar');
    body.classList.remove('lang-en');
    document.documentElement.setAttribute('lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');
    document.getElementById('lang-toggle').textContent = 'EN';
  }

  // Switch all text content
  document.querySelectorAll('[data-ar][data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.textContent = text;
  });

  // Switch placeholders
  document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(el => {
    const ph = el.getAttribute(`data-${lang}-placeholder`);
    if (ph) el.setAttribute('placeholder', ph);
  });

  // Switch select options
  document.querySelectorAll('select option[data-ar][data-en]').forEach(opt => {
    const text = opt.getAttribute(`data-${lang}`);
    if (text) opt.textContent = text;
  });

  // Switch form labels that live inside elements with data attrs
  document.querySelectorAll('.plan-price span[data-ar]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.textContent = text;
  });
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  switchLang(currentLang === 'ar' ? 'en' : 'ar');
});

/* ---- NAVBAR ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

/* ---- HAMBURGER / MOBILE MENU ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
});

function closeMobile() {
  menuOpen = false;
  mobileMenu.classList.remove('open');
}

/* ---- MOUSE GLOW ---- */
const mouseGlow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', e => {
  if (mouseGlow) {
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top = e.clientY + 'px';
  }
}, { passive: true });

/* ---- PARTICLES ---- */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3 - 0.1;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.7
      ? `rgba(255,51,102,${this.alpha})`
      : Math.random() > 0.5
        ? `rgba(124,58,237,${this.alpha})`
        : `rgba(255,255,255,${this.alpha * 0.5})`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

animateParticles();

/* ---- SCROLL REVEAL ---- */
const revealEls = document.querySelectorAll('.reveal, .reveal-right');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

/* ---- ANIMATED COUNTERS ---- */
function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  statNums.forEach(el => {
    const target = +el.getAttribute('data-target');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 16);
  });
}

/* ---- FAQ ACCORDION ---- */
function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.faq-arrow').textContent = '+';
  });

  if (!isOpen) {
    item.classList.add('open');
    item.querySelector('.faq-arrow').textContent = '×';
  }
}

/* ---- TESTIMONIAL SLIDER ---- */
let currentSlide = 0;
const track = document.getElementById('testimonials-track');
const dots = document.querySelectorAll('.dot');
const totalSlides = document.querySelectorAll('.testimonial-slide').length;

function goToSlide(n) {
  currentSlide = (n + totalSlides) % totalSlides;

  const isRTL = document.documentElement.dir === 'rtl';

  track.style.transform = `translateX(${currentSlide * -100 * (isRTL ? -1 : 1)}%)`;

  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

document.getElementById('next-slide').addEventListener('click', () => goToSlide(currentSlide + 1));
document.getElementById('prev-slide').addEventListener('click', () => goToSlide(currentSlide - 1));
dots.forEach((d, i) => d.addEventListener('click', () => goToSlide(i)));

// Auto-play
setInterval(() => goToSlide(currentSlide + 1), 5000);

/* ---- PORTFOLIO FILTERS ---- */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.portfolio-card').forEach(card => {
      const cat = card.getAttribute('data-cat');
      if (filter === 'all' || cat === filter) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = '';
        }, 50);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- FORM SUBMIT ---- */
function submitForm() {
  const fields = ['f-name', 'f-email', 'f-message'];
  let valid = true;

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) {
      el.style.borderColor = '#ff3366';
      valid = false;
      setTimeout(() => { el.style.borderColor = ''; }, 2000);
    }
  });

  if (!valid) return;

  const btn = document.querySelector('.btn-submit');
  const original = btn.textContent;
  btn.textContent = currentLang === 'ar' ? '✓ تم الإرسال!' : '✓ Sent!';
  btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
  }, 3000);
}

/* ---- PARALLAX ON HERO ORBS ---- */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orbs = document.querySelectorAll('.hero-orb');
  orbs.forEach((orb, i) => {
    const speed = 0.1 + i * 0.05;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
}, { passive: true });

/* ---- SERVICE CARD MOUSE GLOW ---- */
document.querySelectorAll('.service-card, .why-card, .pricing-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,51,102,0.08), rgba(255,255,255,0.03))`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ---- INIT PLACEHOLDERS ---- */
document.querySelectorAll('[data-ar-placeholder]').forEach(el => {
  el.setAttribute('placeholder', el.getAttribute('data-ar-placeholder'));
});
