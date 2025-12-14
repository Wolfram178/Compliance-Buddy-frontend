// Content Script - Injected into every webpage
// Handles page scraping and overlay injection

let overlayInjected = false;

// Listen for messages from the popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleOverlay') {
    if (overlayInjected) {
      removeOverlay();
    } else {
      injectOverlay();
    }
    sendResponse({ success: true });
    return true;
  }

  if (request.action === 'scrapeText') {
    const scrapedText = scrapePageText();
    sendResponse({ success: true, text: scrapedText });
    return true;
  }
});

// Inject the overlay panel into the page
function injectOverlay() {
  if (document.getElementById('compliancebuddy-overlay-root')) {
    console.log('Overlay already exists, making it visible');
    const existing = document.getElementById('compliancebuddy-overlay-root');
    existing.style.display = 'block';
    overlayInjected = true;
    return;
  }

  console.log('Injecting ComplianceBuddy overlay...');

  // Create overlay root container
  const overlayRoot = document.createElement('div');
  overlayRoot.id = 'compliancebuddy-overlay-root';
  document.body.appendChild(overlayRoot);

  // Inject Tailwind CSS
  if (!document.querySelector('link[href*="tailwindcss"]')) {
    const tailwindLink = document.createElement('link');
    tailwindLink.rel = 'stylesheet';
    tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    document.head.appendChild(tailwindLink);
  }

  // Load React and ReactDOM from CDN if not already loaded
  if (!window.React) {
    const reactScript = document.createElement('script');
    reactScript.crossOrigin = 'anonymous';
    reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    document.head.appendChild(reactScript);

    const reactDOMScript = document.createElement('script');
    reactDOMScript.crossOrigin = 'anonymous';
    reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
    document.head.appendChild(reactDOMScript);

    // Wait for React to load, then inject overlay app
    reactDOMScript.onload = () => {
      setTimeout(injectOverlayApp, 100);
    };
  } else {
    // React already loaded, inject immediately
    injectOverlayApp();
  }

  overlayInjected = true;
  console.log('ComplianceBuddy overlay injected successfully!');
}

// Inject the React overlay app
function injectOverlayApp() {
  const script = document.createElement('script');
  script.textContent = `
    ${getOverlayAppCode()}
  `;
  document.body.appendChild(script);
}

// Remove overlay
function removeOverlay() {
  const overlayRoot = document.getElementById('compliancebuddy-overlay-root');
  if (overlayRoot) {
    overlayRoot.remove();
  }
  overlayInjected = false;
}

// Scrape text from the page
function scrapePageText() {
  // Mode 1: Check if user has selected text
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText) {
    return selectedText;
  }

  // Mode 2: Scrape entire page
  return cleanPageText(document.body.innerText);
}

// Clean scraped text
function cleanPageText(text) {
  return text
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .trim();
}

