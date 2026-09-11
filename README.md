# VentureNest - Decoupled Multi-Portal Platform

> **System Watermarks & Attribution**
> - **Product**: VentureNest (Intelligent Startup Workspace & Incubator Platform)
> - **Version Tag**: `v1.0.0`
> - **Author Watermark**: `Made by DEX`
> - **Source Brief Watermark**: `Prepared from Project VISTA source brief`
> - **Architecture Watermark**: `Decoupled Micro-Frontend & Bridge API Framework`
> - **Design System Watermark**: `Ink/Navy (#0B192C), Teal (#008B8B), Restrained Gold (#D4AF37)`

---

## 1. Project Architecture & Directory Structure

VentureNest is built as **3 independently operated applications** connected via a central **Backend Bridge API**, **Shared Database**, and **AI Chatbot Service**:

```
Venturenest-automation/
├── admin_dashboard/         # Web App 1: Standalone Desktop Web Admin Dashboard (Port 3002)
│   └── VentureNest_AdminDashboard_Roadmap_v1.0.pdf
│
├── student_incubator_app/   # Mobile App 1: Standalone Student/Incubator Mobile App (Port 3000)
│   └── VentureNest_StudentApp_Roadmap_v1.0.pdf
│
├── mentor_app/              # Mobile App 2: Standalone Mentors Connection Mobile App (Port 3001)
│   └── VentureNest_MentorApp_Roadmap_v1.0.pdf
│
├── backend/                 # Central Bridge API Gateway & Services (Port 8000)
│   └── VentureNest_Backend_Roadmap_and_MentorTracking_v1.0.pdf
│
├── ai_chatbot/              # AI Service & Conversational Assistant (Port 8001)
│
├── database/                # PostgreSQL Schemas, Migrations & Seed Data
│   ├── migrations/001_initial_schema.sql
│   └── seeds/seed_data.sql
│
└── Documentation packages/  # Original Product Documentation PDFs
```

---

## 2. Currently Built & Operating Capabilities

### A. Admin Dashboard (`admin_dashboard/`) — Desktop Web Application (Port 3002)
- **Desktop Grid Viewport**: Designed specifically for desktop screens with a left sidebar, header breadcrumbs, and 12-column grid metrics.
- **System Overview**: Live counters for total platform users, active projects, document submissions, open mentor requests, and bridge connection state.
- **User & Role Matrix**: RBAC management allowing admins to view users and update permissions (`admin`, `student_incubator`, `mentor`).
- **AI Token Spending & Quotas**: Real-time token consumption progress bar and safety cap enforcement.
- **Immutable Audit Trail**: Event trail listing security, authentication, and document approval events.

### B. Student / Incubator App (`student_incubator_app/`) — Mobile Application (Port 3000)
- **Mobile Viewport & Bottom Navigation**: Touch-first UI featuring a mobile bottom tab bar (`Home`, `Vault`, `Intake`, `Studio`, `Finance`, `Mentors`).
- **Document Submission Vault**: Upload pitch decks, venture briefs, and PDFs.
- **Guided Project Intake**: Capture startup problem, target audience, and geography.
- **Artifact Studio with Approval Workflow**: View versioned business plans with explicit user approval buttons (`Approve Version`, `Request AI Revision`).
- **Financial Runway Calculator**: Interactive touch sliders for revenue, costs, and cash reserves with real-time runway calculation.
- **Mobile AI Assistant Drawer**: Slide-over AI co-founder assistant for drafting & advice.

### C. Mentors App (`mentor_app/`) — Mobile Application (Port 3001)
- **Mobile Viewport & Bottom Navigation**: Touch-first UI featuring a mobile bottom tab bar (`Directory`, `Help Feed`, `Reviews`, `Profile`).
- **Assigned Incubatees Directory**: View assigned student startups and submitted pitch decks.
- **Document Reviewer & Feedback**: 1-tap advisory status tagging (`Tag: Approved`, `Tag: Needs Revision`).
- **AI Document Summarizer**: Auto-generates key takeaways and risk highlights for mentors.
- **Help Request Queue & Direct Chat**: Resolve student help calls and communicate in Q&A threads.

