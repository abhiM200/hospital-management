// app.js - Main Application Logic & Page Templates

document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    if (typeof initAnimations === 'function') initAnimations();
    
    // Initial navigation
    navigate(window.location.pathname, false);

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // Chat toggle
    const chatToggle = document.getElementById('chat-toggle');
    const chatPanel = document.getElementById('chat-panel');
    const chatClose = document.getElementById('chat-close');
    if (chatToggle && chatPanel) {
        chatToggle.addEventListener('click', () => chatPanel.classList.toggle('hidden'));
    }
    if (chatClose && chatPanel) {
        chatClose.addEventListener('click', () => chatPanel.classList.add('hidden'));
    }

    // Scroll to top
    const scrollTop = document.getElementById('scroll-top');
    if (scrollTop) {
        scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});

async function loadPage(page, slug = null) {
    const app = document.getElementById('app');
    
    switch(page) {
        case 'home':
            app.innerHTML = renderHome();
            populateHomeBlogs();
            break;
        case 'about':
            app.innerHTML = renderAbout();
            break;
        case 'treatments':
            app.innerHTML = renderTreatments();
            break;
        case 'book':
            app.innerHTML = renderBooking();
            if (typeof Booking !== 'undefined') Booking.init();
            break;
        case 'portal':
            app.innerHTML = renderPortal();
            break;
        case 'admin':
            app.innerHTML = renderAdmin(slug);
            if (typeof Admin !== 'undefined') Admin.init();
            break;
        case 'blog':
            await renderBlog(app);
            break;
        case 'blog-post':
            await renderBlogPost(app, slug);
            break;
        case 'ai-suite':
            app.innerHTML = renderAISuite();
            if (typeof AISuite !== 'undefined') AISuite.init();
            break;
        case 'contact':
            app.innerHTML = renderContact();
            break;
        default:
            app.innerHTML = '<div class="container"><h1>404</h1><p>Page not found</p></div>';
    }
    
    // Re-initialize any page-specific animations
    if (typeof initAnimations === 'function') initAnimations();
    
    // Keep server awake while browsing
    initKeepAlive();
}

function initKeepAlive() {
    if (window.keepAliveInterval) return;
    window.keepAliveInterval = setInterval(async () => {
        try {
            await fetch('/api/health');
            console.log('⚡ Keep-Alive: Ping successful');
        } catch (e) {
            console.warn('⚡ Keep-Alive: Ping failed');
        }
    }, 10 * 60 * 1000); // 10 minutes
}

async function populateHomeBlogs() {
    const grid = document.getElementById('home-blog-grid');
    if (!grid) return;
    try {
        const posts = await API.get('/blog');
        const recent = posts.slice(0, 3);
        grid.innerHTML = recent.map(post => `
            <div class="blog-card animate-on-scroll">
                <div class="blog-img" style="background-image: url('${post.coverImageUrl}')"></div>
                <div class="blog-info">
                    <span class="blog-date">${post.createdAt}</span>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <a href="/blog/${post.slug}" data-route="/blog/${post.slug}" class="btn-text">Read More →</a>
                </div>
            </div>
        `).join('');
    } catch (e) {
        grid.innerHTML = '<p>Error loading blogs.</p>';
    }
}


