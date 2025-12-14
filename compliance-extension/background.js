// Background service worker for Compliance Buddy Extension

chrome.runtime.onInstalled.addListener((details) => {
  console.log('Compliance Buddy Extension installed:', details.reason);
  
  if (details.reason === 'install') {
    console.log('Welcome to Compliance Buddy Extension!');
  } else if (details.reason === 'update') {
    console.log('Compliance Buddy Extension updated to version:', chrome.runtime.getManifest().version);
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.url);
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.action === 'log') {
    console.log('Extension log:', request.message);
  }
  
  sendResponse({ success: true });
});
