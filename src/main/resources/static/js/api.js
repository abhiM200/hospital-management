const API = {
  base: '/api',

  async request(path, options = {}) {
    try {
      const res = await fetch(this.base + path, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      if (res.status === 204) return null;
      return await res.json();
    } catch (e) {
      console.error('API Error:', e);
      throw e;
    }
  },

  get(path) { return this.request(path); },
  post(path, body) { return this.request(path, { method: 'POST', body: JSON.stringify(body) }); },
  put(path, body) { return this.request(path, { method: 'PUT', body: JSON.stringify(body) }); },
  delete(path) { return this.request(path, { method: 'DELETE' }); },

  downloadPdf(rxId) {
    window.open(`${this.base}/prescriptions/${rxId}/pdf`, '_blank');
  }
};

function toast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast toast-${type} fade-in`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(100%)';
    setTimeout(() => el.remove(), 300);
  }, 3500);
}
