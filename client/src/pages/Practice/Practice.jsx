// src/pages/Practice/Practice.jsx
import { useState, useEffect } from 'react';
import { FS_PRACTICE_SETS, DA_PRACTICE_SETS } from '../../data/careerData.js';
import './Practice.css';

const HOW_TO = [
  'Build everything from scratch (no copy-paste).',
  'Use only HTML + CSS + JS (vanilla).',
  'Test responsiveness (mobile view).',
  'Put them on GitHub or CodePen for portfolio.',
  'After building, try to improve it (add dark mode, animations, localStorage, etc.).',
];

const RESOURCES = [
  { label: 'Brad Traversy — 50 Projects in 50 Days (GitHub)', note: 'Excellent mini projects' },
  { label: 'Frontend Mentor', note: 'Free challenges with real designs' },
  { label: '100 HTML/CSS/JS Projects (YouTube)', note: 'Search "100 projects HTML CSS JS"' },
  { label: 'W3Schools + MDN', note: 'Reference when stuck' },
  { label: 'freeCodeCamp — Responsive Web Design + JavaScript sections', note: 'Structured curriculum' },
];

const PRO_TIPS = [
  'Every day, spend 30–60 minutes building something small.',
  'When stuck → Google the exact error or "how to change opacity with range slider javascript".',
  'Record what you learned after each project (even 2 lines in a note).',
  'After 2–3 sets, redo your weak projects faster.',
  'In interviews, think out loud: "First I\'ll make the HTML structure, then style with CSS, then connect with JS using addEventListener on input".',
];

const STORAGE_KEY    = 'practice_done';
const STORAGE_KEY_DA = 'practice_da_done';

function loadDone(key) {
  try { return JSON.parse(localStorage.getItem(key)) || {}; }
  catch { return {}; }
}

