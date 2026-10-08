const Subject = require('../models/Subject');
const User = require('../models/User');

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching subjects' });
  }
};

exports.verifyAnswer = async (req, res) => {
  try {
    const { subjectId, questionIndex, answerIndex } = req.body;
    const userId = req.user.id;

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const quiz = subject.quizzes[questionIndex];
    if (!quiz) return res.status(400).json({ message: 'Invalid question index' });

    // Note: using correctAnswerIndex based on existing code
    if (quiz.correctAnswerIndex === answerIndex) {
      const coinsEarned = quiz.reward || 10;
      const xpEarned = 25;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Update coins and XP
      user.coins += coinsEarned;
      user.xp += xpEarned;
      user.quizzesCompleted += 1;

      // Level up logic: Level = floor(sqrt(xp / 100)) + 1
      const newLevel = Math.floor(Math.sqrt(user.xp / 100)) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
      }

      // Update subject progress
      let progress = user.subjectProgress.find(p => p.subjectId.equals(subjectId));
      if (!progress) {
        progress = { subjectId, progress: 0, completed: false };
        user.subjectProgress.push(progress);
      }

      // Calculate progress based on total quizzes in the subject
      const totalQuizzes = subject.quizzes.length || 5;
      // This is a simplified calculation; in a real app, we'd track specifically which questions were answered
      progress.progress = Math.min(100, Math.round(((user.quizzesCompleted) / totalQuizzes) * 100));
      if (progress.progress >= 100) progress.completed = true;

      await user.save();

      return res.json({
        correct: true,
        coins: user.coins,
        xp: user.xp,
        level: user.level,
        progress: progress.progress,
        message: `To'g'ri! Siz ${coinsEarned} tanga va ${xpEarned} XP yutdingiz!`
      });
    }

    res.json({ correct: false, message: 'Noto\'g\'ri javob. Qayta urinib ko\'ring!' });
  } catch (err) {
    console.error('Quiz Error:', err);
    res.status(500).json({ message: 'Quizni tekshirishda server xatosi yuz berdi' });
  }
};
