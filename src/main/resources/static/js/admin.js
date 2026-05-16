const Admin = {
  authenticated: false,
  currentTab: 'dashboard',
  pin: '',

  init() {
    if (sessionStorage.getItem('adminAuth')) {
      this.authenticated = true;
      this.render();
    } else {
      this.renderLogin();
    }
  },

  renderLogin() {
    document.getElementById('app').innerHTML = `
      <div class="container page-margin">
        <div class="login-box glass-card fade-in" style="max-width:420px;margin:0 auto;padding:48px;text-align:center;">
          <div style="font-size:60px;margin-bottom:16px;">🔐</div>
          <h2 class="dm-serif">Admin Gateway</h2>
          <p class="text-muted" style="margin:12px 0 28px;">Secure access for clinical management.</p>
          <div id="pin-display" class="pin-display" style="font-size:32px;letter-spacing:16px;min-height:40px;margin-bottom:24px;color:var(--primary);"></div>
          <div class="pin-pad" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:260px;margin:0 auto;">
            ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="btn btn-outline" onclick="Admin.typePin('${n}')">${n}</button>`).join('')}
            <button class="btn btn-outline" onclick="Admin.clearPin()">C</button>
            <button class="btn btn-outline" onclick="Admin.typePin('0')">0</button>
            <button class="btn btn-accent" onclick="Admin.verifyPin()">✓</button>
          </div>
        </div>
      </div>
    `;
    this.pin = '';
  },

  typePin(n) {
    if (this.pin.length < 4) {
      this.pin += n;
      document.getElementById('pin-display').textContent = '•'.repeat(this.pin.length);
      if (this.pin.length === 4) this.verifyPin();
    }
  },

  clearPin() {
    this.pin = '';
    document.getElementById('pin-display').textContent = '';
  },

  async verifyPin() {
    try {
      const res = await API.post('/admin/verify-pin', { pin: this.pin });
      if (res.valid) {
        this.authenticated = true;
        sessionStorage.setItem('adminAuth', 'true');
        this.render();
        toast('Welcome, Admin!');
      } else {
        const box = document.querySelector('.login-box');
        if (box) { box.classList.add('shake'); setTimeout(() => box.classList.remove('shake'), 500); }
        this.clearPin();
        toast('Invalid PIN', 'error');
      }
    } catch (e) {
      toast('Server error. Try again.', 'error');
      this.clearPin();
    }
  },

  render() {
    document.getElementById('app').innerHTML = `
      <div class="admin-layout fade-in">
        <aside class="admin-sidebar">
          <div class="sidebar-brand"><h2>Admin Panel</h2></div>
          <nav class="sidebar-nav">
            <a href="#" class="sidebar-link ${this.currentTab==='dashboard'?'active':''}" onclick="event.preventDefault();Admin.switchTab('dashboard')">📊 Dashboard</a>
            <a href="#" class="sidebar-link ${this.currentTab==='appointments'?'active':''}" onclick="event.preventDefault();Admin.switchTab('appointments')">📅 Appointments</a>
            <a href="#" class="sidebar-link ${this.currentTab==='patients'?'active':''}" onclick="event.preventDefault();Admin.switchTab('patients')">👤 Patients</a>
            <a href="#" class="sidebar-link ${this.currentTab==='prescriptions'?'active':''}" onclick="event.preventDefault();Admin.switchTab('prescriptions')">💊 Rx Writer</a>
            <a href="#" class="sidebar-link ${this.currentTab==='blog'?'active':''}" onclick="event.preventDefault();Admin.switchTab('blog')">✍️ Blog Posts</a>
            <a href="#" class="sidebar-link ${this.currentTab==='settings'?'active':''}" onclick="event.preventDefault();Admin.switchTab('settings')">⚙️ Settings</a>
          </nav>
          <div style="margin-top:auto;padding:20px;">
            <button class="btn btn-outline" style="width:100%" onclick="Admin.logout()">Logout</button>
          </div>
        </aside>
        <main class="admin-main" id="admin-content"><div class="spinner" style="margin:40px auto;"></div></main>
      </div>
    `;
    this.loadTab(this.currentTab);
  },

  switchTab(tab) {
    this.currentTab = tab;
    this.render();
  },

  logout() {
    sessionStorage.removeItem('adminAuth');
    this.authenticated = false;
    navigate('/');
  },

  async loadTab(tab) {
    const container = document.getElementById('admin-content');
    if (!container) return;
    container.innerHTML = '<div class="spinner" style="margin:60px auto;"></div>';
    try {
      switch(tab) {
        case 'dashboard':     await this.renderDashboard(container);    break;
        case 'appointments':  await this.renderAppointments(container); break;
        case 'patients':      await this.renderPatients(container);     break;
        case 'prescriptions': await this.renderRxWriter(container);     break;
        case 'blog':          await this.renderBlogManager(container);  break;
        case 'settings':      await this.renderSettings(container);     break;
      }
    } catch (e) {
      container.innerHTML = `<div style="padding:40px;color:var(--accent);">⚠️ Error loading section: ${e.message}</div>`;
    }
  },

  async renderDashboard(container) {
    const [summary, trends] = await Promise.all([
      API.get('/analytics/summary'),
      API.get('/analytics/appointments-by-day')
    ]);
    container.innerHTML = `
      <header class="admin-header">
        <h1>Dashboard Overview</h1>
        <div class="date">${new Date().toDateString()}</div>
      </header>
      <div class="stats-row">
        <div class="admin-card glass-card"><h3>Total Patients</h3><div class="admin-stat-number">${summary.totalPatients}</div></div>
        <div class="admin-card glass-card"><h3>Pending</h3><div class="admin-stat-number">${summary.pendingAppointments}</div></div>
        <div class="admin-card glass-card"><h3>Today</h3><div class="admin-stat-number">${summary.todayAppointments}</div></div>
      </div>
      <div class="admin-card glass-card" style="margin-top:20px;">
        <h3>Appointment Trends (30 days)</h3>
        <div class="chart-container" style="height:250px;"><canvas id="trend-chart"></canvas></div>
      </div>
    `;
    if (typeof Charts !== 'undefined') {
      setTimeout(() => {
        Charts.line('trend-chart', trends.map(t => t.count), trends.map(t => t.date.slice(5)));
      }, 100);
    }
  },

  async renderAppointments(container) {
    const appts = await API.get('/appointments');
    container.innerHTML = `
      <header class="admin-header">
        <h1>Appointments</h1>
        <input type="date" id="admin-date-filter" onchange="Admin.filterAppointments()" style="padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);">
      </header>
      <div class="glass-card" style="overflow:auto;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:2px solid var(--border);">
              <th style="padding:12px;text-align:left;">Patient</th>
              <th>Phone</th><th>Date</th><th>Slot</th><th>Type</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody id="admin-appts-body">
            ${appts.map(a => `
              <tr data-date="${a.date}" style="border-bottom:1px solid var(--border);">
                <td style="padding:12px;font-weight:600;">${a.patientName}</td>
                <td style="padding:12px;">${a.phone}</td>
                <td style="padding:12px;">${a.date}</td>
                <td style="padding:12px;">${a.slot}</td>
                <td style="padding:12px;">${a.consultationType}</td>
                <td style="padding:12px;">
                  <select onchange="Admin.updateStatus('${a.id}',this.value)" class="status-badge status-${a.status}" style="border:none;border-radius:20px;padding:4px 8px;font-size:13px;cursor:pointer;">
                    <option value="pending"   ${a.status==='pending'   ?'selected':''}>Pending</option>
                    <option value="confirmed" ${a.status==='confirmed' ?'selected':''}>Confirmed</option>
                    <option value="completed" ${a.status==='completed' ?'selected':''}>Completed</option>
                    <option value="cancelled" ${a.status==='cancelled' ?'selected':''}>Cancelled</option>
                  </select>
                </td>
                <td style="padding:12px;">
                  <button class="btn-text" onclick="Admin.openRxWriter('${a.id}')">Write Rx</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  async updateStatus(id, status) {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      toast('Status updated');
    } catch (e) { toast('Update failed', 'error'); }
  },

  filterAppointments() {
    const date = document.getElementById('admin-date-filter').value;
    document.querySelectorAll('#admin-appts-body tr').forEach(row => {
      row.style.display = (!date || row.dataset.date === date) ? '' : 'none';
    });
  },

  openRxWriter(appointmentId) {
    this.targetAppointmentId = appointmentId;
    this.switchTab('prescriptions');
  },

  async renderRxWriter(container) {
    const patients = await API.get('/patients');
    container.innerHTML = `
      <h1>Prescription Writer</h1>
      <div class="glass-card" style="padding:32px;">
        <form id="rx-form">
          <div class="form-row">
            <div class="form-group">
              <label>Select Patient</label>
              <select name="patientPhone" id="rx-patient-select" required>
                <option value="">-- Choose Patient --</option>
                ${patients.map(p => `<option value="${p.phone}">${p.name} (${p.phone})</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Follow-up Date</label>
              <input type="date" name="followUpDate">
            </div>
          </div>
          <h3 style="margin:16px 0 12px;">Medicines</h3>
          <div id="med-list">
            <div class="med-row" style="display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr 1fr auto;gap:8px;margin-bottom:8px;">
              <input type="text" placeholder="Medicine Name" required>
              <input type="text" placeholder="Potency">
              <input type="text" placeholder="Dose">
              <input type="text" placeholder="Frequency">
              <input type="text" placeholder="Duration">
              <button type="button" style="background:var(--accent);color:white;border:none;border-radius:6px;padding:0 12px;cursor:pointer;" onclick="this.parentElement.remove()">×</button>
            </div>
          </div>
          <button type="button" class="btn btn-outline" style="margin:12px 0;" onclick="Admin.addMedRow()">+ Add Medicine</button>
          <div class="form-group mt-4">
            <label>Doctor's Advice</label>
            <textarea name="advice" rows="3" placeholder="Dietary restrictions, lifestyle recommendations..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Save &amp; Generate PDF</button>
        </form>
      </div>
    `;
    document.getElementById('rx-form').onsubmit = e => { e.preventDefault(); this.savePrescription(); };
  },

  addMedRow() {
    const row = document.createElement('div');
    row.className = 'med-row';
    row.style.cssText = 'display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr 1fr auto;gap:8px;margin-bottom:8px;';
    row.innerHTML = `
      <input type="text" placeholder="Medicine Name" required>
      <input type="text" placeholder="Potency">
      <input type="text" placeholder="Dose">
      <input type="text" placeholder="Frequency">
      <input type="text" placeholder="Duration">
      <button type="button" style="background:var(--accent);color:white;border:none;border-radius:6px;padding:0 12px;cursor:pointer;" onclick="this.parentElement.remove()">×</button>
    `;
    document.getElementById('med-list').appendChild(row);
  },

  async savePrescription() {
    const form = document.getElementById('rx-form');
    const patientPhone = form.patientPhone.value;
    if (!patientPhone) return toast('Please select a patient', 'warning');

    const medicines = Array.from(document.querySelectorAll('.med-row')).map(row => {
      const inputs = row.querySelectorAll('input');
      return { name: inputs[0].value, potency: inputs[1].value, dose: inputs[2].value, frequency: inputs[3].value, duration: inputs[4].value };
    }).filter(m => m.name.trim());

    if (medicines.length === 0) return toast('Add at least one medicine', 'warning');

    try {
      const res = await API.post('/prescriptions', {
        patientPhone, medicines,
        advice: form.advice.value,
        followUpDate: form.followUpDate.value,
        appointmentId: this.targetAppointmentId || null
      });
      toast('Prescription saved successfully!');
      this.targetAppointmentId = null;
      API.downloadPdf(res.id);
    } catch (e) {
      toast('Failed to save prescription', 'error');
    }
  },

  async renderPatients(container) {
    const patients = await API.get('/patients');
    container.innerHTML = `
      <h1>Patient Registry</h1>
      <div class="glass-card" style="overflow:auto;">
        <input type="text" placeholder="🔍 Search by name or phone..." onkeyup="Admin.searchPatients(this.value)"
          style="width:100%;padding:12px 16px;border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:16px;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:2px solid var(--border);">
              <th style="padding:12px;text-align:left;">Name</th><th>Phone</th><th>Age/Gender</th><th>Visits</th><th>Last Visit</th>
            </tr>
          </thead>
          <tbody id="patients-table">
            ${patients.map(p => `
              <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:12px;font-weight:600;">${p.name}</td>
                <td style="padding:12px;">${p.phone}</td>
                <td style="padding:12px;">${p.age} / ${p.gender}</td>
                <td style="padding:12px;">${p.visitCount}</td>
                <td style="padding:12px;">${p.lastVisit || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  searchPatients(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('#patients-table tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  },

  async renderBlogManager(container) {
    const posts = await API.get('/blog/all');
    container.innerHTML = `
      <header class="admin-header">
        <h1>Blog Posts</h1>
        <button class="btn btn-primary" onclick="Admin.newBlogPost()">+ New Post</button>
      </header>
      <div class="glass-card" style="overflow:auto;">
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr style="border-bottom:2px solid var(--border);">
            <th style="padding:12px;text-align:left;">Title</th><th>Category</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody id="blog-table">
            ${posts.map(p => `
              <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:12px;font-weight:600;">${p.title}</td>
                <td style="padding:12px;">${p.category}</td>
                <td style="padding:12px;">${p.published ? '✅ Published' : '📁 Draft'}</td>
                <td style="padding:12px;display:flex;gap:8px;">
                  <button class="btn-text" onclick="Admin.editBlogPost('${p.id}')">Edit</button>
                  <button class="btn-text" style="color:var(--accent);" onclick="Admin.deleteBlogPost('${p.id}')">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  newBlogPost() {
    this._renderBlogForm(null);
  },

  async editBlogPost(id) {
    try {
      const posts = await API.get('/blog/all');
      const post = posts.find(p => p.id === id);
      if (post) this._renderBlogForm(post);
    } catch (e) { toast('Could not load post', 'error'); }
  },

  async deleteBlogPost(id) {
    if (!confirm('Delete this blog post?')) return;
    try {
      await API.delete(`/blog/${id}`);
      toast('Post deleted');
      this.switchTab('blog');
    } catch (e) { toast('Delete failed', 'error'); }
  },

  _renderBlogForm(post) {
    const container = document.getElementById('admin-content');
    container.innerHTML = `
      <header class="admin-header">
        <h1>${post ? 'Edit Post' : 'New Post'}</h1>
        <button class="btn btn-outline" onclick="Admin.switchTab('blog')">← Back</button>
      </header>
      <div class="glass-card" style="padding:32px;">
        <form id="blog-form">
          <div class="form-row">
            <div class="form-group"><label>Title</label><input name="title" required value="${post ? post.title : ''}"></div>
            <div class="form-group"><label>Category</label>
              <select name="category">
                ${['Education','Skin','Hormonal','Neurological','Pediatric','Mental Health','Women\'s Health','Hair Care','Immune','Lifestyle'].map(c =>
                  `<option ${post && post.category===c?'selected':''}>${c}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Slug</label><input name="slug" required value="${post ? post.slug : ''}"></div>
            <div class="form-group"><label>Read Time</label><input name="readTime" value="${post ? post.readTime : '5 min read'}"></div>
          </div>
          <div class="form-group"><label>Excerpt</label><textarea name="excerpt" rows="2">${post ? post.excerpt : ''}</textarea></div>
          <div class="form-group"><label>Content</label><textarea name="content" rows="8" required>${post ? post.content : ''}</textarea></div>
          <div class="form-row">
            <div class="form-group"><label>Cover Image URL</label><input name="coverImageUrl" value="${post ? post.coverImageUrl : ''}"></div>
            <div class="form-group"><label>Tags (comma-separated)</label><input name="tags" value="${post ? post.tags : ''}"></div>
          </div>
          <div class="form-group" style="display:flex;align-items:center;gap:10px;">
            <input type="checkbox" name="published" id="pub-check" ${post && post.published?'checked':''}>
            <label for="pub-check" style="margin:0;cursor:pointer;">Published</label>
          </div>
          <button type="submit" class="btn btn-primary">Save Post</button>
        </form>
      </div>
    `;
    document.getElementById('blog-form').onsubmit = async e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {};
      fd.forEach((v, k) => data[k] = v);
      data.published = !!e.target.querySelector('#pub-check').checked;
      data.author = 'Dr. Vandita';
      try {
        if (post) {
          await API.put(`/blog/${post.id}`, data);
          toast('Post updated!');
        } else {
          await API.post('/blog', data);
          toast('Post created!');
        }
        this.switchTab('blog');
      } catch (err) { toast('Save failed', 'error'); }
    };
  },

  async renderSettings(container) {
    const settings = await API.get('/settings');
    container.innerHTML = `
      <h1>Clinic Settings</h1>
      <div class="glass-card" style="padding:32px;">
        <form id="settings-form">
          <div class="form-row">
            <div class="form-group"><label>Clinic Name</label><input name="clinicName" value="${settings.clinicName}" required></div>
            <div class="form-group"><label>Doctor Name</label><input name="doctorName" value="${settings.doctorName}" required></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Phone</label><input name="phone" value="${settings.phone}"></div>
            <div class="form-group"><label>Consultation Fee (₹)</label><input type="number" name="consultationFee" value="${settings.consultationFee}"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Morning Hours</label>
              <div class="form-row"><input type="time" name="morningStart" value="${settings.morningStart}"><input type="time" name="morningEnd" value="${settings.morningEnd}"></div>
            </div>
            <div class="form-group"><label>Evening Hours</label>
              <div class="form-row"><input type="time" name="eveningStart" value="${settings.eveningStart}"><input type="time" name="eveningEnd" value="${settings.eveningEnd}"></div>
            </div>
          </div>
          <div class="form-group"><label>Address</label><textarea name="address" rows="2">${settings.address}</textarea></div>
          <button type="submit" class="btn btn-primary">Save Settings</button>
        </form>
      </div>
      <div class="glass-card" style="padding:32px;margin-top:20px;">
        <h3>Change Admin PIN</h3>
        <div class="form-row" style="margin-top:16px;">
          <div class="form-group"><label>Old PIN</label><input type="password" id="old-pin" maxlength="4" style="letter-spacing:8px;text-align:center;font-size:20px;"></div>
          <div class="form-group"><label>New PIN</label><input type="password" id="new-pin" maxlength="4" style="letter-spacing:8px;text-align:center;font-size:20px;"></div>
        </div>
        <button class="btn btn-outline" onclick="Admin.changePin()">Update PIN</button>
      </div>
    `;
    document.getElementById('settings-form').onsubmit = async e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {};
      fd.forEach((v, k) => data[k] = v);
      data.consultationFee = parseInt(data.consultationFee) || 200;
      try {
        await API.put('/settings', data);
        toast('Settings saved successfully!');
      } catch (err) { toast('Save failed', 'error'); }
    };
  },

  async changePin() {
    const oldPin = document.getElementById('old-pin').value;
    const newPin = document.getElementById('new-pin').value;
    if (!oldPin || !newPin) return toast('Enter both PINs', 'warning');
    if (newPin.length !== 4) return toast('New PIN must be 4 digits', 'warning');
    try {
      const res = await API.put('/admin/change-pin', { oldPin, newPin });
      toast(res.message || 'PIN changed');
    } catch (e) { toast('PIN change failed', 'error'); }
  }
};
