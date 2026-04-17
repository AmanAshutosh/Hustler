// src/pages/Heatmap/Heatmap.jsx
import { useEffect, useRef, useState } from 'react';
import api from '../../lib/api.js';
import './Heatmap.css';

function buildDays() {
  const days = [], today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOW = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function Heatmap() {
  const [dataMap, setDataMap] = useState({});
  const [summary, setSummary] = useState(null);
  const [tooltip, setTooltip] = useState(null); // { text, x, y }
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    Promise.all([api.get('/stats/heatmap'), api.get('/stats/summary')]).then(([hm, sum]) => {
      const map = {};
      hm.data.forEach(d => { map[d.date] = { hours: d.hours, sessions: d.sessions, level: d.level }; });
      setDataMap(map); setSummary(sum.data);
    }).finally(() => setLoading(false));
  }, []);

  const days = buildDays();
  const today = new Date().toISOString().split('T')[0];
  const startDow = new Date(days[0]).getDay();
  const padded = [...Array(startDow).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));

  const monthLabels = [];
  weeks.forEach((week, wi) => {
    const first = week.find(d => d !== null);
    if (!first) return;
    const m = new Date(first).getMonth();
    if (!monthLabels.length || monthLabels[monthLabels.length - 1].month !== m)
      monthLabels.push({ wi, month: m, label: MONTHS[m] });
  });

  const totalStudied = Object.values(dataMap).filter(d => d.sessions > 0).length;

  function handleMouseEnter(e, day) {
    const info = dataMap[day];
    const sessions = info?.sessions || 0;
    const hours = info?.hours || 0;

    let text;
    if (sessions === 0) {
      text = `${formatDate(day)} · No study`;
    } else {
      text = `${formatDate(day)} · ${sessions} session${sessions !== 1 ? 's' : ''} · ${hours.toFixed(1)}h`;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const gridRect = gridRef.current?.getBoundingClientRect();
    setTooltip({
      text,
      x: rect.left - (gridRect?.left || 0) + rect.width / 2,
      y: rect.top - (gridRect?.top || 0) - 6,
    });
  }

  if (loading) return <div className="heatmap-page"><p>Loading...</p></div>;

  return (
    <div className="heatmap-page">
      <div className="page-header">
        <h2>Study heatmap</h2>
        <p>Every cell is a day you showed up. Keep the chain alive.</p>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-val" style={{ color: 'var(--accent)' }}>{summary?.totalHours || 0}h</div>
          <div className="metric-lbl">Total hours</div>
        </div>
        <div className="metric-card">
          <div className="metric-val" style={{ color: '#ea580c' }}>{summary?.streak || 0}🔥</div>
          <div className="metric-lbl">Current streak</div>
        </div>
        <div className="metric-card">
          <div className="metric-val" style={{ color: 'var(--green)' }}>{totalStudied}</div>
          <div className="metric-lbl">Days studied</div>
        </div>
        <div className="metric-card">
          <div className="metric-val" style={{ color: 'var(--blue)' }}>{summary?.totalSessions || 0}</div>
          <div className="metric-lbl">Sessions</div>
        </div>
      </div>

      <div className="card">
        <div className="heatmap-wrap" ref={gridRef}>
          <div className="month-labels">
            {weeks.map((_, wi) => {
              const ml = monthLabels.find(m => m.wi === wi);
              return <div key={wi} className="month-label-cell">{ml ? ml.label : ''}</div>;
            })}
          </div>

          <div className="heatmap-body">
            <div className="dow-labels">
              {DOW.map((d, i) => <div key={i} className="dow-label">{d}</div>)}
            </div>
            <div className="heatmap-grid" style={{ position: 'relative' }}>
              {weeks.map((week, wi) => (
                <div className="hm-col" key={wi}>
                  {week.map((day, di) => {
                    if (!day) return <div key={di} style={{ width: 13, height: 13 }} />;
                    const info = dataMap[day];
                    const level = info?.level ?? 0;
                    return (
                      <div
                        key={di}
                        className={`hm-cell hm-${level}${day === today ? ' hm-today' : ''}`}
                        onMouseEnter={e => handleMouseEnter(e, day)}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              ))}

              {tooltip && (
                <div
                  className="hm-tooltip-bubble"
                  style={{ left: tooltip.x, top: tooltip.y }}
                >
                  {tooltip.text}
                </div>
              )}
            </div>
          </div>

          <div className="heatmap-footer">
            <span className="hm-legend-label">Less</span>
            <div className="hm-legend">
              {[0,1,2,3,4].map(l => (
                <div key={l} className={`hm-sq hm-${l}`} title={
                  l === 0 ? 'No sessions'
                  : l === 1 ? '1 session'
                  : l === 2 ? '2–3 sessions'
                  : l === 3 ? '4–5 sessions'
                  : '6+ sessions'
                } />
              ))}
            </div>
            <span className="hm-legend-label">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
