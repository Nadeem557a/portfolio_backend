const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { verifyToken } = require('../middleware/auth');

// ─── Public Routes ────────────────────────────────────────────────────────────
router.get('/', projectController.getProjects);
router.get('/id/:id', projectController.getProjectById);
router.get('/:slug', projectController.getProjectBySlug);

// ─── Protected Admin Routes ───────────────────────────────────────────────────
router.post('/', verifyToken, projectController.createProject);
router.put('/:id', verifyToken, projectController.updateProject);
router.delete('/:id', verifyToken, projectController.deleteProject);

module.exports = router;
