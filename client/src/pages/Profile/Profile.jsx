// src/pages/Profile/Profile.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api.js';
import { useAuth } from '../../store/auth.js';
import toast from 'react-hot-toast';
import { Play } from 'lucide-react';
import './Profile.css';

const STACK = [
  { label: 'JavaScript ES6+', key: 'JavaScript (ES6+)', target: 40 },
  { label: 'React',           key: 'React',             target: 35 },
  { label: 'Node.js',         key: 'Node.js',           target: 30 },
  { label: 'System Design',   key: 'System Design',     target: 20 },
  { label: 'DBMS / SQL',      key: 'DBMS / SQL',        target: 15 },
  { label: 'OS / CN',         key: 'OS / CN',           target: 15 },
];

const SOCIAL_LINKS = [
  { label: 'GitHub',   key: 'github_url' },
  { label: 'LeetCode', key: 'leetcode_url' },
  { label: 'GFG',      key: 'gfg_url' },
  { label: 'X',        key: 'x_url' },
  { label: 'LinkedIn', key: 'linkedin_url' },
];

const DAILY_SCHEDULE = [
  { time: '11:00 – 11:15', label: 'Warm-up',  desc: 'Review yesterday\'s notes + plan today', type: 'prep' },
  { time: '11:15 – 13:00', label: 'Block 1',  desc: 'Main topic — deep focused study',        type: 'study', duration: '1h 45m' },
  { time: '13:00 – 13:45', label: 'Lunch',    desc: 'Meal + rest, no screens',                type: 'break' },
  { time: '13:45 – 15:30', label: 'Block 2',  desc: 'Continue topic / next topic',            type: 'study', duration: '1h 45m' },
  { time: '15:30 – 15:45', label: 'Break',    desc: 'Stretch, water, walk',                   type: 'break' },
  { time: '15:45 – 17:00', label: 'Block 3',  desc: 'Coding practice / exercises',            type: 'study', duration: '1h 15m' },
  { time: '17:00 – 19:00', label: 'Free',     desc: 'Dinner + personal time',                 type: 'off' },
  { time: '19:00 – 19:15', label: 'Review',   desc: 'Check notes, plan evening',              type: 'prep' },
  { time: '19:15 – 20:45', label: 'Block 4',  desc: 'LeetCode / Projects / Revision',         type: 'study', duration: '1h 30m' },
  { time: '20:45 – 21:00', label: 'Break',    desc: 'Short break',                            type: 'break' },
  { time: '21:00 – 22:00', label: 'Block 5',  desc: 'Revision / English / Next day prep',     type: 'study', duration: '1h' },
];

const MONTHLY_PLAN = [
  {
    month: 1, title: 'JavaScript + React', color: '#D1FF05',
    weeks: [
      { week: 1, subject: 'JavaScript (ES6+)', topic: 'Variables, Functions, Arrays, DOM, Events' },
      { week: 2, subject: 'JavaScript (ES6+)', topic: 'Closures, Promises, Async/Await, Event Loop' },
      { week: 3, subject: 'React',             topic: 'JSX, Components, Props, useState, useEffect' },
      { week: 4, subject: 'React',             topic: 'React Router, Custom Hooks, Zustand, Mini project' },
    ],
  },
  {
    month: 2, title: 'Node.js + DSA Fundamentals', color: '#f59e0b',
    weeks: [
      { week: 5, subject: 'Node.js', topic: 'Express, Middleware, REST APIs, JWT Auth' },
      { week: 6, subject: 'Node.js', topic: 'Streams, WebSockets, Rate Limiting, Deploy' },
      { week: 7, subject: 'DSA',     topic: 'Arrays, Strings, Linked Lists, Stacks, Queues' },
      { week: 8, subject: 'DSA',     topic: 'Trees (BFS/DFS), Binary Search, Two Pointers' },
    ],
  },
  {
    month: 3, title: 'CS Fundamentals + System Design', color: '#a855f7',
    weeks: [
      { week: 9,  subject: 'DBMS / SQL',    topic: 'Joins, Transactions, Normalization, Indexes' },
      { week: 10, subject: 'OS / CN',       topic: 'Processes, Scheduling, TCP/IP, OSI, HTTP' },
      { week: 11, subject: 'System Design', topic: 'Scalability, Load Balancing, Caching, CAP Theorem' },
      { week: 12, subject: 'System Design', topic: 'Design Twitter, Netflix, WhatsApp, URL Shortener' },
    ],
  },
  {
    month: 4, title: 'Advanced DSA + Mock + Apply', color: '#22c55e',
    weeks: [
      { week: 13, subject: 'DSA',      topic: 'Dynamic Programming, Backtracking, Tries' },
      { week: 14, subject: 'DSA',      topic: 'Graphs (Dijkstra, BFS/DFS), Union-Find, Segment Trees' },
      { week: 15, subject: 'DSA',      topic: 'Neetcode 150 full revision + mock interview rounds' },
      { week: 16, subject: 'Projects', topic: 'Build FAANG-worthy projects, apply, LeetCode daily' },
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
    `🚀 Day ${daysSince} of my dev grind — Hustler 2.0 update\n\n` +
    `📚 ${summary?.totalHours || 0}h of focused study\n` +
    `⚡ ${summary?.dsaTotal || 0}/150 Neetcode problems solved\n` +
    `🔥 ${summary?.streak || 0} day streak\n` +
    `🗂 ${summary?.projectsTotal || 0} projects built\n\n` +
    `Grinding toward a full-stack dev role 💪\n\n` +
    `#100DaysOfCode #FullStack #JavaScript #React #NodeJS #DSA`;

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
              <div className="portfolio-role">Full-Stack Developer in Training · Day {daysSince}</div>
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

      {/* 4-Month Plan */}
      <div className="card">
        <div className="sec-title">4-Month Roadmap — Week by Week</div>
        <div className="tt-subtitle">Sat = projects + revision · Sun = rest + English · Click Study to start a session</div>
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
        <div className="sec-title">Stack mastery</div>
        {STACK.map(s => {
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

        {/* DSA separate bar */}
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
    </div>
  );
}
