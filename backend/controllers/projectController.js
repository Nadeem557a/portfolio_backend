const Project = require('../models/Project');
const slugify = require('slugify');

// ─── GET all projects ──────────────────────────────────────────────────────────
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ priority: -1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    console.error('getProjects error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
};

// ─── GET single project by slug ───────────────────────────────────────────────
exports.getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    console.error('getProjectBySlug error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch project' });
  }
};

// ─── GET single project by MongoDB _id ────────────────────────────────────────
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    console.error('getProjectById error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch project' });
  }
};

// ─── POST create new project ──────────────────────────────────────────────────
exports.createProject = async (req, res) => {
  try {
    const projectData = { ...req.body };

    // Auto-generate slug from title if not provided
    if (!projectData.slug && projectData.title) {
      projectData.slug = slugify(projectData.title, { lower: true, strict: true });
    }

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    console.error('createProject error:', err.message);
    // Handle duplicate slug
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'A project with this slug already exists' });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

// ─── PUT update project ────────────────────────────────────────────────────────
exports.updateProject = async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: Date.now() };

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    console.error('updateProject error:', err.message);
    res.status(400).json({ success: false, error: err.message });
  }
};

// ─── DELETE project ────────────────────────────────────────────────────────────
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    console.error('deleteProject error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to delete project' });
  }
};
