# IntelliMine Copilot

> **Enterprise AI Operating System for Coal Mining Organizations**  
> Built for Central Coalfields Limited (CCL) | Powered by Gemini AI

![IntelliMine Copilot](https://img.shields.io/badge/IntelliMine-v2.4.1-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?style=for-the-badge)
![Gemini AI](https://img.shields.io/badge/Gemini-2.0_Flash-orange?style=for-the-badge)

---

## 🚀 Live Demo

**Frontend:** [intellimine.vercel.app](https://intellimine.vercel.app)  
**API Docs:** [intellimine-api.onrender.com/docs](https://intellimine-api.onrender.com/docs)

**Demo Login:** Select any role → Enter any password

---

## 📋 Modules

| Module | Description |
|--------|-------------|
| 🏠 **Executive Dashboard** | Real-time KPIs, production trends, mine heatmap |
| 🤖 **AI Copilot** | Natural language interface powered by Gemini AI |
| ⚙️ **Equipment Intelligence** | Health monitoring, failure prediction, maintenance timeline |
| 📄 **Document Intelligence** | RAG-powered search across 6+ document types |
| 👷 **Employee Intelligence** | Workforce data, attendance, safety, training |
| 📈 **Predictive Analytics** | ML forecasts for production, equipment, fuel |
| 📝 **Smart Report Generator** | One-click AI-assembled PDF/Excel reports |
| 🔔 **Notification Center** | Priority alerts with AI-generated recommendations |
| 🛡️ **Safety Management** | Incident log, training compliance, trend charts |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│  Next.js 14 (TypeScript + Tailwind)     │
│  Deployed on Vercel (Mumbai CDN)        │
└────────────────┬────────────────────────┘
                 │ HTTPS API calls
┌────────────────▼────────────────────────┐
│  FastAPI Backend                        │
│  Deployed on Render                     │
└───┬─────────┬─────────┬────────────────┘
    │         │         │
┌───▼──┐ ┌───▼──┐ ┌────▼─────┐
│Supa- │ │Gemini│ │ChromaDB  │
│base  │ │  AI  │ │(RAG)     │
│(PG)  │ │      │ │          │
└──────┘ └──────┘ └──────────┘
```

---

## ⚡ Quick Start (Local)

### 1. Clone & setup

```bash
git clone https://github.com/YOUR_USERNAME/intellimine-copilot.git
cd intellimine-copilot
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY
npm run dev
# → http://localhost:3000
```

### 3. Backend (optional for demo)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
# API docs: http://localhost:8000/docs
```

---

## 🌐 Deploy (Free)

### Frontend → Vercel

1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Set Root Directory: `frontend`
4. Add env vars: `GEMINI_API_KEY`, `NEXT_PUBLIC_API_URL`
5. Deploy → Live in 2 minutes

### Backend → Render

1. Import at [render.com](https://render.com)
2. Set Root Directory: `backend`
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add `GEMINI_API_KEY` env var

### Database → Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Copy `DATABASE_URL` → add to Render env vars
3. Run: `alembic upgrade head`

**Total cost: ₹0/month** 🎉

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS (custom dark enterprise theme)
- Recharts (all charts)
- Framer Motion (animations)
- Lucide React (icons)

**Backend**
- FastAPI (Python)
- SQLAlchemy + Alembic (ORM + migrations)
- Pydantic (validation)
- python-jose (JWT auth)
- Celery + Redis (background tasks)

**AI**
- Google Gemini 2.0 Flash (copilot + RAG)
- ChromaDB (vector database)
- Sentence Transformers (embeddings)

**Infrastructure**
- Vercel (frontend CDN)
- Render (backend hosting)
- Supabase (PostgreSQL)
- Docker Compose (local dev)
- GitHub Actions (CI/CD)

---

## 👤 User Roles

| Role | Access |
|------|--------|
| Admin | Everything |
| Mine Manager | Production, employees, approvals, AI reports |
| Safety Officer | Incidents, PPE, training, documents |
| Maintenance Engineer | Equipment, predictions, maintenance |
| HR | Attendance, leave, training, HR reports |

---

## 📊 Resume Impact

> *Designed and deployed an enterprise-grade AI platform with RAG-powered document intelligence, natural-language analytics, predictive maintenance simulation, JWT-based RBAC, Dockerized microservices, and CI/CD pipelines — enabling intelligent interaction with operational mining data for Central Coalfields Limited.*

---

Built with ❤️ for CCL | IntelliMine Copilot v2.4.1