### D. Central Backend Bridge (`backend/`) — Port 8000
- **FastAPI Central API**: Connects Web Admin, Student App, and Mentors App to shared PostgreSQL / SQLite database records.
- **Routers**: `/api/auth`, `/api/admin/*`, `/api/student-app/*`, `/api/mentor-app/*`, `/api/artifacts/*`, `/health`.

### E. AI Chatbot Service (`ai_chatbot/`) — Port 8001
- **FastAPI AI Microservice**: Structured JSON generator for business plans, SWOT analysis, and mentor document summaries.
- **Conversational Assistant**: Powers the mobile slide-over AI advisor.

### F. Database Layer (`database/`)
- PostgreSQL DDL schema (`001_initial_schema.sql`) and seed data (`seed_data.sql`).

---

## 3. Need to Do (Future Roadmap & Next Development Phase)

Below is the detailed list of features planned for the next development iteration:

### 1. Mentor-Student Interaction Tracking Panel (Backend & Admin Web Dashboard)
- [ ] **Backend Tracking API Endpoint**: Implement `GET /api/admin/mentor-student-interactions` to aggregate live mentorship engagement metrics.
- [ ] **Metrics Tracked**:
  - `total_interacting_students`: Total count of unique students engaged with mentors.
  - `total_active_mentors`: Total count of active mentors providing feedback.
  - `active_pairs_count`: Count of active Student-Mentor pairing relationships.
- [ ] **Interaction Data Table Fields**:
  - **Student Name** (e.g., Alex Rivera)
  - **Mentor Name** (e.g., Dr. Sarah Chen)
  - **Project / Venture Name** (e.g., EcoPack AI)
  - **Advisory Message Count** (Total Q&A messages exchanged)
  - **Last Interaction Timestamp**
  - **Interaction Status** (`Active`, `Pending Mentor Response`, `Resolved`)
- [ ] **Admin Dashboard UI Panel**: Render an interactive table under "Incubator Analytics" with mentor re-assignment controls and CSV/PDF export.

### 2. Student Mobile App Enhancements (`student_incubator_app/`)
- [ ] **Mobile Document Scanner**: Integrated camera scanner to capture paper pitch deck handouts directly into PDF format.
- [ ] **Offline Draft Sync**: Edit business plan assumptions offline with automatic sync upon reconnecting.
- [ ] **Push Notifications**: Receive instant mobile alerts when a mentor reviews a deck or leaves feedback.
- [ ] **1-on-1 Advisory Scheduler**: Book live video call slots directly with assigned mentors.

### 3. Mentors Mobile App Enhancements (`mentor_app/`)
- [ ] **Voice-to-Text Advisory Notes**: Dictate feedback while inspecting student decks on mobile.
- [ ] **Automated AI Risk Detector**: Highlight financial & market risk flags before mentor review.
- [ ] **Mentor Office Hours Calendar**: Set available advisory booking windows.
- [ ] **Multi-Mentor Panel Review**: Co-review student pitch decks with co-mentors.

---

## 4. Quick Start & Execution Guide

### Start Backend Bridge (Port 8000)
```bash
cd backend
pip install -r requirements.txt
python -m app.main
```

### Start AI Service (Port 8001)
```bash
cd ai_chatbot
pip install -r requirements.txt
python -m app.main
```

### Start Admin Web Dashboard (Port 3002)
```bash
cd admin_dashboard
npm install
npm run dev
```

### Start Student / Incubator Mobile App (Port 3000)
```bash
cd student_incubator_app
npm install
npm run dev
```

### Start Mentors Connection Mobile App (Port 3001)
```bash
cd mentor_app
npm install
npm run dev
```
