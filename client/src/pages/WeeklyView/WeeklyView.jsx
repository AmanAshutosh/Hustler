// src/pages/WeeklyView/WeeklyView.jsx
import { WEEKDAY, SATURDAY, SUNDAY, CATEGORIES } from '../../data/schedule.js';
import './WeeklyView.css';

const DAYS = [
  { name: 'Monday',    short: 'MON', dayOfWeek: 1, schedule: WEEKDAY  },
  { name: 'Tuesday',   short: 'TUE', dayOfWeek: 2, schedule: WEEKDAY  },
  { name: 'Wednesday', short: 'WED', dayOfWeek: 3, schedule: WEEKDAY  },
  { name: 'Thursday',  short: 'THU', dayOfWeek: 4, schedule: WEEKDAY  },
  { name: 'Friday',    short: 'FRI', dayOfWeek: 5, schedule: WEEKDAY  },
  { name: 'Saturday',  short: 'SAT', dayOfWeek: 6, schedule: SATURDAY },
  { name: 'Sunday',    short: 'SUN', dayOfWeek: 0, schedule: SUNDAY   },
];

const todayDOW = new Date().getDay();

export default function WeeklyView() {
  const legendCats = Object.entries(CATEGORIES).filter(([k]) => k !== 'sleep');

  return (
    <div className="wv-page">
      <div className="page-header">
        <h2>Weekly Schedule</h2>
        <p>Full Mon–Sun timetable — color-coded by activity type</p>
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
