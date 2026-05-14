const routes = {
  '/': () => loadPage('home'),
  '/about': () => loadPage('about'),
  '/treatments': () => loadPage('treatments'),
  '/book': () => loadPage('book'),
  '/portal': () => loadPage('portal'),
  '/admin': () => loadPage('admin'),
  '/blog': () => loadPage('blog'),
  '/contact': () => loadPage('contact'),
  '/ai-suite': () => loadPage('ai-suite')
};

// Also handle dynamic routes like /blog/slug
function getRouteHandler(path) {
  if (routes[path]) return routes[path];
  if (path.startsWith('/blog/')) return () => loadPage('blog-post', path.split('/').pop());
  if (path.startsWith('/admin/')) return () => loadPage('admin', path.split('/')[2]);
  return routes['/'];
}

function navigate(path, pushState = true) {
  if (pushState) window.history.pushState({}, '', path);
  
  const handler = getRouteHandler(path);
  document.getElementById('app').innerHTML = '<div class="initial-loader"><div class="spinner"></div></div>';
  
  try {
    if (typeof handler === 'function') {
      handler();
    } else {
      console.error('No handler found for route:', path);
      loadPage('home');
    }
  } catch (e) {
    console.error('Navigation Error:', e);
    document.getElementById('app').innerHTML = '<div class="container"><h1>Something went wrong</h1><p>Please refresh the page.</p></div>';
  }
  
  window.scrollTo(0, 0);
  
  // Update active links
  document.querySelectorAll('[data-route]').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-route') === path);
  });
  
  // Update mobile bottom nav
  document.querySelectorAll('#bottom-nav a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-route') === path);
  });
}

window.addEventListener('popstate', () => {
  navigate(window.location.pathname, false);
});

document.addEventListener('click', e => {
  const link = e.target.closest('[data-route]');
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute('data-route'));
    
    // Close mobile menu if open
    document.querySelector('.nav-links').classList.remove('open');
  }
});
