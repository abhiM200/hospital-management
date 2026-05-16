const API = {
  base: '/api',

  async request(path, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const res = await fetch(this.base + path, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      if (res.status === 204) return null;
      return await res.json();
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        console.error(`API Timeout [${this.base + path}]`);
        throw new Error('Request timed out. Please check your connection.');
      }
      console.error(`API Error [${this.base + path}]:`, e);
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
