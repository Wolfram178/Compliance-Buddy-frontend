# Compliance Buddy – Sustainable AI Compliance Verification

**GREEN MIND HACKATHON 2025**

> AI-powered compliance verification, designed to be efficient, practical, and environmentally responsible.

---

## 🎯 Project Overview

Compliance Buddy is a sustainable AI system that helps organizations verify compliance through intelligent document analysis and guided checklists.

It was built for the **Green Mind Hackathon 2025** with a clear goal: demonstrate that AI systems can be **useful, trustworthy, and energy-conscious** at the same time.

### The Problem

Traditional compliance verification is:

* ⏰ Time-consuming and heavily manual
* 💰 Expensive and resource-intensive
* 🔄 Inconsistent across reviewers
* 🌍 Increasingly dependent on large, energy-hungry AI models

### Our Solution

Compliance Buddy provides:

* ✅ Automated compliance checks that significantly reduce manual review effort
* 🌿 A right-sized AI approach using efficient language models
* 📊 Clear verdicts with explanations and recommendations
* 💬 An assistant for follow-up compliance questions
* 📈 Visibility into sustainability and carbon impact

---

## 📌 Repository Scope

This repository contains the **frontend dashboard, browser extension, and demo assets** for Compliance Buddy.

The AI inference engine, compliance validation logic, document parsing pipeline, and sustainability tracking backend are maintained in a **private repository** and are accessed via secure APIs.

This separation protects core intellectual property while allowing the frontend to remain open, auditable, and extensible.

---

## 🏗️ High-Level Architecture

```
Web UI / Vendor Page
        ↓
Browser Extension (DOM scan + overlays)
        ↓
Frontend Dashboard
        ↓
Secure API Gateway (Cloudflare Tunnel)
        ↓
AI Compliance Engine (Private Backend)
```

The system follows a **hybrid approach**:

* Structured parsing and rule checks first
* AI reasoning only where needed
* Results streamed back to the UI for review

---

## 🚀 Features

### Core Functionality

* **📋 Smart Checklist** – Structured ISO-style controls with per-item feedback
* **📤 Evidence Upload** – Supports PDFs, DOCX, CSV, images, and text
* **🤖 AI-Assisted Validation** – Scores, verdicts, and short explanations
* **📊 Real-Time Feedback** – Immediate results at both item and batch level
* **💬 Compliance Chat Assistant** – Ask follow-up questions in plain language

### Sustainability-Oriented Design

* **⚡ Efficient Models** – Smaller, task-appropriate LLMs instead of oversized ones
* **♻️ Hybrid Pipeline** – Non-AI parsing reduces unnecessary inference calls
* **🌙 Dark-Mode First UI** – Lower display energy usage
* **📉 Carbon Awareness** – Emissions metrics surfaced directly in the dashboard

> ⚠️ Note: Sustainability and carbon metrics are **estimated values** derived from local inference measurements and comparative analysis. They are intended for relative benchmarking, not certified carbon accounting.

---

## 🎥 Demo Flow (Hackathon)

1. Open the Compliance Buddy dashboard
2. Upload a checklist and supporting evidence
3. Review per-control scores, verdicts, and guidance
4. Inspect sustainability metrics for the validation run
5. Ask follow-up questions using the chat assistant

---

## 🛠️ Tech Stack (Frontend)

* **React 18** – Component-based UI
* **Vite** – Fast development and build tooling
* **Tailwind CSS** – Utility-first, low-overhead styling
* **Framer Motion** – Lightweight animations
* **Zustand** – Minimal state management
* **Chrome Extension APIs** – DOM scanning and overlays

The frontend communicates with the backend using **HTTPS-based APIs** (WebSocket-ready design) exposed via **Cloudflare Tunnel**.

---

## 📁 Project Structure

```
Compliance-Buddy/
├── frontend/              # Main dashboard (React + Vite)
├── dashboard/             # Dashboard UI modules
├── chrome-extension/      # Chrome extension (DOM overlay + uploads)
├── compliance-extension/  # Compliance-specific extension logic
├── .vite/                 # Build cache
├── README.md              # This file
```

---

## 🤝 Contributing

Contributions are welcome.

If you plan to extend the UI or experiment with new workflows:

1. Fork the repository
2. Create a feature branch
3. Make focused, well-documented changes
4. Open a pull request

---

## 📄 License

MIT License.

This project is provided for educational, research, and prototyping purposes.

---

## 🙏 Acknowledgments

* **Green Mind Hackathon 2025** for the challenge and platform
* **Open-source communities** behind React, Vite, and Tailwind
* Researchers and practitioners working on **sustainable AI systems**

---

Built with care 🌱 — balancing compliance, clarity, and carbon impact.
