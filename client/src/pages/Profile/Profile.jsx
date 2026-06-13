// src/pages/Profile/Profile.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api.js';
import { useAuth } from '../../store/auth.js';
import toast from 'react-hot-toast';
import { Play } from 'lucide-react';
import './Profile.css';

const STACK_FS = [
  { label: 'JavaScript ES6+',  key: 'JavaScript (ES6+)', target: 40 },
  { label: 'React',            key: 'React',             target: 35 },
  { label: 'Node.js',          key: 'Node.js',           target: 30 },
  { label: 'System Design',    key: 'System Design',     target: 20 },
  { label: 'DBMS',             key: 'DBMS',              target: 10 },
  { label: 'OS',               key: 'Operating System',  target: 10 },
  { label: 'Networks',         key: 'Computer Networks', target: 10 },
];

const STACK_DA = [
  { label: 'SQL',         key: 'SQL',        target: 20 },
  { label: 'Python',      key: 'Python',     target: 25 },
  { label: 'Power BI',    key: 'Power BI',   target: 15 },
  { label: 'Excel',       key: 'Excel',      target: 10 },
  { label: 'Statistics',  key: 'Statistics', target: 15 },
];

const SOCIAL_LINKS = [
  { label: 'GitHub',   key: 'github_url' },
  { label: 'LeetCode', key: 'leetcode_url' },
  { label: 'GFG',      key: 'gfg_url' },
  { label: 'X',        key: 'x_url' },
  { label: 'LinkedIn', key: 'linkedin_url' },
];

const DAILY_SCHEDULE = [
  { time: '10:00 PM – 06:00 AM', label: 'Sleep',    desc: '8 hours — non-negotiable',              type: 'off' },
  { time: '06:00 – 10:00 AM',    label: 'Gym',      desc: 'Gym + travel + post-workout',           type: 'break', duration: '4h' },
  { time: '10:00 – 10:30 AM',    label: 'Breakfast',desc: 'Meal + freshen up',                     type: 'break' },
  { time: '10:30 AM – 01:00 PM', label: 'Block 1',  desc: 'Full Stack Dev — React / JS',           type: 'study', duration: '2.5h' },
  { time: '01:00 – 02:00 PM',    label: 'Lunch',    desc: 'Meal + rest',                           type: 'break' },
  { time: '02:00 – 05:00 PM',    label: 'Block 2',  desc: 'Backend / Node.js',                     type: 'study', duration: '3h' },
  { time: '05:00 – 05:30 PM',    label: 'Tea Break',desc: 'Tea + walk',                            type: 'break' },
  { time: '05:30 – 07:00 PM',    label: 'Block 3',  desc: 'Data Analytics — SQL / Power BI',       type: 'study', duration: '1.5h' },
  { time: '07:00 – 09:00 PM',    label: 'Projects', desc: 'Build projects + GitHub commits',       type: 'study', duration: '2h' },
  { time: '09:00 – 09:30 PM',    label: 'Dinner',   desc: 'Meal',                                  type: 'break' },
  { time: '09:30 – 10:00 PM',    label: 'LinkedIn', desc: 'LinkedIn + job applications',           type: 'prep' },
];

