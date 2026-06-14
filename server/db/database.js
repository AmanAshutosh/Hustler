// server/db/database.js
// lowdb Memory adapter + MongoDB persistence bridge.
// All routes keep the same synchronous lowdb API.
// MongoDB stores the entire state as one document — restored on startup.

const low    = require('lowdb');
const Memory = require('lowdb/adapters/Memory');
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGODB_URI;

const adapter = new Memory();
const db = low(adapter);

db.defaults({
  users:            [],
  sessions:         [],
  dsa_problems:     [],
  projects:         [],
  daily_stats:      [],
  subject_progress: [],
  habit_logs:       [],
  roadmap_progress: [],
}).write();

// ── MongoDB persistence ────────────────────────────────────────────────────────

let _col = null; // MongoDB collection reference, null until connected

// Intercept every .write() call and async-persist to MongoDB
const _origWrite = db.write.bind(db);
db.write = function () {
  _origWrite();
  if (_col) {
    _col.replaceOne(
      { _id: 'state' },
      { _id: 'state', data: db.getState() },
      { upsert: true }
    ).catch(err => console.error('[db] MongoDB write error:', err.message));
  }
};

// Connect to MongoDB, restore state, then resolve.
// server/index.js awaits this before starting the HTTP listener.
const ready = (async () => {
  if (!MONGO_URI) {
    console.warn('[db] ⚠️  MONGODB_URI not set — data is in-memory only and will reset on restart.');
    return;
  }
  try {
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    const mdb = client.db('hustler');
    _col = mdb.collection('store');

    const doc = await _col.findOne({ _id: 'state' });
    if (doc?.data) {
      // Merge restored data into defaults so new collections still get seeded
      const merged = { ...db.getState() };
      for (const [k, v] of Object.entries(doc.data)) {
        if (Array.isArray(v)) merged[k] = v;
      }
      db.setState(merged);
    }
    console.log('[db] ✅ MongoDB connected — state restored.');
  } catch (err) {
    console.error('[db] MongoDB connection failed — running in-memory only:', err.message);
  }
})();

module.exports = db;
module.exports.ready = ready;
