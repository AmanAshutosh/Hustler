// server/routes/subjects.js
const express = require('express');
const db = require('../db/database');
const router = express.Router();

// GET /api/subjects/progress
router.get('/progress', (req, res) => {
  const entry = db.get('subject_progress').find({ user_id: req.userId }).value();
  res.json({ progress: entry ? entry.progress : {} });
});

// PUT /api/subjects/progress  — full replace (client sends complete progress map)
router.put('/progress', (req, res) => {
  const { progress } = req.body;
  if (!progress || typeof progress !== 'object' || Array.isArray(progress))
    return res.status(400).json({ error: 'progress must be a plain object' });

  const existing = db.get('subject_progress').find({ user_id: req.userId }).value();
  if (existing) {
    db.get('subject_progress').find({ user_id: req.userId }).assign({ progress }).write();
  } else {
    db.get('subject_progress').push({ user_id: req.userId, progress }).write();
  }

  res.json({ ok: true });
});

// PATCH /api/subjects/progress  — toggle a single key (more efficient for one checkbox)
router.patch('/progress', (req, res) => {
  const { key, done } = req.body;
  if (typeof key !== 'string' || typeof done !== 'boolean')
    return res.status(400).json({ error: 'key (string) and done (boolean) required' });

  const existing = db.get('subject_progress').find({ user_id: req.userId }).value();
  if (existing) {
    const updated = { ...existing.progress, [key]: done };
    db.get('subject_progress').find({ user_id: req.userId }).assign({ progress: updated }).write();
  } else {
    db.get('subject_progress').push({ user_id: req.userId, progress: { [key]: done } }).write();
  }

  res.json({ ok: true });
});

module.exports = router;
