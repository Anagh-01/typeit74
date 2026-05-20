const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, enum: ['words', 'sentences', 'paragraph', 'code', 'quotes', 'news', 'tongue-twister', 'literature'], required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  language: { type: String, default: 'english' }, // e.g., 'english', 'javascript', 'python'
  source: { type: String } // optional source
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
