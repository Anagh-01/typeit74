const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional for guests
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  errors: { type: Number, required: true },
  duration: { type: Number, required: true }, // in seconds
  mode: { type: String, enum: ['words', 'sentences', 'paragraph', 'custom', 'code', 'numbers'], required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  keyStats: { type: Map, of: Object }, // e.g., { 'a': { errors: 2, total: 10, avgTime: 120 } }
}, { timestamps: true, suppressReservedKeysWarning: true });

module.exports = mongoose.model('TestResult', testResultSchema);
