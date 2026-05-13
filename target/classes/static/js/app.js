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
            if (typeof createParticles === 'function') createParticles();
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
        case 'contact':
            app.innerHTML = renderContact();
            break;
        default:
            app.innerHTML = '<div class="container"><h1>404</h1><p>Page not found</p></div>';
    }
    
    // Re-initialize any page-specific animations
    if (typeof initAnimations === 'function') initAnimations();
}

function renderHome() {
    return `
        <section class="hero">
            <div class="hero-content animate-on-scroll">
                <h1 class="dm-serif">Holistic Healing for a <span class="text-accent">Better Life</span></h1>
                <p>Experience the power of classical homeopathy with Dr. Vandita. Personalized care for your long-term well-being.</p>
                <div class="hero-btns">
                    <a href="/book" data-route="/book" class="btn btn-accent">Book Appointment</a>
                    <a href="/treatments" data-route="/treatments" class="btn btn-outline">Our Treatments</a>
                </div>
            </div>
            <div class="hero-image animate-on-scroll">
                <div class="glass-card main-hero-card">
                    <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800" alt="Homeopathy">
                </div>
            </div>
        </section>

        <section class="stats container animate-on-scroll">
            <div class="stat-item">
                <h2 class="stat-number">10+</h2>
                <p>Years Experience</p>
            </div>
            <div class="stat-item">
                <h2 class="stat-number">5000+</h2>
                <p>Happy Patients</p>
            </div>
            <div class="stat-item">
                <h2 class="stat-number">98%</h2>
                <p>Success Rate</p>
            </div>
        </section>

        <section class="features container">
            <h2 class="section-title">Why Choose Us?</h2>
            <div class="features-grid">
                <div class="glass-card feature-card animate-on-scroll">
                    <div class="feature-icon">🌿</div>
                    <h3>Natural Healing</h3>
                    <p>Safe, side-effect free treatments that stimulate your body's own healing powers.</p>
                </div>
                <div class="glass-card feature-card animate-on-scroll">
                    <div class="feature-icon">🔍</div>
                    <h3>Root Cause Analysis</h3>
                    <p>We don't just treat symptoms; we address the underlying cause of your illness.</p>
                </div>
                <div class="glass-card feature-card animate-on-scroll">
                    <div class="feature-icon">🤝</div>
                    <h3>Personalized Care</h3>
                    <p>Every patient is unique. We provide tailored remedies based on your specific profile.</p>
                </div>
            </div>
        </section>
    `;
}

function renderAbout() {
    return `
        <div class="container page-margin">
            <h1 class="dm-serif section-title">About Dr. Vandita</h1>
            <div class="about-grid">
                <div class="about-text glass-card">
                    <p>Dr. Vandita is a highly qualified B.H.M.S Homeopathic Physician with over a decade of experience in providing holistic healthcare.</p>
                    <p>Her journey in homeopathy started with a passion for natural medicine and a belief that the human body has an innate ability to heal itself when given the right stimulus.</p>
                    <p>Specializing in chronic conditions like PCOD, Thyroid, Skin diseases, and Migraine, she has successfully treated thousands of patients from all walks of life.</p>
                </div>
                <div class="about-image glass-card">
                     <img src="https://images.unsplash.com/photo-1559839734-2b71f1536783?w=800" alt="Doctor">
                </div>
            </div>
        </div>
    `;
}

function renderTreatments() {
    return `
        <div class="container page-margin">
            <h1 class="dm-serif section-title">Treatments</h1>
            <div class="features-grid">
                <div class="glass-card feature-card"><h3>Skin Conditions</h3><p>Eczema, Psoriasis, Acne, Warts</p></div>
                <div class="glass-card feature-card"><h3>Hormonal Balance</h3><p>PCOD, Thyroid, Menstrual issues</p></div>
                <div class="glass-card feature-card"><h3>Respiratory</h3><p>Asthma, Sinusitis, Allergic Rhinitis</p></div>
                <div class="glass-card feature-card"><h3>Digestive Health</h3><p>IBS, Gastritis, Acid Reflux</p></div>
                <div class="glass-card feature-card"><h3>Mental Well-being</h3><p>Anxiety, Stress, Insomnia</p></div>
                <div class="glass-card feature-card"><h3>Pediatrics</h3><p>Recurrent colds, Tonsillitis, Bedwetting</p></div>
            </div>
        </div>
    `;
}

