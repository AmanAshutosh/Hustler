// src/pages/Heatmap/Heatmap.jsx
import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import './Heatmap.css';

function getLevel(h) {
  if (!h || h === 0) return 0;
  if (h < 2) return 1; if (h < 4) return 2; if (h < 7) return 3; return 4;
}

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

export default function Heatmap() {
  const [dataMap, setDataMap] = useState({});
  const [summary, setSummary] = useState(null);
  const [tooltip, setTooltip] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/stats/heatmap'), api.get('/stats/summary')]).then(([hm, sum]) => {
      const map = {};
      hm.data.forEach(d => { map[d.date] = d.hours; });
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

  const totalStudied = Object.values(dataMap).filter(h => h > 0).length;

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
        <div className="heatmap-wrap">
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
            <div className="heatmap-grid">
              {weeks.map((week, wi) => (
                <div className="hm-col" key={wi}>
                  {week.map((day, di) => {
                    if (!day) return <div key={di} style={{ width: 12, height: 12 }} />;
                    const hours = dataMap[day] || 0;
                    const level = getLevel(hours);
                    return (
                      <div
                        key={di}
                        className={`hm-cell hm-${level}${day === today ? ' hm-today' : ''}`}
                        onMouseEnter={() => setTooltip(`${day}: ${hours > 0 ? hours.toFixed(1) + 'h' : 'no study'}`)}
                        onMouseLeave={() => setTooltip('')}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="heatmap-footer">
            <span className="hm-tooltip">{tooltip || 'Hover a cell to see details'}</span>
            <div className="hm-legend">
              <span>Less</span>
              {[0,1,2,3,4].map(l => <div key={l} className={`hm-sq hm-${l}`} />)}
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