// Get the overlay app code
function getOverlayAppCode() {
  return `
    (function() {
      const { useState, useEffect, useRef } = React;

      // Main Overlay Component
      function ComplianceBuddyOverlay() {
        const [isOpen, setIsOpen] = useState(true);
        const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 600 });
        const [isDragging, setIsDragging] = useState(false);
        const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
        const [activeTab, setActiveTab] = useState('validate'); // validate, chat
        const [isLoading, setIsLoading] = useState(false);
        const [validationResult, setValidationResult] = useState(null);
        const [chatMessages, setChatMessages] = useState([
          { role: 'assistant', content: 'Hi! I can help explain compliance issues and provide recommendations.' }
        ]);
        const [chatInput, setChatInput] = useState('');
        const overlayRef = useRef(null);

        // Handle dragging
        const handleMouseDown = (e) => {
          if (e.target.closest('.drag-handle')) {
            setIsDragging(true);
            setDragOffset({
              x: e.clientX - position.x,
              y: e.clientY - position.y
            });
          }
        };

        const handleMouseMove = (e) => {
          if (isDragging) {
            setPosition({
              x: e.clientX - dragOffset.x,
              y: e.clientY - dragOffset.y
            });
          }
        };

        const handleMouseUp = () => {
          setIsDragging(false);
        };

        useEffect(() => {
          if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }
          return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
        }, [isDragging]);

        // Scrape page text
        const scrapeText = () => {
          const selection = window.getSelection().toString().trim();
          if (selection) return selection;
          
          return document.body.innerText.replace(/\\s+/g, ' ').trim().substring(0, 10000);
        };

        // Validate page content
        const handleValidate = async () => {
          setIsLoading(true);
          const text = scrapeText();

          try {
            const formData = new FormData();
            formData.append('text', text);

            const response = await fetch('https://gently-metal-maria-publicly.trycloudflare.com/api/validate', {
              method: 'POST',
              body: formData
            });

            if (!response.ok) throw new Error('Validation failed');

            const result = await response.json();
            setValidationResult(result);
          } catch (error) {
            setValidationResult({ error: error.message });
          } finally {
            setIsLoading(false);
          }
        };

        // Send chat message
        const handleChat = async () => {
          if (!chatInput.trim()) return;

          const userMessage = { role: 'user', content: chatInput };
          setChatMessages(prev => [...prev, userMessage]);
          setChatInput('');
          setIsLoading(true);

          try {
            const response = await fetch('https://gently-metal-maria-publicly.trycloudflare.com/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: chatInput,
                context: validationResult
              })
            });

            if (!response.ok) throw new Error('Chat failed');

            const data = await response.json();
            const aiMessage = { role: 'assistant', content: data.reply };
            setChatMessages(prev => [...prev, aiMessage]);
          } catch (error) {
            const errorMessage = { role: 'assistant', content: 'Error: ' + error.message };
            setChatMessages(prev => [...prev, errorMessage]);
          } finally {
            setIsLoading(false);
          }
        };

        if (!isOpen) return null;

        return React.createElement('div', {
          ref: overlayRef,
          onMouseDown: handleMouseDown,
          style: {
            position: 'fixed',
            left: position.x + 'px',
            top: position.y + 'px',
            width: '400px',
            maxHeight: '580px',
            zIndex: 2147483647,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }
        },
          React.createElement('div', {
            style: {
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden'
            }
          },
            // Header
            React.createElement('div', {
              className: 'drag-handle',
              style: {
                background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                padding: '16px',
                cursor: 'move',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }
            },
              React.createElement('div', {
                style: { display: 'flex', alignItems: 'center', gap: '8px' }
              },
                React.createElement('div', {
                  style: {
                    width: '32px',
                    height: '32px',
                    background: 'white',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }
                }, '🛡️'),
                React.createElement('div', null,
                  React.createElement('div', {
                    style: { color: 'white', fontWeight: 'bold', fontSize: '14px' }
                  }, 'ComplianceBuddy'),
                  React.createElement('div', {
                    style: { color: 'rgba(255,255,255,0.7)', fontSize: '11px' }
                  }, 'AI Compliance Assistant')
                )
              ),
              React.createElement('button', {
                onClick: () => setIsOpen(false),
                style: {
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }, '×')
            ),

            // Tabs
            React.createElement('div', {
              style: {
                display: 'flex',
                gap: '8px',
                padding: '12px 16px',
                background: 'rgba(0,0,0,0.2)'
              }
            },
              React.createElement('button', {
                onClick: () => setActiveTab('validate'),
                style: {
                  flex: 1,
                  padding: '8px',
                  background: activeTab === 'validate' ? 'rgba(59,130,246,0.3)' : 'transparent',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }
              }, '✓ Validate'),
              React.createElement('button', {
                onClick: () => setActiveTab('chat'),
                style: {
                  flex: 1,
                  padding: '8px',
                  background: activeTab === 'chat' ? 'rgba(139,92,246,0.3)' : 'transparent',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }
              }, '💬 Chat')
            ),

            // Content
            React.createElement('div', {
              style: {
                padding: '16px',
                maxHeight: '400px',
                overflowY: 'auto',
                color: 'white'
              }
            },
              activeTab === 'validate' ? 
                React.createElement('div', null,
                  React.createElement('button', {
                    onClick: handleValidate,
                    disabled: isLoading,
                    style: {
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      marginBottom: '16px'
                    }
                  }, isLoading ? '⏳ Validating...' : '🔍 Validate Page'),

                  validationResult && !validationResult.error &&
                    React.createElement('div', {
                      style: {
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '13px'
                      }
                    },
                      React.createElement('div', {
                        style: {
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '12px'
                        }
                      },
                        React.createElement('div', null,
                          React.createElement('div', { style: { opacity: 0.7, marginBottom: '4px' } }, 'Verdict'),
                          React.createElement('div', { style: { fontWeight: 'bold', fontSize: '16px' } }, 
                            validationResult.verdict || 'N/A')
                        ),
                        React.createElement('div', { style: { textAlign: 'right' } },
                          React.createElement('div', { style: { opacity: 0.7, marginBottom: '4px' } }, 'Score'),
                          React.createElement('div', { 
                            style: { 
                              fontWeight: 'bold', 
                              fontSize: '20px',
                              color: validationResult.score >= 80 ? '#10b981' : validationResult.score >= 60 ? '#fbbf24' : '#ef4444'
                            } 
                          }, validationResult.score ? validationResult.score + '%' : 'N/A')
                        )
                      ),
                      validationResult.explanation &&
                        React.createElement('div', {
                          style: {
                            marginTop: '12px',
                            padding: '12px',
                            background: 'rgba(139,92,246,0.1)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            lineHeight: '1.6'
                          }
                        }, validationResult.explanation)
                    ),

                  validationResult?.error &&
                    React.createElement('div', {
                      style: {
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: '#fca5a5',
                        fontSize: '13px'
                      }
                    }, '❌ Error: ' + validationResult.error)
                )
              :
                React.createElement('div', null,
                  React.createElement('div', {
                    style: {
                      maxHeight: '300px',
                      overflowY: 'auto',
                      marginBottom: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }
                  },
                    chatMessages.map((msg, idx) =>
                      React.createElement('div', {
                        key: idx,
                        style: {
                          padding: '10px 12px',
                          background: msg.role === 'user' ? 'rgba(59,130,246,0.2)' : 'rgba(139,92,246,0.1)',
                          borderRadius: '10px',
                          fontSize: '13px',
                          lineHeight: '1.5',
                          alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                          maxWidth: '85%'
                        }
                      }, msg.content)
                    )
                  ),

                  React.createElement('div', {
                    style: { display: 'flex', gap: '8px' }
                  },
                    React.createElement('input', {
                      type: 'text',
                      value: chatInput,
                      onChange: (e) => setChatInput(e.target.value),
                      onKeyPress: (e) => e.key === 'Enter' && handleChat(),
                      placeholder: 'Ask about compliance...',
                      style: {
                        flex: 1,
                        padding: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none'
                      }
                    }),
                    React.createElement('button', {
                      onClick: handleChat,
                      disabled: isLoading || !chatInput.trim(),
                      style: {
                        padding: '10px 16px',
                        background: 'linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isLoading || !chatInput.trim() ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13px'
                      }
                    }, '→')
                  )
                )
            )
          )
        );
      }

      // Render the overlay
      const root = ReactDOM.createRoot(document.getElementById('compliancebuddy-overlay-root'));
      root.render(React.createElement(ComplianceBuddyOverlay));
    })();
  `;
}

// Auto-inject on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('ComplianceBuddy ready. Click extension icon to activate.');
  });
} else {
  console.log('ComplianceBuddy ready. Click extension icon to activate.');
}

// Add a test function to verify the extension is loaded
console.log('✅ ComplianceBuddy content script loaded successfully!');
