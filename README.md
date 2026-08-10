# 🎨 PaletteLens | Genuine Visual Color Analysis Engine

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?style=for-the-badge&logo=vercel)](https://palettelens.vercel.app)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript%20%7C%20Vite-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Shreya-J-5/PaletteLens---colour-palette-detector)

> **PaletteLens** is a full-stack visual color analysis platform that extracts the exact colours genuinely used in production across websites, uploaded images, PDFs, and design assets. No fake or randomly generated palettes.

---

## 🌐 Live Application & Repository

- **Live Web App**: [https://palettelens.vercel.app](https://palettelens.vercel.app)
- **GitHub Repository**: [https://github.com/Shreya-J-5/PaletteLens---colour-palette-detector](https://github.com/Shreya-J-5/PaletteLens---colour-palette-detector)

---

## ✨ Key Features

- 🎯 **Genuine Pixel & CSS Color Extraction**: Converts image pixels and DOM declarations to the **CIE L*a*b*** 3D color space to perform perceptual clustering and Delta E merging.
- 🌐 **Multi-Page Website Crawling**: Crawls accessible internal links to extract both page-by-page palettes and total recurring brand color frequencies.
- 🖼️ **Multi-Format Input Support**: Accepts Website URLs, Images (PNG, JPG, WEBP, SVG, GIF), and PDF Documents up to 50MB.
- 🔐 **Trial Limits & User Authentication**:
  - **3 Free Trial Analyses** without requiring an account.
  - Interactive **Sign Up / Log In** auth modal to unlock unlimited usage.
  - **User-Scoped History**: Logged-in accounts automatically persist and view their past palette analyses across sessions.
  - **Logout Confirmation Dialog**: Interactive prompt before signing out to prevent accidental data loss.
- 📊 **Perceptual Analytics & Charts**: Visual color frequency charts (Recharts) displaying exact occurrence percentages.
- 💻 **Ready-to-Use Developer Exports**: One-click copying for:
  - CSS Custom Variables (`:root`)
  - Tailwind CSS Config (`theme.extend.colors`)
  - Structured JSON Metadata
  - HEX, RGB, HSL & CIE LAB color codes

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide Icons
- **Routing**: React Router v6
- **State Management**: React Context API (`AuthContext`)
- **Charts**: Recharts

### Backend
- **Framework**: Python 3.12 / FastAPI
- **Database**: PostgreSQL / SQLite (SQLAlchemy ORM + Alembic)
- **Image & PDF Processing**: Pillow (PIL) + PyMuPDF (fitz)
- **Perceptual Clustering**: NumPy + CIE L*a*b* Quantization

---

## 📁 Repository Architecture

```
PaletteLens---colour-palette-detector/
├── frontend/                  # React + TypeScript + Vite UI
│   ├── src/
│   │   ├── api/              # Axios client & endpoint wrappers
│   │   ├── components/       # Navbar, Footer, AuthModal, LogoutConfirmModal
│   │   ├── context/          # AuthContext & Session state
│   │   ├── pages/            # LandingPage, Dashboard, AnalysisResults, Legal/Docs
│   │   └── types/            # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                   # FastAPI Python Server
│   ├── app/
│   │   ├── api/              # Analysis & Health endpoints
│   │   ├── core/             # Perceptual color clustering engine
│   │   ├── models/           # SQLAlchemy DB Schemas
│   │   └── services/         # Website crawler & PDF extractor
│   ├── requirements.txt
│   └── main.py
│
├── vercel.json                # Production Vercel deployment configuration
└── README.md                  # Comprehensive Documentation
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend application will launch at `http://localhost:3000`.

### 3. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
The backend API documentation will be available at `http://localhost:8000/docs`.

---

## 📖 Privacy Policy, Terms & Documentation

- **Privacy Policy**: `/privacy` — Details data security and non-sharing guarantees.
- **Terms of Service**: `/terms` — Usage terms and free trial allocation policies.
- **Engine Documentation**: `/docs` — Technical breakdown of the CIE L*a*b* perceptual color clustering algorithm.

---

## 🌐 Deployment Guide (Vercel)

Deploy directly to Vercel using the Vercel CLI:
```bash
npx vercel --prod --yes
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

Developed with ❤️ for designers and developers by [Shreya](https://github.com/Shreya-J-5).
