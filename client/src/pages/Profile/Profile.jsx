// src/pages/Profile/Profile.jsx
import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { useAuth } from '../../store/auth.js';
import toast from 'react-hot-toast';
import './Profile.css';

const STACK = [
  { label: 'JavaScript ES6+', key: 'JavaScript (ES6+)', target: 40 },
  { label: 'React',           key: 'React',             target: 35 },
  { label: 'Node.js',         key: 'Node.js',           target: 30 },
  { label: 'System Design',   key: 'System Design',     target: 20 },
  { label: 'DBMS / SQL',      key: 'DBMS / SQL',        target: 15 },
  { label: 'OS / CN',         key: 'OS / CN',           target: 15 },
];

const SOCIAL_LINKS = [
  { label: 'GitHub',   key: 'github_url' },
  { label: 'LeetCode', key: 'leetcode_url' },
  { label: 'GFG',      key: 'gfg_url' },
  { label: 'X',        key: 'x_url' },
  { label: 'LinkedIn', key: 'linkedin_url' },
];

export default function Profile() {
  const { user, setUser }   = useAuth();
  const [summary, setSummary]   = useState(null);
  const [userData, setUserData] = useState(null);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({
    name: '', github_url: '', leetcode_url: '',
    gfg_url: '', x_url: '', linkedin_url: '',
  });

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
    `🚀 Day ${daysSince} of my dev grind — Hustler 2.0 update\n\n` +
    `📚 ${summary?.totalHours || 0}h of focused study\n` +
    `⚡ ${summary?.dsaTotal || 0}/150 Neetcode problems solved\n` +
    `🔥 ${summary?.streak || 0} day streak\n` +
    `🗂 ${summary?.projectsTotal || 0} projects built\n\n` +
    `Grinding toward a full-stack dev role 💪\n\n` +
    `#100DaysOfCode #FullStack #JavaScript #React #NodeJS #DSA`;

  const shareX  = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  const shareLI = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(form.github_url || 'https://github.com/AmanAshutosh')}`, '_blank');

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
              <div className="portfolio-role">Full-Stack Developer in Training · Day {daysSince}</div>
            </div>
          </div>
          <button className="edit-btn" onClick={() => setEditing(e => !e)}>
            {editing ? 'Cancel' : 'Edit profile'}
          </button>
        </div>

        {/* Stats */}
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

        {/* Links or edit form */}
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
                <input value={form[l.key]} onChange={set(l.key)} placeholder={`https://...`} />
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

      {/* Stack progress */}
      <div className="card">
        <div className="sec-title">Stack mastery</div>
        {STACK.map(s => {
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

        {/* DSA separate bar */}
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
    </div>
  );
}
