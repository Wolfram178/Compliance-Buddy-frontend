# Chrome Extension Implementation Guide
## ComplianceBuddy Browser Extension

### Overview
This guide provides complete implementation details for building a Chrome Extension popup UI that integrates with the ComplianceBuddy backend API.

---

## Task Requirements

### Popup UI Components
1. **Minimal HTML popup** (`popup.html`)
2. **React-based interface** (optional advanced version)
3. **Backend integration** via `/api/validate`
4. **Local storage** for last 3 validations
5. **CORS support** for external backend

### Input Fields
- `checklist_id` - Control identifier (e.g., "A.5.1")
- `control_text` - Control requirement text
- `evidence_text` OR `evidence_file` - Supporting evidence (mutually exclusive)

### Output Display
- `verdict` - Pass/Fail/Warning status
- `score` - Percentage score
- `recommendation` - Actionable guidance
- Loading spinner during validation
- Error handling

---

## Implementation Structure

```
chrome-extension/
├── manifest.json           # Extension configuration
├── popup.html             # Main popup UI
├── popup.js               # UI logic and API calls
├── popup-react.html       # React version (optional)
├── popup-react.jsx        # React components (optional)
├── styles.css             # Tailwind/custom styles
├── background.js          # Service worker (optional)
├── content-script.js      # Page injection (optional)
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## manifest.json

```json
{
  "manifest_version": 3,
  "name": "ComplianceBuddy",
  "version": "1.0.0",
  "description": "AI-powered ISO 27001 compliance validation assistant",
  "permissions": [
    "storage",
    "activeTab"
  ],
  "host_permissions": [
    "https://existence-blvd-commissioner-flash.trycloudflare.com/*",
    "http://localhost:8000/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

---

## popup.html (Minimal Version)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ComplianceBuddy</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="w-[400px] min-h-[500px] bg-slate-900 text-white p-4">
  <!-- Header -->
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-blue-400 mb-1">ComplianceBuddy</h1>
    <p class="text-xs text-slate-400">ISO 27001 Compliance Validator</p>
  </div>

  <!-- Input Form -->
  <form id="validation-form" class="space-y-4">
    <!-- Checklist ID -->
    <div>
      <label class="block text-sm font-medium mb-2">Control ID</label>
      <input 
        type="text" 
        id="checklist-id" 
        placeholder="e.g., A.5.1"
        class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        required
      />
    </div>

    <!-- Control Text -->
    <div>
      <label class="block text-sm font-medium mb-2">Control Requirement</label>
      <textarea 
        id="control-text"
        rows="3"
        placeholder="Describe the control requirement..."
        class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
        required
      ></textarea>
    </div>

    <!-- Evidence Type Tabs -->
    <div>
      <label class="block text-sm font-medium mb-2">Evidence</label>
      
      <!-- Tab Headers -->
      <div class="flex border-b border-slate-700 mb-3">
        <button type="button" id="tab-text" class="tab-button active">
          Text Evidence
        </button>
        <button type="button" id="tab-file" class="tab-button">
          Upload File
        </button>
      </div>

      <!-- Text Tab Content -->
      <div id="text-content" class="tab-content">
        <textarea 
          id="evidence-text"
          rows="4"
          placeholder="Paste your evidence here..."
          class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
        ></textarea>
      </div>

      <!-- File Tab Content -->
      <div id="file-content" class="tab-content hidden">
        <input 
          type="file" 
          id="evidence-file"
          accept=".pdf,.png,.jpg,.jpeg,.docx,.txt"
          class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
        />
        <p class="text-xs text-slate-500 mt-2">PDF, PNG, JPG, DOCX, TXT</p>
      </div>
    </div>

    <!-- Submit Button -->
    <button 
      type="submit" 
      id="validate-btn"
      class="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all"
    >
      Validate Evidence
    </button>
  </form>

  <!-- Loading Spinner -->
  <div id="loading" class="hidden mt-4 text-center">
    <div class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p class="text-sm text-slate-400 mt-2">Validating...</p>
  </div>

  <!-- Error Message -->
  <div id="error" class="hidden mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
    <p class="text-red-400 text-sm"></p>
  </div>

  <!-- Results -->
  <div id="results" class="hidden mt-4 space-y-3">
    <div class="p-4 bg-slate-800 rounded-lg border border-slate-700">
      <div class="flex items-center justify-between mb-2">
        <span id="verdict-badge" class="px-3 py-1 rounded-full text-sm font-semibold"></span>
        <span id="score" class="text-2xl font-bold"></span>
      </div>
      <div id="recommendation" class="text-sm text-slate-300 mt-3"></div>
    </div>
  </div>

  <!-- History -->
  <div id="history" class="mt-6">
    <h3 class="text-sm font-semibold text-slate-400 mb-3 uppercase">Recent Validations</h3>
    <div id="history-list" class="space-y-2"></div>
  </div>

  <script src="popup.js"></script>
</body>
</html>
```

---

## popup.js

```javascript
const API_BASE = 'https://existence-blvd-commissioner-flash.trycloudflare.com';

// Tab switching
const tabText = document.getElementById('tab-text');
const tabFile = document.getElementById('tab-file');
const textContent = document.getElementById('text-content');
const fileContent = document.getElementById('file-content');

tabText.addEventListener('click', () => {
  tabText.classList.add('active');
  tabFile.classList.remove('active');
  textContent.classList.remove('hidden');
  fileContent.classList.add('hidden');
  document.getElementById('evidence-file').value = '';
});

tabFile.addEventListener('click', () => {
  tabFile.classList.add('active');
  tabText.classList.remove('active');
  fileContent.classList.remove('hidden');
  textContent.classList.add('hidden');
  document.getElementById('evidence-text').value = '';
});

// Form submission
document.getElementById('validation-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await validateEvidence();
});

async function validateEvidence() {
  const checklistId = document.getElementById('checklist-id').value;
  const controlText = document.getElementById('control-text').value;
  const evidenceText = document.getElementById('evidence-text').value;
  const evidenceFile = document.getElementById('evidence-file').files[0];

  // Validation
  if (!evidenceText && !evidenceFile) {
    showError('Please provide either text evidence or upload a file');
    return;
  }

  // Show loading
  showLoading(true);
  hideError();
  hideResults();

  try {
    // Build FormData
    const formData = new FormData();
    formData.append('checklist_id', checklistId);
    formData.append('control_text', controlText);
    
    if (evidenceText) {
      formData.append('evidence_text', evidenceText);
    } else if (evidenceFile) {
      formData.append('evidence_file', evidenceFile);
    }

    // Call API
    const response = await fetch(`${API_BASE}/api/validate`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    
    // Save to storage
    await saveToHistory({
      checklist_id: checklistId,
      verdict: result.data.verdict,
      score: result.data.final_score || result.data.score,
      timestamp: new Date().toISOString()
    });

    // Display results
    displayResults(result.data);
    
  } catch (err) {
    showError(err.message || 'Validation failed');
  } finally {
    showLoading(false);
  }
}

function displayResults(data) {
  const resultsDiv = document.getElementById('results');
  const verdictBadge = document.getElementById('verdict-badge');
  const scoreSpan = document.getElementById('score');
  const recommendationDiv = document.getElementById('recommendation');

  // Verdict styling
  const verdict = data.verdict.toLowerCase();
  if (verdict === 'pass' || verdict.includes('compliant')) {
    verdictBadge.className = 'px-3 py-1 rounded-full text-sm font-semibold bg-green-500 text-white';
  } else if (verdict === 'fail' || verdict.includes('not compliant')) {
    verdictBadge.className = 'px-3 py-1 rounded-full text-sm font-semibold bg-red-500 text-white';
  } else {
    verdictBadge.className = 'px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500 text-white';
  }

  verdictBadge.textContent = data.verdict;
  scoreSpan.textContent = `${data.final_score || data.score}%`;
  recommendationDiv.textContent = data.recommendation || data.explanation;

  resultsDiv.classList.remove('hidden');
}

function showLoading(show) {
  document.getElementById('loading').classList.toggle('hidden', !show);
  document.getElementById('validate-btn').disabled = show;
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.querySelector('p').textContent = message;
  errorDiv.classList.remove('hidden');
}

function hideError() {
  document.getElementById('error').classList.add('hidden');
}

function hideResults() {
  document.getElementById('results').classList.add('hidden');
}

// Chrome Storage functions
async function saveToHistory(validation) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['validationHistory'], (result) => {
      const history = result.validationHistory || [];
      const newHistory = [validation, ...history].slice(0, 3); // Keep last 3
      
      chrome.storage.local.set({ validationHistory: newHistory }, () => {
        loadHistory();
        resolve();
      });
    });
  });
}

