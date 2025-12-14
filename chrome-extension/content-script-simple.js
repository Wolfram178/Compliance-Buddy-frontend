// Simplified Content Script - More reliable overlay injection

let overlayInjected = false;

console.log('🛡️ ComplianceBuddy content script loaded');

// Listen for activation message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  
  if (request.action === 'toggleOverlay') {
    if (overlayInjected) {
      removeOverlay();
      sendResponse({ success: true, action: 'removed' });
    } else {
      injectOverlay();
      sendResponse({ success: true, action: 'injected' });
    }
    return true;
  }
});

function injectOverlay() {
  console.log('🚀 Starting overlay injection...');
  
  // Check if already exists
  if (document.getElementById('compliancebuddy-root')) {
    console.log('⚠️ Overlay already exists');
    return;
  }

  // Create root div
  const root = document.createElement('div');
  root.id = 'compliancebuddy-root';
  root.innerHTML = `
    <div id="cb-overlay" style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      border: 1px solid rgba(255,255,255,0.1);
      z-index: 2147483647;
      font-family: system-ui, -apple-system, sans-serif;
      color: white;
      overflow: hidden;
    ">
      <!-- Header -->
      <div style="
        background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
      " id="cb-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="
            width: 32px;
            height: 32px;
            background: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          ">🛡️</div>
          <div>
            <div style="font-weight: bold; font-size: 14px;">ComplianceBuddy</div>
            <div style="font-size: 11px; opacity: 0.8;">AI Compliance Assistant</div>
          </div>
        </div>
        <button id="cb-close" style="
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">×</button>
      </div>

      <!-- Tabs -->
      <div style="
        display: flex;
        gap: 8px;
        padding: 12px 16px;
        background: rgba(0,0,0,0.2);
      ">
        <button class="cb-tab" data-tab="validate" style="
          flex: 1;
          padding: 10px;
          background: rgba(59,130,246,0.3);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
        ">✓ Validate</button>
        <button class="cb-tab" data-tab="chat" style="
          flex: 1;
          padding: 10px;
          background: transparent;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
        ">💬 Chat</button>
      </div>

      <!-- Content Area -->
      <div style="padding: 16px; min-height: 300px; max-height: 400px; overflow-y: auto;">
        <!-- Validate Tab -->
        <div id="cb-validate-tab">
          <button id="cb-validate-btn" style="
            width: 100%;
            padding: 14px;
            background: linear-gradient(90deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 16px;
          ">🔍 Validate Page</button>
          
          <div id="cb-result" style="display: none;"></div>
        </div>

        <!-- Chat Tab -->
        <div id="cb-chat-tab" style="display: none;">
          <div id="cb-messages" style="
            max-height: 280px;
            overflow-y: auto;
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          ">
            <div style="
              padding: 10px 12px;
              background: rgba(139,92,246,0.15);
              border-radius: 10px;
              font-size: 13px;
            ">Hi! I can help explain compliance issues.</div>
          </div>

          <div style="display: flex; gap: 8px;">
            <input id="cb-chat-input" type="text" placeholder="Ask about compliance..." style="
              flex: 1;
              padding: 10px;
              background: rgba(255,255,255,0.05);
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: 8px;
              color: white;
              font-size: 13px;
              outline: none;
            ">
            <button id="cb-chat-send" style="
              padding: 10px 16px;
              background: linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%);
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-weight: bold;
            ">→</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(root);
  console.log('✅ Overlay HTML injected');

  // Add event listeners
  setupEventListeners();
  makeDraggable();
  
  overlayInjected = true;
  console.log('✅ ComplianceBuddy overlay fully loaded!');
}

function setupEventListeners() {
  // Close button
  document.getElementById('cb-close').addEventListener('click', removeOverlay);

  // Tab switching
  document.querySelectorAll('.cb-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab;
      
      // Update tab styles
      document.querySelectorAll('.cb-tab').forEach(t => {
        t.style.background = 'transparent';
      });
      e.target.style.background = tabName === 'validate' ? 'rgba(59,130,246,0.3)' : 'rgba(139,92,246,0.3)';
      
      // Show/hide content
      document.getElementById('cb-validate-tab').style.display = tabName === 'validate' ? 'block' : 'none';
      document.getElementById('cb-chat-tab').style.display = tabName === 'chat' ? 'block' : 'none';
    });
  });

  // Validate button
  document.getElementById('cb-validate-btn').addEventListener('click', handleValidate);

  // Chat send
  document.getElementById('cb-chat-send').addEventListener('click', handleChat);
  document.getElementById('cb-chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
  });
}

function makeDraggable() {
  const overlay = document.getElementById('cb-overlay');
  const header = document.getElementById('cb-header');
  
  let isDragging = false;
  let currentX, currentY, initialX, initialY;

  header.addEventListener('mousedown', (e) => {
    if (e.target.id === 'cb-close') return;
    
    isDragging = true;
    initialX = e.clientX - overlay.offsetLeft;
    initialY = e.clientY - overlay.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    
    overlay.style.left = currentX + 'px';
    overlay.style.top = currentY + 'px';
    overlay.style.right = 'auto';
    overlay.style.bottom = 'auto';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

async function handleValidate() {
  const btn = document.getElementById('cb-validate-btn');
  const resultDiv = document.getElementById('cb-result');
  
  btn.textContent = '⏳ Validating...';
  btn.disabled = true;
  
  // Scrape page text
  const selection = window.getSelection().toString().trim();
  const text = selection || document.body.innerText.substring(0, 10000);
  
  try {
    const formData = new FormData();
    formData.append('checklist_id', 'WEB_PAGE_SCAN');
    formData.append('control_text', 'Page content compliance validation');
    formData.append('evidence_text', text);
    
    const response = await fetch('https://gently-metal-maria-publicly.trycloudflare.com/api/validate', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Validation failed');
    
    const result = await response.json();
    
    // Display result
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <div style="
        background: rgba(255,255,255,0.05);
        border-radius: 12px;
        padding: 16px;
      ">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <div>
            <div style="opacity: 0.7; font-size: 12px; margin-bottom: 4px;">Verdict</div>
            <div style="font-weight: bold; font-size: 16px;">${result.verdict || 'N/A'}</div>
          </div>
          <div style="text-align: right;">
            <div style="opacity: 0.7; font-size: 12px; margin-bottom: 4px;">Score</div>
            <div style="font-weight: bold; font-size: 20px; color: ${result.score >= 80 ? '#10b981' : result.score >= 60 ? '#fbbf24' : '#ef4444'};">
              ${result.score ? result.score + '%' : 'N/A'}
            </div>
          </div>
        </div>
        ${result.explanation ? `
          <div style="
            margin-top: 12px;
            padding: 12px;
            background: rgba(139,92,246,0.1);
            border-radius: 8px;
            font-size: 12px;
            line-height: 1.6;
          ">${result.explanation}</div>
        ` : ''}
      </div>
    `;
    
  } catch (error) {
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <div style="
        background: rgba(239,68,68,0.1);
        border: 1px solid rgba(239,68,68,0.3);
        border-radius: 8px;
        padding: 12px;
        color: #fca5a5;
        font-size: 13px;
      ">❌ Error: ${error.message}</div>
    `;
  } finally {
    btn.textContent = '🔍 Validate Page';
    btn.disabled = false;
  }
}

async function handleChat() {
  const input = document.getElementById('cb-chat-input');
  const messagesDiv = document.getElementById('cb-messages');
  const query = input.value.trim();
  
  if (!query) return;
  
  // Add user message
  const userMsg = document.createElement('div');
  userMsg.style.cssText = 'padding: 10px 12px; background: rgba(59,130,246,0.2); border-radius: 10px; font-size: 13px; align-self: flex-end; max-width: 85%;';
  userMsg.textContent = query;
  messagesDiv.appendChild(userMsg);
  
  input.value = '';
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  
  try {
    const response = await fetch('https://gently-metal-maria-publicly.trycloudflare.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, context: null })
    });
    
    if (!response.ok) throw new Error('Chat failed');
    
    const data = await response.json();
    
    // Add AI message
    const aiMsg = document.createElement('div');
    aiMsg.style.cssText = 'padding: 10px 12px; background: rgba(139,92,246,0.15); border-radius: 10px; font-size: 13px; line-height: 1.5; max-width: 85%;';
    aiMsg.textContent = data.reply;
    messagesDiv.appendChild(aiMsg);
    
  } catch (error) {
    const errorMsg = document.createElement('div');
    errorMsg.style.cssText = 'padding: 10px 12px; background: rgba(239,68,68,0.1); border-radius: 10px; font-size: 13px; color: #fca5a5;';
    errorMsg.textContent = 'Error: ' + error.message;
    messagesDiv.appendChild(errorMsg);
  }
  
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeOverlay() {
  const root = document.getElementById('compliancebuddy-root');
  if (root) {
    root.remove();
    overlayInjected = false;
    console.log('🗑️ Overlay removed');
  }
}

console.log('✅ ComplianceBuddy ready! Click extension icon to activate.');
