# 🚀 Compliance Buddy Dashboard - Quick Start

## ⚡ Get Running in 30 Seconds

### Step 1: Open the Dashboard
```bash
cd /Users/nv44/Desktop/Compliance-Buddy/dashboard
open index.html
```

**That's it!** The dashboard will open in your browser with mock data.

---

## 🔌 Connect to Your Backend (Optional)

### Step 2: Start Your FastAPI Backend
```bash
# In your backend directory
uvicorn main:app --reload --port 8000
```

### Step 3: Refresh Dashboard
The dashboard will automatically connect to `http://localhost:8000` and load real data.

---

## 🎯 What You'll See

### Dashboard Layout
```
┌─────────────────────────────────────────────────┐
│  Compliance Buddy Dashboard                    │
│  Sustainable AI Validation Engine               │
├─────────────────────────────────────────────────┤
│  [92%]  [5]  [8.5g]  [18%]  ← Summary Cards    │
├─────────────────────────────────────────────────┤
│  [Donut Chart]  [Line Chart]  ← Visualizations │
├─────────────────────────────────────────────────┤
│  [Results Table with Color-Coded Rows]         │
├─────────────────────────────────────────────────┤
│  💬 Chat with Llama 3-8B  ← Fixed Section      │
│  [Ask questions here...]                        │
├─────────────────────────────────────────────────┤
│  🍃 Sustainability Indicator                   │
└─────────────────────────────────────────────────┘
```

---

## 💬 Try the Chat

Ask questions like:
- "Why did encryption fail?"
- "How can I improve my score?"
- "Tell me about CO₂ emissions"

The chat is a **fixed section on the page** (not a floating popup).

---

## 🌙 Toggle Dark Mode

Click the moon/sun icon in the header to switch between:
- ☀️ Light Mode (Eco-friendly mint theme)
- 🌙 Dark Mode (Eco Night theme)

---

## 📥 Download Report

Click the "Download Report" button in the header to get your compliance report.

---

## 🎨 Features at a Glance

✅ **Summary Cards**: Average score, total controls, CO₂, energy saved  
✅ **Charts**: Donut (distribution) + Line (emissions)  
✅ **Table**: Color-coded verdicts (Green/Yellow/Red)  
✅ **Chat**: Ask Llama 3-8B about compliance  
✅ **Dark Mode**: Eco Night theme  
✅ **Responsive**: Works on mobile, tablet, desktop  

---

## 🔧 Configuration

### Change Backend URL

Edit `app.js` (line 3):
```javascript
const API_BASE_URL = 'http://your-backend-url:8000';
```

Edit `chat.js` (line 4):
```javascript
const CHAT_API_URL = 'http://your-backend-url:8000/chat';
```

---

## 📊 Mock Data vs Real Data

### Mock Data (Default)
- Activates when backend is unavailable
- 5 sample controls with verdicts
- Realistic emissions data
- Context-aware chat responses

### Real Data (With Backend)
- Fetches from `/results` endpoint
- Fetches from `/emissions` endpoint
- Connects to `/chat` for Llama 3-8B
- Downloads reports from `/report/download`

---

## 🐛 Troubleshooting

### Dashboard shows "Loading..."
- **Fix**: Wait a moment, it's fetching data
- **Or**: Backend might be slow, check console

### All data shows "--"
- **Fix**: Backend not running, using mock data
- **Check**: Console for error messages

### Chat not responding
- **Fix**: Backend `/chat` endpoint not available
- **Fallback**: Mock responses will work

### Download button doesn't work
- **Fix**: Backend `/report/download` not implemented
- **Check**: Browser console for errors

---

## 📱 Mobile View

The dashboard is fully responsive:
- Cards stack vertically
- Table scrolls horizontally
- Charts resize automatically
- Chat works on touch devices

---

## 🎯 Next Steps

1. ✅ **Customize**: Edit colors in `index.html`
2. ✅ **Deploy**: Upload to Netlify/Vercel
3. ✅ **Integrate**: Connect to your FastAPI backend
4. ✅ **Present**: Use for hackathon demo

---

## 📚 Full Documentation

See `README.md` for complete documentation including:
- API endpoint formats
- Customization guide
- Deployment instructions
- Browser support

---

**You're ready to go!** 🎉

Open `index.html` and start exploring your Compliance Buddy Dashboard.

**Built with 💚 for Sustainable AI**
