const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const topStudents = await User.find({})
      .sort({ coins: -1 })
      .limit(10)
      .select('username fullName coins');
    res.json(topStudents);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching leaderboard' });
  }
};
