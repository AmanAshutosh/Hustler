# DevTrack — Full-Stack Study & Job Hunt Tracker

React + Node.js + lowdb (JSON file). No Docker. No Prisma. Just run it.

## Stack

- **Frontend**: React 18 + Vite + Zustand + React Router + Axios + lucide-react + react-hot-toast
- **Backend**: Node.js + Express + lowdb v1 (JSON file DB)
- **Auth**: JWT (bcryptjs for hashing)
- **No external DB needed** — `devtrack.json` is created automatically in `/server` on first run

## Setup

```bash
# 1. Install all dependencies (client + server)
npm run install:all

# 2. Start both servers concurrently
npm run dev
```

- Frontend → http://localhost:5173
- Backend  → http://localhost:3001

The database file `server/devtrack.json` is created automatically on first run. No setup needed.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server |
| `npm run dev:client` | Start frontend only |
| `npm run dev:server` | Start backend only |
| `npm run install:all` | Install dependencies for both client and server |

## Project Structure

```
Hustler_2.0/
├── client/                         ← React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx   ← Stats, subject bars, roadmap
│   │   │   │   └── Dashboard.css
│   │   │   ├── Timer/
│   │   │   │   ├── Timer.jsx       ← Session timer with alarm + pause/resume
│   │   │   │   └── Timer.css
│   │   │   ├── Heatmap/
│   │   │   │   ├── Heatmap.jsx     ← GitHub-style 52-week heatmap
│   │   │   │   └── Heatmap.css
│   │   │   ├── DSATracker/
│   │   │   │   ├── DSATracker.jsx  ← Neetcode 150 tracker with category progress
│   │   │   │   └── DSATracker.css
│   │   │   ├── Projects/
│   │   │   │   ├── Projects.jsx    ← Projects CRUD
│   │   │   │   └── Projects.css
│   │   │   ├── Profile/
│   │   │   │   ├── Profile.jsx     ← Portfolio card + social share
│   │   │   │   └── Profile.css
│   │   │   ├── Login/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Login.css
│   │   │   ├── Register/
│   │   │   │   ├── Register.jsx
│   │   │   │   └── Register.css
│   │   │   └── Subjects/
│   │   │       ├── Subjects.jsx
│   │   │       └── Subjects.css
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.jsx      ← Sidebar + nav wrapper
│   │   │   │   └── Layout.css
│   │   │   └── Footer/
│   │   │       ├── Footer.jsx
│   │   │       └── Footer.css
│   │   ├── store/
│   │   │   └── auth.js             ← Zustand auth store
│   │   ├── lib/
│   │   │   └── api.js              ← Axios instance with auth header
│   │   ├── App.jsx                 ← Routes + auth guard
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   │   └── manifest.json
│   ├── index.html
│   ├── vite.config.js              ← Dev proxy → server:3001
│   └── package.json
│
├── server/                         ← Node.js backend (Express)
│   ├── db/
│   │   └── database.js             ← lowdb setup (JSON collections auto-created)
│   ├── middleware/
│   │   └── auth.js                 ← JWT verify middleware
│   ├── routes/
│   │   ├── auth.js                 ← POST /register, /login
│   │   ├── sessions.js             ← Timer sessions CRUD
│   │   ├── dsa.js                  ← DSA problem log
│   │   ├── projects.js             ← Projects CRUD
│   │   ├── stats.js                ← Summary, heatmap, weekly
│   │   └── user.js                 ← Profile get/update
│   ├── index.js                    ← Express entry point
│   ├── devtrack.json               ← Auto-generated JSON database file
│   └── package.json
│
├── package.json                    ← Root scripts (install:all, dev)
└── README.md
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login → returns JWT |
| GET  | /api/health | Server health check |
| POST | /api/sessions/start | Start timer session |
| POST | /api/sessions/:id/end | End session, log duration |
| GET  | /api/sessions/active | Get current active session |
| GET  | /api/sessions | List past sessions |
| POST | /api/dsa | Log solved DSA problem |
| GET  | /api/dsa | List all DSA problems |
| DELETE | /api/dsa/:id | Remove problem |
| GET  | /api/projects | List projects |
| POST | /api/projects | Add project |
| PATCH | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Remove project |
| GET  | /api/stats/summary | Dashboard numbers |
| GET  | /api/stats/heatmap | 365-day heatmap data |
| GET  | /api/stats/weekly | Last 7 days hours |
| GET  | /api/user/me | Get profile |
| PATCH | /api/user/me | Update profile + social links |

## Features

- **Session Timer** — Start/pause/resume/end. Alarm sound on finish. Persists across page refresh.
- **Session log** — Every session logged with subject, topic, duration.
- **GitHub-style heatmap** — 52-week grid of daily study hours.
- **DSA Tracker** — Log Neetcode 150 problems by category. Progress bars per category.
- **Projects** — Track status (planned/in-progress/completed), tech stack, GitHub + live links.
- **Subjects** — Track and manage subjects.
- **Profile + Share** — Portfolio card with auto-generated share text for X and LinkedIn.
- **Dashboard** — Total hours, streak, DSA count, subject bars, roadmap progress.

## Customise

Change the JWT secret in `server/middleware/auth.js` (or set a `JWT_SECRET` env variable) before deploying.
