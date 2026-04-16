// server/routes/dsa.js
const express = require('express');
const db = require('../db/database');
const router = express.Router();
function makeId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

router.get('/', (req, res) => {
  const problems = db.get('dsa_problems').filter({ user_id: req.userId })
    .orderBy(['solved_at'], ['desc']).value();
  res.json(problems);
});

router.post('/', (req, res) => {
  const { name, category, difficulty, source, time_mins, notes } = req.body;
  if (!name || !category || !difficulty) return res.status(400).json({ error: 'name, category, difficulty required' });

  const problem = {
    id: makeId(), user_id: req.userId, name, category, difficulty,
    source: source || 'neetcode', time_mins: time_mins || null,
    notes: notes || null, solved_at: new Date().toISOString(),
  };
  db.get('dsa_problems').push(problem).write();

  // Update daily dsa count
  const today = new Date().toISOString().split('T')[0];
  const stat = db.get('daily_stats').find({ user_id: req.userId, date: today }).value();
  if (stat) {
    db.get('daily_stats').find({ user_id: req.userId, date: today })
      .assign({ dsa_count: stat.dsa_count + 1 }).write();
  } else {
    db.get('daily_stats').push({ id: makeId(), user_id: req.userId, date: today,
      total_hours: 0, session_count: 0, dsa_count: 1 }).write();
  }

  res.status(201).json(problem);
});

router.delete('/:id', (req, res) => {
  db.get('dsa_problems').remove({ id: req.params.id, user_id: req.userId }).write();
  res.json({ ok: true });
});

module.exports = router;
