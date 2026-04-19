// src/pages/Timer/Timer.jsx
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, Pause, Square, Clock, Bell, Trash2 } from 'lucide-react';
import api from '../../lib/api.js';
import toast from 'react-hot-toast';
import './Timer.css';

const SUBJECTS = [
  'JavaScript (ES6+)', 'React', 'Node.js', 'DSA',
  'System Design', 'SQL', 'DBMS', 'Operating System', 'Computer Networks',
  'English', 'Projects', 'Other',
];

function fmt(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':');
}

function fmtDur(s) {
  if (!s) return '—';
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function playAlarm() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.35, 0.7].forEach(t => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880; osc.type = 'sine';
      gain.gain.setValueAtTime(0.45, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.28);
      osc.start(ctx.currentTime + t); osc.stop(ctx.currentTime + t + 0.28);
    });
  } catch {}
}

export default function Timer() {
  const location = useLocation();
  const preSubject = location.state?.subject;
  const preTopic   = location.state?.topic;

  const [subject, setSubject]     = useState(preSubject || SUBJECTS[0]);
  const [topic, setTopic]         = useState(preTopic   || '');
  const [running, setRunning]     = useState(false);
  const [paused, setPaused]       = useState(false);
  const [elapsed, setElapsed]     = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions]   = useState([]);
  const [alarm, setAlarm]         = useState(null);

  const intervalRef   = useRef(null);
  const pausedAccRef  = useRef(0);
  const pauseStartRef = useRef(null);
  const runningRef    = useRef(false);
  const sessionIdRef  = useRef(null);

  // Keep refs in sync so polling closure always reads fresh values
  useEffect(() => { runningRef.current = running; },   [running]);
  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);

  function applyActiveSession(data) {
    const isPaused = !!data.paused_at;
    const elapsedSince = isPaused
      ? Math.floor((new Date(data.paused_at) - new Date(data.started_at)) / 1000) - (data.paused_secs || 0)
      : Math.floor((Date.now() - new Date(data.started_at)) / 1000) - (data.paused_secs || 0);

    setSessionId(data.id);
    setSubject(data.subject);
    setTopic(data.topic);
    setElapsed(Math.max(0, elapsedSince));
    pausedAccRef.current = data.paused_secs || 0;
    setRunning(true);

    if (isPaused) {
      setPaused(true);
      pauseStartRef.current = new Date(data.paused_at).getTime();
    } else {
      setPaused(false);
      tick();
    }
  }

  useEffect(() => {
    api.get('/sessions?limit=25').then(({ data }) => setSessions(data.sessions));
    api.get('/sessions/active').then(({ data }) => {
      if (data) applyActiveSession(data);
    }).catch(() => {});
    return () => clearInterval(intervalRef.current);
  }, []);

  // Poll every 10 s to sync state across devices / tabs
  useEffect(() => {
    const poll = setInterval(() => {
      api.get('/sessions/active').then(({ data }) => {
        const isRunning  = runningRef.current;
        const currentId  = sessionIdRef.current;

        if (!data && isRunning) {
          // Session was ended from another device
          clearInterval(intervalRef.current);
          setRunning(false); setPaused(false); setElapsed(0);
          setSessionId(null); pausedAccRef.current = 0; pauseStartRef.current = null;
          toast('Session ended on another device');
          api.get('/sessions?limit=25').then(({ data: d }) => setSessions(d.sessions));
        } else if (data && !isRunning) {
          // Session started on another device
          applyActiveSession(data);
        } else if (data && isRunning && data.id !== currentId) {
          // Different session now active (e.g. previous one was auto-closed)
          clearInterval(intervalRef.current);
          applyActiveSession(data);
        }
      }).catch(() => {});
    }, 10000);
    return () => clearInterval(poll);
  }, []);

  function tick() {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  }

  async function handleStart() {
    try {
      const { data } = await api.post('/sessions/start', { subject, topic: topic || 'General' });
      setSessionId(data.id); setElapsed(0); pausedAccRef.current = 0; pauseStartRef.current = null;
      setRunning(true); setPaused(false); tick();
      toast.success('Session started!');
    } catch { toast.error('Failed to start'); }
  }

  async function handlePause() {
    if (!paused) {
      // Pause
      clearInterval(intervalRef.current);
      pauseStartRef.current = Date.now();
      setPaused(true);
      // Persist pause to server so tab-close / navigation restores correctly
      api.patch(`/sessions/${sessionId}/pause`).catch(() => {});
    } else {
      // Resume
      pausedAccRef.current += Math.floor((Date.now() - pauseStartRef.current) / 1000);
      setPaused(false);
      tick();
      // Sync accumulated pause to server
      api.patch(`/sessions/${sessionId}/resume`).catch(() => {});
    }
  }

  async function handleStop() {
    clearInterval(intervalRef.current);
    if (paused && pauseStartRef.current) {
      pausedAccRef.current += Math.floor((Date.now() - pauseStartRef.current) / 1000);
    }
    try {
      const { data } = await api.post(`/sessions/${sessionId}/end`, { pausedSecs: pausedAccRef.current });
      playAlarm();
      setAlarm({ subject: data.subject, duration: data.duration_secs });
      setSessions(prev => [data, ...prev.filter(s => s.id !== data.id)]);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to end session';
      toast.error(msg);
    }
    setRunning(false); setPaused(false); setElapsed(0);
    setSessionId(null); pausedAccRef.current = 0; pauseStartRef.current = null;
  }

  async function handleDeleteSession(id) {
    try {
      await api.delete(`/sessions/${id}`);
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch { toast.error('Failed to delete session'); }
  }

  async function handleDeleteAll() {
    if (!window.confirm('Delete all completed sessions? This cannot be undone.')) return;
    try {
      await api.delete('/sessions/all');
      setSessions(prev => prev.filter(s => s.is_active));
      toast.success('All sessions cleared');
    } catch { toast.error('Failed to delete sessions'); }
  }

  const clockClass = !running ? 'inactive' : paused ? 'paused' : 'running';
  const completedSessions = sessions.filter(s => !s.is_active);

  return (
    <div className="timer-page">
      <div className="page-header">
        <h2>Session Timer</h2>
        <p>Every second you track is a second of proof.</p>
      </div>

      <div className="card">
        <div className="select-row">
          <div className="field-group">
            <label className="field-label">Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)} disabled={running}>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Topic</label>
            <input
              type="text" value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Closures, useEffect, Two Sum"
              disabled={running}
            />
          </div>
        </div>

        <div className={`timer-clock ${clockClass}`}>{fmt(elapsed)}</div>

        <div className={`timer-status${running && !paused ? ' live' : paused ? ' paused-text' : ''}`}>
          {!running
            ? 'Select subject and start'
            : paused
            ? 'Paused — click Resume'
            : `${subject} · ${topic || 'General'}`}
        </div>

        <div className="btn-row">
          {!running
            ? <button className="btn btn-start" onClick={handleStart}>
                <Play size={14} /> Start session
              </button>
            : <>
                <button className="btn" onClick={handlePause}>
                  {paused ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>}
                </button>
                <button className="btn btn-stop" onClick={handleStop}>
                  <Square size={14} /> End session
                </button>
              </>
          }
        </div>
      </div>

      <div className="card">
        <div className="session-log-header">
          <div className="sec-title"><Clock size={12} /> Session Log</div>
          {completedSessions.length > 0 && (
            <button className="btn btn-clear-all" onClick={handleDeleteAll}>
              <Trash2 size={12} /> Clear all
            </button>
          )}
        </div>
        {completedSessions.length === 0
          ? <p className="empty-msg">No sessions yet.</p>
          : (
            <table className="log-table">
              <thead>
                <tr>
                  <th>Subject</th><th>Topic</th><th>Started</th>
                  <th style={{ textAlign: 'right' }}>Duration</th>
                  <th style={{ width: 32 }}></th>
                </tr>
              </thead>
              <tbody>
                {completedSessions.map(s => (
                  <tr key={s.id}>
                    <td className="td-subj">{s.subject}</td>
                    <td className="td-topic">{s.topic}</td>
                    <td className="td-time">
                      {new Date(s.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="td-dur">{fmtDur(s.duration_secs)}</td>
                    <td className="td-del">
                      <button
                        className="btn-del"
                        onClick={() => handleDeleteSession(s.id)}
                        title="Delete session"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>

      {alarm && (
        <div className="overlay" onClick={() => setAlarm(null)}>
          <div className="alarm-modal" onClick={e => e.stopPropagation()}>
            <div className="alarm-icon"><Bell size={32} /></div>
            <div className="alarm-title">Session complete!</div>
            <div className="alarm-sub">{alarm.subject} · {fmtDur(alarm.duration)} logged</div>
            <button className="btn btn-start" onClick={() => setAlarm(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
