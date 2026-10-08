const User = require('../models/User');

module.exports = async (req, res, next) => {
  // authMiddleware bundan oldin ishlagan bo'lishi kerak
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.isAdmin !== true && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden. Admin privileges required.' });
    }

    req.adminUser = user;
    next();
  } catch (err) {
    console.error('Admin Auth Error:', err);
    res.status(500).json({ message: 'Internal server error during admin verification.' });
  }
};