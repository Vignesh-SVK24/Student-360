# 🎓 Student 360 — College Student Information Management & Portfolio System

[![Live Demo](https://img.shields.io/badge/🌐_Live_Website-Student_360-0d4933?style=for-the-badge&labelColor=c1912a)](https://vignesh-svk24.github.io/Student-360/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

> 🌐 **Live Website Link**: [**https://vignesh-svk24.github.io/Student-360/**](https://vignesh-svk24.github.io/Student-360/)
>
> A modern, responsive, and glassmorphism-engineered **College Student Information Management & 360° Portfolio Intelligence System**. Bridges institutional faculty administration and student career self-advocacy through unified metrics, verified accomplishments, and liquid-smooth interactions.

---

## ✨ Key Features & Architectural Highlights

### 🏛️ Faculty Portal
- **Instant Student Search & Directory**: Dynamic filtering by register number, name, department, and academic year.
- **Student 360 Dossier**: Comprehensive multi-tab student profile covering particulars, semester-wise SGPA/CGPA trends, course-level attendance, and verified remarks.
- **Attendance Compliance Monitoring**: Visual alerts and status indicators for students below the statutory 75% attendance threshold.
- **Faculty Endorsements & Remarks**: Official mentorship feedback logged directly into student records.

### 🎒 Student Portal
- **Personalized 360 Dashboard**: Live summary cards with real-time attendance compliance gauge, CGPA breakdown, verified skill counts, and portfolio indicators.
- **Interactive Portfolio & Project Showcase**: Detailed project entries with GitHub repository links, live demos, technology stack badges, and CRUD drawers.
- **Verified Skills & Certifications**: Categorized skill inventory with proficiency progress rings, issuance metadata, and credential verification links.
- **Live Course-Level Attendance**: Color-coded breakdown with attended vs. total hours, leave metrics, and risk status indicators.
- **Floating Liquid Quick Menu**: Liquid-animated quick navigation bar pinned to the viewport for fluid single-tap page transitions.

### 💎 Premium Glassmorphism Design System
- **Layered Visual Depth**: Ambient animated glowing orbs beneath frosted glass surface panels (`backdrop-filter: blur()`).
- **High Contrast & Readability**: Balanced glass opacity tokens ensuring strict WCAG accessibility and text legibility.
- **Micro-interactions**: Spring-physics motion curves powered by Framer Motion for drawers, modals, tab indicators, and cards.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Vignesh-SVK24/Student-360.git
cd Student-360
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for production
```bash
npm run build
```

---

## 🔑 Demo Access Credentials

The application includes full mock service adapters for immediate demonstration:

| Role | Access URL | Identifier / Email | Password |
| :--- | :--- | :--- | :--- |
| **Faculty** | `/login/faculty` | `prof.sarah@college.edu` | `faculty123` |
| **Student** | `/login/student` | `23AIM001` | `student123` |

---

## 📂 Project Architecture

```
src/
├── components/
│   ├── layout/
│   │   └── AmbientBackground.tsx    # Dynamic mesh gradient & floating ambient orbs
│   ├── student/
│   │   └── StudentLayout.tsx        # Floating glass header & liquid quick menu
│   └── ui/                          # Reusable Glassmorphic Component Library
│       ├── GlassBadge.tsx
│       ├── GlassButton.tsx
│       ├── GlassCard.tsx
│       ├── GlassDrawer.tsx
│       ├── GlassInput.tsx
│       ├── GlassModal.tsx
│       └── GlassTabs.tsx
├── context/
│   └── StudentAuthContext.tsx       # Reactive student session management
├── mock/
│   └── data.ts                      # Realistic faculty & student records
├── pages/
│   ├── faculty/
│   │   ├── FacultyDashboard.tsx     # Student search, stats, & directory
│   │   └── FacultyStudentProfile.tsx# 360 faculty dossier view
│   ├── public/
│   │   ├── FacultyLogin.tsx         # Frosted glass faculty sign-in
│   │   ├── Landing.tsx              # Interactive dual portal portal hero
│   │   └── StudentLogin.tsx         # Liquid glass student sign-in
│   └── student/
│       ├── Achievements.tsx         # Hackathons, honors & awards
│       ├── Certificates.tsx         # Industry certifications & verify links
│       ├── Projects.tsx             # Interactive portfolio & repo showcases
│       ├── Remarks.tsx              # Faculty feedback & mentorship notes
│       ├── Skills.tsx               # Tech stack & proficiency ratings
│       ├── StudentAttendance.tsx    # Live course attendance calculations
│       ├── StudentDashboard.tsx     # Student 360 overview
│       ├── StudentProfile.tsx       # Student personal & academic bio
│       └── StudentSettings.tsx      # Privacy, theme & security preferences
├── services/
│   └── studentData.ts               # Clean service layer ready for backend API
├── types/
│   └── student.ts                   # Comprehensive TypeScript interfaces
├── App.tsx                          # Central React router configuration
├── index.css                        # Tailwind v4 glass tokens & typography
└── main.tsx                         # React 19 root bootstrap
```

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
