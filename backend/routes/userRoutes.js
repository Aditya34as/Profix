const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/users/register — Customer signup
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists' });
    }

    // Cross-collection check — prevent same email for customer + business
    const existingShop = await Shop.findOne({ email });
    if (existingShop) {
      return res.status(400).json({ success: false, error: 'This email is already registered as a business account. Please use a different email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      phone: (phone || '').trim(),
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: userObj,
      role: 'customer',
    });
  } catch (error) {
    console.error('User registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists' });
    }
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});

// POST /api/users/login — Customer login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      token,
      user: userObj,
      role: 'customer',
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// GET /api/users/me — Get logged-in customer profile
router.get('/me', async (req, res) => {
  try {
    // Extract token manually (same logic as protect middleware)
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'customer') {
      return res.status(403).json({ success: false, error: 'Not a customer account' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user, role: 'customer' });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Not authorized' });
  }
});

module.exports = router;
