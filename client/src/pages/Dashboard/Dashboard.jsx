// src/pages/Dashboard/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Clock, Flame, Zap, FolderKanban, TrendingUp, Sparkles } from 'lucide-react';
import api from '../../lib/api.js';
import './Dashboard.css';

const QUOTES = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", tag: "FAANG mindset" },
  { text: "At Google, we hire people who are smarter than us, and then get out of their way.", author: "Eric Schmidt, Google", tag: "Google" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg, Meta", tag: "Meta" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs, Apple", tag: "Apple" },
  { text: "Work hard, have fun, make history.", author: "Jeff Bezos, Amazon", tag: "Amazon" },
  { text: "The more risks you take, the more you learn.", author: "Reed Hastings, Netflix", tag: "Netflix" },
  { text: "Move fast with stable infrastructure.", author: "Mark Zuckerberg, Meta", tag: "Meta" },
  { text: "Focus on the user and all else will follow.", author: "Google's Ten Things", tag: "Google" },
  { text: "Our mission is to be Earth's most customer-centric company.", author: "Jeff Bezos, Amazon", tag: "Amazon" },
  { text: "Every line of code you write today is a step toward your dream offer.", author: "FAANG Engineers", tag: "Grind" },
  { text: "Leetcode today, dream offer tomorrow. Keep going.", author: "FAANG Engineers", tag: "DSA" },
  { text: "The interview is just the gate. The real work starts after you're inside.", author: "Senior SDE, Google", tag: "Google" },
  { text: "Ship code, break things, fix things, repeat. That is how great engineers are made.", author: "Meta Engineering", tag: "Meta" },
  { text: "You're not behind. You're on your own timeline to greatness.", author: "FAANG Engineers", tag: "Grind" },
  { text: "Consistency beats talent when talent doesn't show up every day.", author: "FAANG Engineers", tag: "Mindset" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", tag: "Engineering" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs", tag: "Engineering" },
  { text: "Amazon was not built in a day. Your skills won't be either. Keep coding.", author: "Amazon SDE", tag: "Amazon" },
  { text: "Hard work, hustle, and a killer resume — that's how you land FAANG.", author: "FAANG Engineers", tag: "Grind" },
  { text: "Your GitHub green squares are your proof of work. Fill them every single day.", author: "Open Source Engineers", tag: "Grind" },
  { text: "The difference between a good developer and a great one is discipline.", author: "FAANG Engineers", tag: "Mindset" },
  { text: "If you're not embarrassed by the first version of your product, you've launched too late.", author: "Reid Hoffman, LinkedIn", tag: "LinkedIn" },
  { text: "It's not about ideas. It's about making ideas happen.", author: "Scott Belsky", tag: "Mindset" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", tag: "Learning" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", tag: "Mindset" },
  { text: "One coding session a day keeps regret away.", author: "FAANG Engineers", tag: "Grind" },
  { text: "Every rejected application brought you closer. Keep applying. Keep improving.", author: "FAANG Engineers", tag: "Resilience" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "FAANG Engineers", tag: "Mindset" },
  { text: "You are one project away from being noticed. Build that project today.", author: "FAANG Engineers", tag: "Projects" },
  { text: "Dream companies aren't for special people. They're for dedicated people.", author: "FAANG Engineers", tag: "Mindset" },
  { text: "Code is like humor. When you have to explain it, it's bad — but keep learning.", author: "Cory House", tag: "Engineering" },
  { text: "Be so good they can't ignore you.", author: "Steve Martin / Cal Newport", tag: "Mindset" },
  { text: "Think big, start small, move fast.", author: "Google Engineering", tag: "Google" },
  { text: "The difference between try and triumph is a little umph.", author: "Marvin Phillips", tag: "Motivation" },
  { text: "Your future FAANG badge is waiting. Don't let it wait forever.", author: "FAANG Engineers", tag: "Goal" },
  { text: "Each DSA problem you solve makes you 1% closer to the offer.", author: "Leetcode Grinders", tag: "DSA" },
  { text: "The best time to start was yesterday. The second best time is now.", author: "FAANG Engineers", tag: "Grind" },
  { text: "Imposter syndrome means you're growing. Keep pushing.", author: "FAANG Engineers", tag: "Mindset" },
  { text: "Netflix engineers watch movies and build the future. So can you.", author: "Netflix Engineering", tag: "Netflix" },
  { text: "The only way out is through the code. Keep grinding.", author: "FAANG Engineers", tag: "Grind" },
];

const QUOTES_KEY = 'hustler_daily_quote';

