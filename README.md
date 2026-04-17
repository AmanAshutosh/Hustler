# Hustler 2.0 — Full-Stack Study & Job Hunt Tracker

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Now-success?style=for-the-badge&logo=render&logoColor=white)](https://hustler-km31.onrender.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)

**DevTrack** is a lightweight, all-in-one productivity suite designed for developers. It helps you manage the "Hustle" by tracking deep-work sessions, DSA progress, and project lifecycles in one unified dashboard.

---

## ✨ Features

- **⏱️ Deep Work Timer:** Integrated session tracker with pause/resume and audible alerts. Persists across browser refreshes.
- **📊 GitHub-Style Heatmap:** Visualize your consistency with a 52-week activity grid.
- **🧠 DSA Tracker:** Log problems (Neetcode 150 style) with category-wise progress bars.
- **🏗️ Project Manager:** CRUD for personal projects including tech stack tags and live/GitHub links.
- **📱 Social Ready:** Profile cards with auto-generated text for quick sharing to X (Twitter) and LinkedIn.
- **🔒 Local Database:** Uses `lowdb`—no external database setup required. Your data lives in a simple JSON file.

---

## 🛠️ Tech Stack

| Layer        | Technologies                                        |
| :----------- | :-------------------------------------------------- |
| **Frontend** | React 18, Vite, Zustand, React Router, Tailwind/CSS |
| **Backend**  | Node.js, Express                                    |
| **Database** | lowdb (JSON-based)                                  |
| **Auth**     | JWT, bcryptjs                                       |
| **Icons**    | Lucide-React, React Hot Toast                       |

---

## 🚀 Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/your-username/DevTrack.git](https://github.com/AmanAshutosh/DevTrack.git)
   cd DevTrack
   ```

📂 Project Structure
Hustler_2.0/
├── client/ # React Frontend (Vite)
│ ├── src/
│ │ ├── pages/ # Dashboard, Timer, Heatmap, DSA, Projects
│ │ ├── store/ # Zustand Auth Store
│ │ └── lib/ # Axios Instance
├── server/ # Node.js Backend
│ ├── db/ # lowdb setup
│ ├── routes/ # Auth, Sessions, DSA, Stats, User
│ └── index.js # Entry Point
└── package.json # Root scripts for "one-command" startup

📡 API Endpoints Summary
Method,Path,Description
POST,/api/auth/login,Secure JWT Authentication
GET,/api/stats/summary,Dashboard metrics
POST,/api/sessions/start,Start focus timer
GET,/api/dsa,Retrieve logged problems

📝 License
This project is open-source. Feel free to fork and build your own version of the Hustle.

Developed to help developers stay consistent By Ashutosh Aman.
