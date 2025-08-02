const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Complaint = require('../models/Complaint');

const router = express.Router();

// Middleware to check if user is admin
function checkAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// ✅ GET /admin/all-users — Get all users (excluding passwords)
router.get('/all-users', checkAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET /admin/user/:id — Get a specific user
router.get('/user/:id', checkAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST /admin/create-member — Register a new member
router.post('/create-member', checkAdmin, async (req, res) => {
  const { name, email, password, planName, planStart, planEnd } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashed,
      role: 'member',
      joinDate: planStart,
      plan: {
        name: planName,
        start: planStart,
        end: planEnd
      },
      attendance: []
    });

    await newUser.save();
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ PUT /admin/update-member/:id — Update member data
router.put('/update-member/:id', checkAdmin, async (req, res) => {
  const { name, email, planName, planStart, planEnd, feesPaid } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        feesPaid,
        plan: {
          name: planName,
          start: planStart,
          end: planEnd
        }
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE /admin/delete-member/:id — Delete a member
router.delete('/delete-member/:id', checkAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/complaints', checkAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate({ path: 'user', select: 'name email' })
      .lean();

    res.json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ message: 'Server error while fetching complaints' });
  }
});
router.delete('/complaints/:id', checkAdmin, async (req, res) => {
  try {
    const deleted = await Complaint.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;