const MONTHLY_PLAN = [
  {
    month: 1, title: 'Foundation Rebuild', color: '#00BFFF',
    weeks: [
      { week: 1, subject: 'JavaScript (ES6+)', topic: 'ES6+, async/await, Promises, DOM' },
      { week: 2, subject: 'React',             topic: 'Hooks, Context, React Router, Vite' },
      { week: 3, subject: 'SQL',               topic: 'SELECT, JOINs, GROUP BY, subqueries' },
      { week: 4, subject: 'Excel',             topic: 'Pivot Tables, VLOOKUP, dashboards' },
    ],
  },
  {
    month: 2, title: 'Backend & SQL Advanced', color: '#FF4F00',
    weeks: [
      { week: 5, subject: 'Node.js', topic: 'Express, REST APIs, JWT Auth, Middleware' },
      { week: 6, subject: 'Node.js', topic: 'MongoDB/PostgreSQL, Mongoose/Prisma, CRUD' },
      { week: 7, subject: 'SQL',     topic: 'Window functions, CTEs, query optimization' },
      { week: 8, subject: 'Statistics', topic: 'Hypothesis testing, regression, A/B tests' },
    ],
  },
  {
    month: 3, title: 'Polish + Python for Data', color: '#432DD7',
    weeks: [
      { week: 9,  subject: 'Python',    topic: 'pandas, NumPy, data cleaning' },
      { week: 10, subject: 'Python',    topic: 'matplotlib, seaborn, EDA' },
      { week: 11, subject: 'Projects',  topic: 'Project 3: full stack or E-commerce clone' },
      { week: 12, subject: 'Power BI',  topic: 'Power Query, DAX basics, dashboards' },
    ],
  },
  {
    month: 4, title: 'Interview Mode + Power BI', color: '#00FF7F',
    weeks: [
      { week: 13, subject: 'DSA',      topic: 'Arrays, Linked Lists, Stacks, Binary Search' },
      { week: 14, subject: 'DSA',      topic: 'Trees, Graphs, Dynamic Programming basics' },
      { week: 15, subject: 'Power BI', topic: 'Advanced DAX, time intelligence, publish' },
      { week: 16, subject: 'Projects', topic: 'DA portfolio project + job applications' },
    ],
  },
  {
    month: 5, title: 'First Offer + Tableau', color: '#FDC800',
    weeks: [
      { week: 17, subject: 'Tableau',   topic: 'Charts, LOD, dashboards, Tableau Public' },
      { week: 18, subject: 'Projects',  topic: 'Final FS portfolio project + 50+ applications' },
      { week: 19, subject: 'Interviews',topic: 'Mock interviews, salary negotiation, offers' },
      { week: 20, subject: 'Interviews',topic: 'Continue applying, evaluate and accept offer' },
    ],
  },
  {
    month: 6, title: 'Employed + Growth', color: '#FF4081',
    weeks: [
      { week: 21, subject: 'Work',        topic: 'Join company + onboard' },
      { week: 22, subject: 'Open Source', topic: 'Contribute to OSS + build AI projects' },
      { week: 23, subject: 'DA Course',   topic: 'Complete remaining DA modules on weekends' },
      { week: 24, subject: 'Growth',      topic: 'Plan for 12-month salary jump' },
    ],
  },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser }   = useAuth();
  const [summary, setSummary]   = useState(null);
  const [userData, setUserData] = useState(null);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({
    name: '', github_url: '', leetcode_url: '',
    gfg_url: '', x_url: '', linkedin_url: '',
  });

  useEffect(() => {
    Promise.all([api.get('/stats/summary'), api.get('/user/me')]).then(([s, u]) => {
      setSummary(s.data);
      setUserData(u.data);
      setForm({
        name:         u.data.name         || '',
        github_url:   u.data.github_url   || '',
        leetcode_url: u.data.leetcode_url || '',
        gfg_url:      u.data.gfg_url      || '',
        x_url:        u.data.x_url        || '',
        linkedin_url: u.data.linkedin_url || '',
      });
    });
  }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch('/user/me', form);
      setUserData(data);
      setUser({ ...user, name: data.name });
      setEditing(false);
      toast.success('Profile saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const daysSince = userData?.created_at
    ? Math.floor((Date.now() - new Date(userData.created_at)) / 86400000) + 1
    : 1;

  const shareText =
    `🚀 Day ${daysSince} of my dev grind — HUSTLER update\n\n` +
    `📚 ${summary?.totalHours || 0}h of focused study\n` +
    `⚡ ${summary?.dsaTotal || 0}/150 Neetcode problems solved\n` +
    `🔥 ${summary?.streak || 0} day streak\n` +
    `🗂 ${summary?.projectsTotal || 0} projects built\n\n` +
    `Grinding toward Full-Stack Dev + Data Analytics roles 💪\n\n` +
    `#100DaysOfCode #FullStack #DataAnalytics #JavaScript #React #NodeJS #SQL #PowerBI`;

  const shareX  = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  const shareLI = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(form.github_url || 'https://github.com/AmanAshutosh')}`, '_blank');

  const subMap = {};
  (summary?.subjectHours || []).forEach(s => { subMap[s.subject] = s.hours; });

  const activeLinks = SOCIAL_LINKS.filter(l => userData?.[l.key]);

  return (
    <div className="profile-page">
      <div className="page-header">
        <h2>Profile</h2>
        <p>Your portfolio card — share your progress with the world.</p>
      </div>

      {/* Portfolio card */}
      <div className="portfolio-card">
        <div className="portfolio-top">
          <div className="portfolio-identity">
            <div className="avatar">{user?.avatarInitials || 'AA'}</div>
            <div>
              <div className="portfolio-name">{userData?.name || user?.name}</div>
              <div className="portfolio-role">Full-Stack Dev + Data Analytics · Day {daysSince}</div>
            </div>
          </div>
          <button className="edit-btn" onClick={() => setEditing(e => !e)}>
            {editing ? 'Cancel' : 'Edit profile'}
          </button>
        </div>

        {/* Stats */}
        <div className="pstat-grid">
          <div className="pstat">
            <div className="pstat-n">{summary?.totalHours || 0}h</div>
            <div className="pstat-l">Studied</div>
          </div>
          <div className="pstat">
            <div className="pstat-n">{summary?.dsaTotal || 0}/150</div>
            <div className="pstat-l">DSA done</div>
          </div>
          <div className="pstat">
            <div className="pstat-n">{summary?.streak || 0}🔥</div>
            <div className="pstat-l">Streak</div>
          </div>
        </div>

        {/* Links or edit form */}
        {!editing ? (
          <>
            <div className="link-chips">
              {activeLinks.length > 0
                ? activeLinks.map(l => (
                    <a key={l.key} href={userData[l.key]} target="_blank" rel="noreferrer" className="link-chip">
                      {l.label} ↗
                    </a>
                  ))
                : <span className="no-links">No links added. Click "Edit profile" to add your social links.</span>
              }
            </div>

            <div className="share-row">
              <button className="share-btn share-x" onClick={shareX}>Share to X</button>
              <button className="share-btn share-li" onClick={shareLI}>Share to LinkedIn</button>
            </div>
          </>
        ) : (
          <div className="edit-form">
            <div className="edit-field">
              <label className="field-label">Name</label>
              <input value={form.name} onChange={set('name')} placeholder="Your full name" />
            </div>
            {SOCIAL_LINKS.map(l => (
              <div className="edit-field" key={l.key}>
                <label className="field-label">{l.label} URL</label>
                <input value={form[l.key]} onChange={set(l.key)} placeholder={`https://...`} />
              </div>
            ))}
            <div className="edit-actions">
              <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button className="btn btn-sm" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Share preview */}
      <div className="card">
        <div className="sec-title">Share preview</div>
        <pre className="share-preview">{shareText}</pre>
      </div>

      {/* Daily timetable */}
      <div className="card">
        <div className="sec-title">Daily Schedule — 11am to 10pm</div>
        <div className="tt-subtitle">Wake up 6am · Gym + breakfast · Free from 11am · ~7h study/day</div>
        <div className="tt-daily">
          {DAILY_SCHEDULE.map((slot, i) => (
            <div key={i} className={`tt-slot tt-slot-${slot.type}`}>
              <div className="tt-time">{slot.time}</div>
              <div className="tt-info">
                <span className="tt-label">{slot.label}</span>
                <span className="tt-desc">{slot.desc}</span>
              </div>
              {slot.duration && <span className="tt-dur">{slot.duration}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 6-Month Plan */}
      <div className="card">
        <div className="sec-title">6-Month Career Plan — Week by Week</div>
        <div className="tt-subtitle">FS + DA running in parallel · Sat = projects + revision · Click Study to start a session</div>
        {MONTHLY_PLAN.map(month => (
          <div key={month.month} className="tt-month">
            <div className="tt-month-header" style={{ borderColor: month.color }}>
              <span className="tt-month-num" style={{ color: month.color }}>Month {month.month}</span>
              <span className="tt-month-title">{month.title}</span>
            </div>
            {month.weeks.map(w => (
              <div key={w.week} className="tt-week-row">
                <div className="tt-week-meta">
                  <span className="tt-week-badge">Week {w.week}</span>
                  <span className="tt-week-subj" style={{ color: month.color }}>{w.subject}</span>
                </div>
                <div className="tt-week-topic">{w.topic}</div>
                <button
                  className="tt-study-btn"
                  onClick={() => navigate('/timer', { state: { subject: w.subject, topic: w.topic } })}
                >
                  <Play size={10} /> Study
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Stack progress */}
      <div className="card">
        <div className="sec-title">Full Stack Mastery</div>
        {STACK_FS.map(s => {
          const hours = subMap[s.key] || 0;
          const pct   = Math.min(100, Math.round((hours / s.target) * 100));
          return (
            <div className="bar-row" key={s.label}>
              <div className="bar-label">
                <span>{s.label}</span>
                <span>{hours}h / {s.target}h · {pct}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
              </div>
            </div>
          );
        })}
        {(() => {
          const dsa = summary?.dsaTotal || 0;
          const pct = Math.round((dsa / 150) * 100);
          return (
            <div className="bar-row" style={{ marginTop: 8 }}>
              <div className="bar-label">
                <span>DSA — Neetcode 150</span>
                <span>{dsa}/150 · {pct}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%`, background: 'var(--purple)' }} />
              </div>
            </div>
          );
        })()}
      </div>

      {/* Data Analytics Stack */}
      <div className="card">
        <div className="sec-title">Data Analytics Mastery</div>
        {STACK_DA.map(s => {
          const hours = subMap[s.key] || 0;
          const pct   = Math.min(100, Math.round((hours / s.target) * 100));
          return (
            <div className="bar-row" key={s.label}>
              <div className="bar-label">
                <span>{s.label}</span>
                <span>{hours}h / {s.target}h · {pct}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%`, background: '#f59e0b' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
