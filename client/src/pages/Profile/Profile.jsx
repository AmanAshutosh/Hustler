// src/pages/Profile/Profile.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api.js';
import { useAuth } from '../../store/auth.js';
import toast from 'react-hot-toast';
import { Play } from 'lucide-react';
import { STACK_FS, STACK_DA, DAILY_SCHEDULE, MONTHLY_PLAN, CATEGORIES } from '../../data/careerData.js';
import { exportScheduleToCalendar, getGCalLinks, getSchedulePreview } from '../../lib/calendar.js';
import './Profile.css';

const SOCIAL_LINKS = [
  { label: 'GitHub',   key: 'github_url' },
  { label: 'LeetCode', key: 'leetcode_url' },
  { label: 'GFG',      key: 'gfg_url' },
  { label: 'X',        key: 'x_url' },
  { label: 'LinkedIn', key: 'linkedin_url' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser }   = useAuth();
  const [summary, setSummary]   = useState(null);
  const [userData, setUserData] = useState(null);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({
    name: '', github_url: '', leetcode_url: '',
    gfg_url: '', x_url: '', linkedin_url: '',
  });
  const [showCalPreview, setShowCalPreview] = useState(false);
  const [showGCalLinks, setShowGCalLinks]   = useState(false);

  useEffect(() => {
    Promise.all([api.get('/stats/summary'), api.get('/user/me')]).then(([s, u]) => {
      setSummary(s.data);
      setUserData(u.data);
      setForm({
        name:         u.data.name         || '',
        github_url:   u.data.github_url   || '',
        leetcode_url: u.data.leetcode_url || '',
        gfg_url:      u.data.gfg_url      || '',
        x_url:        u.data.x_url        || '',
        linkedin_url: u.data.linkedin_url || '',
      });
    });
  }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch('/user/me', form);
      setUserData(data);
      setUser({ ...user, name: data.name });
      setEditing(false);
      toast.success('Profile saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const daysSince = userData?.created_at
    ? Math.floor((Date.now() - new Date(userData.created_at)) / 86400000) + 1
    : 1;

  const shareText =
    `🚀 Day ${daysSince} of my dev grind — HUSTLER update\n\n` +
    `📚 ${summary?.totalHours || 0}h of focused study\n` +
    `⚡ ${summary?.dsaTotal || 0}/150 Neetcode problems solved\n` +
    `🔥 ${summary?.streak || 0} day streak\n` +
    `🗂 ${summary?.projectsTotal || 0} projects built\n\n` +
    `Grinding toward Full-Stack Dev + Data Analytics roles 💪\n\n` +
    `#100DaysOfCode #FullStack #DataAnalytics #JavaScript #React #NodeJS #SQL #PowerBI`;

  const shareX  = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  const shareLI = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(form.github_url || 'https://github.com')}`, '_blank');

  const subMap = {};
  (summary?.subjectHours || []).forEach(s => { subMap[s.subject] = s.hours; });

  const activeLinks = SOCIAL_LINKS.filter(l => userData?.[l.key]);

  return (
    <div className="profile-page">
      <div className="page-header">
        <h2>Profile</h2>
        <p>Your portfolio card — share your progress with the world.</p>
      </div>

      {/* Portfolio card */}
      <div className="portfolio-card">
        <div className="portfolio-top">
          <div className="portfolio-identity">
            <div className="avatar">{user?.avatarInitials || 'AA'}</div>
            <div>
              <div className="portfolio-name">{userData?.name || user?.name}</div>
              <div className="portfolio-role">Full-Stack Dev + Data Analytics · Day {daysSince}</div>
            </div>
          </div>
          <button className="edit-btn" onClick={() => setEditing(e => !e)}>
            {editing ? 'Cancel' : 'Edit profile'}
          </button>
        </div>

        <div className="pstat-grid">
          <div className="pstat">
            <div className="pstat-n">{summary?.totalHours || 0}h</div>
            <div className="pstat-l">Studied</div>
          </div>
          <div className="pstat">
            <div className="pstat-n">{summary?.dsaTotal || 0}/150</div>
            <div className="pstat-l">DSA done</div>
          </div>
          <div className="pstat">
            <div className="pstat-n">{summary?.streak || 0}🔥</div>
            <div className="pstat-l">Streak</div>
          </div>
        </div>

        {!editing ? (
          <>
            <div className="link-chips">
              {activeLinks.length > 0
                ? activeLinks.map(l => (
                    <a key={l.key} href={userData[l.key]} target="_blank" rel="noreferrer" className="link-chip">
                      {l.label} ↗
                    </a>
                  ))
                : <span className="no-links">No links added. Click "Edit profile" to add your social links.</span>
              }
            </div>
            <div className="share-row">
              <button className="share-btn share-x" onClick={shareX}>Share to X</button>
              <button className="share-btn share-li" onClick={shareLI}>Share to LinkedIn</button>
            </div>
          </>
        ) : (
          <div className="edit-form">
            <div className="edit-field">
              <label className="field-label">Name</label>
              <input value={form.name} onChange={set('name')} placeholder="Your full name" />
            </div>
            {SOCIAL_LINKS.map(l => (
              <div className="edit-field" key={l.key}>
                <label className="field-label">{l.label} URL</label>
                <input value={form[l.key]} onChange={set(l.key)} placeholder="https://..." />
              </div>
            ))}
            <div className="edit-actions">
              <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button className="btn btn-sm" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Share preview */}
      <div className="card">
        <div className="sec-title">Share preview</div>
        <pre className="share-preview">{shareText}</pre>
      </div>

      {/* Add to Calendar */}
      <div className="card cal-card">
        <div className="sec-title">Add to Calendar</div>
        <div className="tt-subtitle">Export your full Mon–Sun schedule as recurring weekly events</div>

        {/* Schedule preview */}
        <div className="cal-preview-wrap">
          <button
            className="cal-preview-toggle"
            onClick={() => setShowCalPreview(p => !p)}
          >
            {showCalPreview ? 'Hide preview' : 'Preview schedule before export'}
            <span className="cal-preview-caret">{showCalPreview ? '▲' : '▼'}</span>
          </button>
          {showCalPreview && (
            <pre className="cal-preview-text">{getSchedulePreview()}</pre>
          )}
        </div>

        {/* Three action buttons */}
        <div className="cal-actions">
          {/* Apple Calendar */}
          <button className="cal-action-btn cal-action-apple" onClick={exportScheduleToCalendar}>
            <span className="cal-action-icon"></span>
            <span className="cal-action-body">
              <span className="cal-action-title">Add to Apple Calendar</span>
              <span className="cal-action-sub">Downloads .ics · opens in Calendar app on iPhone/Mac</span>
            </span>
          </button>

          {/* Google Calendar */}
          <button
            className="cal-action-btn cal-action-google"
            onClick={() => setShowGCalLinks(p => !p)}
          >
            <span className="cal-action-icon">G</span>
            <span className="cal-action-body">
              <span className="cal-action-title">Add to Google Calendar</span>
              <span className="cal-action-sub">
                {showGCalLinks ? 'Tap an event below to add it' : 'Tap to show individual event links'}
              </span>
            </span>
            <span className="cal-preview-caret">{showGCalLinks ? '▲' : '▼'}</span>
          </button>

          {showGCalLinks && (
            <div className="cal-links-grid">
              {getGCalLinks().map((slot, i) => (
                <a
                  key={i}
                  href={slot.gcalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cal-link-btn"
                  style={{ '--cal-color': CATEGORIES[slot.cat]?.color || 'var(--accent)' }}
                >
                  <span className="cal-link-dot" />
                  <span className="cal-link-info">
                    <span className="cal-link-label">{slot.label}</span>
                    <span className="cal-link-meta">{slot.time} · {slot.dayType}</span>
                  </span>
                  <span className="cal-link-icon">+</span>
                </a>
              ))}
            </div>
          )}

          {/* Download ICS */}
          <button className="cal-action-btn cal-action-ics" onClick={exportScheduleToCalendar}>
            <span className="cal-action-icon">↓</span>
            <span className="cal-action-body">
              <span className="cal-action-title">Download ICS</span>
              <span className="cal-action-sub">RFC 5545 file · import into any calendar app</span>
            </span>
          </button>
        </div>

        <p className="cal-hint">
          All 7 days are exported as weekly recurring events in IST (Asia/Kolkata).
          Overnight events like Sleep (10:00 PM – 06:00 AM) are handled correctly.
        </p>
      </div>

      {/* Daily timetable */}
      <div className="card">
        <div className="sec-title">Daily Schedule</div>
        <div className="tt-subtitle">Wake up 6am · Gym + breakfast · Free from 11am · ~7h study/day</div>
        <div className="tt-daily">
          {DAILY_SCHEDULE.map((slot, i) => (
            <div key={i} className={`tt-slot tt-slot-${slot.type}`}>
              <div className="tt-time">{slot.time}</div>
              <div className="tt-info">
                <span className="tt-label">{slot.label}</span>
                <span className="tt-desc">{slot.desc}</span>
              </div>
              {slot.duration && <span className="tt-dur">{slot.duration}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 6-Month Plan */}
      <div className="card">
        <div className="sec-title">6-Month Career Plan — Week by Week</div>
        <div className="tt-subtitle">FS + DA running in parallel · Sat = projects + revision</div>
        {MONTHLY_PLAN.map(month => (
          <div key={month.month} className="tt-month">
            <div className="tt-month-header" style={{ borderColor: month.color }}>
              <span className="tt-month-num" style={{ color: month.color }}>Month {month.month}</span>
              <span className="tt-month-title">{month.title}</span>
            </div>
            {month.weeks.map(w => (
              <div key={w.week} className="tt-week-row">
                <div className="tt-week-meta">
                  <span className="tt-week-badge">Week {w.week}</span>
                  <span className="tt-week-subj" style={{ color: month.color }}>{w.subject}</span>
                </div>
                <div className="tt-week-topic">{w.topic}</div>
                <button
                  className="tt-study-btn"
                  onClick={() => navigate('/timer', { state: { subject: w.subject, topic: w.topic } })}
                >
                  <Play size={10} /> Study
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* FS Stack progress */}
      <div className="card">
        <div className="sec-title">Full Stack Mastery</div>
        {STACK_FS.map(s => {
          const hours = subMap[s.key] || 0;
          const pct   = Math.min(100, Math.round((hours / s.target) * 100));
          return (
            <div className="bar-row" key={s.label}>
              <div className="bar-label">
                <span>{s.label}</span>
                <span>{hours}h / {s.target}h · {pct}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
              </div>
            </div>
          );
        })}
        {(() => {
          const dsa = summary?.dsaTotal || 0;
          const pct = Math.round((dsa / 150) * 100);
          return (
            <div className="bar-row" style={{ marginTop: 8 }}>
              <div className="bar-label">
                <span>DSA — Neetcode 150</span>
                <span>{dsa}/150 · {pct}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%`, background: 'var(--purple)' }} />
              </div>
            </div>
          );
        })()}
      </div>

      {/* DA Stack progress */}
      <div className="card">
        <div className="sec-title">Data Analytics Mastery</div>
        {STACK_DA.map(s => {
          const hours = subMap[s.key] || 0;
          const pct   = Math.min(100, Math.round((hours / s.target) * 100));
          return (
            <div className="bar-row" key={s.label}>
              <div className="bar-label">
                <span>{s.label}</span>
                <span>{hours}h / {s.target}h · {pct}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%`, background: '#f59e0b' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
