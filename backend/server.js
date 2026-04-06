const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend server running on port ${PORT}`));
