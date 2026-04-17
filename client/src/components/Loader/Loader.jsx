// src/components/Loader/Loader.jsx
import { useEffect, useState } from 'react';
import './Loader.css';

const MESSAGES = [
  'Keep grinding, champ.',
  'No days off.',
  'Stay locked in.',
  'Every second counts.',
  'Build the dream.',
  'Outwork everyone.',
  'Consistency > talent.',
  'One more session.',
  'You vs. you.',
];

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [msg] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

  useEffect(() => {
    let value = 0;
    const id = setInterval(() => {
      const inc =
        value < 60 ? Math.random() * 12 + 6 :
        value < 85 ? Math.random() * 5  + 2 :
        value < 95 ? Math.random() * 2  + 0.5 :
        0.4;
      value = Math.min(value + inc, 100);
      setPct(Math.floor(value));
      if (value >= 100) {
        clearInterval(id);
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => onDone?.(), 380);
        }, 160);
      }
    }, 48);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`loader-overlay${exiting ? ' loader-exit' : ''}`}>
      <div className="loader-bg-dots" />

      <div className="loader-body">
        {/* ── Scene: runner + effects ── */}
        <div className="loader-scene">

          {/* Speed lines to the left */}
          <div className="speed-lines">
            <div className="sp-line sp-1" />
            <div className="sp-line sp-2" />
            <div className="sp-line sp-3" />
          </div>

          {/* Stick-figure runner */}
          <div className="hustler">
            <div className="h-head" />
            <div className="h-body" />
            <div className="h-arm h-arm-l" />
            <div className="h-arm h-arm-r" />
            <div className="h-leg h-leg-l">
              <div className="h-shin h-shin-l" />
            </div>
            <div className="h-leg h-leg-r">
              <div className="h-shin h-shin-r" />
            </div>
          </div>

          {/* Ground shadow */}
          <div className="runner-shadow" />

          {/* Floating emoji elements */}
          <span className="fi fi-1">📚</span>
          <span className="fi fi-2">💻</span>
          <span className="fi fi-3">⚡</span>
          <span className="fi fi-4">🔥</span>
        </div>

        {/* ── Counter + bar ── */}
        <p className="loader-label">H U S T L I N G</p>

        <div className="loader-pct">
          {pct}<span className="loader-pct-sym">%</span>
        </div>

        <div className="loader-bar-track">
          <div className="loader-bar-fill" style={{ width: `${pct}%` }} />
          <div className="loader-bar-glow" style={{ left: `${pct}%` }} />
        </div>

        <p className="loader-msg">{msg}</p>
      </div>
    </div>
  );
}
