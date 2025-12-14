// Chrome Extension Content Script - DOM Scanner
// Scans webpages for compliance questions and provides AI recommendations via overlay

const API_BASE_URL = 'https://gently-metal-maria-publicly.trycloudflare.com/api';

// Question patterns to detect compliance questions
const QUESTION_PATTERNS = [
  /\b(describe|explain|provide|list|identify|document)\b.*\b(process|procedure|policy|control|measure|approach)\b/i,
  /\bhow (does|do|did|will)\b.*\b(your organization|your company|you)\b/i,
  /\bwhat (are|is)\b.*\b(implemented|established|documented|maintained)\b/i,
  /\bdo you (have|maintain|document|implement)\b/i,
  /\bdoes your organization (have|maintain|use|implement)\b/i,
];

// Cache for recommendations to avoid duplicate API calls
const recommendationCache = new Map();

// Track scanned elements to avoid re-processing
const scannedElements = new WeakSet();

/**
 * Scan the page for compliance questions
 */
function scanPage() {
  console.log('[ComplianceScanner] Starting page scan...');
  
  // Find all text nodes that might contain questions
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        // Skip script and style tags
        if (node.parentElement?.tagName === 'SCRIPT' || 
            node.parentElement?.tagName === 'STYLE') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const questions = [];
  let node;

  while (node = walker.nextNode()) {
    const text = node.textContent.trim();
    
    // Check if text matches question patterns
    if (text.length > 20 && text.includes('?')) {
      for (const pattern of QUESTION_PATTERNS) {
        if (pattern.test(text)) {
          const element = node.parentElement;
          
          if (!scannedElements.has(element)) {
            scannedElements.add(element);
            questions.push({
              text: text,
              element: element
            });
            break;
          }
        }
      }
    }
  }

  console.log(`[ComplianceScanner] Found ${questions.length} potential questions`);
  
  // Process each question
  questions.forEach(question => {
    processQuestion(question);
  });
}

/**
 * Process a detected question and fetch recommendations
 */
async function processQuestion({ text, element }) {
  // Check cache first
  if (recommendationCache.has(text)) {
    const cached = recommendationCache.get(text);
    attachOverlay(element, text, cached);
    return;
  }

  try {
    const recommendation = await fetchRecommendation(text);
    
    if (recommendation) {
      recommendationCache.set(text, recommendation);
      attachOverlay(element, text, recommendation);
    }
  } catch (error) {
    console.error('[ComplianceScanner] Failed to fetch recommendation:', error);
  }
}

/**
 * Fetch AI recommendation from backend
 */
async function fetchRecommendation(questionText) {
  const response = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question_text: questionText
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}

/**
 * Attach overlay indicator to question element
 */
function attachOverlay(element, questionText, recommendation) {
  // Create indicator dot
  const indicator = document.createElement('div');
  indicator.className = 'compliance-indicator';
  
  // Set color based on confidence
  const confidence = recommendation.confidence || 0;
  let color = '#ef4444'; // red
  if (confidence >= 0.8) color = '#22c55e'; // green
  else if (confidence >= 0.6) color = '#eab308'; // yellow
  
  indicator.style.cssText = `
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${color};
    box-shadow: 0 0 8px ${color}80;
    cursor: pointer;
    z-index: 9999;
    margin-left: -20px;
    margin-top: 4px;
    transition: transform 0.2s;
  `;
  
  indicator.onmouseenter = () => {
    indicator.style.transform = 'scale(1.3)';
  };
  
  indicator.onmouseleave = () => {
    indicator.style.transform = 'scale(1)';
  };
  
  // Create tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'compliance-tooltip';
  tooltip.style.cssText = `
    position: absolute;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border: 1px solid #475569;
    border-radius: 8px;
    padding: 16px;
    min-width: 320px;
    max-width: 500px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    z-index: 10000;
    display: none;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  `;
  
  tooltip.innerHTML = `
    <div style="margin-bottom: 12px;">
      <div style="font-weight: 600; color: #f1f5f9; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${color};"></span>
        AI Recommendation
        <span style="margin-left: auto; font-size: 12px; color: #94a3b8;">${Math.round(confidence * 100)}% confident</span>
      </div>
      <div style="color: #cbd5e1; font-size: 13px; margin-bottom: 8px;">
        ${recommendation.recommended_answer || 'No specific recommendation available'}
      </div>
    </div>
    ${recommendation.clause_references ? `
      <div style="padding-top: 12px; border-top: 1px solid #475569;">
        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 6px;">Referenced Clauses:</div>
        <div style="color: #e2e8f0; font-size: 12px;">
          ${recommendation.clause_references.join(', ')}
        </div>
      </div>
    ` : ''}
  `;
  
  // Position tooltip relative to indicator
  indicator.addEventListener('mouseenter', () => {
    const rect = indicator.getBoundingClientRect();
    tooltip.style.left = `${rect.right + 10}px`;
    tooltip.style.top = `${rect.top - 10}px`;
    tooltip.style.display = 'block';
  });
  
  indicator.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
  
  // Make element position relative if needed
  const computedStyle = window.getComputedStyle(element);
  if (computedStyle.position === 'static') {
    element.style.position = 'relative';
  }
  
  // Attach to DOM
  element.style.position = 'relative';
  element.insertBefore(indicator, element.firstChild);
  document.body.appendChild(tooltip);
  
  console.log('[ComplianceScanner] Attached overlay for question');
}

/**
 * Initialize scanner
 */
function init() {
  console.log('[ComplianceScanner] Initializing...');
  
  // Initial scan
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanPage);
  } else {
    scanPage();
  }
  
  // Re-scan on dynamic content changes
  const observer = new MutationObserver((mutations) => {
    const hasNewContent = mutations.some(mutation => 
      mutation.addedNodes.length > 0 || 
      mutation.type === 'characterData'
    );
    
    if (hasNewContent) {
      setTimeout(scanPage, 500); // Debounce
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
  
  console.log('[ComplianceScanner] Initialized successfully');
}

// Start scanner
init();
