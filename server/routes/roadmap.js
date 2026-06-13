// server/routes/roadmap.js — 6-month roadmap milestone tracking
const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

// GET /api/roadmap/progress
router.get('/progress', (req, res) => {
  const record = db.get('roadmap_progress').find({ user_id: req.userId }).value();
  res.json(record ? record.milestones : {});
});

// PATCH /api/roadmap/progress — toggle a single milestone
router.patch('/progress', (req, res) => {
  const { key, value } = req.body;
  if (typeof key !== 'string') {
    return res.status(400).json({ error: 'key string required' });
  }

  const existing = db.get('roadmap_progress').find({ user_id: req.userId });
  if (existing.value()) {
    const milestones = { ...existing.value().milestones, [key]: value };
    existing.assign({ milestones, updated_at: new Date().toISOString() }).write();
    res.json(milestones);
  } else {
    const milestones = { [key]: value };
    db.get('roadmap_progress').push({
      user_id: req.userId,
      milestones,
      created_at: new Date().toISOString(),
    }).write();
    res.json(milestones);
  }
});

module.exports = router;
