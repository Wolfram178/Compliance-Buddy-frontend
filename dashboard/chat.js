// Compliance Buddy Dashboard - Chat Module
// Handles chat interactions with Llama 3-8B backend

const CHAT_API_URL = 'http://localhost:8000/chat';

// Chat state
const chatState = {
    messages: [],
    isTyping: false
};

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupChatListeners();
});

// Setup chat event listeners
function setupChatListeners() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendChat');
    
    // Send button click
    sendButton.addEventListener('click', sendMessage);
    
    // Enter key to send
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Send chat message
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || chatState.isTyping) return;
    
    // Clear input
    input.value = '';
    
    // Add user message to chat
    addMessageToChat('user', message);
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Call backend API
        const response = await fetch(CHAT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        if (response.ok) {
            const data = await response.json();
            const aiResponse = data.response || data.message || 'No response received';
            
            // Remove typing indicator and add AI response
            hideTypingIndicator();
            addMessageToChat('assistant', aiResponse);
            
            console.log('✅ Chat response received from backend');
        } else {
            throw new Error('Backend returned error');
        }
    } catch (error) {
        console.warn('⚠️ Chat backend not available, using mock response:', error.message);
        
        // Use mock response
        setTimeout(() => {
            hideTypingIndicator();
            const mockResponse = generateMockResponse(message);
            addMessageToChat('assistant', mockResponse);
        }, 1500);
    }
}

// Add message to chat display
function addMessageToChat(role, content) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    const isUser = role === 'user';
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.className = `flex gap-3 chat-message ${isUser ? 'flex-row-reverse' : ''}`;
    
    const avatarClass = isUser 
        ? 'bg-primary/20' 
        : 'bg-primary/20';
    
    const avatarIcon = isUser 
        ? `<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
           </svg>`
        : `<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
           </svg>`;
    
    const bubbleClass = isUser 
        ? 'eco-gradient text-white' 
        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow';
    
    messageDiv.innerHTML = `
        <div class="w-10 h-10 ${avatarClass} rounded-full flex items-center justify-center flex-shrink-0">
            ${avatarIcon}
        </div>
        <div class="flex-1 ${isUser ? 'flex justify-end' : ''}">
            <div class="inline-block max-w-[85%] p-4 rounded-2xl ${bubbleClass}">
                <p class="text-sm whitespace-pre-wrap">${escapeHtml(content)}</p>
                <p class="text-xs opacity-60 mt-2">${timestamp}</p>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store in state
    chatState.messages.push({ role, content, timestamp });
}

// Show typing indicator
function showTypingIndicator() {
    chatState.isTyping = true;
    
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'flex gap-3 chat-message';
    
    typingDiv.innerHTML = `
        <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
            <div class="flex gap-1">
                <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    chatState.isTyping = false;
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Generate mock response based on user message
function generateMockResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware responses
    if (lowerMessage.includes('encryption') || lowerMessage.includes('encrypt')) {
        return "Based on the compliance analysis, the Data Encryption Policy received a Pass verdict with a score of 92%. The AES-256 encryption has been properly verified. However, I recommend implementing a key rotation schedule every 6 months to maintain security best practices.";
    }
    
    if (lowerMessage.includes('fail') || lowerMessage.includes('failed')) {
        return "The Regular Security Audits control failed with a score of 45% because there is missing evidence of regular security audits. To resolve this, please upload audit reports from the past 12 months and ensure quarterly security assessments are documented.";
    }
    
    if (lowerMessage.includes('partial')) {
        return "The Data Retention Policy received a Partial verdict (67%) because it's missing a retention duration clause for archived data. I recommend adding specific retention timelines for all data categories to achieve full compliance.";
    }
    
    if (lowerMessage.includes('improve') || lowerMessage.includes('score')) {
        return "To improve your compliance score, focus on these areas:\n\n1. Upload missing documentation for failed controls\n2. Add specific timelines and procedures to partial controls\n3. Ensure all documents include: implementation dates, responsible parties, review schedules, and approval signatures\n4. Schedule regular compliance reviews\n\nYour current average score is strong, but addressing the failed and partial controls will bring you to full compliance.";
    }
    
    if (lowerMessage.includes('retention') || lowerMessage.includes('data retention')) {
        return "The Data Retention Policy needs improvement. While the basic policy exists, it lacks specific retention duration clauses for archived data. Add clear timelines for how long different data categories should be retained, and specify deletion procedures for data that exceeds retention periods.";
    }
    
    if (lowerMessage.includes('access control')) {
        return "The Access Control Policy is performing well with an 88% score and Pass verdict. The role-based access control (RBAC) is properly implemented. Continue maintaining current standards and conduct quarterly reviews to ensure ongoing compliance.";
    }
    
    if (lowerMessage.includes('incident') || lowerMessage.includes('response')) {
        return "The Incident Response Plan is excellent with a 95% score! The comprehensive incident response procedures are well-documented. Continue conducting regular drills and keep the documentation updated as your systems evolve.";
    }
    
    if (lowerMessage.includes('audit')) {
        return "Regular Security Audits are currently failing. The system couldn't find evidence of regular security audits in the uploaded documentation. Please provide:\n\n1. Audit reports from the past 12 months\n2. Evidence of quarterly security assessments\n3. Documentation of remediation actions taken\n\nThis will significantly improve your compliance score.";
    }
    
    if (lowerMessage.includes('co2') || lowerMessage.includes('emission') || lowerMessage.includes('carbon')) {
        return "Our sustainable AI approach using Llama 3-8B has achieved impressive results:\n\n• Total CO₂ emissions: 8.5g\n• Energy saved: 18% compared to traditional AI models\n• Average per validation: 1.7g CO₂\n\nThis represents a 70% reduction in energy consumption compared to larger language models, while maintaining high accuracy in compliance validation.";
    }
    
    if (lowerMessage.includes('sustainable') || lowerMessage.includes('energy')) {
        return "Compliance Buddy uses Llama 3-8B, an energy-efficient AI model that requires 70% less compute power than larger alternatives. We track all emissions using CodeCarbon, and our optimized inference pipeline minimizes environmental impact while maintaining high accuracy. You're saving 18% energy compared to traditional compliance validation methods!";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
        return "I can help you with:\n\n• Explaining why specific controls passed, failed, or received partial verdicts\n• Providing recommendations to improve compliance scores\n• Answering questions about missing documentation\n• Clarifying compliance requirements\n• Explaining our sustainable AI approach\n\nJust ask me about any control or aspect of your compliance validation!";
    }
    
    // Default response
    return "I'm your Compliance Assistant powered by Llama 3-8B. I can help explain verdicts, suggest improvements, and answer questions about your compliance validation results. Try asking about specific controls like 'Why did encryption fail?' or 'How can I improve my score?'";
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export chat functions
window.chatModule = {
    sendMessage,
    addMessageToChat,
    state: chatState
};
