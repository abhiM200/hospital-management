const Portal = {
  patient: null,
  appointments: [],

  async login() {
    const phone = document.getElementById('portal-phone').value;
    if (phone.length !== 10) return toast('Enter valid 10-digit phone', 'warning');

    try {
      const appts = await API.get(`/appointments/phone/${phone}`);
      if (appts.length === 0) return toast('No appointments found for this phone', 'warning');
      
      this.appointments = appts;
      this.patient = { name: appts[0].patientName, phone: phone };
      this.renderDashboard();
    } catch (e) {
      toast('Error logging in', 'error');
    }
  },

  renderDashboard() {
    const upcoming = this.appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
    const past = this.appointments.filter(a => a.status === 'completed');

    document.getElementById('app').innerHTML = `
      <div class="dashboard-container fade-in">
        <header class="admin-header">
          <div>
            <h1>Welcome, ${this.patient.name}</h1>
            <p>Manage your health journey here</p>
          </div>
          <button class="btn btn-outline" onclick="location.reload()">Logout</button>
        </header>

        <div class="stats-row">
          <div class="glass-card stat-card">
            <h3>Total Visits</h3>
            <div class="stat-number">${this.appointments.length}</div>
          </div>
          <div class="glass-card stat-card">
            <h3>Upcoming</h3>
            <div class="stat-number">${upcoming.length}</div>
          </div>
          <div class="glass-card stat-card">
            <h3>Last Visit</h3>
            <div class="stat-number" style="font-size: 18px;">${this.appointments[0].date}</div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="glass-card">
            <h3>Upcoming Appointments</h3>
            <div class="portal-table-container">
              <table>
                <thead>
                  <tr><th>Date</th><th>Slot</th><th>Type</th><th>Status</th></tr>
                </thead>
                <tbody>
                  ${upcoming.map(a => `
                    <tr>
                      <td>${a.date}</td>
                      <td>${a.slot}</td>
                      <td>${a.consultationType}</td>
                      <td><span class="status-badge status-${a.status}">${a.status}</span></td>
                    </tr>
                  `).join('') || '<tr><td colspan="4">No upcoming appointments</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>

          <div class="glass-card">
            <h3>Past Prescriptions</h3>
            <div id="rx-portal-list" class="prescription-list">
              <div class="skeleton" style="height: 100px;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.loadPrescriptions();
  },

  async loadPrescriptions() {
    try {
      const prescriptions = await API.get(`/prescriptions/patient/${this.patient.phone}`);
      const container = document.getElementById('rx-portal-list');
      container.innerHTML = prescriptions.map(rx => `
        <div class="rx-card glass-card">
          <div class="rx-header">
            <span class="rx-date">${rx.date}</span>
            <span class="rx-id">#${rx.id}</span>
          </div>
          <div class="rx-body">
            <p>${rx.medicines.length} Medicines prescribed</p>
            <button class="btn-text" onclick="API.downloadPdf('${rx.id}')">Download PDF 📥</button>
          </div>
        </div>
      `).join('') || '<p>No prescriptions yet</p>';
    } catch (e) {
      document.getElementById('rx-portal-list').innerHTML = '<p>Error loading records</p>';
    }
  }
};
