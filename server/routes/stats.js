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

  // Streak: consecutive days with total_hours > 0 going back from today
  const dailyStats = db.get('daily_stats').filter({ user_id: uid })
    .orderBy(['date'], ['desc']).value();
  const statMap = {};
  dailyStats.forEach(s => { statMap[s.date] = s.total_hours; });
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = cursor.toISOString().split('T')[0];
    if (statMap[key] && statMap[key] > 0) { streak++; cursor.setDate(cursor.getDate() - 1); }
    else break;
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

  const stats = db.get('daily_stats')
    .filter(s => s.user_id === req.userId && s.date >= fromStr)
    .orderBy(['date'], ['asc']).value();

  const heatmap = stats.map(s => ({
    date: s.date,
    hours: Math.round(s.total_hours * 10) / 10,
    level: s.total_hours === 0 ? 0 : s.total_hours < 2 ? 1 : s.total_hours < 4 ? 2 : s.total_hours < 7 ? 3 : 4,
  }));
  res.json(heatmap);
});

// GET /api/stats/weekly
router.get('/weekly', (req, res) => {
  const stats = db.get('daily_stats').filter({ user_id: req.userId })
    .orderBy(['date'], ['desc']).take(7).value();
  const result = {};
  stats.forEach(s => { result[s.date] = Math.round(s.total_hours * 10) / 10; });
  res.json(result);
});

module.exports = router;
