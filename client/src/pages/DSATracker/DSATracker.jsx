// src/pages/DSATracker/DSATracker.jsx
import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import toast from 'react-hot-toast';
import './DSATracker.css';

const CATEGORIES = [
  { name: 'Arrays & Hashing', total: 9 }, { name: 'Two Pointers', total: 5 },
  { name: 'Sliding Window', total: 6 },   { name: 'Stack', total: 7 },
  { name: 'Binary Search', total: 7 },    { name: 'Linked List', total: 11 },
  { name: 'Trees', total: 15 },           { name: 'Tries', total: 3 },
  { name: 'Heap / Priority Queue', total: 7 }, { name: 'Backtracking', total: 9 },
  { name: 'Graphs', total: 13 },          { name: 'Advanced Graphs', total: 6 },
  { name: '1D Dynamic Programming', total: 12 }, { name: '2D Dynamic Programming', total: 11 },
  { name: 'Greedy', total: 8 },           { name: 'Intervals', total: 6 },
  { name: 'Math & Geometry', total: 8 },  { name: 'Bit Manipulation', total: 7 },
];
const TOTAL = CATEGORIES.reduce((a, c) => a + c.total, 0);

const catColor = (done, total) => {
  const p = done / total;
  if (p === 1) return 'var(--green)';
  if (p >= 0.5) return 'var(--accent)';
  if (p > 0) return 'var(--amber)';
  return 'var(--border2)';
};

export default function DSATracker() {
  const [problems, setProblems]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', category: CATEGORIES[0].name, difficulty: 'medium', time_mins: '', notes: '' });

  useEffect(() => {
    api.get('/dsa').then(({ data }) => setProblems(data)).finally(() => setLoading(false));
  }, []);

  const countByCategory = {};
  problems.forEach(p => { countByCategory[p.category] = (countByCategory[p.category] || 0) + 1; });
  const total = problems.length;
  const pct = Math.round((total / TOTAL) * 100);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const { data } = await api.post('/dsa', { ...form, time_mins: form.time_mins ? parseInt(form.time_mins) : null });
      setProblems(prev => [data, ...prev]);
      setForm({ name: '', category: CATEGORIES[0].name, difficulty: 'medium', time_mins: '', notes: '' });
      setShowForm(false);
      toast.success('Problem logged! 🎉');
    } catch { toast.error('Failed to log'); }
    finally { setSubmitting(false); }
  };

  const remove = async (id) => {
    await api.delete(`/dsa/${id}`);
    setProblems(prev => prev.filter(p => p.id !== id));
    toast.success('Removed');
  };

  return (
    <div className="dsa-page">
      <div className="flex-between page-header">
        <div>
          <h2>DSA Tracker</h2>
          <p>Neetcode 150 — solve every problem in JavaScript</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(f => !f)}>+ Log problem</button>
      </div>

      {/* Overall progress */}
      <div className="card">
        <div className="overall-header">
          <span>{total} / {TOTAL} solved</span>
          <span>{pct}%</span>
        </div>
        <div className="bar-track">
          <div className="bar-fill" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
        </div>
        <div className="diff-stats">
          <span style={{ color: 'var(--green)' }}>● {problems.filter(p => p.difficulty === 'easy').length} Easy</span>
          <span style={{ color: 'var(--amber)' }}>● {problems.filter(p => p.difficulty === 'medium').length} Medium</span>
          <span style={{ color: 'var(--red)'   }}>● {problems.filter(p => p.difficulty === 'hard').length} Hard</span>
        </div>
      </div>

      {/* Log form */}
      {showForm && (
        <div className="card accent-border">
          <div className="sec-title">Log solved problem</div>
          <form onSubmit={submit}>
            <div>
              <label className="field-label">Problem name</label>
              <input value={form.name} onChange={set('name')} placeholder="e.g. Two Sum" required />
            </div>
            <div className="form-grid-3" style={{ marginTop: 10 }}>
              <div>
                <label className="field-label">Category</label>
                <select value={form.category} onChange={set('category')}>
                  {CATEGORIES.map(c => <option key={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Difficulty</label>
                <select value={form.difficulty} onChange={set('difficulty')}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="field-label">Time (mins)</label>
                <input type="number" value={form.time_mins} onChange={set('time_mins')} placeholder="e.g. 25" />
              </div>
            </div>
            <div className="form-grid-1">
              <label className="field-label">Notes / approach</label>
              <input value={form.notes} onChange={set('notes')} placeholder="Key insight used" />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Category grid */}
      <div className="cat-grid">
        {CATEGORIES.map(cat => {
          const done = countByCategory[cat.name] || 0;
          const cp = Math.round((done / cat.total) * 100);
          return (
            <div className="cat-card" key={cat.name}>
              <div className="cat-header">
                <span className="cat-name">{cat.name}</span>
                <span className="cat-count">{done}/{cat.total}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${cp}%`, background: catColor(done, cat.total) }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="card">
        <div className="sec-title">Recently solved</div>
        {loading && <p className="empty-msg">Loading...</p>}
        {!loading && problems.length === 0 && <p className="empty-msg">No problems yet. Start with Two Sum!</p>}
        <table className="problems-table">
          <thead>
            <tr><th>Problem</th><th>Category</th><th>Difficulty</th><th>Time</th><th>Notes</th><th></th></tr>
          </thead>
          <tbody>
            {problems.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td style={{ color: 'var(--text3)' }}>{p.category}</td>
                <td><span className={`badge badge-${p.difficulty}`}>{p.difficulty}</span></td>
                <td style={{ color: 'var(--text3)' }}>{p.time_mins ? `${p.time_mins}m` : '—'}</td>
                <td style={{ color: 'var(--text3)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.notes || '—'}</td>
                <td><button className="del-btn" onClick={() => remove(p.id)}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
