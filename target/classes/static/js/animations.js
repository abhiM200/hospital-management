function initAnimations() {
  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('fade-in');
        e.target.querySelectorAll('.animate-child').forEach((child, i) => {
          child.style.animationDelay = `${i * 0.1}s`;
          child.classList.add('fade-in');
        });
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // Count up
  window.countUp = function(el, target, suffix = '', duration = 2000) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start) + suffix;
      }
    }, 16);
  };
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  
  const scrollTop = document.getElementById('scroll-top');
  if (scrollTop) scrollTop.classList.toggle('visible', window.scrollY > 300);
});

// Particles
function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 15 + 5;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.animation = `float ${Math.random() * 5 + 5}s infinite ease-in-out`;
    p.style.animationDelay = `${Math.random() * 5}s`;
    hero.appendChild(p);
  }
}

// Dark mode
function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.dataset.theme === 'dark';
  html.dataset.theme = isDark ? 'light' : 'dark';
  localStorage.setItem('theme', html.dataset.theme);
}
