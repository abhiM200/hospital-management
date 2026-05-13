const Booking = {
  currentStep: 1,
  data: {
    date: null,
    slot: null,
    type: 'in-person',
    patient: {}
  },

  async init() {
    this.renderStep(1);
    this.initCalendar();
  },

  renderStep(step) {
    document.querySelectorAll('.booking-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
    
    document.querySelectorAll('.step-indicator').forEach((el, i) => {
      el.classList.toggle('active', i + 1 === step);
      el.classList.toggle('completed', i + 1 < step);
    });
    this.currentStep = step;
  },

  initCalendar() {
    const container = document.getElementById('calendar-container');
    if (!container) return;
    
    const today = new Date();
    let curMonth = today.getMonth();
    let curYear = today.getFullYear();

    const render = (month, year) => {
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month));
      
      let html = `
        <div class="calendar-header">
          <button onclick="Booking.changeMonth(-1)">‹</button>
          <h4>${monthName} ${year}</h4>
          <button onclick="Booking.changeMonth(1)">›</button>
        </div>
        <div class="calendar-grid">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
      `;
      
      for (let i = 0; i < firstDay; i++) html += '<div></div>';
      
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const dateStr = d.toISOString().split('T')[0];
        const isPast = d < today.setHours(0,0,0,0);
        const isSunday = d.getDay() === 0;
        const disabled = isPast || isSunday;
        
        html += `
          <div class="calendar-day ${disabled ? 'disabled' : ''} ${this.data.date === dateStr ? 'selected' : ''}" 
               ${!disabled ? `onclick="Booking.selectDate('${dateStr}')"` : ''}>
            ${day}
          </div>
        `;
      }
      html += '</div>';
      container.innerHTML = html;
    };

    this.changeMonth = (delta) => {
      curMonth += delta;
      if (curMonth < 0) { curMonth = 11; curYear--; }
      if (curMonth > 11) { curMonth = 0; curYear++; }
      render(curMonth, curYear);
    };

    render(curMonth, curYear);
  },

  async selectDate(date) {
    this.data.date = date;
    this.initCalendar(); // Refresh UI
    
    // Fetch slots
    const slots = await API.get(`/slots/available?date=${date}`);
    const container = document.getElementById('slot-container');
    container.innerHTML = slots.map(s => `
      <button class="slot-btn ${!s.available ? 'disabled' : ''} ${this.data.slot === s.time ? 'selected' : ''}"
              ${s.available ? `onclick="Booking.selectSlot('${s.time}')"` : 'disabled'}>
        ${s.time}
      </button>
    `).join('');
  },

  selectSlot(slot) {
    this.data.slot = slot;
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.toggle('selected', b.textContent.trim() === slot));
    document.getElementById('next-btn').disabled = false;
  },

  next() {
    if (this.currentStep === 1) {
      if (!this.data.date || !this.data.slot) return toast('Please select date and time', 'warning');
      this.data.type = document.querySelector('input[name="consultationType"]:checked').value;
      this.renderStep(2);
    } else if (this.currentStep === 2) {
      const form = document.getElementById('booking-form');
      if (!form.checkValidity()) return form.reportValidity();
      
      const fd = new FormData(form);
      fd.forEach((v, k) => this.data.patient[k] = v);
      
      this.renderSummary();
      this.renderStep(3);
    }
  },

  renderSummary() {
    const s = document.getElementById('booking-summary');
    s.innerHTML = `
      <div class="summary-item"><span class="summary-label">Patient:</span><span class="summary-value">${this.data.patient.patientName}</span></div>
      <div class="summary-item"><span class="summary-label">Phone:</span><span class="summary-value">${this.data.patient.phone}</span></div>
      <div class="summary-item"><span class="summary-label">Date:</span><span class="summary-value">${this.data.date}</span></div>
      <div class="summary-item"><span class="summary-label">Time:</span><span class="summary-value">${this.data.slot}</span></div>
      <div class="summary-item"><span class="summary-label">Type:</span><span class="summary-value">${this.data.type}</span></div>
      <div class="summary-item"><span class="summary-label">Fee:</span><span class="summary-value">₹200</span></div>
    `;
  },

  async confirm() {
    try {
      const res = await API.post('/appointments', {
        ...this.data.patient,
        date: this.data.date,
        slot: this.data.slot,
        consultationType: this.data.type,
        status: 'pending'
      });
      
      document.getElementById('app').innerHTML = `
        <div class="container text-center mt-4 fade-in">
          <div class="glass-card">
            <div class="success-icon" style="font-size: 60px;">✅</div>
            <h2>Booking Confirmed!</h2>
            <p>Your Appointment ID is <strong>${res.id}</strong></p>
            <p>Please arrive 10 minutes before your slot at ${res.slot} on ${res.date}.</p>
            <div class="mt-4">
              <a href="https://wa.me/917005574327?text=Hi, I booked an appointment ID ${res.id}" target="_blank" class="btn btn-accent">Share on WhatsApp</a>
              <button onclick="window.print()" class="btn btn-outline">Print Receipt</button>
            </div>
            <div class="mt-4">
               <a href="/" data-route="/" class="btn-text">Back to Home</a>
            </div>
          </div>
        </div>
      `;
      toast('Appointment booked successfully!');
    } catch (e) {
      toast('Booking failed. Please try again.', 'error');
    }
  }
};
