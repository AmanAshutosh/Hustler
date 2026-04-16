// server/routes/projects.js
const express = require('express');
const db = require('../db/database');
const router = express.Router();
function makeId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

router.get('/', (req, res) => {
  const projects = db.get('projects').filter({ user_id: req.userId })
    .orderBy(['created_at'], ['desc']).value();
  res.json(projects);
});

router.post('/', (req, res) => {
  const { name, description, tech_stack, github_url, live_url, status } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const project = {
    id: makeId(), user_id: req.userId, name,
    description: description || '', tech_stack: tech_stack || [],
    github_url: github_url || '', live_url: live_url || '',
    status: status || 'in-progress', created_at: new Date().toISOString(),
  };
  db.get('projects').push(project).write();
  res.status(201).json(project);
});

router.patch('/:id', (req, res) => {
  const project = db.get('projects').find({ id: req.params.id, user_id: req.userId }).value();
  if (!project) return res.status(404).json({ error: 'Not found' });
  const { name, description, tech_stack, github_url, live_url, status } = req.body;
  db.get('projects').find({ id: req.params.id }).assign({
    name: name ?? project.name,
    description: description ?? project.description,
    tech_stack: tech_stack ?? project.tech_stack,
    github_url: github_url ?? project.github_url,
    live_url: live_url ?? project.live_url,
    status: status ?? project.status,
  }).write();
  res.json(db.get('projects').find({ id: req.params.id }).value());
});

router.delete('/:id', (req, res) => {
  db.get('projects').remove({ id: req.params.id, user_id: req.userId }).write();
  res.json({ ok: true });
});

module.exports = router;
