// server/routes/sessions.js
const express = require('express');
const db = require('../db/database');
const router = express.Router();
function makeId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

// POST /api/sessions/start
router.post('/start', (req, res) => {
  const { subject, topic } = req.body;
  if (!subject) return res.status(400).json({ error: 'subject required' });

  // End any active sessions
  db.get('sessions')
    .filter({ user_id: req.userId, is_active: true })
    .each(s => { s.is_active = false; s.ended_at = new Date().toISOString(); })
    .value();
  db.write();

  const session = {
    id: makeId(), user_id: req.userId, subject,
    topic: topic || 'General',
    started_at: new Date().toISOString(),
    ended_at: null, paused_secs: 0, duration_secs: 0, is_active: true,
  };
  db.get('sessions').push(session).write();
  res.status(201).json(session);
});

// POST /api/sessions/:id/end
router.post('/:id/end', (req, res) => {
  const { pausedSecs = 0 } = req.body;
  const session = db.get('sessions').find({ id: req.params.id, user_id: req.userId }).value();
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const endedAt = new Date();
  const startedAt = new Date(session.started_at);
  const duration_secs = Math.max(0, Math.floor((endedAt - startedAt) / 1000) - pausedSecs);

  db.get('sessions').find({ id: req.params.id }).assign({
    ended_at: endedAt.toISOString(), duration_secs, paused_secs: pausedSecs, is_active: false,
  }).write();

  // Upsert daily stats
  const today = new Date().toISOString().split('T')[0];
  const stat = db.get('daily_stats').find({ user_id: req.userId, date: today }).value();
  if (stat) {
    db.get('daily_stats').find({ user_id: req.userId, date: today })
      .assign({ total_hours: stat.total_hours + duration_secs / 3600, session_count: stat.session_count + 1 })
      .write();
  } else {
    db.get('daily_stats').push({ id: makeId(), user_id: req.userId, date: today,
      total_hours: duration_secs / 3600, session_count: 1, dsa_count: 0 }).write();
  }

  const updated = db.get('sessions').find({ id: req.params.id }).value();
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

// DELETE /api/sessions/:id
router.delete('/:id', (req, res) => {
  db.get('sessions').remove({ id: req.params.id, user_id: req.userId }).write();
  res.json({ ok: true });
});

module.exports = router;
