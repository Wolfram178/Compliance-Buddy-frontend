# ComplianceBuddy Chrome Extension - Quick Setup

## ✅ What's New

The extension now **automatically detects** the Vendor Audit page and adds **"🤖 Validate with AI"** buttons to each control row!

## 🚀 How It Works

1. **Automatic Page Detection**: Extension detects the ISO 27001 Compliance Audit page
2. **Data Scraping**: Automatically extracts:
   - Control ID
   - Control Name  
   - Control Text/Requirement
   - Compliance Status
   - Evidence (text or uploaded file)
3. **AI Validation**: Sends data to your Python FastAPI backend via Cloudflare tunnel
4. **Results Display**: Shows beautiful overlay with full validation results
5. **Dashboard Integration**: Saves results to localStorage for dashboard view

## 📦 Installation

### Step 1: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the `chrome-extension` folder from your project
5. Extension is now installed! 🎉

### Step 2: Use the Extension

1. **Open your Vendor Audit page**: `http://localhost:5173/`
2. **Fill in the evidence** for any control (text or file upload)
3. **Click "🤖 Validate with AI"** button (appears below the standard Validate button)
4. Extension will:
   - Scrape all data from the row
   - Send to AI validation API
   - Show results in overlay
   - Save to localStorage for dashboard

### Step 3: View Results in Dashboard

After validation, click **"View Dashboard"** button in:
- The result overlay, OR
- The blue banner at the top of the vendor page

Dashboard will show all validated controls with full details!

## 🔧 Configuration

The extension is pre-configured to use:
```javascript
API_BASE_URL = 'https://gently-metal-maria-publicly.trycloudflare.com'
```

To change the API endpoint, edit `content-script-vendor-audit.js`:
```javascript
const API_BASE_URL = 'YOUR_NEW_URL_HERE';
```

## ✨ Features

- ✅ **Auto-detection** of vendor audit pages
- ✅ **Smart data extraction** from table rows
- ✅ **File upload support** (PDFs, images, documents)
- ✅ **Beautiful result overlays** with full details
- ✅ **localStorage integration** for dashboard
- ✅ **Inline notifications** for errors/success
- ✅ **Gradient purple buttons** for visual distinction

## 🎯 Extension vs Native Validation

Both methods work and save to the dashboard:

| Feature | Native Button | Extension Button |
|---------|--------------|------------------|
| Data Entry | Manual | Auto-scraped |
| Validation | Works | Works |
| Results | Shows overlay | Shows overlay |
| Dashboard | Saves | Saves ✓ |
| Visual | Blue button | Purple gradient 🤖 |

## 🐛 Troubleshooting

**Extension button not appearing?**
- Make sure you're on `http://localhost:5173/`
- Check if the page has the ISO 27001 table
- Refresh the page after loading extension

**Validation fails?**
- Ensure backend is running: `cd backend && npm start`
- Check Cloudflare tunnel is active
- Open browser console (F12) for error details

**Results not in dashboard?**
- Validation saves to localStorage automatically
- Navigate to `/dashboard` to see results
- Check browser console for localStorage data

## 📝 Example Workflow

1. Open vendor audit page: `http://localhost:5173/`
2. For control "A.5.1":
   - Select "Yes" for compliance
   - Type evidence: "We have approved ISMS policies..."
   - Click **"🤖 Validate with AI"** (purple button)
3. Wait for validation (15-30 seconds)
4. View results in overlay
5. Click **"View Dashboard"**
6. See all validated controls with charts!

## 🔐 Permissions

The extension requires:
- `activeTab` - To read current page content
- `scripting` - To inject validation buttons
- `storage` - To save user preferences
- `host_permissions` - To call validation API

## 📄 Files

- `manifest.json` - Extension configuration
- `content-script-vendor-audit.js` - **NEW**: Vendor page integration
- `content-script-scanner.js` - Generic page scanning
- `content-script-inline.js` - Inline suggestions
- `background.js` - Background service worker
- `popup.html/js` - Extension popup UI

---

**Ready to validate!** 🚀 Load the extension and open your vendor audit page!
