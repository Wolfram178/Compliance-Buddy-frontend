// Popup script for Compliance Buddy Extension
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('validationForm');
  const validateBtn = document.getElementById('validateBtn');
  const statusDiv = document.getElementById('status');
  
  // Load saved form data
  loadFormData();
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const checklist_id = document.getElementById('checklist_id').value.trim();
    const control_text = document.getElementById('control_text').value.trim();
    const evidence_text = document.getElementById('evidence_text').value.trim();
    
    if (!checklist_id || !control_text || !evidence_text) {
      showStatus('Please fill in all fields', 'error');
      return;
    }
    
    // Save form data
    saveFormData({ checklist_id, control_text, evidence_text });
    
    // Start validation
    validateBtn.disabled = true;
    validateBtn.textContent = 'Validating...';
    showStatus('Sending validation request...', 'loading');
    
    try {
      // 1. Call the CloudFlare API
      const validationResult = await callValidationAPI(checklist_id, control_text, evidence_text);
      
      // 2. Show overlay on mockup page (if active)
      await showOverlayOnMockupPage(validationResult);
      
      // 3. Store result in dashboard backend
      await storeValidationResult(validationResult);
      
      showStatus('Validation completed successfully!', 'success');
      
    } catch (error) {
      console.error('Validation error:', error);
      showStatus(`Error: ${error.message}`, 'error');
    } finally {
      validateBtn.disabled = false;
      validateBtn.textContent = 'Validate Control';
    }
  });
  
  async function callValidationAPI(checklist_id, control_text, evidence_text) {
    const formData = new FormData();
    formData.append('checklist_id', checklist_id);
    formData.append('control_text', control_text);
    formData.append('evidence_text', evidence_text);
    
    const response = await fetch('https://gently-metal-maria-publicly.trycloudflare.com/api/validate', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      checklist_id,
      control_text,
      evidence_text,
      ...data.data,
      timestamp: new Date().toISOString()
    };
  }
  
  async function showOverlayOnMockupPage(validationResult) {
    try {
      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if we're on the mockup page
      if (tab.url && tab.url.includes('localhost:5173/mockup')) {
        // Send message to content script to show overlay
        await chrome.tabs.sendMessage(tab.id, {
          action: 'showOverlay',
          data: validationResult
        });
      }
    } catch (error) {
      console.log('Could not show overlay (not on mockup page or content script not loaded):', error.message);
    }
  }
  
  async function storeValidationResult(validationResult) {
    try {
      const response = await fetch('http://localhost:8000/api/validation/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(validationResult)
      });
      
      if (!response.ok) {
        throw new Error(`Dashboard API failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Stored in dashboard:', result);
    } catch (error) {
      console.warn('Could not store in dashboard (backend may not be running):', error.message);
      // Don't throw error - overlay should still work even if dashboard is down
    }
  }
  
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    if (type === 'success') {
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 3000);
    }
  }
  
  function saveFormData(data) {
    chrome.storage.local.set({ formData: data });
  }
  
  function loadFormData() {
    chrome.storage.local.get(['formData'], function(result) {
      if (result.formData) {
        document.getElementById('checklist_id').value = result.formData.checklist_id || '';
        document.getElementById('control_text').value = result.formData.control_text || '';
        document.getElementById('evidence_text').value = result.formData.evidence_text || '';
      }
    });
  }
});
