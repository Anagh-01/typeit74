const mongoose = require('mongoose');

const raceRoomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  players: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestName: String,
    wpm: { type: Number, default: 0 },
    progress: { type: Number, default: 0 }, // 0 to 100 percentage
    isFinished: { type: Boolean, default: false }
  }],
  textId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  status: { type: String, enum: ['waiting', 'starting', 'racing', 'finished'], default: 'waiting' },
}, { timestamps: true });

module.exports = mongoose.model('RaceRoom', raceRoomSchema);
