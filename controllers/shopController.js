const User = require('../models/User');

exports.buyItem = async (req, res) => {
  try {
    const { itemId, price } = req.body;
    const userId = req.user.id;

    if (!itemId || price === undefined) {
      return res.status(400).json({ message: 'Item ID and price are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.coins < price) {
      return res.status(400).json({ message: 'Insufficient coins!' });
    }

    // Check if user already owns the item
    const alreadyOwned = user.inventory.some(item => item.itemId === itemId);
    if (alreadyOwned) {
      return res.status(400).json({ message: 'You already own this item!' });
    }

    // Deduct coins and add to inventory
    user.coins -= price;
    user.inventory.push({ itemId });
    await user.save();

    res.json({
      message: `Successfully purchased ${itemId}!`,
      totalCoins: user.coins
    });
  } catch (err) {
    console.error('Shop Error:', err);
    res.status(500).json({ message: 'Shop error occurred' });
  }
};