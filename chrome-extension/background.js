// Background Service Worker for ComplianceBuddy Extension
// Handles extension lifecycle and API communication

const API_BASE_URL = 'https://gently-metal-maria-publicly.trycloudflare.com';

// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  // Inject the overlay into the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content-script.js']
  });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'validateEvidence') {
    handleValidation(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }

  if (request.action === 'chatWithBot') {
    handleChat(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// Validate evidence via backend API
async function handleValidation({ text, file }) {
  const formData = new FormData();
  formData.append('text', text);
  
  if (file) {
    // Convert base64 to blob if file is provided
    const blob = base64ToBlob(file.data, file.type);
    formData.append('file', blob, file.name);
  }

  const response = await fetch(`${API_BASE_URL}/api/validate`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Validation failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Chat with ComplianceBuddy AI
async function handleChat({ query, context }) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      context
    })
  });

  if (!response.ok) {
    throw new Error(`Chat failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.reply;
}

// Utility: Convert base64 to blob
function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

console.log('ComplianceBuddy Background Service Worker loaded');
