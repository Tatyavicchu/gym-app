const express = require('express');
const jwt = require('jsonwebtoken');
const Complaint = require('../models/Complaint');

const router = express.Router();

// Middleware to check if user is authenticated
function checkAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// ✅ POST /api/complaints — Submit a complaint
router.post('/', checkAuth, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });

  try {
    const complaint = new Complaint({
      user: req.user.id,
      message
    });
    await complaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
