// ComplianceBuddy Inline Suggestion System
// Only runs on audit pages with inline AI hints

console.log('🛡️ ComplianceBuddy extension loaded on:', window.location.href);

// If this is the vendor audit page, disable inline AI insight buttons to avoid duplicate Validate buttons.
// We "comment out" functionality by returning early while leaving the original code intact below for future re-enable.
if (document.getElementById('compliance-table')) {
  console.log('[ComplianceBuddy] Vendor audit table detected – inline AI buttons disabled to keep only one Validate button.');
  // Early return prevents any hint attachment logic from running on this page.
  return;
}

const API_BASE = 'https://gently-metal-maria-publicly.trycloudflare.com';

// Smart detection: Look for compliance-related content
const isCompliancePage = () => {
  const bodyText = document.body.innerText.toLowerCase();
  const keywords = ['compliance', 'audit', 'security', 'policy', 'iso', 'control', 'checklist', 'evidence', 'validation'];
  return keywords.some(keyword => bodyText.includes(keyword));
};

// Style for inline AI hints
const inlineStyles = `
<style id="cb-inline-styles">
  .cb-inline-hint {
    background: #f5f8ff;
    border-left: 4px solid #6a5acd;
    padding: 12px;
    margin-top: 8px;
    border-radius: 6px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    display: none;
  }

  .cb-inline-hint.visible {
    display: block;
  }

  .cb-ai-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .cb-ai-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }

  .cb-ai-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .cb-suggestion-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-top: 12px;
  }

  .cb-suggestion-header {
    font-weight: 700;
    font-size: 14px;
    color: #6a5acd;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cb-suggestion-body {
    font-size: 13px;
    line-height: 1.6;
    color: #374151;
  }

  .cb-suggestion-score {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 12px;
    margin-top: 8px;
  }

  .cb-score-high {
    background: #d1fae5;
    color: #065f46;
  }

  .cb-score-medium {
    background: #fef3c7;
    color: #92400e;
  }

  .cb-score-low {
    background: #fee2e2;
    color: #991b1b;
  }

  .cb-recommendation {
    margin-top: 12px;
    padding: 12px;
    background: #eff6ff;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.5;
  }

  .cb-recommendation-title {
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 4px;
  }
</style>
`;

// Inject styles
if (!document.getElementById('cb-inline-styles')) {
  document.head.insertAdjacentHTML('beforeend', inlineStyles);
}

// Attach AI suggestion buttons to relevant elements
function attachComplianceBuddyHints() {
  // Universal selector: tables, forms, status indicators, evidence fields
  const elements = document.querySelectorAll(
    'table tr, .checklist-item, .control-row, [data-control-id], ' +
    'input[type="file"], textarea, ' +
    '.status, .verdict, .score, .evidence, ' +
    '[class*="status"], [class*="compliance"], [class*="audit"], [class*="control"]'
  );
  
  elements.forEach((element, index) => {
    // Skip if already has suggestion or is header
    if (element.querySelector('.cb-ai-btn') || element.querySelector('th')) return;
    
    // Determine element type and where to attach
    const attachPoint = findAttachmentPoint(element);
    if (!attachPoint) return;
    
    // Check if element has meaningful content
    const textContent = element.textContent.trim();
    const hasFile = element.tagName === 'INPUT' && element.type === 'file';
    if (textContent.length < 10 && !hasFile) return;
    
    // Create AI suggestion button
    const aiButton = createAIButton();
    const hintContainer = createHintContainer(index);
    
    // Detect what type of data this element contains
    const elementType = detectElementType(element);
    
    aiButton.onclick = () => handleAISuggestion(element, hintContainer, index, elementType);
    
    // Append to attachment point
    attachPoint.appendChild(aiButton);
    attachPoint.appendChild(hintContainer);
  });
}

// Find where to attach the button
function findAttachmentPoint(element) {
  if (element.tagName === 'TR') {
    return element.querySelector('td:last-child');
  } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    return element.parentElement;
  } else {
    return element;
  }
}

