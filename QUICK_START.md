# 🚀 Compliance Buddy - Quick Start Guide

## ⚡ Get Started in 3 Minutes

### 1. Install & Run

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Dashboard URL**: `http://localhost:3000`

### 2. View the Dashboard

The dashboard opens with:
- ✅ **Summary Cards**: Compliance score, controls, CO₂, energy saved
- ✅ **Charts**: Donut chart (Pass/Partial/Fail) + Line chart (Emissions)
- ✅ **Results Table**: Color-coded verdicts with explanations
- ✅ **Sustainability Badge**: Green leaf with CodeCarbon tracking

### 3. Switch Views

- **Dashboard Tab**: Overview with charts and metrics
- **Checklist Tab**: Document upload and validation
- **Dark Mode Toggle**: Switch between dark and light themes

### 4. Try the Chat

Click the floating chat button (bottom right):
- Ask: "Why did encryption fail?"
- Ask: "How can I improve my compliance score?"
- Powered by Llama 3-8B

## 🔌 Connect to Backend

### Option A: Use Mock Data (Demo Mode)
✅ **Already working!** The dashboard uses mock data automatically.

### Option B: Connect to FastAPI Backend

1. **Create `.env` file**:
```bash
cp .env.example .env
```

2. **Update API URL**:
```env
VITE_API_URL=http://localhost:8000/api
```

3. **Start your FastAPI backend** on port 8000

4. **Refresh the dashboard** - it will automatically connect!

## 📊 Backend API Format

Your FastAPI should provide these endpoints:

### GET /api/results
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

### GET /api/emissions
```json
{
  "total_emissions": 0.0033,
  "energy_saved": 18,
  "avg_per_run": 0.0011,
  "history": [
    { "timestamp": "Run 1", "emissions": 0.0021 }
  ]
}
```

### POST /api/chat
**Request:**
```json
{
  "message": "Why did encryption fail?"
}
```

**Response:**
```json
{
  "response": "Based on the analysis..."
}
```

## 🎨 Key Features

### Dashboard View
- **4 Summary Cards**: Score, Controls, CO₂, Energy
- **Donut Chart**: Compliance distribution
- **Line Chart**: Emissions timeline
- **Results Table**: Detailed verdicts
- **Download Button**: Generate PDF report

### Design Theme
- **Primary**: `#00A676` (Eco Green)
- **Background**: `#E8F5E9` (Mint) / Dark mode
- **Accent**: `#1B4332` (Deep Green)
- **Typography**: System fonts (Inter/Poppins)

### Sustainability
- ✅ Llama 3-8B (70% less energy)
- ✅ CodeCarbon tracking
- ✅ Real-time CO₂ metrics
- ✅ Energy savings display

## 🎯 Demo Script (2 minutes)

1. **Open Dashboard** (0:00-0:20)
   - Show summary cards
   - Point out CO₂ and energy metrics

2. **View Charts** (0:20-0:40)
   - Donut chart: Pass/Partial/Fail
   - Line chart: Emissions over time

3. **Explore Table** (0:40-1:00)
   - Color-coded rows
   - Verdicts and scores
   - Explanations from Llama 3-8B

4. **Toggle Dark Mode** (1:00-1:10)
   - Show eco night theme

5. **Open Chat** (1:10-1:40)
   - Ask a question
   - Show Llama 3-8B response

6. **Switch to Checklist** (1:40-2:00)
   - Show document upload
   - Explain validation flow

## 🔧 Troubleshooting

### Dashboard not loading?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Charts not showing?
```bash
# Ensure recharts is installed
npm install recharts
```

### Backend connection failed?
- Check if backend is running on port 8000
- Verify CORS is enabled in FastAPI
- Check `.env` file has correct API URL
- Dashboard will use mock data as fallback

### Build errors?
```bash
# Try a fresh build
npm run build
```

## 📱 Responsive Design

- **Mobile**: Optimized for 320px+
- **Tablet**: Enhanced at 768px+
- **Desktop**: Full experience at 1024px+

## 🎉 You're Ready!

Your dashboard is fully functional and ready for:
- ✅ Hackathon presentation
- ✅ Live demos
- ✅ Backend integration
- ✅ Production deployment

## 📚 More Information

- **Full Documentation**: See `DASHBOARD_README.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Component Map**: See `COMPONENT_MAP.md`

## 🆘 Need Help?

Common issues:
1. **Port 3000 in use?** - Vite will auto-select another port
2. **Backend CORS?** - Add frontend URL to CORS origins
3. **Mock data?** - Normal! Backend connection is optional

---

**Built with 💚 for Sustainable AI**

**Dashboard Status**: ✅ Ready to Demo
**Backend Integration**: ✅ Ready to Connect
**Hackathon Ready**: ✅ 100%

Good luck! 🚀
