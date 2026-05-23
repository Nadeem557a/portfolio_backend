const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String },
  techStack: [{ type: String }],
  features: [{ type: String }],
  challenges: [
    {
      title: String,
      solution: String
    }
  ],
  images: [{ type: String }],
  github: { type: String },
  demo: { type: String },
  priority: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
