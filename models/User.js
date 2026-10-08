const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  fullName: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  coins: {
    type: Number,
    default: 0
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  lastSpinTimestamp: {
    type: Date,
    default: null
  },
  preferredLang: {
    type: String,
    default: 'uz'
  },
  streak: {
    type: Number,
    default: 0
  },
  quizzesCompleted: {
    type: Number,
    default: 0
  },
  totalSpins: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    default: 'Novice'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  achievements: [{
    badgeId: String,
    unlockedAt: { type: Date, default: Date.now }
  }],
  inventory: [{
    itemId: String,
    purchasedAt: { type: Date, default: Date.now }
  }],
  subjectProgress: [{
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    progress: { type: Number, default: 0 }, // 0 to 100
    completed: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