function getDailyQuote() {
  const today = new Date().toDateString();
  try {
    const stored = JSON.parse(localStorage.getItem(QUOTES_KEY) || '{}');
    if (stored.date === today && stored.index != null) return QUOTES[stored.index];
    const seen = (stored.date !== today && stored.resetSeen) ? [] : (stored.seen || []);
    const available = QUOTES.map((_, i) => i).filter(i => !seen.includes(i));
    const pool = available.length > 0 ? available : QUOTES.map((_, i) => i);
    const newSeen = available.length > 0 ? seen : [];
    const idx = pool[Math.floor(Math.random() * pool.length)];
    localStorage.setItem(QUOTES_KEY, JSON.stringify({ date: today, index: idx, seen: [...newSeen, idx] }));
    return QUOTES[idx];
  } catch { return QUOTES[0]; }
}

const SUBJECTS = [
  { name: 'JavaScript (ES6+)', target: 40, color: '#D1FF05' },
  { name: 'React',             target: 35, color: '#61dafb' },
  { name: 'Node.js',           target: 30, color: '#68a063' },
  { name: 'DSA',               target: 50, color: '#a855f7' },
  { name: 'System Design',     target: 20, color: '#3b82f6' },
  { name: 'DBMS / SQL',        target: 15, color: '#ec4899' },
  { name: 'OS / CN',           target: 15, color: '#06b6d4' },
];

const ROADMAP = [
  { name: 'Month 1 — JS + React',          color: '#D1FF05' },
  { name: 'Month 2 — Node.js + DSA',       color: '#f59e0b' },
  { name: 'Month 3 — System Design',        color: '#a855f7' },
  { name: 'Month 4 — Apply + Mock rounds', color: '#22c55e' },
];

function fmtDur(secs) {
  if (!secs) return '—';
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const METRICS = [
  { key: 'totalHours', label: 'Total Hours', suffix: 'h', Icon: Clock,        color: 'var(--accent)' },
  { key: 'streak',     label: 'Day Streak',  suffix: '',  Icon: Flame,        color: '#f97316' },
  { key: 'dsaTotal',   label: 'DSA Solved',  suffix: '',  Icon: Zap,          color: 'var(--purple)' },
  { key: 'projectsTotal', label: 'Projects', suffix: '',  Icon: FolderKanban, color: 'var(--blue)' },
];

export default function Dashboard() {
  const [summary, setSummary]   = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const dailyQuote = getDailyQuote();

  useEffect(() => {
    Promise.all([api.get('/stats/summary'), api.get('/sessions?limit=6')])
      .then(([s, sess]) => { setSummary(s.data); setSessions(sess.data.sessions); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="dashboard">
      <div className="skeleton-grid">
        {[1,2,3,4].map(i => <div key={i} className="skeleton-card" />)}
      </div>
    </div>
  );

  const subMap = {};
  (summary?.subjectHours || []).forEach(s => { subMap[s.subject] = s.hours; });

  const totalH = summary?.totalHours || 0;
  const roadPct = [
    Math.min(100, Math.round((totalH / 60) * 100)),
    Math.max(0, Math.min(100, Math.round(((totalH - 60) / 90) * 100))),
    Math.max(0, Math.min(100, Math.round(((totalH - 150) / 60) * 100))),
    Math.max(0, Math.min(100, Math.round(((totalH - 210) / 60) * 100))),
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Your full-stack grind at a glance</p>
      </div>

      <div className="quote-card">
        <div className="quote-header">
          <span className="quote-badge"><Sparkles size={10} /> Daily Fuel</span>
          <span className="quote-company-tag">{dailyQuote.tag}</span>
        </div>
        <div className="quote-text">{dailyQuote.text}</div>
        <div className="quote-author">— {dailyQuote.author}</div>
      </div>

      <div className="metric-grid">
        {METRICS.map(({ key, label, suffix, Icon, color }) => (
          <div className="metric-card" key={key}>
            <div className="metric-icon" style={{ color }}>
              <Icon size={20} />
            </div>
            <div className="metric-val" style={{ color }}>
              {summary?.[key] || 0}{suffix}
            </div>
            <div className="metric-lbl">{label}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="card">
          <div className="sec-title">
            <TrendingUp size={12} /> Subject Progress
          </div>
          {SUBJECTS.map(s => {
            const pct = Math.min(100, Math.round(((subMap[s.name] || 0) / s.target) * 100));
            return (
              <div className="bar-row" key={s.name}>
                <div className="bar-label">
                  <span>{s.name}</span>
                  <span>{subMap[s.name] || 0}h / {s.target}h</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%`, background: s.color }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
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
      </div>

      <div className="card">
        <div className="sec-title"><TrendingUp size={12} /> 4-Month Roadmap</div>
        {ROADMAP.map((r, i) => (
          <div className="bar-row" key={r.name}>
            <div className="bar-label">
              <span>{r.name}</span>
              <span>{roadPct[i]}%</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${roadPct[i]}%`, background: r.color }} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
