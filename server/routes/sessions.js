// server/routes/sessions.js
const express = require('express');
const db = require('../db/database');
const router = express.Router();
function makeId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

// Helper: finalize a session and update daily_stats
function finalizeSession(session, endedAt, pausedSecs) {
  const startedAt = new Date(session.started_at);
  // If still paused when force-ended, count that pause time too
  let totalPaused = pausedSecs;
  if (session.paused_at) {
    totalPaused += Math.floor((endedAt - new Date(session.paused_at)) / 1000);
  }
  const duration_secs = Math.max(0, Math.floor((endedAt - startedAt) / 1000) - totalPaused);

  db.get('sessions').find({ id: session.id }).assign({
    ended_at: endedAt.toISOString(),
    duration_secs,
    paused_secs: totalPaused,
    paused_at: null,
    is_active: false,
  }).write();

  // Upsert daily stats
  const today = endedAt.toISOString().split('T')[0];
  const stat = db.get('daily_stats').find({ user_id: session.user_id, date: today }).value();
  if (stat) {
    db.get('daily_stats').find({ user_id: session.user_id, date: today })
      .assign({
        total_hours: stat.total_hours + duration_secs / 3600,
        session_count: stat.session_count + 1,
      }).write();
  } else {
    db.get('daily_stats').push({
      id: makeId(), user_id: session.user_id, date: today,
      total_hours: duration_secs / 3600, session_count: 1, dsa_count: 0,
    }).write();
  }

  return db.get('sessions').find({ id: session.id }).value();
}

// POST /api/sessions/start
router.post('/start', (req, res) => {
  const { subject, topic } = req.body;
  if (!subject) return res.status(400).json({ error: 'subject required' });

  // Properly end any active sessions (and count their time in daily_stats)
  const activeSessions = db.get('sessions')
    .filter({ user_id: req.userId, is_active: true }).value();
  activeSessions.forEach(s => {
    finalizeSession(s, new Date(), s.paused_secs || 0);
  });

  const session = {
    id: makeId(), user_id: req.userId, subject,
    topic: topic || 'General',
    started_at: new Date().toISOString(),
    ended_at: null, paused_secs: 0, paused_at: null, duration_secs: 0, is_active: true,
  };
  db.get('sessions').push(session).write();
  res.status(201).json(session);
});

// PATCH /api/sessions/:id/pause
router.patch('/:id/pause', (req, res) => {
  const session = db.get('sessions').find({ id: req.params.id, user_id: req.userId }).value();
  if (!session) return res.status(404).json({ error: 'Session not found' });
  db.get('sessions').find({ id: req.params.id }).assign({
    paused_at: new Date().toISOString(),
  }).write();
  const updated = db.get('sessions').find({ id: req.params.id }).value();
  res.json(updated);
});

// PATCH /api/sessions/:id/resume
router.patch('/:id/resume', (req, res) => {
  const session = db.get('sessions').find({ id: req.params.id, user_id: req.userId }).value();
  if (!session) return res.status(404).json({ error: 'Session not found' });
  let addedPauseSecs = 0;
  if (session.paused_at) {
    addedPauseSecs = Math.floor((Date.now() - new Date(session.paused_at)) / 1000);
  }
  db.get('sessions').find({ id: req.params.id }).assign({
    paused_secs: (session.paused_secs || 0) + addedPauseSecs,
    paused_at: null,
  }).write();
  const updated = db.get('sessions').find({ id: req.params.id }).value();
  res.json(updated);
});

// POST /api/sessions/:id/end
router.post('/:id/end', (req, res) => {
  const { pausedSecs = 0 } = req.body;
  const session = db.get('sessions').find({ id: req.params.id, user_id: req.userId }).value();
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const updated = finalizeSession(session, new Date(), pausedSecs);
  res.json(updated);
});

// GET /api/sessions/active  — MUST be before /:id
router.get('/active', (req, res) => {
  const session = db.get('sessions').find({ user_id: req.userId, is_active: true }).value();
  res.json(session || null);
});

// GET /api/sessions
router.get('/', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const all = db.get('sessions').filter({ user_id: req.userId })
    .orderBy(['started_at'], ['desc']).take(limit).value();
  res.json({ sessions: all, total: db.get('sessions').filter({ user_id: req.userId }).size().value() });
});

// DELETE /api/sessions/all — delete all completed sessions for user
router.delete('/all', (req, res) => {
  db.get('sessions')
    .remove(s => s.user_id === req.userId && !s.is_active)
    .write();
  res.json({ ok: true });
});

// DELETE /api/sessions/:id
router.delete('/:id', (req, res) => {
  db.get('sessions').remove({ id: req.params.id, user_id: req.userId }).write();
  res.json({ ok: true });
});

module.exports = router;
