// src/pages/Heatmap/Heatmap.jsx
import { useEffect, useRef, useState } from 'react';
import {
  History, LogIn, LogOut, UserPlus, Play, Pause, Clock, Trash2,
  CheckCircle2, Zap, FolderKanban, TrendingUp, Trophy,
} from 'lucide-react';
import api from '../../lib/api.js';
import './Heatmap.css';

const ACTIVITY_META = {
  register:         { icon: UserPlus,     label: 'Account created' },
  login:             { icon: LogIn,        label: 'Logged in' },
  logout:            { icon: LogOut,       label: 'Logged out' },
  session_start:     { icon: Play,         label: 'Session started' },
  session_pause:     { icon: Pause,        label: 'Session paused' },
  session_resume:    { icon: Play,         label: 'Session resumed' },
  session_end:       { icon: Clock,        label: 'Session completed' },
  session_delete:    { icon: Trash2,       label: 'Session deleted' },
  habit_update:      { icon: CheckCircle2, label: 'Daily habits updated' },
  dsa_solved:        { icon: Zap,          label: 'DSA problem solved' },
  dsa_delete:        { icon: Trash2,       label: 'DSA problem removed' },
  project_create:    { icon: FolderKanban, label: 'Project started' },
  project_update:    { icon: FolderKanban, label: 'Project updated' },
  project_complete:  { icon: Trophy,       label: 'Project completed' },
  project_delete:    { icon: Trash2,       label: 'Project deleted' },
  subject_progress:  { icon: TrendingUp,   label: 'Subject progress' },
  goal_complete:     { icon: Trophy,       label: 'Goal completed' },
  goal_update:       { icon: Trophy,       label: 'Goal updated' },
  profile_update:    { icon: UserPlus,     label: 'Profile updated' },
};

function fmtDuration(secs) {
  if (!secs) return null;
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmtTimestamp(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// All heatmap dates are compared as UTC "YYYY-MM-DD" strings (matching the
// server, which derives them from ISO timestamps). Anchoring on local midnight
// and then reading back via toISOString() (as this used to do) silently shifts
// the whole grid by a day in any timezone ahead of UTC — e.g. in IST (+5:30),
// local midnight is 18:30 UTC the *previous* day, so "today" would render as
// yesterday's date all day long, and today's real activity would never match
// any cell. Building the grid directly off the UTC calendar avoids that.
function buildDays() {
  const days = [];
  const todayStr = new Date().toISOString().split('T')[0];
  for (let i = 363; i >= 0; i--) {
    const d = new Date(todayStr + 'T00:00:00.000Z');
    d.setUTCDate(d.getUTCDate() - i);
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
  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    Promise.all([api.get('/stats/heatmap'), api.get('/stats/summary')]).then(([hm, sum]) => {
      const map = {};
      hm.data.forEach(d => {
        map[d.date] = { hours: d.hours, sessions: d.sessions, activities: d.activities, level: d.level };
      });
      setDataMap(map); setSummary(sum.data);
    }).finally(() => setLoading(false));

    api.get('/activity?limit=20').then(({ data }) => {
      setActivity(data.entries);
      setHasMore(data.hasMore);
    }).catch(() => {}).finally(() => setActivityLoading(false));
  }, []);

  function loadMoreActivity() {
    if (!activity.length || loadingMore) return;
    setLoadingMore(true);
    const before = activity[activity.length - 1].timestamp;
    api.get(`/activity?limit=20&before=${encodeURIComponent(before)}`)
      .then(({ data }) => {
        setActivity(prev => [...prev, ...data.entries]);
        setHasMore(data.hasMore);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }

  const days = buildDays();
  const today = new Date().toISOString().split('T')[0];
  // getDay()/getMonth() read the LOCAL calendar fields of a UTC-midnight instant,
  // which drifts a day in non-UTC timezones — use the UTC getters so the grid
  // alignment matches the UTC date strings it's built from.
  const startDow = new Date(days[0] + 'T00:00:00.000Z').getUTCDay();
  const padded = [...Array(startDow).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));

  const monthLabels = [];
  weeks.forEach((week, wi) => {
    const first = week.find(d => d !== null);
    if (!first) return;
    const m = new Date(first + 'T00:00:00.000Z').getUTCMonth();
    if (!monthLabels.length || monthLabels[monthLabels.length - 1].month !== m)
      monthLabels.push({ wi, month: m, label: MONTHS[m] });
  });

  const totalStudied = summary?.totalActiveDays ?? Object.values(dataMap).filter(d => d.activities > 0).length;

  function handleMouseEnter(e, day) {
    const info = dataMap[day];
    const sessions = info?.sessions || 0;
    const activities = info?.activities || 0;
    const hours = info?.hours || 0;

    let text;
    if (activities === 0) {
      text = `${formatDate(day)} · No activity`;
    } else if (sessions > 0) {
      text = `${formatDate(day)} · ${sessions} session${sessions !== 1 ? 's' : ''} · ${hours.toFixed(1)}h · ${activities} activit${activities !== 1 ? 'ies' : 'y'}`;
    } else {
      text = `${formatDate(day)} · ${activities} activit${activities !== 1 ? 'ies' : 'y'} (no timer)`;
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
          <div className="metric-val" style={{ color: '#93c5fd' }}>{summary?.totalHours || 0}h</div>
          <div className="metric-lbl">Total hours</div>
        </div>
        <div className="metric-card">
          <div className="metric-val" style={{ color: '#f0f6ff' }}>{summary?.streak || 0} 🔥</div>
          <div className="metric-lbl">Current streak</div>
        </div>
        <div className="metric-card">
          <div className="metric-val" style={{ color: '#3b82f6' }}>{totalStudied}</div>
          <div className="metric-lbl">Active days</div>
        </div>
        <div className="metric-card">
          <div className="metric-val" style={{ color: '#93c5fd' }}>{summary?.longestStreak || 0} 🏆</div>
          <div className="metric-lbl">Longest streak</div>
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

      {/* Activity Timeline */}
      <div className="card">
        <div className="sec-title"><History size={12} /> Activity Timeline</div>
        {activityLoading
          ? <p className="empty-msg">Loading…</p>
          : activity.length === 0
          ? <p className="empty-msg">No activity yet. Start a session or update your tracker.</p>
          : (
            <>
              <div className="at-list">
                {activity.map(entry => {
                  const meta = ACTIVITY_META[entry.type] || { icon: History, label: entry.type };
                  const Icon = meta.icon;
                  const dur = fmtDuration(entry.duration_secs);
                  return (
                    <div className="at-row" key={entry.id}>
                      <span className="at-icon"><Icon size={14} /></span>
                      <div className="at-body">
                        <div className="at-top">
                          <span className="at-label">{meta.label}</span>
                          <span className="at-time">{fmtTimestamp(entry.timestamp)}</span>
                        </div>
                        <div className="at-details">
                          {entry.details}
                          {dur && <span className="at-dur"> · {dur}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {hasMore && (
                <button className="btn at-load-more" onClick={loadMoreActivity} disabled={loadingMore}>
                  {loadingMore ? 'Loading…' : 'Load more'}
                </button>
              )}
            </>
          )
        }
      </div>
    </div>
  );
}
