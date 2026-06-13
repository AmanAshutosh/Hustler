// src/pages/Dashboard/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Clock, Flame, Zap, FolderKanban, TrendingUp, Sparkles, Trophy } from 'lucide-react';
import api from '../../lib/api.js';
import DigitalClock from '../../components/DigitalClock/DigitalClock.jsx';
import {
  FS_SUBJECTS, DA_SUBJECTS, FS_MONTHS, DA_MONTHS,
  getStoredPath, setStoredPath,
} from '../../data/careerData.js';
import './Dashboard.css';

const QUOTES = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", tag: "Mindset" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg, Meta", tag: "Meta" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs, Apple", tag: "Apple" },
  { text: "Focus on the user and all else will follow.", author: "Google", tag: "Google" },
  { text: "Consistency beats talent when talent doesn't show up every day.", author: "FAANG Engineers", tag: "Mindset" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", tag: "Engineering" },
  { text: "Be so good they can't ignore you.", author: "Cal Newport", tag: "Mindset" },
  { text: "Think big, start small, move fast.", author: "Google Engineering", tag: "Google" },
  { text: "Each DSA problem you solve makes you 1% closer to the offer.", author: "Leetcode Grinders", tag: "DSA" },
  { text: "Imposter syndrome means you're growing. Keep pushing.", author: "FAANG Engineers", tag: "Mindset" },
  { text: "Your GitHub green squares are your proof of work.", author: "Open Source Engineers", tag: "Grind" },
  { text: "Every line of code you write today is a step toward your dream offer.", author: "FAANG Engineers", tag: "Grind" },
  { text: "Ship code, break things, fix things, repeat.", author: "Meta Engineering", tag: "Meta" },
  { text: "You are one project away from being noticed. Build that project today.", author: "FAANG Engineers", tag: "Projects" },
  { text: "Dream companies aren't for special people. They're for dedicated people.", author: "FAANG Engineers", tag: "Mindset" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "FAANG Engineers", tag: "Mindset" },
  { text: "Move fast with stable infrastructure.", author: "Mark Zuckerberg, Meta", tag: "Meta" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", tag: "Learning" },
  { text: "Netflix engineers watch movies and build the future. So can you.", author: "Netflix Engineering", tag: "Netflix" },
  { text: "The best time to start was yesterday. The second best time is now.", author: "FAANG Engineers", tag: "Grind" },
];

function getDailyQuote() {
  const today = new Date().toDateString();
  try {
    const stored = JSON.parse(localStorage.getItem('hustler_daily_quote') || '{}');
    if (stored.date === today && stored.index != null) return QUOTES[stored.index];
    const idx = Math.floor(Math.random() * QUOTES.length);
    localStorage.setItem('hustler_daily_quote', JSON.stringify({ date: today, index: idx }));
    return QUOTES[idx];
  } catch { return QUOTES[0]; }
}

function fmtDur(secs) {
  if (!secs) return '—';
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function getDayLabel(dateStr) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return days[new Date(dateStr + 'T12:00').getDay()];
}

export default function Dashboard() {
  const [path, setPath]         = useState(getStoredPath);
  const [summary, setSummary]   = useState(null);
  const [sessions, setSessions] = useState([]);
  const [weekly, setWeekly]     = useState({});
  const [loading, setLoading]   = useState(true);
  const dailyQuote = getDailyQuote();

  useEffect(() => {
    Promise.all([
      api.get('/stats/summary'),
      api.get('/sessions?limit=5'),
      api.get('/stats/weekly'),
    ])
      .then(([s, sess, w]) => {
        setSummary(s.data);
        setSessions(sess.data.sessions);
        setWeekly(w.data || {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Sync with sidebar path changes
  useEffect(() => {
    const handler = () => setPath(getStoredPath());
    window.addEventListener('hustler-path-change', handler);
    return () => window.removeEventListener('hustler-path-change', handler);
  }, []);

  const handlePathChange = (p) => {
    setPath(p);
    setStoredPath(p);
    window.dispatchEvent(new Event('hustler-path-change'));
  };

  const subMap = {};
  (summary?.subjectHours || []).forEach(s => { subMap[s.subject] = s.hours; });

  const totalH = summary?.totalHours || 0;
  const MONTHS = path === 'fs' ? FS_MONTHS : DA_MONTHS;
  const SUBJECTS = path === 'fs' ? FS_SUBJECTS : DA_SUBJECTS;

  // Roadmap progress (distributed across 6 months by total hours)
  const hoursPerMonth = totalH / 6;
  const roadPct = MONTHS.map((_, i) => {
    const base = i * (totalH / 6);
    const contribution = Math.min(totalH, (i + 1) * (totalH / 6)) - base;
    return Math.min(100, Math.round((contribution / Math.max(totalH / 6, 1)) * 100));
  });

  // Weekly chart — last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    return { key, label: getDayLabel(key), hours: weekly[key] || 0 };
  });
  const maxH = Math.max(...last7.map(d => d.hours), 1);

  // FS metrics
  const fsMetrics = [
    { key: 'totalHours',   label: 'Study Hours',  suffix: 'h',  val: totalH,                     Icon: Clock,        color: 'var(--accent)' },
    { key: 'streak',       label: 'Day Streak',   suffix: ' 🔥', val: summary?.streak || 0,       Icon: Flame,        color: '#F97316' },
    { key: 'dsaTotal',     label: 'DSA Solved',   suffix: '/150',val: summary?.dsaTotal || 0,     Icon: Zap,          color: 'var(--purple)' },
    { key: 'projectsTotal',label: 'Projects',     suffix: '',    val: summary?.projectsTotal || 0,Icon: FolderKanban, color: 'var(--blue)' },
  ];
  const daMetrics = [
    { key: 'totalHours',   label: 'Study Hours',  suffix: 'h',  val: totalH,                     Icon: Clock,        color: 'var(--accent)' },
    { key: 'streak',       label: 'Day Streak',   suffix: ' 🔥', val: summary?.streak || 0,       Icon: Flame,        color: '#F97316' },
    { key: 'sql',          label: 'SQL Hours',    suffix: 'h',  val: subMap['SQL'] || 0,          Icon: TrendingUp,   color: '#F59E0B' },
    { key: 'projectsTotal',label: 'DA Projects',  suffix: '',   val: summary?.projectsTotal || 0, Icon: Trophy,       color: '#22C55E' },
  ];
  const METRICS = path === 'fs' ? fsMetrics : daMetrics;

  if (loading) return (
    <div className="dashboard">
      <div className="dash-skeleton">
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 96 }} />)}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h2>Dashboard</h2>
          <p>{path === 'fs' ? 'Full Stack Developer' : 'Data Analytics'} track</p>
        </div>
        <DigitalClock />
      </div>

      {/* Career path selector */}
      <div className="path-tabs" style={{ marginBottom: 20 }}>
        <button
          className={`path-tab${path === 'fs' ? ' active' : ''}`}
          onClick={() => handlePathChange('fs')}
        >Full Stack Dev</button>
        <button
          className={`path-tab${path === 'da' ? ' active' : ''}`}
          onClick={() => handlePathChange('da')}
        >Data Analytics</button>
      </div>

      {/* Daily quote */}
      <div className="quote-card">
        <div className="quote-tag"><Sparkles size={10} /> {dailyQuote.tag}</div>
        <div className="quote-text">{dailyQuote.text}</div>
        <div className="quote-author">— {dailyQuote.author}</div>
      </div>

      {/* Metric cards */}
      <div className="metric-grid">
        {METRICS.map(({ key, label, suffix, val, Icon, color }) => (
          <div className="metric-card" key={key}>
            <div className="metric-icon" style={{ color }}>
              <Icon size={18} />
            </div>
            <div className="metric-val" style={{ color }}>
              {val}{suffix}
            </div>
            <div className="metric-lbl">{label}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Left: subject progress */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="sec-title"><TrendingUp size={12} /> {path === 'fs' ? 'FS' : 'DA'} Skills</div>
          {SUBJECTS.map(s => {
            const h = subMap[s.name] || 0;
            const pct = Math.min(100, Math.round((h / s.target) * 100));
            return (
              <div className="bar-row" key={s.name}>
                <div className="bar-label">
                  <span>{s.name}</span>
                  <span>{h}h / {s.target}h</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%`, background: s.color }} />
                </div>
              </div>
            );
          })}
          {path === 'fs' && (() => {
            const dsa = summary?.dsaTotal || 0;
            const pct = Math.round((dsa / 150) * 100);
            return (
              <div className="bar-row" style={{ marginTop: 4 }}>
                <div className="bar-label"><span>DSA — Neetcode 150</span><span>{dsa}/150</span></div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%`, background: 'var(--purple)' }} />
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right: weekly activity */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="sec-title"><Flame size={12} /> Weekly Activity</div>
          <div className="weekly-chart">
            {last7.map(({ key, label, hours }) => (
              <div className="wc-col" key={key}>
                <div className="wc-bar-wrap">
                  <div
                    className="wc-bar"
                    style={{ height: `${Math.round((hours / maxH) * 100)}%` }}
                    title={`${hours.toFixed(1)}h`}
                  />
                </div>
                <div className="wc-label">{label}</div>
                <div className="wc-val">{hours > 0 ? `${hours.toFixed(1)}h` : ''}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-grid" style={{ marginTop: 14 }}>
        {/* Recent sessions */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="sec-title"><Clock size={12} /> Recent Sessions</div>
          {sessions.filter(s => !s.is_active).length === 0
            ? <p className="empty-msg">No sessions yet. Start the timer!</p>
            : (
              <table className="session-table">
                <tbody>
                  {sessions.filter(s => !s.is_active).map(s => (
                    <tr key={s.id}>
                      <td>
                        <span className="subj-name">{s.subject}</span>
                        <br />
                        <span className="subj-topic">{s.topic}</span>
                      </td>
                      <td className="subj-dur">{fmtDur(s.duration_secs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>

        {/* 6-Month roadmap */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="sec-title"><Trophy size={12} /> 6-Month {path === 'fs' ? 'FS' : 'DA'} Roadmap</div>
          {MONTHS.map((r, i) => (
            <div className="bar-row" key={r.num}>
              <div className="bar-label">
                <span>M{r.num} — {r.title}</span>
                <span>{roadPct[i]}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${roadPct[i]}%`, background: r.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
