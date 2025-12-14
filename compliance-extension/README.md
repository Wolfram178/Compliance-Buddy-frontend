# Compliance Buddy Chrome Extension

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this `compliance-extension` folder
4. The extension icon should appear in your toolbar

## Usage

1. Navigate to the mockup page: `http://localhost:5173/mockup`
2. Click the Compliance Buddy extension icon
3. Fill in the form with:
   - Checklist ID (e.g., "CL-001")
   - Control Text (description of the control)
   - Evidence Text (evidence supporting the control)
4. Click "Validate Control"
5. An overlay will appear on the mockup page with the results
6. Results are also sent to the dashboard backend (if running)

## Files

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup UI
- `popup.js` - Popup logic and API calls
- `content.js` - Content script for overlay display
- `background.js` - Background service worker
- `icon*.png` - Extension icons (you need to add these)

## Icons (Optional)

Icons have been removed from the manifest to avoid loading errors. The extension will use Chrome's default extension icon. If you want custom icons, you can add:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels) 
- `icon128.png` (128x128 pixels)

Then add this to manifest.json:
```json
"icons": {
  "16": "icon16.png",
  "48": "icon48.png", 
  "128": "icon128.png"
}
```
