// server/routes/tracker.js — daily habit tracking
const express = require('express');
const router  = express.Router();
const db      = require('../db/database');
const { logActivity } = require('../db/activity');

function makeId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

const HABIT_IDS = ['gym','sleep','study1','study2','study3','project','github','linkedin'];

// GET /api/tracker/today
router.get('/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const log   = db.get('habit_logs').find({ user_id: req.userId, date: today }).value();
  res.json(log || { date: today, habits: {}, completion_pct: 0 });
});

// POST /api/tracker/today — upsert today's habit log
router.post('/today', (req, res) => {
  const { habits } = req.body;
  if (!habits || typeof habits !== 'object') {
    return res.status(400).json({ error: 'habits object required' });
  }
  const today          = new Date().toISOString().split('T')[0];
  const done           = HABIT_IDS.filter(h => habits[h]).length;
  const completion_pct = Math.round((done / HABIT_IDS.length) * 100);

  const existing = db.get('habit_logs').find({ user_id: req.userId, date: today });
  if (existing.value()) {
    existing.assign({ habits, completion_pct, updated_at: new Date().toISOString() }).write();
  } else {
    db.get('habit_logs').push({
      id: makeId(),
      user_id: req.userId,
      date: today,
      habits,
      completion_pct,
      created_at: new Date().toISOString(),
    }).write();
  }
  logActivity(req.userId, 'habit_update', `Daily habits updated — ${done}/${HABIT_IDS.length} done (${completion_pct}%)`);
  res.json({ date: today, habits, completion_pct });
});

// GET /api/tracker/streaks — consecutive-day streak per habit
router.get('/streaks', (req, res) => {
  const logs   = db.get('habit_logs').filter({ user_id: req.userId }).value();
  const logMap = {};
  logs.forEach(l => { logMap[l.date] = l.habits || {}; });

  // Dates are stored as UTC "YYYY-MM-DD" strings, so walk the cursor in UTC too —
  // local setDate()/setHours() drifts a day in timezones ahead of UTC.
  function addDaysUTC(dateStr, delta) {
    const d = new Date(dateStr + 'T00:00:00.000Z');
    d.setUTCDate(d.getUTCDate() + delta);
    return d.toISOString().split('T')[0];
  }

  const streaks = {};
  for (const habitId of HABIT_IDS) {
    let streak = 0;
    let ds = new Date().toISOString().split('T')[0];
    for (let i = 0; i < 365; i++) {
      if (logMap[ds] && logMap[ds][habitId]) {
        streak++;
      } else if (i > 0) {
        break; // only break after the first missing day (allow today to be missing)
      }
      ds = addDaysUTC(ds, -1);
    }
    streaks[habitId] = streak;
  }
  res.json(streaks);
});

// GET /api/tracker/logs?days=7
router.get('/logs', (req, res) => {
  const days = Math.min(30, parseInt(req.query.days) || 7);
  const logs = db.get('habit_logs')
    .filter({ user_id: req.userId })
    .sortBy('date')
    .reverse()
    .take(days)
    .value();
  res.json(logs);
});

module.exports = router;
