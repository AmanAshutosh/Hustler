// server/routes/stats.js
const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Active-day set is derived from activity_log (every tracked action), not just
// timer sessions — so habit completions, DSA solves, and project work all
// light up the heatmap and count toward streaks, even on days with no timer use.
function getActivityDates(uid) {
  return db.get('activity_log').filter({ user_id: uid }).value().map(e => e.date);
}

// Dates are stored/compared as UTC "YYYY-MM-DD" strings everywhere (derived from
// ISO timestamps). Walking the cursor with local-time setDate()/setHours() and
// then reading it back via toISOString() drifts by a day in any timezone ahead
// of UTC — so all date arithmetic here stays in UTC via Date.UTC().
function addDaysUTC(dateStr, delta) {
  const d = new Date(dateStr + 'T00:00:00.000Z');
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().split('T')[0];
}

function countConsecutiveFromToday(dateSet) {
  let streak = 0;
  let cursor = new Date().toISOString().split('T')[0];
  while (dateSet.has(cursor)) {
    streak++;
    cursor = addDaysUTC(cursor, -1);
  }
  return streak;
}

function longestStreak(dateSet) {
  const sorted = Array.from(dateSet).sort();
  let longest = 0, run = 0, prev = null;
  for (const d of sorted) {
    if (prev) {
      const diffDays = Math.round((new Date(d) - new Date(prev)) / 86400000);
      run = diffDays === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = d;
  }
  return longest;
}

// GET /api/stats/summary
router.get('/summary', (req, res) => {
  const uid = req.userId;

  const sessions = db.get('sessions').filter({ user_id: uid, is_active: false }).value();
  const totalSecs = sessions.reduce((a, s) => a + (s.duration_secs || 0), 0);
  const totalHours = Math.round((totalSecs / 3600) * 10) / 10;

  const dsaProblems  = db.get('dsa_problems').filter({ user_id: uid }).value();
  const projects     = db.get('projects').filter({ user_id: uid }).value();
  const dsaTotal      = dsaProblems.length;
  const projectsTotal = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;

  const roadmapRecord = db.get('roadmap_progress').find({ user_id: uid }).value();
  const goalsCompleted = roadmapRecord
    ? Object.values(roadmapRecord.milestones || {}).filter(Boolean).length
    : 0;

  const activityDates = getActivityDates(uid);
  const dateSet = new Set(activityDates);
  const totalActiveDays = dateSet.size;
  const streak = countConsecutiveFromToday(dateSet);
  const longest = Math.max(longestStreak(dateSet), streak);

  // Weekly / monthly hours from actual session durations
  const now = new Date();
  const weekFrom  = new Date(now); weekFrom.setDate(weekFrom.getDate() - 6);
  const weekFromStr = weekFrom.toISOString().split('T')[0];
  const monthFrom = new Date(now); monthFrom.setDate(monthFrom.getDate() - 29);
  const monthFromStr = monthFrom.toISOString().split('T')[0];

  let weeklySecs = 0, monthlySecs = 0;
  sessions.forEach(s => {
    if (!s.ended_at) return;
    const date = s.ended_at.split('T')[0];
    if (date >= weekFromStr) weeklySecs += s.duration_secs || 0;
    if (date >= monthFromStr) monthlySecs += s.duration_secs || 0;
  });
  const weeklyHours  = Math.round((weeklySecs / 3600) * 10) / 10;
  const monthlyHours = Math.round((monthlySecs / 3600) * 10) / 10;

  const tasksCompleted = dsaTotal + completedProjects;

  // Composite 0-100 score blending volume, consistency, and completion.
  const productivityScore = Math.round(
    Math.min(totalHours / 200, 1) * 35 +
    Math.min(streak / 30, 1) * 25 +
    Math.min(totalActiveDays / 90, 1) * 20 +
    Math.min((tasksCompleted + goalsCompleted) / 50, 1) * 20
  );

  // Subject breakdown
  const subjectMap = {};
  sessions.forEach(s => {
    subjectMap[s.subject] = (subjectMap[s.subject] || 0) + (s.duration_secs || 0);
  });
  const subjectHours = Object.entries(subjectMap).map(([subject, secs]) => ({
    subject, hours: Math.round((secs / 3600) * 10) / 10,
  }));

  res.json({
    totalHours,
    focusHours: totalHours,
    totalSessions: sessions.length,
    dsaTotal,
    projectsTotal,
    completedProjects,
    streak,
    longestStreak: longest,
    weeklyHours,
    monthlyHours,
    totalActiveDays,
    tasksCompleted,
    goalsCompleted,
    productivityScore,
    subjectHours,
  });
});

// GET /api/stats/heatmap
router.get('/heatmap', (req, res) => {
  const from = new Date();
  from.setDate(from.getDate() - 364);
  const fromStr = from.toISOString().split('T')[0];

  const sessions = db.get('sessions')
    .filter(s => s.user_id === req.userId && !s.is_active && s.ended_at)
    .value();

  const hoursByDate = {};
  const sessionCountByDate = {};
  sessions.forEach(s => {
    const date = s.ended_at.split('T')[0];
    if (date < fromStr) return;
    hoursByDate[date] = (hoursByDate[date] || 0) + (s.duration_secs || 0) / 3600;
    sessionCountByDate[date] = (sessionCountByDate[date] || 0) + 1;
  });

  // Activity count (any type) drives heatmap intensity, so non-timer actions
  // (habits, DSA, projects, roadmap) still light up the cell.
  const activity = db.get('activity_log').filter({ user_id: req.userId }).value();
  const activityCountByDate = {};
  activity.forEach(e => {
    if (e.date < fromStr) return;
    activityCountByDate[e.date] = (activityCountByDate[e.date] || 0) + 1;
  });

  const allDates = new Set([...Object.keys(hoursByDate), ...Object.keys(activityCountByDate)]);
  const heatmap = Array.from(allDates)
    .sort((a, b) => a.localeCompare(b))
    .map(date => {
      const activities = activityCountByDate[date] || 0;
      const hours = hoursByDate[date] || 0;
      const level = activities === 0 ? 0
        : activities === 1 ? 1
        : activities <= 3 ? 2
        : activities <= 6 ? 3
        : 4;
      return {
        date,
        hours: Math.round(hours * 10) / 10,
        sessions: sessionCountByDate[date] || 0,
        activities,
        level,
      };
    });

  res.json(heatmap);
});

// GET /api/stats/weekly
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
