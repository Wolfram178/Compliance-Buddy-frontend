# Chrome Extension + API Integration Setup

This guide explains how to set up and test the complete Chrome Extension + Dashboard integration for Compliance Buddy.

## 🏗️ Architecture Overview

```
Chrome Extension (compliance-extension/)
    ↓ (validates via CloudFlare API)
CloudFlare API (https://gently-metal-maria-publicly.trycloudflare.com/api/validate)
    ↓ (displays overlay on mockup page)
Mockup Page (http://localhost:5173/mockup)
    ↓ (stores results)
Backend API (http://localhost:8000/api/validation/store)
    ↓ (displays stored results)
Dashboard (http://localhost:5173/)
```

## 🚀 Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:8000`

### 3. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Install Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `compliance-extension` folder
5. The Compliance Buddy extension should appear in your toolbar

### 5. Add Extension Icons (Optional)

Create these icon files in the `compliance-extension/` folder:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can use any shield/security icon or create simple ones.

## 🧪 Testing the Integration

### Step 1: Open the Mockup Page
Navigate to: `http://localhost:5173/mockup`

### Step 2: Use the Chrome Extension
1. Click the Compliance Buddy extension icon in Chrome toolbar
2. Fill in the form:
   - **Checklist ID**: `CL-001` (or any ID)
   - **Control Text**: `Access control policy implementation`
   - **Evidence Text**: `Multi-factor authentication enabled for all users`
3. Click "Validate Control"

### Step 3: See the Results
- **Overlay**: A validation result overlay appears on the mockup page
- **Dashboard**: Results are stored and displayed in the dashboard at `http://localhost:5173/`

## 📁 File Structure

```
compliance-extension/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic and API calls
├── content.js             # Content script for overlay
├── background.js          # Background service worker
└── README.md              # Extension documentation

backend/
├── package.json           # Backend dependencies
├── server.js              # Express API server
└── README.md              # Backend documentation

frontend/src/
├── components/validation/
│   └── ValidationResults.jsx  # Component to display stored results
├── pages/
│   └── Mockup.jsx             # Test page for extension
└── ...                        # Existing dashboard files
```

## 🔧 API Endpoints

### Backend API (http://localhost:8000)

- `GET /api/health` - Health check
- `POST /api/validation/store` - Store validation result from extension
- `GET /api/validation/getAll` - Get all stored validation results
- `GET /api/validation/:id` - Get specific validation result
- `DELETE /api/validation/:id` - Delete specific validation result
- `DELETE /api/validation/clear/all` - Clear all validation results

### CloudFlare API (External)

- `POST https://tongue-exhibits-colony-cio.trycloudflare.com/api/validate` - Validate control

## 🐛 Troubleshooting

### Extension Not Working
- Check that the extension is loaded in `chrome://extensions/`
- Ensure you're on the mockup page (`http://localhost:5173/mockup`)
- Check browser console for errors

### Backend Connection Issues
- Ensure backend server is running on port 8000
- Check that CORS is enabled (already configured)
- Verify API endpoints with browser or Postman

### Overlay Not Appearing
- Make sure you're on the exact URL: `http://localhost:5173/mockup`
- Check browser console for content script errors
- Verify extension permissions in manifest.json

### Dashboard Not Showing Results
- Ensure backend server is running
- Check network tab for API call failures
- Verify ValidationResults component is imported correctly

## 🎯 Expected Behavior

1. **Extension Popup**: Clean form interface with validation button
2. **API Call**: Extension calls CloudFlare API and gets validation result
3. **Overlay Display**: Result appears as overlay on mockup page only
4. **Data Storage**: Same result is sent to backend API for storage
5. **Dashboard Display**: Stored results appear in dashboard table
6. **Real-time Updates**: Dashboard refreshes every 30 seconds

## 🔒 Security Notes

- Extension only runs on localhost mockup page
- API calls use proper CORS headers
- No sensitive data is stored in extension storage
- Backend uses in-memory storage (replace with database for production)

## 📝 Development Notes

- Extension uses Manifest V3 (latest Chrome extension format)
- Backend uses Express.js with ES modules
- Frontend integration uses existing React components
- All styling matches existing dashboard theme
