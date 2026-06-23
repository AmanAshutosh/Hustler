// server/routes/activity.js — activity timeline / audit trail
const express = require('express');
const db = require('../db/database');
const router = express.Router();

// GET /api/activity?limit=50&before=<ISO timestamp>
// Returns most recent activity first; `before` paginates further back in time.
router.get('/', (req, res) => {
  const limit  = Math.min(parseInt(req.query.limit) || 50, 200);
  const before = req.query.before;

  let entries = db.get('activity_log').filter({ user_id: req.userId }).value();
  if (before) entries = entries.filter(e => e.timestamp < before);

  entries = entries.slice().sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const page = entries.slice(0, limit);

  res.json({
    entries: page,
    hasMore: entries.length > limit,
    total: db.get('activity_log').filter({ user_id: req.userId }).size().value(),
  });
});

module.exports = router;
