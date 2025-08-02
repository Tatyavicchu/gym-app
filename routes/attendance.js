const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/authMiddleware'); // Make sure this matches your auth middleware file

// Constant QR Code — does not change daily
const FIXED_QR_CODE = 'GYM2025-QR-CODE';

/**
 * @route   POST /api/attendance/mark
 * @desc    Mark attendance using fixed QR code
 * @access  Private (member/trainer/admin)
 */
router.post('/mark', protect, async (req, res) => {
  const { code } = req.body;

  if (!code || code !== FIXED_QR_CODE) {
    return res.status(400).json({ error: 'Invalid or missing QR Code' });
  }

  const today = new Date().toISOString().split('T')[0];
  const userId = req.user._id;

  try {
    // Check if attendance is already marked today
    const existingAttendance = await Attendance.findOne({ user: userId, date: today });

    if (existingAttendance) {
      return res.status(200).json({ message: 'Attendance already marked for today' });
    }

    // Mark new attendance
    const newAttendance = new Attendance({
      user: userId,
      date: today,
      time: new Date(),
    });

    await newAttendance.save();

    res.status(201).json({ message: 'Attendance marked successfully' });
  } catch (err) {
    console.error('Error marking attendance:', err.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

/**
 * @route   GET /api/attendance
 * @desc    Get all attendance records for the logged-in user
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) {
    console.error('Error fetching attendance:', err.message);
    res.status(500).json({ message: 'Failed to fetch attendance records' });
  }
});

module.exports = router;
