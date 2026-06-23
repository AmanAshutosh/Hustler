// server/routes/roadmap.js — 6-month roadmap milestone tracking
const express = require('express');
const router  = express.Router();
const db      = require('../db/database');
const { logActivity } = require('../db/activity');

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
  let milestones;
  if (existing.value()) {
    milestones = { ...existing.value().milestones, [key]: value };
    existing.assign({ milestones, updated_at: new Date().toISOString() }).write();
  } else {
    milestones = { [key]: value };
    db.get('roadmap_progress').push({
      user_id: req.userId,
      milestones,
      created_at: new Date().toISOString(),
    }).write();
  }
  logActivity(
    req.userId,
    value ? 'goal_complete' : 'goal_update',
    `${value ? 'Completed' : 'Unchecked'} milestone — ${key}`,
  );
  res.json(milestones);
});

module.exports = router;
