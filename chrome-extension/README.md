# ComplianceBuddy Chrome Extension

Official Chrome extension for ComplianceBuddy AI Compliance Assistant with real-time page scraping and AI-powered validation.

## 🎯 Features

### ✅ Real Page Scraping
- **Mode 1**: Scrapes user-selected text if highlighted
- **Mode 2**: Scrapes entire page content automatically
- Cleans and processes HTML content
- No manual input required

### 🎨 Overlay UI
- Floating draggable panel
- Dark mode interface
- Two tabs: Validate & Chat
- Real-time validation results
- Interactive chat with AI

### 🔌 Backend Integration
- **Validation**: `POST /api/validate`
- **Chat**: `POST /api/chat`
- Cloudflare tunnel support
- Context-aware AI responses

## 📁 File Structure

```
chrome-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for API calls
├── content-script.js      # Page injection and scraping
├── popup.html            # Extension popup UI
├── popup.js              # Popup interaction logic
├── styles.css            # Overlay styling
├── icons/                # Extension icons (add your own)
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## 🚀 Installation

### Method 1: Load Unpacked Extension (Development)

1. **Add Icons** (Required)
   - Create or add PNG icons in the `icons/` folder:
     - `icon16.png` (16x16px)
     - `icon32.png` (32x32px)
     - `icon48.png` (48x48px)
     - `icon128.png` (128x128px)
   - Use a shield emoji or logo design

2. **Open Chrome Extensions**
   ```
   chrome://extensions/
   ```

3. **Enable Developer Mode**
   - Toggle switch in top-right corner

4. **Load Extension**
   - Click "Load unpacked"
   - Select the `chrome-extension/` folder
   - Extension will appear in toolbar

### Method 2: Package for Distribution

1. **Zip the extension folder**
   ```bash
   cd chrome-extension
   zip -r compliancebuddy-extension.zip . -x "*.DS_Store" -x "README.md"
   ```

2. **Upload to Chrome Web Store**
   - Visit Chrome Developer Dashboard
   - Create new item
   - Upload ZIP file

## 🎮 How to Use

### Basic Usage

1. **Activate Extension**
   - Visit any webpage
   - Click ComplianceBuddy icon in toolbar
   - Click "Activate on This Page"

2. **Validate Content**
   - Overlay appears on page
   - Click "Validate Page" tab
   - Extension automatically scrapes:
     - Selected text (if you highlighted any)
     - OR entire page content
   - View validation results instantly

3. **Chat with AI**
   - Click "Chat" tab
   - Ask questions about compliance
   - AI uses validation context automatically
   - Get recommendations and explanations

### Advanced Features

**Validation Results Include:**
- ✅ Compliance verdict (Pass/Fail/Partial)
- 📊 Compliance score (0-100%)
- 📝 AI explanation
- 💡 Recommendations

**Chat Features:**
- Context-aware responses
- Explains validation results
- Provides improvement suggestions
- Answers compliance questions

## 🔧 Configuration

### Update API Endpoint

If your backend URL changes, update in two places:

1. **background.js** (line 4):
```javascript
const API_BASE_URL = 'https://your-new-tunnel.trycloudflare.com';
```

2. **content-script.js** (inline fetch calls):
```javascript
// Search for fetch calls and update URLs
fetch('https://your-new-tunnel.trycloudflare.com/api/validate', ...)
fetch('https://your-new-tunnel.trycloudflare.com/api/chat', ...)
```

## 🐛 Troubleshooting

### Extension Not Appearing
- Check if icons are present in `icons/` folder
- Reload extension in `chrome://extensions/`
- Try disabling and re-enabling

### Overlay Not Showing
- Check browser console for errors (F12)
- Ensure content script is injected
- Some pages may block content scripts (e.g., chrome:// pages)

### API Calls Failing
- Verify backend is running
- Check Cloudflare tunnel is active
- Look at Network tab in DevTools
- Ensure CORS is enabled on backend

### Scraping Issues
- Test with simple text pages first
- Check if page has unusual structure
- Some sites may block scraping (rare)

## 🔒 Permissions Explained

- **activeTab**: Access current page content
- **scripting**: Inject overlay into pages
- **storage**: Save user preferences (future)
- **host_permissions**: Work on all websites

## 🎨 Customization

### Change Overlay Position
Edit `content-script.js` initial position:
```javascript
const [position, setPosition] = useState({ 
  x: window.innerWidth - 420,  // X position
  y: window.innerHeight - 600  // Y position
});
```

### Modify Appearance
Edit inline styles in `getOverlayAppCode()` function or add to `styles.css`

### Add Features
- File upload: Extend FormData in validation
- History: Use chrome.storage API
- Settings: Create options page

## 📊 API Format

### Validation Request
```javascript
POST /api/validate
Content-Type: multipart/form-data

{
  text: "scraped page content",
  file: [optional file upload]
}
```

### Chat Request
```javascript
POST /api/chat
Content-Type: application/json

{
  query: "user question",
  context: {validation result object}
}
```

## 🚀 Development Tips

1. **Reload Extension After Changes**
   - Go to `chrome://extensions/`
   - Click refresh icon on your extension

2. **Debug Content Script**
   - Open DevTools on any page (F12)
   - Check Console for logs
   - Use debugger statements

3. **Debug Background Worker**
   - Go to `chrome://extensions/`
   - Click "service worker" link under extension
   - Separate DevTools opens

4. **Test on Different Sites**
   - Simple text pages
   - Complex web apps
   - Sites with lots of JavaScript

## 📝 TODO / Future Enhancements

- [ ] Add file upload UI component
- [ ] Save validation history
- [ ] Add settings page for API configuration
- [ ] Export validation reports
- [ ] Keyboard shortcuts
- [ ] Dark/light theme toggle
- [ ] Minimize/maximize overlay
- [ ] Pin overlay position
- [ ] Multi-language support

## 🤝 Contributing

To improve the extension:
1. Fork the repository
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

Part of the ComplianceBuddy project.

## 🆘 Support

For issues or questions:
- Check browser console for errors
- Verify backend is running
- Review API endpoint configuration
- Open issue on GitHub repository

---

**Happy Compliance Checking! 🛡️✨**