// Create AI button
function createAIButton() {
  const btn = document.createElement('button');
  btn.className = 'cb-ai-btn';
  btn.textContent = '✨ AI Insight';
  btn.style.marginTop = '8px';
  return btn;
}

// Create hint container
function createHintContainer(index) {
  const container = document.createElement('div');
  container.className = 'cb-inline-hint';
  container.setAttribute('data-cb-index', index);
  return container;
}

// Detect what type of element this is
function detectElementType(element) {
  const text = element.textContent.toLowerCase();
  const classes = element.className.toLowerCase();
  
  if (classes.includes('status') || classes.includes('verdict')) return 'status';
  if (classes.includes('score')) return 'score';
  if (classes.includes('evidence') || element.tagName === 'INPUT') return 'evidence';
  if (classes.includes('recommendation')) return 'recommendation';
  if (classes.includes('emission') || text.includes('co2')) return 'emissions';
  
  return 'general';
}

// Handle AI suggestion click - now with element type awareness
async function handleAISuggestion(element, hintContainer, index, elementType) {
  const button = hintContainer.parentElement.querySelector('.cb-ai-btn');
  button.disabled = true;
  button.textContent = '⏳ Analyzing...';
  
  try {
    // Extract content from element
    const elementText = element.innerText || element.textContent || '';
    const elementId = element.getAttribute('data-control-id') || 
                      element.getAttribute('id') || 
                      `ELEMENT_${index}`;
    
    // Check for file upload
    let fileData = null;
    if (element.tagName === 'INPUT' && element.type === 'file' && element.files.length > 0) {
      fileData = element.files[0];
    }
    
    // Call validation API
    const formData = new FormData();
    formData.append('checklist_id', elementId);
    formData.append('control_text', document.title || 'Web page content analysis');
    
    if (fileData) {
      formData.append('evidence_file', fileData);
    } else {
      formData.append('evidence_text', elementText);
    }
    
    const response = await fetch(`${API_BASE}/api/validate`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const apiResponse = await response.json();
    // Backend returns {status, message, data}, extract data
    const result = apiResponse.data || apiResponse;
    
    // Display appropriate overlay based on element type and API response
    displayDynamicSuggestion(hintContainer, result, elementType);
    
    button.textContent = '✓ View Insight';
    button.disabled = false;
    
  } catch (error) {
    console.error('AI suggestion error:', error);
    hintContainer.innerHTML = `
      <div class="cb-suggestion-card">
        <div class="cb-suggestion-header">❌ Error</div>
        <div class="cb-suggestion-body">
          Failed to fetch AI insight. Please try again.
        </div>
      </div>
    `;
    hintContainer.classList.add('visible');
    
    button.textContent = '✨ AI Insight';
    button.disabled = false;
  }
}

// Display dynamic suggestion based on element type and API response
function displayDynamicSuggestion(container, result, elementType) {
  const score = result.final_score || result.score || 0;
  const verdict = result.verdict || 'Unknown';
  const explanation = result.explanation || 'No explanation provided';
  const recommendation = result.recommendation || result.guidance || '';
  const emissions = result.emissions || null;
  const ruleCoverage = result.rule_coverage || null;
  const matchedKeywords = result.matched_keywords || [];
  
  // Determine score class
  let scoreClass = 'cb-score-low';
  if (score >= 80) scoreClass = 'cb-score-high';
  else if (score >= 60) scoreClass = 'cb-score-medium';
  
  // Build overlay HTML based on element type
  let overlayHTML = '';
  
  switch(elementType) {
    case 'status':
    case 'verdict':
      // Show verdict with recommendation
      overlayHTML = `
        <div class="cb-suggestion-card">
          <div class="cb-suggestion-header">
            📊 Status Analysis
            <span class="cb-suggestion-score ${scoreClass}">${verdict} — ${score}%</span>
          </div>
          ${recommendation ? `
            <div class="cb-recommendation">
              <div class="cb-recommendation-title">💡 Recommendation</div>
              <div>${recommendation}</div>
            </div>
          ` : ''}
          ${matchedKeywords.length > 0 ? `
            <div class="cb-recommendation" style="background: #eff6ff; margin-top: 8px;">
              <div class="cb-recommendation-title" style="color: #1e40af;">🔍 Keywords Found</div>
              <div style="color: #1e40af;">${matchedKeywords.join(', ')}</div>
            </div>
          ` : ''}
        </div>
      `;
      break;
      
    case 'score':
      // Show detailed score breakdown
      overlayHTML = `
        <div class="cb-suggestion-card">
          <div class="cb-suggestion-header">
            📈 Score Details
            <span class="cb-suggestion-score ${scoreClass}">${score}%</span>
          </div>
          <div class="cb-suggestion-body">
            <strong>Model Score:</strong> ${result.score}%<br>
            <strong>Rule Coverage:</strong> ${ruleCoverage}%<br>
            <strong>Final Score:</strong> ${score}%
          </div>
          <div class="cb-suggestion-body" style="margin-top: 12px;">
            ${explanation}
          </div>
        </div>
      `;
      break;
      
    case 'evidence':
      // Show evidence validation result
      overlayHTML = `
        <div class="cb-suggestion-card">
          <div class="cb-suggestion-header">
            📄 Evidence Validation
            <span class="cb-suggestion-score ${scoreClass}">Score: ${score}%</span>
          </div>
          <div class="cb-suggestion-body">
            ${explanation}
          </div>
          ${recommendation ? `
            <div class="cb-recommendation">
              <div class="cb-recommendation-title">💡 Improvement Tip</div>
              <div>${recommendation}</div>
            </div>
          ` : ''}
        </div>
      `;
      break;
      
    case 'emissions':
      // Show emissions data
      overlayHTML = `
        <div class="cb-suggestion-card">
          <div class="cb-suggestion-header" style="color: #166534;">
            🌱 Carbon Footprint Analysis
          </div>
          <div class="cb-recommendation" style="background: #f0fdf4;">
            <div style="color: #166534; font-size: 24px; font-weight: bold; margin-bottom: 8px;">
              ${emissions || '0.00001'} kg CO₂
            </div>
            <div style="color: #166534; font-size: 13px;">
              This validation consumed minimal energy with sustainable AI practices.
            </div>
          </div>
        </div>
      `;
      break;
      
    case 'recommendation':
      // Show only recommendation
      overlayHTML = `
        <div class="cb-suggestion-card">
          <div class="cb-suggestion-header">
            💡 AI Recommendation
          </div>
          <div class="cb-recommendation">
            <div>${recommendation || explanation}</div>
          </div>
        </div>
      `;
      break;
      
    default:
      // General comprehensive view
      overlayHTML = `
        <div class="cb-suggestion-card">
          <div class="cb-suggestion-header">
            🤖 AI Analysis
            <span class="cb-suggestion-score ${scoreClass}">Score: ${score}% — ${verdict}</span>
          </div>
          <div class="cb-suggestion-body">
            ${explanation}
          </div>
          ${recommendation ? `
            <div class="cb-recommendation">
              <div class="cb-recommendation-title">💡 Recommendation</div>
              <div>${recommendation}</div>
            </div>
          ` : ''}
          ${emissions ? `
            <div class="cb-recommendation" style="background: #f0fdf4; margin-top: 8px;">
              <div class="cb-recommendation-title" style="color: #166534;">🌱 Carbon Footprint</div>
              <div style="color: #166534;">This validation used <strong>${emissions} kg CO₂</strong></div>
            </div>
          ` : ''}
        </div>
      `;
  }
  
  container.innerHTML = overlayHTML;
  container.classList.add('visible');
}

// MutationObserver to detect new elements dynamically
const observer = new MutationObserver(() => {
  if (isCompliancePage()) {
    attachComplianceBuddyHints();
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial attachment with delay for page load
setTimeout(() => {
  if (isCompliancePage()) {
    console.log('✅ ComplianceBuddy: Compliance-related content detected');
    attachComplianceBuddyHints();
  } else {
    console.log('ℹ️ ComplianceBuddy: Waiting for compliance content...');
  }
}, 2000);

console.log('✅ ComplianceBuddy inline AI system ready on all pages');
