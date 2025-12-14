# Compliance Buddy Dashboard - Standalone HTML Version

## 🎯 Overview

A complete, standalone web dashboard for **Compliance Buddy - Sustainable AI Validation Engine**. This is a pure HTML/JavaScript implementation that connects to your FastAPI backend.

## 📦 What's Included

```
dashboard/
├── index.html      # Main dashboard page (complete UI)
├── app.js          # Core application logic
├── chat.js         # Chat functionality with Llama 3-8B
└── README.md       # This file
```

## ✨ Features

### 1. **Header**
- Title: "Compliance Buddy Dashboard"
- Subtitle: "Sustainable AI Validation Engine"
- Dark mode toggle (Eco Night Mode)
- Download report button

### 2. **Summary Cards**
- ✅ Average Compliance Score (%)
- ✅ Total Controls Validated
- ✅ CO₂ Emissions (g/kg)
- ✅ Energy Saved (%)

### 3. **Results Table**
- Color-coded rows:
  - ✅ **Green** → Pass
  - ⚠️ **Yellow** → Partial
  - ❌ **Red** → Fail
- Columns: Control | Verdict | Score | Explanation | Recommendation
- Progress bars for scores
- Smooth animations

### 4. **Charts**
- **Donut Chart**: Pass vs Partial vs Fail distribution
- **Line Chart**: CO₂ emissions trend over time
- Interactive tooltips
- Dark mode support

### 5. **Chat Component** (Fixed Section)
- ⚠️ **NOT a floating popup** - integrated into page layout
- Located below the charts section
- Text input for questions
- Display area for Llama 3-8B responses
- Message history with timestamps
- Typing indicators
- Context-aware mock responses

### 6. **Sustainability Indicator**
- Green leaf icon
- Energy saved percentage
- CodeCarbon badge
- Real-time metrics

## 🚀 Quick Start

### Option 1: Simple File Open
```bash
# Just open the file in your browser
open index.html
# or
firefox index.html
# or
chrome index.html
```

### Option 2: Local Server (Recommended)
```bash
# Using Python
cd dashboard
python3 -m http.server 8080

# Using Node.js
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

Then visit: `http://localhost:8080`

## 🔌 Backend Integration

### API Endpoints Required

The dashboard connects to these FastAPI endpoints:

#### 1. **GET /results**
Returns compliance validation results

**Response Format:**
```json
{
  "controls": [
    {
      "control": "Data Encryption Policy",
      "verdict": "Pass",
      "score": 92,
      "explanation": "AES-256 encryption verified",
      "recommendation": "Rotate keys every 6 months",
      "emissions": 0.0021
    }
  ]
}
```

#### 2. **GET /emissions**
Returns CodeCarbon sustainability metrics

**Response Format:**
```json
{
  "total_emissions": 0.0033,
  "energy_saved": 18,
  "avg_per_run": 0.0011,
  "history": [
    { "timestamp": "Run 1", "emissions": 0.0021 },
    { "timestamp": "Run 2", "emissions": 0.0019 }
  ]
}
```

#### 3. **POST /chat**
Sends messages to Llama 3-8B

**Request:**
```json
{
  "message": "Why did encryption fail?"
}
```

**Response:**
```json
{
  "response": "Based on the analysis, the encryption control failed because..."
}
```

#### 4. **GET /report/download**
Downloads compliance report (PDF/CSV)

Returns file download.

### Backend Configuration

Update the API URL in `app.js` and `chat.js`:

```javascript
// In app.js
const API_BASE_URL = 'http://localhost:8000';

// In chat.js
const CHAT_API_URL = 'http://localhost:8000/chat';
```

### CORS Setup (FastAPI)

Ensure your FastAPI backend has CORS enabled:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your dashboard URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🎨 Design Theme

### Color Palette
- **Primary**: `#00A676` (Eco Green)
- **Secondary**: `#E8F5E9` (Mint)
- **Accent**: `#1B4332` (Deep Green)
- **Background**: `#F7FAF8` (Light) / `#111827` (Dark)

### Typography
- **Font Family**: Inter, Poppins, sans-serif
- **Loaded from**: Google Fonts CDN

### Layout
- Responsive grid system
- Rounded corners (border-radius: 1rem)
- Soft shadows
- Glass-morphism effects
- Smooth animations

## 📊 Mock Data

The dashboard includes comprehensive mock data that activates when the backend is unavailable:

- **5 Sample Controls**: Data Encryption, Access Control, Data Retention, Incident Response, Security Audits
- **Verdicts**: Pass (60%), Partial (20%), Fail (20%)
- **Emissions**: 8.5g CO₂ total, 18% energy saved
- **Chat Responses**: Context-aware based on user questions

## 🌙 Dark Mode

### Toggle Dark Mode
Click the moon/sun icon in the header to switch themes.

### Features
- Persists in localStorage
- Respects system preference
- Updates charts automatically
- Smooth transitions

