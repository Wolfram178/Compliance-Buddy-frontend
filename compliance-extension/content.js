// Content script for Compliance Buddy Extension
// Only runs on mockup page (localhost:5173/mockup)

console.log('Compliance Buddy content script loaded on mockup page');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showOverlay') {
    showValidationOverlay(request.data);
    sendResponse({ success: true });
  }
});

function showValidationOverlay(validationData) {
  // Remove existing overlay if present
  const existingOverlay = document.getElementById('compliance-buddy-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = 'compliance-buddy-overlay';
  overlay.innerHTML = createOverlayHTML(validationData);
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = getOverlayStyles();
  document.head.appendChild(style);
  
  // Add to page
  document.body.appendChild(overlay);
  
  // Add close functionality
  const closeBtn = overlay.querySelector('.cb-close-btn');
  closeBtn.addEventListener('click', () => {
    overlay.remove();
  });
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
  }, 10000);
  
  // Animate in
  setTimeout(() => {
    overlay.style.opacity = '1';
    overlay.style.transform = 'translateY(0)';
  }, 100);
}

function createOverlayHTML(data) {
  const verdictColor = getVerdictColor(data.verdict);
  const scoreColor = getScoreColor(data.final_score);
  
  return `
    <div class="cb-overlay-card">
      <div class="cb-header">
        <div class="cb-title">
          <span class="cb-icon">🛡️</span>
          Compliance Validation Result
        </div>
        <button class="cb-close-btn">×</button>
      </div>
      
      <div class="cb-content">
        <div class="cb-row">
          <div class="cb-label">Checklist ID:</div>
          <div class="cb-value">${data.checklist_id}</div>
        </div>
        
        <div class="cb-row">
          <div class="cb-label">Verdict:</div>
          <div class="cb-verdict cb-verdict-${data.verdict.toLowerCase()}" style="color: ${verdictColor}">
            ${getVerdictIcon(data.verdict)} ${data.verdict}
          </div>
        </div>
        
        <div class="cb-row">
          <div class="cb-label">Score:</div>
          <div class="cb-score">
            <div class="cb-score-bar">
              <div class="cb-score-fill" style="width: ${data.final_score}%; background-color: ${scoreColor}"></div>
            </div>
            <span class="cb-score-text" style="color: ${scoreColor}">${data.final_score}%</span>
          </div>
        </div>
        
        <div class="cb-section">
          <div class="cb-section-title">Explanation</div>
          <div class="cb-section-content">${data.explanation}</div>
        </div>
        
        <div class="cb-section">
          <div class="cb-section-title">Recommendation</div>
          <div class="cb-section-content">${data.recommendation}</div>
        </div>
        
        <div class="cb-section">
          <div class="cb-section-title">Guidance</div>
          <div class="cb-section-content">${data.guidance}</div>
        </div>
      </div>
      
      <div class="cb-footer">
        <div class="cb-timestamp">
          Validated at ${new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  `;
}

function getOverlayStyles() {
  return `
    #compliance-buddy-overlay {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 400px;
      max-width: calc(100vw - 40px);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
    }
    
    .cb-overlay-card {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border: 1px solid #334155;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      color: #e2e8f0;
      overflow: hidden;
    }
    
    .cb-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }
    
    .cb-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 14px;
    }
    
    .cb-icon {
      font-size: 16px;
    }
    
    .cb-close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .cb-close-btn:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .cb-content {
      padding: 20px;
    }
    
    .cb-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #334155;
    }
    
    .cb-row:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    
    .cb-label {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }
    
    .cb-value {
      font-size: 13px;
      font-weight: 600;
      color: #e2e8f0;
    }
    
    .cb-verdict {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 600;
    }
    
    .cb-score {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .cb-score-bar {
      width: 60px;
      height: 6px;
      background-color: #334155;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .cb-score-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
    }
    
    .cb-score-text {
      font-size: 13px;
      font-weight: 600;
    }
    
    .cb-section {
      margin-top: 16px;
    }
    
    .cb-section-title {
      font-size: 12px;
      color: #10b981;
      font-weight: 600;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .cb-section-content {
      font-size: 13px;
      line-height: 1.5;
      color: #cbd5e1;
    }
    
    .cb-footer {
      padding: 12px 20px;
      background-color: #1e293b;
      border-top: 1px solid #334155;
    }
    
    .cb-timestamp {
      font-size: 11px;
      color: #64748b;
      text-align: center;
    }
    
    @media (max-width: 480px) {
      #compliance-buddy-overlay {
        top: 10px;
        right: 10px;
        left: 10px;
        width: auto;
        max-width: none;
      }
    }
  `;
}

function getVerdictColor(verdict) {
  switch (verdict) {
    case 'Pass': return '#10b981';
    case 'Partial': return '#f59e0b';
    case 'Fail': return '#ef4444';
    default: return '#64748b';
  }
}

function getScoreColor(score) {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

function getVerdictIcon(verdict) {
  switch (verdict) {
    case 'Pass': return '✅';
    case 'Partial': return '⚠️';
    case 'Fail': return '❌';
    default: return '❓';
  }
}