function renderHome() {
    return `
        <!-- HERO -->
        <section class="hero-peerless">
            <div class="hero-background-blobs">
                <div class="blob blob-1"></div>
                <div class="blob blob-2"></div>
                <div class="blob blob-3"></div>
            </div>
            <div class="container hero-container">
                <div class="hero-text animate-on-scroll">
                    <div class="hero-badge pulse">🌿 Gorakhpur's Most Trusted Homeopathy Clinic</div>
                    <span class="sub-heading">Classical Homeopathy</span>
                    <h1>Natural Healing for<br><span class="gradient-text">Lasting Relief</span></h1>
                    <p>Expert classical homeopathy by Dr. Vandita, B.H.M.S — treating chronic conditions at their root cause, not just suppressing symptoms.</p>
                    <div style="display:flex;gap:20px;margin-bottom:40px;flex-wrap:wrap;">
                        <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.85);font-size:14px;">
                            <span style="color:#60a5fa;font-size:18px;">✓</span> 100% Natural Remedies
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.85);font-size:14px;">
                            <span style="color:#60a5fa;font-size:18px;">✓</span> Zero Side Effects
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.85);font-size:14px;">
                            <span style="color:#60a5fa;font-size:18px;">✓</span> Video &amp; In-Person
                        </div>
                    </div>
                    <div class="hero-actions">
                        <a href="/book" data-route="/book" class="btn btn-accent" style="font-size:16px;padding:16px 32px;box-shadow:0 8px 25px rgba(237,28,36,0.4);">
                            Book Appointment →
                        </a>
                        <a href="/ai-suite" data-route="/ai-suite" class="btn btn-outline" style="color:#fff;border-color:rgba(255,255,255,0.4);backdrop-filter:blur(10px);">
                            ✨ AI Health Suite
                        </a>
                    </div>
                </div>
                <div class="hero-visual animate-on-scroll">
                    <div class="hero-main-card">
                        <img src="images/dr-vandita.jpg" alt="Dr. Vandita">
                        <div class="floating-badge top-right animate-child">
                            <span class="icon">🏆</span>
                            <div><strong>Top Rated</strong><p>Clinic in Gorakhpur</p></div>
                        </div>
                        <div class="floating-badge bottom-left animate-child">
                            <span class="icon">👩‍⚕️</span>
                            <div><strong>10k+ Patients</strong><p>Healed Naturally</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- STATS -->
        <section class="stats-peerless">
            <div class="container stats-grid">
                <div class="stat-box animate-on-scroll">
                    <div class="stat-number">3+</div><p>Years of Practice</p>
                </div>
                <div class="stat-box animate-on-scroll">
                    <div class="stat-number">10k+</div><p>Cases Resolved</p>
                </div>
                <div class="stat-box animate-on-scroll">
                    <div class="stat-number">98%</div><p>Patient Satisfaction</p>
                </div>
                <div class="stat-box animate-on-scroll">
                    <div class="stat-number">24/7</div><p>Support Access</p>
                </div>
            </div>
        </section>

        <!-- PROCESS -->
        <section class="process-section">
            <div class="container">
                <div class="section-title">
                    <span class="sub-heading">Our Approach</span>
                    <h2>How We <span class="gradient-text">Heal You</span></h2>
                </div>
                <div class="quick-links-grid">
                    <a href="/book" data-route="/book" class="quick-link-card animate-on-scroll">
                        <div class="card-icon">01</div>
                        <h4>Discovery</h4>
                        <p>In-depth consultation to understand your unique symptoms, history, and lifestyle.</p>
                    </a>
                    <a href="/about" data-route="/about" class="quick-link-card animate-on-scroll">
                        <div class="card-icon">02</div>
                        <h4>Analysis</h4>
                        <p>Expert case study using classical homeopathic principles and constitutional analysis.</p>
                    </a>
                    <a href="/portal" data-route="/portal" class="quick-link-card animate-on-scroll">
                        <div class="card-icon">03</div>
                        <h4>Treatment</h4>
                        <p>Precise remedies tailored to your body's constitution — addressing root causes.</p>
                    </a>
                    <a href="/contact" data-route="/contact" class="quick-link-card animate-on-scroll">
                        <div class="card-icon">04</div>
                        <h4>Recovery</h4>
                        <p>Continuous monitoring, follow-ups, and digital records for lasting wellness.</p>
                    </a>
                </div>
            </div>
        </section>

        <!-- ABOUT DR. VANDITA -->
        <section style="background:#f8fafc;padding:90px 0;">
            <div class="container">
                <div class="about-summary-grid">
                    <div class="about-summary-image animate-on-scroll">
                        <img src="images/dr-vandita.jpg" alt="Dr. Vandita">
                    </div>
                    <div class="about-summary-text animate-on-scroll">
                        <span class="sub-heading">About the Doctor</span>
                        <h2 style="font-size:36px;color:#0f172a;margin-bottom:20px;">Dr. Vandita<br><span style="color:#004b91;">B.H.M.S Homeopathic Physician</span></h2>
                        <p>With 3+ years of dedicated clinical practice in classical homeopathy, Dr. Vandita has helped thousands of patients find lasting relief from chronic conditions that conventional medicine could not resolve.</p>
                        <p>Her approach is deeply holistic — treating the whole person rather than isolated symptoms. Every patient receives a unique, constitutional remedy after thorough case-taking.</p>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:28px 0;">
                            ${['Skin Diseases','Thyroid &amp; PCOD','Migraine','Pediatric Care','Anxiety &amp; Stress','Allergies &amp; Asthma'].map(t =>
                                `<div style="display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600;color:#334155;">
                                    <span style="color:#004b91;font-size:18px;">✓</span> ${t}
                                </div>`).join('')}
                        </div>
                        <a href="/about" data-route="/about" class="btn btn-primary">Read Full Profile →</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- TESTIMONIALS -->
        <section class="testimonials-advanced">
            <div class="container">
                <div class="section-title">
                    <span class="sub-heading">Patient Stories</span>
                    <h2>Voices of <span class="gradient-text">Healing</span></h2>
                </div>
                <div class="testimonials-grid">
                    <div class="testimonial-card animate-on-scroll">
                        <div class="testimonial-header">
                            <div class="stars">⭐⭐⭐⭐⭐</div>
                            <div class="quote-icon">"</div>
                        </div>
                        <p>The treatment for my skin allergy was revolutionary. I had tried everything for years, but Dr. Vandita's approach finally gave me lasting relief.</p>
                        <div class="patient-profile">
                            <div class="avatar">SM</div>
                            <div><h5>Sangita Maity</h5><span>Verified Patient · Eczema</span></div>
                        </div>
                    </div>
                    <div class="testimonial-card animate-on-scroll">
                        <div class="testimonial-header">
                            <div class="stars">⭐⭐⭐⭐⭐</div>
                            <div class="quote-icon">"</div>
                        </div>
                        <p>Highly professional and empathetic. The digital records and easy WhatsApp support make the whole treatment process so seamless.</p>
                        <div class="patient-profile">
                            <div class="avatar">PN</div>
                            <div><h5>Pritam Nag</h5><span>Chronic Care · Thyroid</span></div>
                        </div>
                    </div>
                    <div class="testimonial-card animate-on-scroll">
                        <div class="testimonial-header">
                            <div class="stars">⭐⭐⭐⭐⭐</div>
                            <div class="quote-icon">"</div>
                        </div>
                        <p>Homeopathy that actually works! My migraine frequency has reduced by 80% in just 3 months. Truly life-changing treatment.</p>
                        <div class="patient-profile">
                            <div class="avatar">SS</div>
                            <div><h5>Sudarshan Samanta</h5><span>Verified Patient · Migraine</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- BLOG PREVIEW -->
        <section style="padding:90px 0;background:#fff;">
            <div class="container">
                <div class="section-title">
                    <span class="sub-heading">Health Knowledge</span>
                    <h2>Latest from our <span class="gradient-text">Health Blog</span></h2>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:28px;" id="home-blog-grid">
                    <div class="skeleton" style="height:320px;border-radius:20px;"></div>
                    <div class="skeleton" style="height:320px;border-radius:20px;"></div>
                    <div class="skeleton" style="height:320px;border-radius:20px;"></div>
                </div>
                <div style="text-align:center;margin-top:40px;">
                    <a href="/blog" data-route="/blog" class="btn btn-outline">View All Articles →</a>
                </div>
            </div>
        </section>

        <!-- CTA BANNER -->
        <section style="background:linear-gradient(135deg,#003669,#004b91,#0070cc);padding:80px 0;text-align:center;color:#fff;">
            <div class="container">
                <h2 style="font-size:40px;color:#fff;margin-bottom:16px;">Ready to Start Your Healing Journey?</h2>
                <p style="font-size:18px;opacity:0.85;margin-bottom:36px;max-width:600px;margin-left:auto;margin-right:auto;">Book your consultation today. In-person or video — we're here for you.</p>
                <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
                    <a href="/book" data-route="/book" class="btn btn-accent" style="font-size:16px;padding:16px 36px;box-shadow:0 8px 25px rgba(237,28,36,0.4);">
                        Book Appointment →
                    </a>
                    <a href="https://wa.me/917005574327" target="_blank" class="btn" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3);backdrop-filter:blur(10px);font-size:16px;padding:16px 36px;">
                        💬 Chat on WhatsApp
                    </a>
                </div>
            </div>
        </section>
    `;
}





