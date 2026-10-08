const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure default values for new fields to prevent frontend 'undefined' errors
    const profileData = {
      username: user.username,
      fullName: user.fullName,
      coins: user.coins || 0,
      streak: user.streak || 0,
      quizzesCompleted: user.quizzesCompleted || 0,
      totalSpins: user.totalSpins || 0,
      rank: user.rank || 'Novice',
      xp: user.xp || 0,
      level: user.level || 1,
      isAdmin: user.isAdmin === true,
      role: user.role || 'user',
      inventory: user.inventory || []
    };

    res.json(profileData);
  } catch (err) {
    console.error('Profile Error:', err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};