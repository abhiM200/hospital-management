function initAnimations() {
  // Staggered Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('fade-in');
        
        // Handle staggered children
        const children = e.target.querySelectorAll('.animate-child, .glass-card, .quick-link-card, .expert-card, .blog-card');
        children.forEach((child, i) => {
          child.style.animationDelay = `${i * 0.15}s`;
          child.classList.add('fade-in');
        });
        
        // Count up if it's a stat
        if (e.target.classList.contains('stat-number')) {
          const target = parseInt(e.target.innerText);
          if (!isNaN(target)) countUp(e.target, target, e.target.innerText.includes('+') ? '+' : '');
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animate-on-scroll, .stat-number').forEach(el => observer.observe(el));

  // Custom Cursor Tracking
  const cursor = document.getElementById('custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
    });

    document.addEventListener('mousedown', () => cursor.style.transform += ' scale(0.8)');
    document.addEventListener('mouseup', () => cursor.style.transform = cursor.style.transform.replace(' scale(0.8)', ''));
    
    // Hover effects for links and buttons
    const hoverables = document.querySelectorAll('a, button, .interactive');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(2)';
        cursor.style.background = 'var(--accent)';
        cursor.style.opacity = '0.5';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = cursor.style.transform.replace(' scale(2)', '');
        cursor.style.background = 'var(--primary)';
        cursor.style.opacity = '1';
      });
    });
  }
}

// Count up logic
function countUp(el, target, suffix = '', duration = 1500) {
  let start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out expo
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(easeProgress * target);
    
    el.textContent = current + suffix;
    
    if (progress < 1) requestAnimationFrame(update);
  }
  
  requestAnimationFrame(update);
}

// Navbar & Scroll Effects
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
      navbar.style.padding = '10px 0';
    } else {
      navbar.classList.remove('scrolled');
      navbar.style.padding = '15px 0';
    }
  }
  
  const scrollTop = document.getElementById('scroll-top');
  if (scrollTop) {
    scrollTop.classList.toggle('visible', window.scrollY > 400);
  }
});

// Theme Management
function toggleDarkMode() {
  const html = document.documentElement;
  const currentTheme = html.dataset.theme || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  html.style.transition = 'background 0.5s ease, color 0.5s ease';
  html.dataset.theme = newTheme;
  localStorage.setItem('clinic-theme', newTheme);
  
  // Update toggle icon
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
}

// Initialize theme on load
(function() {
  const saved = localStorage.getItem('clinic-theme');
  if (saved) {
    document.documentElement.dataset.theme = saved;
    window.addEventListener('DOMContentLoaded', () => {
       const btn = document.getElementById('theme-toggle');
       if (btn) btn.innerHTML = saved === 'light' ? '🌙' : '☀️';
    });
  }
})();