function renderAbout() {
    return `
        <section class="hero-peerless hero-small">
            <div class="container">
                <span class="sub-heading">About Us</span>
                <h1>A Legacy of Trust & Healing</h1>
            </div>
        </section>
        <div class="container page-margin">
            <div class="about-summary-grid">
                <div class="about-summary-text">
                    <p>Dr. Vandita is a highly qualified B.H.M.S Homeopathic Physician with 3+ years of experience in providing holistic healthcare. Her journey in homeopathy started with a passion for natural medicine and a belief that the human body has an innate ability to heal itself when given the right stimulus.</p>
                    <p>Specializing in chronic conditions like PCOD, Thyroid, Skin diseases, and Migraine, she has successfully treated thousands of patients from all walks of life.</p>
                    <p>Our clinic is dedicated to providing personalized care, focusing on the root cause of ailments rather than just suppressing symptoms. We use high-quality homeopathic remedies and modern diagnostic insights to ensure the best outcomes for our patients.</p>
                </div>
                <div class="about-summary-image">
                     <img src="images/dr-vandita.jpg" alt="Doctor" style="border-radius: 20px;">
                </div>
            </div>
        </div>
    `;
}

function renderTreatments() {
    return `
        <section class="hero-peerless hero-small">
            <div class="container">
                <span class="sub-heading">Our Services</span>
                <h1>Departments & Specialties</h1>
            </div>
        </section>
        <div class="container page-margin">
            <div class="quick-links-grid">
                <div class="quick-link-card"><h3>Skin Conditions</h3><p>Eczema, Psoriasis, Acne, Warts</p></div>
                <div class="quick-link-card"><h3>Hormonal Balance</h3><p>PCOD, Thyroid, Menstrual issues</p></div>
                <div class="quick-link-card"><h3>Respiratory</h3><p>Asthma, Sinusitis, Allergic Rhinitis</p></div>
                <div class="quick-link-card"><h3>Digestive Health</h3><p>IBS, Gastritis, Acid Reflux</p></div>
                <div class="quick-link-card"><h3>Mental Well-being</h3><p>Anxiety, Stress, Insomnia</p></div>
                <div class="quick-link-card"><h3>Pediatrics</h3><p>Recurrent colds, Tonsillitis, Bedwetting</p></div>
            </div>
        </div>
    `;
}

