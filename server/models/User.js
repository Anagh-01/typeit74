const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  settings: {
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'dark' },
    fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
    soundEffects: { type: Boolean, default: true },
    keyboardLayout: { type: String, enum: ['qwerty', 'dvorak', 'azerty'], default: 'qwerty' },
    blindMode: { type: Boolean, default: false },
    backspacePenalty: { type: Boolean, default: false },
    caretStyle: { type: String, enum: ['line', 'block', 'underline'], default: 'line' },
  },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