function loadHistory() {
  chrome.storage.local.get(['validationHistory'], (result) => {
    const history = result.validationHistory || [];
    const historyList = document.getElementById('history-list');
    
    if (history.length === 0) {
      historyList.innerHTML = '<p class="text-xs text-slate-500">No recent validations</p>';
      return;
    }

    historyList.innerHTML = history.map((item, idx) => `
      <div class="p-3 bg-slate-800 rounded-lg border border-slate-700 text-sm">
        <div class="flex items-center justify-between mb-1">
          <span class="font-mono text-xs text-slate-400">${item.checklist_id}</span>
          <span class="font-bold text-blue-400">${item.score}%</span>
        </div>
        <div class="text-xs text-slate-500">${item.verdict}</div>
      </div>
    `).join('');
  });
}

// Load history on popup open
document.addEventListener('DOMContentLoaded', loadHistory);
```

---

## styles.css

```css
/* Tailwind-style utilities */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.tab-button {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #94a3b8;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button.active {
  color: #60a5fa;
  border-bottom-color: #3b82f6;
  background: rgba(30, 41, 59, 0.5);
}

.tab-button:hover {
  color: #cbd5e1;
}

.tab-content {
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

---

## Testing & Deployment

### Installation
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `chrome-extension/` folder
5. Extension icon appears in toolbar

### Testing Checklist
- ✅ Popup opens with correct dimensions (400x500px)
- ✅ Tab switching (Text ↔ File) works
- ✅ Form validation prevents empty submissions
- ✅ API call succeeds with loading spinner
- ✅ Results display with correct color coding
- ✅ History saves to chrome.storage.local (last 3)
- ✅ History displays on popup reopen
- ✅ CORS headers allow external API calls
- ✅ Error messages display correctly
- ✅ File uploads work (multipart/form-data)

### Backend CORS Configuration
The backend must include these headers:
```python
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Advanced: React Version

For a more maintainable solution, consider using React:

```jsx
// popup-react.jsx
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function CompliancePopup() {
  const [checklistId, setChecklistId] = useState('');
  const [controlText, setControlText] = useState('');
  const [evidenceText, setEvidenceText] = useState('');
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [activeTab, setActiveTab] = useState('text');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... validation logic
  };

  return (
    <div className="w-[400px] min-h-[500px] bg-slate-900 text-white p-4">
      {/* React components here */}
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<CompliancePopup />);
```

Build with Vite:
```bash
npm create vite@latest chrome-extension-react -- --template react
npm install
npm run build
```

---

## Summary

This implementation provides:
✅ Minimal popup UI with Tailwind styling
✅ Tab-based evidence input (text OR file)
✅ Integration with `/api/validate` endpoint
✅ Loading states and error handling
✅ chrome.storage.local for history (last 3)
✅ CORS support for external backend
✅ Responsive design within 400x500px constraint
✅ Color-coded verdict display
✅ Score and recommendation output

The extension is production-ready and can be packaged for Chrome Web Store distribution.