function renderBooking() {
    return `
        <div class="container page-margin">
            <div class="booking-container glass-card">
                <div class="booking-header">
                    <h2>Book an Appointment</h2>
                    <div class="step-indicators">
                        <div class="step-indicator active">1</div>
                        <div class="step-indicator">2</div>
                        <div class="step-indicator">3</div>
                    </div>
                </div>

                <div id="step-1" class="booking-step active">
                    <h3>Select Date & Time</h3>
                    <div class="calendar-layout">
                        <div id="calendar-container"></div>
                        <div class="slots-section">
                            <h4>Available Slots</h4>
                            <div id="slot-container" class="slots-grid">
                                <p class="text-muted">Select a date to see available slots</p>
                            </div>
                        </div>
                    </div>
                    <div class="consultation-type mt-4">
                        <h4>Consultation Type</h4>
                        <div class="radio-group">
                            <label><input type="radio" name="consultationType" value="in-person" checked> In-Person</label>
                            <label><input type="radio" name="consultationType" value="video"> Video Call</label>
                        </div>
                    </div>
                </div>

                <div id="step-2" class="booking-step">
                    <h3>Patient Information</h3>
                    <form id="booking-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Patient Name</label>
                                <input type="text" name="patientName" required placeholder="Full Name">
                            </div>
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="tel" name="phone" required pattern="[0-9]{10}" placeholder="10-digit mobile">
                            </div>
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
                            <div class="form-group full-width">
                                <label>Briefly describe your symptoms</label>
                                <textarea name="symptoms" rows="3" placeholder="Symptoms, duration, etc."></textarea>
                            </div>
                        </div>
                    </form>
                </div>

                <div id="step-3" class="booking-step">
                    <h3>Confirm & Pay</h3>
                    <div id="booking-summary" class="summary-card"></div>
                    <p class="text-muted mt-2">Note: Consultation fee of ₹200 is payable at the clinic.</p>
                </div>

                <div class="booking-footer">
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
            <div class="portal-login-container glass-card max-w-md mx-auto">
                <h1 class="dm-serif">Patient Portal</h1>
                <p>Enter your registered phone number to view your records and prescriptions.</p>
                <div class="form-group mt-4">
                    <label>Phone Number</label>
                    <input type="tel" id="portal-phone" placeholder="10-digit number">
                </div>
                <button class="btn btn-accent full-width mt-4" onclick="Portal.login()">Access Records</button>
            </div>
        </div>
    `;
}

function renderAdmin(sub) {
    return `
        <div class="container page-margin">
            <div id="admin-login" class="glass-card max-w-md mx-auto">
                <h1 class="dm-serif">Admin Login</h1>
                <div class="form-group mt-4">
                    <label>Enter Admin PIN</label>
                    <input type="password" id="admin-pin" placeholder="****">
                </div>
                <button class="btn btn-accent full-width mt-4" onclick="Admin.verify()">Login</button>
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

function renderContact() {
    return `
        <div class="container page-margin">
            <h1 class="dm-serif section-title">Contact Us</h1>
            <div class="about-grid">
                <div class="glass-card">
                    <h3>Get in Touch</h3>
                    <p><strong>Address:</strong> Padri Bazar, Mohanapur, Gorakhpur, UP</p>
                    <p><strong>Phone:</strong> +91 7005574327</p>
                    <p><strong>Email:</strong> drvandita@clinic.in</p>
                    <p><strong>Working Hours:</strong> Mon-Sat (9AM-1PM, 4PM-8PM)</p>
                </div>
                <div class="glass-card">
                    <h3>Send a Message</h3>
                    <form onsubmit="event.preventDefault(); toast('Message sent! We will contact you soon.')">
                        <div class="form-group"><input type="text" placeholder="Name" required class="full-width"></div>
                        <div class="form-group mt-2"><input type="email" placeholder="Email" required class="full-width"></div>
                        <div class="form-group mt-2"><textarea placeholder="Message" required class="full-width" rows="4"></textarea></div>
                        <button class="btn btn-accent mt-2">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    `;
}
