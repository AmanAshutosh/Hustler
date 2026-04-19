const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
const makeId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const normalizeEmail = (e) => (e || '').trim().toLowerCase();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const name     = (req.body.name     || '').trim();
    const email    = normalizeEmail(req.body.email);
    const password = (req.body.password || '');

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: 'Please enter a valid email address.' });

    const existing = db.get('users').find({ email }).value();
    if (existing)
      return res.status(409).json({ error: 'An account with this email already exists.' });

    const password_hash    = await bcrypt.hash(password, 12);
    const avatar_initials  = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const id               = makeId();
    const createdAt        = new Date().toISOString();

    db.get('users').push({
      id, name, email, password_hash, avatar_initials,
      github_url: '', leetcode_url: '', gfg_url: '', x_url: '', linkedin_url: '',
      created_at: createdAt,
    }).write();

    const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '30d' });
    return res.status(201).json({
      token,
      user: { id, name, email, avatarInitials: avatar_initials },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const email    = normalizeEmail(req.body.email);
    const password = (req.body.password || '');

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const user = db.get('users').find({ email }).value();
    if (!user)
      return res.status(401).json({ error: 'No account found with this email.' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({
      token,
      user: {
        id:             user.id,
        name:           user.name,
        email:          user.email,
        avatarInitials: user.avatar_initials,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

module.exports = router;
