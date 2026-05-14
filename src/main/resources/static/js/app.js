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
            if (window.Booking) window.Booking.init();
            break;
        case 'portal':
            app.innerHTML = renderPortal();
            break;
        case 'admin':
            app.innerHTML = renderAdmin(slug);
            if (window.Admin) window.Admin.init(slug);
            break;
        case 'blog':
            await renderBlog(app);
            break;
        case 'blog-post':
            await renderBlogPost(app, slug);
            break;
        case 'ai-suite':
            app.innerHTML = renderAISuite();
            if (window.AISuite) window.AISuite.init();
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
        <!-- Hero Section Advanced -->
        <section class="hero-peerless">
            <div class="hero-background-blobs">
                <div class="blob blob-1"></div>
                <div class="blob blob-2"></div>
                <div class="blob blob-3"></div>
            </div>
            <div class="container hero-container">
                <div class="hero-text animate-on-scroll">
                    <span class="hero-badge animate-child">✨ Recognized Excellence since 1994</span>
                    <h1 class="animate-child"><span class="gradient-text">Holistic Healing</span> for a Healthier Tomorrow</h1>
                    <p class="animate-child">Experience the power of classical Homeopathy. We combine decades of traditional wisdom with modern clinical precision to deliver permanent cures for chronic ailments.</p>
                    <div class="hero-actions animate-child">
                        <a href="/book" data-route="/book" class="btn btn-primary">Book Appointment <span>→</span></a>
                        <a href="/treatments" data-route="/treatments" class="btn btn-outline">Explore Treatments</a>
                    </div>
                </div>
                <div class="hero-visual animate-on-scroll">
                    <div class="hero-main-card glass-card">
                        <img src="https://images.unsplash.com/photo-1631217818242-27497080803c?w=1000&auto=format" alt="Medical Care">
                        <div class="floating-badge top-right animate-child">
                            <span class="icon">🏆</span>
                            <div>
                                <strong>Top Rated</strong>
                                <p>Clinic in Gorakhpur</p>
                            </div>
                        </div>
                        <div class="floating-badge bottom-left animate-child">
                            <span class="icon">👨‍⚕️</span>
                            <div>
                                <strong>10k+</strong>
                                <p>Cases Resolved</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Dynamic Process -->
        <section class="process-section container">
            <div class="section-title">
                <span class="sub-heading">Our Approach</span>
                <h2>How We <span class="gradient-text">Heal</span> You</h2>
            </div>
            <div class="quick-links-grid">
                <a href="/book" data-route="/book" class="glass-card quick-link-card animate-on-scroll">
                    <div class="card-icon">01</div>
                    <h4>Discovery</h4>
                    <p>In-depth consultation to understand your unique symptoms and history.</p>
                </a>
                <a href="/book" data-route="/book" class="glass-card quick-link-card animate-on-scroll">
                    <div class="card-icon">02</div>
                    <h4>Analysis</h4>
                    <p>Expert case study using classical homeopathic principles.</p>
                </a>
                <a href="/portal" data-route="/portal" class="glass-card quick-link-card animate-on-scroll">
                    <div class="card-icon">03</div>
                    <h4>Treatment</h4>
                    <p>Precise medication tailored to your body's specific needs.</p>
                </a>
                <a href="/contact" data-route="/contact" class="glass-card quick-link-card animate-on-scroll">
                    <div class="card-icon">04</div>
                    <h4>Recovery</h4>
                    <p>Continuous monitoring and support for lasting wellness.</p>
                </a>
            </div>
        </section>

        <!-- Stats Advanced -->
        <section class="stats-peerless">
            <div class="container stats-grid">
                <div class="stat-box animate-on-scroll">
                    <div class="stat-number">15+</div>
                    <p>Years of Practice</p>
                </div>
                <div class="stat-box animate-on-scroll">
                    <div class="stat-number">50k+</div>
                    <p>Consultations</p>
                </div>
                <div class="stat-box animate-on-scroll">
                    <div class="stat-number">98%</div>
                    <p>Patient Satisfaction</p>
                </div>
                <div class="stat-box animate-on-scroll">
                    <div class="stat-number">24/7</div>
                    <p>Support Access</p>
                </div>
            </div>
        </section>

        <!-- Testimonials Advanced -->
        <section class="testimonials-advanced bg-white">
            <div class="container">
                <div class="section-title">
                    <span class="sub-heading">Global Trust</span>
                    <h2>Voices of <span class="gradient-text">Healing</span></h2>
                </div>
                <div class="testimonials-grid">
                    <div class="glass-card testimonial-card animate-on-scroll">
                        <div class="testimonial-header">
                            <div class="stars">⭐⭐⭐⭐⭐</div>
                            <div class="quote-icon">"</div>
                        </div>
                        <p>The treatment for my skin allergy was revolutionary. I had tried everything for years, but Dr. Vandita's approach finally gave me relief.</p>
                        <div class="patient-profile">
                            <div class="avatar">SM</div>
                            <div>
                                <h5>Sangita Maity</h5>
                                <span>Verified Patient</span>
                            </div>
                        </div>
                    </div>
                    <div class="glass-card testimonial-card animate-on-scroll">
                        <div class="testimonial-header">
                            <div class="stars">⭐⭐⭐⭐⭐</div>
                            <div class="quote-icon">"</div>
                        </div>
                        <p>Highly professional and empathetic. The digital records and easy WhatsApp support make the whole process so seamless.</p>
                        <div class="patient-profile">
                            <div class="avatar">PN</div>
                            <div>
                                <h5>Pritam Nag</h5>
                                <span>Chronic Care</span>
                            </div>
                        </div>
                    </div>
                    <div class="glass-card testimonial-card animate-on-scroll">
                        <div class="testimonial-header">
                            <div class="stars">⭐⭐⭐⭐⭐</div>
                            <div class="quote-icon">"</div>
                        </div>
                        <p>Homeopathy that actually works! My migraine frequency has reduced significantly in just 3 months. Truly thankful.</p>
                        <div class="patient-profile">
                            <div class="avatar">SS</div>
                            <div>
                                <h5>Sudarshan Samanta</h5>
                                <span>Health Enthusiast</span>
                            </div>
                        </div>
                    </div>
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
                    <p>Dr. Vandita is a highly qualified B.H.M.S Homeopathic Physician with over a decade of experience in providing holistic healthcare. Her journey in homeopathy started with a passion for natural medicine and a belief that the human body has an innate ability to heal itself when given the right stimulus.</p>
                    <p>Specializing in chronic conditions like PCOD, Thyroid, Skin diseases, and Migraine, she has successfully treated thousands of patients from all walks of life.</p>
                    <p>Our clinic is dedicated to providing personalized care, focusing on the root cause of ailments rather than just suppressing symptoms. We use high-quality homeopathic remedies and modern diagnostic insights to ensure the best outcomes for our patients.</p>
                </div>
                <div class="about-summary-image">
                     <img src="https://images.unsplash.com/photo-1559839734-2b71f1536783?w=800" alt="Doctor" style="border-radius: 20px;">
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
                    <button id="prev-btn" class="btn btn-outline" style="visibility: hidden" onclick="Booking.renderStep(Booking.currentStep - 1)">Previous</button>
                    <button id="next-btn" class="btn btn-accent" disabled onclick="Booking.currentStep === 3 ? Booking.confirm() : Booking.next()">
                        Next
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
    return `
        <div class="container page-margin">
            <div id="admin-login" class="glass-card max-w-md mx-auto p-12 text-center">
                <div class="admin-icon" style="font-size: 64px; margin-bottom: 20px;">🔐</div>
                <h1 class="dm-serif">Admin Gateway</h1>
                <p class="text-muted mb-8">Secure access for clinical management.</p>
                
                <div class="form-group text-left">
                    <label>Security PIN</label>
                    <input type="password" id="admin-pin" placeholder="••••" class="glass-input text-center" style="font-size: 24px; letter-spacing: 10px;">
                </div>
                
                <button class="btn btn-accent full-width mt-8" onclick="Admin.verify()">
                    Authenticate
                </button>
            </div>
            <div id="admin-dashboard" class="hidden">
                <!-- Populated by admin.js -->
            </div>
        </div>
    `;
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
