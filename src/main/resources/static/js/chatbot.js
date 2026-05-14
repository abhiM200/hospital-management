const Chatbot = {
    responses: {
        greeting: ["Hello! I'm your AI health assistant. How can I help you today?", "Hi there! I can help with symptoms, reminders, or booking. What's on your mind?"],
        symptoms: ["I can guide you based on symptoms. What are you feeling? (e.g., headache, fever)", "Based on symptoms, I can suggest possible causes, but always consult Dr. Vandita."],
        reminder: ["Sure! I can help you set medicine reminders. Which medicine and what time?", "Reminders are important. I can notify you via the patient portal."],
        appointment: ["I can help you book an appointment. Would you like to see available slots?", "Booking is easy! Just type 'book' or navigate to the booking section."],
        default: ["I'm still learning. For specific medical advice, please book an appointment with Dr. Vandita.", "That's interesting. Would you like to discuss this with our doctor?"]
    },

    init() {
        const sendBtn = document.getElementById('chat-send');
        const input = document.getElementById('chat-input-field');
        
        if (sendBtn && input) {
            sendBtn.onclick = () => this.handleMessage();
            input.onkeypress = (e) => { if (e.key === 'Enter') this.handleMessage(); };
        }
    },

    handleMessage() {
        const input = document.getElementById('chat-input-field');
        const text = input.value.trim().toLowerCase();
        if (!text) return;

        this.addMessage(input.value, 'user');
        input.value = '';

        setTimeout(() => {
            const response = this.getResponse(text);
            this.addMessage(response, 'bot');
        }, 1000);
    },

    getResponse(text) {
        if (text.includes('hi') || text.includes('hello')) return this.getRandom(this.responses.greeting);
        if (text.includes('symptom') || text.includes('feel') || text.includes('pain')) return this.getRandom(this.responses.symptoms);
        if (text.includes('remind') || text.includes('medicine')) return this.getRandom(this.responses.reminder);
        if (text.includes('book') || text.includes('appointment')) return this.getRandom(this.responses.appointment);
        
        // Symptom specific quick guidance
        if (text.includes('headache')) return "For a headache, stay hydrated and rest in a dark room. If it persists or is severe, please book a consultation.";
        if (text.includes('fever')) return "A fever is the body's way of fighting infection. Monitor your temperature and stay hydrated. Consider booking if it exceeds 101°F.";
        
        return this.getRandom(this.responses.default);
    },

    getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    addMessage(text, side) {
        const container = document.getElementById('chat-messages');
        const msg = document.createElement('div');
        msg.className = `message ${side} fade-in`;
        msg.textContent = text;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }
};

window.addEventListener('DOMContentLoaded', () => Chatbot.init());
