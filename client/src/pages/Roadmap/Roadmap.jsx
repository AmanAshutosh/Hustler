// src/pages/Roadmap/Roadmap.jsx
import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import api from '../../lib/api.js';
import toast from 'react-hot-toast';
import { FS_MONTHS, DA_MONTHS, getCurrentMonth, getStoredPath, setStoredPath } from '../../data/careerData.js';
import './Roadmap.css';

export default function Roadmap() {
  const [progress, setProgress] = useState({});
  const [loading,  setLoading]  = useState(true);
  const [path, setPath] = useState(getStoredPath);
  const currentMonth = getCurrentMonth();

  const MONTHS = path === 'fs' ? FS_MONTHS : DA_MONTHS;

  useEffect(() => {
    api.get('/roadmap/progress')
      .then(r => setProgress(r.data || {}))
      .catch(() => toast.error('Could not load roadmap'))
      .finally(() => setLoading(false));
  }, []);

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
  const done       = MONTHS.reduce((s, m) => s + m.milestones.filter((_, i) => progress[`${path}_m${m.num}_${i}`]).length, 0);
  const overallPct = total ? Math.round((done / total) * 100) : 0;

  if (loading) return (
    <div className="rm-page">
      <div className="rm-skeleton-grid">
        {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 220 }} />)}
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
      <div className="path-tabs">
        <button className={`path-tab${path === 'fs' ? ' active' : ''}`} onClick={() => handlePathChange('fs')}>
          Full Stack Dev
        </button>
        <button className={`path-tab${path === 'da' ? ' active' : ''}`} onClick={() => handlePathChange('da')}>
          Data Analytics
        </button>
      </div>

      {/* Overall progress bar */}
      <div className="rm-overall-bar card">
        <div className="rm-bar-row">
          <span className="rm-bar-lbl">
            <Trophy size={13} /> {done} / {total} milestones — {path === 'fs' ? 'Full Stack' : 'Data Analytics'}
          </span>
          <span className="rm-bar-val">{overallPct}%</span>
        </div>
        <div className="rm-prog-track">
          <div className="rm-prog-fill" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      {/* Month cards */}
      <div className="rm-grid">
        {MONTHS.map(m => {
          const mk     = `${path}_m${m.num}`;
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
                  {isCurr && <span className="rm-curr-badge">Current</span>}
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
