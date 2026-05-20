const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String }, // optional icon url or identifier
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
