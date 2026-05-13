const Admin = {
  authenticated: false,
  currentTab: 'dashboard',

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
      <div class="login-box glass-card fade-in">
        <h2>Admin Access</h2>
        <p>Enter 4-digit security PIN</p>
        <div id="pin-display" class="pin-display"></div>
        <div class="pin-pad">
          ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="pin-btn" onclick="Admin.typePin('${n}')">${n}</button>`).join('')}
          <button class="pin-btn" onclick="Admin.clearPin()">C</button>
          <button class="pin-btn" onclick="Admin.typePin('0')">0</button>
          <button class="pin-btn" onclick="Admin.verifyPin()">Enter</button>
        </div>
      </div>
    `;
    this.pin = '';
  },

  typePin(n) {
    if (this.pin.length < 4) {
      this.pin += n;
      document.getElementById('pin-display').textContent = '•'.repeat(this.pin.length);
    }
  },

  clearPin() {
    this.pin = '';
    document.getElementById('pin-display').textContent = '';
  },

  async verifyPin() {
    const res = await API.post('/admin/verify-pin', { pin: this.pin });
    if (res.valid) {
      this.authenticated = true;
      sessionStorage.setItem('adminAuth', 'true');
      this.render();
      toast('Login successful');
    } else {
      document.querySelector('.login-box').classList.add('shake');
      setTimeout(() => document.querySelector('.login-box').classList.remove('shake'), 500);
      this.clearPin();
      toast('Invalid PIN', 'error');
    }
  },

  render() {
    document.getElementById('app').innerHTML = `
      <div class="admin-layout fade-in">
        <aside class="admin-sidebar">
          <div class="sidebar-brand">
            <h2>Admin Panel</h2>
          </div>
          <nav class="sidebar-nav">
            <a href="#" class="sidebar-link ${this.currentTab === 'dashboard' ? 'active' : ''}" onclick="Admin.switchTab('dashboard')">Dashboard</a>
            <a href="#" class="sidebar-link ${this.currentTab === 'appointments' ? 'active' : ''}" onclick="Admin.switchTab('appointments')">Appointments</a>
            <a href="#" class="sidebar-link ${this.currentTab === 'patients' ? 'active' : ''}" onclick="Admin.switchTab('patients')">Patients</a>
            <a href="#" class="sidebar-link ${this.currentTab === 'prescriptions' ? 'active' : ''}" onclick="Admin.switchTab('prescriptions')">Rx Writer</a>
            <a href="#" class="sidebar-link ${this.currentTab === 'blog' ? 'active' : ''}" onclick="Admin.switchTab('blog')">Blog Posts</a>
            <a href="#" class="sidebar-link ${this.currentTab === 'settings' ? 'active' : ''}" onclick="Admin.switchTab('settings')">Settings</a>
          </nav>
          <div style="margin-top: auto; padding: 20px;">
            <button class="btn btn-outline" style="width: 100%" onclick="Admin.logout()">Logout</button>
          </div>
        </aside>
        <main class="admin-main" id="admin-content"></main>
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
    location.reload();
  },

  async loadTab(tab) {
    const container = document.getElementById('admin-content');
    container.innerHTML = '<div class="spinner"></div>';

    switch(tab) {
      case 'dashboard': await this.renderDashboard(container); break;
      case 'appointments': await this.renderAppointments(container); break;
      case 'patients': await this.renderPatients(container); break;
      case 'prescriptions': await this.renderRxWriter(container); break;
      case 'blog': await this.renderBlogManager(container); break;
      case 'settings': await this.renderSettings(container); break;
    }
  },

  async renderDashboard(container) {
    const summary = await API.get('/analytics/summary');
    container.innerHTML = `
      <header class="admin-header">
        <h1>Dashboard Overview</h1>
        <div class="date">${new Date().toDateString()}</div>
      </header>
      <div class="stats-row">
        <div class="admin-card glass-card">
          <h3>Total Patients</h3>
          <div class="stat-number">${summary.totalPatients}</div>
        </div>
        <div class="admin-card glass-card">
          <h3>Pending Appts</h3>
          <div class="stat-number">${summary.pendingAppointments}</div>
        </div>
        <div class="admin-card glass-card">
          <h3>Today's Appts</h3>
          <div class="stat-number">${summary.todayAppointments}</div>
        </div>
      </div>
      <div class="grid">
        <div class="admin-card glass-card">
          <h3>Recent Bookings</h3>
          <div id="recent-bookings-list"></div>
        </div>
        <div class="admin-card glass-card">
          <h3>Appointment Trends</h3>
          <div class="chart-container"><canvas id="trend-chart"></canvas></div>
        </div>
      </div>
    `;

    // Load trend chart
    const trends = await API.get('/analytics/appointments-by-day');
    Charts.line('trend-chart', trends.map(t => t.count), trends.map(t => t.date.slice(5)));
  },

  async renderAppointments(container) {
    const appts = await API.get('/appointments');
    container.innerHTML = `
      <header class="admin-header">
        <h1>Appointment Management</h1>
        <input type="date" id="admin-date-filter" onchange="Admin.filterAppointments()">
      </header>
      <div class="glass-card">
        <table>
          <thead>
            <tr><th>Patient</th><th>Phone</th><th>Date</th><th>Slot</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody id="admin-appts-body">
            ${appts.map(a => `
              <tr data-date="${a.date}">
                <td>${a.patientName}</td>
                <td>${a.phone}</td>
                <td>${a.date}</td>
                <td>${a.slot}</td>
                <td>
                  <select onchange="Admin.updateStatus('${a.id}', this.value)" class="status-badge status-${a.status}">
                    <option value="pending" ${a.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${a.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="completed" ${a.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${a.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                  </select>
                </td>
                <td>
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
      this.loadTab('appointments');
    } catch (e) { toast('Update failed', 'error'); }
  },

  openRxWriter(appointmentId) {
    this.targetAppointmentId = appointmentId;
    this.switchTab('prescriptions');
  },

  async renderRxWriter(container) {
    const patients = await API.get('/patients');
    container.innerHTML = `
      <h1>Prescription Writer</h1>
      <div class="glass-card">
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
          
          <h3>Medicines</h3>
          <div id="med-list">
            <div class="med-row">
              <input type="text" placeholder="Medicine Name" required>
              <input type="text" placeholder="Potency">
              <input type="text" placeholder="Dose">
              <input type="text" placeholder="Frequency">
              <input type="text" placeholder="Duration">
              <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
            </div>
          </div>
          <button type="button" class="btn btn-outline" onclick="Admin.addMedRow()">+ Add Medicine</button>
          
          <div class="form-group mt-4">
            <label>Doctor's Advice</label>
            <textarea name="advice" rows="3"></textarea>
          </div>
          
          <button type="submit" class="btn btn-primary">Save & Generate PDF</button>
        </form>
      </div>
    `;

    document.getElementById('rx-form').onsubmit = (e) => {
      e.preventDefault();
      this.savePrescription();
    };
  },

  addMedRow() {
    const row = document.createElement('div');
    row.className = 'med-row';
    row.innerHTML = `
      <input type="text" placeholder="Medicine Name" required>
      <input type="text" placeholder="Potency">
      <input type="text" placeholder="Dose">
      <input type="text" placeholder="Frequency">
      <input type="text" placeholder="Duration">
      <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
    `;
    document.getElementById('med-list').appendChild(row);
  },

  async savePrescription() {
    const form = document.getElementById('rx-form');
    const patientPhone = form.patientPhone.value;
    const medicines = Array.from(document.querySelectorAll('.med-row')).map(row => {
      const inputs = row.querySelectorAll('input');
      return {
        name: inputs[0].value,
        potency: inputs[1].value,
        dose: inputs[2].value,
        frequency: inputs[3].value,
        duration: inputs[4].value
      };
    });

    const res = await API.post('/prescriptions', {
      patientPhone,
      medicines,
      advice: form.advice.value,
      followUpDate: form.followUpDate.value,
      appointmentId: this.targetAppointmentId || null
    });

    toast('Prescription saved');
    API.downloadPdf(res.id);
  },

  async renderPatients(container) {
    const patients = await API.get('/patients');
    container.innerHTML = `
      <h1>Patient Registry</h1>
      <div class="glass-card">
        <input type="text" placeholder="Search by name or phone..." onkeyup="Admin.searchPatients(this.value)" class="mb-4" style="padding:10px; width:100%; border-radius:8px; border:1px solid var(--border);">
        <table>
          <thead>
            <tr><th>Name</th><th>Phone</th><th>Age/Gen</th><th>Visits</th><th>Last Visit</th></tr>
          </thead>
          <tbody id="patients-table">
            ${patients.map(p => `
              <tr>
                <td>${p.name}</td>
                <td>${p.phone}</td>
                <td>${p.age} / ${p.gender}</td>
                <td>${p.visitCount}</td>
                <td>${p.lastVisit || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  async renderBlogManager(container) {
    const posts = await API.get('/blog/all');
    container.innerHTML = `
       <div class="blog-manager-header">
         <h1>Blog Posts</h1>
         <button class="btn btn-primary" onclick="Admin.newBlogPost()">+ New Post</button>
       </div>
       <div class="glass-card">
         <table>
           <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
           <tbody>
             ${posts.map(p => `
               <tr>
                 <td>${p.title}</td>
                 <td>${p.category}</td>
                 <td>${p.published ? '✅ Published' : '📁 Draft'}</td>
                 <td>
                   <button class="btn-text" onclick="Admin.editBlogPost('${p.id}')">Edit</button>
                   <button class="btn-text" style="color:red" onclick="Admin.deleteBlogPost('${p.id}')">Delete</button>
                 </td>
               </tr>
             `).join('')}
           </tbody>
         </table>
       </div>
    `;
  },

  async renderSettings(container) {
    const settings = await API.get('/settings');
    container.innerHTML = `
      <h1>Clinic Settings</h1>
      <div class="glass-card">
        <form id="settings-form" class="settings-grid">
          <div class="form-group"><label>Clinic Name</label><input name="clinicName" value="${settings.clinicName}"></div>
          <div class="form-group"><label>Doctor Name</label><input name="doctorName" value="${settings.doctorName}"></div>
          <div class="form-group"><label>Phone</label><input name="phone" value="${settings.phone}"></div>
          <div class="form-group"><label>Consultation Fee</label><input type="number" name="consultationFee" value="${settings.consultationFee}"></div>
          <div class="form-group"><label>Morning Hours</label><div class="form-row"><input type="time" name="morningStart" value="${settings.morningStart}"><input type="time" name="morningEnd" value="${settings.morningEnd}"></div></div>
          <div class="form-group"><label>Evening Hours</label><div class="form-row"><input type="time" name="eveningStart" value="${settings.eveningStart}"><input type="time" name="eveningEnd" value="${settings.eveningEnd}"></div></div>
          <div class="form-group" style="grid-column: span 2"><label>Address</label><textarea name="address">${settings.address}</textarea></div>
          <button type="submit" class="btn btn-primary">Save Settings</button>
        </form>
      </div>
    `;
  }
};