function renderBooking() {
    return `
        <div class="container page-margin">
            <div class="booking-wizard glass-card">
                <div class="booking-header">
                    <h2 class="dm-serif">Book an Appointment</h2>
                    <div class="progress-bar">
                        <div class="step-indicator active">1</div>
                        <div class="step-indicator">2</div>
                        <div class="step-indicator">3</div>
                    </div>
                </div>

                <div id="step-1" class="booking-step active">
                    <div class="section-subtitle">Select Date & Time</div>
                    <div class="calendar-layout">
                        <div id="calendar-container"></div>
                        <div class="slots-section">
                            <h4>Available Slots</h4>
                            <div id="slot-container" class="slot-grid">
                                <p class="text-muted">Select a date to see available slots</p>
                            </div>
                        </div>
                    </div>
                    <div class="consultation-type mt-4">
                        <h4>Consultation Type</h4>
                        <div class="radio-group">
                            <label class="radio-option"><input type="radio" name="consultationType" value="in-person" checked> <span>In-Person Visit</span></label>
                            <label class="radio-option"><input type="radio" name="consultationType" value="video"> <span>Video Consultation</span></label>
                        </div>
                    </div>
                </div>

                <div id="step-2" class="booking-step">
                    <div class="section-subtitle">Patient Information</div>
                    <form id="booking-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Patient Name</label>
                                <input type="text" name="patientName" required placeholder="Full Name">
                            </div>
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="tel" name="phone" required pattern="[0-9]{10}" placeholder="10-digit mobile">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Age</label>
                                <input type="number" name="age" required min="0" max="120">
                            </div>
                            <div class="form-group">
                                <label>Gender</label>
                                <select name="gender" required>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group full-width">
                            <label>Briefly describe your symptoms</label>
                            <textarea name="symptoms" rows="3" placeholder="Symptoms, duration, etc."></textarea>
                        </div>
                    </form>
                </div>

                <div id="step-3" class="booking-step">
                    <div class="section-subtitle">Confirm Your Booking</div>
                    <div id="booking-summary" class="glass-card summary-card"></div>
                    <div class="alert-info glass-card mt-4" style="background: var(--primary-light); padding: 20px;">
                        <p><strong>Consultation Fee:</strong> ₹200 (Payable at the clinic)</p>
                        <p class="text-sm">Please arrive 10 minutes before your scheduled time.</p>
                    </div>
                </div>

                <div class="booking-nav">
                    <button id="prev-btn" class="btn btn-outline" style="visibility:hidden;" onclick="Booking.renderStep(Booking.currentStep - 1)">← Previous</button>
                    <button id="next-btn" class="btn btn-accent" disabled onclick="Booking.currentStep === 3 ? Booking.confirm() : Booking.next()">
                        Next →
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderPortal() {
    return `
        <div class="container page-margin">
            <div class="portal-login-container glass-card max-w-md mx-auto p-12 text-center">
                <div class="portal-icon" style="font-size: 64px; margin-bottom: 20px;">👤</div>
                <h1 class="dm-serif">Patient Portal</h1>
                <p class="text-muted mb-8">Access your clinical history, prescriptions, and upcoming appointments securely.</p>
                
                <div class="form-group text-left">
                    <label>Registered Phone Number</label>
                    <input type="tel" id="portal-phone" placeholder="Enter 10-digit number" class="glass-input">
                </div>
                
                <button class="btn btn-primary full-width mt-8" onclick="Portal.login()">
                    Access Dashboard <span>→</span>
                </button>
                
                <p class="mt-8 text-sm text-muted">Not registered? <a href="/book" data-route="/book" class="text-accent">Book your first appointment</a></p>
            </div>
        </div>
    `;
}

function renderAdmin(sub) {
    // Admin.init() immediately replaces this with its own login/dashboard UI
    return `<div class="container page-margin"><div class="spinner" style="margin:80px auto;"></div></div>`;
}

async function renderBlog(app) {
    app.innerHTML = '<div class="container page-margin"><h1 class="dm-serif section-title">Health Blog</h1><div id="blog-grid" class="features-grid"><div class="spinner"></div></div></div>';
    try {
        const posts = await API.get('/blog');
        const grid = document.getElementById('blog-grid');
        grid.innerHTML = posts.map(post => `
            <div class="glass-card feature-card">
                <img src="${post.coverImageUrl}" alt="${post.title}" style="width:100%; border-radius:10px; margin-bottom:1rem;">
                <span class="text-accent">${post.category}</span>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <a href="/blog/${post.slug}" data-route="/blog/${post.slug}" class="btn-text">Read More →</a>
            </div>
        `).join('');
    } catch (e) {
        document.getElementById('blog-grid').innerHTML = '<p>Error loading blog posts</p>';
    }
}

async function renderBlogPost(app, slug) {
    app.innerHTML = '<div class="container page-margin"><div id="post-content" class="glass-card"><div class="spinner"></div></div></div>';
    try {
        const post = await API.get(`/blog/${slug}`);
        const container = document.getElementById('post-content');
        container.innerHTML = `
            <a href="/blog" data-route="/blog" class="btn-text">← Back to Blog</a>
            <img src="${post.coverImageUrl}" alt="${post.title}" style="width:100%; max-height:400px; object-fit:cover; border-radius:15px; margin: 1rem 0;">
            <h1 class="dm-serif">${post.title}</h1>
            <div class="post-meta mb-4">
                <span>By ${post.author}</span> • <span>${post.createdAt}</span> • <span>${post.readTime}</span>
            </div>
            <div class="post-body">
                ${post.content}
            </div>
        `;
    } catch (e) {
        document.getElementById('post-content').innerHTML = '<p>Post not found</p>';
    }
}

function renderAISuite() {
    return `
        <section class="hero-peerless hero-small">
            <div class="container">
                <span class="sub-heading">Advanced Diagnostics</span>
                <h1 class="gradient-text">AI Health Suite</h1>
                <p>Harness the power of AI for faster insights and better health decisions.</p>
            </div>
        </section>

        <div class="container page-margin">
            <div class="ai-grid">
                <!-- Disease Prediction -->
                <div class="glass-card ai-tool-card animate-on-scroll">
                    <div class="tool-header">
                        <span class="tool-icon">🧠</span>
                        <h3>Disease Prediction</h3>
                    </div>
                    <p>Enter your symptoms to see potential health conditions.</p>
                    <div class="input-group mt-4">
                        <input type="text" id="symptom-input" placeholder="e.g. Fever, Cough, Fatigue..." class="glass-input">
                        <div id="symptom-tags" class="tags-container mt-2"></div>
                        <button class="btn btn-primary full-width mt-4" onclick="AISuite.analyzeSymptoms()">Analyze Symptoms</button>
                    </div>
                    <div id="analysis-result" class="mt-4"></div>
                </div>

                <!-- Medical Report Analyzer -->
                <div class="glass-card ai-tool-card animate-on-scroll">
                    <div class="tool-header">
                        <span class="tool-icon">📄</span>
                        <h3>Report Analyzer</h3>
                    </div>
                    <p>Upload Blood reports, X-rays, or ECGs for instant analysis.</p>
                    <div class="upload-area mt-4" onclick="document.getElementById('report-upload').click()">
                        <input type="file" id="report-upload" class="hidden" onchange="AISuite.analyzeReport()">
                        <div class="upload-placeholder">
                            <span>⬆️</span>
                            <p>Click to upload Medical Report</p>
                            <span class="text-xs text-muted">Supports JPG, PNG, PDF</span>
                        </div>
                    </div>
                    <div id="report-result" class="mt-4"></div>
                </div>

                <!-- Prescription Analyzer -->
                <div class="glass-card ai-tool-card animate-on-scroll">
                    <div class="tool-header">
                        <span class="tool-icon">💊</span>
                        <h3>Prescription Safety</h3>
                    </div>
                    <p>Check for drug interactions, allergies, and overdose alerts.</p>
                    <div class="upload-area mt-4" onclick="document.getElementById('rx-upload').click()">
                        <input type="file" id="rx-upload" class="hidden" onchange="AISuite.analyzePrescription()">
                        <div class="upload-placeholder">
                            <span>📷</span>
                            <p>Upload Doctor's Prescription</p>
                        </div>
                    </div>
                    <div id="rx-analysis-result" class="mt-4"></div>
                </div>

                <!-- Health Risk Score -->
                <div class="glass-card ai-tool-card animate-on-scroll">
                    <div class="tool-header">
                        <span class="tool-icon">⚖️</span>
                        <h3>Health Risk Score</h3>
                    </div>
                    <p>Calculate your BMI, Heart, and Lifestyle risk scores.</p>
                    <div class="risk-form mt-4">
                        <div class="form-row">
                            <div class="form-group"><label>Age</label><input type="number" id="risk-age" class="glass-input"></div>
                            <div class="form-group"><label>Weight (kg)</label><input type="number" id="risk-weight" class="glass-input"></div>
                        </div>
                        <div class="form-group"><label>Height (cm)</label><input type="number" id="risk-height" class="glass-input"></div>
                        <button class="btn btn-accent full-width" onclick="AISuite.calculateRiskScore()">Generate Score</button>
                    </div>
                    <div id="risk-result" class="mt-4"></div>
                </div>

                <!-- Heart Predictor -->
                <div class="glass-card ai-tool-card animate-on-scroll">
                    <div class="tool-header">
                        <span class="tool-icon">❤️</span>
                        <h3>Heart Predictor ML</h3>
                    </div>
                    <p>Advanced Machine Learning model to predict heart disease risk based on clinical parameters.</p>
                    <div class="mt-4">
                        <a href="https://abhim200.github.io/Heart-Predictor-Using-Machine-Learning/" target="_blank" class="btn btn-primary full-width" style="justify-content: center;">
                            Launch Predictor <span style="margin-left: 8px;">↗</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderContact() {
    return `
        <section class="hero-peerless hero-small">
            <div class="container">
                <span class="sub-heading">Connect With Us</span>
                <h1>Contact Our Clinic</h1>
            </div>
        </section>
        <div class="container page-margin">
            <div class="about-summary-grid">
                <div class="quick-link-card">
                    <h3>Get in Touch</h3>
                    <p><strong>Address:</strong> Padri Bazar, Mohanapur, Gorakhpur, UP</p>
                    <p><strong>Phone:</strong> +91 7005574327</p>
                    <p><strong>Email:</strong> drvandita@clinic.in</p>
                    <p><strong>Working Hours:</strong> Mon-Sat (9AM-1PM, 4PM-8PM)</p>
                </div>
                <div class="quick-link-card" style="text-align: left;">
                    <h3>Send a Message</h3>
                    <form onsubmit="event.preventDefault(); toast('Message sent! We will contact you soon.')">
                        <div class="form-group"><input type="text" placeholder="Name" required class="full-width" style="width: 100%; padding: 10px; margin-top: 10px; border: 1px solid var(--border); border-radius: 5px;"></div>
                        <div class="form-group mt-2"><input type="email" placeholder="Email" required class="full-width" style="width: 100%; padding: 10px; margin-top: 10px; border: 1px solid var(--border); border-radius: 5px;"></div>
                        <div class="form-group mt-2"><textarea placeholder="Message" required class="full-width" rows="4" style="width: 100%; padding: 10px; margin-top: 10px; border: 1px solid var(--border); border-radius: 5px;"></textarea></div>
                        <button class="btn btn-primary mt-4">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    `;
}
