const Booking = {
  currentStep: 1,
  data: {
    date: null,
    slot: null,
    type: 'in-person',
    patient: {}
  },
  loading: false,

  async init() {
    this.data = { date: null, slot: null, type: 'in-person', patient: {} };
    this.currentStep = 1;
    this.renderStep(1);
    this.initCalendar();
    
    // Wire up consultation type radio buttons
    document.querySelectorAll('input[name="consultationType"]').forEach(input => {
      input.addEventListener('change', (e) => {
        this.data.type = e.target.value;
        if (this.data.date) this.selectDate(this.data.date); // Refresh slots if needed
      });
    });
  },

  // ── Step Navigation ────────────────────────────────────────────

  renderStep(step) {
    if (step < 1) step = 1;
    if (step > 3) step = 3;

    document.querySelectorAll('.booking-step').forEach(el => el.classList.remove('active'));
    const stepEl = document.getElementById(`step-${step}`);
    if (stepEl) stepEl.classList.add('active');

    document.querySelectorAll('.step-indicator').forEach((el, i) => {
      el.classList.toggle('active', i + 1 === step);
      el.classList.toggle('completed', i + 1 < step);
    });

    this.currentStep = step;

    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) {
      prevBtn.style.visibility = step > 1 ? 'visible' : 'hidden';
    }

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      if (step === 3) {
        nextBtn.textContent = '✓ Confirm Booking';
        nextBtn.disabled = false;
      } else if (step === 2) {
        nextBtn.textContent = 'Next →';
        nextBtn.disabled = false;
      } else {
        nextBtn.textContent = 'Next →';
        nextBtn.disabled = !this.data.slot;
      }
    }
  },

  // ── Calendar ───────────────────────────────────────────────────

  initCalendar() {
    const container = document.getElementById('calendar-container');
    if (!container) return;
    const today = new Date();
    this.curMonth = today.getMonth();
    this.curYear = today.getFullYear();
    this.renderCalendar();
  },

  renderCalendar() {
    const container = document.getElementById('calendar-container');
    if (!container) return;

    const month = this.curMonth;
    const year  = this.curYear;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay     = new Date(year, month, 1).getDay();
    const daysInMonth  = new Date(year, month + 1, 0).getDate();
    const monthName    = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month));

    let html = `
      <div class="calendar-header">
        <button class="btn btn-outline btn-sm" onclick="Booking.changeMonth(-1)">‹</button>
        <h4>${monthName} ${year}</h4>
        <button class="btn btn-outline btn-sm" onclick="Booking.changeMonth(1)">›</button>
      </div>
      <div class="calendar-grid">
        <div class="day-name">Su</div><div class="day-name">Mo</div><div class="day-name">Tu</div>
        <div class="day-name">We</div><div class="day-name">Th</div><div class="day-name">Fr</div><div class="day-name">Sa</div>
    `;

    for (let i = 0; i < firstDay; i++) html += '<div></div>';

    for (let day = 1; day <= daysInMonth; day++) {
      const d       = new Date(year, month, day);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast  = d < today;
      const isSunday = d.getDay() === 0;
      const disabled = isPast || isSunday;
      const isSelected = this.data.date === dateStr;
      const isToday    = d.getTime() === today.getTime();

      html += `
        <div class="calendar-day ${disabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${isToday && !isSelected ? 'today' : ''}"
             ${!disabled ? `onclick="Booking.selectDate('${dateStr}')"` : ''}>
          ${day}
        </div>
      `;
    }
    html += '</div>';
    container.innerHTML = html;
  },

  changeMonth(delta) {
    this.curMonth += delta;
    if (this.curMonth < 0)  { this.curMonth = 11; this.curYear--; }
    if (this.curMonth > 11) { this.curMonth = 0;  this.curYear++; }
    this.renderCalendar();
  },

  // ── Date & Slot Selection ──────────────────────────────────────

  async selectDate(date) {
    this.data.date = date;
    this.data.slot = null;
    this.renderCalendar();

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.disabled = true;

    this.renderSlotsSkeleton();
    await this.fetchSlots(date);
  },

  renderSlotsSkeleton() {
    const container = document.getElementById('slot-container');
    if (!container) return;
    container.innerHTML = Array(8).fill(0).map(() => `
      <div class="skeleton" style="height: 50px; border-radius: 8px;"></div>
    `).join('');
  },

  async fetchSlots(date, retryCount = 0) {
    const container = document.getElementById('slot-container');
    if (!container) return;

    try {
      const slots = await API.get(`/slots/available?date=${date}`);
      
      if (!slots || slots.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div style="font-size: 40px; margin-bottom: 10px;">📅</div>
            <p>No slots available for this date.</p>
            <p class="text-xs">Try selecting another date or consultation type.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = slots.map(s => `
        <button class="slot-btn animate-in ${!s.available ? 'disabled' : ''} ${this.data.slot === s.time ? 'selected' : ''}"
                style="animation-delay: ${Math.random() * 0.2}s"
                ${s.available ? `onclick="Booking.selectSlot('${s.time}')"` : 'disabled'}>
          <div class="slot-time">${s.time}</div>
          <div class="slot-status">${s.available ? 'Available' : (s.blocked ? 'Unavailable' : 'Full')}</div>
        </button>
      `).join('');

    } catch (e) {
      console.error('Slot fetch error:', e);
      if (retryCount < 2) {
        setTimeout(() => this.fetchSlots(date, retryCount + 1), 1000);
      } else {
        container.innerHTML = `
          <div class="error-state">
            <p>Failed to load slots.</p>
            <button class="btn btn-outline btn-sm mt-2" onclick="Booking.fetchSlots('${date}')">🔄 Retry</button>
          </div>
        `;
      }
    }
  },

  selectSlot(slot) {
    this.data.slot = slot;
    document.querySelectorAll('.slot-btn').forEach(b => {
      const time = b.querySelector('.slot-time').textContent.trim();
      b.classList.toggle('selected', time === slot);
    });

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.disabled = false;
  },

  // ── Step Navigation Logic ──────────────────────────────────────

  next() {
    if (this.currentStep === 1) {
      if (!this.data.date) return toast('Please select a date first', 'warning');
      if (!this.data.slot) return toast('Please select a time slot', 'warning');

      const consultationType = document.querySelector('input[name="consultationType"]:checked');
      if (consultationType) this.data.type = consultationType.value;

      this.renderStep(2);

    } else if (this.currentStep === 2) {
      const form = document.getElementById('booking-form');
      if (!form) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const fd = new FormData(form);
      this.data.patient = {};
      fd.forEach((v, k) => this.data.patient[k] = v);

      this.renderSummary();
      this.renderStep(3);
    }
  },

  renderSummary() {
    const s = document.getElementById('booking-summary');
    if (!s) return;

    const typeLabel = this.data.type === 'video' ? '🎥 Video Consultation' : '🏥 In-Person Visit';
    s.innerHTML = `
      <div class="summary-item"><span class="summary-label">Patient</span><span class="summary-value">${this.data.patient.patientName || '—'}</span></div>
      <div class="summary-item"><span class="summary-label">Phone</span><span class="summary-value">${this.data.patient.phone || '—'}</span></div>
      <div class="summary-item"><span class="summary-label">Age / Gender</span><span class="summary-value">${this.data.patient.age || '—'} / ${this.data.patient.gender || '—'}</span></div>
      <div class="summary-item"><span class="summary-label">Date</span><span class="summary-value">${this.data.date}</span></div>
      <div class="summary-item"><span class="summary-label">Time Slot</span><span class="summary-value">${this.data.slot}</span></div>
      <div class="summary-item"><span class="summary-label">Type</span><span class="summary-value">${typeLabel}</span></div>
      <div class="summary-item"><span class="summary-label">Consultation Fee</span><span class="summary-value" style="color: var(--primary); font-size:18px;">₹200</span></div>
    `;
  },

  async confirm() {
    if (this.loading) return;
    this.loading = true;

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.innerHTML = '<span class="spinner-small"></span> Booking...';
    }

    try {
      const res = await API.post('/appointments', {
        ...this.data.patient,
        age: parseInt(this.data.patient.age) || 0,
        date: this.data.date,
        slot: this.data.slot,
        consultationType: this.data.type,
        status: 'pending'
      });

      toast('Appointment booked successfully! 🎉');
      this.renderSuccess(res);
    } catch (e) {
      console.error('Booking failed:', e);
      toast('Booking failed. Please try again.', 'error');
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.textContent = '✓ Confirm Booking';
      }
    } finally {
      this.loading = false;
    }
  },

  renderSuccess(res) {
    const waMsg = encodeURIComponent(
      `Hi Dr. Vandita, I have booked an appointment (ID: ${res.id}) for ${res.date} at ${res.slot}.`
    );

    document.getElementById('app').innerHTML = `
      <div class="container page-margin fade-in">
        <div class="booking-wizard glass-card text-center" style="max-width:620px; margin:0 auto; padding:60px 40px;">
          <div style="font-size:80px; margin-bottom:20px;">🌿</div>
          <h2 class="dm-serif" style="font-size:32px; color:var(--primary);">Booking Confirmed!</h2>
          <p style="font-size:17px; color:var(--text-muted); margin:16px 0 30px;">
            Thank you, <strong>${res.patientName}</strong>! Your appointment has been scheduled.
          </p>

          <div class="summary-card" style="text-align:left;">
            <div class="summary-item"><span class="summary-label">Appointment ID</span><span class="summary-value" style="color:var(--primary);">#${res.id}</span></div>
            <div class="summary-item"><span class="summary-label">Date &amp; Time</span><span class="summary-value">${res.date} at ${res.slot}</span></div>
            <div class="summary-item"><span class="summary-label">Type</span><span class="summary-value">${res.consultationType === 'video' ? '🎥 Video Consultation' : '🏥 In-Person Visit'}</span></div>
          </div>

          <div class="alert-info mt-4" style="text-align:left;">
            <p><strong>What's Next:</strong></p>
            <ul style="margin-top:10px; padding-left:20px; line-height:2;">
              <li>${res.consultationType === 'video' ? 'You will receive a meeting link 15 minutes before your slot.' : 'Please arrive 10 minutes early at the clinic.'}</li>
              <li>Consultation fee of ₹200 is payable ${res.consultationType === 'video' ? 'online via UPI' : 'at the clinic'}.</li>
            </ul>
          </div>

          <div class="mt-4" style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
            <a href="https://wa.me/917005574327?text=${waMsg}" target="_blank" class="btn btn-accent">Share on WhatsApp</a>
            <button onclick="window.print()" class="btn btn-outline">Print Receipt</button>
          </div>
          <div class="mt-4">
            <a href="/" data-route="/" class="btn-text">← Back to Home</a>
          </div>
        </div>
      </div>
    `;
  }
};
