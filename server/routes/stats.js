// server/routes/stats.js
const express = require('express');
const db = require('../db/database');
const router = express.Router();

// GET /api/stats/summary
router.get('/summary', (req, res) => {
  const uid = req.userId;

  const sessions = db.get('sessions').filter({ user_id: uid, is_active: false }).value();
  const totalSecs = sessions.reduce((a, s) => a + (s.duration_secs || 0), 0);
  const totalHours = Math.round((totalSecs / 3600) * 10) / 10;

  const dsaTotal      = db.get('dsa_problems').filter({ user_id: uid }).size().value();
  const projectsTotal = db.get('projects').filter({ user_id: uid }).size().value();

  // Build date set directly from sessions (no dependency on daily_stats)
  const sessionDates = new Set(
    sessions
      .filter(s => s.ended_at)
      .map(s => s.ended_at.split('T')[0])
  );

  // Streak: consecutive days from today backwards
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (true) {
    const key = cursor.toISOString().split('T')[0];
    if (sessionDates.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  // Subject breakdown
  const subjectMap = {};
  sessions.forEach(s => {
    subjectMap[s.subject] = (subjectMap[s.subject] || 0) + (s.duration_secs || 0);
  });
  const subjectHours = Object.entries(subjectMap).map(([subject, secs]) => ({
    subject, hours: Math.round((secs / 3600) * 10) / 10,
  }));

  res.json({ totalHours, totalSessions: sessions.length, dsaTotal, projectsTotal, streak, subjectHours });
});

// GET /api/stats/heatmap
router.get('/heatmap', (req, res) => {
  const from = new Date();
  from.setDate(from.getDate() - 364);
  const fromStr = from.toISOString().split('T')[0];

  // Compute directly from sessions — works even if daily_stats is empty
  const sessions = db.get('sessions')
    .filter(s => s.user_id === req.userId && !s.is_active && s.ended_at)
    .value();

  const dateMap = {};
  sessions.forEach(s => {
    const date = s.ended_at.split('T')[0];
    if (date < fromStr) return;
    if (!dateMap[date]) dateMap[date] = { hours: 0, sessions: 0 };
    dateMap[date].hours += (s.duration_secs || 0) / 3600;
    dateMap[date].sessions += 1;
  });

  const heatmap = Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => {
      const { sessions, hours } = data;
      const level = sessions === 0 ? 0
        : sessions === 1 ? 1
        : sessions <= 3 ? 2
        : sessions <= 5 ? 3
        : 4;
      return { date, hours: Math.round(hours * 10) / 10, sessions, level };
    });

  res.json(heatmap);
});

// GET /api/stats/weekly
// Compute directly from sessions so it stays consistent with heatmap/summary
// even if daily_stats is stale or empty.
router.get('/weekly', (req, res) => {
  const from = new Date();
  from.setDate(from.getDate() - 6);
  const fromStr = from.toISOString().split('T')[0];

  const sessions = db.get('sessions')
    .filter(s => s.user_id === req.userId && !s.is_active && s.ended_at)
    .value();

  const result = {};
  sessions.forEach(s => {
    const date = s.ended_at.split('T')[0];
    if (date < fromStr) return;
    result[date] = Math.round(((result[date] || 0) + (s.duration_secs || 0) / 3600) * 10) / 10;
  });

  res.json(result);
});

module.exports = router;
