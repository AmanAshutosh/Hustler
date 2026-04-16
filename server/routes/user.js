// server/routes/user.js
const express = require('express');
const db = require('../db/database');
const router = express.Router();

router.get('/me', (req, res) => {
  const user = db.get('users').find({ id: req.userId }).value();
  if (!user) return res.status(404).json({ error: 'Not found' });
  const { password_hash, ...safe } = user;
  res.json(safe);
});

router.patch('/me', (req, res) => {
  const { name, github_url, leetcode_url, gfg_url, x_url, linkedin_url } = req.body;
  const user = db.get('users').find({ id: req.userId }).value();
  if (!user) return res.status(404).json({ error: 'Not found' });
  db.get('users').find({ id: req.userId }).assign({
    name: name ?? user.name,
    github_url:   github_url   ?? user.github_url,
    leetcode_url: leetcode_url ?? user.leetcode_url,
    gfg_url:      gfg_url      ?? user.gfg_url,
    x_url:        x_url        ?? user.x_url,
    linkedin_url: linkedin_url ?? user.linkedin_url,
  }).write();
  const updated = db.get('users').find({ id: req.userId }).value();
  const { password_hash, ...safe } = updated;
  res.json(safe);
});

module.exports = router;
