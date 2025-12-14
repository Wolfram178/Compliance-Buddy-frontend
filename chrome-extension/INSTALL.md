# 🚀 Quick Installation Guide

## Step 1: Add Icons (Required!)

The extension needs icons to work. Create simple 16px, 32px, 48px, and 128px PNG images with a shield emoji or logo.

**Quick Method - Use Emoji as Icon:**
1. Visit https://favicon.io/emoji-favicons/shield/
2. Download the favicon package
3. Rename files:
   - `favicon-16x16.png` → `icon16.png`
   - `favicon-32x32.png` → `icon32.png`
   - Save to `chrome-extension/icons/` folder
4. For 48px and 128px, resize or duplicate the 32px version

**Or use this command to create placeholder icons** (macOS/Linux):
```bash
cd chrome-extension/icons
# Create simple colored squares as placeholders
convert -size 16x16 xc:#3b82f6 icon16.png
convert -size 32x32 xc:#3b82f6 icon32.png
convert -size 48x48 xc:#3b82f6 icon48.png
convert -size 128x128 xc:#3b82f6 icon128.png
```

## Step 2: Load Extension in Chrome

1. Open Chrome and go to:
   ```
   chrome://extensions/
   ```

2. Enable **Developer Mode** (toggle in top-right)

3. Click **"Load unpacked"**

4. Select the folder:
   ```
   /Users/nv44/Desktop/Compliance-Buddy/chrome-extension
   ```

5. Extension should appear in your toolbar! 🎉

## Step 3: Test It

1. Visit any webpage (e.g., https://wikipedia.org)

2. Click the ComplianceBuddy icon in toolbar

3. Click **"🚀 Activate on This Page"**

4. Draggable overlay appears!

5. Try:
   - Click **"Validate Page"** to scan content
   - Switch to **"Chat"** tab to ask questions

## 🔧 If Backend URL Changes

Update the API endpoint in these files:

**background.js** (line 4):
```javascript
const API_BASE_URL = 'https://mode-cnet-convenient-differently.trycloudflare.com';
```

**content-script.js** (search for fetch calls and update):
```javascript
fetch('https://mode-cnet-convenient-differently.trycloudflare.com/api/validate', ...)
fetch('https://mode-cnet-convenient-differently.trycloudflare.com/api/chat', ...)
```

Then reload the extension in chrome://extensions/

## ✅ You're Ready!

The extension will:
- ✅ Auto-scrape selected text OR whole page
- ✅ Send to your backend for validation
- ✅ Show compliance results
- ✅ Let you chat about results with AI

---

**Need Help?** Check the full README.md for troubleshooting.
