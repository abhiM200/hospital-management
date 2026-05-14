const AISuite = {
    symptoms: [],
    
    init() {
        console.log('AI Suite Initialized');
        this.setupSymptomsSearch();
    },

    setupSymptomsSearch() {
        const input = document.getElementById('symptom-input');
        if (!input) return;
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                this.addSymptom(input.value.trim());
                input.value = '';
            }
        });
    },

    addSymptom(name) {
        if (this.symptoms.includes(name)) return;
        this.symptoms.push(name);
        this.renderSymptoms();
    },

    removeSymptom(name) {
        this.symptoms = this.symptoms.filter(s => s !== name);
        this.renderSymptoms();
    },

    renderSymptoms() {
        const container = document.getElementById('symptom-tags');
        container.innerHTML = this.symptoms.map(s => `
            <span class="tag animate-child">
                ${s} <button onclick="AISuite.removeSymptom('${s}')">×</button>
            </span>
        `).join('');
    },

    async analyzeSymptoms() {
        if (this.symptoms.length === 0) return toast('Please enter some symptoms', 'warning');
        
        const resultDiv = document.getElementById('analysis-result');
        resultDiv.innerHTML = '<div class="spinner"></div><p>AI is analyzing patterns...</p>';
        
        // Simulating AI analysis
        await new Promise(r => setTimeout(r, 2000));
        
        const predictions = this.getMockPredictions(this.symptoms);
        
        resultDiv.innerHTML = `
            <div class="prediction-card glass-card fade-in">
                <h4>Analysis Results</h4>
                ${predictions.map(p => `
                    <div class="prediction-item">
                        <div class="prediction-info">
                            <strong>${p.disease}</strong>
                            <span>Confidence: ${p.confidence}%</span>
                        </div>
                        <div class="progress-bar-small"><div class="progress" style="width: ${p.confidence}%"></div></div>
                        <p class="text-sm text-muted">${p.desc}</p>
                    </div>
                `).join('')}
                <div class="alert-info mt-4">
                    <p>⚠️ <strong>Disclaimer:</strong> This is an AI-powered prediction for informational purposes. Please consult Dr. Vandita for a professional diagnosis.</p>
                </div>
                <button class="btn btn-outline mt-4" onclick="Booking.init(); navigate('/book')">Book Consultation</button>
            </div>
        `;
    },

    getMockPredictions(symptoms) {
        const s = symptoms.map(x => x.toLowerCase());
        const results = [];
        
        if (s.some(x => x.includes('fever')) && s.some(x => x.includes('cough'))) {
            results.push({ disease: 'Viral Infection / Flu', confidence: 85, desc: 'Common symptoms including respiratory distress and elevated temperature.' });
        }
        if (s.some(x => x.includes('fatigue')) && s.some(x => x.includes('thirst'))) {
            results.push({ disease: 'Diabetes Risk', confidence: 65, desc: 'Metabolic markers suggest potential glucose regulation issues.' });
        }
        if (s.some(x => x.includes('chest pain')) || s.some(x => x.includes('breath'))) {
            results.push({ disease: 'Cardiovascular Stress', confidence: 70, desc: 'Signs of heart strain detected. Immediate clinical review recommended.' });
        }
        
        if (results.length === 0) {
            results.push({ disease: 'General Malaise', confidence: 40, desc: 'Non-specific symptoms. Could be related to stress or seasonal changes.' });
        }
        
        return results;
    },

    async analyzeReport() {
        const fileInput = document.getElementById('report-upload');
        if (!fileInput.files.length) return toast('Please select a file', 'warning');
        
        const resultDiv = document.getElementById('report-result');
        const fileName = fileInput.files[0].name.toLowerCase();
        resultDiv.innerHTML = '<div class="spinner"></div><p>AI OCR Scanning & Analyzing Patterns...</p>';
        
        await new Promise(r => setTimeout(r, 3000));
        
        let reportData = '';
        if (fileName.includes('blood')) {
            reportData = `
                <table class="report-table">
                    <tr><th>Parameter</th><th>Value</th><th>Reference</th><th>Status</th></tr>
                    <tr class="danger"><td>Hemoglobin</td><td>10.2 g/dL</td><td>12-16</td><td>LOW</td></tr>
                    <tr class="warning"><td>Total Cholesterol</td><td>210 mg/dL</td><td><200</td><td>HIGH</td></tr>
                    <tr class="success"><td>Glucose (Fasting)</td><td>95 mg/dL</td><td>70-100</td><td>NORMAL</td></tr>
                </table>
            `;
        } else if (fileName.includes('xray') || fileName.includes('x-ray')) {
            reportData = `
                <div class="analysis-summary">
                    <p><strong>Region:</strong> Chest PA View</p>
                    <p><strong>Findings:</strong> Mild opacity in the lower left lobe. Suggestive of early-stage congestion.</p>
                    <p class="warning"><strong>AI Warning:</strong> Possible Bronchitis patterns detected.</p>
                </div>
            `;
        } else if (fileName.includes('mri') || fileName.includes('brain')) {
            reportData = `
                <div class="analysis-summary">
                    <p><strong>Study:</strong> Brain MRI w/o Contrast</p>
                    <p><strong>Findings:</strong> No acute intracranial hemorrhage. Normal ventricular system.</p>
                    <p class="success"><strong>Conclusion:</strong> Unremarkable study. No AI-detected abnormalities.</p>
                </div>
            `;
        } else {
            reportData = `
                <div class="analysis-summary">
                    <p><strong>Diagnostic Type:</strong> General Scan</p>
                    <p><strong>Findings:</strong> Automated scanning complete. No life-threatening anomalies detected.</p>
                    <p class="warning"><strong>Status:</strong> Manual review by Dr. Vandita recommended for minor variations.</p>
                </div>
            `;
        }
        
        resultDiv.innerHTML = `
            <div class="glass-card fade-in">
                <div class="flex-center mb-4" style="color: var(--primary);">
                    <span style="font-size: 24px; margin-right: 10px;">🛡️</span>
                    <h4 style="margin: 0;">Diagnostic Intelligence Report</h4>
                </div>
                ${reportData}
                <div class="risk-meter mt-4">
                    <p><strong>AI Risk Assessment:</strong> ${fileName.includes('blood') ? 'MODERATE' : 'LOW'}</p>
                    <div class="progress-bar-small"><div class="progress" style="width: ${fileName.includes('blood') ? '45%' : '15%'}; background: ${fileName.includes('blood') ? 'orange' : 'green'};"></div></div>
                </div>
                <div class="mt-4">
                    <h5>Clinical Suggestions:</h5>
                    <ul class="text-sm">
                        <li>${fileName.includes('blood') ? 'Consult regarding Anemic markers.' : 'Maintain current health regimen.'}</li>
                        <li>Digital copy saved to your patient portal.</li>
                    </ul>
                </div>
            </div>
        `;
    },

    calculateRiskScore() {
        const age = document.getElementById('risk-age').value;
        const weight = document.getElementById('risk-weight').value;
        const height = document.getElementById('risk-height').value;
        
        if (!age || !weight || !height) return toast('Please fill all fields', 'warning');
        
        const bmi = (weight / ((height/100) * (height/100))).toFixed(1);
        let status = 'Normal';
        if (bmi > 25) status = 'Overweight';
        if (bmi < 18.5) status = 'Underweight';
        
        const heartRisk = Math.floor(Math.random() * 15 + 5);
        const sugarRisk = bmi > 26 ? 60 : 30;
        const stressScore = Math.floor(Math.random() * 40 + 20);
        const lifestyleScore = 100 - (bmi > 25 ? 20 : 0) - (age > 50 ? 10 : 0);

        const resultDiv = document.getElementById('risk-result');
        resultDiv.innerHTML = `
            <div class="glass-card fade-in">
                <h4 class="dm-serif mb-4">Your Health Risk Profile</h4>
                <div class="risk-grid">
                    <div class="risk-item">
                        <span class="label">BMI Index</span>
                        <span class="value">${bmi}</span>
                    </div>
                    <div class="risk-item">
                        <span class="label">Heart Risk</span>
                        <span class="value">${heartRisk}%</span>
                    </div>
                    <div class="risk-item">
                        <span class="label">Sugar Risk</span>
                        <span class="value">${sugarRisk > 50 ? 'High' : 'Normal'}</span>
                    </div>
                    <div class="risk-item">
                        <span class="label">Lifestyle</span>
                        <span class="value">${lifestyleScore}/100</span>
                    </div>
                </div>
                <div class="chart-container mt-4" style="height: 250px;">
                    <canvas id="risk-radar-chart"></canvas>
                </div>
            </div>
        `;
        
        this.renderRiskChart(bmi, heartRisk, sugarRisk, stressScore, lifestyleScore);
    },

    renderRiskChart(bmi, heart, sugar, stress, lifestyle) {
        setTimeout(() => {
            Charts.radar('risk-radar-chart', [bmi, heart, sugar, stress, lifestyle], ['BMI', 'Heart', 'Sugar', 'Stress', 'Lifestyle']);
        }, 100);
    },

    async analyzePrescription() {
        const resultDiv = document.getElementById('rx-analysis-result');
        resultDiv.innerHTML = '<div class="spinner"></div><p>Scanning handwriting and cross-referencing...</p>';
        
        await new Promise(r => setTimeout(r, 2500));
        
        resultDiv.innerHTML = `
            <div class="glass-card fade-in" style="border-left: 5px solid var(--accent);">
                <h4 style="color: var(--accent);">⚠️ Interaction Warnings</h4>
                <div class="warning-item mt-4">
                    <strong>Duplicate Medication Detected:</strong>
                    <p class="text-sm">Paracetamol found in both 'Crocin' and 'Calpol'. Risk of liver toxicity.</p>
                </div>
                <div class="warning-item mt-2">
                    <strong>Allergy Alert:</strong>
                    <p class="text-sm">Patient has reported Penicillin allergy. 'Amoxicillin' detected in Rx.</p>
                </div>
                <div class="warning-item mt-2">
                    <strong>Overdose Alert:</strong>
                    <p class="text-sm">'Medicine X' dose exceeds recommended daily limit for age group.</p>
                </div>
            </div>
        `;
    }
};
