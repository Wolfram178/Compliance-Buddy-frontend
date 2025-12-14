// ComplianceBuddy Chrome Extension - Vendor Audit Page Integration
// Automatically detects vendor audit page and enables inline validation

const API_BASE_URL = 'https://gently-metal-maria-publicly.trycloudflare.com';

console.log('🛡️ ComplianceBuddy: Vendor Audit Page Integration Loaded');

// Check if this is the vendor audit page
function isVendorAuditPage() {
  const title = document.querySelector('h1');
  const hasComplianceTable = document.getElementById('compliance-table');
  return title?.textContent?.includes('ISO 27001') || title?.textContent?.includes('Compliance Audit') || hasComplianceTable;
}

// Extract row data from the vendor audit table
function extractRowData(row) {
  const controlId = row.querySelector('[data-field="control-id"]')?.textContent?.trim();
  const controlName = row.querySelector('[data-field="control-name"]')?.textContent?.trim();
  const controlText = row.querySelector('[data-field="control-text"]')?.textContent?.trim();
  const complianceStatus = row.querySelector('[data-field="compliance-status"] select')?.value;
  const evidenceTextarea = row.querySelector('[data-field="evidence"] textarea');
  const evidenceText = evidenceTextarea?.value?.trim();
  const fileInput = row.querySelector('[data-field="evidence"] input[type="file"]');
  const file = fileInput?.files?.[0];
  
  return {
    controlId,
    controlName,
    controlText,
    complianceStatus,
    evidenceText,
    file,
    row
  };
}

// Inject ComplianceBuddy button into each row
// No longer injects a second validate button to avoid duplicate UI.
function injectExtensionButtons() {
  return; // Intentionally disabled per UI simplification request.
}

