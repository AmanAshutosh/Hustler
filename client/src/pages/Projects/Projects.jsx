// src/pages/Projects/Projects.jsx
import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import toast from 'react-hot-toast';
import './Projects.css';

const SUGGESTED = [
  {
    name: 'Real-time Chat App',
    description: 'React + Node + Socket.io. Rooms, direct messages, online presence, message history.',
    tech_stack: ['React', 'Node.js', 'Socket.io', 'SQLite'],
  },
  {
    name: 'Job Application Tracker',
    description: 'Kanban board: Applied → Interview → Offer → Rejected. CSV export + analytics.',
    tech_stack: ['React', 'Node.js', 'Express', 'SQLite'],
  },
  {
    name: 'AI Code Review Tool',
    description: 'Paste code → get AI-powered review. GitHub OAuth + OpenAI API integration.',
    tech_stack: ['React', 'Node.js', 'OpenAI API', 'GitHub OAuth'],
  },
  {
    name: 'Hustler 2.0 (this app)',
    description: 'The full version of this tracker — Hustler 2.0 with auth, DB, and all features — your flagship project.',
    tech_stack: ['React', 'Node.js', 'Express', 'lowdb', 'Zustand'],
  },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', tech_stack: '',
    github_url: '', live_url: '', status: 'in-progress',
  });

  useEffect(() => {
    api.get('/projects').then(({ data }) => setProjects(data)).finally(() => setLoading(false));
  }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/projects', {
        ...form,
        tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      });
      setProjects(prev => [data, ...prev]);
      setShowForm(false);
      setForm({ name: '', description: '', tech_stack: '', github_url: '', live_url: '', status: 'in-progress' });
      toast.success('Project added!');
    } catch { toast.error('Failed to add'); }
  };

  const updateStatus = async (id, status) => {
    const { data } = await api.patch(`/projects/${id}`, { status });
    setProjects(prev => prev.map(p => p.id === id ? data : p));
  };

  const remove = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success('Removed');
  };

  const addSuggested = s => {
    setForm({
      name: s.name, description: s.description,
      tech_stack: s.tech_stack.join(', '),
      github_url: '', live_url: '', status: 'planned',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="projects-page">
      <div className="flex-between page-header">
        <div>
          <h2>Projects</h2>
          <p>Build 3–4 strong projects. Quality beats quantity every time.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(f => !f)}>+ Add project</button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card accent-border">
          <div className="sec-title">New project</div>
          <form onSubmit={submit}>
            <div className="form-field">
              <label className="field-label">Project name</label>
              <input value={form.name} onChange={set('name')} placeholder="e.g. Real-time Chat App" required />
            </div>
            <div className="form-field">
              <label className="field-label">Description</label>
              <input value={form.description} onChange={set('description')} placeholder="What it does in one sentence" />
            </div>
            <div className="form-field">
              <label className="field-label">Tech stack (comma separated)</label>
              <input value={form.tech_stack} onChange={set('tech_stack')} placeholder="React, Node.js, Socket.io, SQLite" />
            </div>
            <div className="form-row">
              <div>
                <label className="field-label">GitHub URL</label>
                <input value={form.github_url} onChange={set('github_url')} placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="field-label">Live URL</label>
                <input value={form.live_url} onChange={set('live_url')} placeholder="https://yourapp.com" />
              </div>
            </div>
            <div className="form-field">
              <label className="field-label">Status</label>
              <select value={form.status} onChange={set('status')} style={{ width: 'auto' }}>
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-sm">Save</button>
              <button type="button" className="btn btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Projects list */}
      {loading && <p className="empty-msg">Loading...</p>}
      {!loading && projects.length === 0 && !showForm && (
        <p className="empty-msg">No projects yet. Add one or pick a suggestion below.</p>
      )}

      {projects.map(p => (
        <div className="project-card" key={p.id}>
          <div className="project-top">
            <div>
              <div className="project-name">{p.name}</div>
              {p.description && <div className="project-desc">{p.description}</div>}
            </div>
            <div className="project-right">
              <span className={`badge badge-${p.status}`}>{p.status}</span>
              <button className="del-btn" onClick={() => remove(p.id)}>✕</button>
            </div>
          </div>

          {(p.tech_stack || []).length > 0 && (
            <div className="chips">
              {p.tech_stack.map(t => <span className="chip" key={t}>{t}</span>)}
            </div>
          )}

          <div className="project-links">
            {p.github_url && (
              <a href={p.github_url} target="_blank" rel="noreferrer" className="project-link github">
                GitHub ↗
              </a>
            )}
            {p.live_url && (
              <a href={p.live_url} target="_blank" rel="noreferrer" className="project-link live">
                Live ↗
              </a>
            )}
            <select
              className="status-select"
              value={p.status}
              onChange={e => updateStatus(p.id, e.target.value)}
            >
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      ))}

      {/* Suggested projects */}
      <div className="suggested-section">
        <div className="suggested-title">Suggested portfolio projects</div>
        <div className="suggested-grid">
          {SUGGESTED.map(s => (
            <div className="suggested-card" key={s.name}>
              <div className="suggested-name">{s.name}</div>
              <div className="suggested-desc">{s.description}</div>
              <div className="chips" style={{ marginBottom: 12 }}>
                {s.tech_stack.map(t => <span className="chip" key={t}>{t}</span>)}
              </div>
              <button className="text-link" onClick={() => addSuggested(s)}>Add to tracker →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
