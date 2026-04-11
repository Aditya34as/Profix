const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set. Copy .env.example to .env and add your MongoDB connection string.');
}

const Lead = require('./models/Lead');
const authRoutes = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);

// Legacy contact route (still works for direct leads)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, serviceRequested, message, shopId, latitude, longitude } = req.body;

    const leadData = { name, phone, serviceRequested, message };

    if (shopId) leadData.shopId = shopId;

    if (latitude && longitude) {
      leadData.customerLocation = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    const newLead = new Lead(leadData);
    await newLead.save();

    console.log('Received Lead:', { name, phone, serviceRequested, message, shopId });

    res.status(200).json({ success: true, message: 'Message received. We will dispatch a technician shortly!' });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Reverse geocode (for registration auto-detect; avoids browser CORS to Nominatim)
app.get('/api/geocode/reverse', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return res.status(400).json({ success: false, error: 'Valid lat and lon are required' });
    }
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    const r = await fetch(url, {
      headers: { 'User-Agent': 'ProFix-MERN/1.0 (https://github.com)' },
    });
    if (!r.ok) {
      return res.status(502).json({ success: false, error: 'Geocoding service unavailable' });
    }
    const data = await r.json();
    const a = data.address || {};
    const street = [a.house_number, a.road].filter(Boolean).join(' ').trim()
      || [a.neighbourhood, a.suburb].filter(Boolean).join(', ') || '';
    const city = a.city || a.town || a.village || a.municipality || a.suburb || '';
    const state = a.state || '';
    const pincode = a.postcode || '';
    res.json({
      success: true,
      latitude: lat,
      longitude: lon,
      address: { street, city, state, pincode },
    });
  } catch (err) {
    console.error('Geocode error:', err);
    res.status(500).json({ success: false, error: 'Reverse geocode failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend server running on port ${PORT}`));