// Handle validation triggered by extension
async function handleExtensionValidation(row) {
  const data = extractRowData(row);
  
  // Validate required fields
  if (!data.controlId || !data.controlText) {
    showNotification('Error: Missing control information', 'error', row);
    return;
  }
  
  if (data.complianceStatus !== 'yes') {
    showNotification('Please select "Yes" for compliance status', 'warning', row);
    return;
  }
  
  if (!data.evidenceText && !data.file) {
    showNotification('Please provide evidence (text or file)', 'warning', row);
    return;
  }
  
  const extensionBtn = row.querySelector('.cb-extension-btn');
  const originalText = extensionBtn?.textContent;
  if (extensionBtn) {
    extensionBtn.disabled = true;
    extensionBtn.textContent = 'Validating...';
    extensionBtn.style.background = '#6b7280';
  }
  
  try {
    // Create FormData for API request
    const formData = new FormData();
    formData.append('checklist_id', data.controlId);
    formData.append('control_text', data.controlText);
    
    if (data.file) {
      formData.append('evidence_file', data.file);
    } else {
      formData.append('evidence_text', data.evidenceText);
    }
    
    // Call validation API
    const response = await fetch(`${API_BASE_URL}/api/validate`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Validation failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Validation result:', result);
    
    // Show success notification
    showNotification('✓ Validation complete!', 'success', row);
    
    // Display result overlay
    displayResultOverlay(result, data);
    
    // Update the score cell if it exists
    const scoreCell = row.querySelector('[data-field="result"]');
    if (scoreCell && result.data) {
      const score = result.data.final_score || result.data.score || 0;
      const verdict = result.data.verdict || 'N/A';
      
      scoreCell.innerHTML = `
        <div class="space-y-1">
          <div class="font-semibold text-gray-900">${Math.round(score)}%</div>
          <div class="text-xs text-gray-600">${verdict}</div>
          <div class="text-xs text-purple-600 font-medium">✓ Via Extension</div>
        </div>
      `;
    }
    
    // Save to localStorage for dashboard
    saveValidationResult(data.controlId, result, data);
    
  } catch (error) {
    console.error('Extension validation error:', error);
    showNotification(`Error: ${error.message}`, 'error', row);
  } finally {
    if (extensionBtn) {
      extensionBtn.disabled = false;
      extensionBtn.textContent = originalText;
      extensionBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }
}

// Show inline notification
function showNotification(message, type = 'info', row) {
  const evidenceCell = row.querySelector('[data-field="evidence"]');
  if (!evidenceCell) return;
  
  // Remove existing notification
  const existing = evidenceCell.querySelector('.cb-notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = 'cb-notification';
  notification.textContent = message;
  
  const colors = {
    success: { bg: '#10b981', text: 'white' },
    error: { bg: '#ef4444', text: 'white' },
    warning: { bg: '#f59e0b', text: 'white' },
    info: { bg: '#3b82f6', text: 'white' }
  };
  
  const color = colors[type] || colors.info;
  
  notification.style.cssText = `
    margin-top: 8px;
    padding: 8px 12px;
    background: ${color.bg};
    color: ${color.text};
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    animation: slideIn 0.3s ease;
  `;
  
  evidenceCell.querySelector('.space-y-2')?.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Display result overlay
function displayResultOverlay(result, data) {
  // Remove existing overlay
  const existing = document.getElementById('cb-result-overlay');
  if (existing) existing.remove();
  
  const resultData = result.data || result;
  const {
    verdict = 'Unknown',
    score = 0,
    final_score = 0,
    explanation = '',
    recommendation = '',
    guidance = '',
    matched_keywords = [],
  } = resultData;
  
  const displayScore = Math.round(final_score || score);
  
  const overlay = document.createElement('div');
  overlay.id = 'cb-result-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.3s ease;
  `;
  
  overlay.innerHTML = `
    <div style="
      background: white;
      border-radius: 12px;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.3s ease;
    ">
      <!-- Header -->
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 24px;
        border-radius: 12px 12px 0 0;
      ">
        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 4px;">${data.controlId}</div>
        <div style="font-size: 18px; font-weight: 700;">${data.controlName}</div>
      </div>
      
      <!-- Content -->
      <div style="padding: 24px;">
        <!-- Score & Verdict -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f3f4f6;
          border-radius: 8px;
          margin-bottom: 20px;
        ">
          <div>
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Verdict</div>
            <div style="font-size: 18px; font-weight: 700; text-transform: capitalize;">${verdict}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Score</div>
            <div style="font-size: 32px; font-weight: 700; color: #667eea;">${displayScore}%</div>
          </div>
        </div>
        
        ${explanation ? `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Analysis</div>
          <div style="font-size: 13px; color: #4b5563; line-height: 1.6;">${explanation}</div>
        </div>
        ` : ''}
        
        ${recommendation ? `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Recommendation</div>
          <div style="font-size: 13px; color: #4b5563; line-height: 1.6;">${recommendation}</div>
        </div>
        ` : ''}
        
        ${guidance ? `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Implementation Guidance</div>
          <div style="font-size: 13px; color: #4b5563; line-height: 1.6;">${guidance}</div>
        </div>
        ` : ''}
        
        ${matched_keywords && matched_keywords.length > 0 ? `
        <div>
          <div style="font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Matched Keywords</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${matched_keywords.map(kw => `
              <span style="
                padding: 4px 12px;
                background: #e5e7eb;
                color: #374151;
                border-radius: 12px;
                font-size: 12px;
              ">${kw}</span>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>
      
      <!-- Footer -->
      <div style="
        background: #f9fafb;
        padding: 16px 24px;
        border-radius: 0 0 12px 12px;
        display: flex;
        gap: 12px;
      ">
        <button id="cb-overlay-dashboard" style="
          flex: 1;
          padding: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        ">View Dashboard</button>
        <button id="cb-overlay-close" style="
          flex: 1;
          padding: 10px;
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        ">Close</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Event listeners
  document.getElementById('cb-overlay-close').addEventListener('click', () => {
    overlay.remove();
  });
  
  document.getElementById('cb-overlay-dashboard').addEventListener('click', () => {
    window.location.href = '/dashboard';
  });
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

// Save validation result to localStorage
function saveValidationResult(checklistId, result, data) {
  const stored = JSON.parse(localStorage.getItem('validationResults') || '{}');
  stored[checklistId] = {
    ...result,
    checklistId,
    timestamp: new Date().toISOString(),
    control: {
      id: data.controlId,
      title: data.controlName,
      control_text: data.controlText
    },
    source: 'extension'
  };
  localStorage.setItem('validationResults', JSON.stringify(stored));
  console.log('Saved to localStorage for dashboard');
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slideIn {
    from { transform: translateX(-10px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(-10px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(injectExtensionButtons, 500);
  });
} else {
  setTimeout(injectExtensionButtons, 500);
}

// Re-inject on dynamic content changes
const observer = new MutationObserver(() => {
  injectExtensionButtons();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
