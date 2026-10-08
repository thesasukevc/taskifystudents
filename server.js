require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();

// DB Connection
connectDB();

// Middleware
app.use(helmet({ contentSecurityPolicy: false })); // Allow inline styles for the SPA demo
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin');

// Routes
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all route to serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ SERVER ERROR:', err);
  console.error('Stack Trace:', err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
