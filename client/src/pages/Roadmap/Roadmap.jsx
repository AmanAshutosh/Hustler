// src/pages/Roadmap/Roadmap.jsx
import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import api from '../../lib/api.js';
import toast from 'react-hot-toast';
import './Roadmap.css';

const MONTHS_FS = [
  {
    num: 1, title: 'Foundation Rebuild',
    color: '#00BFFF', bg: 'rgba(0,191,255,0.10)',
    goal: '1 deployed React project live',
    milestones: [
      'HTML/CSS/JS refresh (ES6+, async/await)',
      'React: hooks, context, React Router, Vite',
      'Git + GitHub daily commits established',
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
    ],
  },
  {
    num: 6, title: 'Employed + Growth',
    color: '#FF4081', bg: 'rgba(255,64,129,0.10)',
    goal: 'Settled in job, planning 12-month raise',
    milestones: [
      'Joined company',
      'Open source contributions started',
      'AI-integrated projects built',
      'Plan for salary jump at 12 months',
    ],
  },
];

const MONTHS_DA = [
  {
    num: 1, title: 'Excel + SQL Basics',
    color: '#00BFFF', bg: 'rgba(0,191,255,0.10)',
    goal: 'Excel fundamentals + SQL basics mastered',
    milestones: [
      'Excel: formulas, Pivot Tables, VLOOKUP/INDEX-MATCH',
      'Excel: charts, conditional formatting, dashboards',
      'SQL: SELECT, JOIN, GROUP BY, subqueries',
      'SQL: Aggregate functions, indexes, transactions',
    ],
  },
  {
    num: 2, title: 'SQL Advanced + Statistics',
    color: '#FF4F00', bg: 'rgba(255,79,0,0.10)',
    goal: 'Advanced SQL + statistics foundations',
    milestones: [
      'SQL: Window functions (ROW_NUMBER, RANK, LAG/LEAD)',
      'SQL: CTEs, query optimization, EXPLAIN',
      'Statistics: Mean, median, mode, standard deviation',
      'Statistics: Hypothesis testing, A/B testing, distributions',
    ],
  },
  {
    num: 3, title: 'Python for Data',
    color: '#432DD7', bg: 'rgba(67,45,215,0.10)',
    goal: 'Python data analysis pipeline complete',
    milestones: [
      'Python basics: lists, dicts, functions, Jupyter',
      'NumPy arrays + Pandas DataFrames',
      'Data cleaning: handling nulls, duplicates, outliers',
      'Matplotlib + Seaborn visualizations',
    ],
  },
  {
    num: 4, title: 'Power BI + Data Viz',
    color: '#00FF7F', bg: 'rgba(0,255,127,0.10)',
    goal: '1 published Power BI dashboard on resume',
    milestones: [
      'Power BI: connect data, Power Query transformations',
      'Power BI: DAX basics (CALCULATE, FILTER, SUMX)',
      'Power BI: relationships, drill-through, slicers',
      'DA Project: end-to-end dashboard for portfolio',
    ],
  },
  {
    num: 5, title: 'Tableau + Portfolio',
    color: '#FDC800', bg: 'rgba(253,200,0,0.10)',
    goal: '2 portfolio DA projects published',
    milestones: [
      'Tableau: basic charts, calculated fields, filters',
      'Tableau: LOD expressions, dashboard design',
      'Portfolio Project 1: SQL + Python + Power BI end-to-end',
      'Portfolio Project 2: Tableau dashboard published to Tableau Public',
    ],
  },
  {
    num: 6, title: 'DA Job Hunt + First Role',
    color: '#FF4081', bg: 'rgba(255,64,129,0.10)',
    goal: 'First Data Analyst role landed',
    milestones: [
      'Resume + LinkedIn optimized for DA roles',
      'Interview prep: SQL problems, statistics questions, case studies',
      '50+ DA job applications submitted',
      'First Data Analyst role accepted',
    ],
  },
];

const START_DATE = new Date('2026-06-01');
function getCurrentMonth() {
  const diff = Date.now() - START_DATE.getTime();
  return Math.max(1, Math.min(6, Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)) + 1));
}

export default function Roadmap() {
  const [progress, setProgress] = useState({});
  const [loading,  setLoading]  = useState(true);
  const [path, setPath] = useState('fs'); // 'fs' | 'da'
  const currentMonth = getCurrentMonth();

  const MONTHS = path === 'fs' ? MONTHS_FS : MONTHS_DA;
  const keyPrefix = path; // 'fs' or 'da'

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
  const done       = MONTHS.reduce((s, m) => s + m.milestones.filter((_, i) => progress[`${keyPrefix}_m${m.num}_${i}`]).length, 0);
  const overallPct = total ? Math.round((done / total) * 100) : 0;

  if (loading) return (
    <div className="rm-page">
      <div className="rm-skeleton-grid">
        {[1,2,3,4,5,6].map(i => <div key={i} className="rm-skeleton-card" />)}
      </div>
    </div>
  );

  return (
    <div className="rm-page">
      <div className="page-header rm-header">
        <div>
          <h2>6-Month Roadmap</h2>
          <p>Track milestones toward your first job offer</p>
        </div>
        <div className="rm-overall-stat">
          <span className="rm-overall-pct">{overallPct}%</span>
          <span className="rm-overall-sub">complete</span>
        </div>
      </div>

      {/* Path selector */}
      <div className="rm-path-tabs">
        <button
          className={`rm-path-btn${path === 'fs' ? ' rm-path-active' : ''}`}
          style={path === 'fs' ? { '--pc': '#00BFFF' } : {}}
          onClick={() => setPath('fs')}
        >
          Full Stack Dev
        </button>
        <button
          className={`rm-path-btn${path === 'da' ? ' rm-path-active' : ''}`}
          style={path === 'da' ? { '--pc': '#00FF7F' } : {}}
          onClick={() => setPath('da')}
        >
          Data Analytics
        </button>
      </div>

      {/* Overall bar */}
      <div className="rm-overall-bar">
        <div className="rm-bar-row">
          <span className="rm-bar-lbl"><Trophy size={13} /> {done} / {total} milestones — {path === 'fs' ? 'Full Stack' : 'Data Analytics'}</span>
          <span className="rm-bar-val">{overallPct}%</span>
        </div>
        <div className="rm-prog-track">
          <div className="rm-prog-fill" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      {/* Month cards */}
      <div className="rm-grid">
        {MONTHS.map(m => {
          const mk     = `${keyPrefix}_m${m.num}`;
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
              <div className="rm-month-head">
                <div className="rm-month-badge">M{m.num}</div>
                <div className="rm-month-info">
                  <span className="rm-month-title">{m.title}</span>
                  {isCurr && <span className="rm-curr-badge">▶ Current</span>}
                </div>
                <span className="rm-month-pct">{mPct}%</span>
              </div>
              <div className="rm-mbar-track">
                <div className="rm-mbar-fill" style={{ width: `${mPct}%`, background: m.color }} />
              </div>
              <div className="rm-goal">
                <span className="rm-goal-label">Goal</span>
                {m.goal}
              </div>
              <ul className="rm-milestones">
                {m.milestones.map((ms, i) => {
                  const key    = `${mk}_${i}`;
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
