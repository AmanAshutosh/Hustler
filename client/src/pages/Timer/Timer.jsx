// src/pages/Timer/Timer.jsx
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, Pause, Square, Clock, Bell } from 'lucide-react';
import api from '../../lib/api.js';
import toast from 'react-hot-toast';
import './Timer.css';

const SUBJECTS = [
  'JavaScript (ES6+)', 'React', 'Node.js', 'DSA',
  'System Design', 'DBMS / SQL', 'OS / CN', 'English', 'Projects', 'Other',
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

  useEffect(() => {
    api.get('/sessions?limit=25').then(({ data }) => setSessions(data.sessions));
    api.get('/sessions/active').then(({ data }) => {
      if (!data) return;
      const elapsedSince = Math.floor((Date.now() - new Date(data.started_at)) / 1000) - (data.paused_secs || 0);
      setSessionId(data.id); setSubject(data.subject); setTopic(data.topic);
      setElapsed(Math.max(0, elapsedSince));
      pausedAccRef.current = data.paused_secs || 0;
      setRunning(true); tick();
    }).catch(() => {});
    return () => clearInterval(intervalRef.current);
  }, []);

  function tick() {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  }

  async function handleStart() {
    try {
      const { data } = await api.post('/sessions/start', { subject, topic: topic || 'General' });
      setSessionId(data.id); setElapsed(0); pausedAccRef.current = 0;
      setRunning(true); setPaused(false); tick();
      toast.success('Session started!');
    } catch { toast.error('Failed to start'); }
  }

  function handlePause() {
    if (!paused) {
      clearInterval(intervalRef.current);
      pauseStartRef.current = Date.now();
      setPaused(true);
    } else {
      pausedAccRef.current += Math.floor((Date.now() - pauseStartRef.current) / 1000);
      setPaused(false); tick();
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
    } catch { toast.error('Failed to end session'); }
    setRunning(false); setPaused(false); setElapsed(0);
    setSessionId(null); pausedAccRef.current = 0;
  }

  const clockClass = !running ? 'inactive' : paused ? 'paused' : 'running';

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
        <div className="sec-title"><Clock size={12} /> Session Log</div>
        {sessions.filter(s => !s.is_active).length === 0
          ? <p className="empty-msg">No sessions yet.</p>
          : (
            <table className="log-table">
              <thead>
                <tr>
                  <th>Subject</th><th>Topic</th><th>Started</th>
                  <th style={{ textAlign: 'right' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {sessions.filter(s => !s.is_active).map(s => (
                  <tr key={s.id}>
                    <td className="td-subj">{s.subject}</td>
                    <td className="td-topic">{s.topic}</td>
                    <td className="td-time">
                      {new Date(s.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="td-dur">{fmtDur(s.duration_secs)}</td>
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
