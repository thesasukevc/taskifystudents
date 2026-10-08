const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  accentColor: {
    type: String,
    default: '#00f2ff'
  },
  youtubePlaylistUrl: {
    type: String,
    required: true
  },
  quizzes: [{
    question: String,
    options: [String],
    correctAnswerIndex: Number,
    reward: { type: Number, default: 10 }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subject', SubjectSchema);
