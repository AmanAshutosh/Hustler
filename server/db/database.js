// server/db/database.js
// lowdb v1 — pure JavaScript JSON file DB, zero native compilation
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, '../devtrack.json'));
const db = low(adapter);

db.defaults({
  users:            [],
  sessions:         [],
  dsa_problems:     [],
  projects:         [],
  daily_stats:      [],
  subject_progress: [],
}).write();

module.exports = db;
