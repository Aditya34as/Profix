const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Shop = require('../models/Shop');
const User = require('../models/User');
const { JWT_SECRET, protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/register — Register a new shop
router.post('/register', async (req, res) => {
  try {
    const {
      businessName, ownerName, email, password, phone, whatsappNumber,
      services, address, longitude, latitude, description, openingHours
    } = req.body;

    // Validation
    if (!businessName || !ownerName || !email || !password || !phone) {
      return res.status(400).json({ success: false, error: 'Please fill all required fields' });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address' });
    }

    if (!services || services.length === 0) {
      return res.status(400).json({ success: false, error: 'Please select at least one service' });
    }

    // Check both collections in parallel for speed
    const [existing, existingUser] = await Promise.all([
      Shop.findOne({ email }).lean(),
      User.findOne({ email }).lean(),
    ]);
    if (existing) {
      return res.status(400).json({ success: false, error: 'A shop with this email already exists' });
    }
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'This email is already registered as a customer account. Please use a different email.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    const lng = longitude != null && longitude !== '' ? parseFloat(longitude) : NaN;
    const lat = latitude != null && latitude !== '' ? parseFloat(latitude) : NaN;
    const hasCoords = Number.isFinite(lng) && Number.isFinite(lat);

    // Create shop (map location optional — add pin later in dashboard for nearby search)
    const shop = new Shop({
      businessName,
      ownerName,
      email,
      password: hashedPassword,
      phone,
      whatsappNumber: whatsappNumber || phone,
      services,
      address: address || {},
      ...(hasCoords
        ? { location: { type: 'Point', coordinates: [lng, lat] } }
        : {}),
      description: description || '',
      openingHours: openingHours || 'Mon-Sat 8AM-8PM',
      isApproved: false // Requires admin approval
    });

    await shop.save();

    // Generate JWT
    const token = jwt.sign({ id: shop._id, role: 'shop' }, JWT_SECRET, { expiresIn: '30d' });

    // Return full shop object minus password
    const shopObj = shop.toObject();
    delete shopObj.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your shop is pending admin approval.',
      token,
      shop: shopObj
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors || {}).map((e) => e.message).join(' ');
      return res.status(400).json({ success: false, error: msg || 'Invalid registration data' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'A shop with this email already exists' });
    }
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});

// POST /api/auth/login — Login shop owner
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    const shop = await Shop.findOne({ email });
    if (!shop) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: shop._id, role: 'shop' }, JWT_SECRET, { expiresIn: '30d' });

    // Return full shop object minus password
    const shopObj = shop.toObject();
    delete shopObj.password;

    res.status(200).json({
      success: true,
      token,
      shop: shopObj
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// GET /api/auth/me — Get logged-in shop details
router.get('/me', protect, async (req, res) => {
  try {
    const shop = await Shop.findById(req.shopId).select('-password');
    if (!shop) {
      return res.status(404).json({ success: false, error: 'Shop not found' });
    }
    res.json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
