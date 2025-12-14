# Quick Start Guide - Vendor Audit Page

## 🚀 Access the Page

**URL:** http://localhost:5173/vendor-audit

(Dev server is already running on port 5173)

---

## 🎯 How to Use

### Step 1: Select a Control
On the **left panel**, you'll see 10 ISO 27001 controls. Each control card shows:
- Control ID (e.g., "A.5.1")
- Control title
- Control requirement text

### Step 2: Mark Compliance Status
Choose one of two options:
- ✅ **Compliant** (green button) - Control is met
- ❌ **Not Compliant** (red button) - Control is not met

**Note:** You can only validate controls marked as "Compliant"

### Step 3: Provide Evidence (if Compliant)
Two evidence options appear (tabs):

**Option A: Text Evidence**
- Click "Text Evidence" tab
- Type your evidence description
- Examples: policies, procedures, documentation references

**Option B: Upload File**
- Click "Upload File" tab
- Click upload area or drag file
- Supported: PDF, PNG, JPG, DOCX, TXT

**Important:** Choose EITHER text OR file (not both)

### Step 4: Validate
- Click "Validate Evidence" button
- Loading spinner appears
- Wait for validation to complete

### Step 5: View Results
After validation:
- Result card appears in **right panel**
- Shows verdict icon, score, and control name
- Page auto-scrolls to results

### Step 6: View Details
- Click "View Details" button on any result card
- Full-screen overlay opens with:
  - Detailed verdict and score
  - Analysis explanation
  - Recommendations
  - Implementation guidance
  - Matched keywords
  - Rule coverage

- Click "Close Details" to return to main page

---

## 🎨 Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│ 🟣 Vendor Mock Audit Page (Purple Gradient Header)     │
├────────────────────────┬────────────────────────────────┤
│ LEFT: Checklist        │ RIGHT: Results                 │
│                        │                                │
│ ┌────────────────────┐ │ ┌────────────────────────────┐ │
│ │ A.5.1: Policies    │ │ │ ✅ A.5.1 - 87%             │ │
│ │ [Compliant ▼]      │ │ │    Compliant               │ │
│ │ [Text | File]      │ │ │    [View Details]          │ │
│ │ Evidence: _________ │ │ └────────────────────────────┘ │
│ │ [Validate]         │ │                                │
│ └────────────────────┘ │ ┌────────────────────────────┐ │
│                        │ │ ⚠️ A.8.1 - 65%             │ │
│ ┌────────────────────┐ │ │    Needs Improvement       │ │
│ │ A.5.2: Management  │ │ │    [View Details]          │ │
│ │ ...                │ │ └────────────────────────────┘ │
│ └────────────────────┘ │                                │
│                        │ (Empty if no results yet)      │
└────────────────────────┴────────────────────────────────┘
```

---

## ✨ Features

### Smart Validation
- ❌ Blocks validation if no compliance status selected
- ❌ Blocks validation if marked "Not Compliant"
- ❌ Blocks validation if no evidence provided
- ✅ Only validates when compliant + evidence present

### Evidence Handling
- 📝 Text evidence: Free-form text input
- 📎 File evidence: Drag & drop or click to upload
- 🔄 Switching tabs clears opposite evidence type
- ✅ Mutually exclusive (never both at once)

### Real-Time Feedback
- 🔄 Loading spinner during validation
- ✅ Success notification
- ❌ Error messages for validation issues
- 📊 Results appear immediately

### Auto-Scroll
- Page automatically scrolls to results after validation
- Smooth animation
- Always shows most recent result

### Multiple Validations
- Validate multiple controls
- Results accumulate in right panel
- Each control can be validated independently
- Click any result to view details

---

## 📊 Validation Verdicts

### ✅ Compliant (Green)
- Score: 80-100%
- Evidence strongly matches requirements
- No major gaps identified

### ⚠️ Needs Improvement (Yellow)
- Score: 50-79%
- Some evidence provided but gaps exist
- Recommendations for improvement provided

### ❌ Not Compliant (Red)
- Score: 0-49%
- Evidence insufficient or missing
- Major gaps in control implementation

---

## 🐛 Troubleshooting

### "Please select compliance status"
→ Click either "Compliant" or "Not Compliant" button first

### "Cannot validate - marked as not compliant"
→ Non-compliant controls cannot be validated (by design)
→ Change to "Compliant" to enable validation

### "Please provide evidence text"
→ Type evidence description in text area (Text Evidence tab)

### "Please upload an evidence file"
→ Click upload area and select a file (Upload File tab)

### "Validation failed"
→ Check backend API is running
→ Check environment variable: `VITE_BACKEND_URL` in `.env`

### Results not appearing
→ Wait a few seconds for API response
→ Check browser console for errors
→ Verify backend URL is correct

---

## 🔗 API Information

**Backend:** https://existence-blvd-commissioner-flash.trycloudflare.com

**Endpoint:** POST /api/validate

**Format:** multipart/form-data with:
- `checklist_id` - Control ID
- `control_text` - Requirement text
- `evidence_text` OR `evidence_file` (not both)

---

## 📝 Available Controls

1. **A.5.1** - Policies for Information Security
2. **A.5.2** - Review of Policies
3. **A.6.1** - Internal Organization
4. **A.8.1** - Asset Inventory
5. **A.9.1** - Access Control Policy
6. **A.11.1** - Secure Areas
7. **A.12.1** - Operational Procedures
8. **A.14.1** - Security in Development
9. **A.16.1** - Incident Management
10. **A.18.1** - Legal & Regulatory Compliance

---

## 🎯 Test Scenario

**Quick Test:**
1. Navigate to http://localhost:5173/vendor-audit
2. Find "A.5.1: Policies for Information Security"
3. Click "Compliant" (green button)
4. Click "Text Evidence" tab
5. Type: "We have documented information security policies approved by management and distributed to all employees via the company intranet."
6. Click "Validate Evidence"
7. Wait for result to appear in right panel
8. Click "View Details" to see full analysis
9. Click "Close Details" to return
10. Try another control!

---

**Status:** ✅ Ready to use
**Dev Server:** Running on http://localhost:5173/
**Last Updated:** November 15, 2024
