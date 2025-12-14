// Popup Script - Handles user interactions in the extension popup

document.getElementById('activateBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Check if page allows content scripts
  const restrictedPages = ['chrome://', 'chrome-extension://', 'edge://', 'about:', 'view-source:'];
  const isRestricted = restrictedPages.some(prefix => tab.url.startsWith(prefix));
  
  if (isRestricted) {
    alert('⚠️ Cannot activate on this page.\n\nChrome extensions cannot run on:\n• chrome:// pages\n• Extension pages\n• Browser internal pages\n\nPlease visit a regular website and try again.');
    return;
  }
  
  // Inject content script
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content-script-inline.js']
  }).then(() => {
    alert('✅ ComplianceBuddy activated!\n\nAI suggestion buttons will appear next to checklist items.\n\nClick "✨ AI Suggestion" on any row to get compliance insights.');
    window.close();
  }).catch(error => {
    console.error('Error injecting content script:', error);
    alert('❌ Failed to activate extension.\n\nError: ' + error.message);
  });
});

document.getElementById('settingsBtn').addEventListener('click', () => {
  // TODO: Open settings page
  alert('Settings coming soon! Configure API endpoint and preferences.');
});

// Check connection status on popup load
window.addEventListener('DOMContentLoaded', async () => {
  try {
    // Ping the backend to check if it's online
    const response = await fetch('https://gently-metal-maria-publicly.trycloudflare.com/', {
      method: 'GET',
      mode: 'no-cors' // Avoid CORS issues for status check
    });
    
    console.log('Backend connection check complete');
  } catch (error) {
    console.warn('Backend may be offline:', error);
    document.querySelector('.status-dot').style.background = '#ef4444';
    document.querySelector('.status span').textContent = 'Backend Offline - Check Connection';
  }
});
