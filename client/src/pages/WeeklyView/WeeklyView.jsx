// src/pages/WeeklyView/WeeklyView.jsx
import { useEffect, useState } from 'react';
import {
  WEEKDAY, SATURDAY, SUNDAY,
  EVENING_WEEKDAY, EVENING_SATURDAY, EVENING_SUNDAY,
  CATEGORIES,
  getStoredGymMode, setStoredGymMode, GYM_MODE_CHANGE_EVENT,
} from '../../data/careerData.js';
import './WeeklyView.css';

const todayDOW = new Date().getDay();

function buildDays(mode) {
  const weekday  = mode === 'evening' ? EVENING_WEEKDAY  : WEEKDAY;
  const saturday = mode === 'evening' ? EVENING_SATURDAY : SATURDAY;
  const sunday   = mode === 'evening' ? EVENING_SUNDAY   : SUNDAY;
  return [
    { name: 'Monday',    short: 'MON', dayOfWeek: 1, schedule: weekday  },
    { name: 'Tuesday',   short: 'TUE', dayOfWeek: 2, schedule: weekday  },
    { name: 'Wednesday', short: 'WED', dayOfWeek: 3, schedule: weekday  },
    { name: 'Thursday',  short: 'THU', dayOfWeek: 4, schedule: weekday  },
    { name: 'Friday',    short: 'FRI', dayOfWeek: 5, schedule: weekday  },
    { name: 'Saturday',  short: 'SAT', dayOfWeek: 6, schedule: saturday },
    { name: 'Sunday',    short: 'SUN', dayOfWeek: 0, schedule: sunday   },
  ];
}

export default function WeeklyView() {
  const [gymMode, setGymMode] = useState(getStoredGymMode);
  const legendCats = Object.entries(CATEGORIES).filter(([k]) => k !== 'sleep');
  const DAYS = buildDays(gymMode);

  useEffect(() => {
    const handler = () => setGymMode(getStoredGymMode());
    window.addEventListener(GYM_MODE_CHANGE_EVENT, handler);
    return () => window.removeEventListener(GYM_MODE_CHANGE_EVENT, handler);
  }, []);

  const handleGymModeChange = (mode) => {
    setGymMode(mode);
    setStoredGymMode(mode);
    window.dispatchEvent(new Event(GYM_MODE_CHANGE_EVENT));
  };

  return (
    <div className="wv-page">
      <div className="page-header wv-header">
        <div>
          <h2>Weekly Schedule</h2>
          <p>Full Mon–Sun timetable — color-coded by activity type</p>
        </div>
        <div className="path-tabs">
          <button
            className={`path-tab${gymMode === 'morning' ? ' active' : ''}`}
            onClick={() => handleGymModeChange('morning')}
          >
            🌅 Morning Gym
          </button>
          <button
            className={`path-tab${gymMode === 'evening' ? ' active' : ''}`}
            onClick={() => handleGymModeChange('evening')}
          >
            🌙 Evening Gym
          </button>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="wv-legend">
        {legendCats.map(([key, cat]) => (
          <span key={key} className="wv-legend-chip" style={{ '--cc': cat.color, '--cb': cat.bg }}>
            <span className="wv-legend-dot" />
            {cat.label}
          </span>
        ))}
      </div>

      {/* ── Day columns ── */}
      <div className="wv-grid">
        {DAYS.map(day => {
          const isToday = day.dayOfWeek === todayDOW;
          return (
            <div key={day.name} className={`wv-col${isToday ? ' wv-today' : ''}`}>
              <div className="wv-day-header">
                <span className="wv-day-short">{day.short}</span>
                <span className="wv-day-name">{day.name}</span>
                {isToday && <span className="wv-today-badge">Today</span>}
              </div>

              <div className="wv-blocks">
                {day.schedule.map((block, i) => {
                  const cat = CATEGORIES[block.cat] || CATEGORIES.break;
                  return (
                    <div
                      key={i}
                      className="wv-block"
                      style={{ '--cc': cat.color, '--cb': cat.bg }}
                    >
                      <span className="wv-block-time">{block.time}</span>
                      <span className="wv-block-label">{block.label}</span>
                      {block.duration && <span className="wv-block-dur">{block.duration}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
