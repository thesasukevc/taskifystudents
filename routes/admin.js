const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// --- SUBJECT MANAGEMENT ---

// Get all subjects (Admin)
router.get('/subjects', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching subjects' });
  }
});

// Create new subject (Admin)
router.post('/subjects', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ message: 'Error creating subject: ' + err.message });
  }
});

// Update subject (Admin)
router.put('/subjects/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(400).json({ message: 'Error updating subject' });
  }
});

// Delete subject (Admin)
router.delete('/subjects/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting subject' });
  }
});

// --- USER MANAGEMENT ---

// Get all users (Admin)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Moderate user (Coins/Admin status)
router.patch('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error updating user' });
  }
});

module.exports = router;
