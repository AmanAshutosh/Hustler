import { useEffect, useState } from 'react';
import './Loader.css';

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);

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
      <div className="loader-body">

        <div className="chip-wrapper">
          <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2d2d2d" />
                <stop offset="100%" stopColor="#0f0f0f" />
              </linearGradient>
              <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eeeeee" />
                <stop offset="100%" stopColor="#888888" />
              </linearGradient>
              <linearGradient id="pinGradient" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#bbbbbb" />
                <stop offset="50%" stopColor="#888888" />
                <stop offset="100%" stopColor="#555555" />
              </linearGradient>
            </defs>

            {/* Traces */}
            <g id="traces">
              <path d="M100 100 H200 V210 H326" className="trace-bg" />
              <path d="M100 100 H200 V210 H326" className="trace-flow purple" />

              <path d="M80 180 H180 V230 H326" className="trace-bg" />
              <path d="M80 180 H180 V230 H326" className="trace-flow blue" />

              <path d="M60 260 H150 V250 H326" className="trace-bg" />
              <path d="M60 260 H150 V250 H326" className="trace-flow yellow" />

              <path d="M100 350 H200 V270 H326" className="trace-bg" />
              <path d="M100 350 H200 V270 H326" className="trace-flow green" />

              <path d="M700 90 H560 V210 H474" className="trace-bg" />
              <path d="M700 90 H560 V210 H474" className="trace-flow blue" />

              <path d="M740 160 H580 V230 H474" className="trace-bg" />
              <path d="M740 160 H580 V230 H474" className="trace-flow green" />

              <path d="M720 250 H590 V250 H474" className="trace-bg" />
              <path d="M720 250 H590 V250 H474" className="trace-flow red" />

              <path d="M680 340 H570 V270 H474" className="trace-bg" />
              <path d="M680 340 H570 V270 H474" className="trace-flow yellow" />
            </g>

            {/* Chip body */}
            <rect
              x="330" y="190" width="140" height="100"
              rx="20" ry="20"
              fill="url(#chipGradient)"
              stroke="#222" strokeWidth="3"
              filter="drop-shadow(0 0 6px rgba(0,0,0,0.8))"
            />

            {/* Left pins */}
            <g>
              <rect x="322" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2" />
              <rect x="322" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2" />
              <rect x="322" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2" />
              <rect x="322" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2" />
            </g>

            {/* Right pins */}
            <g>
              <rect x="470" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2" />
              <rect x="470" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2" />
              <rect x="470" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2" />
              <rect x="470" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2" />
            </g>

            {/* Chip label */}
            <text
              x="400" y="240"
              fontFamily="Arial, sans-serif"
              fontSize="22"
              fill="url(#textGradient)"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              Hustler
            </text>

            {/* Left endpoint dots */}
            <circle cx="100" cy="100" r="5" fill="black" />
            <circle cx="80"  cy="180" r="5" fill="black" />
            <circle cx="60"  cy="260" r="5" fill="black" />
            <circle cx="100" cy="350" r="5" fill="black" />

            {/* Right endpoint dots */}
            <circle cx="700" cy="90"  r="5" fill="black" />
            <circle cx="740" cy="160" r="5" fill="black" />
            <circle cx="720" cy="250" r="5" fill="black" />
            <circle cx="680" cy="340" r="5" fill="black" />
          </svg>
        </div>

        {/* Progress */}
        <div className="loader-pct">
          {pct}<span className="loader-pct-sym">%</span>
        </div>

        <div className="loader-bar-track">
          <div className="loader-bar-fill" style={{ width: `${pct}%` }} />
          <div className="loader-bar-glow" style={{ left: `${pct}%` }} />
        </div>

      </div>
    </div>
  );
}
