// server/routes/auth.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
function makeId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const existing = db.get('users').find({ email }).value();
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const password_hash  = await bcrypt.hash(password, 10);
  const avatar_initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const id = makeId();
  const createdAt = new Date().toISOString();

  db.get('users').push({ id, name, email, password_hash, avatar_initials,
    github_url: '', leetcode_url: '', gfg_url: '', x_url: '', linkedin_url: '',
    created_at: createdAt }).write();

  const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '30d' });
  res.status(201).json({ token, user: { id, name, email, avatarInitials: avatar_initials } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const user = db.get('users').find({ email }).value();
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatarInitials: user.avatar_initials } });
});

module.exports = router;