### Manual Control
```javascript
// Enable dark mode
document.documentElement.classList.add('dark');

// Disable dark mode
document.documentElement.classList.remove('dark');
```

## 💬 Chat Functionality

### How It Works

1. User types question in input field
2. Message sent to `/chat` endpoint
3. Llama 3-8B processes and responds
4. Response displayed in chat area
5. If backend unavailable, uses mock responses

### Example Questions

- "Why did encryption fail?"
- "How can I improve my compliance score?"
- "What's missing from my data retention policy?"
- "Explain the partial verdict for access control"
- "Tell me about CO₂ emissions"

### Mock Response System

The chat includes intelligent mock responses for:
- Encryption questions
- Failure explanations
- Score improvement tips
- Specific control inquiries
- Sustainability metrics
- General help

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Mobile Optimizations
- Stacked card layout
- Horizontal scroll for table
- Touch-friendly buttons
- Optimized chart sizes

## 🔧 Customization

### Change API URL
Edit `app.js` and `chat.js`:
```javascript
const API_BASE_URL = 'https://your-api.com';
```

### Modify Colors
Edit the Tailwind config in `index.html`:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#YOUR_COLOR',
                // ... more colors
            }
        }
    }
}
```

### Add Custom Charts
Use Chart.js in `app.js`:
```javascript
new Chart(ctx, {
    type: 'bar',  // or 'line', 'pie', etc.
    data: { /* your data */ },
    options: { /* your options */ }
});
```

## 🐛 Troubleshooting

### Dashboard shows mock data
- **Cause**: Backend not running or CORS issue
- **Fix**: Start FastAPI backend and enable CORS

### Charts not displaying
- **Cause**: Chart.js CDN not loaded
- **Fix**: Check internet connection or use local Chart.js

### Dark mode not working
- **Cause**: localStorage disabled
- **Fix**: Enable cookies/storage in browser

### Chat not responding
- **Cause**: Backend `/chat` endpoint not available
- **Fix**: Verify endpoint exists and CORS is enabled

### Download button fails
- **Cause**: `/report/download` endpoint not implemented
- **Fix**: Implement endpoint in FastAPI backend

## 📊 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚀 Deployment

### Static Hosting

Deploy to any static hosting service:

**Netlify:**
```bash
# Drag and drop the dashboard folder
# or use Netlify CLI
netlify deploy --dir=dashboard
```

**Vercel:**
```bash
vercel dashboard
```

**GitHub Pages:**
```bash
# Push to gh-pages branch
git subtree push --prefix dashboard origin gh-pages
```

### With Backend

1. Deploy FastAPI backend
2. Update API URLs in `app.js` and `chat.js`
3. Deploy dashboard to static hosting
4. Ensure CORS allows dashboard domain

## 📝 File Structure

```
dashboard/
│
├── index.html          # Main HTML file
│   ├── Header with title and controls
│   ├── Summary cards (4)
│   ├── Charts section (donut + line)
│   ├── Results table
│   ├── Chat section (fixed, not floating)
│   ├── Sustainability indicator
│   └── Footer
│
├── app.js              # Core application logic
│   ├── Data fetching (API + mock)
│   ├── Summary card updates
│   ├── Table rendering
│   ├── Chart creation (Chart.js)
│   ├── Dark mode toggle
│   ├── Report download
│   └── Utility functions
│
└── chat.js             # Chat functionality
    ├── Message handling
    ├── API communication
    ├── Typing indicators
    ├── Mock responses
    └── UI updates
```

## 🎯 Key Differences from React Version

| Feature | React Version | Standalone HTML |
|---------|--------------|-----------------|
| Framework | React 18 | Vanilla JS |
| Build | Vite | None needed |
| Dependencies | npm packages | CDN links |
| State | Zustand | Plain objects |
| Routing | React Router | Single page |
| Charts | Recharts | Chart.js |
| Deployment | Build required | Direct upload |

## ✅ Checklist

- ✅ Header with title and subtitle
- ✅ Summary cards (4 metrics)
- ✅ Results table with color-coded rows
- ✅ Donut chart (Pass/Partial/Fail)
- ✅ Line chart (Emissions over time)
- ✅ Chat section (fixed on page, not floating)
- ✅ Download report button
- ✅ Sustainability indicator
- ✅ Dark mode toggle
- ✅ Backend API integration
- ✅ Mock data fallback
- ✅ Responsive design
- ✅ Smooth animations

## 🎉 Ready to Use!

Your standalone dashboard is complete and ready for:
- ✅ Hackathon presentations
- ✅ Live demos
- ✅ Production deployment
- ✅ Backend integration
- ✅ Customization

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify backend is running
3. Check CORS configuration
4. Review API endpoint formats

---

**Built with 💚 for Sustainable AI**

**Compliance Buddy Dashboard** • Standalone HTML Version • Ready for Hackathons
