const Charts = {
  colors: ['#00B4D8', '#F77F00', '#22C55E', '#FACC15', '#EF4444', '#7C3AED'],

  line(id, data, labels) {
    const ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Appointments',
          data: data,
          borderColor: '#00B4D8',
          backgroundColor: 'rgba(0, 180, 216, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
      }
    });
  },

  doughnut(id, data, labels) {
    const ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: this.colors,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        cutout: '70%'
      }
    });
  },

  bar(id, data, labels) {
    const ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: '#00B4D8',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
      }
    });
  },

  radar(id, data, labels) {
    const ctx = document.getElementById(id);
    if (!ctx) return;
    return new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Health Metrics',
          data: data,
          backgroundColor: 'rgba(0, 75, 145, 0.2)',
          borderColor: '#004B91',
          pointBackgroundColor: '#F77F00',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: { beginAtZero: true, max: 100 }
        },
        plugins: { legend: { display: false } }
      }
    });
  }
};
