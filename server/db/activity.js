// server/db/activity.js — unified activity/audit log used by the heatmap,
// streaks, analytics, and the Activity Timeline UI.
const db = require('./database');

function makeId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

// type: short machine key, e.g. 'session_end', 'habit_update', 'dsa_solved'
// details: human-readable description shown in the timeline
// durationSecs: optional, contributes to "Focus Hours" style aggregates
function logActivity(userId, type, details, durationSecs = null) {
  const timestamp = new Date().toISOString();
  db.get('activity_log').push({
    id: makeId(),
    user_id: userId,
    type,
    details: details || '',
    duration_secs: durationSecs,
    timestamp,
    date: timestamp.split('T')[0],
  }).write();
}

module.exports = { logActivity };