export default function Practice() {
  const [activePath, setActivePath] = useState('fs');
  const [activeTab,    setActiveTab]   = useState(FS_PRACTICE_SETS[0]?.id || 's1');
  const [activeDATab,  setActiveDATab]  = useState(DA_PRACTICE_SETS[0]?.id || 'da1');
  const [done,   setDone]   = useState(() => loadDone(STORAGE_KEY));
  const [doneDA, setDoneDA] = useState(() => loadDone(STORAGE_KEY_DA));
  const [howToOpen, setHowToOpen] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY,    JSON.stringify(done));   }, [done]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_DA, JSON.stringify(doneDA)); }, [doneDA]);

  const toggle   = (setId, idx) => { const k = `${setId}:${idx}`; setDone(p => ({ ...p, [k]: !p[k] })); };
  const toggleDA = (setId, idx) => { const k = `${setId}:${idx}`; setDoneDA(p => ({ ...p, [k]: !p[k] })); };

  const totalProjects   = FS_PRACTICE_SETS.reduce((s, set) => s + set.projects.length, 0);
  const totalDone       = Object.values(done).filter(Boolean).length;
  const pct             = Math.round((totalDone / totalProjects) * 100);

  const totalDAProjects = DA_PRACTICE_SETS.reduce((s, set) => s + set.projects.length, 0);
  const totalDADone     = Object.values(doneDA).filter(Boolean).length;
  const pctDA           = Math.round((totalDADone / totalDAProjects) * 100);

  const activeSet   = FS_PRACTICE_SETS.find(s => s.id === activeTab);
  const activeDASet = DA_PRACTICE_SETS.find(s => s.id === activeDATab);

  const setDoneCount   = (set) => set.projects.filter((_, i) => done[`${set.id}:${i}`]).length;
  const setDoneCountDA = (set) => set.projects.filter((_, i) => doneDA[`${set.id}:${i}`]).length;

  const isDA         = activePath === 'da';
  const displayTotal = isDA ? totalDAProjects : totalProjects;
  const displayDone  = isDA ? totalDADone : totalDone;
  const displayPct   = isDA ? pctDA : pct;

  return (
    <div className="practice-page">
      <div className="practice-header">
        <div>
          <h2>Practice</h2>
          <p>{isDA ? 'Excel · SQL · Python · Power BI · Tableau' : 'HTML · CSS · JavaScript — build everything from scratch.'}</p>
        </div>
        <div className="practice-overall">
          <div className="practice-overall-num">
            <span className="practice-done-big">{displayDone}</span>
            <span className="practice-total-big">/{displayTotal}</span>
          </div>
          <div className="practice-bar-wrap">
            <div className="practice-bar" style={{ width: `${displayPct}%` }} />
          </div>
          <div className="practice-pct">{displayPct}% complete</div>
        </div>
      </div>

      <div className="path-tabs">
        <button className={`path-tab${!isDA ? ' active' : ''}`} onClick={() => setActivePath('fs')}>
          Full Stack
        </button>
        <button className={`path-tab${isDA ? ' active' : ''}`} onClick={() => setActivePath('da')}>
          Data Analytics
        </button>
      </div>

      <div className="how-to-card">
        <button className="how-to-toggle" onClick={() => setHowToOpen(o => !o)}>
          <span className="how-to-label">How to Practice</span>
          <span className="how-to-chevron">{howToOpen ? '▲' : '▼'}</span>
        </button>
        {howToOpen && (
          <ul className="how-to-list">
            {HOW_TO.map((tip, i) => (
              <li key={i} className="how-to-item">
                <span className="how-to-dot" />
                {tip}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!isDA ? (
        <>
          <div className="practice-tabs">
            {FS_PRACTICE_SETS.map(set => {
              const cnt = setDoneCount(set);
              const isActive = activeTab === set.id;
              return (
                <button key={set.id} className={`practice-tab${isActive ? ' active' : ''}`}
                  onClick={() => setActiveTab(set.id)}
                  style={isActive ? { '--tab-color': set.color } : {}}>
                  <span className="tab-label">{set.label}</span>
                  <span className="tab-count" style={{ color: set.color }}>{cnt}/{set.projects.length}</span>
                </button>
              );
            })}
          </div>
          {activeSet && (
            <div className="set-panel">
              <div className="set-panel-header">
                <div>
                  <div className="set-panel-title" style={{ color: activeSet.color }}>{activeSet.title}</div>
                  <div className="set-panel-sub">{activeSet.subtitle}</div>
                </div>
                <div className="set-progress-pill" style={{ borderColor: activeSet.color + '55' }}>
                  <span style={{ color: activeSet.color }}>{setDoneCount(activeSet)}</span>
                  <span className="set-progress-sep">/</span>
                  <span>{activeSet.projects.length}</span>
                </div>
              </div>
              <ul className="project-list">
                {activeSet.projects.map((proj, i) => {
                  const key = `${activeSet.id}:${i}`;
                  const isDone = !!done[key];
                  return (
                    <li key={i} className={`project-item${isDone ? ' done' : ''}`} onClick={() => toggle(activeSet.id, i)}>
                      <span className="project-check">{isDone ? '✓' : ''}</span>
                      <span className="project-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="project-text">{proj}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="practice-tabs">
            {DA_PRACTICE_SETS.map(set => {
              const cnt = setDoneCountDA(set);
              const isActive = activeDATab === set.id;
              return (
                <button key={set.id} className={`practice-tab${isActive ? ' active' : ''}`}
                  onClick={() => setActiveDATab(set.id)}
                  style={isActive ? { '--tab-color': set.color } : {}}>
                  <span className="tab-label">{set.label}</span>
                  <span className="tab-count" style={{ color: set.color }}>{cnt}/{set.projects.length}</span>
                </button>
              );
            })}
          </div>
          {activeDASet && (
            <div className="set-panel">
              <div className="set-panel-header">
                <div>
                  <div className="set-panel-title" style={{ color: activeDASet.color }}>{activeDASet.title}</div>
                  <div className="set-panel-sub">{activeDASet.subtitle}</div>
                </div>
                <div className="set-progress-pill" style={{ borderColor: activeDASet.color + '55' }}>
                  <span style={{ color: activeDASet.color }}>{setDoneCountDA(activeDASet)}</span>
                  <span className="set-progress-sep">/</span>
                  <span>{activeDASet.projects.length}</span>
                </div>
              </div>
              <ul className="project-list">
                {activeDASet.projects.map((proj, i) => {
                  const key = `${activeDASet.id}:${i}`;
                  const isDone = !!doneDA[key];
                  return (
                    <li key={i} className={`project-item${isDone ? ' done' : ''}`} onClick={() => toggleDA(activeDASet.id, i)}>
                      <span className="project-check">{isDone ? '✓' : ''}</span>
                      <span className="project-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="project-text">{proj}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}

      <div className="bottom-grid">
        <div className="bottom-card">
          <div className="bottom-card-title">Bonus Resources</div>
          <ul className="res-list">
            {RESOURCES.map((r, i) => (
              <li key={i} className="res-item">
                <span className="res-bullet">↗</span>
                <span>
                  <span className="res-label">{r.label}</span>
                  <span className="res-note"> — {r.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bottom-card">
          <div className="bottom-card-title">Pro Tips</div>
          <ul className="tip-list">
            {PRO_TIPS.map((tip, i) => (
              <li key={i} className="tip-item">
                <span className="tip-num">{i + 1}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
