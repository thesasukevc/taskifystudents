const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authMiddleware = require('../middleware/auth');
const authCtrl = require('../controllers/authController');
const quizCtrl = require('../controllers/quizController');
const leadCtrl = require('../controllers/leaderboardController');
const aiCtrl = require('../controllers/aiController');
const shopCtrl = require('../controllers/shopController');
const userCtrl = require('../controllers/userController');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
});

router.use(apiLimiter);

// Auth - No protect middleware here
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);

// Protected Routes - Using the verified middleware from /middleware/auth.js
router.get('/subjects', authMiddleware, quizCtrl.getSubjects);
router.post('/quiz/verify', authMiddleware, quizCtrl.verifyAnswer);
router.get('/leaderboard', authMiddleware, leadCtrl.getLeaderboard);
router.post('/ai/ask', authMiddleware, aiCtrl.askMentor);
router.post('/shop/buy', authMiddleware, shopCtrl.buyItem);
router.post('/auth/change-password', authMiddleware, authCtrl.changePassword);
router.get('/user/profile', authMiddleware, userCtrl.getProfile);

module.exports = router;
