// src/pages/Roadmap/Roadmap.jsx
import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import api from '../../lib/api.js';
import toast from 'react-hot-toast';
import './Roadmap.css';

const MONTHS = [
  {
    num: 1, title: 'Foundation Rebuild',
    color: '#00BFFF', bg: 'rgba(0,191,255,0.10)',
    goal: '1 deployed React project live',
    milestones: [
      'HTML/CSS/JS refresh (ES6+, async/await)',
      'React: hooks, context, React Router, Vite',
      'Git + GitHub daily commits established',
      'DA: Excel + SQL basics',
      'Project 1: React portfolio/clone app deployed on Netlify/Vercel',
    ],
  },
  {
    num: 2, title: 'Backend & Databases',
    color: '#FF4F00', bg: 'rgba(255,79,0,0.10)',
    goal: '1 full stack project on GitHub + deployed',
    milestones: [
      'Node.js + Express.js mastered',
      'REST APIs — CRUD, middleware, JWT auth',
      'MongoDB + Mongoose (or PostgreSQL + Prisma)',
      'DA: SQL queries, joins, Power BI dashboards',
      'Project 2: Full stack MERN app with auth + CRUD',
    ],
  },
  {
    num: 3, title: 'Polish + Applications',
    color: '#432DD7', bg: 'rgba(67,45,215,0.10)',
    goal: 'Resume ready, 3 projects live, actively interviewing',
    milestones: [
      'AWS basics / Render / Railway deployment',
      'Project 3: E-commerce or SaaS clone',
      'Resume + LinkedIn optimization complete',
      'Applying 5–10 applications/day',
      'Mock interviews: DSA basics, system design intro',
      'DA: Power BI project (1 dashboard for resume)',
    ],
  },
  {
    num: 4, title: 'Interview Mode',
    color: '#00FF7F', bg: 'rgba(0,255,127,0.10)',
    goal: 'First job offer received',
    milestones: [
      'DSA: Arrays, strings, linked lists (LeetCode easy/medium)',
      'System Design basics studied',
      'TypeScript fundamentals learned',
      'DA: Python basics — pandas, matplotlib',
      '50+ company applications submitted',
    ],
  },
  {
    num: 5, title: 'First Offer',
    color: '#FDC800', bg: 'rgba(253,200,0,0.10)',
    goal: '₹5–6.5 LPA Full Stack role accepted',
    milestones: [
      'Continuing interview process actively',
      'Salary negotiated successfully',
      'Target: ₹5–6.5 LPA Full Stack role',
      'Remaining DA course modules completed',
    ],
  },
  {
    num: 6, title: 'Employed + Growth',
    color: '#FF4081', bg: 'rgba(255,64,129,0.10)',
    goal: 'Settled in job, planning 12-month raise',
    milestones: [
      'Joined company',
      'DA course completed on weekends',
      'Open source contributions started',
      'AI-integrated projects built',
      'Plan for salary jump at 12 months created',
    ],
  },
];

// Roadmap started June 2026 — adjust if different
const START_DATE = new Date('2026-06-01');
function getCurrentMonth() {
  const diff   = Date.now() - START_DATE.getTime();
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  return Math.max(1, Math.min(6, months + 1));
}

export default function Roadmap() {
  const [progress, setProgress] = useState({});
  const [loading,  setLoading]  = useState(true);
  const currentMonth = getCurrentMonth();

  useEffect(() => {
    api.get('/roadmap/progress')
      .then(r => setProgress(r.data || {}))
      .catch(() => toast.error('Could not load roadmap'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (key, current) => {
    const val = !current;
    setProgress(p => ({ ...p, [key]: val }));
    try {
      await api.patch('/roadmap/progress', { key, value: val });
    } catch {
      toast.error('Failed to save');
      setProgress(p => ({ ...p, [key]: current }));
    }
  };

  const total      = MONTHS.reduce((s, m) => s + m.milestones.length, 0);
  const done       = Object.values(progress).filter(Boolean).length;
  const overallPct = Math.round((done / total) * 100);

  if (loading) return (
    <div className="rm-page">
      <div className="rm-skeleton-grid">
        {[1,2,3,4,5,6].map(i => <div key={i} className="rm-skeleton-card" />)}
      </div>
    </div>
  );

  return (
    <div className="rm-page">

      {/* Page header */}
      <div className="page-header rm-header">
        <div>
          <h2>6-Month Roadmap</h2>
          <p>Track milestones toward your first ₹5–6.5 LPA offer</p>
        </div>
        <div className="rm-overall-stat">
          <span className="rm-overall-pct">{overallPct}%</span>
          <span className="rm-overall-sub">complete</span>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="rm-overall-bar">
        <div className="rm-bar-row">
          <span className="rm-bar-lbl"><Trophy size={13} /> {done} / {total} milestones done</span>
          <span className="rm-bar-val">{overallPct}%</span>
        </div>
        <div className="rm-prog-track">
          <div className="rm-prog-fill" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      {/* Month cards grid */}
      <div className="rm-grid">
        {MONTHS.map(m => {
          const mk     = `m${m.num}`;
          const isCurr = m.num === currentMonth;
          const isPast = m.num < currentMonth;
          const mDone  = m.milestones.filter((_, i) => progress[`${mk}_${i}`]).length;
          const mPct   = Math.round((mDone / m.milestones.length) * 100);

          return (
            <div
              key={m.num}
              className={`rm-month${isCurr ? ' rm-current' : ''}${isPast ? ' rm-past' : ''}`}
              style={{ '--mc': m.color, '--mb': m.bg }}
            >
              {/* Month header */}
              <div className="rm-month-head">
                <div className="rm-month-badge">M{m.num}</div>
                <div className="rm-month-info">
                  <span className="rm-month-title">{m.title}</span>
                  {isCurr && <span className="rm-curr-badge">▶ Current</span>}
                </div>
                <span className="rm-month-pct">{mPct}%</span>
              </div>

              {/* Month progress bar */}
              <div className="rm-mbar-track">
                <div className="rm-mbar-fill" style={{ width: `${mPct}%`, background: m.color }} />
              </div>

              {/* Goal */}
              <div className="rm-goal">
                <span className="rm-goal-label">Goal</span>
                {m.goal}
              </div>

              {/* Milestones */}
              <ul className="rm-milestones">
                {m.milestones.map((ms, i) => {
                  const key   = `${mk}_${i}`;
                  const isDone = !!progress[key];
                  return (
                    <li key={i} className={`rm-ms${isDone ? ' rm-ms-done' : ''}`}>
                      <button className="rm-ms-btn" onClick={() => toggle(key, isDone)}>
                        {isDone
                          ? <CheckCircle2 size={14} style={{ color: m.color }} />
                          : <Circle size={14} style={{ color: 'var(--border-2)' }} />
                        }
                      </button>
                      <span className="rm-ms-text">{ms}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
