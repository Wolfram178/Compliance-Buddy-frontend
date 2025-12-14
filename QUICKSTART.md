# ⚡ Quick Start Guide

Get Compliance Buddy running in under 2 minutes!

## Prerequisites

- Node.js 18+ installed ([Download here](https://nodejs.org/))
- A terminal/command prompt

## Installation

### Option 1: Automated Setup (Recommended)

```bash
# Clone or navigate to the project
cd Compliance-Buddy/frontend

# Install and run in one command
npm install && npm run dev
```

### Option 2: Step-by-Step

```bash
# 1. Navigate to frontend directory
cd Compliance-Buddy/frontend

# 2. Install dependencies (takes ~1-2 minutes)
npm install

# 3. Start the development server
npm run dev
```

## Access the Application

Once the server starts, you'll see:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Open your browser and visit:** `http://localhost:3000`

## What You'll See

### 1. **Hero Section**
- Sustainable AI branding
- Project description
- Metrics toggle button

### 2. **Compliance Checklist**
- 5 pre-configured compliance controls
- Search and filter functionality
- Real-time status indicators

### 3. **Interactive Features**
- Click any control card to view details
- Upload documents (drag & drop supported)
- Click "Verify Compliance" to see AI analysis
- Open chatbot (bottom-right corner) for assistance
- Toggle sustainability metrics (top-right)

## Try It Out!

### Test the Workflow

1. **Select a Control**
   - Click on "Data Encryption at Rest"

2. **Upload Documents**
   - Drag a PDF/DOCX file into the upload area
   - Or click to browse

3. **Verify Compliance**
   - Click the "Verify Compliance" button
   - Watch the AI analyze your documents (simulated)
   - See the verdict, score, and explanation

4. **Chat with Assistant**
   - Click the chat button (bottom-right)
   - Ask questions about compliance
   - Get intelligent responses

5. **View Sustainability Metrics**
   - Click "Metrics" button (top-right)
   - See environmental impact in real-time

## Features to Explore

### ✅ Compliance Verification
- Upload multiple document formats
- Real-time processing status
- Detailed verdict with scores
- Animated progress indicators

### 💬 AI Chatbot
- Context-aware responses
- Compliance guidance
- Evidence suggestions
- Powered by Llama 3.1 8B

### 📊 Sustainability Dashboard
- Energy savings tracking
- CO₂ reduction metrics
- Efficiency scores
- Model performance stats

### 🎨 UI/UX Features
- Dark mode (energy-efficient)
- Smooth animations
- Responsive design
- Glass morphism effects
- Accessibility support

## Keyboard Shortcuts

- **Tab**: Navigate between elements
- **Enter**: Activate buttons/links
- **Escape**: Close modals/chat
- **Ctrl/Cmd + K**: Focus search (if implemented)

## Troubleshooting

### Port Already in Use
If port 3000 is busy, Vite will automatically use the next available port (3001, 3002, etc.)

### Dependencies Won't Install
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Browser Shows Blank Page
1. Check the terminal for errors
2. Try hard refresh: `Ctrl/Cmd + Shift + R`
3. Clear browser cache
4. Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)

### Hot Reload Not Working
1. Save the file again
2. Restart the dev server: `Ctrl + C`, then `npm run dev`

## Next Steps

### For Development
1. **Customize Controls**: Edit `src/store/complianceStore.js`
2. **Modify Theme**: Update `tailwind.config.js`
3. **Add Components**: Create in `src/components/`
4. **Connect Backend**: Update API endpoints

### For Production
```bash
# Build optimized version
npm run build

# Preview production build
npm run preview
```

The production build will be in the `dist/` folder, ready for deployment.

## Project Structure

```
frontend/
├── src/
│   ├── components/       # All UI components
│   │   ├── chat/        # Chatbot
│   │   ├── compliance/  # Main features
│   │   ├── layout/      # Header, etc.
│   │   ├── metrics/     # Sustainability
│   │   └── ui/          # Reusable components
│   ├── store/           # State management
│   ├── App.jsx          # Main app
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── package.json         # Dependencies
```

## Learn More

- **Full Documentation**: See [frontend/README.md](frontend/README.md)
- **Design System**: See [frontend/DESIGN_GUIDE.md](frontend/DESIGN_GUIDE.md)
- **Setup Details**: See [frontend/SETUP.md](frontend/SETUP.md)

## Support

Having issues? Check:
1. Node.js version: `node --version` (should be 18+)
2. npm version: `npm --version`
3. Terminal errors for specific issues

## What's Next?

This is the **frontend-only** version. To complete the system:

1. **Backend**: FastAPI server with Llama 3.1 8B
2. **Extension**: Chrome extension for context capture
3. **Integration**: Connect all components

See the main [README.md](README.md) for the full roadmap.

---

**Enjoy building with Compliance Buddy!** 🌱

Built with sustainability in mind for Green Mind Hackathon 2025.
