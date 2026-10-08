require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const username = process.argv[2];
if (!username) {
  console.log('Foydalanish: node makeAdmin.js <username>');
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOneAndUpdate(
    { username },
    { role: 'admin', isAdmin: true },
    { new: true }
  );
  console.log(user ? `✅ ${username} endi admin` : '❌ Bunday foydalanuvchi topilmadi');
  process.exit(0);
})();