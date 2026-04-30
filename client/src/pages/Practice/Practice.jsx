// src/pages/Practice/Practice.jsx
import { useState, useEffect } from 'react';
import './Practice.css';

const HOW_TO = [
  'Build everything from scratch (no copy-paste).',
  'Use only HTML + CSS + JS (vanilla).',
  'Test responsiveness (mobile view).',
  'Put them on GitHub or CodePen for portfolio.',
  'After building, try to improve it (add dark mode, animations, localStorage, etc.).',
];

const SETS = [
  {
    id: 's1',
    label: 'Set 1',
    title: 'HTML + CSS Basics',
    subtitle: 'Structure & Styling',
    color: '#60a5fa',
    projects: [
      'Responsive navigation bar (hamburger menu on mobile).',
      'Tribute page for your favorite person/thing.',
      'Product card with hover effects.',
      'Pricing table (3 columns with "most popular" highlight).',
      'Survey/Form page with proper labels and inputs.',
      'Photo gallery grid using CSS Grid.',
      'Landing page hero section with background image.',
      'Testimonial carousel (pure CSS if possible).',
      'Responsive sidebar layout (collapsible).',
      'Blog post layout with article, aside, and footer.',
    ],
  },
  {
    id: 's2',
    label: 'Set 2',
    title: 'CSS Advanced',
    subtitle: 'Flexbox, Grid, Animations',
    color: '#818cf8',
    projects: [
      'CSS-only accordion (click to expand).',
      'Image hover overlay with text and icon.',
      'Responsive dashboard layout using Grid.',
      'Animated progress bars.',
      'Flip card effect (front/back on hover).',
      'Sticky navbar that changes on scroll.',
      'CSS-only tabs.',
      'Parallax scrolling effect (simple version).',
      'Neumorphism or Glassmorphism card design.',
      'Dark/Light mode toggle with CSS variables.',
    ],
  },
  {
    id: 's3',
    label: 'Set 3',
    title: 'JavaScript Basics',
    subtitle: 'DOM Manipulation',
    color: '#34d399',
    projects: [
      'Range slider controlling opacity (interview classic).',
      'Counter (increase / decrease / reset) with buttons.',
      'Todo List (add, delete, mark complete).',
      'Simple Calculator ( +, −, ×, ÷ ).',
      'Random quote generator (array of quotes).',
      'Password generator with options (length, symbols, etc.).',
      'Color palette generator (random hex colors).',
      'Digital clock (live updating).',
      'Form validation (email, password match, required fields).',
      'Modal popup (open / close with overlay).',
    ],
  },
  {
    id: 's4',
    label: 'Set 4',
    title: 'Intermediate JS',
    subtitle: 'Interactivity',
    color: '#fbbf24',
    projects: [
      'Expense Tracker (add income/expense, show balance, list).',
      'Quiz App with multiple questions and score.',
      'Weather App (use a free API like OpenWeatherMap).',
      'Notes App with localStorage (save notes).',
      'Drag and Drop task board (like Trello mini).',
      'Searchable list/filter (e.g., list of countries).',
      'Infinite scroll mock (load more items on scroll).',
      'Image slider/carousel with next/prev + auto-play.',
      'BMI Calculator with categories (underweight, normal, etc.).',
      'Tip Calculator for restaurants.',
    ],
  },
  {
    id: 's5',
    label: 'Set 5',
    title: 'Advanced Mini Projects',
    subtitle: 'Combine Everything',
    color: '#f472b6',
    projects: [
      'Movie search app (use TMDB or OMDB API).',
      'E-commerce product page with cart (add to cart, localStorage).',
      'Chat UI mock (send messages, fake replies).',
      'Pomodoro Timer (25 min work + break).',
      'Recipe finder (search by ingredient).',
      'Memory matching game (flip cards).',
      'Rock Paper Scissors with score tracking.',
      'Markdown previewer (live preview as you type).',
      'URL shortener UI (mock functionality).',
      'Personal portfolio website (combine many things above).',
    ],
  },
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

const STORAGE_KEY = 'practice_done';

function loadDone() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

export default function Practice() {
  const [activeTab, setActiveTab] = useState('s1');
  const [done, setDone] = useState(loadDone);
  const [howToOpen, setHowToOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }, [done]);

  const toggle = (setId, idx) => {
    const key = `${setId}:${idx}`;
    setDone(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalProjects = SETS.reduce((s, set) => s + set.projects.length, 0);
  const totalDone = Object.values(done).filter(Boolean).length;
  const pct = Math.round((totalDone / totalProjects) * 100);

  const activeSet = SETS.find(s => s.id === activeTab);

  const setDoneCount = (set) =>
    set.projects.filter((_, i) => done[`${set.id}:${i}`]).length;

  return (
    <div className="practice-page">
      {/* Header */}
      <div className="practice-header">
        <div>
          <h2>Practice</h2>
          <p>HTML · CSS · JavaScript — build everything from scratch.</p>
        </div>
        <div className="practice-overall">
          <div className="practice-overall-num">
            <span className="practice-done-big">{totalDone}</span>
            <span className="practice-total-big">/{totalProjects}</span>
          </div>
          <div className="practice-bar-wrap">
            <div className="practice-bar" style={{ width: `${pct}%` }} />
          </div>
          <div className="practice-pct">{pct}% complete</div>
        </div>
      </div>

      {/* How to Practice */}
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

      {/* Set Tabs */}
      <div className="practice-tabs">
        {SETS.map(set => {
          const cnt = setDoneCount(set);
          const isActive = activeTab === set.id;
          return (
            <button
              key={set.id}
              className={`practice-tab${isActive ? ' active' : ''}`}
              onClick={() => setActiveTab(set.id)}
              style={isActive ? { '--tab-color': set.color } : {}}
            >
              <span className="tab-label">{set.label}</span>
              <span className="tab-count" style={{ color: set.color }}>
                {cnt}/{set.projects.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Set Content */}
      {activeSet && (
        <div className="set-panel">
          <div className="set-panel-header">
            <div>
              <div className="set-panel-title" style={{ color: activeSet.color }}>
                {activeSet.title}
              </div>
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
                <li
                  key={i}
                  className={`project-item${isDone ? ' done' : ''}`}
                  onClick={() => toggle(activeSet.id, i)}
                >
                  <span className="project-check">
                    {isDone ? '✓' : ''}
                  </span>
                  <span className="project-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="project-text">{proj}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Resources + Pro Tips */}
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
